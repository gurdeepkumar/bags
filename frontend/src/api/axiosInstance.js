import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/auth";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.request.use(
  async (config) => {
    const path = config.url?.replace(/^https?:\/\/[^/]+/, ""); // remove base URL
    const isAuthEndpoint = ["/usr/login", "/usr/register", "/usr/refresh-token"].includes(path);
    if (isAuthEndpoint) return config;

    let token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/usr/refresh-token",
            {},
            { withCredentials: true }
          );
          const newToken = res.data.access_token;
          setAccessToken(newToken);
          processQueue(null, newToken);
          token = newToken;
        } catch (err) {
          processQueue(err, null);
          clearAccessToken();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
