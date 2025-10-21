import React, { useState, useEffect } from 'react';
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
  const { 
    login, 
    googleLogin,
    isLoading, 
    isAuthenticated,
    isEmailVerified,
    resendVerification 
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Handle auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      if (!isEmailVerified) {
        // Show verification required message
        toast.error(t("login.errors.verificationRequired"), {
          id: 'verify-email',
          duration: 5000,
          action: {
            label: t("login.resendVerification"),
            onClick: () => handleResendVerification()
          }
        });
      } else {
        // Redirect to intended destination
        const target = from === '/' ? '/trending-spots' : from;
        navigate(target, { replace: true });
      }
    }
  }, [isAuthenticated, isEmailVerified, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    setError('');
  };

  const handleResendVerification = async () => {
    const result = await resendVerification();
    if (result.success) {
      toast.success(t("login.verificationSent"));
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setError(t("login.errors.emptyEmail"));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("login.errors.invalidEmail"));
      return false;
    }
    if (!formData.password) {
      setError(t("login.errors.emptyPassword"));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t("login.errors.passwordTooShort"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);

    if (!result.success) {
      if (result.requiresVerification) {
        // Show resend verification option
        toast.error(t("login.errors.verificationRequired"), {
          id: 'verify-email',
          duration: 5000,
          action: {
            label: t("login.resendVerification"),
            onClick: () => handleResendVerification()
          }
        });
      } else {
        setError(result.error || t("login.errors.invalidCredentials"));
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className={`pt-24 min-h-screen  flex items-center justify-center p-4 ${
          isDarkMode
            ? "bg-gradient-to-br from-black to-pink-900"
            : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300"
        }`}
      >
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 mt-4">
           <h1
           className="text-3xl font-bold mb-2 bg-clip-text text-transparent"
           style={{
           backgroundImage: 'linear-gradient(45deg, #ec4899 0%,  #9c4a7dff  50%, #fb923c 100%)',
       }}
      >
          {t("login.title")}
          </h1>
            <p className="text-gray-500 font-medium">{t("login.subtitle")}</p>
          </div>

          {/* Login Form */}
        <div
        className={`rounded-2xl p-8 mb-8 border shadow-md transition-all duration-300
        ${isDarkMode 
                    ? "bg-gray-900/40 backdrop-blur-lg border-white/20 text-white" 
                    : "bg-white border-black/10 text-black"
          }`}
       >

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    }
                        placeholder:text-gray-400 rounded-lg text-gray-700  focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    placeholder={t("login.emailPlaceholder")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    } rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    placeholder={t("login.passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer"
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
              className="w-full text-white py-3 px-6 rounded-lg font-semibold 
                         transition-all duration-300 ease-in-out 
                         flex items-center justify-center gap-2 
                         disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
               style={{
               background: 'linear-gradient(45deg, #ec4899, #d946ef, #8b5cf6, #38bdf8)',
               backgroundSize: '200% 200%',
               backgroundPosition: 'left center',
                      }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = 'right center'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = 'left center'}
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
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    }`}
                  ></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/60 text-white">
                    {t("login.orContinue")}
                  </span>
                </div>
              </div>

              {/* Google */}
            <GoogleLoginButton
  onSuccess={async (response) => {
    const result = await googleLogin(response.credential);
    if (result.success) {
      const target = from === '/' ? '/trending-spots' : from;
      navigate(target, { replace: true });
    }
  }}
  onError={() => {
    toast.error(t("login.errors.googleLoginFailed"));
  }}
  buttonText={t("signup.googleSignUp")}
  className={`w-full rounded-xl backdrop-blur-md border border-blue-200/30 shadow-md transition-all duration-300 ${
    isDarkMode ? '' : 'bg-blue-100/30 text-blue-900'
  }`}
  style={!isDarkMode ? {
    background: 'rgba(173, 216, 230, 0.25)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(173, 216, 230, 0.3)',
  } : {}}
/>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                {t("login.noAccount")}{" "}
                <Link
                  to="/signup"
                  className="text-pink-400 hover:text-pink-500 font-medium"
                >
                  {t("login.signupHere")}
                </Link>
              </p>
            </div>
            <div className="mt-2 text-center">
              <p className="text-gray-700">
                {t("login.forgotPassword")}{" "}
                <Link
                  to="/forgot-password"
                  className="text-pink-400 hover:text-pink-500 font-medium"
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
