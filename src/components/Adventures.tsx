import React, { useEffect, useRef, useState } from 'react';
import { Compass, Mountain, Camera, Users, Calendar, MapPin } from 'lucide-react';

const Adventures = () => {
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

  const adventures = [
    {
      icon: Mountain,
      title: 'Kilimanjaro Base Camp',
      description: 'Navigate challenging terrain to reach the base of Africa\'s highest peak.',
      difficulty: 'Advanced',
      duration: '3 Days',
      image: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Camera,
      title: 'Serengeti Safari Trail',
      description: 'Experience wildlife photography opportunities on exclusive off-road routes.',
      difficulty: 'Intermediate',
      duration: '5 Days',
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Compass,
      title: 'Ngorongoro Crater',
      description: 'Descend into the world\'s largest intact volcanic caldera.',
      difficulty: 'Beginner',
      duration: '2 Days',
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Ruaha Expedition',
      description: 'Remote wilderness adventure through Tanzania\'s largest national park.',
      difficulty: 'Expert',
      duration: '7 Days',
      image: 'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Coastal Discovery',
      description: 'Explore hidden beaches and coastal trails along the Indian Ocean.',
      difficulty: 'Intermediate',
      duration: '4 Days',
      image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-teal-500 to-blue-500'
    },
    {
      icon: MapPin,
      title: 'Cultural Heritage',
      description: 'Visit traditional Maasai villages and learn about local customs.',
      difficulty: 'Beginner',
      duration: '3 Days',
      image: 'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section id="adventures" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Epic Adventures Await
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From challenging mountain trails to serene coastal routes, discover Tanzania's 
            most spectacular landscapes with fellow Land Rover enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adventure, index) => (
            <div
              key={adventure.title}
              className={`transition-all duration-1000 delay-${index * 100} transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={adventure.image}
                    alt={adventure.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${adventure.color} p-3`}>
                    <adventure.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-center text-white text-sm">
                      <span className="bg-black/30 px-2 py-1 rounded">{adventure.difficulty}</span>
                      <span className="bg-black/30 px-2 py-1 rounded">{adventure.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {adventure.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {adventure.description}
                  </p>

                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Adventures;