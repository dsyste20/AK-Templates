const ServicesSection = ({ section }) => {
  return (
    <section
      id={section.id}
      style={{
        backgroundColor: section.backgroundColor,
        color: section.textColor,
        padding: '4rem 2rem',
        minHeight: '300px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          {section.title}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          {section.services.map((service, index) => (
            <div
              key={index}
              style={{
                padding: '2rem',
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {service.name}
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
