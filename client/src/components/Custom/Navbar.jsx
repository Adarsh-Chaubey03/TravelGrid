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
  LogOut,
  LogIn,
  ChevronDown,
  Mail,
  AlertTriangle,
} from "lucide-react";
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
    { name: t("navigation.about"), path: "/about" },
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
        { label: "AI Mood Board", path: "/mood-board" },
        { label: "AI Travel Planner", path: "/ai-travel-planner" },
        { label: "Music", path: "/music" },
        { label: t("navigation.feedback"), path: "/feedback" },
      ],
    },
    { name: t("navigation.wishlist"), path: "/wishlist" },
  ];

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

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user && isAuthenticated);

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
    "py-1.5 px-2 text-sm font-medium rounded-sm hover:text-pink-500 hover:shadow-sm transition-all duration-300";

  return (
    <div>
      {/* Top Navbar */}
      <nav
        className={`box-border w-full fixed top-0 left-0 z-50 h-16 backdrop-blur-xl backdrop-saturate-150 border-b transition-all duration-300 pr-2 sm:pr-3 pl-0 ${
          isDarkMode
            ? "bg-slate-900/70 border-slate-700/50 text-white shadow-slate-900/50"
            : "bg-white/70 border-gray-200/50 text-gray-800 shadow-gray-500/20"
        } ${isScrolled ? "shadow-xl" : "shadow-md"}`}
      >
        <div className="w-full max-w-full mx-auto flex justify-between items-center gap-2 px-1 py-3">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={() =>
              typeof window !== "undefined" &&
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex items-center gap-2 text-xl font-bold tracking-tight bg-gradient-to-br from-pink-400 to-pink-600 bg-clip-text text-transparent transition-all duration-200 hover:scale-105"
          >
            <img
              src="/favicon.ico"
              alt="TravelGrid Logo"
              loading="lazy"
              className="w-7 h-7 ml-2 rounded-full border border-pink-300 shadow-md flex-shrink-0 hover:shadow-lg hover:border-pink-400 transition-all duration-200"
            />
            <span className="text-base font-bold truncate max-w-[100px] sm:max-w-[140px] md:max-w-none">
              TravelGrid
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center gap-1 font-small flex-1 justify-center ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {navLinks.map((link) =>
              link.subitems ? (
                <div className="relative group" key={link.name}>
                  <button
                    aria-label={link.name}
                    className={`py-1.5 px-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1 truncate max-w-fit cursor-pointer ${
                      activeParentTab === link.name
                        ? "bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg text-white scale-105"
                        : `hover:text-pink-500 hover:bg-pink-50/50 hover:shadow-md ${
                            isDarkMode ? "text-gray-200 hover:bg-pink-900/20" : "text-gray-900"
                          }`
                    }`}
                  >
                    {/* Chevron rotate on hover */}
                    {link.name}{" "}
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform duration-400 group-hover:rotate-180 font-bold ${
                        activeParentTab === link.name
                          ? "text-white"
                          : isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    />
                  </button>
                  {/* Dropdown menu */}
                  <div
                    className={`absolute left-0 mt-2 top-full opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 p-2 min-w-[180px] max-w-[260px] rounded-xl shadow-2xl ${
                      isDarkMode
                        ? "bg-slate-800/95 text-white border border-slate-700 backdrop-blur-lg"
                        : "bg-white/95 text-gray-900 border border-gray-200 backdrop-blur-lg"
                    }`}
                  >
                    {link.subitems.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                          `py-2 px-3 text-sm rounded-lg hover:bg-gradient-to-r from-pink-500 to-pink-600 hover:text-white hover:shadow-md hover:scale-[1.02] block transition-all duration-200 break-words ${
                            isActive
                              ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md"
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
                    `${linkBaseClasses} rounded-lg ${
                      isActive
                        ? "bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg text-white hover:text-white scale-105"
                        : isDarkMode ? "hover:bg-pink-900/20" : "hover:bg-pink-50/50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}
          </div>

          {/* Desktop Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex gap-2 items-center text-pink-500 font-medium">
            {/* Mood Toggle */}
            <MoodToggle />
            {/* Language Selector */}
            <LanguageSelector />
            {/* Theme Toggle */}
            <ThemeToggle />

            {isLoggedIn ? (
              <>
                {/* Email verification alert for unverified users */}
                {user && !user.isEmailVerified && (
                  <NavLink
                    to={`/verify-email?email=${encodeURIComponent(user.email)}`}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 border border-yellow-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-500/60 hover:shadow-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                    title="Click to verify your email"
                  >
                    <AlertTriangle size={14} className="animate-pulse" />
                    <span className="hidden lg:inline">{t("auth.verifyEmail")}</span>
                  </NavLink>
                )}

                <NavLink
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? "bg-slate-800/80 text-gray-200 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
                  } hover:shadow-lg hover:scale-105`}
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="User Avatar"
                      loading="lazy"
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-pink-400"
                    />
                  ) : user?.name ? (
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs font-bold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User size={16} />
                  )}
                  <span className="hidden lg:inline">{t("navigation.dashboard")}</span>
                </NavLink>

                <button
                  aria-label="Logout"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">{t("auth.logout")}</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-xl hover:scale-105 ${
                    isDarkMode
                      ? "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
                      : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  <LogIn size={16} />
                  {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-xl hover:scale-105"
                >
                  <User size={16} />
                  {t("auth.signup")}
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-1.5">
            <MoodToggle />
            <LanguageSelector />
            <ThemeToggle />

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "text-pink-400 hover:text-pink-300 hover:bg-pink-500/20"
                  : "text-pink-500 hover:text-pink-600 hover:bg-pink-500/10"
              } ${isSidebarOpen ? "bg-pink-500/20" : ""}`}
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
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
        className={`fixed top-0 right-0 h-full w-[80vw] sm:w-[60vw] max-w-[300px] z-[1002] transition-transform duration-300 ease-in-out transform backdrop-blur-xl ${
          isDarkMode
            ? "bg-slate-900/95 text-gray-200 border-l border-slate-700/50"
            : "bg-white/95 text-gray-900 border-l border-gray-200/50"
        } ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 flex flex-col h-full overflow-y-auto custom-scroll">
          <div
            className={`flex justify-end mb-4 pb-3 border-b ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "text-pink-400 hover:text-pink-300 hover:bg-pink-500/20"
                  : "text-pink-500 hover:text-pink-600 hover:bg-pink-500/10"
              }`}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link) =>
              link.subitems ? (
                <div key={link.name} className="flex flex-col">
                  <button
                    aria-label={`Toggle ${link.name}`}
                    onClick={() => toggleGroup(link.name)}
                    className={`py-2.5 px-3 w-full flex justify-between items-center rounded-lg font-semibold transition-all duration-200 text-sm ${
                      isDarkMode
                        ? "hover:bg-pink-500/20 active:bg-pink-500/30"
                        : "hover:bg-pink-100 active:bg-pink-200"
                    } ${expanded === link.name ? (isDarkMode ? "bg-pink-500/20" : "bg-pink-100") : ""}`}
                  >
                    <span className="break-words">{link.name}</span>
                    <ChevronDown 
                      size={18}
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        expanded === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded === link.name && (
                    <div
                      className={`w-full flex flex-col px-2 py-2 mt-1 space-y-1 border-l-2 ml-3 ${
                        isDarkMode ? "border-pink-500/30" : "border-pink-300"
                      }`}
                    >
                      {link.subitems.map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.path}
                          className={({ isActive }) =>
                            `w-full py-2 px-3 rounded-lg transition-all duration-200 break-words text-sm font-medium ${
                              isActive
                                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                                : isDarkMode
                                ? "hover:bg-pink-500/20"
                                : "hover:bg-pink-100"
                            }`
                          }
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
                  className={({ isActive }) =>
                    `py-2.5 px-3 font-semibold rounded-lg transition-all duration-200 break-words text-sm ${
                      isActive
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                        : isDarkMode
                        ? "hover:bg-pink-500/20"
                        : "hover:bg-pink-100"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}

            {/* Mobile Auth Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-300/50 space-y-2">
              {isLoggedIn ? (
                <>
                  {/* Email verification alert for mobile */}
                  {user && !user.isEmailVerified && (
                    <NavLink
                      to={`/verify-email?email=${encodeURIComponent(
                        user.email
                      )}`}
                      className="flex gap-2 items-center py-2.5 px-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 border border-yellow-500/40 font-semibold break-words text-sm hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200"
                    >
                      <AlertTriangle size={16} className="animate-pulse flex-shrink-0" />
                      <span>{t("auth.verifyEmail")}</span>
                    </NavLink>
                  )}

                  <NavLink
                    to="/dashboard"
                    className={`flex gap-2 items-center py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-800/80 hover:bg-slate-700 border border-slate-700"
                        : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="User Avatar"
                        loading="lazy"
                        className="w-5 h-5 rounded-full object-cover ring-2 ring-pink-400"
                      />
                    ) : user?.name ? (
                      <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <User size={16} />
                    )}
                    {t("navigation.dashboard")}
                  </NavLink>

                  <button
                    aria-label="Logout"
                    onClick={handleLogout}
                    className="flex gap-2 items-center w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <LogOut size={16} />
                    {t("auth.logout")}
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`flex gap-2 items-center py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                      isDarkMode
                        ? "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
                        : "bg-white hover:bg-gray-50 border border-gray-300"
                    } shadow-md hover:shadow-lg`}
                  >
                    <LogIn size={16} />
                    {t("auth.login")}
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="flex gap-2 items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-2.5 px-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <User size={16} />
                    {t("auth.signup")}
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;