import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import GoogleLoginButton from '../components/Auth/GoogleLogin';
import Navbar from "../components/Custom/Navbar";
import Footer from "../components/Custom/Footer";
import LanguageSelector from "../components/LanguageSelector";
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
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
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
        className={`pt-24 min-h-screen flex items-center justify-center p-4 ${isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white"
            : "bg-gradient-to-br from-rose-200 via-blue-200 to-gray-100"
          }`}
      >
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1
              className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
            >
              {t("login.title")}
            </h1>
            <p
              className={`text-base md:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              {t("login.subtitle")}
            </p>
          </div>

          {/* Login Form */}
          <div
            className={`bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-xl p-8 mb-8 shadow-lg border ${isDarkMode ? "border-white/20" : "border-black/20"
              }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm">{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border ${isDarkMode ? "border-white/20" : "border-gray-300"
                      } rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
                    placeholder={t("login.emailPlaceholder")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border ${isDarkMode ? "border-white/20" : "border-gray-300"
                      } rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
                    placeholder={t("login.passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="
            w-full 
            bg-gradient-to-r from-pink-600 to-pink-500 
            hover:from-pink-500 hover:to-pink-600 
            text-white py-3 px-6 rounded-md font-semibold 
            transition-all duration-300 ease-in-out 
            flex items-center justify-center gap-2 
            cursor-pointer 
            shadow-md 
            hover:shadow-xl 
          "
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${isDarkMode ? "border-white/20" : "border-gray-300"
                      }`}
                  ></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={`px-2 ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-600"
                      }`}
                  >
                    {t("login.orContinue")}
                  </span>
                </div>
              </div>

              {/* Google */}
              <GoogleLoginButton
                onSuccess={() => navigate(from, { replace: true })}
                buttonText={t("login.googleSignIn")}
                className="w-full rounded-xl shadow-md hover:shadow-lg transition"
              />
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {t("login.noAccount")}{" "}
                <Link
                  to="/signup"
                  className="text-pink-500 hover:text-pink-800 font-medium transition"
                >
                  {t("login.signupHere")}
                </Link>
              </p>
            </div>
            <div className="mt-2 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {t("login.forgotPassword")}{" "}
                <Link
                  to="/forgot-password"
                  className="text-pink-500 hover:text-pink-800 font-medium transition"
                >
                  {t("login.clickHere")}
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
