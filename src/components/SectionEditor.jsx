import { useRef } from 'react';

/**
 * SectionEditor - A reusable component for editing section properties
 * Handles section background (color or image), blocks, and nav link mapping
 */
export default function SectionEditor({
    section,
    sectionIndex,
    navbarTabs,
    siteType,
    onUpdateBackground,
    onUpdateLink,
    onBackgroundImageUpload,
    onClearBackgroundImage,
    onRemove,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    children, // Rendered block editors
}) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onBackgroundImageUpload(file);
        }
    };

    return (
        <div style={styles.sectionEditor}>
            <div style={styles.sectionHeader}>
                <span style={styles.sectionLabel}>Sectie {sectionIndex + 1}</span>
                <div style={styles.sectionActions}>
                    <button
                        onClick={onMoveUp}
                        style={styles.orderButton}
                        disabled={isFirst}
                    >
                        ↑
                    </button>
                    <button
                        onClick={onMoveDown}
                        style={styles.orderButton}
                        disabled={isLast}
                    >
                        ↓
                    </button>
                    <button
                        onClick={onRemove}
                        style={styles.removeSectionButton}
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Section Background Color */}
            <div style={styles.sectionField}>
                <label style={styles.fieldLabel}>Achtergrondkleur:</label>
                <input
                    type="color"
                    value={section.background?.color || '#ffffff'}
                    onChange={(e) => onUpdateBackground('color', e.target.value)}
                    style={styles.colorPicker}
                />
            </div>

            {/* Section Background Image */}
            <div style={styles.sectionField}>
                <label style={styles.fieldLabel}>Achtergrondafbeelding:</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                {section.background?.imageUrl && (
                    <div style={styles.bgPreviewContainer}>
                        <img
                            src={section.background.imageUrl}
                            alt="Background"
                            style={styles.bgPreview}
                        />
                        <button
                            onClick={onClearBackgroundImage}
                            style={styles.removeButton}
                        >
                            Verwijder
                        </button>
                    </div>
                )}
            </div>

            {/* Link section to nav (for single-page scrolling) */}
            {siteType === 'single-page' && (
                <div style={styles.sectionField}>
                    <label style={styles.fieldLabel}>Koppel aan nav:</label>
                    <select
                        value={section.link || ''}
                        onChange={(e) => onUpdateLink(e.target.value)}
                        style={styles.navLinkSelect}
                    >
                        <option value="">-- Geen --</option>
                        {navbarTabs.map((tab) => (
                            <option key={tab.id} value={tab.link}>
                                {tab.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Block editors (rendered via children) */}
            <div style={styles.blocksArea}>{children}</div>
        </div>
    );
}

const styles = {
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
    colorPicker: {
        width: '50px',
        height: '30px',
        cursor: 'pointer',
        border: '1px solid #ddd',
        borderRadius: '4px',
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
    navLinkSelect: {
        width: '100%',
        padding: '0.4rem',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    blocksArea: {
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #eee',
    },
};
