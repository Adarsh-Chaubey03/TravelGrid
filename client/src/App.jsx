import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { DashboardDataProvider } from "./context/DashboardDataContext";
import Navbar from "./components/Custom/Navbar";
import Footer from "./components/Custom/Footer";
import { WishlistProvider } from "./context/WishlistContext";
import { useAuth } from "./context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';
import GoToTopButton from './components/GoToTopButton';
import FeedbackButton from './components/FeedbackButton';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useAuth();
  

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
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

      </WishlistProvider>
  );
}

export default App;