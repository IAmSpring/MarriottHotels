import React from 'react';

const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-red-50 to-pink-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg md:text-xl text-gray-800 mb-4">
            🎉 Earn points on every stay with Marriott Bonvoy
          </p>
          <button className="px-8 py-3 border-2 border-[#8B1538] text-[#8B1538] font-semibold rounded-lg hover:bg-[#8B1538] hover:text-white transition-colors duration-200">
            Join Marriott Bonvoy
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;