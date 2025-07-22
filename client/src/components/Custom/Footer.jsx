import { useState, useEffect } from "react"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [toast, setToast] = useState({ show: false, message: "", type: "" })

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
  }

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" })
  }

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast()
      }, 4000) // Auto-hide after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [toast.show])

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()

    if (!email) {
      showToast("Please enter a valid email address", "error")
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Handle newsletter subscription logic here
      console.log("Newsletter subscription:", email)
      showToast("Successfully subscribed to our newsletter! 🎉", "success")
      setEmail("")
    }, 500)
  }

  return (
    <>
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 md:px-6 transition-colors duration-300">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">TravelGrid</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Discover amazing destinations and create unforgettable memories with our curated travel experiences
                around the world.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Home
                </a>
                <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  About
                </a>
                <a href="/trips" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Trips
                </a>
                <a href="/destinations" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Destinations
                </a>
                <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </nav>
            </div>

            {/* Column 3: Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Info</h4>
              <nav className="flex flex-col space-y-2">
                <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
                <a href="/support" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Support
                </a>
                <a href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </nav>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black dark:text-white">Newsletter</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Subscribe to get the latest travel tips and exclusive offers.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200
                      placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-pink-400 focus:border-transparent 
                      text-sm transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-zinc-800 dark:bg-pink-600 hover:bg-zinc-900 dark:hover:bg-pink-700 text-white py-2 px-4 rounded-md 
                      transition-all duration-300 text-sm font-medium transform hover:scale-[1.02] 
                      hover:shadow-lg active:scale-[0.98]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* /* Bottom section */}
          <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">© 2025 TravelGrid. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div
            className={`
            max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 p-4 flex items-center space-x-3
            ${toast.type === "success" ? "border-green-500" : "border-red-500"}
          `}
          >
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${toast.type === "success" ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                {toast.message}
              </p>
            </div>
            <button onClick={hideToast} className="flex-shrink-0 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors">
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
  )
}

export default Footer
