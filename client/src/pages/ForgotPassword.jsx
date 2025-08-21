import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Custom/Navbar";
import Footer from "../components/Custom/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setMessage("A password reset link has been sent to your email.");
      setEmail("");
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 flex flex-co items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="text-3xl font-bold text-pink-400 tracking-tight">
                TravelGrid
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-300">
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Forgot Password Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              {message && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-300 text-sm">
                  {message}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="text-pink-400 hover:text-pink-300 font-medium"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
