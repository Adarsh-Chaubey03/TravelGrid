import React, { useState } from "react";
import "./TravelPersona.css";

const questions = [
  {
    question: "What excites you most about travel?",
    options: ["Adventure", "Relaxation", "Culture", "Nature"]
  },
  {
    question: "Your ideal accommodation?",
    options: ["Hostel", "Luxury Hotel", "Homestay", "Camping"]
  },
  {
    question: "Favorite travel activity?",
    options: ["Hiking", "Spa", "Museum", "Wildlife"]
  },
  {
    question: "Preferred travel pace?",
    options: ["Fast & Spontaneous", "Slow & Planned", "Balanced", "Flexible"]
  }
];

const personaMap = {
  Adventure: "The Adventurer",
  Relaxation: "The Relaxer",
  Culture: "The Culture Seeker",
  Nature: "The Nature Lover"
};

function TravelPersonaQuiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  function handleOption(option) {
    const newAnswers = [...answers, option];
    if (current < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
    } else {
      setAnswers(newAnswers);
      const persona = getPersona(newAnswers);
      onComplete(persona);
    }
  }

  function getPersona(ans) {
    const freq = {};
    ans.forEach(a => { freq[a] = (freq[a] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    return personaMap[top] || "The Explorer";
  }

  return (
    <div className="travel-persona-quiz">
      <h2>Travel Persona Quiz</h2>
      <div className="quiz-question">
        <p>{questions[current].question}</p>
        <div className="quiz-options">
          {questions[current].options.map(option => (
            <button key={option} onClick={() => handleOption(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="quiz-progress">Question {current + 1} of {questions.length}</div>
    </div>
  );
}

export default TravelPersonaQuiz;