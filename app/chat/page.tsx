// app/chat/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const handleSendChat = async () => {
    if (userChatInput.trim() === '') {
      setChatError('Please type a message to send.');
      return;
    }
    setChatError(null);

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userChatInput,
    };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserChatInput('');

    setIsAiTyping(true);
    const aiMessageId = crypto.randomUUID();

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

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { id: aiMessageId, sender: 'ai', text: '' },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setChatMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }
    } catch (error: unknown) { // Changed 'any' to 'unknown'
      let errorMessage = 'Chat failed. Please try again.';
      if (error instanceof Error) { // Type guard for 'Error' instance
        errorMessage = 'Chat failed: ' + error.message;
      }
      setChatError(errorMessage);
      setChatMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== aiMessageId)
      );
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div style={{
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right bottom, #f0f4f8, #d9e2ec)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        maxWidth: '550px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #e0e6ed',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '25px',
          fontSize: '2.2em',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          AI Chat Assistant
        </h2>

        <div style={{
          border: '1px solid #e0e6ed',
          borderRadius: '10px',
          padding: '15px',
          minHeight: '250px',
          maxHeight: '450px',
          overflowY: 'auto',
          marginBottom: '20px',
          backgroundColor: '#fdfdfd',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
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
                  backgroundColor: msg.sender === 'user' ? '#D6EAF8' : '#e9ecef',
                  color: '#333',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  fontSize: '0.95em',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
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
                backgroundColor: '#f0f2f5',
                color: '#666',
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
          <div ref={messagesEndRef} />
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
              padding: '14px 18px',
              border: '1px solid #cce0ff',
              borderRadius: '8px',
              fontSize: '1.05em',
              minWidth: '200px',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#007bff', e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 3px rgba(0,123,255,0.25)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#cce0ff', e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.08)')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAiTyping) {
                handleSendChat();
              }
            }}
            disabled={isAiTyping}
          />
          <button
            onClick={handleSendChat}
            style={{
              padding: '14px 25px',
              background: 'linear-gradient(to right, #28a745, #388e3c)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.05em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #218838, #2e7d32)', e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #28a745, #388e3c)', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)')}
            disabled={isAiTyping}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
