import { useState } from 'react';
import { useSiteContext } from '../contexts/SiteContext';
import NavbarCustomizer from '../components/NavbarCustomizer';
import SectionCustomizer from '../components/SectionCustomizer';

const BuilderPage = () => {
  const { siteConfig, setSiteType } = useSiteContext();
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Website Builder</h1>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      {/* Main Content */}
      {!previewMode ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            padding: '2rem',
            flex: 1,
          }}
        >
          {/* Left Side - Customization Panel */}
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
            <h2>Customize Your Website</h2>

            {/* Site Type Selection */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
            >
              <h3>Site Type</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="siteType"
                    checked={siteConfig.siteType === 'single-page'}
                    onChange={() => setSiteType('single-page')}
                  />
                  Single-Page Site
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="siteType"
                    checked={siteConfig.siteType === 'multi-page'}
                    onChange={() => setSiteType('multi-page')}
                  />
                  Multi-Page Site
                </label>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                {siteConfig.siteType === 'single-page'
                  ? 'Navigation tabs will scroll to sections on the same page'
                  : 'Navigation tabs will link to separate pages'}
              </p>
            </div>

            {/* Navbar Customization */}
            <NavbarCustomizer />

            {/* Section Customization */}
            {siteConfig.sections.map((section) => (
              <SectionCustomizer key={section.id} section={section} />
            ))}
          </div>

          {/* Right Side - Live Preview */}
          <div
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'sticky',
              top: '2rem',
              height: 'calc(100vh - 100px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                height: '100%',
                overflow: 'auto',
              }}
            >
              <iframe
                src={siteConfig.siteType === 'single-page' ? '/preview' : '/preview-multi'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Website Preview"
              />
            </div>
          </div>
        </div>
      ) : (
        // Full Preview Mode
        <div style={{ flex: 1 }}>
          <iframe
            src={siteConfig.siteType === 'single-page' ? '/preview' : '/preview-multi'}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Website Preview"
          />
        </div>
      )}
    </div>
  );
};

export default BuilderPage;
