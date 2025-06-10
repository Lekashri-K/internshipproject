// app/chat/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react'; // Added useRef for scroll to bottom

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ChatBox: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Ref for scrolling to the bottom of the chat messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat box whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const handleSendChat = async () => {
    if (userChatInput.trim() === '') {
      setChatError('Please type a message to send.');
      return;
    }
    setChatError(null); // Clear any previous errors

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userChatInput,
    };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserChatInput(''); // Clear the input field

    setIsAiTyping(true); // Show AI typing indicator
    const aiMessageId = crypto.randomUUID(); // ID for the AI's response

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newUserMessage.text }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      // Initialize AI message (empty initially)
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { id: aiMessageId, sender: 'ai', text: '' },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Update the AI's message in real-time
        setChatMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }
    } catch (err: any) {
      setChatError('Chat failed: ' + err.message);
      // Remove or update the AI message if it failed
      setChatMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== aiMessageId)
      );
    } finally {
      setIsAiTyping(false); // Hide AI typing indicator
    }
  };

  return (
    <div style={{
      fontFamily: '"Inter", sans-serif', // Changed to Inter font
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right bottom, #f0f4f8, #d9e2ec)', // Lighter, subtle gradient background
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '15px', // More rounded
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)', // Deeper shadow
        padding: '30px',
        maxWidth: '550px', // Slightly wider for better chat layout
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #e0e6ed', // Subtle border
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '25px',
          fontSize: '2.2em', // Slightly larger font
          fontWeight: '700', // Bolder font
          letterSpacing: '-0.5px'
        }}>
          AI Chat Assistant
        </h2>

        {/* Chat Messages Display Area */}
        <div style={{
          border: '1px solid #e0e6ed',
          borderRadius: '10px', // More rounded
          padding: '15px',
          minHeight: '250px', // Slightly taller chat area
          maxHeight: '450px', // Max height for scrollable area
          overflowY: 'auto',
          marginBottom: '20px',
          backgroundColor: '#fdfdfd',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px' // Spacing between messages
        }}>
          {chatMessages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '10px 0' }}>
              Start a conversation! Type your message below.
            </p>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#D6EAF8' : '#e9ecef', // User: light blue, AI: very light gray
                  color: '#333', // Dark text for both sender for readability
                  padding: '12px 18px', // Slightly more padding
                  borderRadius: '20px', // More rounded bubbles
                  maxWidth: '85%', // Slightly wider max width for bubbles
                  wordBreak: 'break-word',
                  fontSize: '0.95em',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)', // Clearer shadow
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isAiTyping && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}>
              <div style={{
                backgroundColor: '#f0f2f5', // Lighter background for typing indicator
                color: '#666', // Darker text for visibility
                padding: '10px 15px',
                borderRadius: '15px',
                fontSize: '0.9em',
                fontStyle: 'italic',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                AI is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Element to scroll into view */}
        </div>

        {chatError && (
          <p style={{
            color: '#dc3545',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '0.9em',
            backgroundColor: '#ffe0e6',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #dc3545'
          }}>{chatError}</p>
        )}

        {/* Chat Input Area */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            value={userChatInput}
            onChange={(e) => setUserChatInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flexGrow: 1,
              padding: '14px 18px', // More padding for larger input
              border: '1px solid #cce0ff', // Light blue border
              borderRadius: '8px', // More rounded input
              fontSize: '1.05em', // Slightly larger font
              minWidth: '200px',
              outline: 'none', // Remove default outline
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)', // Subtle inner shadow
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#007bff', e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 3px rgba(0,123,255,0.25)')} // Focus style
            onBlur={(e) => (e.currentTarget.style.borderColor = '#cce0ff', e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.08)')} // Blur style
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAiTyping) { // Prevent sending if AI is typing
                handleSendChat();
              }
            }}
            disabled={isAiTyping} // Disable input while AI is typing
          />
          <button
            onClick={handleSendChat}
            style={{
              padding: '14px 25px', // More padding for button
              background: 'linear-gradient(to right, #28a745, #388e3c)', // Green gradient
              color: 'white',
              border: 'none',
              borderRadius: '8px', // Rounded corners
              cursor: 'pointer',
              fontSize: '1.05em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Shadow for button
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #218838, #2e7d32)', e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #28a745, #388e3c)', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)')}
            disabled={isAiTyping} // Disable button while AI is typing
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
