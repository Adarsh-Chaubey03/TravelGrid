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
<<<<<<< HEAD
import { WishlistProvider } from "./context/WishlistContext";
import { useAuth } from "./context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';
import GoToTopButton from './components/GoToTopButton';
import FeedbackButton from './components/FeedbackButton';
=======
import Spinner from "./components/Spinner";
import ErrorBoundary from "./components/ErrorHandle/ErrorBoundary";
import GoToTopButton from "./components/GoToTopButton";
import FeedbackButton from "./components/FeedbackButton";
import Chatbot from "./components/Chatbot";
import EmailVerificationBanner from "./components/Auth/EmailVerificationBanner";
import FluidCursor from "./components/FluidCursor";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
>>>>>>> 6b99236f1c880cfa051e2080ce57c618aab78f7f

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [authUser, setAuthUser] = useAuth();
  
=======
  const { isDarkMode } = useTheme();
>>>>>>> 6b99236f1c880cfa051e2080ce57c618aab78f7f

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
<<<<<<< HEAD
    <WishlistProvider>
     <GoogleOAuthProvider clientId="200124904066-qoobaps3o4n4fcmj5l48bulorgo7lvaq.apps.googleusercontent.com">
      <AppProvider>
        <DashboardDataProvider>
          <div className="flex flex-col min-h-screen">
            {loading && <Spinner />}
            <Navbar />
            <div className="flex-grow">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
            <GoToTopButton /> 
            <FeedbackButton />
            <Footer />
          </div>
        </DashboardDataProvider>
      </AppProvider>
      </GoogleOAuthProvider>

=======
    <AuthProvider>
      <WishlistProvider>
        <AppProvider>
          <DashboardDataProvider>
            <MapProvider>
              <div className={`flex flex-col min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-black to-pink-900 text-white' : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-black'
                }`}>

                <FluidCursor />
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
>>>>>>> 6b99236f1c880cfa051e2080ce57c618aab78f7f
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
