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
    { icon: '✈️', title: 'Travel Inquiries', info: 'hello@travelgrid.com', sub: 'Response within 2 hours', bg: 'bg-gradient-to-br from-black/80 to-pink-900/80 hover:from-black/90 hover:to-pink-800/90', color: 'text-pink-300', iconBg: 'from-blue-500 to-blue-600' },
    { icon: '🌍', title: '24/7 Support', info: '+91 1234567890', sub: 'Emergency assistance', bg: 'bg-gradient-to-br from-black/80 to-pink-900/80 hover:from-black/90 hover:to-pink-800/90', color: 'text-pink-300', iconBg: 'from-green-500 to-green-600' },
    { icon: '📍', title: 'Visit Our Office', info: 'Xyz, New Delhi', sub: 'Mon-Fri: 9AM-6PM', bg: 'bg-gradient-to-br from-black/80 to-pink-900/80 hover:from-black/90 hover:to-pink-800/90', color: 'text-pink-300', iconBg: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode
      ? 'bg-gradient-to-br from-black to-pink-700'
      : 'bg-gradient-to-br from-rose-50 to-gray-100'
      }`}>
      <Navbar />
      {/* Hero Section */}
      <div className={`py-24 px-4 relative overflow-hidden ${isDarkMode
        ? 'bg-gradient-to-br from-black to-pink-700 text-white'
        : 'bg-gradient-to-br from-rose-100 to-gray-200 text-gray-900'
        }`}>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-opacity-10' : 'bg-white bg-opacity-20'
          }`}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight mt-6">
            Get in <span className="text-pink-500">Touch</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
            }`}>
            Planning your next adventure? We're here to help make it unforgettable!
          </p>
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
              {contactCards.map((card, index) => (
                <div key={index} className={`flex items-center p-6 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-xl ${isDarkMode
                  ? `${card.bg} border border-pink-500/30 hover:border-pink-400/50`
                  : 'bg-white border border-gray-200 hover:border-rose-300'
                  }`}>
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
          </div>
          {/* Contact Form */}
          <div className={`rounded-2xl shadow-2xl p-8 border ${isDarkMode
            ? 'bg-gradient-to-br from-black to-pink-900 border-white/20'
            : 'bg-white border-rose-200'
            }`}>
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Send us a Message</h2>
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Message Sent!</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Our travel experts will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: 'name', type: 'text', placeholder: 'Enter your full name', label: 'Your Name' },
                  { name: 'email', type: 'email', placeholder: 'Enter your email address', label: 'Email Address' },
                  { name: 'message', type: 'textarea', placeholder: 'Tell us about your dream destination...', label: 'Message' }
                ].map((field, index) => (
                  <div key={index}>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'
                      }`}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        rows="6"
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100/20 transition-all outline-none resize-none ${isDarkMode
                          ? 'border-pink-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300'
                          : 'border-pink-200 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                        placeholder={field.placeholder}
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100/20 transition-all outline-none ${isDarkMode
                          ? 'border-pink-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300'
                          : 'border-pink-200 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                        placeholder={field.placeholder}
                        required
                      />
                    )}
                  </div>
                ))}
                <button aria-label="Search"
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
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
