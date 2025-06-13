import React from 'react';
import { Gift, CreditCard, Hotel, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const BonvoyRewards = () => {
  const benefits = [
    {
      icon: <Gift className="w-12 h-12 text-[#8B1538]" />,
      title: 'Earn Points',
      description: 'Earn points for stays, dining, and experiences worldwide'
    },
    {
      icon: <CreditCard className="w-12 h-12 text-[#8B1538]" />,
      title: 'Member Rates',
      description: 'Get our lowest rates, guaranteed, plus instant benefits'
    },
    {
      icon: <Hotel className="w-12 h-12 text-[#8B1538]" />,
      title: 'Mobile Check-In',
      description: 'Skip the front desk and check in from anywhere'
    },
    {
      icon: <Award className="w-12 h-12 text-[#8B1538]" />,
      title: 'Elite Status',
      description: 'Unlock elevated benefits and recognition'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Marriott Bonvoy™ Benefits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join Marriott Bonvoy™ and unlock a world of exclusive benefits, from earning points on stays to enjoying member-only rates and mobile check-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/join-bonvoy"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#8B1538] hover:bg-[#6B1028] transition-colors duration-200"
          >
            Join Marriott Bonvoy™ Free
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Already a member? <Link to="/login" className="text-[#8B1538] hover:text-[#6B1028]">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BonvoyRewards; 