const AboutSection = ({ section }) => {
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
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          {section.title}
        </h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          {section.content}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
