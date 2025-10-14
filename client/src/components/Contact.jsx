import emailjs from "@emailjs/browser";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Custom/Navbar";
import { motion, AnimatePresence } from "framer-motion";

// Import specific icons from lucide-react (or your preferred icon library)
import { Mail as LuMail, Phone as LuPhone, MapPin as LuMapPin, Loader, CheckCircle } from "lucide-react";

// Environment variables from Vite
const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_USER_ID;

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!serviceID || !templateID || !publicKey) {
      alert(
        "EmailJS environment variables ARE NOT SET. Please check .env file for VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY."
      );
      setIsLoading(false);
      return;
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3500);
    } catch (error) {
      alert("Message failed to send. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔧 ENHANCED: Contact cards with clickable actions for better UX
  // Each card now includes:
  // - type: Determines the action type (email, whatsapp, or location)
  // - link: The href/URL that will be opened when clicked
  // - isClickable: Boolean flag to indicate if the card should be clickable
  const contactCards = [
    { 
      icon: '✈️', 
      title: 'Email Inquiry', 
      info: 'hello@travelgrid.com', 
      sub: 'Response within 2 hours', 
      bg: 'bg-gradient-to-br from-black/80 to-pink-900/80 hover:from-black/90 hover:to-pink-800/90', 
      color: 'text-pink-300', 
      iconBg: 'from-blue-500 to-blue-600',
      type: 'email', // Email type for mailto: link
      link: 'mailto:hello@travelgrid.com', // Opens default email client with pre-filled email address
      isClickable: true // Makes the card clickable
    },
    { 
      icon: '📱', 
      title: 'WhatsApp Support', 
      info: '+91 1234567890', 
      sub: 'Emergency assistance', 
      bg: 'bg-gradient-to-br from-black/80 to-pink-900/80 hover:from-black/90 hover:to-pink-800/90', 
      color: 'text-pink-300', 
      iconBg: 'from-green-500 to-green-600',
      type: 'whatsapp', // WhatsApp type for WhatsApp Web link
      link: 'https://wa.me/911234567890', // Opens WhatsApp chat with the number (format: country code + number without + or spaces)
      isClickable: true // Makes the card clickable
    },
    { 
      icon: '📍', 
      title: 'Visit Our Office', 
      info: 'Xyz, New Delhi', 
      sub: 'Mon-Fri: 9AM-6PM', 
      bg: 'bg-gradient-to-br from-black/80 to-pink-900/80 hover:from-black/90 hover:to-pink-800/90', 
      color: 'text-pink-300', 
      iconBg: 'from-purple-500 to-purple-600',
      type: 'location', // Location type (not clickable in this implementation)
      link: null, // No link for location card
      isClickable: false // Not clickable
    }
  ];

  // 🎯 FUNCTION: Handle contact card click
  // This function is called when a clickable contact card is clicked
  // It opens the appropriate action based on the card type:
  // - Email: Opens default email client with mailto: link
  // - WhatsApp: Opens WhatsApp Web or app with the phone number
  // 
  // IMPLEMENTATION DETAILS:
  // For email: Creates and clicks a hidden anchor tag (most reliable method)
  // - Avoids browser selection dialogs that can occur with window.location.href
  // - Works consistently across all browsers and operating systems
  // - Properly triggers the system's default email client (Outlook, Gmail, Apple Mail, etc.)
  const handleCardClick = (card) => {
    // Only proceed if the card is marked as clickable and has a valid link
    if (card.isClickable && card.link) {
      
      if (card.type === 'email') {
        // 📧 EMAIL HANDLING: Use anchor element method for maximum compatibility
        // Create a temporary anchor element
        const anchor = document.createElement('a');
        // Set the mailto: link
        anchor.href = card.link;
        // Set target to _self to open in same window (standard for mailto:)
        anchor.target = '_self';
        // Add to DOM temporarily (required for some browsers like Safari)
        document.body.appendChild(anchor);
        // Programmatically trigger the click event
        // This opens the default email client without browser selection dialog
        anchor.click();
        // Clean up: remove the temporary anchor from DOM
        document.body.removeChild(anchor);
      } 
      else if (card.type === 'whatsapp') {
        // 💬 WHATSAPP HANDLING: Open in new tab
        // Opens WhatsApp Web or native app depending on device
        window.open(card.link, '_blank', 'noopener,noreferrer');
      }
      else {
        // 🔗 OTHER LINKS: Generic handling for future link types
        window.open(card.link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-black to-pink-900"
          : "bg-gradient-to-br from-rose-50 via-gray-100 to-rose-200"
      }`}
    >
      <Navbar />

      {/* Hero Section */}
      <div
        className={`py-32 px-4 relative overflow-hidden ${
          isDarkMode
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        {isDarkMode && (
            <>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-700 opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-700 opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </>
        )}
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-widest font-semibold text-pink-500 mb-2"
          >
            Connect With Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight mt-4"
          >
            Let's Start Your <span className="text-pink-500">Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-xl md:text-2xl max-w-3xl mx-auto font-light ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Planning your next adventure? We're here to help make it unforgettable!
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className={`rounded-2xl shadow-2xl p-8 border ${isDarkMode
            ? 'bg-gradient-to-br from-black to-pink-900 border-white/20'
            : 'bg-white border-rose-200'
            }`}>
            <h3 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Contact Information</h3>
            <div className="space-y-6">
              {/* 
                🎨 ENHANCED CONTACT CARDS: Now clickable with visual feedback
                - Cards with isClickable=true will open email/WhatsApp when clicked
                - Hover effects indicate interactivity (cursor-pointer, enhanced scale)
                - Visual cues help users understand which cards are clickable
                - Accessibility: Cards use onClick for keyboard navigation support
              */}
              {contactCards.map((card, index) => (
                <div 
                  key={index} 
                  // onClick handler: Calls handleCardClick when card is clicked
                  // Only functional for clickable cards (email, WhatsApp)
                  onClick={() => handleCardClick(card)}
                  // Conditional cursor styling:
                  // - cursor-pointer: Shows hand cursor for clickable cards (better UX)
                  // - cursor-default: Normal cursor for non-clickable cards
                  className={`flex items-center p-6 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-xl ${
                    // Enhanced hover scale for clickable cards (1.05 → 1.07) for better visual feedback
                    card.isClickable ? 'hover:scale-[1.07] cursor-pointer' : 'hover:scale-105 cursor-default'
                  } ${isDarkMode
                  ? `${card.bg} border border-pink-500/30 hover:border-pink-400/50`
                  : 'bg-white border border-gray-200 hover:border-rose-300'
                  }`}
                  // Accessibility: Add role and aria-label for screen readers
                  role={card.isClickable ? "button" : "article"}
                  aria-label={card.isClickable ? `Click to ${card.type === 'email' ? 'send email to' : 'open WhatsApp chat with'} ${card.info}` : card.title}
                  // Keyboard accessibility: Make clickable cards focusable and activatable with Enter/Space
                  tabIndex={card.isClickable ? 0 : -1}
                  onKeyDown={(e) => {
                    // Allow Enter or Space key to trigger the card click for keyboard users
                    if (card.isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault(); // Prevent page scroll on Space key
                      handleCardClick(card);
                    }
                  }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.iconBg} rounded-xl flex items-center justify-center text-white text-2xl mr-5 shadow-lg`}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{card.title}</h4>
                    <p className={`${card.color} font-semibold text-base`}>{card.info}</p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl shadow-3xl p-8 md:p-12 border ${
              isDarkMode
                ? "bg-black/50 backdrop-blur-md border-pink-700/30 shadow-pink-900/40"
                : "bg-white/90 backdrop-blur-sm border-rose-300/50 shadow-rose-200/50"
            }`}
          >
            <h2
              className={`text-3xl font-bold mb-10 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Send us a Message
            </h2>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                  className="text-center py-16 px-4"
                >
                  <motion.div
                    initial={{ rotate: -180, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-xl"
                  >
                    {/* UPDATED: Success icon using React Icons (CheckCircle) */}
                    <CheckCircle size={40} strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-3xl font-extrabold text-green-500 mb-4">
                    Message Sent Successfully!
                  </h3>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Our travel experts will review your request and get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {[
                    {
                      name: "name",
                      type: "text",
                      placeholder: "Your Full Name",
                      label: "Your Name",
                    },
                    {
                      name: "email",
                      type: "email",
                      placeholder: "name@example.com",
                      label: "Email Address",
                    },
                    {
                      name: "message",
                      type: "textarea",
                      placeholder: "Tell us about your dream destination, budget, and travel dates...",
                      label: "Message",
                    },
                  ].map((field, index) => (
                    <div key={index}>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          rows="6"
                          value={formData[field.name]}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none resize-none focus:ring-4 focus:shadow-lg ${
                            isDarkMode
                              ? "border-pink-500/50 bg-white/5 text-white placeholder-gray-500 focus:ring-pink-600/30"
                              : "border-rose-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-rose-200"
                          }`}
                          placeholder={field.placeholder}
                          required
                          disabled={isLoading}
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none focus:ring-4 focus:shadow-lg ${
                            isDarkMode
                              ? "border-pink-500/50 bg-white/5 text-white placeholder-gray-500 focus:ring-pink-600/30"
                              : "border-rose-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-rose-200"
                          }`}
                          placeholder={field.placeholder}
                          required
                          disabled={isLoading}
                        />
                      )}
                    </div>
                  ))}
                  <motion.button
                    aria-label="Send message"
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-lg py-4 rounded-xl transition-all transform hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-400/50 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        {/* UPDATED: Loading spinner using React Icons (Loader) */}
                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;