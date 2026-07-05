
import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../services/api';
import toast from 'react-hot-toast';

const exercises = [
  { id: 1, name: 'Push Up', category: 'STRENGTH', icon: '💪' },
  { id: 2, name: 'Pull Up', category: 'STRENGTH', icon: '🏋️' },
  { id: 3, name: 'Squat', category: 'STRENGTH', icon: '🦵' },
  { id: 4, name: 'Running', category: 'CARDIO', icon: '🏃' },
  { id: 5, name: 'Plank', category: 'FLEXIBILITY', icon: '🧘' },
  { id: 6, name: 'Deadlift', category: 'STRENGTH', icon: '🏋️' },
  { id: 7, name: 'Cycling', category: 'CARDIO', icon: '🚴' },
  { id: 8, name: 'Burpees', category: 'CARDIO', icon: '⚡' },
];

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    exerciseId: 1, sets: 3, reps: 12,
    durationMins: 10, weight: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('log');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allRes, statsRes] = await Promise.all([
        workoutAPI.all(),
        workoutAPI.stats(),
      ]);
      setWorkouts(allRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Data load nahi hua!');
    }
  };

  const handleLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await workoutAPI.log({
        ...form,
        exerciseId: parseInt(form.exerciseId),
        weight: form.weight ? parseFloat(form.weight) : null,
      });
      toast.success('Workout logged! 💪');
      setForm({ exerciseId: 1, sets: 3, reps: 12, durationMins: 10, weight: '', notes: '' });
      loadData();
    } catch (err) {
      toast.error('Log nahi hua!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await workoutAPI.delete(id);
      toast.success('Deleted!');
      loadData();
    } catch (err) {
      toast.error('Delete nahi hua!');
    }
  };

  const selectedEx = exercises.find(e => e.id === parseInt(form.exerciseId));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💪 Workout Tracker</h1>

      {/* Stats Row */}
      {stats && (
        <div style={styles.statsRow}>
          {[
            { label: 'Total', value: stats.totalWorkouts, icon: '📊' },
            { label: 'Calories', value: `${Math.round(stats.totalCaloriesBurned)} kcal`, icon: '🔥' },
            { label: 'Streak', value: `${stats.currentStreak} days`, icon: '⚡' },
            { label: 'Favorite', value: stats.mostDoneExercise || 'N/A', icon: '🏆' },
          ].map((s, i) => (
            <div key={i} style={styles.statChip}>
              <span>{s.icon}</span>
              <div>
                <div style={styles.chipValue}>{s.value}</div>
                <div style={styles.chipLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {['log', 'history'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{...styles.tab, ...(tab === t ? styles.activeTab : {})}}
          >
            {t === 'log' ? '+ Log Workout' : '📋 History'}
          </button>
        ))}
      </div>

      {tab === 'log' ? (
        <div style={styles.grid}>
          {/* Exercise Picker */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Choose Exercise</h3>
            <div style={styles.exerciseGrid}>
              {exercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setForm({...form, exerciseId: ex.id})}
                  style={{
                    ...styles.exBtn,
                    ...(parseInt(form.exerciseId) === ex.id ? styles.exBtnActive : {})
                  }}
                >
                  <span style={styles.exIcon}>{ex.icon}</span>
                  <span style={styles.exName}>{ex.name}</span>
                  <span style={{
                    ...styles.exCat,
                    color: ex.category === 'CARDIO' ? '#ff4757' :
                           ex.category === 'STRENGTH' ? '#00ff88' : '#6c63ff'
                  }}>
                    {ex.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Log Form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              {selectedEx?.icon} Log {selectedEx?.name}
            </h3>
            <form onSubmit={handleLog} style={styles.form}>
              <div style={styles.formGrid}>
                {[
                  { key: 'sets', label: 'Sets', type: 'number', placeholder: '3' },
                  { key: 'reps', label: 'Reps', type: 'number', placeholder: '12' },
                  { key: 'durationMins', label: 'Duration (min)', type: 'number', placeholder: '10' },
                  { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Optional' },
                ].map(field => (
                  <div key={field.key} style={styles.field}>
                    <label style={styles.label}>{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({...form, [field.key]: e.target.value})}
                      style={styles.input}
                      required={field.key !== 'weight'}
                    />
                  </div>
                ))}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Notes (optional)</label>
                <textarea
                  placeholder="How did it feel?"
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  style={{...styles.input, height: '80px', resize: 'none'}}
                />
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Logging...' : '+ Log Workout'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={styles.historyCard}>
          <h3 style={styles.cardTitle}>Workout History</h3>
          {workouts.length > 0 ? (
            <div style={styles.historyList}>
              {workouts.map((w, i) => (
                <div key={i} style={styles.historyItem}>
                  <div style={styles.historyIcon}>
                    {exercises.find(e => e.name === w.exerciseName)?.icon || '💪'}
                  </div>
                  <div style={styles.historyInfo}>
                    <div style={styles.historyName}>{w.exerciseName}</div>
                    <div style={styles.historyMeta}>
                      {w.sets && `${w.sets} sets × ${w.reps} reps`}
                      {w.durationMins && ` • ${w.durationMins} min`}
                      {w.caloriesBurned && ` • ${Math.round(w.caloriesBurned)} kcal`}
                    </div>
                    <div style={styles.historyDate}>{w.workoutDate}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: '#888', textAlign: 'center', padding: '2rem'}}>
              Koi workout nahi logged!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' },
  statsRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  statChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '0.8rem 1.2rem',
    flex: '1',
    minWidth: '150px',
  },
  chipValue: { fontSize: '1rem', fontWeight: '700', color: '#00ff88' },
  chipLabel: { fontSize: '0.75rem', color: '#888' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: {
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    border: '1px solid #2a2a2a',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  activeTab: {
    background: '#00ff8820',
    color: '#00ff88',
    borderColor: '#00ff8840',
  },
  grid: {
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
  cardTitle: { fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' },
  exerciseGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
  },
  exBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.8rem',
    borderRadius: '10px',
    border: '1px solid #2a2a2a',
    background: '#0a0a0a',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  exBtnActive: {
    border: '1px solid #00ff8840',
    background: '#00ff8810',
  },
  exIcon: { fontSize: '1.5rem' },
  exName: { fontSize: '0.8rem', fontWeight: '600', color: '#fff' },
  exCat: { fontSize: '0.65rem', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.8rem', color: '#888', fontWeight: '500' },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid #2a2a2a',
    background: '#0a0a0a',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  submitBtn: {
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: '#000',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  historyCard: {
    background: '#141414',
    borderRadius: '20px',
    border: '1px solid #2a2a2a',
    padding: '1.5rem',
  },
  historyList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem',
    background: '#0a0a0a',
    borderRadius: '12px',
    border: '1px solid #1a1a1a',
  },
  historyIcon: { fontSize: '1.8rem' },
  historyInfo: { flex: 1 },
  historyName: { fontSize: '0.95rem', fontWeight: '600' },
  historyMeta: { fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' },
  historyDate: { fontSize: '0.75rem', color: '#555', marginTop: '0.2rem' },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    opacity: 0.6,
  },
};

export default WorkoutPage;
