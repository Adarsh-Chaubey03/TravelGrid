import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  User,
  LogIn,
  ChevronDown,
  Mail,
  AlertTriangle,
} from "lucide-react";
import ProfileDropdown from "../user/ProfileDropdown";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "../LanguageSelector";
import MoodToggle from '../../services/MoodToggle';

const Navbar = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  const navLinks = [
    { name: t("navigation.home"), path: "/" },
    { name: t("navigation.trendingSpots"), path: "/trending-spots" },
    { name: "About", path: "/about" },
    {
      name: t("navigation.booking"),
      subitems: [
        { label: t("navigation.ticket"), path: "/ticket" },
        { label: t("navigation.hotels"), path: "/hotels" },
        { label: t("navigation.packages"), path: "/packages" },
        { label: "Rentals", path: "/rentals" },
        { label: t("Visa"), path: "/visa-checker" },
        { label: t("navigation.bookingHistory"), path: "/booking-history" },
      ],
    },
    {
      name: t("navigation.support"),
      subitems: [
        { label: t("navigation.travelPlans"), path: "/travel-plan-generator" },
        { label: t("navigation.customItinerary"), path: "/custom-itinerary" },
        { label: t("navigation.guide"), path: "/guides" },
        { label: t("navigation.contact"), path: "/contact" },
       
      ],
    },
    {
      name: t("navigation.tools"),
      subitems: [
        { label: t("navigation.packingChecklist"), path: "/packing-checklist" },
        { label: t("navigation.tripCalculator"), path: "/trip-calculator" },
        {
          label: t("navigation.travelRecommendations"),
          path: "/recommendation",
        },
        { label: "Enhanced Currency Converter", path: "/enhanced-currency" },
        { label: "Map", path: "/itinerary-map" },
        { label: "AI Travel Planner", path: "/ai-travel-planner" },
        { label: "Music", path: "/music" },
        { label: t("navigation.feedback"), path: "/feedback" },
      ],
    },
    { name: t("navigation.wishlist"), path: "/wishlist" },
  ];

  // Function to get the active subitem label for dropdown display
  const getActiveSubitem = (link) => {
  if (!link.subitems) return null;
  
  for (const sub of link.subitems) {
    if (location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')) {
      return sub.label;
    }
  }
  return null;
  };

  const getActiveParentTab = () => {
    for (const link of navLinks) {
      if (link.subitems) {
        for (const sub of link.subitems) {
          if (location.pathname.startsWith(sub.path)) {
            return link.name;
          }
        }
      }
    }
    return null;
  };

  const activeParentTab = getActiveParentTab();

  const { user, logout, isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();
  const { isDarkMode } = useTheme();

  // Rely exclusively on AuthContext for auth state. Avoid reading localStorage here.
  const isLoggedIn = Boolean(isAuthenticated);

  const toggleGroup = (item) => {
    setExpanded((prev) => (prev === item ? null : item));
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkBaseClasses =
    "py-1.5 px-2 text-sm font-medium rounded-sm  hover:text-pink-500 hover:shadow-sm transition-all duration-300";

  return (
    <div>
      {/* Top Navbar */}
      <nav
        className={`box-border w-full fixed top-0 left-0 z-50 h-20 backdrop-blur-md border-b transition-all duration-300 pr-4 sm:pr-6 pl-0 ${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white"
            : "bg-gradient-to-r from-white via-gray-50 to-white border-gray-200 text-gray-900"
        } ${isScrolled ? "shadow-xl" : "shadow-md"}`}
      >
        <div className="w-full max-w-full mx-auto flex justify-between items-center gap-6 px-2 py-4.5">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={() =>
              typeof window !== "undefined" &&
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className={`flex items-center gap-1 font-bold tracking-tight bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-400 bg-clip-text text-transparent transition-colors duration-200 flex-shrink-0`}
          >
            <img
              src="/favicon.ico"
              alt="TravelGrid Logo"
              loading="lazy"
              className="w-7 h-7 sm:w-8 sm:h-8 mx-1 sm:mx-2 rounded-full border border-pink-300 shadow-md flex-shrink-0"
            />
            <span className="text-base sm:text-lg md:text-xl font-bold  max-w-[100px] xs:max-w-[120px] sm:max-w-[160px] md:max-w-none whitespace-nowrap" style={{fontFamily:'"Poppins", serif'}}>
              TravelGrid
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center gap-1.5 font-small flex-1 justify-center ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {navLinks.map((link) => {
            const activeSubitem = getActiveSubitem(link);
              return link.subitems ? (
                <div className="relative group" key={link.name}>
                  <button
                    aria-label={link.name}
                    className={`py-1.5 px-2 text-sm font-medium rounded-sm transition-all  duration-300 flex items-center gap-1 truncate max-w-fit cursor-pointer ${
                      activeParentTab === link.name
                        ? "bg-gradient-to-r from-pink-700 to-pink-500 shadow-md text-white"
                        : `hover:text-pink-500 hover:shadow-sm ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`
                    }`}
                  >  
                  {/* Chevron rotate on hover */}
                    {activeSubitem || link.name} <ChevronDown className={`w-4 h-4 transform transition-transform duration-400 group-hover:rotate-180  font-bold ${activeParentTab===link.name? "text-white": 'text-gray-900'}`} />
                  </button>
                  {/* Dropdown menu */}
                  <div
                    className={`absolute left-0 mt-0 top-full opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 p-2 min-w-[200px] max-w-[280px] rounded-lg shadow-lg ${
                      isDarkMode
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {link.subitems.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                          `py-2 px-2 text-sm hover:bg-gradient-to-r from-pink-500 to-pink-600 hover:text-white block transition-all rounded-md duration-200 break-words ${
                            isActive
                              ? "bg-gradient-to-r from-pink-700 to-pink-500 text-white"
                              : ""
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `${linkBaseClasses} ${
                      isActive
                        ? "bg-gradient-to-r from-pink-700 to-pink-500 shadow-md text-white hover:text-white "
                        : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
            })}
          </div>

          {/* Desktop Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex gap-3 items-center text-pink-500 font-medium">
            {/* Mood Toggle */}
            <MoodToggle />
            {/* Language Selector */}
            <LanguageSelector />
            {/* Theme Toggle */}
            <ThemeToggle />

            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button
                    className="flex items-center focus:outline-none"
                    aria-label="Profile menu"
                    onClick={() => setExpanded(expanded === 'profile' ? null : 'profile')}
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="User Avatar"
                        loading="lazy"
                        className="w-7 h-7 rounded-full object-cover border-2 border-pink-400"
                      />
                    ) : user?.name ? (
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-600 text-white text-base font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <User size={22} />
                    )}
                  </button>
                  <ProfileDropdown show={expanded === 'profile'} onClose={() => setExpanded(null)} />
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="bg-gradient-to-r from-pink-200 to-pink-200 text-black px-3 py-2 rounded-md font-semibold hover:scale-105 transition-all text-sm whitespace-nowrap"
                >
                  {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-gradient-to-r from-pink-200 to-pink-200 text-black px-3 py-2 rounded-md font-semibold hover:scale-105 transition-all text-sm whitespace-nowrap"
                >
                  {t("auth.signup")}
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              className="text-pink-400 hover:text-pink-500 transition-colors duration-200 p-2 rounded-md hover:bg-pink-500/20 cursor-pointer flex-shrink-0"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          isDarkMode ? "bg-black/50" : "bg-black/10"
        } ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[80vw] sm:w-[60vw] max-w-[320px] z-[1002] transition-transform duration-300 ease-in-out transform ${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-gray-200"
            : "bg-gradient-to-r from-white via-gray-50 to-white text-gray-900"
        } ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 flex flex-col h-full overflow-y-auto custom-scroll">
          <div
            className={`flex justify-end mb-6 border-b ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-pink-500 hover:text-pink-400 p-1 rounded-md hover:bg-pink-500/10"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Settings Section - Mood & Language */}
          <div className={`flex flex-col gap-3 mb-6 pb-6 border-b ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}>
            <div className="flex items-center justify-between px-3">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Mood Music
              </span>
              <MoodToggle />
            </div>
            <div className="flex items-center justify-between px-3">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Language
              </span>
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((link) =>
              link.subitems ? (
                <div key={link.name} className="flex flex-col">
                  <button
                    aria-label="Search"
                    onClick={() => toggleGroup(link.name)}
                    className="py-2 px-3 w-full flex justify-between items-center rounded hover:bg-pink-300 transition-all duration-200"
                  >
                    <span className="font-medium break-words text-sm">
                      {link.name}
                    </span>
                    <span className="text-xl flex-shrink-0">
                      {expanded === link.name ? "-" : "+"}
                    </span>
                  </button>
                  {expanded === link.name && (
                    <div
                      className={`w-full flex flex-col px-4 py-2 border-t ${
                        isDarkMode ? "border-pink-100" : "border-pink-100"
                      }`}
                    >
                      {link.subitems.map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.path}
                          className="w-full py-2 px-2 rounded hover:bg-pink-500 transition-all duration-200 break-words text-sm"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className="py-2 px-3 font-medium rounded hover:bg-pink-500 transition-all duration-200 break-words text-sm"
                >
                  {link.name}
                </NavLink>
              )
            )}

            {/* Mobile Auth Buttons */}
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button
                    className="flex items-center py-2 px-3 focus:outline-none"
                    aria-label="Profile menu"
                    onClick={() => setExpanded(expanded === 'profile' ? null : 'profile')}
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="User Avatar"
                        loading="lazy"
                        className="w-7 h-7 rounded-full object-cover border-2 border-pink-400"
                      />
                    ) : user?.name ? (
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-600 text-white text-base font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <User size={22} />
                    )}
                  </button>
                  <ProfileDropdown show={expanded === 'profile'} onClose={() => setExpanded(null)} />
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex gap-2 items-center py-2 px-3 rounded font-medium hover:bg-pink-500 transition-all text-sm"
                >
                  <LogIn size={18} /> {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-gradient-to-b from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-2 px-3 rounded font-medium text-center mt-2 hover:shadow-lg hover:scale-105 transition-all text-sm"
                >
                  {t("auth.signup")}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
