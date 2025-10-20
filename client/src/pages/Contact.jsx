import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const { isDarkMode } = useTheme();
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

  const getLink = (title, info) => {
    if (title === 'Travel Inquiries') {
      return `mailto:${info}`;
    }
    if (title === '24/7 Support') {
      const phone = info.replace(/\D/g, '');
      return `https://wa.me/${phone}`;
    }
    return null;
  };

  return (
    <div className={`min-h-screen`}>
      {/* Hero Section */}
      <div className={`py-24 px-4 relative overflow-hidden`}>
        <div className={`absolute inset-0`}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Get in <span className="text-yellow-400">Touch</span>
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
          <div className={`rounded-2xl shadow-2xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-2xl font-bold mb-8 text-center`}>Contact Information</h3>
            <div className="space-y-6">
              {contactCards.map((card, index) => {
                const link = getLink(card.title, card.info);
                const content = (
                  <div className={`flex items-center p-4 rounded-xl transition-colors`}>
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.iconBg} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                      {card.icon}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {card.title}
                      </h4>
                      <p className={`${card.color} font-medium`}>{card.info}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{card.sub}</p>
                    </div>
                  </div>
                );

                if (link) {
                  const isMail = link.startsWith('mailto:');
                  return (
                    <a
                      key={index}
                      href={link}
                      {...(!isMail && { target: "_blank", rel: "noopener noreferrer" })}
                      className="block"
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={index}>{content}</div>;
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className={`rounded-2xl shadow-2xl p-8 border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100'}`}>
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Message Sent!</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Our travel experts will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[{ name: 'name', type: 'text', placeholder: 'Enter your full name', label: 'Your Name' },
                  { name: 'email', type: 'email', placeholder: 'Enter your email address', label: 'Email Address' },
                  { name: 'message', type: 'textarea', placeholder: 'Tell us about your dream destination...', label: 'Message' }
                ].map((field, index) => (
                  <div key={index}>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        rows="6"
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-900' : 'bg-white border-pink-200'}`}
                        placeholder={field.placeholder}
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-pink-900' : 'bg-white border-pink-200'}`}
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
