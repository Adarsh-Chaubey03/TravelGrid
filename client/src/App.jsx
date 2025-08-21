import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { DashboardDataProvider } from "./context/DashboardDataContext";
import { MapProvider } from "./context/MapContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/Custom/Navbar";
import Footer from "./components/Custom/Footer";
import Spinner from "./components/Spinner";
import ErrorBoundary from "./components/ErrorHandle/ErrorBoundary";
import GoToTopButton from "./components/GoToTopButton";
import FeedbackButton from "./components/FeedbackButton";
import Chatbot from "./components/Chatbot";
import EmailVerificationBanner from "./components/Auth/EmailVerificationBanner";
import FluidCursor from "./components/FluidCursor";

// ✅ Language files import
import { LanguageProvider } from "./LanguageContext";
import LanguageSelector from "./LanguageSelector";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  // Check if current route is home page
  const isHomePage = location.pathname === "/";

  // Set background class based on route
  const bgClass = isHomePage
    ? "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300" // home page light mode bg
    : "bg-white"; // other pages light bg

  return (
    <AuthProvider>
      <WishlistProvider>
        <AppProvider>
          <DashboardDataProvider>
            <MapProvider>
              {/* ✅ Wrap everything in LanguageProvider */}
              <LanguageProvider>
                <div className={`flex flex-col min-h-screen ${bgClass}`}>
                  <FluidCursor />
                  {loading && <Spinner />}
                  <Navbar />
                  <EmailVerificationBanner />

                  {/* ✅ Language Selector add karo */}
                  <div className="p-4 flex justify-end">
                    <LanguageSelector />
                  </div>

                  <div className="flex-grow">
                    <ErrorBoundary>
                      <Outlet />
                    </ErrorBoundary>
                  </div>
                  <GoToTopButton />
                  <Chatbot />
                  <FeedbackButton />
                  <Footer />
                </div>
              </LanguageProvider>
            </MapProvider>
          </DashboardDataProvider>
        </AppProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
