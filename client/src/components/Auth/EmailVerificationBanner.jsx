import React, { useState } from 'react';
import { AlertTriangle, X, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const EmailVerificationBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { user, sendVerificationEmail } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  if (!user || user.isEmailVerified || isDismissed) {
    return null;
  }

  const handleVerifyClick = () => {
    navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
  };

  const handleResendClick = async () => {
    try {
      await sendVerificationEmail(user.email);
      navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    }
  };

  return (
    <div className={`fixed top-20 left-0 right-0 z-40 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-yellow-900/90 to-orange-900/90 border-yellow-600/30' 
        : 'bg-gradient-to-r from-yellow-100/95 to-orange-100/95 border-yellow-400/30'
    } border-b backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`} />
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-yellow-200' : 'text-yellow-800'
              }`}>
                Please verify your email address to access all features
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
              }`}>
                We sent a verification email to {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button aria-label="Search"
              onClick={handleVerifyClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Verify Now
            </button>
            
            <button aria-label="Search"
              onClick={handleResendClick}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isDarkMode
                  ? 'text-yellow-300 hover:bg-yellow-800/50'
                  : 'text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Resend
            </button>
            
            <button 
              onClick={() => setIsDismissed(true)}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-yellow-400 hover:bg-yellow-800/50'
                  : 'text-yellow-600 hover:bg-yellow-200'
              }`}
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
