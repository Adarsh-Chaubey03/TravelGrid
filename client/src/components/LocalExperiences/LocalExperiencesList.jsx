import React, { useState } from "react";

const sampleExperiences = [
  {
    id: 1,
    title: "Traditional Cooking Class",
    host: "Maria",
    location: "Rome, Italy",
    price: 40,
    description: "Learn to cook authentic Italian pasta with a local chef.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "Guided Mountain Hike",
    host: "Luca",
    location: "Dolomites, Italy",
    price: 60,
    description: "Explore breathtaking trails with a local guide.",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    title: "Street Art Tour",
    host: "Sofia",
    location: "Berlin, Germany",
    price: 25,
    description: "Discover hidden murals and graffiti with an artist.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
  }
];

export default function LocalExperiencesList({ onSelect }) {
  const [experiences] = useState(sampleExperiences);

  return (
    <div className="local-experiences-list">
      <h2>Local Experiences Marketplace</h2>
      <div className="experiences-grid">
        {experiences.map(exp => (
          <div key={exp.id} className="experience-card" onClick={() => onSelect(exp)}>
            <img src={exp.image} alt={exp.title} className="experience-image" />
            <h3>{exp.title}</h3>
            <p><strong>Host:</strong> {exp.host}</p>
            <p><strong>Location:</strong> {exp.location}</p>
            <p><strong>Price:</strong> ${exp.price}</p>
            <p>{exp.description}</p>
            <button>View & Book</button>
          </div>
        ))}
      </div>
    </div>
  );
}