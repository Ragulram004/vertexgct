import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <main id="contact-page" style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
              Contact Us
            </h1>
            <p className="section-subtitle">
              Have questions? Reach out to the PDDC Club team.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-6)',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              {/* Location Card */}
              <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <MapPin size={32} style={{ color: 'var(--color-accent-primary)', marginBottom: 'var(--space-4)' }} />
                <h3 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  Location
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  Government College of Technology<br />
                  Thadagam Road<br />
                  Coimbatore - 641013<br />
                  Tamil Nadu, India
                </p>
              </div>

              {/* Email Card */}
              <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <Mail size={32} style={{ color: 'var(--color-accent-primary)', marginBottom: 'var(--space-4)' }} />
                <h3 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  Email
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  <a href="mailto:ragulpddc@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>ragulpddc@gmail.com</a><br />
                  <a href="mailto:rubigapddc@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>rubigapddc@gmail.com</a>
                </p>
              </div>

              {/* Phone Card */}
              <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <Phone size={32} style={{ color: 'var(--color-accent-primary)', marginBottom: 'var(--space-4)' }} />
                <h3 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  Phone
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  Ragul: <a href="tel:+918667733680" style={{ color: 'inherit', textDecoration: 'none' }}>+91 86677 33680</a><br />
                  Rubiga: <a href="tel:+916381935659" style={{ color: 'inherit', textDecoration: 'none' }}>+91 63819 35659</a><br />
                  Hariharan: <a href="tel:+919003955995" style={{ color: 'inherit', textDecoration: 'none' }}>+91 90039 55995</a>
                </p>
              </div>
            </div>

            {/* Map Embed Placeholder */}
            <div
              className="glass-card"
              style={{
                marginTop: 'var(--space-12)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <iframe
                title="GCT Coimbatore Location"
                src="https://maps.google.com/maps?q=Government%20College%20of%20Technology,%20Coimbatore&z=16&output=embed"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
