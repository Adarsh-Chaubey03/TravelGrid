import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../context/DashboardDataContext';
import QRGenerator from '../components/QRShare/QRGenerator';


const TripsPlanned = () => {
  const navigate = useNavigate();
  const { setTripCount } = useDashboardData();
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`, {
        credentials: 'include', // 🔐 Include cookie
      });
      const data = await res.json();
      if (res.ok) {
        setTrips(data);
        setTripCount(data.length);
      } else {
        console.error('Failed to fetch trips:', data.message);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 🔐 Include cookie
      });

      const data = await res.json();
      if (res.ok) {
        // Refresh the trips after deletion
        setTrips((prev) => prev.filter((trip) => trip._id !== id));
        setTripCount((prev) => prev - 1);
      } else {
        console.error('Delete failed:', data.message);
      }
    } catch (err) {
      console.error('Delete request failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Trips Planned</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>


          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scroll">
            <div className="space-y-4">
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition"
                  >
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {trip.destination}, {trip.country}
                      </h3>
                      {trip.startDate && (
                        <p className="text-pink-300 text-sm">
                          {new Date(trip.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {trip.numberOfDays} Days
                      </span>
                      <QRGenerator 
                        tripId={trip._id} 
                        tripTitle={`${trip.destination}, ${trip.country}`}
                      />
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="text-sm text-red-500 hover:text-red-600 px-2 py-1"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-pink-300 text-center mt-4">No trips found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsPlanned;
