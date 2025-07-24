import React, { useState } from 'react';
import { Plus, MessageCircle, Phone, Mail, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const actionItems = [
    {
      icon: <MessageCircle size={20} />,
      label: 'Chat Support',
      action: () => {
        // Simulate chat opening
        alert('Chat support would open here!');
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <Phone size={20} />,
      label: 'Call Us',
      action: () => {
        window.open('tel:+1234567890');
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <Mail size={20} />,
      label: 'Contact',
      link: '/contact',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="fixed bottom-24 right-8 z-40">
      {/* Action Items */}
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 transform ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actionItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            {/* Label */}
            <span className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg">
              {item.label}
            </span>
            
            {/* Action Button */}
            {item.link ? (
              <Link
                to={item.link}
                className={`p-3 ${item.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
              </Link>
            ) : (
              <button
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className={`p-3 ${item.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
              >
                {item.icon}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`p-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        aria-label="Quick actions"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
