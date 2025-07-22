import { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, Users, Play, X } from 'lucide-react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<null | typeof galleryItems[0]>(null);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'expeditions', name: 'Expeditions' },
    { id: 'events', name: 'Events' },
    { id: 'Festivals', name: 'Festivals' },
    { id: 'Offroads', name: 'Offroads' },
    { id: 'Family', name: 'Family' }
  ];

  const galleryItems = [
    {
      id: 1,
      image: '/images/mpalano.jpg',
      title: 'Mpalano Festival',
      category: 'Festivals',
      location: 'Matema Beach',
      date: 'July 2025',
      participants: 12
    },
    {
      id: 2,
      image: '/images/rockshungu.jpg',
      title: 'Rock Shungu',
      category: 'Offroads',
      location: 'Shungumbweni',
      date: 'June 2025',
      participants: 18
    },
    {
      id: 3,
      image: '/images/landroverfestival.jpg',
      title: 'Landrover Festival',
      category: 'Festivals',
      location: 'Arusha',
      date: 'October 2024',
      participants: 15
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Saadani National Park',
      category: 'expeditions',
      location: 'Saadani - Bagamoyo',
      date: 'June 2024',
      participants: 20
    },
    {
      id: 4,
      image: '/images/udzungwa.jpg',
      title: 'Udzungwa National Park',
      category: 'expeditions',
      location: 'Udzungwa - Morogoro',
      date: 'June 2024',
      participants: 20
    },
    /*{
      id: 5,
      image: 'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Ruaha National Park',
      category: 'expeditions',
      location: 'Ruaha National Park',
      date: 'November 2023',
      participants: 8
    },*/
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Magoroto Forest',
      category: 'expeditions',
      location: 'Tanga',
      date: 'October 2023',
      participants: 25
    },
    /*{
      id: 7,
      image: 'https://images.pexels.com/photos/4577543/pexels-photo-4577543.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Cultural Heritage Visit',
      category: 'events',
      location: 'Maasai Village',
      date: 'September 2023',
      participants: 30
    },
    {
      id: 8,
      image: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Land Rover Defender 110',
      category: 'vehicles',
      location: 'Club Garage',
      date: 'August 2023',
      participants: 1
    },
    {
      id: 9,
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Off-Road Training Session',
      category: 'events',
      location: 'Training Ground',
      date: 'July 2023',
      participants: 22
    },
    {
      id: 10,
      image: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Sunset at Lake Manyara',
      category: 'landscapes',
      location: 'Lake Manyara',
      date: 'June 2023',
      participants: 16
    },
    {
      id: 11,
      image: 'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Annual Club Meeting',
      category: 'events',
      location: 'Dar es Salaam',
      date: 'May 2023',
      participants: 45
    },
    {
      id: 12,
      image: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      title: 'Vehicle Maintenance Workshop',
      category: 'vehicles',
      location: 'Club Workshop',
      date: 'April 2023',
      participants: 18
    }*/
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openModal = (item: typeof galleryItems[0]) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Camera className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Adventure Gallery
          </h1>
          <p className="text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
            Explore our collection of unforgettable moments, breathtaking landscapes, 
            and the spirit of adventure that defines our community.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center text-sm space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{item.participants}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.date}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
              Load More Photos
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedImage.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  <span>{selectedImage.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  <span>{selectedImage.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  <span>{selectedImage.participants} participants</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                This adventure showcases the incredible landscapes and experiences that make 
                Tanzania such a special place for off-road exploration. Our club members 
                captured these moments during one of our memorable expeditions.
              </p>

              <div className="flex items-center justify-between">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium capitalize">
                  {selectedImage.category}
                </span>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Join Next Adventure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;