import React from "react";

const SkeletonGuide = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border shadow-md overflow-hidden p-4 space-y-4">
      {/* Profile image */}
      <div className="h-32 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      {/* Name placeholder */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
      {/* Info line */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonGuide;
