import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Music, Calendar, Users, Menu, X, Briefcase } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import UserMenu from './UserMenu';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <Music 
                size={28} 
                className="text-primary group-hover:opacity-0 transition-opacity duration-300" 
              />
              <span 
                className="absolute inset-0 flex items-center justify-center text-xl font-display font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                ZE
              </span>
            </div>
            <span className="text-xl font-display font-bold tracking-wide">
              <span className="text-primary">DJ</span> Zen Eyer
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/music" className="nav-link flex items-center space-x-1">
              <Music size={16} />
              <span>Music</span>
            </NavLink>
            <NavLink to="/events" className="nav-link flex items-center space-x-1">
              <Calendar size={16} />
              <span>Events</span>
            </NavLink>
            <NavLink to="/tribe" className="nav-link flex items-center space-x-1">
              <Users size={16} />
              <span>Zen Tribe</span>
            </NavLink>
            <a 
              href="https://work.djzeneyer.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link flex items-center space-x-1"
            >
              <Briefcase size={16} />
              <span>Work With Me</span>
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user?.isLoggedIn ? (
              <UserMenu />
            ) : (
              <>
                <button 
                  onClick={onLoginClick} 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={onRegisterClick} 
                  className="btn btn-primary"
                >
                  Join Tribe
                </button>
              </>
            )}
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen border-b border-white/10' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <NavLink to="/" className="nav-link text-lg">
              Home
            </NavLink>
            <NavLink to="/music" className="nav-link text-lg flex items-center space-x-2">
              <Music size={18} />
              <span>Music</span>
            </NavLink>
            <NavLink to="/events" className="nav-link text-lg flex items-center space-x-2">
              <Calendar size={18} />
              <span>Events</span>
            </NavLink>
            <NavLink to="/tribe" className="nav-link text-lg flex items-center space-x-2">
              <Users size={18} />
              <span>Zen Tribe</span>
            </NavLink>
            <a 
              href="https://work.djzeneyer.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link text-lg flex items-center space-x-2"
            >
              <Briefcase size={18} />
              <span>Work With Me</span>
            </a>
          </nav>

          <div className="mt-6 flex flex-col space-y-3">
            {user?.isLoggedIn ? (
              <div className="py-2">
                <UserMenu orientation="vertical" />
              </div>
            ) : (
              <>
                <button 
                  onClick={onLoginClick} 
                  className="w-full py-3 text-center text-white/90 hover:text-white transition-colors border border-white/20 rounded-md"
                >
                  Login
                </button>
                <button 
                  onClick={onRegisterClick} 
                  className="w-full btn btn-primary"
                >
                  Join Tribe
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;