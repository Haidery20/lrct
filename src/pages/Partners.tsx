import React from 'react';
const Partners = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Partners</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {[
            { name: 'Partner 1', logo: '/images/partners/g4l.jpg' },
            { name: 'Partner 2', logo: '/images/partners/samcare.avif' },
            { name: 'Partner 3', logo: '/images/partners/afriroots.avif' },
            { name: 'Partner 4', logo: '/images/partners/weibull.avif' },
            { name: 'Partner 5', logo: '/images/partner5.png' },
          ].map((partner, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;