// Component to be rendered when user clicks on a particular hotel for details

import React, { useEffect, useState } from 'react';
import '../../pages/styles/Loaders.css';

const HotelDetailsSkeleton = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulating loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">

      <div className={`transition-opacity duration-700 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 text-white">

          <div className="relative w-full h-72 md:h-96 bg-pink-800 rounded-b-xl shadow-md skeleton"></div>

          <div className="max-w-4xl w-full px-4 py-12 mx-auto space-y-6">
            <div className="h-8 w-1/3 rounded skeleton"></div>

            <div className="space-y-3">
              <div className="h-4 w-full rounded skeleton"></div>
              <div className="h-4 w-5/6 rounded skeleton"></div>
              <div className="h-4 w-2/3 rounded skeleton"></div>
            </div>

            <div className="mt-10">
              <div className="h-10 w-48 rounded-lg skeleton"></div>
            </div>
          </div>

          <div className="h-16 w-full bg-pink-950/80 mt-auto rounded-t-lg skeleton"></div>
        </div>
      </div>

      {/* Actual Content */}
      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {!loading && children}
      </div>
    </div>
  );
};

export default HotelDetailsSkeleton;
