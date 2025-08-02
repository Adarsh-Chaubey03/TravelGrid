import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { DashboardDataProvider } from './context/DashboardDataContext.jsx';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Discover from './pages/Discover';
import Trips from './pages/Trips';
import Review from './pages/Review';
import Contributors from './pages/Contributors';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import TicketBooking from './pages/TicketBooking';
import TravelGuidesCarousel from './pages/TravelGuidesProfiles';
import TravelPackages from './pages/TravelPackages';
import HotelBookingPage from './pages/HotelBookingPage';
import TripCalculatorPage from './pages/TripCalculator';
import FAQ from './pages/FAQ';
import Contact from './components/Contact';
import PrivacyPolicy from './pages/Privacypolicy';
import TermsAndConditions from './pages/Terms&Conditions';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import TripsPlanned from './pages/TripsPlanned';
import SavedPlaces from './pages/SavedPlaces';
import CountriesVisited from './pages/CountriesVisited';
import NetworkError from './components/ErrorHandle/NetworkError';
import ServerError from './components/ErrorHandle/ServerError';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Error handling
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';

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
      { path: '/contributors', element: <Contributors /> },
      { path: '/hotels', element: <Hotels /> },
      { path: '/hotels/:id', element: <HotelDetails /> },
      { path: '/ticket', element: <TicketBooking /> },
      { path: '/guides', element: <TravelGuidesCarousel /> },
      { path: '/packages', element: <TravelPackages /> },
      { path: '/hotel-booking', element: <HotelBookingPage /> },
      { path: '/trip-calculator', element: <TripCalculatorPage /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <TermsAndConditions /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <DashboardDataProvider>
            <RouterProvider router={router} />
          </DashboardDataProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
