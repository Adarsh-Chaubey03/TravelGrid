import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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

    // Simulate API call
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
      <footer className="relative bg-gradient-to-br from-black to-pink-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Company Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
                    TravelGrid
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Discover amazing destinations and create unforgettable
                  memories with our curated travel experiences around the world.
                  Your journey starts here.
                </p>

                {/* Social Media Links */}
                <div className="flex space-x-12 max-w-xs">

                  {/* Twitter/X */}
                  <a
                    href="#"
                    className="w-11 h-11 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="w-5 h-5"
                    >
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                    </svg>
                  </a>

                  {/* Pinterest */}
                  <a
                    href="#"
                    className="w-11 h-11 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                  </a>

                  {/* Youtube */}
                  <a
                    href="#"
                    className="w-11 h-11 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                 <a
  href="/contributors"
  className="w-11 h-11 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
>
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4
             v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
</a>

                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6 text-center md:text-left">
                <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                  Quick Links
                </h4>
                <nav className="flex flex-col space-y-3">
                  <Link
                    to="/"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/trips"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    Trips
                  </Link>
                  <Link
                    to="/destinations"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    Destinations
                  </Link>
                  <Link
                    to="/hotels"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    Hotels
                  </Link>
                  <Link
                    to="/forum"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    Forums
                  </Link>
                  <Link
                    to="/feedback"
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-pink-300 transition-all duration-300 text-sm flex items-center justify-center md:justify-start group"
                  >
                    Feedback
                  </Link>
                </nav>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 text-center md:text-left">
                <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                  Contact Info
                </h4>
                <div className="space-y-6">
                  <div className="flex flex-col items-center md:items-start space-y-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0" style={{minWidth: '32px', width: '32px', height: '32px'}}>
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-gray-300 text-sm">123 Travel Street</p>
                      <p className="text-gray-300 text-sm">
                        Adventure City, AC 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start space-y-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0" style={{minWidth: '32px', width: '32px', height: '32px'}}>
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
                    <div className="text-center md:text-left">
                      <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                      <p className="text-gray-300 text-sm">Mon-Fri 9AM-6PM</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-start space-y-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0" style={{minWidth: '32px', width: '32px', height: '32px'}}>
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
                    <div className="text-center md:text-left">
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
              <div className="space-y-6 text-center md:text-left">
                <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
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
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white 
                          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                          text-sm transition-all duration-300 hover:bg-gray-700"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
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
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 
                               text-white py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium 
                               transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer
                               flex items-center justify-center space-x-2"
                  >
                    <span>Subscribe</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>

                <div className="text-xs text-gray-400">
                  🔒 We respect your privacy. Unsubscribe at any time.
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-gray-400 text-sm">
                    © 2025 TravelGrid. All rights reserved.
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <Link
                      to="/privacy"
                      className="text-gray-400 hover:text-pink-300 transition-colors"
                    >
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

                <div className="flex items-center space-x-2 text-gray-400 text-sm">
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
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div
            className={`
            max-w-sm w-full bg-white rounded-lg shadow-xl border-l-4 p-4 flex items-center space-x-3
            ${toast.type === "success" ? "border-green-500" : "border-red-500"}
          `}
          >
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
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
              ) : (
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
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  toast.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={hideToast}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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