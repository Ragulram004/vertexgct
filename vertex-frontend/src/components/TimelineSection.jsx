import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Clock } from 'lucide-react';
import { timelineSteps } from '../data/mockData';
import './TimelineSection.css';

const TimelineStep = ({ step, index, total }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isCompleted = step.status === 'completed';
  const isLive = step.status === 'live';
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={ref}
      className={`timeline-step ${isCompleted ? 'timeline-step--completed' : ''} ${isLive ? 'timeline-step--live' : ''}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
    >
      {/* Connector Line */}
      {!isLast && <div className="timeline-step__line" />}

      {/* Step Number / Icon */}
      <div className={`timeline-step__marker ${isCompleted ? 'timeline-step__marker--completed' : ''} ${isLive ? 'timeline-step__marker--live' : ''}`}>
        {isCompleted ? <Check size={18} /> : <span>{step.step}</span>}
      </div>

      {/* Content Card */}
      <div className="timeline-step__content glass-card">
        <div className="timeline-step__header">
          <h3 className="timeline-step__title">{step.title}</h3>
          {isLive && (
            <span className="timeline-step__status timeline-step__status--live">
              <span className="timeline-step__pulse" /> Live
            </span>
          )}
          {isCompleted && (
            <span className="timeline-step__status timeline-step__status--done">
              <Check size={12} /> Done
            </span>
          )}
          {!isCompleted && !isLive && (
            <span className="timeline-step__status">
              <Clock size={12} /> Upcoming
            </span>
          )}
        </div>
        {!step.events && step.description && (
          <p className="timeline-step__desc">{step.description}</p>
        )}
        {step.events && (
          <div className="timeline-step__events">
            {step.events.map((evt, idx) => (
              <span key={idx} className="timeline-step__event-pill">
                <span>{evt}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section timeline" id="timeline-section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Timeline of Vertex
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Your journey from registration to victory
        </motion.p>

        <div className="timeline__steps">
          {timelineSteps.map((step, index) => (
            <TimelineStep
              key={step.step}
              step={step}
              index={index}
              total={timelineSteps.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
