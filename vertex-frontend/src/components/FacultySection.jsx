import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Award, Building2, Sparkles } from 'lucide-react';
import './FacultySection.css';

const FacultySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="section faculty-section" id="faculty-section" ref={ref}>
      <div className="container">
        <motion.div
          className="faculty-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="faculty-card__glow-gold" />
          <div className="faculty-card__glow-blue" />

          <h3 className="faculty-card__subtitle">Faculty Coordinator — PDDC Club</h3>

          <div className="faculty-card__content">
            <div className="faculty-card__avatar-wrap">
              <div className="faculty-card__avatar">
                <GraduationCap size={32} />
              </div>
            </div>

            <div className="faculty-card__details">
              <h4 className="faculty-card__name">Dr. Parimala Murugaveni S</h4>
              <p className="faculty-card__role">
                <Award size={16} /> Associate Professor
              </p>
              <p className="faculty-card__inst">
                <Building2 size={16} /> Government College of Technology, Coimbatore
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacultySection;
