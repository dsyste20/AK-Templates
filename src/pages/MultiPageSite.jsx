import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import ContactSection from '../sections/ContactSection';
import { useSiteContext } from '../contexts/SiteContext';

const MultiPageSite = () => {
  const { siteConfig } = useSiteContext();

  const getSection = (id) => {
    return siteConfig.sections.find((section) => section.id === id);
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <HeroSection section={getSection('home') || siteConfig.sections[0]} />
          }
        />
        <Route
          path="/home"
          element={
            <HeroSection section={getSection('home') || siteConfig.sections[0]} />
          }
        />
        <Route
          path="/about"
          element={
            <AboutSection section={getSection('about') || siteConfig.sections[1]} />
          }
        />
        <Route
          path="/services"
          element={
            <ServicesSection
              section={getSection('services') || siteConfig.sections[2]}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <ContactSection
              section={getSection('contact') || siteConfig.sections[3]}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default MultiPageSite;
