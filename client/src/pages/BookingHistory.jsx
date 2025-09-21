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
        <div className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-all duration-300`}>
            <div className='flex flex-col items-center mt-30 justify-center px-4'>
                <h1 className={`text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight drop-shadow-lg text-center transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-pink-700'}`}>
                    Booking History
                </h1>
                <p className={`text-sm sm:text-lg mb-8 opacity-80 text-center transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-pink-700'}`}>
                    Check your Past Booking History & Manage your Upcoming Journey
                </p>
            </div>
            {loading ? (
                <p className='text-sm sm:text-lg mb-8 opacity-80 text-center'> Loading Booking History....</p>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch my-2 px-2 w-full max-w-6xl mx-auto">
                    <TripsCard isDarkMode={isDarkMode} title="upcoming trips" tripsData={upcomingTrips} />
                    <TripsCard isDarkMode={isDarkMode} title="past trips" tripsData={pastTrips} />
                </div>
            )}
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
        <div className={`p-4 sm:p-8 rounded-2xl shadow-2xl m-2 sm:m-4 w-full lg:w-1/2 flex-1 transition-all duration-300 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'}`}>
            <h2 className={`capitalize text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-700'}`}>
                {title}
            </h2>
            {tripsData.length > 0 ? (
                <ul className='space-y-6'>
                    {tripsData.map((trip, index) => (
                        <li key={index} className={`border p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition ${isDarkMode ? 'border-pink-900 bg-gradient-to-r from-gray-800 to-gray-900' : 'border-pink-200 bg-gradient-to-r from-pink-50 to-white'}`}>
                            <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                                <img src={`/paris.jpeg`} 
                                alt="Trip"
                                loading="lazy"
                                className='w-full sm:w-1/2 lg:w-48 h-48 sm:h-32 object-cover rounded-lg shadow' />
                                <div className='w-full'>
                                    <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-pink-300' : 'text-pink-800'}`}>{trip.destination}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${trip.status === "Confirmed"
                                        ? isDarkMode
                                            ? "bg-green-900 text-green-300"
                                            : "bg-green-100 text-green-700"
                                        : isDarkMode
                                            ? "bg-yellow-900 text-yellow-300"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {trip.status}
                                    </span>
                                </div>
                            </div>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                                <p><strong>Start:</strong> {new Date(trip.startDate).toLocaleDateString()}</p>
                                <p><strong>End:</strong> {new Date(trip.endDate).toLocaleDateString()}</p>
                                <p><strong>Booking Date:</strong> {new Date(trip.bookingDate).toLocaleDateString()}</p>
                                <p><strong>People:</strong> {trip.people}</p>
                            </div>

                            <div className='flex flex-col sm:flex-row gap-2'>
                                {trip.status === "Confirmed" ? (
                                    <ActionButton
                                        isDarkMode={isDarkMode}
                                        label="Cancel Booking"
                                        color="pink"
                                        onClick={() => cancelBookingHandler(trip._id)}
                                    />
                                ) : trip.status === "Pending" ? (
                                    <ActionButton
                                        isDarkMode={isDarkMode}
                                        label="Confirm Booking"
                                        color="blue"
                                        onClick={() => confirmBookingHandler(trip._id)}
                                    />
                                ) : (
                                    <ActionButton
                                        isDarkMode={isDarkMode}
                                        label="Rebook Trip"
                                        color="green"
                                        onClick={() => rebookTripHandler(trip._id)}
                                    />
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>No {title} found.</p>
            )}
        </div>
    )
}

const ActionButton = ({ isDarkMode, label, color, onClick }) => (
    <button
        className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold shadow transition-all duration-300 ${isDarkMode
            ? `bg-${color}-800 text-white hover:bg-${color}-700`
            : `bg-${color}-600 text-white hover:bg-${color}-500`
            }`}
        onClick={onClick}
    >
        {label}
    </button>
);

export default BookingHistory;
