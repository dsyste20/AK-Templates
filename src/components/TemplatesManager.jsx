import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function TemplatesManager() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchTemplates();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('templates')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) {
                setError('Fout bij ophalen Web designs: ' + fetchError.message);
            } else {
                setTemplates(data || []);
            }
        } catch {
            setError('Onverwachte fout bij ophalen Web designs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        navigate('/templates/builder');
    };

    const handleEdit = (template) => {
        navigate(`/templates/builder/${template.id}`);
    };

    const handleDelete = async (id) => {
        if (!confirm('Weet je zeker dat je deze template wilt verwijderen?')) {
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('templates')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (deleteError) {
                setError('Fout bij verwijderen template: ' + deleteError.message);
            } else {
                setTemplates(templates.filter(t => t.id !== id));
            }
        } catch {
            setError('Onverwachte fout bij verwijderen template');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Web designs laden...</div>;
    }

    return (
        <div style={styles.container}>
            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <button
                onClick={handleCreateNew}
                style={styles.createButton}
            >
                + Nieuwe Template
            </button>

            {templates.length === 0 ? (
                <div style={styles.empty}>
                    <p>Je hebt nog geen Web designs aangemaakt.</p>
                    <p>Klik op &quot;+ Nieuwe Template&quot; om te beginnen.</p>
                </div>
            ) : (
                <div style={styles.list}>
                    {templates.map((template) => (
                        <div key={template.id} style={styles.item}>
                            <div style={styles.itemContent}>
                                <h4 style={styles.itemTitle}>{template.name}</h4>
                                <p style={styles.itemDate}>
                                    Aangemaakt: {new Date(template.created_at).toLocaleDateString('nl-NL')}
                                </p>
                            </div>
                            <div style={styles.itemActions}>
                                <button
                                    onClick={() => handleEdit(template)}
                                    style={styles.editButton}
                                >
                                    Bewerken
                                </button>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    style={styles.deleteButton}
                                >
                                    Verwijderen
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        color: '#666',
    },
    error: {
        padding: '12px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '4px',
        color: '#c33',
        marginBottom: '20px',
    },
    createButton: {
        padding: '12px 24px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '20px',
    },
    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#999',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    item: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px',
    },
    itemDate: {
        fontSize: '12px',
        color: '#999',
    },
    itemActions: {
        display: 'flex',
        gap: '10px',
    },
    editButton: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};
