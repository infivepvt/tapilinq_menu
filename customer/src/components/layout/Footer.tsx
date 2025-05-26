import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Infive</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Elevating your dining experience with delicious meals and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">contact@infive.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">123 Gourmet Street, Food City, FC 12345</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Opening Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Clock size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Monday - Friday</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">7:00 AM - 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Saturday - Sunday</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">8:00 AM - 12:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Infive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;