import { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("auth/password-reset/", { email });
      toast.success(res?.data?.message || "✅ OTP sent to your email!");
      setIsOTPSent(true);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "❌ Failed to send OTP. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("auth/password-reset-confirm/", {
        email,
        otp,
        password,
      });
      toast.success(
        res?.data?.message || "Password reset successful! Redirecting..."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        "Invalid or expired OTP. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <motion.form
        onSubmit={isOTPSent ? handleResetPassword : handleSendOTP}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          {isOTPSent ? "Reset Your Password" : "Forgot Password"}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {isOTPSent
            ? "Enter the OTP sent to your email and set a new password."
            : "Enter your email and we’ll send you a one-time password (OTP)."}
        </p>

        <AnimatePresence mode="wait">
          {!isOTPSent ? (
            <motion.div
              key="email-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </motion.div>
          ) : (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 bg-gray-100 cursor-not-allowed"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium shadow-md transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Processing..."
            : isOTPSent
            ? "Reset Password"
            : "Send OTP"}
        </button>

        {isOTPSent && (
          <button
            type="button"
            onClick={() => setIsOTPSent(false)}
            className="w-full text-sm text-blue-600 mt-4 hover:underline"
          >
            ← Back to Email Step
          </button>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
