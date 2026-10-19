import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stats } from '../data/mockData';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero" id="hero-section">
      {/* Background effects */}
      <div className="grid-bg" />
      <div className="hero__glow hero__glow--1" />
      <div className="hero__glow hero__glow--2" />
      <div className="hero__glow--3" />

      {/* Animated particles */}
      <div className="hero__particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="hero__particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container hero__container">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span>PDDC Club Presents</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="hero__title-vertex">VERTEX</span>
          </motion.h1>


          {/* Sub text */}
          <motion.p
            className="hero__subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            A National Level Technical Symposium presented by the Product Design &amp; Development Club
            at Government College of Technology, Coimbatore.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link to="/events" className="btn-primary hero__cta-primary" id="hero-cta-explore">
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Graphic — Logo */}
        <motion.div
          className="hero__graphic"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 50 }}
        >
          <div className="hero__logo-wrapper">
            <div className="hero__logo-glow-blue" />
            <div className="hero__logo-glow-gold" />
            <img src="/logo.png" alt="Vertex 2k26 Eagle Logo" className="hero__logo-image" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-dot" />
        </div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
