import { useSiteContext } from '../contexts/SiteContext';

const SectionCustomizer = ({ section }) => {
  const { updateSection } = useSiteContext();

  const handleUpdate = (field, value) => {
    updateSection(section.id, { [field]: value });
  };

  const handleServiceUpdate = (index, field, value) => {
    const updatedServices = [...section.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    updateSection(section.id, { services: updatedServices });
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Customize {section.id} Section</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Title:
        </label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      {section.subtitle !== undefined && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Subtitle:
          </label>
          <input
            type="text"
            value={section.subtitle}
            onChange={(e) => handleUpdate('subtitle', e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      )}

      {section.content !== undefined && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Content:
          </label>
          <textarea
            value={section.content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
          />
        </div>
      )}

      {section.buttonText !== undefined && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Button Text:
            </label>
            <input
              type="text"
              value={section.buttonText}
              onChange={(e) => handleUpdate('buttonText', e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Button Color:
            </label>
            <input
              type="color"
              value={section.buttonColor}
              onChange={(e) => handleUpdate('buttonColor', e.target.value)}
              style={{ width: '100px', height: '40px', cursor: 'pointer' }}
            />
          </div>
        </>
      )}

      {section.email !== undefined && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email:
            </label>
            <input
              type="email"
              value={section.email}
              onChange={(e) => handleUpdate('email', e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Phone:
            </label>
            <input
              type="tel"
              value={section.phone}
              onChange={(e) => handleUpdate('phone', e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        </>
      )}

      {section.services && (
        <div style={{ marginBottom: '1rem' }}>
          <h4>Services</h4>
          {section.services.map((service, index) => (
            <div key={index} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '4px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Service Name:
              </label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleServiceUpdate(index, 'name', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
              />
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Service Description:
              </label>
              <input
                type="text"
                value={service.description}
                onChange={(e) => handleServiceUpdate(index, 'description', e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Background Color:
        </label>
        <input
          type="color"
          value={section.backgroundColor}
          onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
          style={{ width: '100px', height: '40px', cursor: 'pointer' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Text Color:
        </label>
        <input
          type="color"
          value={section.textColor}
          onChange={(e) => handleUpdate('textColor', e.target.value)}
          style={{ width: '100px', height: '40px', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default SectionCustomizer;
