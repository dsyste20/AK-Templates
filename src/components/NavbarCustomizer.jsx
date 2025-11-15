import { useState } from 'react';
import { useSiteContext } from '../contexts/SiteContext';

const NavbarCustomizer = () => {
  const { siteConfig, updateNavbar, addNavbarTab, removeNavbarTab, updateNavbarTab } =
    useSiteContext();
  const { navbar } = siteConfig;

  const [newTab, setNewTab] = useState({ label: '', link: '', type: 'section' });

  const handleAddTab = (e) => {
    e.preventDefault();
    if (newTab.label && newTab.link) {
      addNavbarTab(newTab);
      setNewTab({ label: '', link: '', type: 'section' });
    }
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Customize Navbar</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Background Color:
        </label>
        <input
          type="color"
          value={navbar.backgroundColor}
          onChange={(e) => updateNavbar({ backgroundColor: e.target.value })}
          style={{ width: '100px', height: '40px', cursor: 'pointer' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Text Color:
        </label>
        <input
          type="color"
          value={navbar.textColor}
          onChange={(e) => updateNavbar({ textColor: e.target.value })}
          style={{ width: '100px', height: '40px', cursor: 'pointer' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Navigation Tabs</h4>
        {navbar.tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={tab.label}
              onChange={(e) => updateNavbarTab(tab.id, { label: e.target.value })}
              placeholder="Tab Label"
              style={{ padding: '0.5rem', flex: 1 }}
            />
            <input
              type="text"
              value={tab.link}
              onChange={(e) => updateNavbarTab(tab.id, { link: e.target.value })}
              placeholder="Link/Section ID"
              style={{ padding: '0.5rem', flex: 1 }}
            />
            <button
              onClick={() => removeNavbarTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div>
        <h4>Add New Tab</h4>
        <form onSubmit={handleAddTab} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newTab.label}
            onChange={(e) => setNewTab({ ...newTab, label: e.target.value })}
            placeholder="Tab Label"
            style={{ padding: '0.5rem', flex: 1 }}
          />
          <input
            type="text"
            value={newTab.link}
            onChange={(e) => setNewTab({ ...newTab, link: e.target.value })}
            placeholder="Link/Section ID"
            style={{ padding: '0.5rem', flex: 1 }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Tab
          </button>
        </form>
      </div>
    </div>
  );
};

export default NavbarCustomizer;
