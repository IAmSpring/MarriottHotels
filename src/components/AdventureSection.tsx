import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const AdventureSection = () => {
  const destinations = [
    {
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
      title: 'Mount Rainier, Washington',
      description: 'Experience the majestic beauty of the Pacific Northwest',
      link: '/destinations/mount-rainier'
    },
    {
      image: 'https://images.pexels.com/photos/415999/pexels-photo-415999.jpeg',
      title: 'Las Vegas, Nevada',
      description: 'Discover the entertainment capital of the world',
      link: '/destinations/las-vegas'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Your Next Adventure is Calling</h2>
        <p className="text-gray-600 mb-8">
          Book dream getaways at over 30 hotel brands and 10,000 global destinations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={index}
              to={destination.link}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center">
                      <h3 className="text-white text-2xl font-bold mr-2">{destination.title}</h3>
                      <ChevronRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-white/90 mt-2">{destination.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdventureSection; 