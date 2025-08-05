import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // NEW: Handle Google OAuth token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const role = urlParams.get("role");

    if (token) {
      // Assuming you have a way to get user data from the token or store it
      // For now, let's assume the user data is handled by the backend
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "user") {
        navigate("/client-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/followerApi/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        const userData = res.data.loginUser;

        if (userData.isBanned) {
          toast.error("Your account is banned. Please contact support.");
          setIsLoading(false);
          return;
        }

        onLogin(userData);
        toast.success("Login successful!");

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "user") {
          navigate("/client-dashboard");
        } else {
          navigate("/");
        }
      } else {
        await axios.post("http://localhost:5000/followerApi/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isBanned: false,
        });

        toast.success("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATED: 'forgotpassword' API endpoint typo corrected.
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetEmailSent(false);

    try {
      await axios.post("http://localhost:5000/followerApi/forgotpassword", {
        email: formData.email,
      });
      setResetEmailSent(true);
      toast.info(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Function to handle Google Login redirection
  const handleGoogleLogin = () => {
    // Redirect the user to the backend Google OAuth route
    window.location.href = "http://localhost:5000/followerApi/auth/google";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "#212121",
      }} /* Dark background for the whole page */
    >
      <div
        className="w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex"
        style={{ backgroundColor: "#333333" }}
      >
        {" "}
        {/* Main container with a dark grey background */}
        {/* Left Section (Form) */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {showForgotPassword
                ? resetEmailSent
                  ? "Password Reset Email Sent"
                  : "Forgot Password"
                : isLogin
                ? "Login"
                : "Sign Up"}
            </h2>
            <p className="text-gray-400 mb-6">
              {showForgotPassword
                ? resetEmailSent
                  ? "Check your email for the reset link."
                  : "Enter your email to reset your password."
                : isLogin
                ? "If you already a member, easily log in now."
                : "Join us and start your journey!"}
            </p>
            {/* Conditional rendering for Forgot Password form */}
            {showForgotPassword ? (
              resetEmailSent ? (
                <div>
                  <p className="text-gray-300">
                    If an account with {formData.email} exists, a password reset
                    link has been sent to your email. Please check your inbox
                    (and spam folder).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setIsLogin(true);
                      setResetEmailSent(false);
                      setFormData({ ...formData, email: "" });
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 mt-6 transition duration-300"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-2 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setIsLogin(true);
                      setFormData({ ...formData, email: "" });
                    }}
                    className="w-full text-purple-400 mt-4"
                  >
                    Back to Sign In
                  </button>
                </form>
              )
            ) : (
              // Conditional rendering for Login/Sign Up form
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-2 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-2 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                {isLogin ? (
                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-purple-400 hover:text-purple-300 transition duration-300"
                    >
                      Forgot Password?
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mr-2 accent-purple-600"
                    />
                    <label htmlFor="terms" className="text-gray-400">
                      I agree to the{" "}
                      <a href="#" className="text-purple-400">
                        Terms of Service
                      </a>
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>
            )}
            <div className="mt-6 text-center text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-purple-400 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
            {/* NEW: Google Login button */}
            {isLogin && !showForgotPassword && (
              <div className="mt-6">
                <div className="relative flex items-center justify-center my-4">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="flex-shrink mx-4 text-gray-400">OR</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                  disabled={isLoading}
                >
                  <img
                    src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}
          </div>
          {/* Copyright Section */}
          <div className="mt-auto text-sm text-center text-gray-500">
            &copy; 2024 FollowersCart. All rights reserved.
          </div>
        </div>
        {/* Right Section (Image/Branding) */}
        <div className="hidden md:flex md:w-1/2 bg-purple-600 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center"
          >
            <h3 className="text-4xl font-bold mb-4">Welcome Back!</h3>
            <p className="text-lg">
              To keep connected with us please login with your personal info
            </p>
          </motion.div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

export default Login;
