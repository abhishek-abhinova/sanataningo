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

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/images/logo.jpeg" alt="Sarboshakti Sanatani Sangathan" className="logo-img" />
          <span>Sarboshakti Sanatani Sangathan</span>
        </Link>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={closeMenu}>About Us</Link></li>
          <li><Link to="/activities" className={isActive('/activities')} onClick={closeMenu}>What We Do</Link></li>
          <li><Link to="/gallery" className={isActive('/gallery')} onClick={closeMenu}>Gallery</Link></li>
          <li><Link to="/membership" className={isActive('/membership')} onClick={closeMenu}>Become a Member</Link></li>
          <li><Link to="/donate" className={isActive('/donate')} onClick={closeMenu}>Donate</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>Contact</Link></li>
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