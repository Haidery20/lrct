//
import React from 'react';
import { Compass, Facebook, Instagram, Twitter, Mail, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
            <img 
    src="/images/club_logo.svg" 
    alt="Club Logo" 
    className="h-10 w-10 object-contain transition-opacity duration-300"
  />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Land Rover Club</span>
                <span className="text-sm text-gray-400">Tanzania</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Tanzania's premier Land Rover community, bringing together passionate off-road 
              enthusiasts to explore the beauty of East Africa while building lasting friendships.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/people/Landroverclubtanzania/100075810649851/' },
                { icon: Instagram, href: 'https://www.instagram.com/landrover_club_tanzania/' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: 'https://www.youtube.com/@landroverclubtanzania296'},
                { icon: Mail, href: 'info@landroverclub.or.tz' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Adventures</h3>
            <ul className="space-y-3">
              {['Landrover Festival', 'Mpalano Festival', 'Udzungwa', 'Saadani'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Club Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Club</h3>
            <ul className="space-y-3">
              {['About Us', 'Events', 'Membership', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Land Rover Club of Tanzania. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;