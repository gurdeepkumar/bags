import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { toast, Toaster } from "react-hot-toast";

function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username) {
      navigate("/");
    }
  }, [user, navigate]);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(6, "Too short")
      .max(12, "Too long")
      .matches(/^[A-Za-z]+$/, "Username must contain only alphabets")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-zA-Z]/, "Must include at least one letter")
      .matches(/\d/, "Must include at least one number")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await api.post("/usr/register", values, {
          withCredentials: true,
        });
        login(res.data.access_token);
        navigate("/");
      } catch (err) {
        const detail = err.response?.data?.detail || "Registration failed";
        toast.error(detail);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex-grow flex items-center justify-center text-amber-50 px-4">
      <Toaster position="top-center" />
      <div className="bg-neutral-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
