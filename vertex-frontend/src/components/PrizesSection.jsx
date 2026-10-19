import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Users, Award } from 'lucide-react';
import { prizes } from '../data/mockData';
import './PrizesSection.css';

const iconMap = {
  network: <Users size={28} />,
  trophy: <Trophy size={28} />,
  award: <Award size={28} />,
};

const PrizesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section prizes" id="prizes-section" ref={ref}>
      <div className="grid-bg" />
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Prizes & Rewards
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Compete for exciting prizes, recognition, and industry exposure
        </motion.p>

        <div className="prizes__grid">
          {prizes.map((prize, index) => (
            <motion.div
              className={`prizes__card glass-card ${prize.highlight ? 'prizes__card--highlight' : ''}`}
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
            >
              {prize.highlight && <div className="prizes__card-glow" />}
              <div className={`prizes__icon ${prize.highlight ? 'prizes__icon--highlight' : ''}`}>
                {iconMap[prize.icon]}
              </div>
              <h3 className="prizes__title">{prize.title}</h3>
              {prize.value && (
                <span className="prizes__value">{prize.value}</span>
              )}
              <p className="prizes__desc">{prize.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
