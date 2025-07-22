import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Compass, LogIn, UserPlus } from 'lucide-react';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-black/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3">
            <img 
    src="/images/club_logo.svg" 
    alt="Club Logo" 
    className="h-10 w-10 object-contain transition-opacity duration-300"
  />
              <div className="flex flex-col">
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Land Rover Club
                </span>
                <span className={`text-sm transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  Tanzania
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Festivals', path: '/festivals' },
                { name: 'Events', path: '/events' },
                { name: 'Membership', path: '/membership' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/#contact' }
              ].map((item) => (
                item.path.startsWith('/#') ? (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`font-medium transition-colors duration-300 hover:text-green-500 ${
                      isScrolled ? 'text-gray-700' : 'text-white/90'
                    }`}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium transition-colors duration-300 hover:text-green-500 ${
                      location === item.path ? 'text-green-500' : 
                      isScrolled ? 'text-gray-700' : 'text-white/90'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              <div className="flex items-center space-x-3">
                
                
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Join Club</span>
                </button>
              </div>
            </nav>

            <button
              className={`md:hidden transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4">
              <nav className="flex flex-col space-y-4">
                {[
                  { name: 'About', path: '/about' },
                  { name: 'Membership', path: '/membership' },
                  { name: 'Adventures', path: '/adventures' },
                  { name: 'Events', path: '/events' },                  
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'Contact', path: '/#contact' }
                ].map((item) => (
                  item.path.startsWith('/#') ? (
                    <a
                      key={item.name}
                      href={item.path}
                      className="text-gray-700 font-medium hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium hover:text-green-600 transition-colors ${
                        location === item.path ? 'text-green-600' : 'text-gray-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      openAuthModal('login');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 text-gray-700 font-medium hover:text-green-600 transition-colors py-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      openAuthModal('signup');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Join Club</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;