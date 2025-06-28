import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, getAccessToken, clearAccessToken } from "./auth";
import api from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true); // ✅ auth hydration state
  const [accessToken, updateAccessToken] = useState(getAccessToken());

  const fetchUser = async () => {
    try {
      const res = await api.get("/usr/me", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setUser({
        username: res.data.username,
        email: res.data.email,
      });
    } catch {
      clearAccessToken();
      setUser({ username: "", email: "" });
    }
  };

  const login = async (token) => {
    setAccessToken(token);
    updateAccessToken(token);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await api.post("/usr/logout", {}, { withCredentials: true });
    } catch (e) {
      // Optional: handle logout failure
    }
    clearAccessToken();
    updateAccessToken(null);
    setUser({ username: "", email: "" });
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post("/usr/refresh-token", {}, { withCredentials: true });
        const token = res.data.access_token;
        setAccessToken(token);
        updateAccessToken(token);
        await fetchUser();
      } catch {
        clearAccessToken();
        updateAccessToken(null);
        setUser({ username: "", email: "" });
      } finally {
        setLoading(false); // ✅ Done trying to refresh
      }
    };

    tryRefresh(); // Attempt silent login
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
