import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Custom/Navbar';

// For Vite, env vars must be prefixed with VITE_
const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_USER_ID;

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if env vars are present
    if (!serviceID || !templateID || !publicKey) {
      alert(
        'EmailJS environment variables ARE NOT SET. Please check .env file for VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
      );
      return;
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (error) {
      alert('Message failed to send. Please try again.');
    }
  };

  const contactCards = [
    { 
      icon: '✈️', 
      title: 'Travel Inquiries', 
      info: 'hello@travelgrid.com', 
      sub: 'Response within 2 hours'
    },
    { 
      icon: '🌍', 
      title: '24/7 Support', 
      info: '+91 1234567890', 
      sub: 'Emergency assistance'
    },
    { 
      icon: '📍', 
      title: 'Visit Our Office', 
      info: 'Xyz, New Delhi', 
      sub: 'Mon-Fri: 9AM-6PM'
    }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${
      isDarkMode
        ? "bg-gradient-to-br from-black to-pink-900"
        : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300"
    }`}>
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Touch
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Planning your next adventure? We're here to help make it unforgettable!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className={`backdrop-blur-md rounded-2xl p-8 border ${
            isDarkMode 
              ? "bg-white/10 border-white/20" 
              : "bg-white/30 border-black/10"
          }`}>
            <h3 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Contact Information
            </h3>
            <div className="space-y-6">
              {contactCards.map((card, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 p-6 rounded-xl border transition-all ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 hover:bg-white/10" 
                      : "bg-white/50 border-black/10 hover:bg-white/70"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}>
                      {card.title}
                    </h4>
                    <p className={`font-medium mb-1 ${
                      isDarkMode ? "text-pink-400" : "text-pink-600"
                    }`}>
                      {card.info}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {card.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className={`backdrop-blur-md rounded-2xl p-8 border ${
            isDarkMode 
              ? "bg-white/10 border-white/20" 
              : "bg-white/30 border-black/10"
          }`}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Send us a Message
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}>
                  Message Sent!
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Our travel experts will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white/50 border-black/20 text-gray-800 placeholder-gray-600"
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white/50 border-black/20 text-gray-800 placeholder-gray-600"
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white/50 border-black/20 text-gray-800 placeholder-gray-600"
                    }`}
                    placeholder="Tell us about your dream destination..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  aria-label="Send Message"
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;