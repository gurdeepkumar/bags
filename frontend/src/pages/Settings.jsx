import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { toast, Toaster } from "react-hot-toast";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const updateFormik = useFormik({
    initialValues: {
      email: user?.email || "",
      old_password: "",
      new_password: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      old_password: Yup.string().required("Old password is required"),
      new_password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .matches(/[a-zA-Z]/, "Must contain letters")
        .matches(/\d/, "Must contain numbers")
        .required("New password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.put("/usr/update-password", values);
        toast.success("Password updated successfully.");
        setSubmitting(false);
        // Optionally clear passwords after success
        updateFormik.resetForm({ values: { ...values, old_password: "", new_password: "" } });
      } catch (err) {
        const detail = err.response?.data?.detail || "Update failed";
        toast.error(detail);
        setSubmitting(false);
      }
    },
  });

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Password is required to confirm account deletion.");
      return;
    }

    try {
      await api.delete(
        "/usr",
        {
          data: {
            email: user?.email,
            password: deletePassword,
          },
          withCredentials: true,
        }
      );
      logout();
      navigate("/login");
    } catch (err) {
      const detail = err.response?.data?.detail || "Delete failed";
      toast.error(detail);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center text-amber-50 px-4 py-8">
      <Toaster position="top-center" />
      <div className="bg-neutral-800 p-8 rounded shadow-md w-full max-w-md space-y-8">
        <h2 className="text-2xl text-amber-200 font-bold text-center">Olá, {user?.username || user?.email}</h2>

        {/* Update Password Form */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Update Password</h3>
          <form onSubmit={updateFormik.handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={updateFormik.values.email}
              disabled
              onChange={updateFormik.handleChange}
              onBlur={updateFormik.handleBlur}
              className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
            />
            {updateFormik.touched.email && updateFormik.errors.email && (
              <p className="text-red-400 text-sm mt-1">{updateFormik.errors.email}</p>
            )}

            <input
              name="old_password"
              type="password"
              placeholder="Old Password"
              value={updateFormik.values.old_password}
              onChange={updateFormik.handleChange}
              onBlur={updateFormik.handleBlur}
              className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
            />
            {updateFormik.touched.old_password && updateFormik.errors.old_password && (
              <p className="text-red-400 text-sm mt-1">{updateFormik.errors.old_password}</p>
            )}

            <input
              name="new_password"
              type="password"
              placeholder="New Password"
              value={updateFormik.values.new_password}
              onChange={updateFormik.handleChange}
              onBlur={updateFormik.handleBlur}
              className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded focus:outline-none focus:ring focus:border-amber-400"
            />
            {updateFormik.touched.new_password && updateFormik.errors.new_password && (
              <p className="text-red-400 text-sm mt-1">{updateFormik.errors.new_password}</p>
            )}

            <button
              type="submit"
              disabled={updateFormik.isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              {updateFormik.isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </section>

        {/* Delete Account */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
          <input
            type="password"
            placeholder="Enter password to confirm"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-700 bg-neutral-900 text-amber-50 rounded mb-4 focus:outline-none focus:ring focus:border-amber-400"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={!deletePassword}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;
