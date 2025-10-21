import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../context/DashboardDataContext';
import { MapPin, Calendar, Heart, LogOut, Building2, Edit, Save, X } from 'lucide-react';
import hotels from '../data/hotels';
import axios from 'axios';
import { config } from '../config';


import defaultAvatar from '../assets/defaultprofile.svg';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const { tripCount, placeCount, countryCount } = useDashboardData();

    const [bookedHotels, setBookedHotels] = useState([]);
    const [showHotels, setShowHotels] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const API_BASE = config.API_BASE_URL;

    // --- Fetch Bookings ---
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userId = user?.id || user?._id;
                const res = await axios.get(`${API_BASE}/api/users/${user?.id}`);
                const bookingsData = Array.isArray(res.data) ? res.data : res.data?.bookings || [];

                const bookingsWithHotels = bookingsData.map((booking) => {
                    const hotel = hotels.find((h) => h._id === booking.hotelId);
                    return { ...booking, hotel };
                });

                setBookedHotels(
                    bookingsWithHotels.map((b) => ({
                        bookedBy: b.name || 'Unknown User',
                        name: b.hotelId || 'Unknown Hotel',
                        bookedAt: b.createdAt || '',
                    }))
                );
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
        };

        if (user?.id) fetchBookings();
    }, [user?.id]);


    /** Handle profile picture selection **/
    const handleProfileEdit = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setSelectedImage(file); // bas file save karo
                // UI preview ke liye temporary URL
                const imageUrl = URL.createObjectURL(file);
                setEditData((prev) => ({ ...prev, picture: imageUrl }));
            }
        };
        fileInput.click();
    };


    /** Enable editing mode **/
    const handleEditClick = () => {
        setIsEditing(true);
        setEditData({
            name: user?.name || '',
            email: user?.email || ''
        });
    };

    /** Save profile changes **/
    const handleSave = async () => {
        if (!editData.name.trim()) return toast.error('Name cannot be empty!');
        if (!editData.email.trim()) return toast.error('Email cannot be empty!');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email.trim())) return toast.error('Enter valid email!');

        try {
            const token = localStorage.getItem('jwt_token');
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('email', editData.email);
            if (selectedImage) formData.append('picture', selectedImage);

            const res = await axios.put(
                `${API_BASE}/api/users/${user?.id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data?.user) {
                updateUser(res.data.user); // Context update
                localStorage.setItem("travelgrid_user", JSON.stringify(res.data.user)); // Persist update
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                setSelectedImage(null);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    };



    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            name: user?.name || '',
            email: user?.email || ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const stats = [
        {
            label: "Trips Planned",
            value: tripCount,
            icon: <MapPin className="w-6 h-6" />
        },
        {
            label: "Countries Visited",
            value: countryCount,
            icon: <Calendar className="w-6 h-6" />
        },
        {
            label: "Saved Places",
            value: placeCount,
            icon: <Heart className="w-6 h-6" />
        },
        {
            label: "Hotels Booked",
            value: bookedHotels.length,
            icon: <Building2 className="w-6 h-6" />
        }
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
                                    src={selectedImage ? URL.createObjectURL(selectedImage) : user.picture || defaultAvatar}
                                    alt={user.name}
                                    loading="lazy" 
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-pink-400 object-cover"
                                    onError={(e) => {
                                        e.target.src = defaultAvatar;
                                    }}
                                />
                                {isEditing && (
                                    <button
                                        className="absolute -bottom-1 -right-1 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-all duration-300 shadow-lg border-2 border-white cursor-pointer"
                                        onClick={handleProfileEdit}
                                        title="Change Profile Picture"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>)}
                            </div>
                            <div className="flex-1">
                                {!isEditing ? (
                                    <>
                                        <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome back, {user.name}!</h1>
                                        <p className="text-gray-300 text-sm sm:text-base">{user.email}</p>

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
                    </div>
                </div>



                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/20 shadow-lg shadow-pink-900/20"
                            onClick={() => {
                                if (stat.label === 'Trips Planned') navigate('/dashboard/trips');
                                else if (stat.label === 'Countries Visited') navigate('/dashboard/countries');
                                else if (stat.label === 'Saved Places') navigate('/dashboard/saved');
                                else if (stat.label === 'Hotels Booked') setShowHotels(prev => !prev);
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm sm:text-base">{stat.label}</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className="text-pink-400">{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booked Hotels Section */}
                {showHotels && bookedHotels.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-white mb-4">Your Booked Hotels</h2>
                        <ul className="space-y-4">
                            {bookedHotels.map((hotel, index) => (
                                <li
                                    key={index}
                                    className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-md shadow-pink-900/20"
                                >
                                    <p className="text-white text-lg font-semibold">
                                        {hotel.name || `Hotel #${index + 1}`}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Booked by: {hotel.bookedBy || `Hotel #${index + 1}`}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Booked on: {hotel.bookedAt ? new Date(hotel.bookedAt).toLocaleString() : 'N/A'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Call-to-action section */}
                <div className="bg-white/5 border border-white/20 rounded-2xl p-6 sm:p-10 text-center mt-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Ready to explore more?</h2>
                    <p className="text-gray-300 text-sm sm:text-base mb-4">
                        Plan your next trip or discover new destinations around the world!
                    </p>
                    <button
                        onClick={() => navigate('/DiscovermoreDestination')}
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
