import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, Edit, LayoutDashboard, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={ref}
          initial="closed"
          animate="open"
          exit="closed"
          variants={dropdownVariants}
          className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg z-50 border bg-white dark:bg-slate-900 dark:border-slate-700 ${isDarkMode ? "text-white" : "text-gray-900"}`}
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
            <Link to="/user/profile" className="flex items-center gap-2 px-5 py-2 rounded-md transition hover:bg-pink-100 dark:hover:bg-slate-800 cursor-pointer">
              <User size={18} /> View Profile
            </Link>
            <Link to="/user/profile/edit" className="flex items-center gap-2 px-5 py-2 rounded-md transition hover:bg-pink-100 dark:hover:bg-slate-800 cursor-pointer">
              <Edit size={18} /> Edit Profile
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2 rounded-md transition hover:bg-pink-100 dark:hover:bg-slate-800 cursor-pointer">
              <LayoutDashboard size={18} /> My Dashboard
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2 text-red-500 rounded-md transition hover:bg-red-100 dark:hover:bg-slate-800 cursor-pointer">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
