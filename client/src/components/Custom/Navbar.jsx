import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Ticket,
  Package,
  Building2,
  UserRound,
  Contact,
  LogIn,
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Settings
} from "lucide-react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Ticket", path: "/ticket", icon: <Ticket size={18} /> },
    { name: "Packages", path: "/packages", icon: <Package size={18} /> },
    { name: "Hotels", path: "/hotels", icon: <Building2 size={18} /> },
    { name: "Guides", path: "/guides", icon: <UserRound size={18} /> },
    { name: "Contact", path: "/contact", icon: <Contact size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`w-full py-3 px-4 md:px-8 fixed top-0 left-0 z-40 transition-all duration-300 
          ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black/60 backdrop-blur-sm'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-pink-400 tracking-tight">
              TravelGrid
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors flex items-center gap-2 ${isActive(link.path)
                    ? 'text-pink-400'
                    : 'text-white hover:text-pink-300'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* <Link
                  to="/login"
                  className="text-white hover:text-pink-300 font-medium transition-colors"
                >
                  Sign In
                </Link> */}
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center text-pink-400 relative"
            aria-label="Toggle menu"
          >
            <Menu size={24} className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`} />
            <X size={24} className={`absolute transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-gradient-to-br from-black to-zinc-900 z-50 transform transition-transform duration-300 ease-in-out shadow-xl md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-pink-400 p-1 hover:bg-pink-500/10 rounded-full"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Logo */}
          <Link to="/" className="flex items-center mb-8">
            <div className="text-2xl font-bold text-pink-400 tracking-tight">
              TravelGrid
            </div>
          </Link>

          {/* User Info (Mobile) */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-lg">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${isActive(link.path)
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'text-white hover:bg-pink-500/10 hover:text-pink-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-pink-400">{link.icon}</span>
                  <span>{link.name}</span>
                </div>
                <ChevronRight size={16} className="text-pink-400/70" />
              </Link>
            ))}

            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between text-white hover:bg-pink-500/10 hover:text-pink-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-pink-400"><User size={18} /></span>
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight size={16} className="text-pink-400/70" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between text-red-400 hover:bg-red-500/10 w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-red-400"><LogOut size={18} /></span>
                    <span>Logout</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between text-white hover:bg-pink-500/10 hover:text-pink-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-pink-400"><LogIn size={18} /></span>
                    <span>Sign In</span>
                  </div>
                  <ChevronRight size={16} className="text-pink-400/70" />
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  <LogIn size={18} />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Footer Links in Mobile */}
          <div className="mt-auto pt-8 border-t border-pink-900/30">
            <Link
              to="/contributors"
              className="text-pink-400 text-sm hover:underline"
            >
              Contributors
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-[60px]"></div>
    </>
  );
};

export default Navbar;