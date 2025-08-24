

import React from "react";
import "./TravelPersona.css";

const recommendations = {
  "The Adventurer": ["Try hiking in Patagonia", "Go bungee jumping in New Zealand"],
  "The Relaxer": ["Book a spa retreat in Bali", "Enjoy beaches in Maldives"],
  "The Culture Seeker": ["Explore museums in Paris", "Visit temples in Kyoto"],
  "The Nature Lover": ["Safari in Kenya", "Camping in Yosemite"],
  "The Explorer": ["Mix and match experiences worldwide!"]
};

function TravelPersonaResult({ persona, onRestart }) {
  return (
    <div className="travel-persona-result">
      <h2>Your Travel Persona:</h2>
      <div className="persona-title">{persona}</div>
      <h3>Recommended Experiences:</h3>
      <ul>
        {(recommendations[persona] || recommendations["The Explorer"]).map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
      <button onClick={onRestart}>Retake Quiz</button>
    </div>
  );
}

export default TravelPersonaResult;