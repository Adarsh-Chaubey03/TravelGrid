import React, { useState } from 'react';
import Navbar from './Custom/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const contactCards = [
    { icon: '✈️', title: 'Travel Inquiries', info: 'hello@travelgrid.com', sub: 'Response within 2 hours', bg: 'bg-blue-50 hover:bg-blue-100', color: 'text-blue-600', iconBg: 'from-blue-500 to-blue-600' },
    { icon: '🌍', title: '24/7 Support', info: '+91 1234567890', sub: 'Emergency assistance', bg: 'bg-green-50 hover:bg-green-100', color: 'text-green-600', iconBg: 'from-green-500 to-green-600' },
    { icon: '📍', title: 'Visit Our Office', info: 'Xyz, New Delhi', sub: 'Mon-Fri: 9AM-6PM', bg: 'bg-purple-50 hover:bg-purple-100', color: 'text-purple-600', iconBg: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white py-24 px-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Get in <span className="text-yellow-400 dark:text-pink-400">Touch</span>
          </h1>
          <p className="text-xl opacity-95 max-w-2xl mx-auto">
            Planning your next adventure? We're here to help make it unforgettable!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center transition-colors duration-300">Contact Information</h3>
            <div className="space-y-6">
              {contactCards.map((card, index) => (
                <div key={index} className={`flex items-center p-4 ${card.bg} dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.iconBg} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{card.title}</h4>
                    <p className={`${card.color} dark:text-pink-400 font-medium transition-colors duration-300`}>{card.info}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-pink-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center transition-colors duration-300">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 transition-colors duration-300">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Our travel experts will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: 'name', type: 'text', placeholder: 'Enter your full name', label: 'Your Name' },
                  { name: 'email', type: 'email', placeholder: 'Enter your email address', label: 'Email Address' },
                  { name: 'message', type: 'textarea', placeholder: 'Tell us about your dream destination...', label: 'Message' }
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        rows="6"
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-pink-200 dark:border-gray-600 rounded-xl focus:border-pink-400 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900 transition-all outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={field.placeholder}
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-pink-200 dark:border-gray-600 rounded-xl focus:border-pink-400 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={field.placeholder}
                        required
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg"
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
