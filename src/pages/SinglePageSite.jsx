import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import ContactSection from '../sections/ContactSection';
import { useSiteContext } from '../contexts/SiteContext';

const SinglePageSite = () => {
  const { siteConfig } = useSiteContext();

  const renderSection = (section) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} section={section} />;
      case 'about':
        return <AboutSection key={section.id} section={section} />;
      case 'services':
        return <ServicesSection key={section.id} section={section} />;
      case 'contact':
        return <ContactSection key={section.id} section={section} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      {siteConfig.sections.map((section) => renderSection(section))}
    </div>
  );
};

export default SinglePageSite;
