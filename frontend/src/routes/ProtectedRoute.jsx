// src/routes/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user.username ? children : <Navigate to="/login" replace />;
}

export function GuestRoute({ children }) {
  const { user } = useAuth();
  return user.username ? <Navigate to="/settings" replace /> : children;
}
