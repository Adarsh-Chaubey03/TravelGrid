// Updated responsive Navbar with fixes and unified logic for both desktop and mobile
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Ticket, Package, Building2, UserRound,
  Contact, LogIn, Menu, X, ChevronRight,
  User, LogOut
} from "lucide-react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ticket", path: "/ticket" },
    { name: "Packages", path: "/packages" },
    { name: "Hotels", path: "/hotels" },
    { name: "Guides", path: "/guides" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Sticky Translucent Navbar */}
      <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-500 tracking-tight">
          TravelGrid
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 items-center text-pink-500 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-pink-600 transition ${
                location.pathname === link.path ? "underline underline-offset-4" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-pink-600 flex items-center gap-1">
                <User size={18} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-pink-600 flex items-center gap-1"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-pink-600 flex items-center gap-1">
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-4 py-2 rounded-md font-semibold ml-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Icon (Mobile only) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden text-pink-500"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Overlay for Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] sm:w-[60%] max-w-[320px] bg-black z-50 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full text-pink-500">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold mb-6">
            TravelGrid
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 px-3 rounded hover:bg-pink-500/10 ${
                  location.pathname === link.path && "bg-pink-500/20"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex gap-2 items-center">
                  <User size={18} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex gap-2 items-center text-red-400"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex gap-2 items-center">
                  <LogIn size={18} /> Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-2 rounded text-center mt-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
