import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function TemplatesManager() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: createError } = await supabase
        .from('templates')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            description: formData.description,
          },
        ])
        .select();

      if (createError) {
        setError('Fout bij aanmaken Web designs: ' + createError.message);
      } else {
        setTemplates([data[0], ...templates]);
        setFormData({ name: '', description: '' });
        setIsCreating(false);
      }
    } catch {
      setError('Onverwachte fout bij aanmaken Web designs');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: updateError } = await supabase
        .from('templates')
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq('id', editingId)
        .eq('user_id', user.id)
        .select();

      if (updateError) {
        setError('Fout bij bijwerken template: ' + updateError.message);
      } else {
        setTemplates(templates.map(t => t.id === editingId ? data[0] : t));
        setFormData({ name: '', description: '' });
        setEditingId(null);
      }
    } catch {
      setError('Onverwachte fout bij bijwerken template');
    }
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

  const startEdit = (template) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      description: template.description || '',
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
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

      {!isCreating && !editingId && (
        <button
          onClick={() => setIsCreating(true)}
          style={styles.createButton}
        >
          + Nieuwe Template
        </button>
      )}

      {(isCreating || editingId) && (
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          style={styles.form}
        >
          <h3 style={styles.formTitle}>
            {editingId ? 'Template Bewerken' : 'Nieuwe Web designs'}
          </h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Naam</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={styles.input}
              placeholder="Naam van je template"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Beschrijving</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={styles.textarea}
              placeholder="Beschrijving van je template"
              rows={4}
            />
          </div>

          <div style={styles.formButtons}>
            <button type="submit" style={styles.saveButton}>
              {editingId ? 'Bijwerken' : 'Aanmaken'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              style={styles.cancelButton}
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

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
                {template.description && (
                  <p style={styles.itemDescription}>{template.description}</p>
                )}
                <p style={styles.itemDate}>
                  Aangemaakt: {new Date(template.created_at).toLocaleDateString('nl-NL')}
                </p>
              </div>
              <div style={styles.itemActions}>
                <button
                  onClick={() => startEdit(template)}
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
  form: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  formTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
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
  itemDescription: {
    fontSize: '14px',
    color: '#666',
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
