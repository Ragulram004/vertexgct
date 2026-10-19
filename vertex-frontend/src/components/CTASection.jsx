import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CTASection.css';

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section cta" id="cta-section" ref={ref}>
      <div className="container">
        <motion.div
          className="cta__card"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Background effects */}
          <div className="cta__glow cta__glow--1" />
          <div className="cta__glow cta__glow--2" />
          <div className="grid-bg" style={{ opacity: 0.4 }} />

          <div className="cta__content">
            <h2 className="cta__title">Ready to be a part of Vertex?</h2>
            <p className="cta__text">
              Join hundreds of students from across India. Register now and be part of 
              the biggest technical symposium at GCT Coimbatore.
            </p>
            <div className="cta__actions">
              <Link to="/events" className="btn-primary cta__btn" id="cta-register-btn">
                Register Now
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-outline cta__btn-secondary" id="cta-contact-btn">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
