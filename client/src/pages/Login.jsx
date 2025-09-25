
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import GoogleLoginButton from "../components/Auth/GoogleLogin";
import axios from "axios";
import Navbar from "@/components/Custom/Navbar";
import Footer from "@/components/Custom/Footer";

const Login = () => {
  const location = useLocation();

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


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    await axios
      .post("http://localhost:5000/user/login", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Loggedin Successfully");
          navigate(from, { replace: true });
          setTimeout(() => {
            // window.location.reload();
            localStorage.setItem("Users", JSON.stringify(res.data.user));
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
          setTimeout(() => {}, 2000);
        }
      });

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

      <div className="pt-24 min-h-screen bg-gradient-to-br from-black to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">
              Sign in to your account to continue your journey
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Server Error */}
              {serverError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300 text-sm">
                  {serverError}

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
            <h1 className="text-3xl font-bold text-gray-700 mb-2">
              {t("login.title")}
            </h1>
            <p className="text-gray-500 font-medium">{t("login.subtitle")}</p>
          </div>

          {/* Login Form */}
          <div
            className={`bg-gray-100 backdrop-blur-md rounded-2xl p-8 mb-8 border ${
              isDarkMode ? "border-white/20" : " border-black/20"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-sm">{error}</span>

                </div>
              )}

              {/* Email Field */}
              <div>

                <label className="block text-white font-medium mb-2">

                <label className="block text-gray-700 font-medium mb-2">
                  {t("login.email")}

                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input

                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    {...register("email", { required: "Email is required" })}

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
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>

                <label className="block text-white font-medium mb-2">
                  Password

                <label className="block text-gray-700 font-medium mb-2">
                  {t("login.password")}

                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}

                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    {...register("password", { required: "Password is required" })}

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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-5 h-5" /> Sign In
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/50 text-gray-300">
                    Or continue with
                  </span>
                </div>
              </div>


              {/* Google Sign-In Button */}
              <GoogleLoginButton
                onSuccess={() => navigate("/", { replace: true })}
                buttonText="Continue with Google"

              {/* Google */}
              <GoogleLoginButton 
                onSuccess={() => navigate(from, { replace: true })}
                buttonText={t("login.googleSignIn")}
                className="w-full rounded-full"

              />
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center">

              <p className="text-gray-300">
                Don't have an account?{" "}

              <p className="text-gray-700">
                {t("login.noAccount")}{" "}

                <Link
                  to="/signup"
                  className="text-pink-400 hover:text-pink-300 font-medium"
                >

                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-2 text-center">
              <p className="text-gray-300">
                Forgot Password?{" "}

                  {t("login.signupHere")}
                </Link>
              </p>
            </div>
            <div className="mt-2 text-center">
              <p className="text-gray-700">
                {t("login.forgotPassword")}{" "}

                <Link
                  to="/forgot-password"
                  className="text-pink-400 hover:text-pink-300 font-medium"
                >

                  Click Here

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
