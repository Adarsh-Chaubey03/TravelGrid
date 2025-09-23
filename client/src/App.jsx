import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { DashboardDataProvider } from "./context/DashboardDataContext";
import { MapProvider } from "./context/MapContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { useTheme } from "./context/ThemeContext";
import { useSEO, usePageSEO } from "./hooks/useSEO";
import { initSmoothScrolling } from "./utils/smoothScroll";

import Navbar from "./components/Custom/Navbar";
import Footer from "./components/Custom/Footer";
import Spinner from "./components/Spinner";
import ErrorBoundary from "./components/ErrorHandle/ErrorBoundary";
import GoToTopButton from "./components/GoToTopButton";
import FeedbackButton from "./components/FeedbackButton";
import Chatbot from "./components/Chatbot";
import EmailVerificationBanner from "./components/Auth/EmailVerificationBanner";
import FluidCursor from "./components/FluidCursor";
import ScrollProgress from "./components/ScrollProgress";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  
  // Get page-specific SEO configuration
  const pageSEOConfig = usePageSEO();
  
  // Apply SEO configuration
  useSEO(pageSEOConfig);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location]);

  // Initialize smooth scrolling
  useEffect(() => {
    const cleanup = initSmoothScrolling();
    return cleanup;
  }, []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <AppProvider>
          <DashboardDataProvider>
            <MapProvider>
              <div
                className={`flex flex-col min-h-screen transition-all duration-300 ultra-smooth-scroll ${
                  isDarkMode
                    ? "bg-gradient-to-br from-black to-pink-900 text-white"
                    : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-black"
                }`}
              >
                {/* Cursor */}
                <FluidCursor />
                
                {/* Scroll Progress */}
                <ScrollProgress />
                
                {/* Show spinner when route changes */}
                {loading && <Spinner />}

                {/* Navbar */}
                <Navbar />

                {/* Email Verification Banner */}
                <EmailVerificationBanner />

                {/* Breadcrumb */}
                <Breadcrumbs />

                {/* Main Content */}
                <div className="flex-grow">
                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </div>

                {/* Buttons and Footer */}
                <GoToTopButton />
                <Chatbot />
                <FeedbackButton />
                <Footer />
              </div>
            </MapProvider>
          </DashboardDataProvider>
        </AppProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
