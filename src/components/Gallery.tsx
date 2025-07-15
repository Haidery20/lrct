import React from 'react';

const Gallery = () => {
  const images = [
    { src: 'public/images/asset 1.jpg', alt: 'Adventure 1' },
    { src: 'public/images/asset 2.jpg', alt: 'Adventure 2' },
    { src: 'public/images/asset 3.jpg', alt: 'Adventure 3' },
    { src: 'public/images/asset 4.jpg', alt: 'Adventure 4' },
    { src: 'public/images/asset 5.jpg', alt: 'Adventure 5' },
    { src: 'public/images/asset 6.jpg', alt: 'Adventure 6' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="https://drive.google.com/drive/folders/1a6DfkS2Pl4kUzhVroS1qjpYJh7RJdkCF?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300"
          >
            View More on Google Drive
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;