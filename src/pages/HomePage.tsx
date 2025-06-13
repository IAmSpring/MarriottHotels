import React from 'react';
import HeroSection from '../components/HeroSection';
import PromoBanner from '../components/PromoBanner';
import FeaturedHotels from '../components/FeaturedHotels';
import RecommendedCategories from '../components/RecommendedCategories';
import ValueHighlights from '../components/ValueHighlights';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PromoBanner />
      <FeaturedHotels />
      <RecommendedCategories />
      <ValueHighlights />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HomePage;