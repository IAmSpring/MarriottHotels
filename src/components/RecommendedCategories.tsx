import React from 'react';
import { Building2, Palmtree, Mountain, Briefcase, Heart, Crown } from 'lucide-react';

const RecommendedCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Luxury Hotels",
      description: "Experience the finest in hospitality",
      icon: Crown,
      image: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      count: "150+ properties",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Beach Resorts",
      description: "Oceanfront paradise awaits",
      icon: Palmtree,
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      count: "200+ resorts",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      id: 3,
      title: "Mountain Retreats",
      description: "Escape to scenic highlands",
      icon: Mountain,
      image: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      count: "80+ lodges",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      id: 4,
      title: "Business Hotels",
      description: "Perfect for corporate travel",
      icon: Briefcase,
      image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      count: "300+ hotels",
      gradient: "from-gray-400 to-slate-500"
    },
    {
      id: 5,
      title: "Romantic Getaways",
      description: "Intimate escapes for couples",
      icon: Heart,
      image: "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      count: "120+ properties",
      gradient: "from-pink-400 to-rose-500"
    },
    {
      id: 6,
      title: "City Centers",
      description: "Urban adventures await",
      icon: Building2,
      image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      count: "250+ hotels",
      gradient: "from-purple-400 to-indigo-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect Stay
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From luxury resorts to business hotels, find accommodations tailored to your travel style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Background Image */}
                <div className="relative h-80">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <category.icon className="h-8 w-8" />
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-medium">{category.count}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="text-white/90 text-lg">{category.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B1028] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Explore All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedCategories;