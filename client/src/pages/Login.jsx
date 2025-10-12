import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import GoogleLoginButton from '../components/Auth/GoogleLogin';
import Navbar from "../components/Custom/Navbar";
import Footer from "../components/Custom/Footer";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError(t("login.errors.emptyEmail"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("login.errors.invalidEmail"));
      return;
    }
    if (!formData.password) {
      setError(t("login.errors.emptyPassword"));
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success(t("login.success") || "Login successful!");
      navigate(from, { replace: true });
    } else {
      if (result.error && result.error.toLowerCase().includes('verify')) {
        setError(t("login.errors.verifyEmail"));
        setTimeout(() => {
          if (window.confirm(t("login.actions.resendConfirm"))) {
            navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
          }
        }, 2000);
      } else {
        setError(result.error || t("login.errors.invalidCredentials"));
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className={`pt-24 min-h-screen flex items-center justify-center p-4 ${
          isDarkMode
            ? "bg-gradient-to-br from-black to-pink-900"
            : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300"
        }`}
      >
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              {t("login.title")}
            </h1>
            <p className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {t("login.subtitle")}
            </p>
          </div>

          {/* Login Card - Transparent */}
          <div
            className={`backdrop-blur-md rounded-2xl p-8 border ${
              isDarkMode 
                ? "bg-white/10 border-white/20" 
                : "bg-white/30 border-black/10"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className={`border rounded-lg p-4 flex items-center gap-3 ${
                  isDarkMode
                    ? "bg-red-500/20 border-red-500/30"
                    : "bg-red-100/80 border-red-300"
                }`}>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? "text-red-200" : "text-red-700"
                  }`}>
                    {error}
                  </span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className={`block font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}>
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white/50 border-black/20 text-gray-800 placeholder-gray-600"
                    }`}
                    placeholder={t("login.emailPlaceholder")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`block font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}>
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white/50 border-black/20 text-gray-800 placeholder-gray-600"
                    }`}
                    placeholder={t("login.passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition ${
                      isDarkMode 
                        ? "text-gray-400 hover:text-gray-200" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium ${
                    isDarkMode 
                      ? "text-pink-400 hover:text-pink-300" 
                      : "text-pink-600 hover:text-pink-700"
                  }`}
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {t("login.signingIn")}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {t("login.signIn")}
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    isDarkMode ? "border-white/20" : "border-black/20"
                  }`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-3 ${
                    isDarkMode 
                      ? "bg-gray-900/80 text-gray-300" 
                      : "bg-white/80 text-gray-600"
                  } rounded-full`}>
                    {t("login.orContinue")}
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <GoogleLoginButton 
                onSuccess={() => {
                  toast.success(t("login.success") || "Login successful!");
                  navigate(from, { replace: true });
                }}
                buttonText={t("login.googleSignIn")}
                className="w-full"
              />
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                {t("login.noAccount")}{" "}
                <Link
                  to="/signup"
                  className={`font-medium ${
                    isDarkMode 
                      ? "text-pink-400 hover:text-pink-300" 
                      : "text-pink-600 hover:text-pink-700"
                  }`}
                >
                  {t("login.signupHere")}
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

export default Login;