import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock, CheckCheck } from "lucide-react";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // UPDATED: Corrected the API endpoint URL for the reset password request.
      const res = await axios.patch(
        `http://localhost:5000/followerApi/resetpassword/${token}`,
        {
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        }
      );
      toast.success(res.data.msg);
      navigate("/login"); // Redirect to login page after successful reset
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        error.response?.data?.msg ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCheck
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                required
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPassword;
