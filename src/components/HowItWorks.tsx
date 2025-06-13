import React from 'react';
import { Search, Package, Sun } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search",
      description: "Find your perfect Marriott hotel"
    },
    {
      icon: Package,
      title: "Book",
      description: "Secure your reservation instantly"
    },
    {
      icon: Sun,
      title: "Enjoy",
      description: "Experience exceptional hospitality"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Marriott Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your extraordinary experience is just three simple steps away
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-300 z-0" />
              )}
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#8B1538] to-[#A91B47] text-white rounded-full mb-6 shadow-lg">
                  <step.icon className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;