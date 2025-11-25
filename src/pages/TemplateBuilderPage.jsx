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
    const [previewMode, setPreviewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    
    // Site type
    const [siteType, setSiteType] = useState('single-page');
    
    // Navbar settings
    const [navbarBgColor, setNavbarBgColor] = useState('#2c3e50');
    const [navbarTextColor, setNavbarTextColor] = useState('#ffffff');
    const [navbarTabs, setNavbarTabs] = useState([
        { id: 1, label: 'Home', link: '#home' },
        { id: 2, label: 'Over', link: '#about' },
        { id: 3, label: 'Contact', link: '#contact' }
    ]);
    const [newTabLabel, setNewTabLabel] = useState('');
    const [newTabLink, setNewTabLink] = useState('');
    
    // Sections
    const [sections, setSections] = useState([
        { id: 1, type: 'hero', title: 'Welkom', subtitle: 'Uw website begint hier', backgroundColor: '#3498db' }
    ]);

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
                // Load elements from the stored JSON
                const elements = data.elements || {};
                if (elements.siteType) setSiteType(elements.siteType);
                if (elements.navbar) {
                    setNavbarBgColor(elements.navbar.backgroundColor || '#2c3e50');
                    setNavbarTextColor(elements.navbar.textColor || '#ffffff');
                    setNavbarTabs(elements.navbar.tabs || []);
                }
                if (elements.sections) {
                    setSections(elements.sections);
                }
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
            
            // Build elements JSON payload
            const elements = {
                siteType,
                navbar: {
                    backgroundColor: navbarBgColor,
                    textColor: navbarTextColor,
                    tabs: navbarTabs
                },
                sections
            };

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

    // Navbar tab management
    const handleAddTab = () => {
        if (newTabLabel.trim() && newTabLink.trim()) {
            setNavbarTabs([...navbarTabs, { id: Date.now(), label: newTabLabel, link: newTabLink }]);
            setNewTabLabel('');
            setNewTabLink('');
        }
    };

    const handleRemoveTab = (tabId) => {
        setNavbarTabs(navbarTabs.filter(tab => tab.id !== tabId));
    };

    const handleUpdateTab = (tabId, field, value) => {
        setNavbarTabs(navbarTabs.map(tab => 
            tab.id === tabId ? { ...tab, [field]: value } : tab
        ));
    };

    // Section management
    const addSection = (type) => {
        const newSection = {
            id: Date.now(),
            type,
            title: type === 'hero' ? 'Nieuwe Hero' : 'Nieuwe Tekst Sectie',
            subtitle: type === 'hero' ? 'Subtitel hier' : '',
            content: type === 'text' ? 'Voeg hier uw tekst toe...' : '',
            backgroundColor: type === 'hero' ? '#3498db' : '#ffffff'
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (sectionId) => {
        setSections(sections.filter(s => s.id !== sectionId));
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
            {/* Header - Dark bar with title and Preview Mode button */}
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>
                    {id ? 'Template Bewerken' : 'Template Builder'}
                </h1>
                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    style={styles.previewModeButton}
                >
                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                </button>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* Main content area */}
            {!previewMode ? (
                <div style={styles.mainContent}>
                    {/* Left sidebar - Customization Panel */}
                    <div style={styles.leftSidebar}>
                        {/* Template Name */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Template Naam</h3>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={styles.textInput}
                                placeholder="Voer template naam in..."
                            />
                        </div>

                        {/* Site Type Selection */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Site Type</h3>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="siteType"
                                        checked={siteType === 'single-page'}
                                        onChange={() => setSiteType('single-page')}
                                    />
                                    Single-Page Site
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="siteType"
                                        checked={siteType === 'multi-page'}
                                        onChange={() => setSiteType('multi-page')}
                                    />
                                    Multi-Page Site
                                </label>
                            </div>
                            <p style={styles.helperText}>
                                {siteType === 'single-page'
                                    ? 'Navigation tabs will scroll to sections on the same page'
                                    : 'Navigation tabs will link to separate pages'}
                            </p>
                        </div>

                        {/* Customize Navbar */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Customize Navbar</h3>
                            
                            <div style={styles.colorPickerGroup}>
                                <label style={styles.colorLabel}>Background Color:</label>
                                <input
                                    type="color"
                                    value={navbarBgColor}
                                    onChange={(e) => setNavbarBgColor(e.target.value)}
                                    style={styles.colorPicker}
                                />
                            </div>

                            <div style={styles.colorPickerGroup}>
                                <label style={styles.colorLabel}>Text Color:</label>
                                <input
                                    type="color"
                                    value={navbarTextColor}
                                    onChange={(e) => setNavbarTextColor(e.target.value)}
                                    style={styles.colorPicker}
                                />
                            </div>

                            <h4 style={styles.subTitle}>Navigation Tabs</h4>
                            {navbarTabs.map((tab) => (
                                <div key={tab.id} style={styles.tabRow}>
                                    <input
                                        type="text"
                                        value={tab.label}
                                        onChange={(e) => handleUpdateTab(tab.id, 'label', e.target.value)}
                                        placeholder="Tab Label"
                                        style={styles.tabInput}
                                    />
                                    <input
                                        type="text"
                                        value={tab.link}
                                        onChange={(e) => handleUpdateTab(tab.id, 'link', e.target.value)}
                                        placeholder="Link/Section ID"
                                        style={styles.tabInput}
                                    />
                                    <button
                                        onClick={() => handleRemoveTab(tab.id)}
                                        style={styles.removeTabButton}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <h4 style={styles.subTitle}>Add New Tab</h4>
                            <div style={styles.addTabRow}>
                                <input
                                    type="text"
                                    value={newTabLabel}
                                    onChange={(e) => setNewTabLabel(e.target.value)}
                                    placeholder="Tab Label"
                                    style={styles.tabInput}
                                />
                                <input
                                    type="text"
                                    value={newTabLink}
                                    onChange={(e) => setNewTabLink(e.target.value)}
                                    placeholder="Link/Section ID"
                                    style={styles.tabInput}
                                />
                                <button
                                    onClick={handleAddTab}
                                    style={styles.addTabButton}
                                >
                                    Add Tab
                                </button>
                            </div>
                        </div>

                        {/* Sections */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Sections</h3>
                            <div style={styles.sectionButtons}>
                                <button
                                    onClick={() => addSection('hero')}
                                    style={styles.addSectionButton}
                                >
                                    + Add Hero Section
                                </button>
                                <button
                                    onClick={() => addSection('text')}
                                    style={styles.addSectionButton}
                                >
                                    + Add Text Section
                                </button>
                            </div>

                            <div style={styles.sectionList}>
                                {sections.map((section) => (
                                    <div key={section.id} style={styles.sectionItem}>
                                        <span style={styles.sectionType}>
                                            {section.type === 'hero' ? '🎯 Hero' : '📝 Text'}: {section.title}
                                        </span>
                                        <button
                                            onClick={() => removeSection(section.id)}
                                            style={styles.removeSectionButton}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Live Preview */}
                    <div style={styles.previewArea}>
                        <div style={styles.previewContainer}>
                            {/* Preview Navbar */}
                            <div style={{
                                ...styles.previewNavbar,
                                backgroundColor: navbarBgColor,
                                color: navbarTextColor
                            }}>
                                <span style={styles.previewLogo}>{name || 'Template'}</span>
                                <div style={styles.previewNavTabs}>
                                    {navbarTabs.map((tab) => (
                                        <span key={tab.id} style={{ ...styles.previewNavTab, color: navbarTextColor }}>
                                            {tab.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Preview Sections */}
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    style={{
                                        ...styles.previewSection,
                                        backgroundColor: section.backgroundColor,
                                        minHeight: section.type === 'hero' ? '300px' : '150px',
                                        color: section.type === 'hero' ? '#ffffff' : '#333333'
                                    }}
                                >
                                    <h2 style={styles.previewSectionTitle}>{section.title}</h2>
                                    {section.subtitle && <p style={styles.previewSectionSubtitle}>{section.subtitle}</p>}
                                    {section.content && <p style={styles.previewSectionContent}>{section.content}</p>}
                                </div>
                            ))}

                            {/* Content area placeholder */}
                            <div style={styles.previewContentArea}>
                                <p style={styles.previewContentText}>Content Area</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Full Preview Mode */
                <div style={styles.fullPreviewMode}>
                    <div style={styles.fullPreviewContainer}>
                        {/* Preview Navbar */}
                        <div style={{
                            ...styles.previewNavbar,
                            backgroundColor: navbarBgColor,
                            color: navbarTextColor
                        }}>
                            <span style={styles.previewLogo}>{name || 'Template'}</span>
                            <div style={styles.previewNavTabs}>
                                {navbarTabs.map((tab) => (
                                    <span key={tab.id} style={{ ...styles.previewNavTab, color: navbarTextColor }}>
                                        {tab.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Preview Sections */}
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                style={{
                                    ...styles.previewSection,
                                    backgroundColor: section.backgroundColor,
                                    minHeight: section.type === 'hero' ? '400px' : '200px',
                                    color: section.type === 'hero' ? '#ffffff' : '#333333'
                                }}
                            >
                                <h2 style={styles.previewSectionTitle}>{section.title}</h2>
                                {section.subtitle && <p style={styles.previewSectionSubtitle}>{section.subtitle}</p>}
                                {section.content && <p style={styles.previewSectionContent}>{section.content}</p>}
                            </div>
                        ))}

                        {/* Content area placeholder */}
                        <div style={styles.previewContentArea}>
                            <p style={styles.previewContentText}>Content Area</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer with action buttons */}
            <div style={styles.footer}>
                <button
                    onClick={handleCancel}
                    style={styles.cancelButton}
                    disabled={saving}
                >
                    Cancel
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
        minHeight: '100vh',
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
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold',
    },
    previewModeButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    error: {
        padding: '12px 30px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c33',
        fontSize: '14px',
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        padding: '2rem',
        flex: 1,
    },
    leftSidebar: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 180px)',
    },
    card: {
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '1.5rem',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '1rem',
        marginTop: 0,
    },
    textInput: {
        width: '100%',
        padding: '0.5rem',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    radioGroup: {
        display: 'flex',
        gap: '1rem',
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
    },
    helperText: {
        fontSize: '0.9rem',
        color: '#666',
        marginTop: '0.5rem',
        marginBottom: 0,
    },
    colorPickerGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
    },
    colorLabel: {
        fontSize: '14px',
        color: '#555',
        minWidth: '120px',
    },
    colorPicker: {
        width: '60px',
        height: '35px',
        cursor: 'pointer',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    subTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#444',
        marginTop: '1rem',
        marginBottom: '0.5rem',
    },
    tabRow: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.5rem',
        alignItems: 'center',
    },
    tabInput: {
        padding: '0.5rem',
        flex: 1,
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    removeTabButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    addTabRow: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
    },
    addTabButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    sectionButtons: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
    },
    addSectionButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    sectionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    sectionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0.75rem',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
    },
    sectionType: {
        fontSize: '14px',
        color: '#555',
    },
    removeSectionButton: {
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
    previewArea: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'sticky',
        top: '2rem',
        height: 'calc(100vh - 180px)',
    },
    previewContainer: {
        backgroundColor: '#fff',
        height: '100%',
        overflow: 'auto',
    },
    previewNavbar: {
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    previewLogo: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    previewNavTabs: {
        display: 'flex',
        gap: '1.5rem',
    },
    previewNavTab: {
        fontSize: '14px',
        cursor: 'pointer',
    },
    previewSection: {
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    previewSectionTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: 0,
        marginBottom: '0.5rem',
    },
    previewSectionSubtitle: {
        fontSize: '18px',
        margin: 0,
        opacity: 0.9,
    },
    previewSectionContent: {
        fontSize: '16px',
        margin: 0,
        marginTop: '1rem',
        maxWidth: '600px',
    },
    previewContentArea: {
        padding: '3rem 2rem',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContentText: {
        fontSize: '16px',
        color: '#999',
    },
    fullPreviewMode: {
        flex: 1,
        overflow: 'auto',
    },
    fullPreviewContainer: {
        backgroundColor: '#fff',
        minHeight: '100%',
    },
    footer: {
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    cancelButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
    saveButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
};
