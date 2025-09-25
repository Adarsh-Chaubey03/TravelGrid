import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext'; // ✅ use AuthContext here
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';
import AuthLayout from './components/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Discover from './pages/Discover';
import Trips from './pages/Trips';
import Review from './pages/Review';
import TravelForum from './pages/TravelForum';
import Contributors from './pages/Contributors';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import TicketBooking from './pages/TicketBooking';
import TravelGuidesCarousel from './pages/TravelGuidesProfiles.jsx';
import TravelPackages from './pages/TravelPackages';
import DiscovermoreDestination from './pages/DiscovermoreDestination';
import FAQ from './pages/FAQ.jsx';
import Contact from './components/Contact.jsx';
import Feedback from './pages/Feedback';
import Recommendation from './components/recommendation';
import Summarizer from './components/Summarizer';
import PrivacyPolicy from './pages/Privacypolicy.jsx';
import TermsAndConditions from './pages/Terms&Conditions.jsx';
import TripCalculatorPage from './pages/TripCalculator';
import TrendingSpots from './pages/TrendingSpots.jsx';
import PackingChecklistPage from './pages/PackingChecklist.jsx';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import NetworkError from './components/ErrorHandle/NetworkError';
import ServerError from './components/ErrorHandle/ServerError';

const router = createBrowserRouter([
  { path: '/login', element: <AuthLayout><Login /></AuthLayout> },
  { path: '/signup', element: <AuthLayout><Signup /></AuthLayout> },
  { path: '/forgot-password', element: <AuthLayout><ForgotPassword /></AuthLayout> },
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/discover', element: <Discover /> },
      { path: '/currency-converter', element: <Trips /> },
      { path: '/trips', element: <Trips /> },
      { path: '/review', element: <Review /> },
      { path: '/forum', element: <TravelForum /> },
      { path: '/contributors', element: <Contributors /> },
      { path: '/hotels', element: <Hotels /> },
      { path: '/hotels/:id', element: <HotelDetails /> },
      { path: '/ticket', element: <TicketBooking /> },
      { path: '/guides', element: <TravelGuidesCarousel /> },
      { path: '/packages', element: <TravelPackages /> },
      { path: '/destinations', element: <DiscovermoreDestination /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/contact', element: <Contact /> },
      { path: '/feedback', element: <Feedback /> },
      { path: '/recommendation', element: <Recommendation /> },
      { path: '/Summarizer', element: <Summarizer /> },
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <TermsAndConditions /> },
      { path: '/trip-calculator', element: <TripCalculatorPage /> },
      { path: '/packing-checklist', element: <PackingChecklistPage /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/trending-spots', element: <TrendingSpots /> },
      { path: '/trending', element: <TrendingSpots /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: '/network-error', element: <NetworkError /> },
      { path: '/server-error', element: <ServerError /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider> {/* ✅ updated to AuthContext */}
              <WishlistProvider>
                <RouterProvider router={router} />
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px',
                    },
                  }}
                />
              </WishlistProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
