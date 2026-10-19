import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar, 
  X, 
  BookOpen, 
  Users, 
  CreditCard, 
  Mail, 
  Phone, 
  Info, 
  AlertCircle, 
  ExternalLink,
  Upload,
  CheckCircle,
  Trophy,
  Award
} from 'lucide-react';
import './EventDetail.css';
import { getEventPrizes } from '../data/mockData';
import AccommodationNotice from '../components/AccommodationNotice';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    team_leader_name: '',
    team_leader_email: '',
    team_leader_phone: '',
    team_leader_department: '',
    team_leader_year: '',
    team_leader_college: '',
    account_holder_name: '',
    team_count: 1,
    team_name: '',
    transaction_amount: '',
    transaction_id: '',
  });

  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [additionalCount, setAdditionalCount] = useState(0);

  const getTeamSizeLimits = (teamCountStr) => {
    if (!teamCountStr) return { min: 1, max: 1 };
    const lowerStr = teamCountStr.toLowerCase();
    if (lowerStr.includes('individual')) return { min: 1, max: 1 };
    const numbers = teamCountStr.match(/\d+/g);
    if (!numbers) return { min: 1, max: 1 };
    
    const parsed = numbers.map(Number);
    if (parsed.length === 1) {
      return { min: parsed[0], max: parsed[0] };
    }
    return {
      min: Math.min(...parsed),
      max: Math.max(...parsed)
    };
  };

  const { min: minTeamSize, max: maxTeamSize } = event 
    ? getTeamSizeLimits(event.team_count) 
    : { min: 1, max: 1 };

  // Fetch Event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://admin.vertexgct.in/api/events/${id}`);
        if (!res.ok) {
          throw new Error('Event not found or server error');
        }
        const json = await res.json();
        if (json.success && json.data) {
          setEvent(json.data);
          
          // Pre-fill transaction amount with the fee if it's a number
          const numericFee = parseFloat(json.data.fee);
          setFormData(prev => ({
            ...prev,
            transaction_amount: !isNaN(numericFee) && numericFee > 0 ? numericFee.toString() : '0.01'
          }));
        } else {
          throw new Error('Failed to load event data.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Could not load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    if (cleanPath.startsWith('storage/')) {
      return `https://admin.vertexgct.in/${cleanPath}`;
    }
    return `https://admin.vertexgct.in/storage/${cleanPath}`;
  };

  const isHtml = (str) => {
    if (!str) return false;
    const trimmed = str.trim();
    return trimmed.startsWith('<') || (trimmed.includes('</') && trimmed.includes('>'));
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Additional team members count change handler
  const handleAdditionalCountChange = (e) => {
    const minVal = minTeamSize - 1;
    const maxVal = maxTeamSize - 1;
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = minVal;
    val = Math.max(minVal, Math.min(val, maxVal));
    
    setAdditionalCount(val);
    setFormData(prev => ({
      ...prev,
      team_count: val + 1
    }));

    // Dynamically adjust team members array size
    setTeamMembers(prev => {
      if (prev.length === val) return prev;
      
      if (prev.length < val) {
        // Grow array
        const diff = val - prev.length;
        const newMembers = Array.from({ length: diff }, () => ({
          name: '',
          email: '',
          phone: '',
          department: '',
          year: '',
          college: formData.team_leader_college || '' // default to leader's college
        }));
        return [...prev, ...newMembers];
      } else {
        // Shrink array
        return prev.slice(0, val);
      }
    });
  };

  // Individual team member change handler
  const handleMemberChange = (index, field, value) => {
    setTeamMembers(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });

    // Clear error
    const errKey = `member_${index}_${field}`;
    if (validationErrors[errKey]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[errKey];
        return copy;
      });
    }
  };

  // Image compression helper for mobile camera photos
  const compressImageIfNeeded = (file) => {
    return new Promise((resolve) => {
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        return resolve(file);
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob && blob.size < file.size) {
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], cleanName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.82);
        };
        img.onerror = () => resolve(file);
        img.src = event.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // File change handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.heic', '.heif', '.webp'];
    const lowerName = file.name.toLowerCase();
    const isExtensionValid = validExtensions.some(ext => lowerName.endsWith(ext));
    const validMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/heic', 'image/heif', 'image/webp'];
    const isMimeValid = validMimes.includes((file.type || '').toLowerCase()) || file.type === '';

    if (!isExtensionValid && !isMimeValid) {
      setValidationErrors(prev => ({
        ...prev,
        proof_of_payment_url: 'Invalid file format. Please upload JPEG, PNG, JPG, GIF, WebP, or SVG'
      }));
      return;
    }

    try {
      const processedFile = await compressImageIfNeeded(file);

      if (processedFile.size > 2 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          proof_of_payment_url: 'Image size must be less than 2MB'
        }));
        return;
      }

      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy.proof_of_payment_url;
        return copy;
      });

      setProofFile(processedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      console.error('File processing error:', err);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setValidationErrors({});

    if (event.status !== 'Active') {
      setSubmitError('Registration for this event is closed.');
      setSubmitLoading(false);
      return;
    }

    // Client-side validations
    const errors = {};
    if (!formData.team_leader_name.trim()) errors.team_leader_name = 'Name is required';
    if (!formData.team_leader_email.trim()) errors.team_leader_email = 'Email is required';
    if (!formData.team_leader_phone.trim()) errors.team_leader_phone = 'Phone number is required';
    if (!formData.team_leader_college.trim()) errors.team_leader_college = 'College is required';
    if (!formData.team_leader_department.trim()) errors.team_leader_department = 'Department is required';
    if (!formData.team_leader_year) errors.team_leader_year = 'Year of study is required';
    if (!formData.transaction_id.trim()) errors.transaction_id = 'Transaction ID is required';
    if (!formData.transaction_amount || parseFloat(formData.transaction_amount) < 0.01) {
      errors.transaction_amount = 'Valid transaction amount is required';
    }
    if (!proofFile) {
      errors.proof_of_payment_url = 'Proof of payment screenshot is required';
    }

    if (maxTeamSize > 1) {
      if (formData.team_count < minTeamSize || formData.team_count > maxTeamSize) {
        errors.team_count = `Team size must be between ${minTeamSize} and ${maxTeamSize} members (including the team leader)`;
      }

      if (formData.team_count > 1 && !formData.team_name.trim()) errors.team_name = 'Team Name is required for group events';
      
      // Validate each member
      teamMembers.forEach((member, index) => {
        if (!member.name.trim()) errors[`member_${index}_name`] = 'Member name is required';
        if (!member.college.trim()) errors[`member_${index}_college`] = 'Member college is required';
        if (!member.department.trim()) errors[`member_${index}_department`] = 'Member department is required';
        if (!member.year) errors[`member_${index}_year`] = 'Member year of study is required';
      });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitLoading(false);
      // Asynchronously scroll to the first error once DOM updates
      setTimeout(() => {
        const formBody = document.querySelector('.reg-modal__form-body');
        const firstErrEl = document.querySelector('.form-input--error, .form-error-msg');
        if (firstErrEl) {
          firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (formBody) {
          formBody.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('event_id', id);
      payload.append('team_leader_name', formData.team_leader_name.trim());
      payload.append('team_leader_email', formData.team_leader_email.trim());
      // Sanitize phone number (strip extraneous spaces/hyphens to avoid >15 char limit)
      const cleanPhone = formData.team_leader_phone.trim().replace(/[^\d+]/g, '');
      payload.append('team_leader_phone', cleanPhone);
      if (formData.team_leader_department) payload.append('team_leader_department', formData.team_leader_department.trim());
      if (formData.team_leader_year) payload.append('team_leader_year', formData.team_leader_year);
      payload.append('team_leader_college', formData.team_leader_college.trim());
      if (formData.account_holder_name) payload.append('account_holder_name', formData.account_holder_name.trim());
      payload.append('team_count', formData.team_count);
      
      if (formData.team_count > 1) {
        payload.append('team_name', formData.team_name.trim());
        payload.append('team_members', JSON.stringify(teamMembers));
      }

      payload.append('transaction_amount', formData.transaction_amount);
      payload.append('transaction_id', formData.transaction_id.trim());

      if (proofFile) {
        payload.append('proof_of_payment_url', proofFile);
      }

      const res = await fetch('https://admin.vertexgct.in/api/register', {
        method: 'POST',
        body: payload,
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await res.json();

      if (res.status === 422) {
        // Validation fails from backend Laravel controller
        const backendErrors = {};
        if (data.errors) {
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key][0];
          });
        }
        setValidationErrors(backendErrors);
        setTimeout(() => {
          const formBody = document.querySelector('.reg-modal__form-body');
          const firstErrEl = document.querySelector('.form-input--error, .form-error-msg');
          if (firstErrEl) {
            firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (formBody) {
            formBody.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
        throw new Error(data.message || 'Validation failed. Please check your inputs.');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit registration. Please try again.');
      }

      // Success!
      setSuccessData(data.data);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'An error occurred during submission.');
      setTimeout(() => {
        const formBody = document.querySelector('.reg-modal__form-body');
        if (formBody) {
          formBody.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const defaultAdditional = minTeamSize > 1 ? minTeamSize - 1 : 0;
    setFormData({
      team_leader_name: '',
      team_leader_email: '',
      team_leader_phone: '',
      team_leader_department: '',
      team_leader_year: '',
      team_leader_college: '',
      account_holder_name: '',
      team_count: defaultAdditional + 1,
      team_name: '',
      transaction_amount: event && !isNaN(parseFloat(event.fee)) ? parseFloat(event.fee).toString() : '0.01',
      transaction_id: '',
    });
    setAdditionalCount(defaultAdditional);
    setProofFile(null);
    setProofPreview('');
    
    // Pre-populate empty member objects based on the default additional count
    const initialMembers = Array.from({ length: defaultAdditional }, () => ({
      name: '',
      email: '',
      phone: '',
      department: '',
      year: '',
      college: ''
    }));
    setTeamMembers(initialMembers);
    
    setValidationErrors({});
    setSubmitError(null);
    setSuccessData(null);
  };

  if (loading) {
    return (
      <div className="events-loading" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="events-empty glass-card" style={{ maxWidth: '600px', margin: '150px auto', padding: 'var(--space-10)', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto var(--space-4) auto' }} />
        <h3 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--text-lg)' }}>Error Loading Event</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>{error || 'The requested event could not be found.'}</p>
        <Link to="/events" className="btn-outline">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="event-detail-page" style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
      <div className="grid-bg" />
      <div className="container">
        
        <Link to="/events" className="back-link">
          <ArrowLeft size={16} /> Back to All Events
        </Link>

        <div className="event-detail-container">
          {/* Left Column Sidebar */}
          <div className="event-detail__sidebar">
            <div className="event-detail__poster-card glass-card">
              <img 
                src={event.image_url || '/placeholder-event.jpg'} 
                alt={event.name} 
                className="event-detail__poster"
              />
              <div className="event-detail__quick-info">
                <h4 className="event-detail__info-title">Key Information</h4>
                <div className="event-detail__meta-list">
                  <div className="event-detail__meta-row">
                    <Users className="event-detail__meta-icon" size={18} />
                    <div className="event-detail__meta-data">
                      <span className="event-detail__meta-lbl">Team Size</span>
                      <span className="event-detail__meta-val">{event.team_count || 'Individual'}</span>
                    </div>
                  </div>

                  <div className="event-detail__meta-row">
                    <CreditCard className="event-detail__meta-icon" size={18} />
                    <div className="event-detail__meta-data">
                      <span className="event-detail__meta-lbl">Registration Fee</span>
                      <span className="event-detail__meta-val">
                        {event.fee && event.fee !== '0' ? `₹${event.fee}` : 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="event-detail__meta-row">
                    <Calendar className="event-detail__meta-icon" size={18} />
                    <div className="event-detail__meta-data">
                      <span className="event-detail__meta-lbl">Online Registration Deadline</span>
                      <span className="event-detail__meta-val">{event.deadline || 'TBA'}</span>
                    </div>
                  </div>

                  <div className="event-detail__meta-row">
                    <Info className="event-detail__meta-icon" size={18} />
                    <div className="event-detail__meta-data">
                      <span className="event-detail__meta-lbl">On-spot Registration</span>
                      <span className="event-detail__meta-val">Available till 1 hour before starting the event</span>
                    </div>
                  </div>

                  {(event.info || event.event_day) && (
                    <div className="event-detail__meta-row">
                      <Calendar className="event-detail__meta-icon" size={18} />
                      <div className="event-detail__meta-data">
                        <span className="event-detail__meta-lbl">Event Day</span>
                        <span className="event-detail__meta-val">
                          {(() => {
                            const dayVal = event.info || event.event_day;
                            if (dayVal === '1' || dayVal === 1) return 'Day 1 (19th Aug)';
                            if (dayVal === '2' || dayVal === 2) return 'Day 2 (20th Aug)';
                            if (dayVal === '3' || dayVal === 3) return 'Day 3 (21st Aug)';
                            return dayVal;
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <AccommodationNotice variant="compact" />

            {/* Contacts Info Card */}
            {(event.student_contacts || event.faculty_contacts || event.contact_email) && (
              <div className="event-detail__contacts-card glass-card">
                <h4 className="event-detail__info-title">Contact Coordination</h4>
                {event.student_contacts && (
                  <div className="event-detail__contact-item">
                    <Phone className="event-detail__contact-icon" size={15} />
                    <span><strong>Students:</strong> {event.student_contacts}</span>
                  </div>
                )}
                {event.faculty_contacts && (
                  <div className="event-detail__contact-item">
                    <Users className="event-detail__contact-icon" size={15} />
                    <span><strong>Faculty:</strong> {event.faculty_contacts}</span>
                  </div>
                )}
                {event.contact_email && (
                  <div className="event-detail__contact-item">
                    <Mail className="event-detail__contact-icon" size={15} />
                    <span><strong>Email:</strong> {event.contact_email}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column Content */}
          <div className="event-detail__content">
            
            {/* Header Details */}
            <div className="event-detail__header-card glass-card">
              <span className="event-detail__badge">{event.type}</span>
              <h1 className="event-detail__title">{event.name}</h1>
              {event.short_name && (
                <p className="event-detail__subtitle">({event.short_name})</p>
              )}
            </div>

            {/* Introduction & Description */}
            {event.introduction && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Introduction</h3>
                <p className="event-detail__text" style={{ marginTop: 'var(--space-4)' }}>{event.introduction}</p>
              </div>
            )}

            {event.description && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Description</h3>
                <p className="event-detail__text" style={{ marginTop: 'var(--space-4)' }}>{event.description}</p>
              </div>
            )}

            {/* Rewards & Prizes */}
            {(() => {
              const prizes = getEventPrizes(event.name);
              return (
                <div className="event-detail__section-card glass-card">
                  <h3 className="event-detail__sect-title">Prizes &amp; Rewards</h3>
                  <div className="event-detail__rewards-container" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="event-detail__rewards-grid">
                      <div className="event-detail__reward-item winner-card">
                        <div className="reward-icon-wrapper gold">
                          <Trophy size={24} />
                        </div>
                        <div className="reward-info">
                          <h4 className="reward-rank">Winners (1st, 2nd &amp; 3rd Place)</h4>
                          <p className="reward-value">
                            {prizes ? `Cash Prize Pool: ₹${prizes.total}` : 'Exciting Cash Prizes'}
                          </p>
                        </div>
                      </div>
                      <div className="event-detail__reward-item participant-card">
                        <div className="reward-icon-wrapper blue">
                          <Award size={24} />
                        </div>
                        <div className="reward-info">
                          <h4 className="reward-rank">All Participants</h4>
                          <p className="reward-value">Participation Certificate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rules / Team Formation */}
            {event.team_formation && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Team Rules</h3>
                <p className="event-detail__text" style={{ marginTop: 'var(--space-4)' }}>{event.team_formation}</p>
              </div>
            )}

            {/* Eligibility */}
            {event.eligibility && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Eligibility</h3>
                <p className="event-detail__text" style={{ marginTop: 'var(--space-4)' }}>{event.eligibility}</p>
              </div>
            )}

            {/* Rulebook / Problem statement HTML */}
            {event.rulebook_url && isHtml(event.rulebook_url) && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Rulebook</h3>
                <div 
                  className="rulebook-content" 
                  style={{ marginTop: 'var(--space-4)' }}
                  dangerouslySetInnerHTML={{ __html: event.rulebook_url }}
                />
              </div>
            )}

            {event.problem_url && isHtml(event.problem_url) && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Problem Statement</h3>
                <div 
                  className="rulebook-content" 
                  style={{ marginTop: 'var(--space-4)' }}
                  dangerouslySetInnerHTML={{ __html: event.problem_url }}
                />
              </div>
            )}

            {((event.rulebook_url && !isHtml(event.rulebook_url)) || 
              (event.problem_url && !isHtml(event.problem_url))) && (
              <div className="event-detail__section-card glass-card">
                <h3 className="event-detail__sect-title">Resources</h3>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                  {event.rulebook_url && !isHtml(event.rulebook_url) && (
                    <a 
                      href={getFullUrl(event.rulebook_url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <BookOpen size={16} /> Rulebook <ExternalLink size={14} />
                    </a>
                  )}
                  {event.problem_url && !isHtml(event.problem_url) && (
                    <a 
                      href={getFullUrl(event.problem_url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <Info size={16} /> Problem Statement <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            )}

            <AccommodationNotice title="Accommodation & Stay Eligibility" />

            {/* Registration Banner */}
            <div className="event-detail__reg-banner glass-card">
              <h2 className="event-detail__reg-banner-title">Ready to participate?</h2>
              <p className="event-detail__reg-banner-desc ">
                Follow the payment instructions below, complete the transaction, and register using the portal to secure your spot.
              </p>

              <div className="event-detail__payment-details">
                <div className="event-detail__payment-row">
                  <span className="event-detail__payment-label">UPI ID:</span>
                  <span className="event-detail__payment-val">sparkhari@ybl</span>
                </div>
                <div className="event-detail__payment-row">
                  <span className="event-detail__payment-label">Bank Name:</span>
                  <span className="event-detail__payment-val">Indian Bank</span>
                </div>
                <div className="event-detail__payment-row">
                  <span className="event-detail__payment-label">Account No:</span>
                  <span className="event-detail__payment-val">7776931731</span>
                </div>
                <div className="event-detail__payment-row">
                  <span className="event-detail__payment-label">IFSC Code:</span>
                  <span className="event-detail__payment-val">IDIB000K102</span>
                </div>
                <div className="event-detail__payment-row">
                  <span className="event-detail__payment-label">Fee Amount:</span>
                  <span className="event-detail__payment-val" style={{ color: 'var(--color-accent-primary)' }}>
                    {event.fee && event.fee !== '0' ? `₹${event.fee}` : 'Free (requires 0.01 registration payload)'}
                  </span>
                </div>
              </div>

              {event.status === 'Active' ? (
                <button 
                  onClick={() => {
                    resetForm();
                    setShowRegModal(true);
                  }}
                  className="event-detail__action-btn"
                >
                  Pay &amp; Register Now
                </button>
              ) : (
                <button className="event-detail__action-btn event-detail__action-btn--disabled" disabled>
                  Registration Closed
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showRegModal && (
          <div className="reg-modal">
            <motion.div 
              className="reg-modal__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitLoading && setShowRegModal(false)}
            />

            <motion.div 
              className="reg-modal__container"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <button 
                className="reg-modal__close" 
                onClick={() => setShowRegModal(false)}
                disabled={submitLoading}
              >
                <X size={18} />
              </button>

              {!successData ? (
                <>
                  <div className="reg-modal__header">
                    <h3 className="reg-modal__title">Register for {event.name}</h3>
                    <p className="reg-modal__subtitle">Fill in the details below to complete your registration request.</p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className="reg-modal__form-body">
                      
                      <AccommodationNotice variant="modal" title="Accommodation Eligibility Notice" />

                      {submitError && (
                        <div className="events-empty" style={{ minHeight: 'auto', padding: 'var(--space-4)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--radius-md)' }}>
                          <AlertCircle size={20} style={{ color: '#ef4444', display: 'inline', marginRight: '8px' }} />
                          <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{submitError}</span>
                        </div>
                      )}

                      {/* Section 1: Team Leader Details */}
                      <div className="form-section">
                        <h4 className="form-section__title">Team Leader Details</h4>
                        <div className="form-grid form-grid--2col">
                          
                          <div className="form-group">
                            <label className="form-label">Full Name <span className="required">*</span></label>
                            <input 
                              type="text" 
                              name="team_leader_name"
                              value={formData.team_leader_name}
                              onChange={handleInputChange}
                              placeholder="Enter team leader full name"
                              className={`form-input ${validationErrors.team_leader_name ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.team_leader_name && <span className="form-error-msg">{validationErrors.team_leader_name}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Email Address <span className="required">*</span></label>
                            <input 
                              type="email" 
                              name="team_leader_email"
                              value={formData.team_leader_email}
                              onChange={handleInputChange}
                              placeholder="Enter email address"
                              className={`form-input ${validationErrors.team_leader_email ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.team_leader_email && <span className="form-error-msg">{validationErrors.team_leader_email}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Phone Number <span className="required">*</span></label>
                            <input 
                              type="text" 
                              name="team_leader_phone"
                              value={formData.team_leader_phone}
                              onChange={handleInputChange}
                              placeholder="Enter 10-digit number"
                              maxLength={15}
                              className={`form-input ${validationErrors.team_leader_phone ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.team_leader_phone && <span className="form-error-msg">{validationErrors.team_leader_phone}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">College Name <span className="required">*</span></label>
                            <input 
                              type="text" 
                              name="team_leader_college"
                              value={formData.team_leader_college}
                              onChange={handleInputChange}
                              placeholder="Enter college name"
                              className={`form-input ${validationErrors.team_leader_college ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.team_leader_college && <span className="form-error-msg">{validationErrors.team_leader_college}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Department <span className="required">*</span></label>
                            <input 
                              type="text" 
                              name="team_leader_department"
                              value={formData.team_leader_department}
                              onChange={handleInputChange}
                              placeholder="e.g. CSE, IT, ECE"
                              className={`form-input ${validationErrors.team_leader_department ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.team_leader_department && <span className="form-error-msg">{validationErrors.team_leader_department}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Year of Study <span className="required">*</span></label>
                            <select 
                              name="team_leader_year"
                              value={formData.team_leader_year}
                              onChange={handleInputChange}
                              className={`form-input ${validationErrors.team_leader_year ? 'form-input--error' : ''}`}
                            >
                              <option value="">Select Year</option>
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                            </select>
                            {validationErrors.team_leader_year && <span className="form-error-msg">{validationErrors.team_leader_year}</span>}
                          </div>

                        </div>
                      </div>

                      {/* Section 2: Team Size and Additional Members */}
                      {maxTeamSize > 1 && (
                        <div className="form-section">
                          <h4 className="form-section__title">
                            Team Composition (Team Size: {minTeamSize === maxTeamSize ? minTeamSize : `${minTeamSize}-${maxTeamSize}`})
                          </h4>
                          <div className="form-grid form-grid--2col">
                            
                            <div className="form-group">
                              <label className="form-label">
                                Additional Team Members ({minTeamSize === maxTeamSize ? `Must be ${minTeamSize - 1}` : `Min: ${minTeamSize - 1}, Max: ${maxTeamSize - 1}`}) <span className="required">*</span>
                              </label>
                              <input 
                                type="number" 
                                min={minTeamSize - 1}
                                max={maxTeamSize - 1}
                                value={additionalCount}
                                onChange={handleAdditionalCountChange}
                                className={`form-input ${validationErrors.team_count ? 'form-input--error' : ''}`}
                              />
                              {validationErrors.team_count && <span className="form-error-msg">{validationErrors.team_count}</span>}
                            </div>

                            {additionalCount > 0 && (
                              <div className="form-group">
                                <label className="form-label">Team Name <span className="required">*</span></label>
                                <input 
                                  type="text" 
                                  name="team_name"
                                  value={formData.team_name}
                                  onChange={handleInputChange}
                                  placeholder="Enter team name"
                                  className={`form-input ${validationErrors.team_name ? 'form-input--error' : ''}`}
                                />
                                {validationErrors.team_name && <span className="form-error-msg">{validationErrors.team_name}</span>}
                              </div>
                            )}

                          </div>

                          {/* Dynamic Team Members Fields */}
                          {additionalCount > 0 && teamMembers.map((member, index) => (
                            <div key={index} className="member-card">
                            <div className="member-card__title">Team Member {index + 2}</div>
                            <div className="form-grid form-grid--2col">
                              
                              <div className="form-group">
                                <label className="form-label">Full Name <span className="required">*</span></label>
                                <input 
                                  type="text" 
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                  placeholder="Enter member name"
                                  className={`form-input ${validationErrors[`member_${index}_name`] ? 'form-input--error' : ''}`}
                                />
                                {validationErrors[`member_${index}_name`] && <span className="form-error-msg">{validationErrors[`member_${index}_name`]}</span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label">College Name <span className="required">*</span></label>
                                <input 
                                  type="text" 
                                  value={member.college}
                                  onChange={(e) => handleMemberChange(index, 'college', e.target.value)}
                                  placeholder="Enter college name"
                                  className={`form-input ${validationErrors[`member_${index}_college`] ? 'form-input--error' : ''}`}
                                />
                                {validationErrors[`member_${index}_college`] && <span className="form-error-msg">{validationErrors[`member_${index}_college`]}</span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input 
                                  type="email" 
                                  value={member.email}
                                  onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                  placeholder="Enter email (optional)"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input 
                                  type="text" 
                                  value={member.phone}
                                  onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                                  placeholder="Enter phone (optional)"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Department <span className="required">*</span></label>
                                <input 
                                  type="text" 
                                  value={member.department}
                                  onChange={(e) => handleMemberChange(index, 'department', e.target.value)}
                                  placeholder="e.g. CSE, IT"
                                  className={`form-input ${validationErrors[`member_${index}_department`] ? 'form-input--error' : ''}`}
                                />
                                {validationErrors[`member_${index}_department`] && <span className="form-error-msg">{validationErrors[`member_${index}_department`]}</span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label">Year of Study <span className="required">*</span></label>
                                <select 
                                  value={member.year}
                                  onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                                  className={`form-input ${validationErrors[`member_${index}_year`] ? 'form-input--error' : ''}`}
                                >
                                  <option value="">Select Year</option>
                                  <option value="1">1st Year</option>
                                  <option value="2">2nd Year</option>
                                  <option value="3">3rd Year</option>
                                  <option value="4">4th Year</option>
                                </select>
                                {validationErrors[`member_${index}_year`] && <span className="form-error-msg">{validationErrors[`member_${index}_year`]}</span>}
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                      )}

                      {/* Section 3: Payment & Proof */}
                      <div className="form-section">
                        <h4 className="form-section__title">Payment Verification</h4>
                        <div className="form-grid form-grid--2col">
                          
                          <div className="form-group">
                            <label className="form-label">Transaction ID / UTR <span className="required">*</span></label>
                            <input 
                              type="text" 
                              name="transaction_id"
                              value={formData.transaction_id}
                              onChange={handleInputChange}
                              placeholder="Transaction receipt UTR number"
                              className={`form-input ${validationErrors.transaction_id ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.transaction_id && <span className="form-error-msg">{validationErrors.transaction_id}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Transaction Amount (INR) <span className="required">*</span></label>
                            <input 
                              type="number" 
                              step="0.01"
                              name="transaction_amount"
                              value={formData.transaction_amount}
                              onChange={handleInputChange}
                              placeholder="0.00"
                              className={`form-input ${validationErrors.transaction_amount ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.transaction_amount && <span className="form-error-msg">{validationErrors.transaction_amount}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Account Holder Name</label>
                            <input 
                              type="text" 
                              name="account_holder_name"
                              value={formData.account_holder_name}
                              onChange={handleInputChange}
                              placeholder="Name of person who made payment"
                              className={`form-input ${validationErrors.account_holder_name ? 'form-input--error' : ''}`}
                            />
                            {validationErrors.account_holder_name && <span className="form-error-msg">{validationErrors.account_holder_name}</span>}
                          </div>

                          <div className="form-group form-group--full">
                            <label className="form-label">Proof of Payment Screenshot (Image) <span className="required">*</span></label>
                            <div className={`file-upload ${validationErrors.proof_of_payment_url ? 'file-upload--error' : ''}`}>
                              <Upload className="file-upload__icon" size={24} style={{ margin: '0 auto var(--space-2) auto' }} />
                              <span className="file-upload__text">
                                {proofFile ? `Selected: ${proofFile.name}` : 'Click or Drag image file to upload'}
                              </span>
                              <span className="file-upload__subtext">JPEG, PNG, JPG or SVG (Max 2MB)</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-upload__input"
                              />
                            </div>
                            {validationErrors.proof_of_payment_url && <span className="form-error-msg">{validationErrors.proof_of_payment_url}</span>}
                            
                            {proofPreview && (
                              <div style={{ marginTop: 'var(--space-4)', position: 'relative', width: '120px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                <img src={proofPreview} alt="Proof preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setProofFile(null);
                                    setProofPreview('');
                                  }}
                                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>

                    <div className="reg-modal__footer">
                      <button 
                        type="button" 
                        onClick={() => setShowRegModal(false)}
                        className="btn-outline"
                        style={{ padding: '10px 20px' }}
                        disabled={submitLoading}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="reg-modal__submit-btn"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <>
                            Submitting...
                          </>
                        ) : 'Confirm & Register'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success View inside Modal */
                <div className="success-card">
                  <div className="success-icon-wrap">
                    <CheckCircle size={36} />
                  </div>
                  <h2 className="event-detail__title" style={{ fontSize: 'var(--text-3xl)' }}>Registration Received!</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '500px' }}>
                    Your registration request for <strong>{event.name}</strong> was submitted successfully. 
                    Please note down your unique Application ID below. You can track your status in the registrations page.
                  </p>
                  
                  <div className="success-app-id">
                    {successData.application_id}
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                    <button 
                      onClick={() => {
                        setShowRegModal(false);
                        setSuccessData(null);
                        resetForm();
                      }}
                      className="btn-outline"
                    >
                      Close Window
                    </button>
                    <button 
                      onClick={() => {
                        setShowRegModal(false);
                        navigate('/registrations');
                      }}
                      className="event-detail__action-btn"
                      style={{ width: 'auto', padding: '10px 24px' }}
                    >
                      Track Status
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default EventDetail;
