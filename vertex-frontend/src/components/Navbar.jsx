import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../data/mockData';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <img src="/logo.png" alt="Vertex Logo" className="navbar__logo-img" />
          <span className="navbar__logo-text">VERTEX</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar__links" id="nav-links-desktop">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="navbar__link-indicator" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link to="/events" className="btn-primary navbar__cta" id="nav-cta">
          Register Now
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
          id="nav-mobile-toggle"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar__mobile-drawer ${isMobileOpen ? 'navbar__mobile-drawer--open' : ''}`}>
        <div className="navbar__mobile-backdrop" onClick={() => setIsMobileOpen(false)} />
        <div className="navbar__mobile-content">
          <ul className="navbar__mobile-links" id="nav-links-mobile">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/events" className="btn-primary navbar__mobile-cta" onClick={() => setIsMobileOpen(false)}>
            Explore Events
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
