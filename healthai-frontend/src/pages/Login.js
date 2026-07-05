
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="fade-in">
        <div style={styles.header}>
          <h1 style={styles.logo}>⚡ HealthAI</h1>
          <p style={styles.subtitle}>Your AI-powered fitness companion</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Welcome back</h2>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="sunny@gmail.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <p style={styles.switchText}>
            New here?{' '}
            <Link to="/register" style={styles.link}>Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#141414',
    borderRadius: '20px',
    border: '1px solid #2a2a2a',
    padding: '2.5rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  logo: { fontSize: '2rem', color: '#00ff88', marginBottom: '0.5rem' },
  subtitle: { color: '#888', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  title: { fontSize: '1.5rem', fontWeight: '700', color: '#fff' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', color: '#888', fontWeight: '500' },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '1px solid #2a2a2a',
    background: '#0a0a0a',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.2s',
  },
  btn: {
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: '#000',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  switchText: { textAlign: 'center', color: '#888', fontSize: '0.9rem' },
  link: { color: '#00ff88', textDecoration: 'none', fontWeight: '600' },
};

export default Login;
