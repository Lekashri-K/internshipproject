// app/notes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { listNotes } from '../../packages/integrations/notion/notesync/notesync.functions';
import { Note } from '../../packages/integrations/notion/notesync/notesync.schema';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        // Call the mock integration function
        const response = await listNotes({ maxResults: 5 }); // Fetch up to 5 notes
        setNotes(response.notes);
      } catch (err: any) {
        console.error("Failed to fetch notes:", err);
        setError('Failed to load notes: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []); // Run once on component mount

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        maxWidth: '700px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '2.5em'
        }}>
          Notion Notesync Integration
        </h1>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1em', padding: '20px 0' }}>
            Loading notes...
          </p>
        ) : error ? (
          <p style={{ color: '#dc3545', textAlign: 'center', fontSize: '1.1em', padding: '20px 0' }}>
            Error: {error}
          </p>
        ) : notes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '1.1em', padding: '20px 0' }}>
            No notes found.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)', e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)')}
              >
                <h3 style={{ color: '#007bff', marginBottom: '10px', fontSize: '1.5em' }}>
                  {note.title}
                </h3>
                {note.content && (
                  <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '10px' }}>
                    {note.content}
                  </p>
                )}
                {note.tags && note.tags.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#e9f7ef',
                          color: '#28a745',
                          padding: '5px 10px',
                          borderRadius: '15px',
                          fontSize: '0.8em',
                          marginRight: '8px',
                          marginBottom: '5px',
                          fontWeight: 'bold',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '0.85em', color: '#888' }}>
                  <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                  {note.updatedAt && (
                    <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotesPage;