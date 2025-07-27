// Updated responsive Navbar with fixes and unified logic for both desktop and mobile
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
<<<<<<< HEAD
  Home, Ticket, Package, Building2, UserRound,
  Contact, LogIn, Menu, X, ChevronRight,
  User, LogOut
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
=======
  Menu,
  X,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
>>>>>>> 24fd6dccbc770016befb4a4969967fcfd6d5edf3
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

<<<<<<< HEAD
=======
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

>>>>>>> 24fd6dccbc770016befb4a4969967fcfd6d5edf3
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ticket", path: "/ticket" },
    { name: "Packages", path: "/packages" },
    { name: "Hotels", path: "/hotels" },
    { name: "Guides", path: "/guides" },
    { name: "Contact", path: "/contact" },
  ];

<<<<<<< HEAD
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`fixed w-full top-0 z-50 px-4 py-3 md:px-8 transition-all duration-300
      ${scrolled ? "bg-white/10 backdrop-blur-lg shadow-md border-b border-white/20" : "bg-white/5 backdrop-blur-md"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-400 tracking-tight">
          TravelGrid
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 font-medium transition-colors
                ${isActive(link.path) ? "text-pink-400" : "text-white hover:text-pink-300"}`}
            >
              {link.icon} {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-white hover:text-pink-300"
              >
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-black border border-pink-500 rounded-xl shadow-lg text-white z-50 p-4 space-y-2">
                  {/* {navLinks.map((link) => (
                    <Link
                      key={link.path === "/dashboard"   }
                      to={link.path === "/dashboard" }
                      className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-pink-500/10 ${isActive(link.path) ? "bg-pink-500/20 text-pink-400" : "text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400">{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-pink-400/70" />
                    </Link>
                  ))} */}

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-500/10 text-white"
                  >
                    <User size={18} className="text-pink-400" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ml-4 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <LogIn size={18} /> Login
            </button>
=======
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
>>>>>>> 24fd6dccbc770016befb4a4969967fcfd6d5edf3
          )}
        </div>

        {/* Hamburger Icon (Mobile only) */}
        <button
<<<<<<< HEAD
          className="md:hidden text-pink-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
=======
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden text-pink-500"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
>>>>>>> 24fd6dccbc770016befb4a4969967fcfd6d5edf3
        </button>
      </div>

<<<<<<< HEAD
      {/* Mobile Sidebar */}
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-10 left-35 z-50 h-full w-[70%] px-6 py-4">
          {/* Navigation Card - Positioned Below Close Button */}
          <div className="bg-black border border-pink-500 rounded-xl p-4 space-y-4 shadow-lg text-white">
            {isAuthenticated ? (
              <>
                {/* Profile Info */}
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-pink-500/10 ${isActive(link.path) ? "bg-pink-500/20 text-pink-400" : "text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400">{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-pink-400/70" />
                    </Link>
                  ))}

                  {/* Dashboard & Logout */}
                  <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-500/10 text-white">
                    <User size={18} className="text-pink-400" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // When not logged in: Show Login/Signup at end
              <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                    <Link
                      key={link.path === "/dashboard"   }
                      to={link.path === "/dashboard" }
                      className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-pink-500/10 ${isActive(link.path) ? "bg-pink-500/20 text-pink-400" : "text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400">{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-pink-400/70" />
                    </Link>
                  ))}
                <Link to="/login" className="bg-pink-500 text-white px-4 py-2 rounded-lg text-center">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-pink-600 px-4 py-2 rounded-lg text-center">
=======
      {/* Overlay */}
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
>>>>>>> 24fd6dccbc770016befb4a4969967fcfd6d5edf3
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
