import React, { useState } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { HiUser } from 'react-icons/hi';         
import { HiLocationMarker, HiArrowRight } from 'react-icons/hi'; 

import jsPDF from "jspdf";
import Navbar from "../components/Custom/Navbar";
import { useTheme } from "../context/ThemeContext";
import {
  Users,
  CalendarDays,
  MapPin,
  Plane,
  TrainFront,
  Bus,
  Car,
  ArrowRightLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const tripModes = [
  { label: "One-Way", value: "oneWay", icon: <Plane size={18} /> },
  { label: "Round Trip", value: "roundTrip", icon: <TrainFront size={18} /> },
];

const travelOptions = [
  { label: "FLIGHT", value: "flight", icon: <Plane size={18} /> },
  { label: "TRAIN", value: "train", icon: <TrainFront size={18} /> },
  { label: "BUS", value: "bus", icon: <Bus size={18} /> },
  { label: "CAB", value: "cab", icon: <Car size={18} /> },
];

function TicketBooking() {
  const [tripMode, setTripMode] = useState("oneWay");
  const [travelType, setTravelType] = useState("flight");
  const { isDarkMode } = useTheme();
  const [form, setForm] = useState({
    from: "",
    to: "",
    depart: "",
    return: "",
    passengers: 1,
    cabin: "Economy",
    petFriendly: false //adding for pet friendly feature
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [booked, setBooked] = useState(false); //adding a booked state variable to keep track if booked or not

  //Function to get today's date for validating depart date for ticker
  const getToday=()=>{
    const today = new Date();
    return today.toISOString().split('T')[0]
  }

  const confirmBooking = () => {
    //function called when flight booked.
    setBooked(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.from.trim()) {
      toast.error("Please enter a departure city");
      return;
    }

    if (!form.to.trim()) {
      toast.error("Please enter a destination city");
      return;
    }

    if (!form.depart) {
      toast.error("Please select a departure date");
      return;
    }

    if (tripMode === "roundTrip" && !form.return) {
      toast.error("Please select a return date");
      return;
    }

    if (!form.passengers || form.passengers < 1) {
      toast.error("Please select number of passengers");
      return;
    }

    setSubmitted(true);
  };

  const handleDownload = async () => {
    // Hide buttons temporarily
    const buttons = document.querySelector(".pdf-buttons");
    const prevDisplay = buttons?.style.display;
    if (buttons) buttons.style.display = "none";

    const el = document.getElementById("ticket-content");
    if (!el) return;

    const clone = el.cloneNode(true);
    // Adding pet-friendly info
    if (form.petFriendly) {
      const petNote = document.createElement("div");
      petNote.textContent = "🐾 Pet-friendly: Yes";
      petNote.style.fontSize = "20px";
      petNote.style.marginTop = "20px";
      petNote.style.color = "#d63384"; 
      clone.appendChild(petNote);
    }


    // 🧹 Remove buttons from clone only
    const buttonsToRemove = clone.querySelectorAll("button");
    buttonsToRemove.forEach((btn) => btn.remove());

    // Styling
    clone.style.fontFamily = "Arial, sans-serif";
    clone.style.padding = "30px";
    clone.style.width = "600px";
    clone.style.fontSize = "28px";
    clone.style.maxWidth = "600px";
    clone.style.margin = "0 auto";

    const removeClasses = (node) => {
      if (node instanceof HTMLElement) {
        node.className = "";
      } else if (node instanceof SVGElement) {
        node.setAttribute("class", "");
      }
      for (let child of node.children) {
        removeClasses(child);
      }
    };
    removeClasses(clone);

    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, { backgroundColor: "#fff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);

      // Add border around the full page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setLineWidth(1); // Border thickness
      pdf.rect(5, 5, pageWidth - 10, pageHeight - 10); // x, y, width, height

      pdf.save("ticket.pdf");
    } catch (err) {
      toast.error("Unable to Generate At this Moment")
    } finally {
      document.body.removeChild(clone);
      // Restore button display
      if (buttons) buttons.style.display = prevDisplay || "";
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setBooked(false);
    setForm({
      from: "",
      to: "",
      depart: "",
      return: "",
      passengers: 1,
      cabin: "Economy",
    });
  };

  
  const pluralMap = {
      bus: "Buses",
      train: "Trains",
      flight: "Flights"
    };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="relative flex flex-col flex-1 items-center w-full pt-24 pb-10 px-4">
        {/* Background city image */}
        <img
          src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80"
          alt="City skyline"
          loading="lazy" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 mt-8">
            Book Your <span className="text-pink-500">Perfect Trip</span>
          </h1>
          <p className="text-sm md:text-base">
            Search and compare prices for flights, trains, buses, and cabs all
            in one place
          </p>
        </div>
        <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-md border border-pink-400/30 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Travel type tabs - Fixed layout */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-8">
            {travelOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTravelType(opt.value)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all border ${
                  travelType === opt.value
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white/20 text-white border-transparent hover:bg-pink-700/20"
                }`}
                style={{ minWidth: 0 }}
              >
                {opt.icon}
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden text-xs">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Trip mode toggle */}
          <div className="flex gap-4 justify-center mb-10">
            {tripModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setTripMode(mode.value)}
                className={`px-6 py-2 rounded-full font-medium border transition-all ${
                  tripMode === mode.value
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-white/20 text-white border-transparent hover:bg-pink-700/20"
                }`}
                style={{ minWidth: 0 }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Form or Success Message */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto"
          >
            {/* Core search panel */}
            <div className="grid gap-4 md:grid-cols-5 md:items-end">
{/* From */}
<div className="relative col-span-2 md:col-span-2 flex flex-col">
  <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 text-xl" />
  <input
    type="text"
    name="from"
    placeholder="FROM"
    required
    value={form.from}
    onChange={handleChange}
    className={`w-full pl-10 pr-3 py-3 rounded-xl ${
      isDarkMode ? "bg-white text-gray-900" : "bg-white/90 text-gray-900"
    } placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
  />
</div>

{/* Swap button */}
<div className="flex col-span-1 items-center justify-center">
  <button
    type="button"
    title="Swap"
    onClick={() =>
      setForm((prev) => ({
        ...prev,
        from: prev.to,
        to: prev.from,
      }))
    }
    className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 transition-all flex items-center justify-center"
    style={{ zIndex: 1, margin: "0 0.5rem" }}
  >
    <ArrowRightLeft size={25} />
  </button>
</div>
{/* To */}
<div className="relative col-span-2 md:col-span-2 flex flex-col">
  <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 text-xl" />
  <input
    type="text"
    name="to"
    placeholder="TO"
    required
    value={form.to}
    onChange={handleChange}
    className={`w-full pl-10 pr-3 py-3 rounded-xl ${
      isDarkMode ? "bg-white text-gray-900" : "bg-white/90 text-gray-900"
    } placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
  />
</div>
              
{/* Depart */}
<div className="relative col-span-2 md:col-span-1">
  <CalendarDays className="absolute top-3 left-3 text-pink-400" size={18} />
  <input
    type="date"
    name="depart"
    required
    min={getToday()} // ✅ restrict to today or future
    value={form.depart}
    onChange={handleChange}
    className={`w-full pl-10 pr-3 py-3 rounded-xl ${
      isDarkMode ? "bg-white text-gray-900" : "bg-white/90 text-gray-900"
    } focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
  />
</div>
              
              <div className="flex col-span-1 items-center justify-center">
                <button
                  type="button"
                  title="Swap"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      from: prev.to,
                      to: prev.from,
                    }))
                  }
                  style={{ zIndex: 1, margin: "0 0.5rem" }}
                >
                </button>
              </div>
              {/* Return OR Passengers */}
<div className="relative col-span-2 md:col-span-2 flex flex-col">
  {tripMode === "roundTrip" ? (
    <>
      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 text-xl" />
      <input
        type="date"
        name="return"
        required
        min={form.depart}
        value={form.return}
        onChange={handleChange}
        className={`w-full pl-10 pr-3 py-3 rounded-xl ${
          isDarkMode ? "bg-white text-gray-900" : "bg-white/90 text-gray-900"
        } focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
      />
    </>
  ) : (
    <>
      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 text-xl" />
      <input
        type="number"
        name="passengers"
        min="1"
        max="10"
        required
        value={form.passengers}
        onChange={handleChange}
        placeholder="Passengers"
        className={`w-full pl-10 pr-3 py-3 rounded-xl ${
          isDarkMode ? "bg-white text-gray-900" : "bg-white/90 text-gray-900"
        } focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
      />
    </>
  )}
</div>
</div>
            {/* Extra row for Passengers + Cabin */}
            <div className="grid gap-4 sm:grid-cols-2">
              {tripMode === "roundTrip" && (
                <div className="relative">
                  <Users
                    className="absolute top-3 left-3 text-pink-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="passengers"
                    min="1"
                    max="10"
                    required
                    value={form.passengers}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl ${isDarkMode?'bg-white text-white':'bg-white/90 text-gray-800'} focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
                    placeholder="Passengers"
                  />
                </div>
              )}
<div className="w-full relative">
  {/* Cabin Dropdown */}
<select
  name="cabin"
  value={form.cabin}
  onChange={handleChange}
  className={`w-full p-3 rounded-xl ${
    isDarkMode ? "bg-white text-gray-900" : "bg-white/90 text-gray-900"
  } focus:outline-none focus:ring-4 focus:ring-pink-500/30`}
>
  {travelType === "flight" &&
    ["Economy", "Premium Economy", "Business", "First"].map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  {travelType === "train" &&
    ["Sleeper", "3A", "2A", "1A"].map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  {travelType === "bus" &&
    ["Seater", "Sleeper", "AC", "Non-AC"].map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  {travelType === "cab" &&
    ["Hatchback", "Sedan", "SUV", "Luxury"].map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
</select>

  {/* Custom dropdown arrow */}
  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
    ▼
  </span>
</div>
            </div>

            <div className="flex items-center gap-3 mt-4 text-white">
              <input
                type="checkbox"
                id="petFriendly"
                name="petFriendly"
                checked={form.petFriendly}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    petFriendly: e.target.checked,
                  }))
                }
                className={` accent-pink-600 w-5 h-5 rounded focus:ring-2 focus:ring-pink-500 `}
              />
              <label htmlFor="petFriendly" className="text-sm md:text-base font-medium">
                I’m traveling with a pet
              </label>
            </div>


            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-4 py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-xl text-lg tracking-wide shadow-lg transition-all hover:shadow-pink-700/50"
            >
              Search {pluralMap[travelType] || (travelType.charAt(0).toUpperCase() + travelType.slice(1) + 's')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default TicketBooking;