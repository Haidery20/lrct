import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Partner } from '../lib/types';

const Partners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'partners'), where('is_active', '==', true), orderBy('sort_order'))
    const unsub = onSnapshot(q, (snap) => {
      setPartners(snap.docs.map(d => ({ id: d.id, ...d.data() } as Partner)))
      setLoading(false)
    })
    return () => unsub()
  }, []);

  const getPartnersPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 4;
      if (window.innerWidth >= 640) return 3;
      return 2;
    }
    return 5;
  };

  const [partnersPerView, setPartnersPerView] = useState(getPartnersPerView());

  useEffect(() => {
    const handleResize = () => setPartnersPerView(getPartnersPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (partners.length <= partnersPerView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const max = partners.length - partnersPerView;
        return prev >= max ? 0 : prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [partners.length, partnersPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const max = partners.length - partnersPerView;
      return prev <= 0 ? max : prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const max = partners.length - partnersPerView;
      return prev >= max ? 0 : prev + 1;
    });
  };

  const showNavigation = partners.length > partnersPerView;

  if (loading) return null;

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We are proud to work with these amazing organizations who share our passion for adventure and exploration.</p>
        </div>

        {partners.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No partners listed yet.</div>
        ) : (
          <div className="relative">
            {showNavigation && (
              <>
                <button onClick={goToPrevious} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 group hover:scale-110">
                  <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                </button>
                <button onClick={goToNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 group hover:scale-110">
                  <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                </button>
              </>
            )}
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / partnersPerView)}%)` }}>
                {partners.map((partner) => (
                  <div key={partner.id} className={`flex-shrink-0 px-4 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ width: `${100 / partnersPerView}%` }}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-24 flex items-center justify-center group hover:scale-105">
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <div className="text-gray-400 font-medium">{partner.name}</div>
                      )}
                    </div>
                    {partner.website_url && (
                      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-gray-400 mt-2 hover:text-green-600 truncate">
                        {partner.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Partners;
