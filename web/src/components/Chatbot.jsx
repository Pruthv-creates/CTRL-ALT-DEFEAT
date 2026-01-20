import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  analyzeDietaryNeeds, 
  filterPlantsByNeeds, 
  formatPlantRecommendation,
  chatbotResponses 
} from '../services/chatbotService';
import { Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: chatbotResponses.greeting,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allPlants, setAllPlants] = useState([]);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(2);

  // Load plants from Firestore
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'plants'));
        const plants = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPlants(plants);
      } catch (error) {
        console.error('Error loading plants:', error);
      }
    };

    loadPlants();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text, isUser = false, plant = null) => {
    const newMessage = {
      id: messageIdRef.current++,
      text,
      isUser,
      timestamp: new Date(),
      plant,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, true);
    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    // Analyze dietary needs
    const needs = analyzeDietaryNeeds(userMessage);

    if (needs.size > 0) {
      // Add bot response
      addMessage(chatbotResponses.found_plants, false);

      // Filter plants
      const recommendedPlants = filterPlantsByNeeds(allPlants, needs);

      if (recommendedPlants.length > 0) {
        // Add individual plant recommendations
        for (let i = 0; i < recommendedPlants.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 400));
          addMessage(formatPlantRecommendation(recommendedPlants[i]), false, recommendedPlants[i]);
        }
      }

      // Add follow-up message
      await new Promise(resolve => setTimeout(resolve, 400));
      addMessage(chatbotResponses.more_help, false);
    } else {
      addMessage(chatbotResponses.not_understood, false);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: '999',
        }}
        title="Open Chatbot"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '600px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: '1000',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          🌿 Herbal Guide Chatbot
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0',
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((message) => (
          <div key={message.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: message.isUser
                    ? 'var(--color-primary)'
                    : '#f0f0f0',
                  color: message.isUser ? 'white' : '#333',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.text}
              </div>
            </div>
            {message.plant && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Link
                  to={`/plant/${message.plant.id}`}
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#e8f5e9',
                    border: '1px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    fontSize: '12px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#c8e6c9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                  }}
                >
                  📌 View {message.plant.commonName}
                </Link>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                animation: 'bounce 1.4s infinite',
              }}
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                animation: 'bounce 1.4s infinite',
                animationDelay: '0.2s',
              }}
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                animation: 'bounce 1.4s infinite',
                animationDelay: '0.4s',
              }}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: '1px solid #e0e0e0',
          padding: '12px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your health concern..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading || !inputValue.trim() ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <Send size={18} />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
