import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut, supabase } from '../lib/supabaseClient';

export default function PublicerenPage() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
    });

    const [templates, setTemplates] = useState([]);
    const [templatesLoading, setTemplatesLoading] = useState(true);
    const [templatesError, setTemplatesError] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    const [loading, setLoading] = useState(false);
    const [publishError, setPublishError] = useState('');
    const [publishedUrl, setPublishedUrl] = useState('');

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    // helper: maak een nette slug van titel / url veld
    const makeSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')          // spaties -> -
            .replace(/[^a-z0-9-]/g, '')    // alles behalve a-z, 0-9 en - weg
            .replace(/-+/g, '-')           // dubbele - -> enkele
            .replace(/^-+|-+$/g, '');      // leading/trailing - weg
    };

    // Templates van de ingelogde gebruiker ophalen
    useEffect(() => {
        if (!user) return;

        const fetchTemplates = async () => {
            setTemplatesLoading(true);
            setTemplatesError('');

            const { data, error } = await supabase
                .from('templates')
                .select('id, name')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Fout bij ophalen templates:', error);
                setTemplatesError('Kon je templates niet ophalen.');
                setTemplates([]);
            } else {
                setTemplates(data || []);
            }

            setTemplatesLoading(false);
        };

        fetchTemplates();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPublishError('');
        setPublishedUrl('');
        setLoading(true);

        try {
            if (!user) {
                setPublishError('Je moet ingelogd zijn om te publiceren.');
                setLoading(false);
                return;
            }

            if (!selectedTemplateId) {
                setPublishError('Kies eerst een template.');
                setLoading(false);
                return;
            }

            const baseForSlug = formData.url?.trim() || formData.title;
            const slug = makeSlug(baseForSlug);

            if (!slug) {
                setPublishError('Kon geen geldige URL/slug genereren. Pas de titel of URL aan.');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('sites')
                .insert([
                    {
                        user_id: user.id,
                        template_id: selectedTemplateId,     // 🔸 koppeling met template
                        title: formData.title,
                        description: formData.description,
                        slug,
                        is_published: true,
                        // theme laat je weg, heeft default 'default'
                        // config: siteConfig, // later als je de echte builder-config mee wilt geven
                    },
                ])
                .select()
                .single();

            if (error) {
                console.error('Fout bij publiceren:', error);
                setPublishError('Fout bij publiceren: ' + error.message);
            } else {
                const baseUrl = window.location.origin;
                const publicUrl = `${baseUrl}/w/${data.slug}`;
                setPublishedUrl(publicUrl);
                // optioneel: form resetten
                // setFormData({ title: '', description: '', url: '' });
                // setSelectedTemplateId('');
            }
        } catch (err) {
            console.error(err);
            setPublishError('Onverwachte fout bij publiceren.');
        } finally {
            setLoading(false);
        }
    };

    const isPublishDisabled =
        loading ||
        templatesLoading ||
        !selectedTemplateId ||
        !formData.title ||
        !formData.description;

    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <div style={styles.navContent}>
                    <h1 style={styles.logo}>AK-WebDesigns</h1>
                    <div style={styles.navLinks}>
                        <a href="/dashboard" style={styles.navLink}>Dashboard</a>
                        <a href="/mijn-website" style={styles.navLink}>Mijn Websites</a>
                        <a href="/publiceren" style={styles.navLink}>Publiceren</a>
                        <a href="/mijn-account" style={styles.navLink}>Mijn Account</a>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Uitloggen
                        </button>
                    </div>
                </div>
            </nav>

            <div style={styles.content}>
                <h1 style={styles.title}>Website Publiceren</h1>
                <p style={styles.subtitle}>
                    Welkom, {profile?.name || user?.email}! Publiceer je website of template hier.
                </p>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>📤 Publiceer je Website</h2>

                    {publishError && (
                        <div style={styles.error}>
                            {publishError}
                        </div>
                    )}

                    {templatesError && (
                        <div style={styles.error}>
                            {templatesError}
                        </div>
                    )}

                    {publishedUrl && (
                        <div style={styles.success}>
                            <p style={{ margin: 0 }}>Je website is gepubliceerd!</p>
                            <p style={styles.urlPreview}>
                                Publieke URL:{' '}
                                <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
                                    {publishedUrl}
                                </a>
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Kies een opgeslagen template</label>
                            {templatesLoading ? (
                                <div style={styles.smallText}>Templates laden...</div>
                            ) : templates.length === 0 ? (
                                <div style={styles.smallText}>
                                    Je hebt nog geen templates aangemaakt. Maak eerst een template in &quot;Mijn Websites&quot;.
                                </div>
                            ) : (
                                <select
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="">-- Kies een template --</option>
                                    {templates.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Titel</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={styles.input}
                                placeholder="Titel van je website"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Beschrijving</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={styles.textarea}
                                placeholder="Beschrijving van je website"
                                rows={5}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>URL (optioneel)</label>
                            <input
                                type="text"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                style={styles.input}
                                placeholder="mijn-geweldige-website"
                            />
                            <small style={styles.hint}>
                                Dit wordt gebruikt als onderdeel van je website-URL (bijv. /w/mijn-geweldige-website).
                            </small>
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...styles.submitButton,
                                ...(isPublishDisabled ? styles.submitButtonDisabled : {}),
                            }}
                            disabled={isPublishDisabled}
                        >
                            {loading ? 'Bezig met publiceren...' : 'Publiceren'}
                        </button>

                        {isPublishDisabled && (
                            <div style={styles.smallText}>
                                Kies eerst een template en vul titel + beschrijving in om te kunnen publiceren.
                            </div>
                        )}
                    </form>

                    <div style={styles.info}>
                        <h3 style={styles.infoTitle}>💡 Tips voor Publiceren</h3>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                Kies een duidelijke en beschrijvende titel voor je website
                            </li>
                            <li style={styles.listItem}>
                                Schrijf een goede beschrijving zodat bezoekers weten wat ze kunnen verwachten
                            </li>
                            <li style={styles.listItem}>
                                De URL (slug) kan later nog aangepast worden
                            </li>
                            <li style={styles.listItem}>
                                Test je website grondig voordat je publiceert
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    nav: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '15px 0',
    },
    navContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#007bff',
        margin: 0,
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
    },
    navLink: {
        textDecoration: 'none',
        color: '#555',
        fontSize: '16px',
        fontWeight: '500',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '40px',
    },
    section: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        marginBottom: '30px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    hint: {
        display: 'block',
        marginTop: '5px',
        fontSize: '12px',
        color: '#888',
    },
    submitButton: {
        padding: '12px 30px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
    submitButtonDisabled: {
        backgroundColor: '#b5dabf',
        cursor: 'not-allowed',
    },
    error: {
        padding: '10px 14px',
        marginBottom: '20px',
        backgroundColor: '#fee',
        borderRadius: '4px',
        border: '1px solid #fcc',
        color: '#c33',
        fontSize: '14px',
    },
    success: {
        padding: '10px 14px',
        marginBottom: '20px',
        backgroundColor: '#e6ffed',
        borderRadius: '4px',
        border: '1px solid #b2f2bb',
        color: '#145c2a',
        fontSize: '14px',
    },
    urlPreview: {
        marginTop: '5px',
        fontSize: '14px',
        wordBreak: 'break-all',
    },
    info: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
    },
    infoTitle: {
        fontSize: '18px',
        marginBottom: '15px',
        color: '#333',
    },
    list: {
        margin: 0,
        paddingLeft: '20px',
    },
    listItem: {
        marginBottom: '8px',
        color: '#666',
        lineHeight: '1.6',
    },
    smallText: {
        marginTop: '6px',
        fontSize: '12px',
        color: '#777',
    },
};
