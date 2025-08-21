import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import GoogleLoginButton from "../components/Auth/GoogleLogin";
import Navbar from "../components/Custom/Navbar";
import Footer from "../components/Custom/Footer";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

const Signup = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { signup, isLoading } = useAuth();
  const {isDarkMode}=useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return "";
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    if (strongRegex.test(password)) return "strong";
    if (mediumRegex.test(password)) return "medium";
    return "weak";
  };

  const passwordStrength = getPasswordStrength();

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("signup.errors.fillAll"));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("signup.errors.invalidEmail"));
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      setError(t("signup.errors.invalidName"));
      return false;
    }
    if (formData.name.length < 2) {
      setError(t("signup.errors.shortName"));
      return false;
    }
    if (passwordStrength === "weak") {
      setError(t("signup.errors.weakPassword"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("signup.errors.passwordMismatch"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await signup(formData);
    if (result.success) {
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`, { replace: true });
      toast.success(t("signup.success"));
    } else {
      toast.error(result.error || t("signup.errors.signupFailed"));
    }
  };

  return (
    <div>
      <Navbar />
      <div className={`pt-24 min-h-screen flex items-center justify-center p-4 ${isDarkMode
      ? 'bg-gradient-to-br from-black to-pink-900 text-white'
      : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300'
      }`}>
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 mt-4">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">{t("signup.title")}</h1>
            <p className="text-gray-500 font-medium">{t("signup.subtitle")}</p>
          </div>

          {/* Signup Form */}
          <div className={`bg-gray-100 backdrop-blur-md rounded-2xl p-8 mb-8 border ${
              isDarkMode ? "border-white/20" : " border-black/20"
            }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">{t("signup.name")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    } rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    placeholder={t("signup.namePlaceholder")}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">{t("signup.email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    } rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    placeholder={t("signup.emailPlaceholder")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">{t("signup.password")}</label>
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
                    placeholder={t("signup.passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded ${passwordStrength === "weak" ? "bg-red-500" : passwordStrength === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                      <div className={`h-1 flex-1 rounded ${passwordStrength === "medium" ? "bg-yellow-500" : passwordStrength === "strong" ? "bg-green-500" : "bg-gray-600"}`} />
                      <div className={`h-1 flex-1 rounded ${passwordStrength === "strong" ? "bg-green-500" : "bg-gray-600"}`} />
                    </div>
                    <p className={`text-xs mt-1 ${passwordStrength === "weak" ? "text-red-500" : passwordStrength === "medium" ? "text-yellow-500" : "text-green-400"}`}>
                      {passwordStrength === "weak" && t("signup.weakPassword")}
                      {passwordStrength === "medium" && t("signup.mediumPassword")}
                      {passwordStrength === "strong" && t("signup.strongPassword")}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">{t("signup.confirmPassword")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    } rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                    placeholder={t("signup.confirmPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 text-xs">{t("signup.passwordsMatch")}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-500 text-xs">{t("signup.passwordsDontMatch")}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t("signup.creatingAccount")}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    {t("signup.createAccount")}
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                      isDarkMode ? "border-white/20 " : "border-black/20"
                    }`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/60 text-white ">{t("signup.orContinue")}</span>
                </div>
              </div>

              {/* Google */}
              <GoogleLoginButton
                onSuccess={() => navigate("/", { replace: true })}
                buttonText={t("signup.googleSignUp")}
                className="w-full"
              />
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                {t("signup.alreadyAccount")}{" "}
                <Link to="/login" className="text-pink-400 hover:text-pink-500 font-medium">
                  {t("signup.signinHere")}
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

export default Signup;
