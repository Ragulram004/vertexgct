import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import './Events.css';
import { getEventPrizes } from '../data/mockData';
import AccommodationNotice from '../components/AccommodationNotice';

const MotionLink = motion(Link);

const TABS = ['All', 'Technical', 'Non Technical', 'Hackathons', 'Combo'];
const DAYS = [
  { value: 'All Days', label: 'All Days' },
  { value: 'Day 1', label: 'Day 1 (19th Aug)' },
  { value: 'Day 2', label: 'Day 2 (20th Aug)' },
  { value: 'Day 3', label: 'Day 3 (21st Aug)' }
];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = searchParams.get('type');
  const dayParam = searchParams.get('day');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [activeDay, setActiveDay] = useState('All Days');

  // Sync tab and day with URL search parameters if present
  useEffect(() => {
    if (typeParam && TABS.includes(typeParam)) {
      setActiveTab(typeParam);
    } else {
      setActiveTab('All');
    }

    const matchedDay = DAYS.find(d => d.value === dayParam);
    if (matchedDay) {
      setActiveDay(matchedDay.value);
    } else {
      setActiveDay('All Days');
    }
  }, [typeParam, dayParam]);

  // Fetch events list
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://admin.vertexgct.in/api/events');
        if (!res.ok) {
          throw new Error('Failed to fetch events from backend API');
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setEvents(json.data);
        } else {
          throw new Error('API response format was invalid.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Could not connect to the local API server.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    const newParams = {};
    if (tabName !== 'All') newParams.type = tabName;
    if (activeDay !== 'All Days') newParams.day = activeDay;
    setSearchParams(newParams);
  };

  const handleDayChange = (dayValue) => {
    setActiveDay(dayValue);
    const newParams = {};
    if (activeTab !== 'All') newParams.type = activeTab;
    if (dayValue !== 'All Days') newParams.day = dayValue;
    setSearchParams(newParams);
  };

  // Filter events by tab and day, and sort by prize pool in ascending order
  const filteredEvents = events.filter((evt) => {
    const matchesTrack = activeTab === 'All' || evt.type === activeTab;
    
    const dayVal = evt.info || evt.event_day;
    let eventDayStr = '';
    if (dayVal === '1' || dayVal === 1) {
      eventDayStr = 'Day 1';
    } else if (dayVal === '2' || dayVal === 2) {
      eventDayStr = 'Day 2';
    } else if (dayVal === '3' || dayVal === 3) {
      eventDayStr = 'Day 3';
    } else if (dayVal) {
      const dayValStr = String(dayVal);
      if (dayValStr.toLowerCase().includes('day 1')) {
        eventDayStr = 'Day 1';
      } else if (dayValStr.toLowerCase().includes('day 2')) {
        eventDayStr = 'Day 2';
      } else if (dayValStr.toLowerCase().includes('day 3')) {
        eventDayStr = 'Day 3';
      } else {
        eventDayStr = dayValStr;
      }
    }

    const matchesDay = activeDay === 'All Days' || eventDayStr === activeDay;
    return matchesTrack && matchesDay;
  }).sort((a, b) => {
    const prizeA = getEventPrizes(a.name)?.total || 0;
    const prizeB = getEventPrizes(b.name)?.total || 0;
    return prizeB - prizeA;
  });

  return (
    <main id="events-page" style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
      <section className="section events-section">
        <div className="grid-bg" />
        <div className="container">
          
          <div className="events-header">
            <h1 className="section-title">Explore Events</h1>
            <p className="section-subtitle">
              Choose your track and register for the ultimate technical and non-technical challenges.
            </p>
          </div>


          {/* Track Tabs (Desktop) */}
          <div className="events-tabs desktop-only">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`events-tab ${activeTab === tab ? 'events-tab--active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Track Dropdown (Mobile) */}
          <div className="filter-dropdown-container mobile-only">
            <label htmlFor="track-select" className="filter-dropdown-label">Category</label>
            <select
              id="track-select"
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              className="filter-select"
            >
              {TABS.map((tab) => (
                <option key={tab} value={tab}>
                  {tab === 'All' ? 'All Categories' : tab}
                </option>
              ))}
            </select>
          </div>

          {/* Day Tabs (Desktop) */}
          <div className="events-tabs events-tabs--small desktop-only" style={{ marginTop: '-15px' }}>
            {DAYS.map((day) => (
              <button
                key={day.value}
                className={`events-tab events-tab--small ${activeDay === day.value ? 'events-tab--active' : ''}`}
                onClick={() => handleDayChange(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Day Dropdown (Mobile) */}
          <div className="filter-dropdown-container mobile-only" style={{ marginBottom: 'var(--space-8)' }}>
            <label htmlFor="day-select" className="filter-dropdown-label">Event Day</label>
            <select
              id="day-select"
              value={activeDay}
              onChange={(e) => handleDayChange(e.target.value)}
              className="filter-select"
            >
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="events-loading">
              <div className="spinner" />
              <p>Loading events from the server...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="events-empty glass-card" style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <AlertCircle size={48} style={{ color: '#ef4444' }} />
              <h3 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--text-lg)' }}>
                Connection Error
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                We couldn't connect to the API server at <code>https://admin.vertexgct.in/api/events</code>. 
                Please make sure the server is online or check your internet connection.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="events-empty glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Calendar size={48} style={{ color: 'var(--color-accent-primary)', opacity: 0.6 }} />
              <h3 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--text-lg)' }}>
                No Events Found
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                There are currently no events registered matching the selected track and day filters.
              </p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div 
              className="events-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredEvents.map((event, idx) => (
                <MotionLink
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="event-card glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="event-card__img-container">
                    <img 
                      src={event.image_url || '/placeholder-event.jpg'} 
                      alt={event.name} 
                      className="event-card__img" 
                      loading="lazy"
                    />
                    <div className="event-card__overlay" />
                  </div>
                  <div className="event-card__content">
                    <div className="event-card__badges-wrapper">
                      <span className="event-card__badge event-card__badge--type">{event.type}</span>
                      {event.status === 'Inactive' && (
                        <span className="event-card__badge event-card__badge--closed">Closed</span>
                      )}
                      {(event.info || event.event_day) && (
                        <span className="event-card__badge event-card__badge--day">
                          {(() => {
                            const dayVal = event.info || event.event_day;
                            if (dayVal === '1' || dayVal === 1) return 'Day 1';
                            if (dayVal === '2' || dayVal === 2) return 'Day 2';
                            if (dayVal === '3' || dayVal === 3) return 'Day 3';
                            const dayValStr = String(dayVal);
                            return dayValStr.split(' ')[0] + ' ' + (dayValStr.split(' ')[1] || '');
                          })()}
                        </span>
                      )}
                    </div>
                    <h3 className="event-card__title">{event.name}</h3>
                    <div className="event-card__footer">
                      <span>Click for Details</span>
                    </div>
                  </div>
                </MotionLink>
              ))}
            </motion.div>
          )}

        </div>
      </section>
    </main>
  );
};

export default Events;
