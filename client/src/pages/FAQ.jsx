import React, { useState } from "react";

const faqs = [
  {
    question: "How do I book flights, trains, or buses on TravelGrid?",
    answer:
      "Simply search for your preferred route and dates, compare options, and follow the booking prompts. You can book flights, trains, and buses all in one place.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept major credit/debit cards, UPI, net banking, and select digital wallets. All payments are securely processed.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, most bookings can be cancelled or modified from your account dashboard. Cancellation policies vary by provider, so please review the terms before booking.",
  },
  {
    question: "What are TravelGrid’s travel packages?",
    answer:
      "Our curated travel packages bundle flights, hotels, and activities for popular destinations, offering convenience and savings. You can also customize packages to fit your needs.",
  },
  {
    question: "How do I rent a vehicle?",
    answer:
      "Go to the vehicle rentals section, enter your location and dates, and choose from a range of cars, bikes, and more. Book instantly and manage your rental from your account.",
  },
  {
    question: "How do I reserve a hotel?",
    answer:
      "Browse hotels by destination, filter by amenities, and book directly. You’ll receive instant confirmation and can manage reservations in your account.",
  },
  {
    question: "How do I manage my TravelGrid account?",
    answer:
      "Log in to your account to view bookings, manage personal details, access support, and more. For help, visit the Support or Contact Us pages.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes, we use industry-standard encryption and never share your data without consent. Read our Privacy Policy for details.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="min-h-[70vh] flex flex-col items-center py-12 px-4 md:px-0">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-6 text-center drop-shadow-sm">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-lg mb-10 text-center">
          Find answers to common questions about booking, payments, cancellations, and more on TravelGrid.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border ${
                  isOpen ? "border-pink-300 ring-1 ring-pink-200" : "border-pink-100"
                } bg-white shadow-sm overflow-hidden transition-all duration-200`}
              >
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  className={`w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-150 ${
                    isOpen ? "bg-pink-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-lg font-semibold transition-colors duration-150 ${
                      isOpen ? "text-pink-700" : "text-gray-800"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-pink-500" : "text-pink-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  id={`faq-panel-${idx}`}
                  className={`px-6 text-gray-700 text-base transition-all duration-400 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-80 opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"
                  }`}
                  style={{ transitionProperty: "max-height, opacity, padding-bottom" }}
                >
                  <div className="pt-2">{faq.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}