/**
 * TextBlockEditor - A reusable component for editing text/hero block properties
 * Handles content, font, size, color, and alignment
 */

// Available web-safe fonts (should match TemplateBuilderPage)
const FONT_OPTIONS = [
    'Arial',
    'Georgia',
    'Helvetica Neue',
    'Times New Roman',
    'Courier New',
    'Roboto',
];

export default function TextBlockEditor({
    block,
    onUpdateContent,
    onUpdateStyle,
    onUpdateAlign,
    onRemove,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}) {
    // Block type icon mapping
    const BLOCK_ICONS = {
        hero: '🎯',
        text: '📝',
    };

    return (
        <div style={styles.blockEditor}>
            <div style={styles.blockHeader}>
                <span style={styles.blockType}>
                    {BLOCK_ICONS[block.type] || '📄'} {block.type}
                </span>
                <div style={styles.blockActions}>
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
                    <button onClick={onRemove} style={styles.removeBlockButton}>
                        ×
                    </button>
                </div>
            </div>

            {/* Content textarea */}
            <textarea
                value={block.content || ''}
                onChange={(e) => onUpdateContent(e.target.value)}
                placeholder="Tekst invoeren..."
                style={styles.blockTextarea}
            />

            {/* Style controls row */}
            <div style={styles.blockStyleRow}>
                <select
                    value={block.style?.fontFamily || 'Arial'}
                    onChange={(e) => onUpdateStyle({ fontFamily: e.target.value })}
                    style={styles.fontSelect}
                >
                    {FONT_OPTIONS.map((font) => (
                        <option key={font} value={font}>
                            {font}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    value={block.style?.fontSize || 16}
                    onChange={(e) =>
                        onUpdateStyle({ fontSize: parseInt(e.target.value, 10) || 16 })
                    }
                    style={styles.fontSizeInput}
                    min="8"
                    max="120"
                />
                <span style={styles.pxLabel}>px</span>
                <input
                    type="color"
                    value={block.style?.color || '#333333'}
                    onChange={(e) => onUpdateStyle({ color: e.target.value })}
                    style={styles.colorPickerSmall}
                />
            </div>

            {/* Alignment controls */}
            <div style={styles.alignmentRow}>
                <label style={styles.alignLabel}>Uitlijning:</label>
                {['left', 'center', 'right'].map((align) => (
                    <label key={align} style={styles.alignOption}>
                        <input
                            type="radio"
                            name={`align-${block.id}`}
                            checked={block.align === align}
                            onChange={() => onUpdateAlign(align)}
                        />
                        {align === 'left' ? 'Links' : align === 'center' ? 'Midden' : 'Rechts'}
                    </label>
                ))}
            </div>
        </div>
    );
}

const styles = {
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
    orderButton: {
        padding: '0.25rem 0.5rem',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px',
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
    colorPickerSmall: {
        width: '35px',
        height: '25px',
        cursor: 'pointer',
        border: '1px solid #ddd',
        borderRadius: '3px',
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
};
