import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useAuth } from "../context/AuthContext";


export const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } =  useAuth()

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  const token = location.pathname.split("/").at(-1);

  try {
    await changePassword(password, confirmPassword, token);
  
    toast.success("Password updated successfully!");
    navigate("/login");
  } catch (error) {

    console.error("Password reset failed:", error);

    if (error) {
      toast.error(error.message)
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="text-3xl font-bold text-pink-400 tracking-tight">
              TravelGrid
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose New Password
          </h1>
          <p className="text-gray-300">
            Almost done. Enter your new password and you’re all set.
          </p>
        </div>

        {/* Update Password Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                New Password <sup className="text-pink-400">*</sup>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEye fontSize={22} className="text-gray-400" />
                  ) : (
                    <AiOutlineEyeInvisible
                      fontSize={22}
                      className="text-gray-400"
                    />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Confirm New Password <sup className="text-pink-400">*</sup>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEye fontSize={22} className="text-gray-400" />
                  ) : (
                    <AiOutlineEyeInvisible
                      fontSize={22}
                      className="text-gray-400"
                    />
                  )}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Reset Password
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-pink-400 hover:text-pink-300 font-medium"
            >
              <MdOutlineKeyboardBackspace /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
