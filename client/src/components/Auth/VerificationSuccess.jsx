import React, { useEffect } from 'react';
import { CheckCircle, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = ({ 
  email, 
  userName, 
  onContinue,
  showActions = true 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple celebration without external dependency
    const celebration = () => {
      const duration = 2000;
      const colors = ['#ec4899', '#f97316', '#8b5cf6'];
      
      // Create some animated elements instead of confetti
      const celebrationElements = [];
      
      for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.width = '6px';
        element.style.height = '6px';
        element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        element.style.borderRadius = '50%';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '9999';
        
        document.body.appendChild(element);
        celebrationElements.push(element);
        
        // Animate the element
        const angle = (Math.PI * 2 * i) / 10;
        const distance = 100 + Math.random() * 100;
        
        element.animate([
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
          { 
            transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(1)`, 
            opacity: 0 
          }
        ], {
          duration: duration,
          easing: 'ease-out'
        });
      }
      
      // Clean up elements after animation
      setTimeout(() => {
        celebrationElements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      }, duration);
    };
    
    celebration();
  }, []);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Email Verified! 🎉</h1>
        <p className="text-gray-300 mb-2">
          Welcome to TravelGrid{userName ? `, ${userName}` : ''}!
        </p>
        <p className="text-pink-400 font-medium text-sm">
          {email} has been successfully verified
        </p>
      </div>

      {/* Success Message */}
      <div className="bg-green-500/10 backdrop-blur-md rounded-2xl p-8 border border-green-500/20 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            You're all set!
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Email address verified</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Account fully activated</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>All features unlocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="space-y-4">
          <button aria-label="Search"
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Start Exploring
          </button>
          
          <button aria-label="Search"
            onClick={handleDashboard}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
          >
            <User className="w-5 h-5" />
            Go to Dashboard
          </button>
        </div>
      )}

      {/* Welcome Message */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Thank you for joining TravelGrid! We're excited to help you plan your next adventure.
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccess;
