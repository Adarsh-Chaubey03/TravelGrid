import React, { useState } from "react";
import TravelPersonaQuiz from "../components/TravelPersona/TravelPersonaQuiz";
import TravelPersonaResult from "../components/TravelPersona/TravelPersonaResult";

function TravelPersona() {
  const [persona, setPersona] = useState(null);

  function handleComplete(result) {
    setPersona(result);
  }
  function handleRestart() {
    setPersona(null);
  }

  return (
    <div>
      {!persona ? (
        <TravelPersonaQuiz onComplete={handleComplete} />
      ) : (
        <TravelPersonaResult persona={persona} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default TravelPersona;