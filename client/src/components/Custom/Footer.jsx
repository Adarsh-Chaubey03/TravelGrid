import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPaperPlane,
  FaTimes,
  FaGlobeAmericas, 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      content: (
        <a
          href="https://www.google.com/maps?q=123+Travel+Street,+Adventure+City,+AC+12345"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-200 text-sm hover:text-pink-400 transition-colors block"
        >
          123 Travel Street
          <br />
          Adventure City, AC 12345
        </a>
      ),
    },
    {
      icon: FaPhoneAlt,
      content: (
        <>
          <a href="tel:+15551234567" 
             className="text-gray-200 text-sm hover:text-pink-400 transition-colors block"
          >
            +1 (555) 123-4567
          </a>
          <p className="text-gray-300 text-xs">Mon-Fri 9AM-6PM</p>
        </>
      ),
    },
    {
      icon: FaEnvelope,
      content: (
        <>
          <a
            href="mailto:hello@travelgrid.com"
            className="text-gray-200 text-sm hover:text-pink-400 transition-colors block"
          >
            hello@travelgrid.com
          </a>
          <a
            href="mailto:support@travelgrid.com"
            className="text-gray-300 text-xs hover:text-pink-400 transition-colors block"
          >
            support@travelgrid.com
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <footer
        className={`relative transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-950 via-gray-850 to-gray-950 border-t border-pink-900/60" // Kept for max contrast, as slate-900 might be too light
            : "bg-gradient-to-br from-gray-900 to-pink-900 border-t border-pink-700/50" 
        }`}
      >
        {/* Adjusted Background Gradient (Visual Guide: If the original slate-900 gradient is desired, use the commented line below. The current line provides maximum contrast.) */}
        {/* <footer className={`... ${ isDarkMode ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-pink-900/60" : "..." }`}> */}

        {isDarkMode && (
            <div className="absolute inset-0 opacity-[0.05]">
                <div className="w-96 h-96 bg-pink-500 rounded-full blur-3xl absolute bottom-0 right-1/4 transform translate-x-1/2" />
            </div>
        )}

        <div className="relative z-10">
          <div className="container mx-auto px-6 pt-16 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-left">
              
              {/* Branding and Social Media */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <img
                    src="/favicon.ico"
                    alt="TravelGrid Logo"
                    loading="lazy"
                    className="w-10 h-10 transform hover:scale-110 transition-transform"
                  />
                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-pink-300 to-pink-100 bg-clip-text text-transparent">
                    TravelGrid
                  </h3>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
                  Discover amazing destinations and create unforgettable memories with our curated travel experiences around the world.
                </p>
                
                {/* Social Media Links */}
                <div className="flex space-x-3 pt-2 items-center">
                  <a
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (formerly Twitter)"
                    className="text-white hover:text-gray-900 bg-gray-700 hover:bg-white p-2 rounded-full transition-all duration-300 text-lg shadow-md"
                  >
                    <FaXTwitter />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/adarsh-chaubey/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-white hover:text-white bg-gray-700 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 text-lg shadow-md"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://github.com/Adarsh-Chaubey03"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-white hover:text-white bg-gray-700 hover:bg-purple-500 p-2 rounded-full transition-all duration-300 text-lg shadow-md"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://instagram.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white hover:text-white bg-gray-700 hover:bg-pink-600 p-2 rounded-full transition-all duration-300 text-lg shadow-md"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="mailto:hello@travelgrid.com"
                    aria-label="Email"
                    className="text-white hover:text-white bg-gray-700 hover:bg-yellow-500 p-2 rounded-full transition-all duration-300 text-lg shadow-md"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>

              {/* Quick Links - UPDATED TO USE CIRCULAR DOTS */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white border-l-4 border-pink-500 pl-3 pb-1">
                  Quick Links
                </h4>
                <nav className="flex flex-col space-y-3">
                  {[
                    { name: "Home", path: "/" },
                    { name: "About Us", path: "/about" },
                    { name: "Trips", path: "/trips" },
                    { name: "Forums", path: "/forum" },
                    { name: "Leaderboard", path: "/leaderboard" },
                    { name: "Sitemap", path: "/sitemap" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={scrollToTop}
                      className="text-gray-200 hover:text-pink-400 transition-all duration-300 text-base flex items-center group font-medium"
                    >
                      {/* Simple Circular Dot as Bullet */}
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 flex-shrink-0 group-hover:scale-150 transition-transform duration-200"></span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white border-l-4 border-pink-500 pl-3 pb-1">
                  Contact Info
                </h4>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-pink-500/30">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>{item.content}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white border-l-4 border-pink-500 pl-3 pb-1">
                  Newsletter
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Subscribe to get the **latest travel tips**, exclusive offers, and destination guides delivered right to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'text-white placeholder-gray-400 bg-gray-800 border-pink-600/50 focus:border-pink-500'
                          : 'text-black placeholder-gray-700 bg-gray-100 border-gray-600 focus:border-pink-500'
                      }`}
                      required
                    />
                  </div>
                  <button
                    aria-label="Subscribe to newsletter"
                    type="submit"
                    className={`w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white py-3 px-6 rounded-md text-base font-medium flex items-center justify-center space-x-2 transition-all duration-500 ease-in-out shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30`}
                  >
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Subscribe Now</span>
                  </button>
                </form>
                <div className={`text-xs text-gray-300 text-center`}>
                  🔒 We respect your privacy. Unsubscribe at any time.
                </div>
              </div>
            </div>

            {/* --- */}
            {/* Bottom Section - COPYRIGHT AND POLICY LINKS - IMPROVED STRUCTURE */}
            {/* --- */}
            <div className={`border-t border-gray-800 mt-16 pt-8 pb-4 ${isDarkMode ? 'text-gray-200' : 'text-white'}`}>
              <div 
                className="flex flex-col md:flex-row justify-between items-center text-center space-y-4 md:space-y-0"
              >
                
                {/* Copyright - Positioned to the left on desktop, order-2 is necessary for mobile stack order */}
                <p className="text-sm order-2 md:order-1 text-gray-400">
                  © {new Date().getFullYear()} **TravelGrid**. All rights reserved.
                </p>

                {/* Policy Links - Positioned to the right on desktop, using gap-x for spacing */}
                <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm order-1 md:order-2 font-medium">
                  <Link to="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link>
                  <Link to="/contact" className="hover:text-pink-400 transition-colors">Contact</Link>
                  <Link to="/faq" className="hover:text-pink-400 transition-colors">FAQ</Link>
                </div>
              </div>

              {/* Made with Love - Separated from the main bottom row for better visual hierarchy */}
              <div className="flex items-center justify-center space-x-2 text-sm mt-8 text-center text-gray-200">
                <span>Crafted with</span>
                <svg
                  className="w-4 h-4 text-red-500 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>by the TravelGrid Team</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification - High Contrast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-6 duration-300">
          <div
            className={`max-w-sm w-full rounded-xl shadow-2xl border-l-4 p-4 pr-6 flex items-center space-x-3 transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-white text-gray-900 border-gray-200'
            } ${
              toast.type === "success"
                ? "border-green-500 shadow-green-900/40"
                : "border-red-500 shadow-red-900/40"
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <FaCheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <FaTimesCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-base font-semibold ${
                  toast.type === "success" ? "text-green-300" : "text-red-300"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              aria-label="Close notification"
              onClick={hideToast}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;