import React from 'react';
import { CheckCircle, Gem, Headphones } from 'lucide-react';

const ValueHighlights = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Bonvoy Member Rates",
      description: "Exclusive discounts and benefits for members."
    },
    {
      icon: Gem,
      title: "Best Rate Guarantee",
      description: "We match any lower price — guaranteed."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Available anytime during your trip."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Marriott?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our world-class hospitality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8B1538] text-white rounded-full mb-6">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueHighlights;