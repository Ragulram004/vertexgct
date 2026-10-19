import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Calendar, MapPin, Award } from 'lucide-react';
import './AboutSection.css';

const highlights = [
  { icon: <Users size={24} />, label: '15+ Events', desc: 'Across 3 tracks' },
  { icon: <Calendar size={24} />, label: '3 Days', desc: 'Action-packed symposium' },
  { icon: <MapPin size={24} />, label: 'GCT Coimbatore', desc: 'Premier venue' },
  { icon: <Award size={24} />, label: 'Prizes & Certs', desc: 'For all participants' },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section about" id="about-section" ref={ref}>
      <div className="container">
        <motion.h2 
          className="section-title text-center about__title"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Vertex
        </motion.h2>

        <div className="about__layout">
          {/* Left Column — Text Content */}
          <motion.div
            className="about__content"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <p className="about__text">
              <strong>Vertex</strong> is the flagship national-level technical symposium organized by the{' '}
              <strong>Product Design & Development Club (PDDC)</strong> at Government College of Technology,
              Coimbatore — one of the most prestigious engineering institutions in Tamil Nadu.
            </p>
            <p className="about__text">
              Bringing together students from across the country, Vertex is a celebration of innovation,
              creativity, and technical excellence. With <strong>15+ events</strong> spanning technical
              challenges, non-technical competitions, hands-on workshops, and high-energy hackathons,
              there's something for everyone.
            </p>
            <p className="about__text">
              Whether you're a coding enthusiast, a design thinker, or a problem solver — Vertex is your
              stage to showcase talent, learn from the best, and compete with the brightest minds.
            </p>
          </motion.div>

          {/* Right Column — Cards Grid */}
          <motion.div
            className="about__cards-column"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="about__highlights-grid">
              {highlights.map((item, i) => (
                <motion.div
                  className="about__card glass-card"
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                >
                  <div className="about__card-icon-wrapper">
                    {item.icon}
                  </div>
                  <div className="about__card-info">
                    <h3 className="about__card-label">{item.label}</h3>
                    <p className="about__card-desc">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
