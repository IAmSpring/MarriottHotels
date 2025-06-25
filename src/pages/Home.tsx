import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedHotels from '../components/FeaturedHotels';
import BonvoyRewards from '../components/BonvoyRewards';
import ExperienceSection from '../components/ExperienceSection';
import DestinationGuides from '../components/DestinationGuides';
import BoutiqueHotels from '../components/BoutiqueHotels';
import DiningSection from '../components/DiningSection';
import AdventureSection from '../components/AdventureSection';
import Footer from '../components/Footer';
import TourController from '../components/TourController';

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen">
        <main>
          <HeroSection />
          <DiningSection />
          <AdventureSection />
          <BoutiqueHotels />
          <FeaturedHotels />
          <BonvoyRewards />
          <ExperienceSection />
          <DestinationGuides />
          <Footer />
        </main>
      </div>
      <TourController />
    </>
  );
};

export default Home; 