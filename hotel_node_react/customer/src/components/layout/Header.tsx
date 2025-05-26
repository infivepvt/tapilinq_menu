import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">Infive</span>
        </Link>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <button 
            onClick={() => toggleTheme()} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <Link 
            to="/cart" 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative"
            aria-label="View cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${
              location.pathname === '/' ? 'font-medium text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            New Order
          </Link>
          <Link 
            to="/history" 
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${
              location.pathname === '/history' ? 'font-medium text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            Order History
          </Link>
          <button 
            onClick={() => toggleTheme()} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link 
            to="/cart" 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative"
            aria-label="View cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 ${
                  location.pathname === '/' ? 'font-medium text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                New Order
              </Link>
              <Link 
                to="/history" 
                className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 ${
                  location.pathname === '/history' ? 'font-medium text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                Order History
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;