import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';

import { config } from '../config';

const backendUrl = config.API_BASE_URL.replace('/api', '');

const sampleUpcomingTrips = [
    {
        _id: "1",
        destination: "Paris",
        status: "Confirmed",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        people: 2
    },
    {
        _id: "2",
        destination: "Tokyo",
        status: "Pending",
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        people: 1
    }
];

const samplePastTrips = [
    {
        _id: "3",
        destination: "London",
        status: "Completed",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        bookingDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        people: 3
    },
    {
        _id: "4",
        destination: "New York",
        status: "Cancelled",
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        bookingDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        people: 2
    }
];

const fetchBookingHistory = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/bookings/getAllBookings`);
        return response.data;
    } catch (error) {
        console.error("Error fetching booking history:", error);
        return [];
    }
}

const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.post(`${backendUrl}/api/bookings/editBooking/${bookingId}`, { status: 'Cancelled' });
        return response.data;
    } catch (error) {
        console.error("Error canceling booking:", error);
        return null;
    }
}

const confirmBooking = async (bookingId) => {
    try {
        const response = await axios.post(`${backendUrl}/api/bookings/editBooking/${bookingId}`, { status: 'Completed' });
        return response.data;
    } catch (error) {
        console.error("Error completing booking:", error);
        return null;
    }
}

const rebookTrip = async (bookingId) => {
    try {
        const response = await axios.post(`${backendUrl}/api/bookings/rebook/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error("Error rebooking trip:", error);
        return null;
    }
}

const BookingHistory = () => {
    const { isDarkMode } = useTheme();

    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBookingHistory = async () => {
            setLoading(true);
            const bookings = await fetchBookingHistory();
            const upcoming = bookings.filter(booking => new Date(booking.startDate) > new Date());
            const past = bookings.filter(booking => new Date(booking.startDate) <= new Date());
            setUpcomingTrips(upcoming);
            setPastTrips(past);
            setLoading(false);
        }

        getBookingHistory();
    }, []);

    return (
        <div className={`min-h-screen pt-24 pb-20 px-4 ${
            isDarkMode
                ? "bg-gradient-to-br from-black to-pink-900"
                : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300"
        }`}>
            {/* Header Section */}
            <div className='max-w-6xl mx-auto'>
                <div className='text-center mb-12'>
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        Booking{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            History
                        </span>
                    </h1>
                    <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Check your Past Booking History & Manage your Upcoming Journey
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
                        <p className={`text-lg ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Loading Booking History...
                        </p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <TripsCard isDarkMode={isDarkMode} title="Upcoming Trips" tripsData={upcomingTrips} />
                        <TripsCard isDarkMode={isDarkMode} title="Past Trips" tripsData={pastTrips} />
                    </div>
                )}
            </div>
        </div>
    )
}

const TripsCard = ({ isDarkMode, title, tripsData }) => {
    const cancelBookingHandler = async (bookingId) => {
        const result = await cancelBooking(bookingId);
        if (result) {
            alert("Booking cancelled successfully!");
            window.location.reload();
        } else {
            alert("Failed to cancel booking.");
        }
    }

    const confirmBookingHandler = async (bookingId) => {
        const result = await confirmBooking(bookingId);
        if (result) {
            alert("Booking confirmed successfully!");
            window.location.reload();
        } else {
            alert("Failed to confirm booking.");
        }
    }

    const rebookTripHandler = async (bookingId) => {
        const result = await rebookTrip(bookingId);
        if (result) {
            alert("Trip rebooked successfully! Please check your bookings details and confirm.");
            window.location.reload();
        } else {
            alert("Failed to rebook trip.");
        }
    }

    return (
        <div className={`backdrop-blur-md rounded-2xl p-6 sm:p-8 border ${
            isDarkMode 
                ? "bg-white/10 border-white/20" 
                : "bg-white/30 border-black/10"
        }`}>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
                {title}
            </h2>
            
            {tripsData.length > 0 ? (
                <ul className='space-y-6'>
                    {tripsData.map((trip, index) => (
                        <li 
                            key={index} 
                            className={`rounded-xl p-4 sm:p-6 border transition-all ${
                                isDarkMode 
                                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                                    : "bg-white/50 border-black/10 hover:bg-white/70"
                            }`}
                        >
                            {/* Trip Header with Image */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <img 
                                    src={`/paris.jpeg`} 
                                    alt="Trip"
                                    loading="lazy"
                                    className='w-full sm:w-40 h-40 object-cover rounded-lg'
                                />
                                <div className='flex-1'>
                                    <h3 className={`text-xl font-bold mb-2 ${
                                        isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {trip.destination}
                                    </h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        trip.status === "Confirmed"
                                            ? "bg-green-500/20 text-green-500 border border-green-500/30"
                                            : trip.status === "Pending"
                                            ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                                            : trip.status === "Completed"
                                            ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                                            : "bg-red-500/20 text-red-500 border border-red-500/30"
                                    }`}>
                                        {trip.status}
                                    </span>
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                <p>
                                    <strong className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                                        Start:
                                    </strong>{" "}
                                    {new Date(trip.startDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                                        End:
                                    </strong>{" "}
                                    {new Date(trip.endDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                                        Booking Date:
                                    </strong>{" "}
                                    {new Date(trip.bookingDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                                        People:
                                    </strong>{" "}
                                    {trip.people}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-2'>
                                {trip.status === "Confirmed" ? (
                                    <ActionButton
                                        isDarkMode={isDarkMode}
                                        label="Cancel Booking"
                                        color="red"
                                        onClick={() => cancelBookingHandler(trip._id)}
                                    />
                                ) : trip.status === "Pending" ? (
                                    <ActionButton
                                        isDarkMode={isDarkMode}
                                        label="Confirm Booking"
                                        color="green"
                                        onClick={() => confirmBookingHandler(trip._id)}
                                    />
                                ) : trip.status === "Cancelled" || trip.status === "Completed" ? (
                                    <ActionButton
                                        isDarkMode={isDarkMode}
                                        label="Rebook Trip"
                                        color="blue"
                                        onClick={() => rebookTripHandler(trip._id)}
                                    />
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-12">
                    <p className={`text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        No {title.toLowerCase()} found.
                    </p>
                </div>
            )}
        </div>
    )
}

const ActionButton = ({ isDarkMode, label, color, onClick }) => {
    const colorClasses = {
        red: isDarkMode 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "bg-red-500 hover:bg-red-600 text-white",
        green: isDarkMode 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "bg-green-500 hover:bg-green-600 text-white",
        blue: isDarkMode 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
    };

    return (
        <button
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${colorClasses[color]}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default BookingHistory;