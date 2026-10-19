import { Link } from 'react-router-dom';
import { Globe, Send, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { navLinks } from '../data/mockData';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src="/logo.png" alt="Vertex Logo" className="footer__logo-img" />
              <span className="footer__logo-text">VERTEX</span>
            </Link>
            <p className="footer__brand-desc">
              A flagship technical symposium by the Product Design & Development Club (PDDC)
              at Government College of Technology, Coimbatore.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__column">
            <h4 className="footer__column-title">Quick Links</h4>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer__link">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__column">
            <h4 className="footer__column-title">Contact</h4>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <MapPin size={16} />
                <span>GCT, Thadagam Road, Coimbatore - 641013</span>
              </li>
              <li className="footer__contact-item">
                <Mail size={16} />
                <a href="mailto:ragulpddc@gmail.com" className="footer__link">ragulpddc@gmail.com</a>
              </li>
              <li className="footer__contact-item">
                <Phone size={16} />
                <a href="tel:+918667733680" className="footer__link">+91 86677 33680</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} PDDC Club, Government College of Technology, Coimbatore. All rights reserved.
          </p>
          <p className="footer__made-with">
            Made with ❤️ by PDDC Club
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
