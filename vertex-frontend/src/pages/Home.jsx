import HeroSection from '../components/HeroSection';
import EventTracks from '../components/EventTracks';
import AboutSection from '../components/AboutSection';
import PrizesSection from '../components/PrizesSection';
import TimelineSection from '../components/TimelineSection';
import AccommodationSection from '../components/AccommodationSection';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import FacultySection from '../components/FacultySection';

const Home = () => {
  return (
    <main id="home-page">
      <HeroSection />
      <EventTracks />
      <AboutSection />
      <PrizesSection />
      <TimelineSection />
      <AccommodationSection />
      <FAQSection />
      <CTASection />
      <FacultySection />
    </main>
  );
};

export default Home;
