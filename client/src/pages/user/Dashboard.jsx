import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const cards = [
  {
    title: "Saved Destinations",
    icon: "🗺️",
    description: "Your favorite places and wishlists.",
    link: "/dashboard/saved"
  },
  {
    title: "Booked Flights / Hotels",
    icon: "✈️🏨",
    description: "All your bookings in one place.",
    link: "/dashboard/bookings"
  },
  {
    title: "Next Travel Plans",
    icon: "📅",
    description: "Upcoming trips and itineraries.",
    link: "/dashboard/plans"
  }
];

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] py-10 px-2 bg-gradient-to-br from-pink-50 to-fuchsia-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-pink-600 dark:text-pink-300">Welcome, {user?.name?.split(' ')[0] || 'Traveler'}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl shadow-xl bg-white dark:bg-slate-900 p-7 flex flex-col items-center justify-between transition-all hover:scale-105 hover:shadow-2xl border border-pink-100 dark:border-slate-700"
            >
              <div className="text-5xl mb-3">{card.icon}</div>
              <div className="text-xl font-semibold mb-2 text-center">{card.title}</div>
              <div className="text-gray-500 dark:text-gray-300 text-center mb-4">{card.description}</div>
              <a
                href={card.link}
                className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded-md transition-all shadow-md"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
