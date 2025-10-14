import React from 'react';

const steps = ['Name', 'Email', 'Password', 'Confirm'];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center mb-6 px-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isFinal = index === steps.length - 1;

        const dotBaseClass = 'w-5 h-5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center font-bold text-xs';
        
        let dotClass = `${dotBaseClass} bg-gray-600 text-gray-400`; // Default (Future)
        
        if (isCompleted || isActive) {
          dotClass = `${dotBaseClass} bg-pink-500 text-white`;
        }
        
        if (isActive) {
          dotClass = `${dotClass} shadow-[0_0_15px_3px_rgba(236,72,153,0.7)] transform scale-110`;
        }
        
        const lineBaseClass = 'flex-1 h-0.5 transition-all duration-300 ease-in-out mx-2';
        
        const lineClass = `${lineBaseClass} ${isCompleted ? 'bg-pink-500' : 'bg-gray-600'}`;
        
        const labelClass = `mt-2 text-xs font-medium ${isCompleted || isActive ? 'text-pink-500' : 'text-gray-500'}`;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={dotClass}>
                {stepNumber}
              </div>
              <div className={labelClass}>
                {label}
              </div>
            </div>

            {/* Connecting Line - Only render if not the last step */}
            {!isFinal && (
              <div className={lineClass}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressBar;