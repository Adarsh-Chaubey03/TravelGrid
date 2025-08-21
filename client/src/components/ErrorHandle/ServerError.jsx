import React from 'react';
import { Link } from 'react-router-dom';
import { Server, RefreshCw, Home, CheckCircle } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black to-pink-900">

      <main className="flex flex-1 items-center justify-center w-full px-4 py-16">
        <div className="text-center max-w-3xl mx-auto relative">
          {/* Abstract geometric shapes in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-60 h-60 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full mix-blend-screen opacity-20 blur-3xl top-0 -left-20"></div>
            <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mix-blend-screen opacity-20 blur-3xl -bottom-20 -right-20"></div>
          </div>

          {/* Server icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-pink-900 bg-opacity-30 rounded-2xl flex items-center justify-center">
              <Server className="w-16 h-16 text-pink-400" strokeWidth={1.5} />
            </div>
            <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center animate-pulse opacity-30">
              <div className="w-40 h-40 bg-pink-500 rounded-2xl blur-xl"></div>
            </div>
          </div>

          {/* Error code with animated text */}
          <h1 className="text-[8rem] font-bold leading-none mb-4 relative">
            <span className="text-gray-800">5</span>
            <span className="text-pink-600 animate-pulse">0</span>
            <span className="text-gray-800">0</span>
          </h1>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Server Error
          </h2>

          <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
            We're sorry, but something went wrong on our end. Our team has been notified and is working to fix the issue.
          </p>

          <div className="space-y-6 relative z-10">
            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 max-w-md mx-auto">
              <p className="text-gray-300 mb-2">Things you can try:</p>
              <ul className="text-left text-gray-400 text-sm space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-pink-400" />
                  Refresh the page and try again
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-pink-400" />
                  Clear your browser cache and cookies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-pink-400" />
                  Try again in a few minutes
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button aria-label="Search"
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Page
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>

          <div className="mt-10 text-gray-400">
            <p>Error Reference: <span className="font-mono text-pink-400">{generateErrorRef()}</span></p>
          </div>
        </div>
      </main>

    </div>
  );
};

// Generate a random error reference ID
function generateErrorRef() {
  return `ERR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export default ServerError;