
import React, { useState, useRef, useEffect } from 'react';
import { aiAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Namaste! 🙏 Main tumhara AI fitness trainer hoon. Workout advice, diet tips, ya koi bhi fitness sawaal poocho!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    userAPI.getProfile().then(res => setProfile(res.data)).catch(() => {});
  }, []);

  const quickQuestions = [
    'Weight loss ke liye best exercises?',
    'Mera BMI normal hai?',
    'Protein intake kitna hona chahiye?',
    'Beginner workout plan do',
  ];

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    try {
      let response;
      if (profile?.bmi) {
        // Full recommendation with profile
        const res = await aiAPI.recommend({
          email: profile.email,
          health_data: {
            weight: profile.weight,
            height: profile.height,
            age: profile.age,
            gender: profile.gender,
            activity_level: profile.activityLevel,
            goal: profile.goal,
            bmi: profile.bmi,
            daily_calorie_target: profile.dailyCalorieTarget,
          },
          question: msg,
        });
        response = res.data.response;
      } else {
        // Simple chat
        const res = await aiAPI.chat({
          email: 'user',
          message: msg,
          conversation_history: [],
        });
        response = res.data.response;
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      toast.error('AI response nahi aaya!');
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry! Abhi response nahi de pa raha. Thodi der baad try karo 🙏'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.aiAvatar}>🤖</div>
        <div>
          <h2 style={styles.aiName}>HealthAI Assistant</h2>
          <div style={styles.aiStatus}>
            <span style={styles.statusDot} />
            Gemini AI • Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageBubble,
              ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble),
            }}
            className="fade-in"
          >
            {msg.role === 'ai' && (
              <div style={styles.aiLabel}>🤖 HealthAI</div>
            )}
            <div style={styles.messageText}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{...styles.messageBubble, ...styles.aiBubble}}>
            <div style={styles.aiLabel}>🤖 HealthAI</div>
            <div style={styles.typing}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div style={styles.quickContainer}>
          <p style={styles.quickLabel}>Quick questions:</p>
          <div style={styles.quickGrid}>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                style={styles.quickBtn}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Koi bhi fitness sawaal poocho..."
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          style={styles.sendBtn}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1.5rem',
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: '#141414',
    borderRadius: '16px',
    padding: '1rem 1.5rem',
    border: '1px solid #2a2a2a',
  },
  aiAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#6c63ff20',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '2px solid #6c63ff40',
  },
  aiName: { fontSize: '1.1rem', fontWeight: '700' },
  aiStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '0.2rem',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff88',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '0.5rem',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '1rem 1.2rem',
    borderRadius: '16px',
    lineHeight: '1.6',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '4px 16px 16px 16px',
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: '#000',
    borderRadius: '16px 4px 16px 16px',
    fontWeight: '500',
  },
  aiLabel: {
    fontSize: '0.75rem',
    color: '#6c63ff',
    fontWeight: '700',
    marginBottom: '0.4rem',
  },
  messageText: { fontSize: '0.92rem', whiteSpace: 'pre-wrap' },
  typing: {
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'center',
    padding: '0.3rem 0',
  },
  quickContainer: {
    background: '#141414',
    borderRadius: '12px',
    padding: '1rem',
    border: '1px solid #2a2a2a',
  },
  quickLabel: { fontSize: '0.8rem', color: '#888', marginBottom: '0.8rem' },
  quickGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  quickBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: '1px solid #2a2a2a',
    background: '#0a0a0a',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.82rem',
    transition: 'all 0.2s',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.8rem',
    background: '#141414',
    borderRadius: '14px',
    padding: '0.8rem',
    border: '1px solid #2a2a2a',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.95rem',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: '#000',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '700',
  },
};

export default AIChat;
