import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, Edit, LayoutDashboard, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Dashboard from "../../pages/user/Dashboard.jsx";


const dropdownVariants = {
  open: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  closed: {
    opacity: 0,
    y: -10,
    pointerEvents: "none",
    transition: { duration: 0.15 }
  }
};

export default function ProfileDropdown({ show, onClose }) {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    if (!show) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [show, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/login");
  };

  const handleMenuClick = (callback) => {
    if (callback) callback();
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={ref}
          initial="closed"
          animate="open"
          exit="closed"
          variants={dropdownVariants}
          className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl z-[9999] border overflow-hidden ${
            isDarkMode 
              ? "bg-slate-900 border-slate-700 text-white" 
              : "bg-white border-gray-200 text-gray-900"
          }`}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="p-4 border-b dark:border-slate-700 flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-pink-400" />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 text-white text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase() || <User size={22} />}
              </div>
            )}
            <div>
              <div className="font-semibold text-base">{user?.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
            </div>
          </div>
          <div className="flex flex-col py-2">
            <Link 
              to="/user/profile" 
              onClick={() => handleMenuClick()}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isDarkMode 
                  ? "hover:bg-slate-800 active:bg-slate-700" 
                  : "hover:bg-pink-50 active:bg-pink-100"
              }`}
            >
              <User size={18} /> 
              <span>View Profile</span>
            </Link>
            <Link 
              to="/user/profile/edit" 
              onClick={() => handleMenuClick()}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isDarkMode 
                  ? "hover:bg-slate-800 active:bg-slate-700" 
                  : "hover:bg-pink-50 active:bg-pink-100"
              }`}
            >
              <Edit size={18} /> 
              <span>Edit Profile</span>
            </Link>
            <Link 
              to="../../pages/user/Dashboard.jsx"
              onClick={() => handleMenuClick()}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isDarkMode 
                  ? "hover:bg-slate-800 active:bg-slate-700" 
                  : "hover:bg-pink-50 active:bg-pink-100"
              }`}
            >
              <LayoutDashboard size={18} /> 
              <span>My Dashboard</span>
            </Link>
            <button 
              onClick={handleLogout} 
              className={`flex items-center gap-3 px-5 py-3 text-red-500 transition-colors w-full text-left ${
                isDarkMode 
                  ? "hover:bg-slate-800 active:bg-slate-700" 
                  : "hover:bg-red-50 active:bg-red-100"
              }`}
            >
              <LogOut size={18} /> 
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
