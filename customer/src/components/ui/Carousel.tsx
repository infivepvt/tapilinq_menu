import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  autoSlide = true,
  autoSlideInterval = 5000,
}) => {
  const slides = [
    {
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      title: 'Exceptional Dining Experience',
      description: 'Enjoy the finest selection of dishes crafted by our master chefs.'
    },
    {
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
      title: 'Special Seasonal Menu',
      description: 'Discover our exclusive seasonal dishes featuring fresh local ingredients.'
    },
    {
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
      title: 'Infive Signature Desserts',
      description: 'End your meal with our delightful selection of signature desserts.'
    }
  ];

  const [curr, setCurr] = useState(0);

  const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlideInterval, autoSlide]);

  return (
    <div className="relative overflow-hidden h-[50vh] md:h-[60vh]">
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-8">
              <h2 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {slide.title}
              </h2>
              <p 
                className="text-lg md:text-xl max-w-lg text-white"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`
                transition-all w-2 h-2 rounded-full cursor-pointer
                ${curr === i ? "p-1.5 bg-white" : "bg-white/50"}
              `}
              onClick={() => setCurr(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;