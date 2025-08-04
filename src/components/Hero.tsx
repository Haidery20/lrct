import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Mountain, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setLocation] = useLocation();

  // Array of background images for the carousel
  const backgroundImages = [
    '/images/hero/landrovers.avif',
    '/images/hero/outconvoy.avif',
    '/images/hero/group.avif',
    '/images/hero/trails.avif',
    '/images/hero/tent.avif'
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % backgroundImages.length
    );
  };


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 sm:pt-40">
      {/* Carousel Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`
            }}
          />
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Carousel Navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Adventure{' '}
            <span className="bg-gradient-to-r from-green-400 to-orange-400 bg-clip-text text-transparent">
              Beyond Limits
            </span>
            <br />
            Explore Tanzania
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join Tanzania's premier Land Rover community. Experience epic off-road adventures, 
            build lasting friendships, and discover the untamed beauty of East Africa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
  className="group bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
  onClick={() => setLocation('/events')}
>
  <span>Join Our Adventures</span>
  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
</button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
              onClick={() => setLocation('/gallery')}>
              View Gallery
            </button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Mountain, title: 'Epic Trails', desc: 'Conquer challenging terrains across Tanzania' },
              { icon: Users, title: 'Strong Community', desc: 'Connect with passionate off-road enthusiasts' },
              { icon: MapPin, title: 'Local Expertise', desc: 'Discover hidden gems with experienced guides' }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`transition-all duration-1000 delay-${index * 200} transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <feature.icon className="h-8 w-8 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;