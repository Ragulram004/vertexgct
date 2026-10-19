import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  PhoneCall,
  Phone
} from 'lucide-react';
import './AccommodationSection.css';

const AccommodationSection = () => {
  // Eligibility Checker State
  const [isOutstation, setIsOutstation] = useState(null); // true, false
  const [registeredDays, setRegisteredDays] = useState(null); // '1', '2', '3'

  const checkEligibility = () => {
    if (isOutstation === null || registeredDays === null) return null;
    const daysNum = parseInt(registeredDays, 10);
    // Eligible if participant/college is OUTSIDE Coimbatore region AND registered for MORE THAN 1 day (>1 day, i.e. 2 or 3 days)
    const isEligible = isOutstation === true && daysNum > 1;
    return isEligible;
  };

  const eligibilityStatus = checkEligibility();

  return (
    <section className="section accommodation-section" id="accommodation">
      <div className="grid-bg" />
      <div className="container">
        
        <div className="accommodation-header text-center">
          <motion.div 
            className="accommodation-badge"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Building2 size={16} /> Campus Stay Details
          </motion.div>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Accommodation & Stay Facility
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We provide comfortable on-campus hostel accommodation at GCT Coimbatore for eligible outstation participants during VERTEX 2026.
          </motion.p>
        </div>

        {/* Two Column Section: Eligibility Guidelines & Interactive Checker */}
        <div className="accommodation-grid">
          
          {/* Rules Card */}
          <motion.div 
            className="accommodation-card glass-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="accommodation-card__title">
              <ShieldCheck className="accommodation-icon-gold" size={24} />
              Eligibility Criteria
            </h3>
            <p className="accommodation-card__desc">
              To ensure fair allocation of hostel facilities, participants must satisfy both of the following mandatory conditions:
            </p>

            <ul className="accommodation-rules-list">
              <li className="accommodation-rule-item">
                <div className="rule-badge-num">1</div>
                <div className="rule-content">
                  <h4>Outstation Participant / College</h4>
                  <p>The participant or their studying institution <strong>must NOT be from Coimbatore region</strong> (must be located outside Coimbatore).</p>
                </div>
              </li>

              <li className="accommodation-rule-item">
                <div className="rule-badge-num">2</div>
                <div className="rule-content">
                  <h4>Multi-Day Online Registration</h4>
                  <p>The participant must be <strong>registered online for MORE THAN 1 day</strong> out of the 3 days event (i.e. attending events across 2 or 3 days).</p>
                </div>
              </li>
            </ul>

            <div className="accommodation-highlight-box">
              <CheckCircle2 size={20} className="text-gold" />
              <span>
                <strong>Eligibility Summary:</strong> Participants who are from <em>outside Coimbatore region</em> AND <em>registered online for more than 1 day of 3-day events</em> are eligible for hostel accommodation.
              </span>
            </div>
          </motion.div>

          {/* Interactive Eligibility Checker */}
          <motion.div 
            className="accommodation-card glass-card checker-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="accommodation-card__title">
              <HelpCircle className="accommodation-icon-blue" size={24} />
              Check Your Eligibility
            </h3>
            <p className="accommodation-card__desc">
              Select your region and registration details to check if you qualify for on-campus stay:
            </p>

            <div className="checker-form">
              {/* Question 1: Region */}
              <div className="checker-group">
                <label className="checker-label">
                  <MapPin size={16} /> Where is your college / home located?
                </label>
                <div className="checker-options">
                  <button 
                    type="button"
                    className={`checker-btn ${isOutstation === false ? 'checker-btn--selected-neg' : ''}`}
                    onClick={() => setIsOutstation(false)}
                  >
                    Inside Coimbatore Region
                  </button>
                  <button 
                    type="button"
                    className={`checker-btn ${isOutstation === true ? 'checker-btn--selected' : ''}`}
                    onClick={() => setIsOutstation(true)}
                  >
                    Outside Coimbatore Region
                  </button>
                </div>
              </div>

              {/* Question 2: Registered Days */}
              <div className="checker-group">
                <label className="checker-label">
                  <CalendarCheck size={16} /> How many days of events are you registered for?
                </label>
                <div className="checker-options days-options">
                  <button 
                    type="button"
                    className={`checker-btn ${registeredDays === '1' ? 'checker-btn--selected' : ''}`}
                    onClick={() => setRegisteredDays('1')}
                  >
                    1 Day
                  </button>
                  <button 
                    type="button"
                    className={`checker-btn ${registeredDays === '2' ? 'checker-btn--selected' : ''}`}
                    onClick={() => setRegisteredDays('2')}
                  >
                    2 Days
                  </button>
                  <button 
                    type="button"
                    className={`checker-btn ${registeredDays === '3' ? 'checker-btn--selected' : ''}`}
                    onClick={() => setRegisteredDays('3')}
                  >
                    3 Days
                  </button>
                </div>
              </div>

              {/* Status Output */}
              {eligibilityStatus !== null && (
                <motion.div 
                  className={`checker-result ${eligibilityStatus ? 'checker-result--eligible' : 'checker-result--ineligible'}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {eligibilityStatus ? (
                    <>
                      <CheckCircle2 size={28} className="result-icon success" />
                      <div>
                        <h4 className="result-title text-success">You are Eligible for Accommodation! 🎉</h4>
                        <p className="result-desc">
                          You meet both criteria: You are from outside Coimbatore region and registered for more than 1 day of events. Please present your event registration confirmation at the accommodation desk upon arrival.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle size={28} className="result-icon warning" />
                      <div>
                        <h4 className="result-title text-warning">Not Eligible for Hostel Stay</h4>
                        <p className="result-desc">
                          {isOutstation === false 
                            ? 'Accommodation is reserved exclusively for participants coming from outside Coimbatore region.'
                            : 'To be eligible for accommodation, you must be registered online for more than 1 day (at least 2 or 3 days of events).'}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Accommodation Booking Contacts */}
        <motion.div 
          className="accommodation-contacts glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="contacts-header">
            <h4 className="contacts-title">
              <PhoneCall className="text-gold" size={22} />
              Accommodation Booking Contacts
            </h4>
            <p className="contacts-subtitle">
              For hostel room allocation &amp; stay queries, reach out to our team coordinators:
            </p>
          </div>

          <div className="contacts-grid">
            <div className="contact-card contact-card--women">
              <div className="contact-card__badge">Women's Hostel</div>
              <div className="contact-card__info">
                <span className="contact-card__label">Booking Coordinators (Women)</span>
                <a href="tel:+918015440857" className="contact-card__phone">
                  <Phone size={18} /> +91 80154 40857
                </a>
                <a href="tel:+918838726498" className="contact-card__phone">
                  <Phone size={18} /> +91 88387 26498
                </a>
              </div>
            </div>

            <div className="contact-card contact-card--men">
              <div className="contact-card__badge">Men's Hostel</div>
              <div className="contact-card__info">
                <span className="contact-card__label">Booking Coordinators (Men)</span>
                <a href="tel:+918637453590" className="contact-card__phone">
                  <Phone size={18} /> +91 86374 53590
                </a>
                <a href="tel:+916369424462" className="contact-card__phone">
                  <Phone size={18} /> +91 63694 24462
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AccommodationSection;
