import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { uploadToStorage, generateFilePath } from '../lib/storage';

// Available web-safe fonts
const FONT_OPTIONS = [
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Trebuchet MS',
    'Courier New',
    'Impact',
];

// File upload validation constants
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates an image file before upload
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error: string|null}}
 */
function validateImageFile(file) {
    if (!file) {
        return { valid: false, error: 'Geen bestand geselecteerd' };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Alleen JPEG, PNG, GIF en WebP afbeeldingen zijn toegestaan' };
    }
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'Bestand is te groot. Maximaal 5MB toegestaan' };
    }
    return { valid: true, error: null };
}

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
    const [uploadingLogo, setUploadingLogo] = useState(false);
    
    // Navigation settings
    const [navType, setNavType] = useState('navbar'); // 'navbar' or 'sidebar'
    const [logoUrl, setLogoUrl] = useState('');
    const [navbarBgColor, setNavbarBgColor] = useState('#2c3e50');
    const [navbarTextColor, setNavbarTextColor] = useState('#ffffff');
    const [navbarTabs, setNavbarTabs] = useState([
        { id: 'tab-1', label: 'Home', link: '#home' },
        { id: 'tab-2', label: 'Over', link: '#about' },
        { id: 'tab-3', label: 'Contact', link: '#contact' }
    ]);
    const [newTabLabel, setNewTabLabel] = useState('');
    const [newTabLink, setNewTabLink] = useState('');
    
    // Sections with blocks
    const [sections, setSections] = useState([
        {
            id: 'section-default',
            background: { color: '#3498db', imageUrl: '' },
            blocks: [
                { id: 'block-hero-default', type: 'hero', content: 'Welkom', style: { fontFamily: 'Arial', fontSize: 48, color: '#ffffff' }, align: 'center' },
                { id: 'block-text-default', type: 'text', content: 'Uw website begint hier', style: { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }, align: 'center' }
            ]
        }
    ]);
    
    // Footer settings
    const [footer, setFooter] = useState({
        text: '© 2024 Mijn Website',
        style: { fontFamily: 'Arial', fontSize: 14, color: '#666666' },
        align: 'center'
    });
    
    // Ref for logo file input
    const logoInputRef = useRef(null);

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
                if (elements.nav) {
                    setNavType(elements.nav.type || 'navbar');
                    setLogoUrl(elements.nav.logoUrl || '');
                    setNavbarBgColor(elements.nav.background || '#2c3e50');
                    setNavbarTextColor(elements.nav.text || '#ffffff');
                    setNavbarTabs(elements.nav.tabs || []);
                }
                if (elements.sections) {
                    setSections(elements.sections);
                }
                if (elements.footer) {
                    setFooter(elements.footer);
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
            
            // Build elements JSON payload matching the spec
            const elements = {
                nav: {
                    type: navType,
                    logoUrl: logoUrl,
                    background: navbarBgColor,
                    text: navbarTextColor,
                    tabs: navbarTabs
                },
                sections: sections,
                footer: footer
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

    // Logo upload handler
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file before upload
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        try {
            setUploadingLogo(true);
            setError('');
            
            const filePath = generateFilePath(user.id, 'logos', file.name);
            const { url, error: uploadError } = await uploadToStorage('assets', filePath, file);
            
            if (uploadError) {
                setError('Fout bij uploaden logo: ' + uploadError.message);
            } else {
                setLogoUrl(url);
            }
        } catch (err) {
            console.error('Logo upload error:', err);
            setError('Onverwachte fout bij uploaden logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    // Section background image upload handler
    const handleSectionBackgroundUpload = async (sectionId, file) => {
        if (!file) return;

        // Validate file before upload
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        try {
            setError('');
            
            const filePath = generateFilePath(user.id, 'backgrounds', file.name);
            const { url, error: uploadError } = await uploadToStorage('assets', filePath, file);
            
            if (uploadError) {
                setError('Fout bij uploaden achtergrond: ' + uploadError.message);
            } else {
                setSections(sections.map(s => 
                    s.id === sectionId 
                        ? { ...s, background: { ...s.background, imageUrl: url } }
                        : s
                ));
            }
        } catch (err) {
            console.error('Background upload error:', err);
            setError('Onverwachte fout bij uploaden achtergrond');
        }
    };

    // Navbar tab management
    const handleAddTab = () => {
        if (newTabLabel.trim() && newTabLink.trim()) {
            setNavbarTabs([...navbarTabs, { id: `tab-${Date.now()}`, label: newTabLabel, link: newTabLink }]);
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
    const addSection = () => {
        const newSection = {
            id: `section-${Date.now()}`,
            background: { color: '#ffffff', imageUrl: '' },
            blocks: []
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (sectionId) => {
        setSections(sections.filter(s => s.id !== sectionId));
    };

    const updateSectionBackground = (sectionId, field, value) => {
        setSections(sections.map(s => 
            s.id === sectionId 
                ? { ...s, background: { ...s.background, [field]: value } }
                : s
        ));
    };

    const clearSectionBackgroundImage = (sectionId) => {
        setSections(sections.map(s => 
            s.id === sectionId 
                ? { ...s, background: { ...s.background, imageUrl: '' } }
                : s
        ));
    };

    // Section reordering
    const moveSectionUp = (index) => {
        if (index === 0) return;
        const newSections = [...sections];
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
        setSections(newSections);
    };

    const moveSectionDown = (index) => {
        if (index === sections.length - 1) return;
        const newSections = [...sections];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        setSections(newSections);
    };

    // Block management within sections
    const addBlock = (sectionId, type) => {
        const newBlock = {
            id: `block-${type}-${Date.now()}`,
            type: type,
            content: type === 'hero' ? 'Hero Tekst' : type === 'image' ? '' : 'Nieuwe tekst...',
            style: { fontFamily: 'Arial', fontSize: type === 'hero' ? 36 : 16, color: '#333333' },
            align: 'center'
        };
        setSections(sections.map(s => 
            s.id === sectionId 
                ? { ...s, blocks: [...s.blocks, newBlock] }
                : s
        ));
    };

    const removeBlock = (sectionId, blockId) => {
        setSections(sections.map(s => 
            s.id === sectionId 
                ? { ...s, blocks: s.blocks.filter(b => b.id !== blockId) }
                : s
        ));
    };

    const updateBlock = (sectionId, blockId, updates) => {
        setSections(sections.map(s => 
            s.id === sectionId 
                ? { 
                    ...s, 
                    blocks: s.blocks.map(b => 
                        b.id === blockId ? { ...b, ...updates } : b
                    ) 
                }
                : s
        ));
    };

    const updateBlockStyle = (sectionId, blockId, styleUpdates) => {
        setSections(sections.map(s => 
            s.id === sectionId 
                ? { 
                    ...s, 
                    blocks: s.blocks.map(b => 
                        b.id === blockId ? { ...b, style: { ...b.style, ...styleUpdates } } : b
                    ) 
                }
                : s
        ));
    };

    // Block reordering within a section
    const moveBlockUp = (sectionId, blockIndex) => {
        if (blockIndex === 0) return;
        setSections(sections.map(s => {
            if (s.id !== sectionId) return s;
            const newBlocks = [...s.blocks];
            [newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [newBlocks[blockIndex], newBlocks[blockIndex - 1]];
            return { ...s, blocks: newBlocks };
        }));
    };

    const moveBlockDown = (sectionId, blockIndex) => {
        setSections(sections.map(s => {
            if (s.id !== sectionId) return s;
            if (blockIndex === s.blocks.length - 1) return s;
            const newBlocks = [...s.blocks];
            [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
            return { ...s, blocks: newBlocks };
        }));
    };

    // Footer update handlers
    const updateFooterText = (text) => {
        setFooter({ ...footer, text });
    };

    const updateFooterStyle = (styleUpdates) => {
        setFooter({ ...footer, style: { ...footer.style, ...styleUpdates } });
    };

    const updateFooterAlign = (align) => {
        setFooter({ ...footer, align });
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

                        {/* Navigation Type Selection */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Navigatie Type</h3>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="navType"
                                        checked={navType === 'navbar'}
                                        onChange={() => setNavType('navbar')}
                                    />
                                    Navbar (Horizontaal)
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="navType"
                                        checked={navType === 'sidebar'}
                                        onChange={() => setNavType('sidebar')}
                                    />
                                    Sidebar (Verticaal)
                                </label>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Logo</h3>
                            <input
                                type="file"
                                ref={logoInputRef}
                                onChange={handleLogoUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <div style={styles.logoUploadArea}>
                                {logoUrl ? (
                                    <img 
                                        src={logoUrl} 
                                        alt="Logo" 
                                        style={styles.logoPreview}
                                    />
                                ) : (
                                    <div style={styles.logoPlaceholder}>
                                        Geen logo
                                    </div>
                                )}
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    style={styles.uploadButton}
                                    disabled={uploadingLogo}
                                >
                                    {uploadingLogo ? 'Uploaden...' : 'Upload Logo'}
                                </button>
                                {logoUrl && (
                                    <button
                                        onClick={() => setLogoUrl('')}
                                        style={styles.removeButton}
                                    >
                                        Verwijder
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Customize Navbar */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Navigatie Kleuren</h3>
                            
                            <div style={styles.colorPickerGroup}>
                                <label style={styles.colorLabel}>Achtergrond:</label>
                                <input
                                    type="color"
                                    value={navbarBgColor}
                                    onChange={(e) => setNavbarBgColor(e.target.value)}
                                    style={styles.colorPicker}
                                />
                            </div>

                            <div style={styles.colorPickerGroup}>
                                <label style={styles.colorLabel}>Tekst:</label>
                                <input
                                    type="color"
                                    value={navbarTextColor}
                                    onChange={(e) => setNavbarTextColor(e.target.value)}
                                    style={styles.colorPicker}
                                />
                            </div>

                            <h4 style={styles.subTitle}>Navigatie Tabs</h4>
                            {navbarTabs.map((tab) => (
                                <div key={tab.id} style={styles.tabRow}>
                                    <input
                                        type="text"
                                        value={tab.label}
                                        onChange={(e) => handleUpdateTab(tab.id, 'label', e.target.value)}
                                        placeholder="Label"
                                        style={styles.tabInput}
                                    />
                                    <input
                                        type="text"
                                        value={tab.link}
                                        onChange={(e) => handleUpdateTab(tab.id, 'link', e.target.value)}
                                        placeholder="Link"
                                        style={styles.tabInput}
                                    />
                                    <button
                                        onClick={() => handleRemoveTab(tab.id)}
                                        style={styles.removeTabButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <h4 style={styles.subTitle}>Nieuwe Tab</h4>
                            <div style={styles.addTabRow}>
                                <input
                                    type="text"
                                    value={newTabLabel}
                                    onChange={(e) => setNewTabLabel(e.target.value)}
                                    placeholder="Label"
                                    style={styles.tabInput}
                                />
                                <input
                                    type="text"
                                    value={newTabLink}
                                    onChange={(e) => setNewTabLink(e.target.value)}
                                    placeholder="Link"
                                    style={styles.tabInput}
                                />
                                <button
                                    onClick={handleAddTab}
                                    style={styles.addTabButton}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Sections */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Secties</h3>
                            <button
                                onClick={addSection}
                                style={styles.addSectionButton}
                            >
                                + Nieuwe Sectie
                            </button>

                            <div style={styles.sectionList}>
                                {sections.map((section, sectionIndex) => (
                                    <div key={section.id} style={styles.sectionEditor}>
                                        <div style={styles.sectionHeader}>
                                            <span style={styles.sectionLabel}>Sectie {sectionIndex + 1}</span>
                                            <div style={styles.sectionActions}>
                                                <button
                                                    onClick={() => moveSectionUp(sectionIndex)}
                                                    style={styles.orderButton}
                                                    disabled={sectionIndex === 0}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => moveSectionDown(sectionIndex)}
                                                    style={styles.orderButton}
                                                    disabled={sectionIndex === sections.length - 1}
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    onClick={() => removeSection(section.id)}
                                                    style={styles.removeSectionButton}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>

                                        {/* Section Background */}
                                        <div style={styles.sectionField}>
                                            <label style={styles.fieldLabel}>Achtergrondkleur:</label>
                                            <input
                                                type="color"
                                                value={section.background.color}
                                                onChange={(e) => updateSectionBackground(section.id, 'color', e.target.value)}
                                                style={styles.colorPicker}
                                            />
                                        </div>

                                        <div style={styles.sectionField}>
                                            <label style={styles.fieldLabel}>Achtergrondafbeelding:</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleSectionBackgroundUpload(section.id, e.target.files?.[0])}
                                                style={styles.fileInput}
                                            />
                                            {section.background.imageUrl && (
                                                <div style={styles.bgPreviewContainer}>
                                                    <img 
                                                        src={section.background.imageUrl} 
                                                        alt="Background" 
                                                        style={styles.bgPreview}
                                                    />
                                                    <button
                                                        onClick={() => clearSectionBackgroundImage(section.id)}
                                                        style={styles.removeButton}
                                                    >
                                                        Verwijder
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Blocks in this section */}
                                        <div style={styles.blocksArea}>
                                            <div style={styles.blocksHeader}>
                                                <span style={styles.blocksLabel}>Blokken:</span>
                                                <div style={styles.addBlockButtons}>
                                                    <button onClick={() => addBlock(section.id, 'hero')} style={styles.addBlockButton}>+ Hero</button>
                                                    <button onClick={() => addBlock(section.id, 'text')} style={styles.addBlockButton}>+ Tekst</button>
                                                </div>
                                            </div>

                                            {section.blocks.map((block, blockIndex) => (
                                                <div key={block.id} style={styles.blockEditor}>
                                                    <div style={styles.blockHeader}>
                                                        <span style={styles.blockType}>
                                                            {block.type === 'hero' ? '🎯' : '📝'} {block.type}
                                                        </span>
                                                        <div style={styles.blockActions}>
                                                            <button
                                                                onClick={() => moveBlockUp(section.id, blockIndex)}
                                                                style={styles.orderButton}
                                                                disabled={blockIndex === 0}
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                onClick={() => moveBlockDown(section.id, blockIndex)}
                                                                style={styles.orderButton}
                                                                disabled={blockIndex === section.blocks.length - 1}
                                                            >
                                                                ↓
                                                            </button>
                                                            <button
                                                                onClick={() => removeBlock(section.id, block.id)}
                                                                style={styles.removeBlockButton}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <textarea
                                                        value={block.content}
                                                        onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })}
                                                        placeholder="Tekst invoeren..."
                                                        style={styles.blockTextarea}
                                                    />

                                                    <div style={styles.blockStyleRow}>
                                                        <select
                                                            value={block.style.fontFamily}
                                                            onChange={(e) => updateBlockStyle(section.id, block.id, { fontFamily: e.target.value })}
                                                            style={styles.fontSelect}
                                                        >
                                                            {FONT_OPTIONS.map(font => (
                                                                <option key={font} value={font}>{font}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="number"
                                                            value={block.style.fontSize}
                                                            onChange={(e) => updateBlockStyle(section.id, block.id, { fontSize: parseInt(e.target.value, 10) || 16 })}
                                                            style={styles.fontSizeInput}
                                                            min="8"
                                                            max="120"
                                                        />
                                                        <span style={styles.pxLabel}>px</span>
                                                        <input
                                                            type="color"
                                                            value={block.style.color}
                                                            onChange={(e) => updateBlockStyle(section.id, block.id, { color: e.target.value })}
                                                            style={styles.colorPickerSmall}
                                                        />
                                                    </div>

                                                    <div style={styles.alignmentRow}>
                                                        <label style={styles.alignLabel}>Uitlijning:</label>
                                                        {['left', 'center', 'right'].map(align => (
                                                            <label key={align} style={styles.alignOption}>
                                                                <input
                                                                    type="radio"
                                                                    name={`align-${block.id}`}
                                                                    checked={block.align === align}
                                                                    onChange={() => updateBlock(section.id, block.id, { align })}
                                                                />
                                                                {align === 'left' ? 'Links' : align === 'center' ? 'Midden' : 'Rechts'}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Editor */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Footer</h3>
                            <textarea
                                value={footer.text}
                                onChange={(e) => updateFooterText(e.target.value)}
                                placeholder="Footer tekst..."
                                style={styles.footerTextarea}
                            />
                            <div style={styles.blockStyleRow}>
                                <select
                                    value={footer.style.fontFamily}
                                    onChange={(e) => updateFooterStyle({ fontFamily: e.target.value })}
                                    style={styles.fontSelect}
                                >
                                    {FONT_OPTIONS.map(font => (
                                        <option key={font} value={font}>{font}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={footer.style.fontSize}
                                    onChange={(e) => updateFooterStyle({ fontSize: parseInt(e.target.value, 10) || 14 })}
                                    style={styles.fontSizeInput}
                                    min="8"
                                    max="48"
                                />
                                <span style={styles.pxLabel}>px</span>
                                <input
                                    type="color"
                                    value={footer.style.color}
                                    onChange={(e) => updateFooterStyle({ color: e.target.value })}
                                    style={styles.colorPickerSmall}
                                />
                            </div>
                            <div style={styles.alignmentRow}>
                                <label style={styles.alignLabel}>Uitlijning:</label>
                                {['left', 'center', 'right'].map(align => (
                                    <label key={align} style={styles.alignOption}>
                                        <input
                                            type="radio"
                                            name="footer-align"
                                            checked={footer.align === align}
                                            onChange={() => updateFooterAlign(align)}
                                        />
                                        {align === 'left' ? 'Links' : align === 'center' ? 'Midden' : 'Rechts'}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Live Preview */}
                    <div style={styles.previewArea}>
                        <div style={styles.previewContainer}>
                            {/* Preview Navbar/Sidebar */}
                            {navType === 'navbar' ? (
                                <div style={{
                                    ...styles.previewNavbar,
                                    backgroundColor: navbarBgColor,
                                    color: navbarTextColor
                                }}>
                                    <div style={styles.previewLogoArea}>
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" style={styles.previewLogoImg} />
                                        ) : (
                                            <span style={styles.previewLogo}>{name || 'Template'}</span>
                                        )}
                                    </div>
                                    <div style={styles.previewNavTabs}>
                                        {navbarTabs.map((tab) => (
                                            <span key={tab.id} style={{ ...styles.previewNavTab, color: navbarTextColor }}>
                                                {tab.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={styles.sidebarPreviewLayout}>
                                    <div style={{
                                        ...styles.previewSidebar,
                                        backgroundColor: navbarBgColor,
                                        color: navbarTextColor
                                    }}>
                                        <div style={styles.sidebarLogoArea}>
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="Logo" style={styles.previewLogoImg} />
                                            ) : (
                                                <span style={styles.previewLogo}>{name || 'Template'}</span>
                                            )}
                                        </div>
                                        <div style={styles.sidebarTabs}>
                                            {navbarTabs.map((tab) => (
                                                <span key={tab.id} style={{ ...styles.sidebarTab, color: navbarTextColor }}>
                                                    {tab.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={styles.sidebarContent}>
                                        {/* Sections rendered inside sidebar layout */}
                                        {sections.map((section) => (
                                            <div
                                                key={section.id}
                                                style={{
                                                    ...styles.previewSection,
                                                    backgroundColor: section.background.imageUrl ? 'transparent' : section.background.color,
                                                    backgroundImage: section.background.imageUrl ? `url(${section.background.imageUrl})` : 'none',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    minHeight: '150px',
                                                }}
                                            >
                                                {section.blocks.map((block) => (
                                                    <div
                                                        key={block.id}
                                                        style={{
                                                            fontFamily: block.style.fontFamily,
                                                            fontSize: `${block.style.fontSize}px`,
                                                            color: block.style.color,
                                                            textAlign: block.align,
                                                            width: '100%',
                                                            marginBottom: '0.5rem',
                                                        }}
                                                    >
                                                        {block.content}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        {/* Footer in sidebar layout */}
                                        <div style={{
                                            ...styles.previewFooter,
                                            fontFamily: footer.style.fontFamily,
                                            fontSize: `${footer.style.fontSize}px`,
                                            color: footer.style.color,
                                            textAlign: footer.align,
                                        }}>
                                            {footer.text}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview Sections (for navbar layout) */}
                            {navType === 'navbar' && (
                                <>
                                    {sections.map((section) => (
                                        <div
                                            key={section.id}
                                            style={{
                                                ...styles.previewSection,
                                                backgroundColor: section.background.imageUrl ? 'transparent' : section.background.color,
                                                backgroundImage: section.background.imageUrl ? `url(${section.background.imageUrl})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                minHeight: section.blocks.some(b => b.type === 'hero') ? '300px' : '150px',
                                            }}
                                        >
                                            {section.blocks.map((block) => (
                                                <div
                                                    key={block.id}
                                                    style={{
                                                        fontFamily: block.style.fontFamily,
                                                        fontSize: `${block.style.fontSize}px`,
                                                        color: block.style.color,
                                                        textAlign: block.align,
                                                        width: '100%',
                                                        marginBottom: '0.5rem',
                                                    }}
                                                >
                                                    {block.content}
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Preview Footer */}
                                    <div style={{
                                        ...styles.previewFooter,
                                        fontFamily: footer.style.fontFamily,
                                        fontSize: `${footer.style.fontSize}px`,
                                        color: footer.style.color,
                                        textAlign: footer.align,
                                    }}>
                                        {footer.text}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Full Preview Mode */
                <div style={styles.fullPreviewMode}>
                    <div style={styles.fullPreviewContainer}>
                        {/* Preview Navbar/Sidebar */}
                        {navType === 'navbar' ? (
                            <div style={{
                                ...styles.previewNavbar,
                                backgroundColor: navbarBgColor,
                                color: navbarTextColor
                            }}>
                                <div style={styles.previewLogoArea}>
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" style={styles.previewLogoImg} />
                                    ) : (
                                        <span style={styles.previewLogo}>{name || 'Template'}</span>
                                    )}
                                </div>
                                <div style={styles.previewNavTabs}>
                                    {navbarTabs.map((tab) => (
                                        <span key={tab.id} style={{ ...styles.previewNavTab, color: navbarTextColor }}>
                                            {tab.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={styles.sidebarPreviewLayout}>
                                <div style={{
                                    ...styles.previewSidebar,
                                    backgroundColor: navbarBgColor,
                                    color: navbarTextColor
                                }}>
                                    <div style={styles.sidebarLogoArea}>
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" style={styles.previewLogoImg} />
                                        ) : (
                                            <span style={styles.previewLogo}>{name || 'Template'}</span>
                                        )}
                                    </div>
                                    <div style={styles.sidebarTabs}>
                                        {navbarTabs.map((tab) => (
                                            <span key={tab.id} style={{ ...styles.sidebarTab, color: navbarTextColor }}>
                                                {tab.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div style={styles.sidebarContent}>
                                    {sections.map((section) => (
                                        <div
                                            key={section.id}
                                            style={{
                                                ...styles.previewSection,
                                                backgroundColor: section.background.imageUrl ? 'transparent' : section.background.color,
                                                backgroundImage: section.background.imageUrl ? `url(${section.background.imageUrl})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                minHeight: '200px',
                                            }}
                                        >
                                            {section.blocks.map((block) => (
                                                <div
                                                    key={block.id}
                                                    style={{
                                                        fontFamily: block.style.fontFamily,
                                                        fontSize: `${block.style.fontSize}px`,
                                                        color: block.style.color,
                                                        textAlign: block.align,
                                                        width: '100%',
                                                        marginBottom: '0.5rem',
                                                    }}
                                                >
                                                    {block.content}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    <div style={{
                                        ...styles.previewFooter,
                                        fontFamily: footer.style.fontFamily,
                                        fontSize: `${footer.style.fontSize}px`,
                                        color: footer.style.color,
                                        textAlign: footer.align,
                                    }}>
                                        {footer.text}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview Sections (for navbar layout) */}
                        {navType === 'navbar' && (
                            <>
                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        style={{
                                            ...styles.previewSection,
                                            backgroundColor: section.background.imageUrl ? 'transparent' : section.background.color,
                                            backgroundImage: section.background.imageUrl ? `url(${section.background.imageUrl})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            minHeight: section.blocks.some(b => b.type === 'hero') ? '400px' : '200px',
                                        }}
                                    >
                                        {section.blocks.map((block) => (
                                            <div
                                                key={block.id}
                                                style={{
                                                    fontFamily: block.style.fontFamily,
                                                    fontSize: `${block.style.fontSize}px`,
                                                    color: block.style.color,
                                                    textAlign: block.align,
                                                    width: '100%',
                                                    marginBottom: '0.5rem',
                                                }}
                                            >
                                                {block.content}
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Preview Footer */}
                                <div style={{
                                    ...styles.previewFooter,
                                    fontFamily: footer.style.fontFamily,
                                    fontSize: `${footer.style.fontSize}px`,
                                    color: footer.style.color,
                                    textAlign: footer.align,
                                }}>
                                    {footer.text}
                                </div>
                            </>
                        )}
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
        flexWrap: 'wrap',
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        fontSize: '14px',
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
        minWidth: '100px',
    },
    colorPicker: {
        width: '50px',
        height: '30px',
        cursor: 'pointer',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    colorPickerSmall: {
        width: '35px',
        height: '25px',
        cursor: 'pointer',
        border: '1px solid #ddd',
        borderRadius: '3px',
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
        padding: '0.4rem',
        flex: 1,
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    removeTabButton: {
        padding: '0.4rem 0.6rem',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    addTabRow: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
    },
    addTabButton: {
        padding: '0.4rem 0.8rem',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    addSectionButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginBottom: '1rem',
    },
    sectionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    sectionEditor: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '1rem',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #eee',
    },
    sectionLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
    },
    sectionActions: {
        display: 'flex',
        gap: '0.25rem',
    },
    orderButton: {
        padding: '0.25rem 0.5rem',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    removeSectionButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
    },
    sectionField: {
        marginBottom: '0.75rem',
    },
    fieldLabel: {
        fontSize: '12px',
        color: '#666',
        display: 'block',
        marginBottom: '0.25rem',
    },
    fileInput: {
        fontSize: '12px',
        marginTop: '0.25rem',
    },
    bgPreviewContainer: {
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    bgPreview: {
        width: '60px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    removeButton: {
        padding: '0.25rem 0.5rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '11px',
    },
    blocksArea: {
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #eee',
    },
    blocksHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
    },
    blocksLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
    },
    addBlockButtons: {
        display: 'flex',
        gap: '0.25rem',
    },
    addBlockButton: {
        padding: '0.25rem 0.5rem',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '11px',
    },
    blockEditor: {
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '0.75rem',
        marginBottom: '0.5rem',
    },
    blockHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    blockType: {
        fontSize: '12px',
        color: '#666',
    },
    blockActions: {
        display: 'flex',
        gap: '0.15rem',
    },
    removeBlockButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockTextarea: {
        width: '100%',
        padding: '0.4rem',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        resize: 'vertical',
        minHeight: '50px',
        boxSizing: 'border-box',
        marginBottom: '0.5rem',
    },
    blockStyleRow: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        marginBottom: '0.5rem',
        flexWrap: 'wrap',
    },
    fontSelect: {
        padding: '0.25rem',
        fontSize: '12px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        minWidth: '100px',
    },
    fontSizeInput: {
        padding: '0.25rem',
        fontSize: '12px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        width: '50px',
    },
    pxLabel: {
        fontSize: '11px',
        color: '#888',
    },
    alignmentRow: {
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    alignLabel: {
        fontSize: '12px',
        color: '#666',
    },
    alignOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '12px',
        cursor: 'pointer',
    },
    footerTextarea: {
        width: '100%',
        padding: '0.5rem',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        resize: 'vertical',
        minHeight: '60px',
        boxSizing: 'border-box',
        marginBottom: '0.75rem',
    },
    logoUploadArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    logoPreview: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ddd',
    },
    logoPlaceholder: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        color: '#888',
    },
    uploadButton: {
        padding: '0.4rem 0.8rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    previewArea: {
        backgroundColor: '#e0e0e0',
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
    previewLogoArea: {
        display: 'flex',
        alignItems: 'center',
    },
    previewLogoImg: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
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
    previewSidebar: {
        width: '200px',
        minHeight: '100%',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    sidebarPreviewLayout: {
        display: 'flex',
        height: '100%',
    },
    sidebarLogoArea: {
        marginBottom: '2rem',
        textAlign: 'center',
    },
    sidebarTabs: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    sidebarTab: {
        fontSize: '14px',
        cursor: 'pointer',
        padding: '0.5rem 0',
    },
    sidebarContent: {
        flex: 1,
        overflow: 'auto',
    },
    previewSection: {
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    previewFooter: {
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
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
