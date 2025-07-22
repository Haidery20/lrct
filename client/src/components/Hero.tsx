import React, { useEffect, useState } from 'react';
import { ArrowRight, Mountain, Users, MapPin } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 sm:pt-40">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/landrovers.avif')`
        }}>
        </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
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
            <button className="group bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Join Our Adventures</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
              onClick={() => window.location.href = '/gallery'}>
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