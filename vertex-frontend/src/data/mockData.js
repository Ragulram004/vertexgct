// Mock data for Vertex event site
// Will be replaced with API calls to the Laravel backend later

export const eventTracks = [
  {
    id: 'technical',
    name: 'Technical',
    icon: '⚙️',
    description: 'Challenge your engineering prowess with coding, design, and analysis events.',
    eventCount: 12,
    color: '#d4af37',
  },
  {
    id: 'non-technical',
    name: 'Non Technical',
    icon: '🎭',
    description: 'Showcase your creativity, communication, and management skills.',
    eventCount: 2,
    color: '#c5a059',
  },
  {
    id: 'hackathons',
    name: 'Hackathons',
    icon: '💡',
    description: 'Build, innovate, and prototype solutions in intense time-bound challenges.',
    eventCount: 1,
    color: '#38bdf8',
  },
];

export const timelineSteps = [
  {
    step: 1,
    title: 'Online Registration',
    description: 'Register for your favourite events through our portal. Form your teams and secure your slots!',
    status: 'live',
  },
  {
    step: 2,
    title: 'Day 1: 19th Aug (Offline)',
    description: 'Event inauguration ceremony at campus followed by commencement of the first set of events:',
    events: ['Paper Presentation', 'CAD Craze', 'Geo Tolerance', 'Craft X', 'Mind Mechanics', 'Ad-Zap'],
    status: 'upcoming',
  },
  {
    step: 3,
    title: 'Day 2: 20th Aug (Offline)',
    description: 'High-energy coding phase, troubleshooting challenges, and project presentations:',
    events: ['Hackathon', 'Reverse Rumbling', 'Manufactura 360', 'Circuit Detective', 'Design Clash'],
    status: 'upcoming',
  },
  {
    step: 4,
    title: 'Day 3: 21st Aug (Offline)',
    description: 'Final rounds of structural & logic contests, followed by the valedictory & prize ceremony:',
    events: ['Bridge Building', 'Patent Sprint', 'Auto Logix', 'Prize Distribution'],
    status: 'upcoming',
  },
];

export const faqItems = [
  {
    question: 'What is Vertex?',
    answer: 'Vertex is a flagship technical symposium organized by the Product Design & Development Club (PDDC) at Government College of Technology, Coimbatore. It features 15 exciting events across technical, non-technical, workshops, and hackathon tracks.',
  },
  {
    question: 'Who can participate in Vertex?',
    answer: 'Vertex is open to all college students across India. Whether you\'re an engineering student or from any other discipline, there\'s an event for everyone. Check individual event pages for specific eligibility criteria.',
  },
  {
    question: 'Is there a registration fee?',
    answer: 'Yes, all events are priced very affordably. You can find the exact nominal fee for each event on its page, along with exciting combo offers for multiple registrations.',
  },
  {
    question: 'Can I participate in multiple events?',
    answer: 'Absolutely! You can register for as many events as you like, provided the schedules don\'t conflict. We recommend checking the event timings before registering for multiple events.',
  },
  {
    question: 'How do I track my registration status?',
    answer: 'After registering, you\'ll receive an application ID. Use the "Your Registrations" page to track your registration status, payment verification, and event details by entering your application ID.',
  },
  {
    question: 'Is accommodation provided for outstation participants?',
    answer: 'Yes, hostel accommodation at GCT Coimbatore is available for eligible participants. To be eligible: 1) The participant or their college must NOT be from Coimbatore region, AND 2) The participant must be registered online for MORE THAN 1 day (attending 2 or 3 days of events).',
  },
  {
    question: 'Where is the event held?',
    answer: 'Vertex is held at Government College of Technology (GCT), Coimbatore, Tamil Nadu. The college is located on Thadagam Road, Coimbatore - 641013.',
  },
];

export const stats = [
  { label: 'Events', value: '15+' },
  { label: 'Tracks', value: '4' },
  { label: 'Prize Pool', value: '₹25K+' },
  { label: 'Colleges', value: '50+' },
];

export const prizes = [
  {
    title: 'Networking & Exposure',
    description: 'Connect with industry professionals, mentors, and peers from top colleges across Tamil Nadu.',
    icon: 'network',
  },
  {
    title: 'Prize Pool',
    description: 'Exciting cash prizes and rewards worth ₹25,000+ across all events and tracks.',
    icon: 'trophy',
    highlight: true,
    value: '₹25,000+',
  },
  {
    title: 'Certificates & Goodies',
    description: 'All participants receive certificates. Winners get exclusive goodies and swag kits.',
    icon: 'award',
  },
];

export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Your Registrations', path: '/registrations' },
  { name: 'Contact Us', path: '/contact' },
];

export const normalizeName = (name) => {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '') // remove spaces, dashes, special chars
    .replace('dectective', 'detective') // handle typo
    .replace('logix', 'logics'); // handle autologix vs autologics
};

export const getEventPrizes = (eventName) => {
  const normalized = normalizeName(eventName);
  const prizeMap = {
    'paperpresentation': { total: 5000, first: 2500, second: 1500, third: 1000 },
    'hackathon': { total: 5000, first: 2500, second: 1500, third: 1000 },
    'autologics': { total: 750, first: 350, second: 250, third: 150 },
    'craftx': { total: 1000, first: 500, second: 300, third: 200 },
    'geotolerance': { total: 750, first: 350, second: 250, third: 150 },
    'cadcraze': { total: 2500, first: 1200, second: 800, third: 500 },
    'qualityquest': { total: 1000, first: 500, second: 300, third: 200 },
    'patentsprint': { total: 3000, first: 1500, second: 1000, third: 500 },
    'circuitdetective': { total: 1200, first: 600, second: 400, third: 200 },
    'designclash': { total: 750, first: 350, second: 250, third: 150 },
    'mindmechanics': { total: 750, first: 350, second: 250, third: 150 },
    'adzap': { total: 500, first: 250, second: 150, third: 100 },
    'manufactura360': { total: 1000, first: 500, second: 300, third: 200 },
    'reverserumbling': { total: 1200, first: 600, second: 400, third: 200 },
    'bridgebuilding': { total: 500, first: 250, second: 150, third: 100 }
  };
  return prizeMap[normalized] || null;
};

