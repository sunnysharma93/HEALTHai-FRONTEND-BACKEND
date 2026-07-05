
import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    weight: '', height: '', age: '',
    gender: 'MALE', activityLevel: 'ACTIVE', goal: 'MAINTAIN'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setProfile(res.data);
      if (res.data.weight) {
        setForm({
          weight: res.data.weight || '',
          height: res.data.height || '',
          age: res.data.age || '',
          gender: res.data.gender || 'MALE',
          activityLevel: res.data.activityLevel || 'ACTIVE',
          goal: res.data.goal || 'MAINTAIN',
        });
      }
    } catch (err) {
      toast.error('Profile load nahi hua!');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.saveHealth({
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        age: parseInt(form.age),
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
      });
      toast.success('Profile saved! 🎉');
      loadProfile();
    } catch (err) {
      toast.error('Save nahi hua!');
    } finally {
      setSaving(false);
    }
  };

  const bmiColor = profile?.bmi < 18.5 ? '#ffa502' :
    profile?.bmi < 25 ? '#00ff88' :
    profile?.bmi < 30 ? '#ffa502' : '#ff4757';

  if (loading) return (
    <div style={styles.loader}>
      <div style={{color: '#00ff88', fontSize: '1.5rem'}}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 My Profile</h1>

      <div style={styles.grid}>
        {/* User Info Card */}
        <div style={styles.card}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.userName}>{user?.name}</h2>
          <p style={styles.userEmail}>{user?.email}</p>

          {profile?.bmi && (
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <div style={{...styles.statValue, color: bmiColor}}>
                  {profile.bmi}
                </div>
                <div style={styles.statLabel}>BMI</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{profile.weight}kg</div>
                <div style={styles.statLabel}>Weight</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{profile.height}cm</div>
                <div style={styles.statLabel}>Height</div>
              </div>
            </div>
          )}

          {profile?.dailyCalorieTarget && (
            <div style={styles.calorieCard}>
              <span style={{color: '#888', fontSize: '0.85rem'}}>
                🎯 Daily Calorie Target
              </span>
              <span style={{color: '#00ff88', fontWeight: '800', fontSize: '1.3rem'}}>
                {profile.dailyCalorieTarget} kcal
              </span>
            </div>
          )}

          {profile?.goal && (
            <div style={styles.goalBadge}>
              {profile.goal === 'LOSE_WEIGHT' ? '⬇️ Lose Weight' :
               profile.goal === 'GAIN_MUSCLE' ? '💪 Gain Muscle' : '⚖️ Maintain'}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Update Health Data</h3>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Weight (kg)</label>
                <input
                  type="number"
                  placeholder="75"
                  value={form.weight}
                  onChange={e => setForm({...form, weight: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Height (cm)</label>
                <input
                  type="number"
                  placeholder="175"
                  value={form.height}
                  onChange={e => setForm({...form, height: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  placeholder="25"
                  value={form.age}
                  onChange={e => setForm({...form, age: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Gender</label>
                <select
                  value={form.gender}
                  onChange={e => setForm({...form, gender: e.target.value})}
                  style={styles.input}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Activity Level</label>
              <div style={styles.optionGrid}>
                {[
                  { value: 'SEDENTARY', label: '🪑 Sedentary', sub: 'Little/no exercise' },
                  { value: 'ACTIVE', label: '🏃 Active', sub: '3-5 days/week' },
                  { value: 'VERY_ACTIVE', label: '⚡ Very Active', sub: '6-7 days/week' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({...form, activityLevel: opt.value})}
                    style={{
                      ...styles.optBtn,
                      ...(form.activityLevel === opt.value ? styles.optBtnActive : {})
                    }}
                  >
                    <span>{opt.label}</span>
                    <span style={{fontSize: '0.7rem', color: '#888'}}>{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Goal</label>
              <div style={styles.optionGrid}>
                {[
                  { value: 'LOSE_WEIGHT', label: '⬇️ Lose Weight', color: '#ff4757' },
                  { value: 'MAINTAIN', label: '⚖️ Maintain', color: '#ffa502' },
                  { value: 'GAIN_MUSCLE', label: '💪 Gain Muscle', color: '#00ff88' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({...form, goal: opt.value})}
                    style={{
                      ...styles.optBtn,
                      ...(form.goal === opt.value ? {
                        ...styles.optBtnActive,
                        borderColor: opt.color + '60',
                        color: opt.color,
                      } : {})
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  loader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', height: 'calc(100vh - 64px)',
  },
  title: { fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#141414',
    borderRadius: '20px',
    border: '1px solid #2a2a2a',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '800',
    color: '#000',
  },
  userName: { fontSize: '1.5rem', fontWeight: '800' },
  userEmail: { color: '#888', fontSize: '0.9rem' },
  statsRow: { display: 'flex', gap: '1.5rem', width: '100%', justifyContent: 'center' },
  statItem: { textAlign: 'center' },
  statValue: { fontSize: '1.4rem', fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: '0.75rem', color: '#888' },
  calorieCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#00ff8810',
    borderRadius: '12px',
    padding: '1rem 2rem',
    border: '1px solid #00ff8830',
    width: '100%',
  },
  goalBadge: {
    padding: '0.5rem 1.5rem',
    borderRadius: '20px',
    background: '#2a2a2a',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', alignSelf: 'flex-start' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' },
  label: { fontSize: '0.8rem', color: '#888', fontWeight: '500' },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid #2a2a2a',
    background: '#0a0a0a',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
  },
  optionGrid: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  optBtn: {
    flex: 1,
    minWidth: '100px',
    padding: '0.7rem',
    borderRadius: '10px',
    border: '1px solid #2a2a2a',
    background: '#0a0a0a',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.82rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  optBtnActive: {
    borderColor: '#00ff8840',
    background: '#00ff8810',
    color: '#00ff88',
  },
  saveBtn: {
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: '#000',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
  },
};

export default ProfilePage;
