import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * TemplatesManager component voor het beheren van gebruikerstemplates in Supabase
 * Dit is een voorbeeld CRUD component die laat zien hoe data per gebruiker kan worden opgeslagen
 */
const TemplatesManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { user } = useAuth();

  // Haal templates op van Supabase
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTemplates(data || []);
    } catch (err) {
      console.error('Fout bij ophalen templates:', err);
      setError('Kon templates niet laden. Zorg dat de "templates" tabel bestaat in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  // Laad templates bij mount
  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Voeg een nieuwe template toe
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    
    if (!newTemplateName.trim()) {
      setError('Template naam is verplicht');
      return;
    }

    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('templates')
        .insert([
          {
            name: newTemplateName.trim(),
            description: newTemplateDescription.trim(),
            user_id: user.id,
          },
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      setTemplates([data[0], ...templates]);
      setNewTemplateName('');
      setNewTemplateDescription('');
    } catch (err) {
      console.error('Fout bij toevoegen template:', err);
      setError(err.message || 'Kon template niet toevoegen');
    }
  };

  // Update een bestaande template
  const handleUpdateTemplate = async (id) => {
    if (!editName.trim()) {
      setError('Template naam is verplicht');
      return;
    }

    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('templates')
        .update({
          name: editName.trim(),
          description: editDescription.trim(),
        })
        .eq('id', id)
        .eq('user_id', user.id); // Extra beveiliging: alleen eigen templates

      if (updateError) {
        throw updateError;
      }

      setTemplates(
        templates.map((t) =>
          t.id === id
            ? { ...t, name: editName.trim(), description: editDescription.trim() }
            : t
        )
      );
      setEditingId(null);
      setEditName('');
      setEditDescription('');
    } catch (err) {
      console.error('Fout bij updaten template:', err);
      setError(err.message || 'Kon template niet updaten');
    }
  };

  // Verwijder een template
  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Weet je zeker dat je deze template wilt verwijderen?')) {
      return;
    }

    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Extra beveiliging: alleen eigen templates

      if (deleteError) {
        throw deleteError;
      }

      setTemplates(templates.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Fout bij verwijderen template:', err);
      setError(err.message || 'Kon template niet verwijderen');
    }
  };

  // Start edit mode
  const startEdit = (template) => {
    setEditingId(template.id);
    setEditName(template.name);
    setEditDescription(template.description || '');
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  if (loading) {
    return <div style={{ padding: '1rem' }}>Templates laden...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>
        Mijn Templates
      </h3>
      
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
        Dit is een voorbeeld van databeheer via Supabase. Je kunt hier je persoonlijke templates opslaan.
      </p>

      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Formulier voor nieuwe template */}
      <form onSubmit={handleAddTemplate} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Template naam"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              marginBottom: '0.5rem',
            }}
          />
          <textarea
            value={newTemplateDescription}
            onChange={(e) => setNewTemplateDescription(e.target.value)}
            placeholder="Beschrijving (optioneel)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              minHeight: '80px',
              resize: 'vertical',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Template Toevoegen
        </button>
      </form>

      {/* Lijst met templates */}
      {templates.length === 0 ? (
        <p style={{ color: '#999', fontStyle: 'italic' }}>
          Je hebt nog geen templates. Voeg er een toe om te beginnen!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
              }}
            >
              {editingId === template.id ? (
                // Edit mode
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      minHeight: '60px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateTemplate(template.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                    {template.name}
                  </h4>
                  {template.description && (
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                      {template.description}
                    </p>
                  )}
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#999' }}>
                    Aangemaakt: {new Date(template.created_at).toLocaleDateString('nl-NL')}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => startEdit(template)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesManager;
