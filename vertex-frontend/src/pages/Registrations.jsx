import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield, 
  FileText,
  Loader
} from 'lucide-react';
import './Registrations.css';

const API_BASE = 'https://admin.vertexgct.in';

const Registrations = () => {
  const [vtxId, setVtxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = vtxId.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a valid Application ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setRegistration(null);
    setSearched(true);

    try {
      const res = await fetch(`${API_BASE}/api/register/${trimmed}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.status === 404) {
        throw new Error(`No registration found for ID "${trimmed}". Please double-check your Application ID.`);
      }

      if (!res.ok) {
        throw new Error('Failed to fetch registration details. Server may be unreachable.');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setRegistration(json.data);
      } else {
        throw new Error('Unexpected response format from server.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-badge--pending';
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'completed') return 'status-badge--approved';
    if (s === 'rejected' || s === 'failed') return 'status-badge--rejected';
    if (s === 'verified') return 'status-badge--verified';
    if (s === 'not verified') return 'status-badge--not-verified';
    return 'status-badge--pending';
  };

  const getStepState = (currentStatus, stepStatus) => {
    const cs = (currentStatus || 'pending').toLowerCase();

    if (cs === 'rejected' || cs === 'failed') {
      if (stepStatus === 'registered') return 'done';
      if (stepStatus === 'payment') return 'rejected';
      return 'rejected';
    }

    if (cs === 'approved' || cs === 'completed') return 'done';
    
    // Pending
    if (stepStatus === 'registered') return 'done';
    if (stepStatus === 'payment') return 'active';
    return 'pending';
  };

  const parseTeamMembers = (membersStr) => {
    if (!membersStr) return [];
    try {
      const parsed = JSON.parse(membersStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // --- Privacy masking helpers ---
  const maskName = (name) => {
    if (!name || name.length <= 2) return name || '—';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const maskEmail = (email) => {
    if (!email) return '—';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length <= 2
      ? local[0] + '*'
      : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    return `${maskedLocal}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length <= 4) return phone || '—';
    return phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2);
  };

  const maskTransactionId = (txnId) => {
    if (!txnId || txnId.length <= 4) return txnId || '—';
    return txnId.slice(0, 2) + '*'.repeat(txnId.length - 4) + txnId.slice(-2);
  };

  const reg = registration;

  return (
    <main id="registrations-page" className="registrations-page" style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
      <div className="grid-bg" />
      <section className="section">
        <div className="container">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
              Track Registration
            </h1>
            <p className="section-subtitle">
              Enter your Application ID to view your registration status, payment verification, and event details.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="reg-search"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <form className="reg-search__form" onSubmit={handleSearch}>
              <div className="reg-search__input-wrap">
                <input 
                  type="text"
                  className="reg-search__input"
                  placeholder="Enter Application ID (e.g. VTX03001)"
                  value={vtxId}
                  onChange={(e) => {
                    setVtxId(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                />
                <Search className="reg-search__icon" size={18} />
              </div>
              <button type="submit" className="reg-search__btn" disabled={loading || !vtxId.trim()}>
                {loading ? (
                  <>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Track
                  </>
                )}
              </button>
            </form>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="reg-error-alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="reg-error-alert__icon" size={20} />
                  <span className="reg-error-alert__text">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Empty State (before search) */}
          {!searched && !registration && (
            <motion.div
              className="reg-empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="reg-empty-state__icon-wrap">
                <FileText size={32} />
              </div>
              <h3 className="reg-empty-state__title">Find Your Registration</h3>
              <p className="reg-empty-state__desc">
                After registering for an event, you receive a unique Application ID. 
                Enter it above to check your payment and approval status.
              </p>
            </motion.div>
          )}

          {/* No Results */}
          {searched && !loading && !registration && !error && (
            <motion.div
              className="reg-empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="reg-empty-state__icon-wrap" style={{ borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.04)' }}>
                <XCircle size={32} style={{ color: '#ef4444' }} />
              </div>
              <h3 className="reg-empty-state__title">Not Found</h3>
              <p className="reg-empty-state__desc">
                We couldn't find any registration matching that ID. Make sure you've entered the correct Application ID generated during registration.
              </p>
            </motion.div>
          )}

          {/* Registration Result Card */}
          <AnimatePresence>
            {reg && (
              <motion.div
                className="reg-result glass-card"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{ cursor: 'default' }}
                whileHover={{ transform: 'none', boxShadow: 'none' }}
              >
                {/* Header: App ID + Status Badges */}
                <div className="reg-result__header">
                  <div className="reg-result__app-id-wrap">
                    <span className="reg-result__app-label">Application ID</span>
                    <span className="reg-result__app-id">{reg.application_id}</span>
                  </div>
                  <div className="reg-result__status-badges">
                    <span className={`status-badge ${getStatusBadgeClass(reg.status)}`}>
                      <span className="status-badge__dot" />
                      {reg.status}
                    </span>
                    <span className={`status-badge ${getStatusBadgeClass(reg.payment_status)}`}>
                      <CreditCard size={12} />
                      Payment: {reg.payment_status}
                    </span>
                    <span className={`status-badge ${getStatusBadgeClass(reg.arrival_status)}`}>
                      <Shield size={12} />
                      {reg.arrival_status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="reg-result__body">

                  {/* Status Timeline */}
                  <div className="reg-detail-section">
                    <h4 className="reg-detail-section__title">Registration Progress</h4>
                    <div className="reg-status-track">
                      {/* Step 1: Registered */}
                      <div className="reg-status-step">
                        <div className={`reg-status-step__circle reg-status-step__circle--${getStepState(reg.status, 'registered')}`}>
                          <CheckCircle size={16} />
                        </div>
                        <span className="reg-status-step__label">Registered</span>
                        <div className={`reg-status-step__connector reg-status-step__connector--${getStepState(reg.status, 'registered') === 'done' ? 'done' : 'pending'}`} />
                      </div>

                      {/* Step 2: Payment */}
                      <div className="reg-status-step">
                        <div className={`reg-status-step__circle reg-status-step__circle--${getStepState(reg.payment_status, 'payment')}`}>
                          {reg.payment_status?.toLowerCase() === 'completed' ? (
                            <CheckCircle size={16} />
                          ) : reg.payment_status?.toLowerCase() === 'failed' ? (
                            <XCircle size={16} />
                          ) : (
                            <Clock size={16} />
                          )}
                        </div>
                        <span className="reg-status-step__label">Payment Verified</span>
                        <div className={`reg-status-step__connector reg-status-step__connector--${reg.payment_status?.toLowerCase() === 'completed' ? 'done' : 'pending'}`} />
                      </div>

                      {/* Step 3: Approved */}
                      <div className="reg-status-step">
                        <div className={`reg-status-step__circle reg-status-step__circle--${getStepState(reg.status, 'approved')}`}>
                          {reg.status?.toLowerCase() === 'approved' ? (
                            <CheckCircle size={16} />
                          ) : reg.status?.toLowerCase() === 'rejected' ? (
                            <XCircle size={16} />
                          ) : (
                            <Clock size={16} />
                          )}
                        </div>
                        <span className="reg-status-step__label">
                          {reg.status?.toLowerCase() === 'rejected' ? 'Rejected' : 'Approved'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remark (if rejected) */}
                  {reg.remark && (
                    <div className="reg-remark-card">
                      <AlertCircle className="reg-remark-card__icon" size={18} />
                      <div>
                        <strong style={{ fontSize: 'var(--text-sm)', display: 'block', marginBottom: '2px' }}>Admin Remark</strong>
                        <span className="reg-remark-card__text">{reg.remark}</span>
                      </div>
                    </div>
                  )}

                  {/* Team Leader Details (masked for privacy) */}
                  <div className="reg-detail-section">
                    <h4 className="reg-detail-section__title">Team Leader</h4>
                    <div className="reg-detail-grid">
                      <div className="reg-detail-item">
                        <span className="reg-detail-item__label"><User size={12} style={{ display: 'inline', marginRight: '4px' }} />Name</span>
                        <span className="reg-detail-item__value">{maskName(reg.team_leader_name)}</span>
                      </div>
                      <div className="reg-detail-item">
                        <span className="reg-detail-item__label"><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />Email</span>
                        <span className="reg-detail-item__value">{maskEmail(reg.team_leader_email)}</span>
                      </div>
                      <div className="reg-detail-item">
                        <span className="reg-detail-item__label"><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />Phone</span>
                        <span className="reg-detail-item__value">{maskPhone(reg.team_leader_phone)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Info — count only for privacy */}
                  {reg.team_count > 1 && (
                    <div className="reg-detail-section">
                      <h4 className="reg-detail-section__title">
                        <Users size={14} style={{ display: 'inline', marginRight: '6px' }} />
                        Team — {reg.team_name || 'Unnamed Team'}
                      </h4>
                      <div className="reg-detail-grid">
                        <div className="reg-detail-item">
                          <span className="reg-detail-item__label">Total Members</span>
                          <span className="reg-detail-item__value reg-detail-item__value--highlight">{reg.team_count}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Details (masked for privacy) */}
                  <div className="reg-detail-section">
                    <h4 className="reg-detail-section__title">Payment Information</h4>
                    <div className="reg-detail-grid">
                      <div className="reg-detail-item">
                        <span className="reg-detail-item__label">Transaction ID</span>
                        <span className="reg-detail-item__value reg-detail-item__value--mono">{maskTransactionId(reg.transaction_id)}</span>
                      </div>
                      <div className="reg-detail-item">
                        <span className="reg-detail-item__label">Amount Paid</span>
                        <span className="reg-detail-item__value reg-detail-item__value--highlight">₹{parseFloat(reg.transaction_amount).toFixed(2)}</span>
                      </div>
                      <div className="reg-detail-item">
                        <span className="reg-detail-item__label">Registered At</span>
                        <span className="reg-detail-item__value">{formatDate(reg.registered_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ticket ID if present */}
                  {reg.ticket_id && (
                    <div className="reg-detail-section">
                      <h4 className="reg-detail-section__title">Event Day</h4>
                      <div className="reg-detail-grid">
                        <div className="reg-detail-item">
                          <span className="reg-detail-item__label">Ticket ID</span>
                          <span className="reg-detail-item__value reg-detail-item__value--mono reg-detail-item__value--highlight">{reg.ticket_id}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Inline keyframes for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Registrations;
