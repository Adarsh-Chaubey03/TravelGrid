import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaLinkedin, FaGithub, FaInstagram, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Send, MapPin, Phone, Mail, Heart } from "lucide-react";

// Footer component
const Footer = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { isDarkMode } = useTheme();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    // Simulated API call
    setTimeout(() => {
      console.log("Newsletter subscription:", email);
      showToast("Successfully subscribed to our newsletter! 🎉", "success");
      setEmail("");
    }, 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer
        className={`relative transition-all duration-300 backdrop-blur-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95"
            : "bg-gradient-to-br from-gray-900/98 via-purple-900/98 to-pink-900/98"
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Brand Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="relative">
                    <img
                      src="/favicon.ico"
                      alt="TravelGrid Logo"
                      loading="lazy"
                      className="w-12 h-12 rounded-full ring-2 ring-pink-500/50 group-hover:ring-pink-500 transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-md group-hover:bg-pink-500/40 transition-all duration-300"></div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                    TravelGrid
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Discover amazing destinations and create unforgettable
                  memories with our curated travel experiences around the world.
                  Your journey starts here.
                </p>

                {/* Social Media Links */}
                <div className="flex space-x-3">
                  {[
                    {
                      icon: FaXTwitter,
                      href: "https://twitter.com/yourusername",
                      label: "X (Twitter)",
                      color: "hover:bg-gray-700",
                    },
                    {
                      icon: FaLinkedin,
                      href: "https://www.linkedin.com/in/adarsh-chaubey/",
                      label: "LinkedIn",
                      color: "hover:bg-blue-600",
                    },
                    {
                      icon: FaGithub,
                      href: "https://github.com/Adarsh-Chaubey03",
                      label: "GitHub",
                      color: "hover:bg-gray-800",
                    },
                    {
                      icon: FaInstagram,
                      href: "https://instagram.com/yourusername",
                      label: "Instagram",
                      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600",
                    },
                    {
                      icon: FaEnvelope,
                      href: "mailto:hello@travelgrid.com",
                      label: "Email",
                      color: "hover:bg-yellow-600",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-10 h-10 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                    >
                      <social.icon className="text-lg" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white relative inline-block">
                  Quick Links
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></span>
                </h4>
                <nav className="flex flex-col space-y-3">
                  {[
                    { name: "Home", path: "/" },
                    { name: "About Us", path: "/about" },
                    { name: "Trips", path: "/trips" },
                    { name: "Forums", path: "/forum" },
                    { name: "Leaderboard", path: "/leaderboard" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={scrollToTop}
                      className="text-gray-300 hover:text-pink-400 transition-all duration-300 text-sm flex items-center group"
                    >
                      <span className="w-6 h-6 rounded-md bg-pink-500/10 group-hover:bg-pink-500/20 flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:scale-150 transition-transform"></span>
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white relative inline-block">
                  Contact Info
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></span>
                </h4>
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-110">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a
                        href="https://www.google.com/maps?q=123+Travel+Street,+Adventure+City,+AC+12345"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 text-sm hover:text-pink-400 transition-colors block group-hover:underline"
                      >
                        123 Travel Street
                        <br />
                        Adventure City, AC 12345
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-110">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a
                        href="tel:+15551234567"
                        className="text-gray-300 text-sm hover:text-pink-400 transition-colors block"
                      >
                        +1 (555) 123-4567
                      </a>
                      <p className="text-gray-400 text-xs mt-1">
                        Mon-Fri 9AM-6PM
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-110">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <a
                        href="mailto:hello@travelgrid.com"
                        className="text-gray-300 text-sm hover:text-pink-400 transition-colors block hover:underline"
                      >
                        hello@travelgrid.com
                      </a>
                      <a
                        href="mailto:support@travelgrid.com"
                        className="text-gray-300 text-sm hover:text-pink-400 transition-colors block hover:underline"
                      >
                        support@travelgrid.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white relative inline-block">
                  Newsletter
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></span>
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Subscribe to get the latest travel tips, exclusive offers, and
                  destination guides.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm transition-all duration-300 ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-400 focus:bg-white/10"
                          : "bg-white/10 border-white/20 text-white placeholder-gray-300 focus:bg-white/20"
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:scale-105 group"
                  >
                    <span>Subscribe Now</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>We respect your privacy</span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-400">
                  <p className="flex items-center space-x-2">
                    <span>© {new Date().getFullYear()} TravelGrid.</span>
                    <span className="hidden md:inline">
                      All rights reserved.
                    </span>
                  </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                  {[
                    { name: "Privacy Policy", path: "/privacy" },
                    { name: "Terms of Service", path: "/terms" },
                    { name: "Contact", path: "/contact" },
                    { name: "Feedback", path: "/feedback" },
                  ].map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="hover:text-pink-400 transition-colors duration-300 relative group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Made with Love */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 mt-6">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span>by</span>
                <span className="font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  TravelGrid Team
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`max-w-sm w-full rounded-xl shadow-2xl p-4 flex items-start space-x-3 transition-all duration-300 backdrop-blur-xl border ${
              isDarkMode
                ? "bg-slate-800/95 text-white border-slate-700"
                : "bg-white/95 text-gray-900 border-gray-200"
            } ${
              toast.type === "success"
                ? "border-l-4 border-l-green-500"
                : "border-l-4 border-l-red-500"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">
                {toast.type === "success" ? "Success!" : "Error!"}
              </p>
              <p className="text-sm text-gray-500">{toast.message}</p>
            </div>
            <button
              onClick={hideToast}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 p-1"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;