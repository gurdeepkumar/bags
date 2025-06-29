import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/usr/login",
        form,
        { withCredentials: true }
      );
      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Login failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center text-amber-50 px-4">
      <Toaster position="top-center" />
      <div className="bg-neutral-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
          />
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
