import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show immediately when loading starts
    if (isLoading) {
      setShow(true);
    }
    // Hide with delay when loading ends
    else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading && !show) return null;

  return (
    <div
      className={`
        fixed inset-0 bg-white z-[9999] 
        flex flex-col items-center justify-center
        transition-opacity duration-500 ease-in-out
        ${show ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="relative">
        <div className="absolute inset-[-144px] animate-spin">
          <div className="h-full w-full rounded-full border-4 border-[#8B1538]/20 border-t-[#8B1538]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
