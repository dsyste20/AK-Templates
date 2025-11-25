import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function PublicSitePage() {
    const { slug } = useParams();
    const [site, setSite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSite = async () => {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('sites')
                .select('title, description, theme, config')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error) {
                setError('Deze website kon niet worden gevonden.');
                setSite(null);
            } else {
                setSite(data);
            }

            setLoading(false);
        };

        fetchSite();
    }, [slug]);

    if (loading) return <div style={styles.center}>Website wordt geladen...</div>;
    if (error) return <div style={styles.center}>{error}</div>;
    if (!site) return <div style={styles.center}>Website niet gevonden.</div>;

    // hier kun je later je echte builder-renderer gebruiken (met config)
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.title}>{site.title}</h1>
                {site.description && <p style={styles.subtitle}>{site.description}</p>}
            </header>

            <main style={styles.main}>
                {/* TODO: hier PublicRenderer / SiteProvider met site.config */}
                <p>Hier komt straks de layout van je template aan de hand van config.</p>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#222',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    header: {
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #eee',
    },
    title: {
        fontSize: '32px',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#666',
    },
    main: {
        maxWidth: '960px',
        margin: '40px auto',
        padding: '0 20px 40px',
    },
    center: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        color: '#555',
    },
};
