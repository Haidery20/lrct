import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Partners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Partner data - you can easily add more partners here
  const partners = [
    { name: 'G4L', logo: '/images/partners/g4l.jpg' },
    { name: 'Samcare', logo: '/images/partners/samcare.avif' },
    { name: 'Afriroots', logo: '/images/partners/afriroots.avif' },
    { name: 'Weibull', logo: '/images/partners/weibull.avif' },
    { name: 'Wanda', logo: '/images/partners/wanda.jpg'},
    // Add more partners as needed
    { name: 'G4L', logo: '/images/partners/g4l.jpg' },
    { name: 'Samcare', logo: '/images/partners/samcare.avif' },
    { name: 'Afriroots', logo: '/images/partners/afriroots.avif' },
    { name: 'Weibull', logo: '/images/partners/weibull.avif' },
    { name: 'Wanda', logo: '/images/partners/wanda.jpg'},
  ];

  // Number of partners to show at once (responsive)
  const getPartnersPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 5; // lg screens
      if (window.innerWidth >= 768) return 4;  // md screens
      if (window.innerWidth >= 640) return 3;  // sm screens
      return 2; // mobile
    }
    return 5;
  };

  const [partnersPerView, setPartnersPerView] = useState(getPartnersPerView());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPartnersPerView(getPartnersPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (partners.length <= partnersPerView) return; // Don't auto-slide if all partners fit

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = partners.length - partnersPerView;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [partners.length, partnersPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = partners.length - partnersPerView;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = partners.length - partnersPerView;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  // Don't show navigation if all partners fit in view
  const showNavigation = partners.length > partnersPerView;

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're proud to work with these amazing organizations who share our passion for adventure and exploration.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 group hover:scale-110"
                aria-label="Previous partners"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 group hover:scale-110"
                aria-label="Next partners"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              </button>
            </>
          )}

          {/* Partners Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / partnersPerView)}%)`
              }}
            >
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 px-4 transition-all duration-1000 delay-${index * 100} transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ width: `${100 / partnersPerView}%` }}
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-24 flex items-center justify-center group hover:scale-105">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        // Fallback for missing images
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="text-gray-400 font-medium">${partner.name}</div>`;
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Partners;