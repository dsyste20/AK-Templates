const HeroSection = ({ section }) => {
  return (
    <section
      id={section.id}
      style={{
        backgroundColor: section.backgroundColor,
        color: section.textColor,
        padding: '6rem 2rem',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {section.title}
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '800px' }}>
        {section.subtitle}
      </p>
      {section.buttonText && (
        <button
          style={{
            backgroundColor: section.buttonColor,
            color: '#ffffff',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {section.buttonText}
        </button>
      )}
    </section>
  );
};

export default HeroSection;
