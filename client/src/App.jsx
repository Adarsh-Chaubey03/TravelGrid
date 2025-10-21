import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { DashboardDataProvider } from "./context/DashboardDataContext";
import { MapProvider } from "./context/MapContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { useTheme } from "./context/ThemeContext";

import Navbar from "./components/Custom/Navbar";
import Footer from "./components/Custom/Footer";
import Spinner from "./components/Spinner";
import ErrorBoundary from "./components/ErrorHandle/ErrorBoundary";
import GoToTopButton from "./components/GoToTopButton";

import Chatbot from "./components/Chatbot";
import FluidCursor from "./components/FluidCursor";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <AuthProvider>
      <WishlistProvider>
        <AppProvider>
          <DashboardDataProvider>
            <MapProvider>
              <div className={`flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-pink-900 text-white' : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-black'
                }`}>

                <FluidCursor />
                {/* Show spinner when route changes */}
                {loading && <Spinner />}

                {/* Navbar */}
                <Navbar />

                {/* Email verification UI removed to allow direct login */}
                {/* Main Content */}
                <div className="flex-grow">
                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </div>

                {/* Buttons and Footer */}
                <GoToTopButton />
                <Chatbot />
              

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
