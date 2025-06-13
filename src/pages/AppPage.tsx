import React from 'react';
import { Smartphone, Star, Key, Gift, CreditCard, Bell, Shield } from 'lucide-react';

const AppPage: React.FC = () => {
  const features = [
    {
      icon: <Key className="h-6 w-6" />,
      title: 'Mobile Key',
      description: 'Skip the front desk and use your phone as your room key'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Member Benefits',
      description: 'Access exclusive rates and earn points on every stay'
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Instant Rewards',
      description: 'Redeem points for free nights, upgrades, and experiences'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Easy Payments',
      description: 'Securely store payment methods and check out faster'
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Real-time Updates',
      description: 'Get notifications about your stay and special offers'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Booking',
      description: 'Book with confidence using our encrypted platform'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#8B1538] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Hotel Experience
                <br />
                in Your Pocket
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Download the Marriott Bonvoy app and unlock a world of convenience and exclusive benefits
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on the App Store"
                    className="h-12"
                  />
                </a>
                <a
                  href="#"
                  className="inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-12"
                  />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative mx-auto w-64 md:w-80">
                <img
                  src="https://images.pexels.com/photos/6476776/pexels-photo-6476776.jpeg"
                  alt="Marriott Bonvoy App"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need, All in One App
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-[#8B1538] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Download the App?
            </h2>
            <p className="text-xl text-gray-600">
              Join millions of travelers who make their stays better with the Marriott Bonvoy app
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8B1538] mb-2">45M+</div>
              <p className="text-gray-600">Active App Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8B1538] mb-2">4.8★</div>
              <p className="text-gray-600">App Store Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8B1538] mb-2">30+</div>
              <p className="text-gray-600">Hotel Brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Enhance Your Travel Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Download the Marriott Bonvoy app today and start enjoying seamless hotel stays
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                className="h-12"
              />
            </a>
            <a
              href="#"
              className="inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-12"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage; 