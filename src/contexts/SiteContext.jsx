import { createContext, useContext, useState } from 'react';

const SiteContext = createContext();

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState({
    siteType: 'single-page', // 'single-page' or 'multi-page'
    navbar: {
      backgroundColor: '#2c3e50',
      textColor: '#ecf0f1',
      tabs: [
        { id: 1, label: 'Home', link: 'home', type: 'section' },
        { id: 2, label: 'About', link: 'about', type: 'section' },
        { id: 3, label: 'Services', link: 'services', type: 'section' },
        { id: 4, label: 'Contact', link: 'contact', type: 'section' },
      ],
    },
    sections: [
      {
        id: 'home',
        type: 'hero',
        title: 'Welcome to Our Website',
        subtitle: 'Build amazing websites with customizable components',
        backgroundColor: '#3498db',
        textColor: '#ffffff',
        buttonText: 'Get Started',
        buttonColor: '#e74c3c',
      },
      {
        id: 'about',
        type: 'about',
        title: 'About Us',
        content: 'We are a team dedicated to creating amazing web experiences.',
        backgroundColor: '#ecf0f1',
        textColor: '#2c3e50',
      },
      {
        id: 'services',
        type: 'services',
        title: 'Our Services',
        services: [
          { name: 'Web Design', description: 'Beautiful and responsive designs' },
          { name: 'Development', description: 'Custom web applications' },
          { name: 'Consulting', description: 'Expert advice for your projects' },
        ],
        backgroundColor: '#ffffff',
        textColor: '#2c3e50',
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Contact Us',
        email: 'info@example.com',
        phone: '+1 234 567 890',
        backgroundColor: '#34495e',
        textColor: '#ecf0f1',
      },
    ],
  });

  const updateNavbar = (updates) => {
    setSiteConfig((prev) => ({
      ...prev,
      navbar: { ...prev.navbar, ...updates },
    }));
  };

  const updateSection = (sectionId, updates) => {
    setSiteConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  const addNavbarTab = (tab) => {
    setSiteConfig((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        tabs: [...prev.navbar.tabs, { ...tab, id: Date.now() }],
      },
    }));
  };

  const removeNavbarTab = (tabId) => {
    setSiteConfig((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        tabs: prev.navbar.tabs.filter((tab) => tab.id !== tabId),
      },
    }));
  };

  const updateNavbarTab = (tabId, updates) => {
    setSiteConfig((prev) => ({
      ...prev,
      navbar: {
        ...prev.navbar,
        tabs: prev.navbar.tabs.map((tab) =>
          tab.id === tabId ? { ...tab, ...updates } : tab
        ),
      },
    }));
  };

  const setSiteType = (type) => {
    setSiteConfig((prev) => ({
      ...prev,
      siteType: type,
      navbar: {
        ...prev.navbar,
        tabs: prev.navbar.tabs.map((tab) => ({
          ...tab,
          type: type === 'single-page' ? 'section' : 'page',
        })),
      },
    }));
  };

  return (
    <SiteContext.Provider
      value={{
        siteConfig,
        updateNavbar,
        updateSection,
        addNavbarTab,
        removeNavbarTab,
        updateNavbarTab,
        setSiteType,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
