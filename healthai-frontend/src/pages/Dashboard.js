
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, workoutAPI } from '../services/api';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{...styles.statCard, borderColor: color + '30'}}>
    <div style={{...styles.statIcon, background: color + '20', color}}>
      {icon}
    </div>
    <div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      {sub && <div style={styles.statSub}>{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, statsRes, todayRes] = await Promise.all([
        userAPI.getProfile(),
        workoutAPI.stats(),
        workoutAPI.today(),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setTodayWorkouts(todayRes.data);
    } catch (err) {
      toast.error('Data load nahi hua!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loader}>
      <div style={styles.loaderText}>⚡ Loading...</div>
    </div>
  );

  const bmiColor = profile?.bmi < 18.5 ? '#ffa502' :
    profile?.bmi < 25 ? '#00ff88' :
    profile?.bmi < 30 ? '#ffa502' : '#ff4757';

  const radialData = [
    { name: 'Calories', value: stats?.totalCaloriesBurned || 0, fill: '#00ff88' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header} className="fade-in">
        <div>
          <h1 style={styles.greeting}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
          </h1>
          <p style={styles.name}>{profile?.name || 'Athlete'}</p>
        </div>
        <Link to="/workout" style={styles.logBtn}>
          + Log Workout
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid} className="fade-in">
        <StatCard
          icon="🔥"
          label="Total Calories"
          value={`${Math.round(stats?.totalCaloriesBurned || 0)} kcal`}
          color="#ff4757"
        />
        <StatCard
          icon="💪"
          label="Total Workouts"
          value={stats?.totalWorkouts || 0}
          color="#00ff88"
          sub={`${stats?.totalDurationMins || 0} mins total`}
        />
        <StatCard
          icon="🔥"
          label="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          color="#ffa502"
        />
        <StatCard
          icon="⚡"
          label="Avg Calories/Workout"
          value={`${Math.round(stats?.averageCaloriesPerWorkout || 0)} kcal`}
          color="#6c63ff"
        />
      </div>

      {/* Middle Section */}
      <div style={styles.middleGrid}>

        {/* BMI Card */}
        <div style={styles.card} className="fade-in">
          <h3 style={styles.cardTitle}>🎯 Health Score</h3>
          {profile?.bmi ? (
            <>
              <div style={{...styles.bmiValue, color: bmiColor}}>
                {profile.bmi}
              </div>
              <div style={{...styles.bmiCategory, color: bmiColor}}>
                {profile.bmiCategory || 'Normal'}
              </div>
              <div style={styles.bmiBar}>
                <div style={{
                  ...styles.bmiIndicator,
                  left: `${Math.min((profile.bmi / 40) * 100, 100)}%`,
                  background: bmiColor
                }} />
              </div>
              <div style={styles.bmiLabels}>
                <span>Underweight</span>
                <span>Normal</span>
                <span>Obese</span>
              </div>
              <div style={styles.calorieInfo}>
                <span style={styles.calorieLabel}>Daily Target</span>
                <span style={styles.calorieValue}>
                  {profile.dailyCalorieTarget} kcal
                </span>
              </div>
            </>
          ) : (
            <div style={styles.noData}>
              <p style={{color: '#888', marginBottom: '1rem'}}>
                Health data nahi hai!
              </p>
              <Link to="/profile" style={styles.setupBtn}>
                Setup Profile →
              </Link>
            </div>
          )}
        </div>

        {/* Today's Workouts */}
        <div style={styles.card} className="fade-in">
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>💪 Today's Workouts</h3>
            <span style={styles.badge}>{todayWorkouts.length}</span>
          </div>
          {todayWorkouts.length > 0 ? (
            <div style={styles.workoutList}>
              {todayWorkouts.map((w, i) => (
                <div key={i} style={styles.workoutItem}>
                  <div style={styles.workoutIcon}>
                    {w.category === 'CARDIO' ? '🏃' :
                     w.category === 'STRENGTH' ? '💪' : '🧘'}
                  </div>
                  <div style={styles.workoutInfo}>
                    <div style={styles.workoutName}>{w.exerciseName}</div>
                    <div style={styles.workoutMeta}>
                      {w.durationMins} min • {Math.round(w.caloriesBurned)} kcal
                    </div>
                  </div>
                  <div style={{...styles.workoutCat,
                    color: w.category === 'CARDIO' ? '#ff4757' :
                           w.category === 'STRENGTH' ? '#00ff88' : '#6c63ff'
                  }}>
                    {w.category}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noData}>
              <p style={{color: '#888', marginBottom: '1rem'}}>
                Aaj koi workout nahi!
              </p>
              <Link to="/workout" style={styles.setupBtn}>
                Log Workout →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.card} className="fade-in">
          <h3 style={styles.cardTitle}>⚡ Quick Actions</h3>
          <div style={styles.actionGrid}>
            {[
              { icon: '💪', label: 'Log Workout', path: '/workout', color: '#00ff88' },
              { icon: '🤖', label: 'AI Advice', path: '/ai-chat', color: '#6c63ff' },
              { icon: '👤', label: 'Update Profile', path: '/profile', color: '#ffa502' },
              { icon: '📊', label: 'View Progress', path: '/workout', color: '#ff4757' },
            ].map((action, i) => (
              <Link key={i} to={action.path} style={{
                ...styles.actionBtn,
                borderColor: action.color + '40',
                color: action.color,
              }}>
                <span style={styles.actionIcon}>{action.icon}</span>
                <span style={styles.actionLabel}>{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Favorite */}
          {stats?.mostDoneExercise && stats.mostDoneExercise !== 'N/A' && (
            <div style={styles.favoriteCard}>
              <span style={{color: '#888', fontSize: '0.85rem'}}>
                🏆 Favorite Exercise
              </span>
              <span style={{color: '#00ff88', fontWeight: '600'}}>
                {stats.mostDoneExercise}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: 'calc(100vh - 64px)',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 64px)',
  },
  loaderText: { color: '#00ff88', fontSize: '1.5rem', fontWeight: '700' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  greeting: { fontSize: '1rem', color: '#888', fontWeight: '400' },
  name: { fontSize: '2rem', fontWeight: '800', color: '#fff', marginTop: '0.2rem' },
  logBtn: {
    padding: '0.7rem 1.5rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: '#000',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: '#141414',
    borderRadius: '16px',
    border: '1px solid',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  },
  statValue: { fontSize: '1.4rem', fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' },
  statSub: { fontSize: '0.75rem', color: '#555', marginTop: '0.1rem' },
  middleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#141414',
    borderRadius: '20px',
    border: '1px solid #2a2a2a',
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' },
  badge: {
    background: '#00ff8820',
    color: '#00ff88',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  bmiValue: { fontSize: '3rem', fontWeight: '900', textAlign: 'center' },
  bmiCategory: { textAlign: 'center', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' },
  bmiBar: {
    height: '6px',
    background: 'linear-gradient(90deg, #ffa502, #00ff88, #ffa502, #ff4757)',
    borderRadius: '3px',
    position: 'relative',
    marginBottom: '0.5rem',
  },
  bmiIndicator: {
    position: 'absolute',
    top: '-4px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
    border: '2px solid #fff',
  },
  bmiLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: '#555',
    marginBottom: '1rem',
  },
  calorieInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
  },
  calorieLabel: { color: '#888', fontSize: '0.85rem' },
  calorieValue: { color: '#00ff88', fontWeight: '700' },
  noData: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' },
  setupBtn: {
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    background: '#00ff8820',
    color: '#00ff88',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  workoutList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  workoutItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.8rem',
    background: '#0a0a0a',
    borderRadius: '10px',
  },
  workoutIcon: { fontSize: '1.5rem' },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: '0.9rem', fontWeight: '600', color: '#fff' },
  workoutMeta: { fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' },
  workoutCat: { fontSize: '0.7rem', fontWeight: '700' },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
    marginBottom: '1rem',
  },
  actionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid',
    background: 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  actionIcon: { fontSize: '1.5rem' },
  actionLabel: { fontSize: '0.75rem', fontWeight: '600' },
  favoriteCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
  },
};

export default Dashboard;
