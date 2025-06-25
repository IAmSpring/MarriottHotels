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
        fixed inset-0 bg-white/95 backdrop-blur-sm z-[9999] 
        flex flex-col items-center justify-center gap-8
        transition-opacity duration-500 ease-in-out
        ${show ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Marriott Logo */}
      <div className="mb-4">
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="#8B1538">
          <path d="M12 2L2 22h20L12 2zm0 4l6.9 13.8H5.1L12 6z"/>
        </svg>
      </div>

      {/* Loading Animation Container */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="absolute inset-[-144px] animate-spin">
          <div className="h-full w-full rounded-full border-4 border-[#8B1538]/10 border-t-[#8B1538]"></div>
        </div>
        
        {/* Inner spinning ring */}
        <div className="absolute inset-[-100px] animate-spin-slow">
          <div className="h-full w-full rounded-full border-4 border-[#8B1538]/20 border-t-[#8B1538] border-b-[#8B1538]"></div>
        </div>

        {/* Center pulsing dot */}
        <div className="absolute inset-[-30px] animate-pulse">
          <div className="h-full w-full rounded-full bg-[#8B1538]/20"></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-[#8B1538] font-light tracking-widest animate-pulse">
        LOADING
      </div>
    </div>
  );
};

export default LoadingScreen;
