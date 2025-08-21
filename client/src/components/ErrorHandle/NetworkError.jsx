import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Home,
  AlertCircle,
  Mail
} from 'lucide-react';

const NetworkError = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [countdown, setCountdown] = useState(10);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry countdown
  useEffect(() => {
    let timer;
    if (!isOnline && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      window.location.reload();
    }

    return () => clearInterval(timer);
  }, [isOnline, countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 flex flex-col items-center justify-center p-4">
      {/* Animated waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-full h-full opacity-10">
          <div className="absolute h-56 w-56 rounded-full bg-pink-500 blur-3xl animate-float-slow left-[20%] top-[30%]"></div>
          <div className="absolute h-64 w-64 rounded-full bg-blue-500 blur-3xl animate-float-slow-reverse right-[25%] top-[20%]"></div>
          <div className="absolute h-48 w-48 rounded-full bg-purple-500 blur-3xl animate-float-medium left-[30%] bottom-[20%]"></div>
        </div>
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(15px); }
          }
          @keyframes float-slow-reverse {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(20px) translateX(-15px); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(15px) translateX(10px); }
          }
          .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
          .animate-float-slow-reverse { animation: float-slow-reverse 9s ease-in-out infinite; }
          .animate-float-medium { animation: float-medium 7s ease-in-out infinite; }
        `}</style>
      </div>

      <div className="relative z-10 max-w-xl w-full bg-black bg-opacity-50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-500 bg-opacity-20 rounded-full mb-6">
            {isOnline ? (
              <Wifi className="w-12 h-12 text-pink-500" strokeWidth={1.5} />
            ) : (
              <WifiOff className="w-12 h-12 text-pink-500" strokeWidth={1.5} />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Network Connection Issue</h1>
          <p className="text-gray-300">
            {isOnline ?
              "We're having trouble connecting to our servers." :
              "It looks like you're currently offline."}
          </p>
        </div>

        <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-sm font-medium text-gray-300">
              {isOnline ? 'Connected to internet' : 'No internet connection detected'}
            </p>
          </div>
          <p className="text-sm text-gray-400">
            {isOnline ?
              "We're having trouble connecting to our servers. Please try again in a few moments." :
              "Check your internet connection and try again."}
          </p>
        </div>

        <div className="space-y-4">
          {!isOnline && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="bg-pink-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 10) * 100}%` }}
              ></div>
              <p className="text-center text-sm text-gray-300 mt-2 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Auto-retrying in {countdown} seconds...
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button aria-label="Search"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold transition-colors text-white flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again Now
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors text-white text-center flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-col items-center text-center">
        <p className="text-gray-400 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          If this problem persists, please contact our support
        </p>
        <p className="text-pink-400 font-medium mt-1 flex items-center">
          <Mail className="w-4 h-4 mr-1" />
          support@travelgrid.com
        </p>
      </div>
    </div>
  );
};

export default NetworkError;