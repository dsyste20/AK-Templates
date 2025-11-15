const ContactSection = ({ section }) => {
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          {section.title}
        </h2>
        <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
          <p>
            <strong>Email:</strong> {section.email}
          </p>
          <p>
            <strong>Phone:</strong> {section.phone}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
