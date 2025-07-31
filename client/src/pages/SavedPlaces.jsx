import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDashboardData } from '../context/DashboardDataContext';

const SavedPlaces = () => {
    const navigate = useNavigate();
    const { setPlaceCount } = useDashboardData(); // ✅ Correct context setter

    const [places, setPlaces] = useState([]);

    let toastShown = false;

    useEffect(() => {
        const fetchSavedPlaces = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                if (!toastShown) toast.error('You must be logged in to view saved places');
                toastShown = true;
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/save/my-saved-places', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    setPlaces(data.savedPlaces);
                    setPlaceCount(data.savedPlaces.length);
                    if (!toastShown) {
                        toast.success('Loaded saved places!');
                        toastShown = true;
                    }
                } else {
                    console.error(data.message);
                    if (!toastShown) {
                        toast.error(data.message || 'Failed to load saved places.');
                        toastShown = true;
                    }
                }
            } catch (err) {
                console.error('Fetch failed:', err);
                if (!toastShown) {
                    toast.error('Error fetching saved places.');
                    toastShown = true;
                }
            }
        };

        fetchSavedPlaces();
    }, [setPlaceCount]);

    // Function to handle deleting a saved place
    const handleDelete = async (placeId) => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5000/api/save/delete/${placeId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Place removed from saved list!');
                // Refresh places
                setPlaces(prev => prev.filter(place => place.placeId !== placeId));
            } else {
                toast.error(data.message || 'Could not delete the place');
            }
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Something went wrong while deleting!');
        }
    };



    // ✅ Correct useEffect with context
    useEffect(() => {
        setPlaceCount(places.length);
    }, [places, setPlaceCount]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 p-6 flex justify-center items-center">
            <div className="w-full max-w-4xl">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Saved Places</h2>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition hover: cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto pr-2 custom-scroll">
                        <ul className="space-y-4">
                            {places.map((place, index) => (
                                <li
                                    key={index}
                                    className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                                >
                                    <h3 className="text-white font-semibold">{place.name}</h3>
                                    <p className="text-gray-300 text-sm">{place.description}</p>
                                    <button
                                        onClick={() => navigate(`/hotels/${place.placeId}`)}
                                        className="mt-2 text-pink-400 hover:underline text-sm"
                                    >
                                        View Hotel
                                    </button>

                                    <button
                                        onClick={() => handleDelete(place.placeId)}
                                        className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedPlaces;





