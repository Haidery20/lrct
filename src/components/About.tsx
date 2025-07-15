import React, { useEffect, useRef, useState } from 'react';
import { Award, Globe, Heart, Target, Users, Compass } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const stats = [
    { number: '100+', label: 'Active Members' },
    { number: '15+', label: 'Years of Adventure' },
    { number: '20+', label: 'Trails Explored' },
    { number: '50+', label: 'Events Organized' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'Building lasting friendships through shared adventures and mutual support.'
    },
    {
      icon: Target,
      title: 'Safety Focus',
      description: 'Prioritizing safety in all our expeditions with proper training and equipment.'
    },
    {
      icon: Globe,
      title: 'Conservation',
      description: 'Protecting Tanzania\'s natural beauty for future generations to enjoy.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Maintaining the highest standards in off-road adventure and vehicle care.'
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className={`text-center mb-20 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Land Rover Club Tanzania
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founded in 2008, we are Tanzania's premier Land Rover enthusiast community. 
            Our passion for adventure, conservation, and camaraderie has brought together 
            over 200 members who share a love for exploring East Africa's most spectacular landscapes.
          </p>
        </div>

        {/* Image and story section */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div>
            <img
              src="public/images/landroverconvoy.jpg"
              alt="Land Rover Club Tanzania"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              What started as a small group of Land Rover owners meeting in Dar es Salaam 
              has grown into Tanzania's most respected off-road community. We've explored 
              every corner of this beautiful country, from the snow-capped peaks of Kilimanjaro 
              to the pristine beaches of the Indian Ocean.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our members come from all walks of life, united by their passion for adventure 
              and their love for the legendary Land Rover. Whether you're a seasoned explorer 
              or just starting your off-road journey, you'll find a welcoming community ready 
              to share knowledge, experiences, and unforgettable adventures.
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Join Our Story
            </button>
          </div>
        </div>

        {/* Stats section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1000 delay-600 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Values section */}
        <div className={`transition-all duration-1000 delay-900 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`transition-all duration-1000 delay-${1100 + index * 100} transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white">
            <Compass className="h-16 w-16 mx-auto mb-6 text-white/80" />
            <h3 className="text-3xl font-bold mb-6">Ready to Explore Tanzania?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join our community of passionate adventurers and discover the beauty of Tanzania 
              from behind the wheel of a Land Rover.
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Become a Member
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;