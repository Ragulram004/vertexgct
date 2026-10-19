import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { eventTracks } from '../data/mockData';
import './EventTracks.css';

const TrackCard = ({ track, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="track-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
      id={`track-card-${track.id}`}
    >
      <div className="track-card__glow" style={{ background: `${track.color}15` }} />
      <div className="track-card__icon-wrap" style={{ background: `${track.color}18`, borderColor: `${track.color}30` }}>
        <span className="track-card__icon">{track.icon}</span>
      </div>
      <h3 className="track-card__title">{track.name}</h3>
      <p className="track-card__desc">{track.description}</p>
      <div className="track-card__footer">
        <span className="track-card__count" style={{ color: track.color }}>
          {track.eventCount} Events
        </span>
        <Link
          to={`/events?type=${encodeURIComponent(track.name)}`}
          className="track-card__link"
          style={{ color: track.color }}
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const EventTracks = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section className="section event-tracks" id="event-tracks" ref={sectionRef}>
      <div className="grid-bg" />
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Event Tracks
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Explore our diverse range of events across four exciting tracks
        </motion.p>

        <div className="event-tracks__grid">
          {eventTracks.map((track, index) => (
            <TrackCard key={track.id} track={track} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTracks;
