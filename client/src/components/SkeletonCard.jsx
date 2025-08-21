import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border shadow-md overflow-hidden">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>

      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        {/* Location placeholder */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        {/* Button placeholder */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
