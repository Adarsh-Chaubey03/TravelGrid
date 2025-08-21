// Component to be rendered when user clicks on a particular package for details

import React from "react";
import '../../pages/styles/Loaders.css';

const PackageDetailsSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-black to-pink-900 min-h-screen text-white pb-16">

      <div className="w-full h-[50vh] border-b border-white/10 relative top-15 ">
        <div className="opacity-50  bg-pink-900 w-full h-full rounded-none" />
        <div className="absolute bottom-10 left-6 space-y-2 w-1/2">
          <div className="skeleton h-12 w-full rounded-md" />
          <div className="skeleton h-4 w-1/2 rounded-md" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-6 border border-white/10 rounded-2xl backdrop-blur-sm">
          {Array(3).fill().map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-6 w-1/3 rounded-md" />
              <div className="skeleton h-5 w-3/4 rounded-md" />
            </div>
          ))}
          <div className="skeleton h-10 w-full rounded-md" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12">

        <div className="space-y-2">
          {Array(3).fill().map((_, i) => (
            <div key={i} className="skeleton w-full h-6 rounded-md" />
          ))}
        </div>

        <div className="bg-white/5 border border-pink-400/20 p-6 rounded-2xl space-y-4">
          <div className="skeleton w-48 h-5 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill().map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-md" />
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-pink-400/20 p-6 rounded-2xl space-y-4">
          <div className="skeleton w-44 h-5 rounded-md" />
          <div className="space-y-2">
            {Array(3).fill().map((_, i) => (
              <div key={i} className="skeleton h-10 w-full rounded-md" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PackageDetailsSkeleton;
