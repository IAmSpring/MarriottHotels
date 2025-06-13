import React from 'react';
import { Link } from 'react-router-dom';

const ExperienceSection = () => {
  const experiences = [
    {
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg',
      title: 'Resort Escapes',
      description: 'Indulge in luxury at our world-class resorts',
      link: '/experiences/resorts'
    },
    {
      image: 'https://images.pexels.com/photos/5379219/pexels-photo-5379219.jpeg',
      title: 'City Getaways',
      description: 'Explore vibrant cities and urban adventures',
      link: '/experiences/cities'
    },
    {
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg',
      title: 'Dining Excellence',
      description: 'Savor exceptional culinary experiences',
      link: '/experiences/dining'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Extraordinary Experiences</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover unique experiences and unforgettable moments at Marriott hotels worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <Link 
              key={index}
              to={experience.link}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{experience.title}</h3>
                    <p className="text-white/90">{experience.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/experiences"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#8B1538] text-base font-medium rounded-md text-[#8B1538] hover:bg-[#8B1538] hover:text-white transition-colors duration-200"
          >
            View All Experiences
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 