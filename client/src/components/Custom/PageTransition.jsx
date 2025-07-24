import React from 'react';

const PageTransition = ({ children }) => {
  return (
    <div className="animate-fadeIn">
      <div className="animate-slideInUp">
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
