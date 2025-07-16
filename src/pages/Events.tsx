import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const Events = () => {
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

  const events = [
    {
      date: 'MAR 29 - 30',
      title: 'Rock Shungu',
      description: 'Join us for our extreme 4X4 challange, expedition and share experiences.',
      time: '6:00 AM',
      location: 'Mkuranga-Pwani',
      attendees: 45,
      type: 'Offroad'
    },
    {
      date: 'APR 18 - 21',
      title: 'Ruaha National Park',
      description: 'Epic 3-day expedition to the base camp of Ruaha National Park.',
      time: '10:00 AM',
      location: 'Songea',
      attendees: 12,
      type: 'Adventure'
    },
    {
      date: 'JUN 21 - 22',
      title: 'Wami Mbiki',
      description: 'Wildlife photography expedition through the Tanzania best game reserve.',
      time: '7:00 AM',
      location: 'Wami-Pwani',
      attendees: 18,
      type: 'Adventure'
    },
    {
      date: 'AUG 8 - 10',
      title: 'Magoroto drive',
      description: 'Enjoy the best sceneries of coastal regios and its beautiful climatic condition.',
      time: '9:00 AM',
      location: 'Tanga',
      attendees: 25,
      type: 'Offroad Drive'
    }
  ];

  return (
    <section id="events" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay connected with our community through regular meetups, workshops, 
            and unforgettable adventures across Tanzania.
          </p>
        </div>

        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event.title}
              className={`transition-all duration-1000 delay-${index * 200} transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex flex-col items-center justify-center text-white">
                      <div className="text-sm font-medium">{event.date.split(' ')[0]}</div>
                      <div className="text-lg font-bold">{event.date.split(' ')[1]}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
                        {event.title}
                      </h3>
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {event.type}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Join Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-800 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;