import React from "react";

export default function LocalExperienceDetail({ experience, onBack }) {
  if (!experience) return null;
  return (
    <div className="local-experience-detail">
      <button onClick={onBack}>Back to List</button>
      <img src={experience.image} alt={experience.title} className="experience-image-large" />
      <h2>{experience.title}</h2>
      <p><strong>Host:</strong> {experience.host}</p>
      <p><strong>Location:</strong> {experience.location}</p>
      <p><strong>Price:</strong> ${experience.price}</p>
      <p>{experience.description}</p>
      <button className="book-btn" onClick={() => window.location.href = '/local-experiences/confirmation'}>Book Experience</button>
    </div>
  );
}