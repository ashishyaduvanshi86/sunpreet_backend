import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: '1:1 Online Coaching', path: '/coaching' },
  { name: 'Training Programs', path: '/programs' },
  { name: 'Retreats', path: '/retreats' },
  { name: 'Shop', path: '/shop' },
  { name: 'About Me', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { cartCount, setIsCartOpen, closeCart } = useCart();

  const handleNavClick = useCallback((e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('nav-reset'));
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    closeCart();
  }, [location, closeCart]);

  // Determine text colors based on scroll and page
  const logoTextColor = isHomePage && !isScrolled ? 'text-[#FBFBF9]' : 'text-[#1C1917]';
  const subTextColor = isHomePage && !isScrolled ? 'text-[#D6C0A6]' : 'text-[#57534E]';
  const navTextColor = isHomePage && !isScrolled ? 'text-[#FBFBF9]/80 hover:text-[#FBFBF9]' : 'text-[#57534E] hover:text-[#1C1917]';
  const activeNavColor = isHomePage && !isScrolled ? 'text-[#FBFBF9]' : 'text-[#1C1917]';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="relative z-10" data-testid="logo-link">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col"
              >
                <span className={`font-['Playfair_Display'] text-2xl md:text-3xl font-medium tracking-tight transition-colors duration-300 ${logoTextColor}`}>
                  SUNPREET SINGH
                </span>
                <span className={`text-[10px] uppercase tracking-[0.3em] -mt-1 transition-colors duration-300 ${subTextColor}`}>
                  Coaching
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  data-testid={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`relative text-xs tracking-wide transition-colors duration-300 whitespace-nowrap underline-hover ${
                    location.pathname === link.path
                      ? `${activeNavColor} font-medium`
                      : navTextColor
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/coaching">
                <Button
                  data-testid="nav-cta-btn"
                  className="bg-[#1C1917] text-[#FBFBF9] h-11 px-6 text-xs uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917]/90 transition-all duration-300 btn-magnetic"
                >
                  Book Coaching
                </Button>
              </Link>
              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 transition-colors duration-300 ${
                  isHomePage && !isScrolled ? 'text-[#FBFBF9] hover:text-[#D6C0A6]' : 'text-[#1C1917] hover:text-[#D6C0A6]'
                }`}
                data-testid="nav-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D6C0A6] text-[#1C1917] w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#1C1917]"
                data-testid="mobile-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D6C0A6] text-[#1C1917] w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                data-testid="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-10 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#1C1917]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#1C1917]" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-[#FBFBF9] lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    data-testid={`mobile-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`font-['Playfair_Display'] text-3xl ${
                      location.pathname === link.path
                        ? 'text-[#1C1917]'
                        : 'text-[#57534E]'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link to="/coaching">
                  <Button
                    data-testid="mobile-cta-btn"
                    className="bg-[#1C1917] text-[#FBFBF9] h-14 px-10 text-sm uppercase tracking-[0.15em] rounded-none mt-4"
                  >
                    Book Coaching
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
