import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, getAccessToken, clearAccessToken } from "./auth";
import api from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ username: "", email: "" });

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
    await fetchUser();
  };

  const logout = async () => {
    try {
      await api.post("/usr/logout", {}, { withCredentials: true });
    } catch (e) {
      // Optional: handle logout failure
    }
    clearAccessToken();
    setUser({ username: "", email: "" });
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post("/usr/refresh-token", {}, { withCredentials: true });
        setAccessToken(res.data.access_token);
        await fetchUser();
      } catch {
        clearAccessToken();
        setUser({ username: "", email: "" });
      }
    };
    tryRefresh(); // Attempt silent refresh on first load
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
