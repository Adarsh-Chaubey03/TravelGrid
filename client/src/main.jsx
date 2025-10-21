import { StrictMode, lazy, Suspense } from 'react';
const UserViewProfile = lazy(() => import('./pages/user/ViewProfile'));
const UserEditProfile = lazy(() => import('./pages/user/EditProfile'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import ItineraryMapPage from "./pages/ItineraryMapPage";
import './index.css';
import './i18n'; // Import i18n configuration
import App from './App.jsx';
import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import AuthLayout from './components/AuthLayout';
import PublicRoute from './components/Auth/PublicRoute';
//import TrendingSpots from './pages/TrendingSpots.jsx';
//import PackingChecklistPage from './pages/PackingChecklist.jsx';
//import Summarizer from './components/Summarizer';
//import Recommendation from './components/recommendation';
//import Wishlist from './pages/Wishlist';
//import { WishlistProvider } from "./context/WishlistContext";
import LocationDetail from './pages/LocationDetail';

//import TrendingSpots from './pages/TrendingSpots.jsx';
//import PackingChecklistPage from './pages/PackingChecklist.jsx';
//import Summarizer from './components/Summarizer';
//import Recommendation from './components/recommendation';
//import Wishlist from './pages/Wishlist';


import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Provider } from 'react-redux';
import appStore from './app/store.js';
import { UpdatePassword } from './pages/UpdatePassword';

import LeaderBoard from './components/Leaderboard/LeaderBoard';


//import TrendingSpots from './pages/TrendingSpots.jsx';
//import PackingChecklistPage from './pages/PackingChecklist.jsx';
//import Summarizer from './components/Summarizer';
//import Recommendation from './components/recommendation';
//import Wishlist from './pages/Wishlist';
//import { WishlistProvider } from "./context/WishlistContext";


//import ProtectedRoute from './components/Auth/ProtectedRoute';


// Lazy imports for pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
import DiscoverSection from "./components/Home/DiscoverSection";
const Trips = lazy(() => import('./pages/Trips'));
const Review = lazy(() => import('./pages/Review'));
const Contributors = lazy(() => import('./pages/Contributors'));
const Hotels = lazy(() => import('./pages/Hotels'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const HotelBookingForm = lazy(() => import('./pages/HotelBookingForm'));
const TicketBooking = lazy(() => import('./pages/TicketBooking'));
const TravelGuidesCarousel = lazy(() => import('./pages/TravelGuidesProfiles'));
const TravelPackages = lazy(() => import('./pages/TravelPackages'));
const Rentals = lazy(() => import('./pages/Rentals'));
const DiscovermoreDestination = lazy(() => import('./pages/DiscovermoreDestination'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./components/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/Privacypolicy'));
const TermsAndConditions = lazy(() => import('./pages/Terms&Conditions'));
const TripCalculatorPage = lazy(() => import('./pages/TripCalculator'));
const CurrencyConverter = lazy(() => import('./pages/currencyconverter'));
const EnhancedCurrencyConverter = lazy(() => import('./pages/EnhancedCurrencyConverter'));
const Feedback = lazy(() => import('./pages/Feedback'));
const TravelPlanGenerator = lazy(() => import('./pages/TravelPlanGenerator'));
const TravelForum = lazy(() => import('./pages/TravelForum'));
const BikeDetail = lazy(() => import('./pages/BikeDetail'));
const BikeBookingForm = lazy(() => import('./pages/BikeBookingForm'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const TrendingSpots = lazy(() => import('./pages/TrendingSpots'));
const PackingChecklistPage = lazy(() => import('./pages/PackingChecklist'));
const CustomItenary = lazy(()=> import('./components/CustomItenary'));
const Recommendation = lazy(() => import('./components/recommendation'));
// const Leaderboard = lazy(() => import('./components/Leaderboard/LeaderBoard'));

const Wishlist = lazy(() => import('./pages/Wishlist'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TripsPlanned = lazy(() => import('./pages/TripsPlanned'));
const SavedPlaces = lazy(() => import('./pages/SavedPlaces'));
const CountriesVisited = lazy(() => import('./pages/CountriesVisited'));
const PackageDetails = lazy(() => import('./pages/PackageDetails'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NetworkError = lazy(() => import('./components/ErrorHandle/NetworkError'));
const ServerError = lazy(() => import('./components/ErrorHandle/ServerError'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BookingHistory = lazy(() => import('./pages/BookingHistory'));
const AITravelPlannerDemo = lazy(() => import('./pages/AITravelPlannerDemo'));
import AITravelChecklist from './components/AITravelChecklist';
import MusicPlayerDemo from './pages/MusicPlayerDemo';
import Music from './pages/Music';
import VisaChecker from './pages/VisaChecker';
import SharedTrip from './pages/SharedTrip';
import QRTripSharing from './pages/QRTripSharing';
import SharedTripTool from './pages/SharedTripTool';

const router = createBrowserRouter([
  { path: '/login', element: <AuthLayout><PublicRoute><Login /></PublicRoute></AuthLayout> },
  { path: '/signup', element: <AuthLayout><PublicRoute><Signup /></PublicRoute></AuthLayout> },
  { path: '/forgot-password', element: <AuthLayout><PublicRoute><ForgotPassword /></PublicRoute></AuthLayout> },
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Suspense fallback={<Spinner />}><Home /></Suspense> },
      { path: '/about', element: <Suspense fallback={<Spinner />}><About /></Suspense> },
      { path: '/blog', element: <Suspense fallback={<Spinner />}><Blog /></Suspense> },
      { path: '/discover', element: <DiscoverSection /> },
      { path: '/currency-converter', element: <Suspense fallback={<Spinner />}><CurrencyConverter /></Suspense> },
      { path: '/enhanced-currency', element: <Suspense fallback={<Spinner />}><EnhancedCurrencyConverter /></Suspense> },
      { path: '/trips', element: <Suspense fallback={<Spinner />}><Trips /></Suspense> },
      { path: '/review', element: <Suspense fallback={<Spinner />}><Review /></Suspense> },
      { path: '/forum', element: <Suspense fallback={<Spinner />}><TravelForum /></Suspense> },
      { path: '/contributors', element: <Suspense fallback={<Spinner />}><Contributors /></Suspense> },
      { path: '/hotels', element: <Suspense fallback={<Spinner />}><Hotels /></Suspense> },
      { path: '/hotels/:id', element: <Suspense fallback={<Spinner />}><HotelDetails /></Suspense> },
      { path: '/hotel-booking', element: <Suspense fallback={<Spinner />}><HotelBookingForm /></Suspense> },
      { path: '/ticket', element: <Suspense fallback={<Spinner />}><TicketBooking /></Suspense> },
      { path: '/guides', element: <Suspense fallback={<Spinner />}><TravelGuidesCarousel /></Suspense> },
      { path: '/packages', element: <Suspense fallback={<Spinner />}><TravelPackages /></Suspense> },
      { path: '/rentals', element: <Suspense fallback={<Spinner />}><Rentals /></Suspense> },
      { path: '/rentals/bike/:id', element: <Suspense fallback={<Spinner />}><BikeDetail /></Suspense> },
      { path: '/rentals/bike/:id/booking', element: <Suspense fallback={<Spinner />}><BikeBookingForm /></Suspense> },
      { path: '/rentals/booking-success', element: <Suspense fallback={<Spinner />}><BookingSuccess /></Suspense> },
      { path: '/destinations', element: <Suspense fallback={<Spinner />}><DiscovermoreDestination /></Suspense> },
      { path: '/faq', element: <Suspense fallback={<Spinner />}><FAQ /></Suspense> },
      { path: '/contact', element: <Suspense fallback={<Spinner />}><Contact /></Suspense> },
      { path: '/feedback', element: <Suspense fallback={<Spinner />}><Feedback /></Suspense> },
      { path: '/recommendation', element: <Suspense fallback={<Spinner />}><Recommendation /></Suspense> },
      { path: '/custom-itinerary', element: <Suspense fallback={<Spinner />}><CustomItenary /></Suspense> },
      { path: '/privacy', element: <Suspense fallback={<Spinner />}><PrivacyPolicy /></Suspense> },
      { path: '/terms', element: <Suspense fallback={<Spinner />}><TermsAndConditions /></Suspense> },
      { path: '/trip-calculator', element: <Suspense fallback={<Spinner />}><TripCalculatorPage /></Suspense> },
      { path: '/travel-plan-generator', element: <Suspense fallback={<Spinner />}><TravelPlanGenerator /></Suspense> },
      { path: '/packing-checklist', element: <Suspense fallback={<Spinner />}><PackingChecklistPage /></Suspense> },
  { path: '/wishlist', element: <ProtectedRoute><Suspense fallback={<Spinner />}><Wishlist /></Suspense></ProtectedRoute> },
      { path: '/trending-spots', element: <Suspense fallback={<Spinner />}><TrendingSpots /></Suspense> },
      { path: '/trending', element: <Suspense fallback={<Spinner />}><TrendingSpots /></Suspense> },
      { path: '/booking-history', element: <Suspense fallback={<Spinner />}><BookingHistory /></Suspense> },
      { path: '/ai-travel-planner', element: <Suspense fallback={<Spinner />}><AITravelPlannerDemo /></Suspense> },
      { path: '/music-player-demo', element: <Suspense fallback={<Spinner />}><MusicPlayerDemo /></Suspense> },
      { path: '/music', element: <Suspense fallback={<Spinner />}><Music /></Suspense> },
      {path:"/itinerary-map", element:<Suspense fallback={<Spinner />}><ItineraryMapPage/></Suspense>},
      { path: '/visa-checker', element: <Suspense fallback={<Spinner />}><VisaChecker /></Suspense> },
      { path: '/qr-trip-sharing', element: <Suspense fallback={<Spinner />}><QRTripSharing /></Suspense> },
      { path: '/shared-trip-tool', element: <Suspense fallback={<Spinner />}><SharedTripTool /></Suspense> },
      { path: '/shared-trip/:tripId', element: <Suspense fallback={<Spinner />}><SharedTrip /></Suspense> },
      { path: '/update-password/:id', element: <Suspense fallback={<Spinner />}><UpdatePassword /></Suspense> },
      { path: '/leaderboard', element: <Suspense fallback={<Spinner />}><LeaderBoard /></Suspense> },
      { path: '/ai-travel-checklist', element: <Suspense fallback={<Spinner />}><AITravelChecklist /></Suspense> },

      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: '/dashboard/trips',
        element: <ProtectedRoute><TripsPlanned /></ProtectedRoute>
      },
      {
        path: '/dashboard/saved',
        element: <ProtectedRoute><SavedPlaces /></ProtectedRoute>
      },
      {
        path: '/dashboard/countries',
        element: <ProtectedRoute><CountriesVisited /></ProtectedRoute>
      },
      {
        path: '/user/profile',
        element: <ProtectedRoute><Suspense fallback={<Spinner />}><UserViewProfile /></Suspense></ProtectedRoute>
      },
      {
        path: '/user/profile/edit',
        element: <ProtectedRoute><Suspense fallback={<Spinner />}><UserEditProfile /></Suspense></ProtectedRoute>
      },
      /*{ path: '/network-error', element: <NetworkError /> },
      { path: '/server-error', element: <ServerError /> },
      { path: '*', element: <NotFound /> },
      { path: '/package/:id', element: <PackageDetails /> },*/
      { path: '/location/:locationId', element: <LocationDetail /> },
      



      { path: '/package/:id', element: <Suspense fallback={<Spinner />}><PackageDetails /></Suspense> },
  { path: '/network-error', element: <Suspense fallback={<Spinner />}><NetworkError /></Suspense> },
  { path: '/server-error', element: <Suspense fallback={<Spinner />}><ServerError /></Suspense> },
  { path: '*', element: <Suspense fallback={<Spinner />}><NotFound /></Suspense> },

    ],
  },
]);

// Conditional wrapper that mounts Google OAuth provider only when configured
const Providers = ({ children }) => {
  if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LanguageProvider>{children}</LanguageProvider>
      </GoogleOAuthProvider>
    );
  }

  // Log so developers know why Google auth is disabled
  if (typeof console !== 'undefined') console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will be disabled.');
  return <LanguageProvider>{children}</LanguageProvider>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Providers>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <Provider store={appStore}>
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
              </Provider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </Providers>
    </ErrorBoundary>
  </StrictMode>
);
