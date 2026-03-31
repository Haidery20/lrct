import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Camera, MapPin, Calendar, Users, X } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { GalleryItem } from '../lib/types';

const Gallery = () => {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'expeditions', name: 'Expeditions' },
    { id: 'events', name: 'Events' },
    { id: 'Festivals', name: 'Festivals' },
    { id: 'Offroads', name: 'Offroads' },
    { id: 'Family', name: 'Family' },
  ];

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('created_at', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setGalleryItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)))
      setLoading(false)
    })
    return () => unsub()
  }, []);

  useEffect(() => {
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const openModal = (item: GalleryItem) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img src="/images/landrovers.avif" alt="Gallery Hero" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <Camera className="w-12 h-12 mb-4 text-white" />
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">Adventure Gallery</h1>
          <p className="text-lg sm:text-xl max-w-2xl">Explore our collection of unforgettable moments, breathtaking landscapes, and the spirit of adventure that defines our community.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button key={category.id} onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}`}>
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading gallery...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No photos in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={() => openModal(item)}>
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center text-sm space-x-4">
                        {item.location && <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /><span className="truncate">{item.location}</span></div>}
                        {item.participants && <div className="flex items-center"><Users className="h-4 w-4 mr-1" /><span>{item.participants}</span></div>}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      {item.date && <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /><span>{item.date}</span></div>}
                      {item.category && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium capitalize">{item.category}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a href="https://drive.google.com/drive/folders/1a6DfkS2Pl4kUzhVroS1qjpYJh7RJdkCF" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
              Load More Photos
            </a>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <button onClick={closeModal} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
              <X className="h-6 w-6" />
            </button>
            <div className="relative">
              <img src={selectedImage.image_url} alt={selectedImage.title} className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedImage.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {selectedImage.location && <div className="flex items-center text-gray-600"><MapPin className="h-5 w-5 mr-2 text-green-600" /><span>{selectedImage.location}</span></div>}
                {selectedImage.date && <div className="flex items-center text-gray-600"><Calendar className="h-5 w-5 mr-2 text-green-600" /><span>{selectedImage.date}</span></div>}
                {selectedImage.participants && <div className="flex items-center text-gray-600"><Users className="h-5 w-5 mr-2 text-green-600" /><span>{selectedImage.participants} participants</span></div>}
              </div>
              {selectedImage.caption && <p className="text-gray-600 leading-relaxed mb-6">{selectedImage.caption}</p>}
              <div className="flex items-center justify-between">
                {selectedImage.category && <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium capitalize">{selectedImage.category}</span>}
                <button onClick={() => setLocation('/membership')} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Join Next Adventure</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
