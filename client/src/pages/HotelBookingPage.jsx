import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import "./styles/HotelBookingPage.css";

const hotelsData = [
  { id: 1, name: "The Grand Palace", price: 2200, rating: 4.5 },
  { id: 2, name: "Oceanview Resort", price: 3500, rating: 4.8 },
  { id: 3, name: "Mountain Escape", price: 1500, rating: 4.2 },
  { id: 4, name: "City Central Inn", price: 1800, rating: 4.0 },
  { id: 5, name: "Sunset Boulevard Hotel", price: 2700, rating: 4.6 },
  { id: 6, name: "Desert Mirage Stay", price: 1300, rating: 3.9 },
  { id: 7, name: "Forest Retreat", price: 2000, rating: 4.3 },
  { id: 8, name: "Lakeside Paradise", price: 3000, rating: 4.7 },
  { id: 9, name: "Budget Comfort Inn", price: 999, rating: 3.5 },
  { id: 10, name: "Sky High Suites", price: 4200, rating: 4.9 },
];

const HotelBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredHotels = hotelsData
    .filter((hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="hotel-page">
      <h1>Find Your Perfect Stay</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Sort By</option>
          <option value="price">Price: Low to High</option>
          <option value="rating">Rating: High to Low</option>
        </select>
      </div>

      <div className="hotel-list">
        {filteredHotels.map((hotel) => (
          <div className="hotel-card" key={hotel.id}>
            <h2>{hotel.name}</h2>
            <p>Price: ₹{hotel.price} / night</p>
            <p>Rating: ⭐ {hotel.rating}</p>
            <button onClick={() => {
              // Temporarily bypass authentication for testing
              // if (!user) {
              //   toast.error('Please login to book a hotel');
              //   return;
              // }
              navigate('/hotel-booking', { state: { hotel } });
            }}>Book Now</button>
          </div>
        ))}
      </div>


    </div>
  );
};

export default HotelBookingPage;
