// imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

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
    if (!email) {
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
      <footer className={`relative text-white transition-all duration-300 ${
     isDarkMode 
          ? 'bg-gradient-to-b from-black via-zinc-800 to-zinc-800' 
          : 'bg-gradient-to-br from-gray-900  to-pink-900'
      }`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20" />

        <div className="relative z-10">
          {/* remove extra padding in footer */}
          <div className="container mx-auto px-4 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left">
              <div className="space-y-6">
  <div className="flex items-center space-x-3">
    <img
      src="/favicon.ico"
      alt="TravelGrid Logo"
      loading="lazy" 
      className="w-10 h-10"
    />
    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
      TravelGrid
    </h3>
  </div>
  <p className="text-gray-300 text-sm leading-relaxed">
    Discover amazing destinations and create unforgettable memories with our curated travel experiences around the world. Your journey starts here.
  </p>
  {/* Social Media Links */}
  <div className="flex space-x-4">
    {/* Icons like Twitter, Pinterest, YouTube, Contributors */}
  </div>
</div>


              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 text-center">
                  Quick Links
                </h4>
                <nav className="flex flex-col space-y-3 items-left">
                  {[
                    { name: "Home", path: "/" },
                    { name: "About Us", path: "/about" },
                    { name: "Trips", path: "/trips" },
                    { name: "Destinations", path: "/destinations" },
                    { name: "Hotels", path: "/hotels" },
                    { name: "Forums", path: "/forum" },
                    { name: "Feedback", path: "/feedback" },
                    { name: "Currency Converter", path: "/enhanced-currency" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={scrollToTop}
                      className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center group"
                    >
                      <span className="w-4 flex justify-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full group-hover:scale-150 transition-transform"></span>
                      </span>
                      <span className="ml-3">{link.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 text-center">
                  Contact Info
                </h4>
                <div className="space-y-4 flex flex-col justify-center items-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <a
                        href="https://www.google.com/maps?q=123+Travel+Street,+Adventure+City,+AC+12345"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 text-sm hover:underline block"
                      >
                        123 Travel Street
                        <br />
                        Adventure City, AC 12345
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                      <p className="text-gray-300 text-sm">Mon-Fri 9AM-6PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">
                        hello@travelgrid.com
                      </p>
                      <p className="text-gray-300 text-sm">
                        support@travelgrid.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 text-center">
                  Newsletter
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Subscribe to get the latest travel tips, exclusive offers, and
                  destination guides delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 border rounded-l focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm transition-all duration-300 ${
                        isDarkMode 
                          ? ' text-white placeholder-gray-400 bg-zinc-800 border-slate-600' 
                          : 'text-black placeholder-gray-700 bg-gray-50 border-gray-600'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {/* Envelope icon */}
                    </div>
                  </div>
                  <button aria-label="Search"
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-700 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-all duration-300"
                  >
                    <span>Subscribe</span>
                    {/* Send icon */}
                  </button>
                </form>
                <div className="text-xs text-gray-400">
                  🔒 We respect your privacy. Unsubscribe at any time.
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700 mt-12 py-6">
              <div className="flex flex-col md:flex-row justify-center items-center text-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <p className="text-gray-400 text-sm">
                     © {new Date().getFullYear()} TravelGrid. All rights reserved.
                  </p>
                  {/* Links stacked on mobile, inline on desktop */}
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 text-sm items-center">
                    <Link to="/privacy" className="text-gray-400 hover:text-pink-300 transition-colors">
                      Privacy Policy
                    </Link>
                    <Link
                      to="/terms"
                      className="text-gray-400 hover:text-pink-300 transition-colors"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-pink-300 transition-colors"
                    >
                      Contact
                    </Link>
                    <Link
                      to="/feedback"
                      className="text-gray-400 hover:text-pink-300 transition-colors"
                    >
                      Feedback
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center space-x-2 text-gray-400 text-sm mt-4 text-center">
                <span>Made with</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>by TravelGrid Team</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div
            className={`max-w-sm w-full rounded-lg shadow-xl border-l-4 p-4 flex items-center space-x-3 transition-all duration-300 ${isDarkMode
              ? 'bg-slate-800 text-white border-slate-600'
              : 'bg-white text-gray-900 border-gray-200'
              } ${toast.type === "success" ? "border-green-500" : "border-red-500"
              }`}>
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="..." />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="..." />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${toast.type === "success" ? "text-green-400" : "text-red-400"
                  }`}
              >
                {toast.message}
              </p>
            </div>
            <button aria-label="Search"
              onClick={hideToast}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="..." />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
