import React from 'react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { medications, sideEffects, setActivePage } = useApp();
  const activeMeds = medications.filter(m => m.active);

  const stats = [
    {
      icon: '💊',
      value: activeMeds.length,
      label: 'Active Medications',
      change: '+1 this month',
      changeType: 'up',
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
    },
    {
      icon: '⚠️',
      value: 2,
      label: 'Interaction Alerts',
      change: 'Needs review',
      changeType: 'down',
      color: '#fbbf24',
      bg: 'rgba(251,191,36,0.12)',
    },
    {
      icon: '📋',
      value: sideEffects.length,
      label: 'Side Effects Logged',
      change: '4 this week',
      changeType: 'up',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
    },
    {
      icon: '📄',
      value: 1,
      label: 'Reports Ready',
      change: 'Next appt: July 5',
      changeType: 'up',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
    },
  ];

  const upcomingDoses = [
    { med: 'Metformin', time: '8:00 AM', dosage: '500mg', done: true },
    { med: 'Lisinopril', time: '9:00 AM', dosage: '10mg', done: true },
    { med: 'Atorvastatin', time: '9:00 PM', dosage: '20mg', done: false },
    { med: 'Vitamin D3', time: '12:00 PM', dosage: '1000 IU', done: false },
  ];

  const recentAlerts = [
    {
      type: 'moderate',
      title: 'Metformin + Lisinopril',
      desc: 'Monitor blood pressure closely. Low-moderate interaction risk.',
      time: '2h ago',
    },
    {
      type: 'mild',
      title: 'Atorvastatin + Vitamin D3',
      desc: 'No significant interaction detected.',
      time: '1d ago',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">Good evening, John 👋</h2>
        <p className="page-subtitle">Here's your medication overview for today, Friday, June 21</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card animate-fade-up delay-${i + 1}`}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.changeType}`}>
                {s.changeType === 'up' ? '↑' : '↓'} {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="content-grid main-side">
        {/* Today's Schedule */}
        <div className="section-card animate-fade-up delay-2">
          <div className="section-card-header">
            <span className="section-card-title">
              <span>🕐</span> Today's Doses
            </span>
            <span className="badge badge-success">2/4 Done</span>
          </div>
          <div className="section-card-body">
            {upcomingDoses.map((dose, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '13px 0',
                borderBottom: i < upcomingDoses.length - 1 ? '1px solid var(--border-color)' : 'none',
                opacity: dose.done ? 0.6 : 1,
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: dose.done ? 'var(--success-bg)' : 'var(--pill-bg)',
                  border: `2px solid ${dose.done ? 'var(--success)' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}>
                  {dose.done ? '✓' : '○'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: dose.done ? 'line-through' : 'none' }}>
                    {dose.med}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {dose.dosage} · {dose.time}
                  </div>
                </div>
                {!dose.done && (
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Upcoming</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Actions */}
          <div className="section-card animate-fade-up delay-3">
            <div className="section-card-header">
              <span className="section-card-title">⚡ Quick Actions</span>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '➕', label: 'Add Medication', page: 'medications' },
                { icon: '🔍', label: 'Check Interaction', page: 'interactions' },
                { icon: '📝', label: 'Log Symptom', page: 'sideeffects' },
                { icon: '📄', label: 'Generate Report', page: 'reports' },
              ].map((action, i) => (
                <button
                  key={i}
                  id={`quick-action-${action.page}`}
                  className="btn btn-outline"
                  style={{ justifyContent: 'flex-start', gap: '10px' }}
                  onClick={() => setActivePage(action.page)}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interaction Alerts */}
          <div className="section-card animate-fade-up delay-4">
            <div className="section-card-header">
              <span className="section-card-title">⚠️ Recent Alerts</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('interactions')}>View All</button>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {recentAlerts.map((alert, i) => (
                <div key={i} className={`interaction-alert ${alert.type}`}>
                  <span className="interaction-icon">
                    {alert.type === 'moderate' ? '⚠️' : '✅'}
                  </span>
                  <div>
                    <div className="interaction-title">{alert.title}</div>
                    <div className="interaction-desc">{alert.desc}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My Medications */}
      <div className="section-card animate-fade-up delay-3" style={{ marginTop: '20px' }}>
        <div className="section-card-header">
          <span className="section-card-title">💊 My Medications</span>
          <button id="view-all-meds-btn" className="btn btn-outline btn-sm" onClick={() => setActivePage('medications')}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
            {activeMeds.map(med => (
              <div key={med.id} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                borderLeft: `3px solid ${med.color}`,
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
              className="med-card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: med.color }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{med.name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span>💊 {med.dosage} · {med.frequency}</span>
                  <span>👨‍⚕️ {med.doctor}</span>
                  <span className="badge badge-primary" style={{ marginTop: '6px', width: 'fit-content' }}>{med.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
