import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { router } from "@inertiajs/react";
import Layout from "../../components/Layout";

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError(
          "Invalid or expired reset link. Please request a new password reset."
        );
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.visit("/");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout title="Password Updated">
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Password Updated!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. Redirecting to
              home...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reset Password">
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Reset Your Password
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
