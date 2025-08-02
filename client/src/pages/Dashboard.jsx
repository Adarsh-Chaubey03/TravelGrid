import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../context/DashboardDataContext";
import { MapPin, Calendar, Heart, LogOut, Edit, Save, X } from "lucide-react";
import defaultAvatar from "../assets/defaultprofile.svg";
import axios from "axios";

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { tripCount, placeCount, countryCount } = useDashboardData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleProfileEdit = () => {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "user"; // Opens camera on mobile devices

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a preview URL
        const imageUrl = URL.createObjectURL(file);

        // TODO: Here you would typically upload to server
        // For now, we'll just update the local state
        console.log("Selected image:", file);
        console.log("Image URL:", imageUrl);

        // Update user avatar in context (temporary)
        updateUser({ ...user, avatar: imageUrl });

        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
      }
    };

    fileInput.click();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  const handleSave = () => {
    // Validate required fields
    if (!editData.name.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    if (!editData.email.trim()) {
      alert("Email cannot be empty!");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email.trim())) {
      alert("Please enter a valid email address!");
      return;
    }

    // Show backend pending alert
    alert(
      "Backend is pending! Profile update functionality will be implemented soon."
    );
    setIsEditing(false);
  };

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;

    try {
      const token = localStorage.getItem("travelgrid_token");

      await axios.delete("/api/users/me/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("travelgrid_token");
      logout();
      navigate("/login");
    } catch (error) {
      console.error(
        "Error deleting account:",
        error.response?.data?.message || error.message
      );
      alert("Failed to delete account. Please try again later.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const stats = [
    {
      label: "Trips Planned",
      value: tripCount,
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      label: "Countries Visited",
      value: countryCount,
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      label: "Saved Places",
      value: placeCount,
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 px-4 sm:px-8 md:px-16 py-10 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-pink-400 object-cover"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <button
                  className="absolute -bottom-1 -right-1 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-all duration-300 shadow-lg border-2 border-white cursor-pointer"
                  onClick={handleProfileEdit}
                  title="Change Profile Picture"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                {!isEditing ? (
                  <>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {user.email}
                    </p>

                    <button
                      onClick={handleEditClick}
                      className="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      Edit Details
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={deleteAccount}
              className="mt-2 bg-transparent border border-red-500 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/20 shadow-lg shadow-pink-900/20"
              onClick={() => {
                if (stat.label === "Trips Planned")
                  navigate("/dashboard/trips");
                else if (stat.label === "Countries Visited")
                  navigate("/dashboard/countries");
                else if (stat.label === "Saved Places")
                  navigate("/dashboard/saved");
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {stat.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="text-pink-400">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-action section */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-6 sm:p-10 text-center mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Ready to explore more?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            Plan your next trip or discover new destinations around the world!
          </p>
          <button
            onClick={() => navigate("/discover")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer"
          >
            Discover New Places
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
