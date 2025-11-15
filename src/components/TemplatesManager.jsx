import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function TemplatesManager() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Haal templates op
  const fetchTemplates = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
      setError('');
    } catch (err) {
      setError('Fout bij het ophalen van templates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Maak nieuwe template aan
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([{
          user_id: user.id,
          name: formData.name,
          description: formData.description
        }])
        .select();

      if (error) throw error;

      setTemplates([data[0], ...templates]);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Fout bij het aanmaken van template: ' + err.message);
    }
  };

  // Update bestaande template
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user || !editingId) return;

    try {
      const { data, error } = await supabase
        .from('templates')
        .update({
          name: formData.name,
          description: formData.description
        })
        .eq('id', editingId)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;

      setTemplates(templates.map(t => t.id === editingId ? data[0] : t));
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Fout bij het bijwerken van template: ' + err.message);
    }
  };

  // Verwijder template
  const handleDelete = async (id) => {
    if (!user) return;
    if (!confirm('Weet je zeker dat je deze template wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTemplates(templates.filter(t => t.id !== id));
      setError('');
    } catch (err) {
      setError('Fout bij het verwijderen van template: ' + err.message);
    }
  };

  // Start bewerken
  const startEdit = (template) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      description: template.description || ''
    });
    setShowForm(true);
  };

  // Annuleer formulier
  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Templates laden...</div>;
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Mijn Templates</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Nieuwe Template
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Formulier */}
      {showForm && (
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {editingId ? 'Template Bewerken' : 'Nieuwe Template'}
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Naam *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Beschrijving
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {editingId ? 'Bijwerken' : 'Aanmaken'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

      {/* Templates lijst */}
      {templates.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          Nog geen templates. Klik op &quot;Nieuwe Template&quot; om te beginnen.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                  {template.name}
                </h3>
                {template.description && (
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {template.description}
                  </p>
                )}
                <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.8rem' }}>
                  Aangemaakt: {new Date(template.created_at).toLocaleDateString('nl-NL')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => startEdit(template)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
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
