
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/workout', label: '💪 Workout' },
    { path: '/ai-chat', label: '🤖 AI Chat' },
    { path: '/profile', label: '👤 Profile' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>⚡ HealthAI</span>
      </div>

      {/* Desktop Links */}
      <div style={styles.links}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.activeLink : {})
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User + Logout */}
      <div style={styles.userSection}>
        <span style={styles.userName}>👋 {user?.name}</span>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '64px',
    background: '#141414',
    borderBottom: '1px solid #2a2a2a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  brand: { display: 'flex', alignItems: 'center' },
  logo: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#00ff88',
    letterSpacing: '-0.5px',
  },
  links: { display: 'flex', gap: '0.5rem' },
  link: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: '#00ff88',
    background: 'rgba(0,255,136,0.1)',
  },
  userSection: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { color: '#888', fontSize: '0.9rem' },
  logoutBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ff4757',
    background: 'transparent',
    color: '#ff4757',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
};

export default Navbar;
