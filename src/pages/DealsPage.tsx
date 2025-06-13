import React, { useState } from 'react';
import { Calendar, MapPin, Percent, Clock, Star, Users } from 'lucide-react';
import Footer from '../components/Footer';

interface Deal {
  id: number;
  title: string;
  description: string;
  discount: string;
  originalPrice: number;
  salePrice: number;
  location: string;
  image: string;
  validUntil: string;
  category: string;
  rating: number;
  features: string[];
  isLimitedTime: boolean;
  bookingDeadline: string;
}

const DealsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const deals: Deal[] = [
    {
      id: 1,
      title: "Miami Beach Luxury Escape",
      description: "Oceanfront suite with private balcony and spa access",
      discount: "40% OFF",
      originalPrice: 450,
      salePrice: 270,
      location: "Miami Beach, FL",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      validUntil: "2025-03-15",
      category: "beach",
      rating: 4.8,
      features: ["Ocean View", "Spa Access", "Free Breakfast"],
      isLimitedTime: true,
      bookingDeadline: "Book by Feb 28"
    },
    {
      id: 2,
      title: "Aspen Mountain Lodge Special",
      description: "Ski-in/ski-out luxury with mountain views",
      discount: "35% OFF",
      originalPrice: 520,
      salePrice: 338,
      location: "Aspen, CO",
      image: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      validUntil: "2025-04-30",
      category: "mountain",
      rating: 4.9,
      features: ["Ski Access", "Mountain View", "Fireplace"],
      isLimitedTime: false,
      bookingDeadline: ""
    },
    {
      id: 3,
      title: "NYC Business District Deal",
      description: "Premium business hotel in Manhattan",
      discount: "25% OFF",
      originalPrice: 380,
      salePrice: 285,
      location: "Manhattan, NY",
      image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      validUntil: "2025-06-30",
      category: "business",
      rating: 4.5,
      features: ["Business Center", "City View", "WiFi"],
      isLimitedTime: false,
      bookingDeadline: ""
    },
    {
      id: 4,
      title: "Desert Spa Retreat",
      description: "Luxury desert resort with world-class spa",
      discount: "50% OFF",
      originalPrice: 600,
      salePrice: 300,
      location: "Scottsdale, AZ",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      validUntil: "2025-02-28",
      category: "spa",
      rating: 4.7,
      features: ["Spa Treatments", "Golf Course", "Pool"],
      isLimitedTime: true,
      bookingDeadline: "Limited Time Only"
    },
    {
      id: 5,
      title: "Charleston Historic Stay",
      description: "Boutique hotel in historic district",
      discount: "30% OFF",
      originalPrice: 280,
      salePrice: 196,
      location: "Charleston, SC",
      image: "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      validUntil: "2025-05-15",
      category: "historic",
      rating: 4.6,
      features: ["Historic District", "Boutique", "Restaurant"],
      isLimitedTime: false,
      bookingDeadline: ""
    },
    {
      id: 6,
      title: "Lake Tahoe Weekend Getaway",
      description: "Lakeside resort with mountain and water views",
      discount: "45% OFF",
      originalPrice: 400,
      salePrice: 220,
      location: "Lake Tahoe, CA",
      image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      validUntil: "2025-03-31",
      category: "lake",
      rating: 4.4,
      features: ["Lake View", "Mountain View", "Activities"],
      isLimitedTime: true,
      bookingDeadline: "Weekend Special"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Deals', count: deals.length },
    { id: 'beach', name: 'Beach Resorts', count: deals.filter(d => d.category === 'beach').length },
    { id: 'mountain', name: 'Mountain Lodges', count: deals.filter(d => d.category === 'mountain').length },
    { id: 'business', name: 'Business Hotels', count: deals.filter(d => d.category === 'business').length },
    { id: 'spa', name: 'Spa Resorts', count: deals.filter(d => d.category === 'spa').length },
    { id: 'historic', name: 'Historic Hotels', count: deals.filter(d => d.category === 'historic').length }
  ];

  const filteredDeals = selectedCategory === 'all' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B1538] to-[#A91B47] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Exclusive Hotel Deals
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Save up to 50% on luxury accommodations worldwide. Limited time offers you won't find anywhere else.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#8B1538] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Deal Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {deal.discount}
                </div>
                
                {/* Limited Time Badge */}
                {deal.isLimitedTime && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold text-xs flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Limited</span>
                  </div>
                )}
                
                {/* Rating */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{deal.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Deal Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{deal.location}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {deal.features.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-[#8B1538]">${deal.salePrice}</span>
                      <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                    </div>
                    <span className="text-sm text-gray-600">per night</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">
                      Save ${deal.originalPrice - deal.salePrice}
                    </div>
                  </div>
                </div>
                
                {/* Validity */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
                  </div>
                  {deal.bookingDeadline && (
                    <span className="text-orange-600 font-semibold">{deal.bookingDeadline}</span>
                  )}
                </div>
                
                {/* Book Button */}
                <button className="w-full px-6 py-3 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B1028] transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Book This Deal
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-[#8B1538] to-[#A91B47] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Never Miss a Deal</h3>
          <p className="text-lg mb-6 opacity-90">
            Subscribe to get exclusive offers and early access to flash sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-[#8B1538] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DealsPage;