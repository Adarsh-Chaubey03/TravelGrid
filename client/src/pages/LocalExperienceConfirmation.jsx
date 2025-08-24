import React from "react";

export default function LocalExperienceConfirmation() {
  return (
    <div className="local-experience-confirmation" style={{textAlign: 'center', padding: '3rem'}}>
      <h2>Thank you for booking this experience!</h2>
      <p>We appreciate your interest in local adventures. You will receive further details soon.</p>
      <a href="/local-experiences" className="back-btn">Back to Experiences</a>
    </div>
  );
}