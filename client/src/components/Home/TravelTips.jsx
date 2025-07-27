import React, { useEffect } from 'react';

const TravelTips = () => {
  useEffect(() => {
    const tips = [
      "Always carry a power bank while exploring remote places.",
      "Use TravelGride's guide filter to find locals who speak your language.",
      "Carry a digital copy of your ID and travel insurance.",
      "Ask your guide about lesser-known photo spots!",
      "Check local weather before finalizing your itinerary.",
    ];
    let tipIndex = 0;
    const interval = setInterval(() => {
      const tipElement = document.getElementById("travel-tip");
      if (tipElement) {
        tipElement.textContent = tips[tipIndex];
        tipIndex = (tipIndex + 1) % tips.length;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4 bg-blue-100 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold">Travel Tip:</h2>
      <p id="travel-tip" className="mt-2 text-gray-700">Always carry a power bank while exploring remote places.</p>
    </div>
  );
};

export default TravelTips;
