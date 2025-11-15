import { useSiteContext } from '../contexts/SiteContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { siteConfig } = useSiteContext();
  const { navbar } = siteConfig;

  const handleNavigation = (tab) => {
    if (siteConfig.siteType === 'single-page' && tab.type === 'section') {
      // Scroll to section for single-page sites
      const element = document.getElementById(tab.link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // For multi-page, React Router will handle navigation
  };

  return (
    <nav
      style={{
        backgroundColor: navbar.backgroundColor,
        color: navbar.textColor,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Website Builder
      </div>
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          gap: '2rem',
          margin: 0,
          padding: 0,
        }}
      >
        {navbar.tabs.map((tab) => (
          <li key={tab.id}>
            {siteConfig.siteType === 'single-page' ? (
              <button
                onClick={() => handleNavigation(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: navbar.textColor,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                {tab.label}
              </button>
            ) : (
              <Link
                to={`/${tab.link}`}
                style={{
                  color: navbar.textColor,
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  display: 'block',
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                {tab.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
