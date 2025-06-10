// app/page.tsx
'use client'; // This directive indicates that this component is a client-side component

import React from 'react';
// import Link from 'next/link'; // Removed: Caused resolution error in preview environment

const HomePage: React.FC = () => {
  return (
    <div style={{
      fontFamily: '"Inter", sans-serif', // Using Inter font for a modern feel
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right bottom, #6a11cb 0%, #2575fc 100%)', // Vibrant gradient background
      padding: '20px',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px', // Slightly more rounded corners
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)', // More prominent shadow
        padding: '40px',
        maxWidth: '650px', // Slightly wider for better content distribution
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle light border
        backdropFilter: 'blur(5px)' // Slight blur effect
      }}>
        <h1 style={{
          color: '#333', // Darker text for better contrast
          marginBottom: '20px',
          fontSize: '3.2em', // Slightly larger
          fontWeight: '900', // Extra bold
          letterSpacing: '-1px', // Tighter spacing
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)', // Subtle text shadow
        }}>
          Intern Screening Test
        </h1>
        <p style={{
          color: '#555',
          fontSize: '1.2em',
          marginBottom: '40px',
          lineHeight: '1.7', // Improved line height for readability
          maxWidth: '500px', // Constrain paragraph width
          margin: '0 auto 40px auto' // Center paragraph
        }}>
          Welcome! This platform serves as a demonstration of a full-stack application.
          Explore the various sections to see different functionalities.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column', // Stack buttons vertically on small screens
          gap: '20px', // Consistent gap
          alignItems: 'center'
        }}>
          {/* Button for To-Do List */}
          <a href="/todos" style={{ textDecoration: 'none', width: 'clamp(250px, 80%, 350px)' }}>
            <button
              style={{
                width: '100%', // Take full width of parent a tag
                padding: '18px 30px', // More generous padding
                background: 'linear-gradient(to right, #4CAF50, #8BC34A)', // Green gradient
                color: 'white',
                border: 'none',
                borderRadius: '12px', // More rounded
                cursor: 'pointer',
                fontSize: '1.2em', // Larger font size
                fontWeight: '700', // Bold font
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow
              }}
              onMouseOver={(e) => (
                e.currentTarget.style.background = 'linear-gradient(to right, #388E3C, #689F38)',
                e.currentTarget.style.transform = 'scale(1.03)',
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
              )}
              onMouseOut={(e) => (
                e.currentTarget.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)',
                e.currentTarget.style.transform = 'scale(1.0)',
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              )}
            >
              <span style={{ marginRight: '10px' }}></span> Go to To-Do List
            </button>
          </a>

          {/* Button for Notes Integration */}
          <a href="/notes" style={{ textDecoration: 'none', width: 'clamp(250px, 80%, 350px)' }}>
            <button
              style={{
                width: '100%',
                padding: '18px 30px',
                background: 'linear-gradient(to right, #2196F3, #03A9F4)', // Blue gradient
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1.2em',
                fontWeight: '700',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
              onMouseOver={(e) => (
                e.currentTarget.style.background = 'linear-gradient(to right, #1976D2, #0288D1)',
                e.currentTarget.style.transform = 'scale(1.03)',
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
              )}
              onMouseOut={(e) => (
                e.currentTarget.style.background = 'linear-gradient(to right, #2196F3, #03A9F4)',
                e.currentTarget.style.transform = 'scale(1.0)',
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              )}
            >
              <span style={{ marginRight: '10px' }}></span> Explore Notes Integration
            </button>
          </a>

          {/* Button for AI Chat */}
          <a href="/chat" style={{ textDecoration: 'none', width: 'clamp(250px, 80%, 350px)' }}>
            <button
              style={{
                width: '100%',
                padding: '18px 30px',
                background: 'linear-gradient(to right, #FF5722, #FF9800)', // Orange gradient
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1.2em',
                fontWeight: '700',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
              onMouseOver={(e) => (
                e.currentTarget.style.background = 'linear-gradient(to right, #E64A19, #F57C00)',
                e.currentTarget.style.transform = 'scale(1.03)',
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
              )}
              onMouseOut={(e) => (
                e.currentTarget.style.background = 'linear-gradient(to right, #FF5722, #FF9800)',
                e.currentTarget.style.transform = 'scale(1.0)',
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              )}
            >
              <span style={{ marginRight: '10px' }}></span> Try AI Chat
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
