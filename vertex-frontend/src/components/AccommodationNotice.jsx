import { useState } from 'react';
import { Building2, Info, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, MapPin, Calendar, Phone } from 'lucide-react';
import './AccommodationNotice.css';

const AccommodationNotice = ({ variant = 'banner', title = 'Accommodation Details & Eligibility' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === 'compact') {
    return (
      <div className="accommodation-compact-notice">
        <div className="compact-notice-header">
          <Building2 size={18} className="text-gold" />
          <span className="compact-notice-title">Hostel Accommodation Available</span>
        </div>
        <p className="compact-notice-text">
          Eligible for participants <strong>outside Coimbatore region</strong> registered online for <strong>more than 1 day</strong> of events.
        </p>
        <div className="compact-notice-contacts">
          <span><strong>Booking Contacts:</strong></span>
          <span>Women: <a href="tel:+918015440857">+91 80154 40857</a>, <a href="tel:+918838726498">+91 883872 6498</a></span> | 
          <span>Men: <a href="tel:+918637453590">+91 86374 53590</a>, <a href="tel:+916369424462">+91 63694 24462</a></span>
        </div>
      </div>
    );
  }

  return (
    <div className={`accommodation-notice-card glass-card ${variant === 'modal' ? 'accommodation-notice-card--modal' : ''}`}>
      <div className="notice-header">
        <div className="notice-title-wrap">
          <div className="notice-icon-circle">
            <Building2 size={20} />
          </div>
          <div>
            <h4 className="notice-heading">{title}</h4>
            <p className="notice-sub">On-campus stay facility at GCT Coimbatore</p>
          </div>
        </div>

        {variant !== 'modal' && (
          <button 
            type="button" 
            className="notice-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      <div className={`notice-body ${isExpanded || variant === 'modal' ? 'notice-body--open' : ''}`}>
        <div className="notice-eligibility-badge">
          <Info size={16} /> Accommodation Eligibility Criteria
        </div>

        <div className="notice-rules-grid">
          <div className="notice-rule-box">
            <div className="rule-badge">Rule 1</div>
            <div className="rule-text">
              <MapPin size={15} className="rule-icon" />
              <span>Participant / College must <strong>NOT be from Coimbatore region</strong> (Outstation participants).</span>
            </div>
          </div>

          <div className="notice-rule-box">
            <div className="rule-badge">Rule 2</div>
            <div className="rule-text">
              <Calendar size={15} className="rule-icon" />
              <span>Participant must be registered online for <strong>MORE THAN 1 day</strong> out of 3 days of events (2 or 3 days).</span>
            </div>
          </div>
        </div>

        <div className="notice-contacts-row">
          <span className="contacts-label"><Phone size={14} /> <strong>Hostel Booking Contacts:</strong></span>
          <div className="contacts-tags">
            <a href="tel:+918015440857" className="contact-tag contact-tag--women">Women: +91 80154 40857</a>
            <a href="tel:+918838726498" className="contact-tag contact-tag--women">+91 883 872 6498</a>
            <a href="tel:+918637453590" className="contact-tag contact-tag--men">Men: +91 863 745 3590</a>
            <a href="tel:+916369424462" className="contact-tag contact-tag--men">+91 63694 24462</a>
          </div>
        </div>

        <div className="notice-footer-msg">
          <CheckCircle2 size={16} className="text-success" />
          <span>If you satisfy both conditions, accommodation facilities will be provided on campus upon arrival.</span>
        </div>
      </div>
    </div>
  );
};

export default AccommodationNotice;
