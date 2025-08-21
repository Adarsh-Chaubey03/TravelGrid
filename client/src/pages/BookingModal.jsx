import React, { useState } from "react";
import axios from "axios";

const BookingModal = ({ hotelId, userId, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);
    const payload = {
    ...form,
    hotelId,
    user: userId,
  };

  console.log("Booking payload:", payload);
    try {
      await axios.post("https://travelgrid.onrender.com/api/bookings", {
        ...form,
        hotelId,
        user: userId,
      });
      alert("Booking confirmed!");
      onClose();
    } catch (error) {
      alert("Booking failed!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative">
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-700">
          Book Your Stay
        </h2>

        <div className="flex flex-col gap-4">
          <input
            name="name"
            onChange={handleChange}
            placeholder="Name"
            className="border border-pink-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="border border-pink-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
          />
          <input
            name="phone"
            onChange={handleChange}
            placeholder="Phone"
            className="border border-pink-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
          />

          <div className="flex flex-col">
            <label
              htmlFor="checkIn"
              className="text-sm font-medium text-pink-700 mb-1"
            >
              Check-In Date
            </label>
            <input
              id="checkIn"
              name="checkIn"
              type="date"
              onChange={handleChange}
              className="text-black bg-white border border-pink-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="checkOut"
              className="text-sm font-medium text-pink-700 mb-1"
            >
              Check-Out Date
            </label>
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              onChange={handleChange}
              className="text-black bg-white border border-pink-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <input
            name="guests"
            type="number"
            min="1"
            onChange={handleChange}
            placeholder="Number of guests"
            className="border border-pink-300 px-4 py-2 rounded-md text-black"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-semibold"
          >
            Confirm Booking
          </button>
          <button
            onClick={onClose}
            className="border border-pink-600 text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
