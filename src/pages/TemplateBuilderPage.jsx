import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function TemplateBuilderPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [name, setName] = useState(searchParams.get('name') || '');
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchTemplate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('templates')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (fetchError) {
                setError('Fout bij ophalen template: ' + fetchError.message);
            } else {
                setName(data.name || '');
                setElements(data.elements || []);
            }
        } catch {
            setError('Onverwachte fout bij ophalen template');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Naam is verplicht');
            return;
        }

        try {
            setSaving(true);
            setError('');

            if (id) {
                // Update existing template
                const { error: updateError } = await supabase
                    .from('templates')
                    .update({
                        name: name,
                        elements: elements,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (updateError) {
                    setError('Fout bij bijwerken template: ' + updateError.message);
                    return;
                }
            } else {
                // Create new template
                const { error: insertError } = await supabase
                    .from('templates')
                    .insert([
                        {
                            user_id: user.id,
                            name: name,
                            elements: elements,
                        },
                    ]);

                if (insertError) {
                    setError('Fout bij aanmaken template: ' + insertError.message);
                    return;
                }
            }

            // Navigate back to dashboard on success
            navigate('/dashboard');
        } catch {
            setError('Onverwachte fout bij opslaan');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    const addElement = (type) => {
        const newElement = {
            id: Date.now(),
            type: type,
            content: `Nieuwe ${type}`,
        };
        setElements([...elements, newElement]);
    };

    const removeElement = (id) => {
        setElements(elements.filter(el => el.id !== id));
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Template laden...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header with name input */}
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>
                    {id ? 'Template Bewerken' : 'Nieuwe Template'}
                </h1>
                <div style={styles.nameInputGroup}>
                    <label style={styles.nameLabel}>Template Naam:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.nameInput}
                        placeholder="Voer template naam in..."
                    />
                </div>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* Main content area */}
            <div style={styles.mainContent}>
                {/* Left sidebar - Element controls */}
                <div style={styles.leftSidebar}>
                    <h3 style={styles.sidebarTitle}>Element Bibliotheek</h3>
                    <div style={styles.elementButtons}>
                        <button
                            onClick={() => addElement('tekst')}
                            style={styles.elementButton}
                        >
                            + Tekst Toevoegen
                        </button>
                        <button
                            onClick={() => addElement('afbeelding')}
                            style={styles.elementButton}
                        >
                            + Afbeelding Toevoegen
                        </button>
                        <button
                            onClick={() => addElement('hero')}
                            style={styles.elementButton}
                        >
                            + Hero Toevoegen
                        </button>
                    </div>

                    <h3 style={styles.sidebarTitle}>Huidige Elementen</h3>
                    <div style={styles.elementList}>
                        {elements.length === 0 ? (
                            <p style={styles.emptyText}>Geen elementen toegevoegd</p>
                        ) : (
                            elements.map((el) => (
                                <div key={el.id} style={styles.elementItem}>
                                    <span style={styles.elementType}>{el.type}</span>
                                    <button
                                        onClick={() => removeElement(el.id)}
                                        style={styles.removeButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Center canvas */}
                <div style={styles.centerCanvas}>
                    <h3 style={styles.canvasTitle}>Canvas</h3>
                    <div style={styles.canvasContent}>
                        {elements.length === 0 ? (
                            <div style={styles.emptyCanvas}>
                                <p>Voeg elementen toe vanuit de bibliotheek</p>
                            </div>
                        ) : (
                            elements.map((el) => (
                                <div key={el.id} style={styles.canvasElement}>
                                    <div style={styles.canvasElementHeader}>
                                        <strong>{el.type.toUpperCase()}</strong>
                                    </div>
                                    <div style={styles.canvasElementContent}>
                                        {el.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right preview */}
                <div style={styles.rightPreview}>
                    <h3 style={styles.previewTitle}>Live Preview</h3>
                    <div style={styles.previewContent}>
                        <div style={styles.previewHeader}>
                            <h2 style={styles.previewName}>{name || 'Geen naam'}</h2>
                        </div>
                        {elements.length === 0 ? (
                            <p style={styles.previewEmpty}>Preview verschijnt hier</p>
                        ) : (
                            elements.map((el) => (
                                <div key={el.id} style={styles.previewElement}>
                                    <strong>{el.type}:</strong> {el.content}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer with action buttons */}
            <div style={styles.footer}>
                <button
                    onClick={handleCancel}
                    style={styles.cancelButton}
                    disabled={saving}
                >
                    Annuleren
                </button>
                <button
                    onClick={handleSave}
                    style={styles.saveButton}
                    disabled={saving}
                >
                    {saving ? 'Opslaan...' : 'Opslaan'}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
    },
    header: {
        backgroundColor: 'white',
        padding: '20px 30px',
        borderBottom: '1px solid #ddd',
    },
    headerTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
    },
    nameInputGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    nameLabel: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#555',
    },
    nameInput: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    error: {
        padding: '12px 30px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c33',
        fontSize: '14px',
    },
    mainContent: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    leftSidebar: {
        width: '250px',
        backgroundColor: 'white',
        borderRight: '1px solid #ddd',
        padding: '20px',
        overflowY: 'auto',
    },
    sidebarTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
    },
    elementButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '30px',
    },
    elementButton: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    elementList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    emptyText: {
        fontSize: '14px',
        color: '#999',
        fontStyle: 'italic',
    },
    elementItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
    },
    elementType: {
        fontSize: '14px',
        color: '#555',
        textTransform: 'capitalize',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '18px',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
    },
    centerCanvas: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
    },
    canvasTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
    },
    canvasContent: {
        backgroundColor: 'white',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '20px',
        minHeight: '400px',
    },
    emptyCanvas: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#999',
        fontSize: '16px',
    },
    canvasElement: {
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    canvasElementHeader: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#666',
        marginBottom: '8px',
    },
    canvasElementContent: {
        fontSize: '14px',
        color: '#333',
    },
    rightPreview: {
        width: '300px',
        backgroundColor: 'white',
        borderLeft: '1px solid #ddd',
        padding: '20px',
        overflowY: 'auto',
    },
    previewTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
    },
    previewContent: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fafafa',
    },
    previewHeader: {
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        marginBottom: '15px',
    },
    previewName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#007bff',
    },
    previewEmpty: {
        fontSize: '14px',
        color: '#999',
        fontStyle: 'italic',
    },
    previewElement: {
        marginBottom: '12px',
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#333',
    },
    footer: {
        backgroundColor: 'white',
        padding: '20px 30px',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    cancelButton: {
        padding: '10px 24px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
    saveButton: {
        padding: '10px 24px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
};
