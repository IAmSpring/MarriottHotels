import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BonvoyApp = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/bonvoy-app"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div className="flex items-center">
            <img
              src="/images/bonvoy-logo.svg"
              alt="Bonvoy Logo"
              className="w-16 h-16 mr-6"
            />
            <div>
              <h3 className="text-xl font-bold mb-1">
                Unlock extraordinary experiences with the Marriott Bonvoy™ app.
              </h3>
              <p className="text-gray-600">
                Wherever you go, the app gives you easy access to everything you need for your trip.
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#8B1538] transform translate-x-0 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Career Opportunities Section */}
        <Link
          to="/careers"
          className="mt-4 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              alt="Career Opportunities"
              className="w-16 h-16 object-cover rounded-lg mr-6"
            />
            <div>
              <h3 className="text-xl font-bold mb-1">
                Discover Career Opportunities
              </h3>
              <p className="text-gray-600">
                EOE / Disability / Veteran
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#8B1538] transform translate-x-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default BonvoyApp; 