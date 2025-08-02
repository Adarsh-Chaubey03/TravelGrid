
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import { WishlistProvider } from './context/WishlistContext';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Trips from './pages/Trips';
// Pages & Components
import TravelGuidesCarousel from './pages/TravelGuidesProfiles.jsx';
import Contact from './components/Contact.jsx';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Review from './pages/Review';
import Forums from './pages/Forums';
import Contributors from './pages/Contributors';
import About from './pages/About';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import TicketBooking from './pages/TicketBooking';
import TravelPackages from './pages/TravelPackages';
import PackageDetails from "./pages/PackageDetails";
import HotelBookingPage from './pages/HotelBookingPage';
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
import Wishlist from './pages/Wishlist'; 


const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/discover', element: <Discover /> },
       { path: '/trips', element: <Trips /> },
      { path: '/review', element: <Review /> },
      // { path: '/forums', element: <Forums /> },
      { path: '/contributors', element: <Contributors /> },
      { path: '/hotels', element: <Hotels /> },
      { path: '/hotels/:id', element: <HotelDetails /> },
      { path: '/ticket', element: <TicketBooking /> },
      { path: '/guides', element: <TravelGuidesCarousel /> },
      { path: '/packages', element: <TravelPackages /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <TermsAndConditions /> },
      { path: '/trip-calculator', element: <TripCalculatorPage/>},
      {path: '/wishlist',element: <Wishlist /> },



      
 

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
      { path: "/package/:id", element:<PackageDetails /> },
    ],
  },
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </StrictMode>
);
