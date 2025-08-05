import TravelTips from "./components/TravelTips";
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
function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

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
              <div className="flex flex-col min-h-screen">
                {/* Show spinner when route changes */}
                {loading && <Spinner />}

                {/* Navbar */}
                <Navbar />

                {/* Main Content */}
                <div className="flex-grow">
                  <ErrorBoundary>
                    <Outlet />
                    <TravelTips />
                  </ErrorBoundary>
                </div>

                {/* Buttons and Footer */}
                <GoToTopButton />
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
