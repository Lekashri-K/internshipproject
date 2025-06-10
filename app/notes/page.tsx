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
        setError(null);
        const response = await listNotes({ maxResults: 5 });
        setNotes(response.notes);
      } catch (error: unknown) { // Changed 'any' to 'unknown'
        console.error("Failed to fetch notes:", error);
        let errorMessage = 'Failed to load notes. Please try again.';
        if (error instanceof Error) { // Type guard for 'Error' instance
          errorMessage = 'Failed to load notes: ' + error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div style={{
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right bottom, #e3f2fd, #bbdefb)', // Light blue gradient
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        maxWidth: '700px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #b3e5fc', // Subtle border
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '2.5em',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          Notion Notesync Integration
        </h1>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1em', padding: '20px 0' }}>
            Loading notes...
          </p>
        ) : error ? (
          <p style={{
            color: '#dc3545',
            textAlign: 'center',
            fontSize: '1.1em',
            padding: '20px 0',
            backgroundColor: '#ffe0e6',
            borderRadius: '5px',
            border: '1px solid #dc3545'
          }}>
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
                  borderRadius: '10px', // More rounded
                  padding: '20px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', // Clearer shadow
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)', e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
              >
                <h3 style={{ color: '#007bff', marginBottom: '10px', fontSize: '1.6em', fontWeight: '600' }}>
                  {note.title}
                </h3>
                {note.content && (
                  <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '10px', fontSize: '0.95em' }}>
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
                          padding: '6px 12px', // Slightly more padding
                          borderRadius: '20px', // More rounded pills
                          fontSize: '0.85em', // Slightly larger font
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
                <div style={{ fontSize: '0.8em', color: '#888', borderTop: '1px solid #eee', paddingTop: '10px' }}>
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
