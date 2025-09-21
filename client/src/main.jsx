import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Trips from './pages/Trips';
import TravelGuidesCarousel from './pages/TravelGuidesProfiles.jsx';
import Contact from './components/Contact.jsx';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Review from './pages/Review';
import Contributors from './pages/Contributors';
import About from './pages/About';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import TicketBooking from './pages/TicketBooking';
import TravelPackages from './pages/TravelPackages';
import PackageDetails from './pages/PackageDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PrivacyPolicy from './pages/Privacypolicy.jsx';
import TermsAndConditions from './pages/Terms&Conditions.jsx';
import FAQ from './pages/FAQ.jsx';
import TripsPlanned from './pages/TripsPlanned';
import SavedPlaces from './pages/SavedPlaces';
import CountriesVisited from './pages/CountriesVisited';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';
import NetworkError from './components/ErrorHandle/NetworkError';
import ServerError from './components/ErrorHandle/ServerError';
import { AuthProvider } from './context/AuthContext';
import Blog from './pages/Blog';
import TripCalculatorPage from './pages/TripCalculator';
import CurrencyConverter from './pages/currencyconverter';
import DiscovermoreDestination from './pages/DiscovermoreDestination';
import Feedback from './pages/Feedback';
import TravelPlanGenerator from './pages/TravelPlanGenerator';
import TravelForum from './pages/TravelForum';
import AuthLayout from './components/AuthLayout';
import TrendingSpots from './pages/TrendingSpots.jsx';
import PackingChecklistPage from './pages/PackingChecklist.jsx';
import Summarizer from './components/Summarizer';
import Recommendation from './components/recommendation';
import Wishlist from './pages/Wishlist';
import { WishlistProvider } from "./context/WishlistContext";
import AuthProvider2 from "./context/AuthProvider.jsx";

const router = createBrowserRouter([
  { path: '/login', element: <AuthLayout><Login /></AuthLayout> },
  { path: '/signup', element: <AuthLayout><Signup /></AuthLayout> },
  { path: '/forgot-password', element: <AuthLayout><ForgotPassword /></AuthLayout> },
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: "/trending-spots", // Add this route
        element: <TrendingSpots />
      },
      {
        path: "/trending", // Alternative route
        element: <TrendingSpots />
      },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/discover', element: <Discover /> },
      { path: '/currency-converter', element: <CurrencyConverter /> },
      { path: '/trips', element: <Trips /> },
      { path: '/review', element: <Review /> },
      // { path: '/forums', element: <Forums /> },
      { path: '/forum', element: <TravelForum /> }, // ✅ Added this route
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
      { path: '/travel-plan-generator', element: <TravelPlanGenerator /> },
      { path: '/packing-checklist', element: <PackingChecklistPage /> },
      {path: '/wishlist',element: <Wishlist />,},
      { path: '/trending-spots', element: <TrendingSpots /> }, // ✅ Add this route
      { path: '/trending', element: <TrendingSpots /> }, // ✅ Alternative route
      {

        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/trips',
        element: (
          <ProtectedRoute>
            <TripsPlanned />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/saved',
        element: (
          <ProtectedRoute>
            <SavedPlaces />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/countries',
        element: (
          <ProtectedRoute>
            <CountriesVisited />
          </ProtectedRoute>
        ),
      },
      { path: '/network-error', element: <NetworkError /> },
      { path: '/server-error', element: <ServerError /> },
      { path: '*', element: <NotFound /> },
      { path: '/package/:id', element: <PackageDetails /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider2>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="1047267709802-k05pdjqojcal19h24fd75opev1evaf6j.apps.googleusercontent.com">
        <AuthProvider>
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
      </GoogleOAuthProvider>
    </ErrorBoundary>
    </AuthProvider2>
  </StrictMode>
);
