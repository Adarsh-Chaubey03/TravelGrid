import React from 'react';

const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  rounded = 'rounded', 
  className = '',
  animate = true 
}) => {
  return (
    <div 
      className={`${width} ${height} ${rounded} bg-gray-200 ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
    <Skeleton height="h-48" rounded="rounded-xl" />
    <Skeleton height="h-6" width="w-3/4" />
    <Skeleton height="h-4" width="w-full" />
    <Skeleton height="h-4" width="w-2/3" />
    <div className="flex space-x-2">
      <Skeleton height="h-8" width="w-20" rounded="rounded-full" />
      <Skeleton height="h-8" width="w-16" rounded="rounded-full" />
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
        <Skeleton width="w-12" height="h-12" rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-3" width="w-1/2" />
        </div>
        <Skeleton width="w-20" height="h-8" rounded="rounded-lg" />
      </div>
    ))}
  </div>
);

export const GridSkeleton = ({ items = 6, columns = 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
    {Array.from({ length: items }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

export default Skeleton;
