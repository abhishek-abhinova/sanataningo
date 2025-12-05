import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleNavClick}>
          <img src="/images/logo.jpeg" alt="Sarbo Shakti Sonatani Sangathan" className="logo-img" />
          <span>Sarbo Shakti Sonatani Sangathan</span>
        </Link>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={handleNavClick}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={handleNavClick}>About Us</Link></li>
          <li><Link to="/activities" className={isActive('/activities')} onClick={handleNavClick}>What We Do</Link></li>
          <li><Link to="/gallery" className={isActive('/gallery')} onClick={handleNavClick}>Gallery</Link></li>

          <li><Link to="/membership" className={isActive('/membership')} onClick={handleNavClick}>Become a Member</Link></li>
          <li><Link to="/donate" className={isActive('/donate')} onClick={handleNavClick}>Donate</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={handleNavClick}>Contact</Link></li>
        </ul>
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;