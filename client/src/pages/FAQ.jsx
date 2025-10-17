import React, { useState } from 'react';

const faqs = [
  {
    question: 'How do I book flights, trains, or buses on TravelGrid?',
    answer: 'Simply search for your preferred route and dates, compare options, and follow the booking prompts. You can book flights, trains, and buses all in one place.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit/debit cards, UPI, net banking, and select digital wallets. All payments are securely processed.'
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes, most bookings can be cancelled or modified from your account dashboard. Cancellation policies vary by provider, so please review the terms before booking.'
  },
  {
    question: 'What are TravelGrid’s travel packages?',
    answer: 'Our curated travel packages bundle flights, hotels, and activities for popular destinations, offering convenience and savings. You can also customize packages to fit your needs.'
  },
  {
    question: 'How do I rent a vehicle?',
    answer: 'Go to the vehicle rentals section, enter your location and dates, and choose from a range of cars, bikes, and more. Book instantly and manage your rental from your account.'
  },
  {
    question: 'How do I reserve a hotel?',
    answer: 'Browse hotels by destination, filter by amenities, and book directly. You’ll receive instant confirmation and can manage reservations in your account.'
  },
  {
    question: 'How do I manage my TravelGrid account?',
    answer: 'Log in to your account to view bookings, manage personal details, access support, and more. For help, visit the Support or Contact Us pages.'
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes, we use industry-standard encryption and never share your data without consent. Read our Privacy Policy for details.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-0 bg-gradient-to-br from-black to-pink-900">
      <div className="w-full max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-4 text-center drop-shadow-lg">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-400 text-lg mb-10 text-center max-w-xl mx-auto">
          Find answers to common questions about booking, payments, cancellations, and more on TravelGrid.
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              // Improved base styling: more subtle dark background, stronger focus state with a border
              className={`rounded-2xl border transition-all duration-300 ease-out transform ${
                openIndex === idx
                  ? 'border-pink-500/80 shadow-2xl shadow-purple-500/20 bg-slate-800' // Open state
                  : 'border-slate-700 hover:border-pink-500/40 bg-slate-900/80 hover:bg-slate-800/80' // Closed state
              }`}
            >
              <button
                className="w-full flex justify-between items-start px-6 md:px-8 py-5 text-left rounded-2xl group focus:outline-none"
                onClick={() => toggle(idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-panel-${idx}`}
              >
                <span className="text-lg md:text-xl font-semibold bg-clip-text text-transparent transition-all duration-300 leading-snug pr-4
                  bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-blue-300
                  ">
                  {faq.question}
                </span>
                
                {/* Arrow icon styling improved for better contrast and gradient use */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out mt-1 ${
                  openIndex === idx 
                    ? 'bg-gradient-to-br from-pink-600 to-purple-700 rotate-180 scale-105 shadow-md shadow-pink-500/40' 
                    : 'bg-slate-700 group-hover:bg-slate-600'
                }`}>
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${openIndex === idx ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Answer Panel: Added a glowing left border for visual depth */}
              <div
                id={`faq-panel-${idx}`}
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === idx 
                    ? 'max-h-64 opacity-100' 
                    : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 md:px-8 pb-5 pt-0">
                  <div className="border-l-4 border-pink-500/70 pl-6 py-2 transition-all duration-500 ease-out">
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}