import React from 'react';

const ParisDestinationImage: React.FC<{ className?: string }> = ({ className }) => {
  const fallbackImages = [
    'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg',
    'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg',
    'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg',
    'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleImageError = () => {
    if (currentImageIndex < fallbackImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <img
      src={fallbackImages[currentImageIndex]}
      alt="Paris, France"
      className={className}
      onError={handleImageError}
    />
  );
};

export default ParisDestinationImage; 