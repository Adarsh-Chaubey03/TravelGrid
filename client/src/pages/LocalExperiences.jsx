import React, { useState } from "react";
import LocalExperiencesList from "../components/LocalExperiences/LocalExperiencesList";
import LocalExperienceDetail from "../components/LocalExperiences/LocalExperienceDetail";

export default function LocalExperiences() {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <div className="local-experiences-page">
      <header style={{textAlign: 'center', marginTop: '2rem'}}>
        <h1>Discover Authentic Local Experiences</h1>
        <p style={{maxWidth: '600px', margin: '1rem auto', color: '#555'}}>
          Browse and book unique activities hosted by locals. Immerse yourself in culture, adventure, and creativity wherever you travel!
        </p>
      </header>
      <div style={{marginTop: '2rem'}}>
        {!selectedExperience ? (
          <LocalExperiencesList onSelect={setSelectedExperience} />
        ) : (
          <LocalExperienceDetail experience={selectedExperience} onBack={() => setSelectedExperience(null)} />
        )}
      </div>
    </div>
  );
}