import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Password validation function
  const validatePassword = (pwd) => {
    const lengthCheck = pwd.length >= 8;
    const numberCheck = /\d/.test(pwd);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!lengthCheck) {
      return "Password must be at least 8 characters.";
    }
    if (!numberCheck) {
      return "Password must include at least one number.";
    }
    if (!specialCharCheck) {
      return "Password must include at least one special character.";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can connect to API or backend here
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked - integrate OAuth here.");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left: Background image only for large screens */}
      <div className="hidden lg:block lg:w-2/3 relative">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1695045038427-3acc1c0df23c?w=1600&auto=format&fit=crop&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/0 via-black/40 to-black"></div>
      </div>

      {/* Right: Login form on all screen sizes */}
      <div className="w-full h-screen lg:w-1/3 bg-black flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm transition-all duration-300">
          <h2 className="text-3xl font-semibold text-pink-500 dark:text-pink-400 mb-6 text-center transition-colors duration-300">
            Welcome
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                          placeholder-gray-500 dark:placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 
                          focus:border-transparent transition-all duration-300 
                          hover:bg-gray-50 dark:hover:bg-gray-600"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                          placeholder-gray-500 dark:placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 
                          focus:border-transparent transition-all duration-300 
                          hover:bg-gray-50 dark:hover:bg-gray-600"
              />
            </div>

            {/* Password Field */}
            <div className="mb-1">
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                          placeholder-gray-500 dark:placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 
                          focus:border-transparent transition-all duration-300 
                          hover:bg-gray-50 dark:hover:bg-gray-600"
              />
            </div>

            {/* Password Error or Success */}
            {password && (
              <p
                className={`text-sm mt-1 transition-colors duration-300 ${
                  passwordError 
                    ? "text-red-500 dark:text-red-400" 
                    : "text-green-500 dark:text-green-400"
                }`}
              >
                {passwordError || "Password looks good!"}
              </p>
            )}

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                        hover:bg-gray-50 dark:hover:bg-gray-600 
                        focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 
                        focus:border-transparent transition-all duration-300 
                        transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm font-medium">
                Login with Google
              </span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-pink-500 dark:bg-pink-600 text-white py-3 rounded-lg 
                        hover:bg-pink-600 dark:hover:bg-pink-700 
                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              disabled={!!passwordError}
            >
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Have an account?{" "}
            <span
              className="text-pink-500 dark:text-pink-400 cursor-pointer hover:underline 
                        hover:text-pink-600 dark:hover:text-pink-300 transition-colors duration-300"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}