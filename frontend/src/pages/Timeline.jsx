import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Timeline = () => {
  const { medications } = useApp();
  const [selectedMed, setSelectedMed] = useState('all');

  const activeMeds = medications.filter(m => m.active);
  const displayMeds = selectedMed === 'all' ? medications : medications.filter(m => m.id === Number(selectedMed));

  // Generate timeline months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => months[(currentMonth - 5 + i + 12) % 12]);

  // Mock adherence data
  const adherenceData = {
    1: [95, 88, 92, 97, 85, 90],
    2: [100, 95, 98, 100, 97, 99],
    3: [78, 82, 88, 75, 90, 85],
    4: [92, 88, 95, 91, 87, 94],
  };

  const getAdherence = (medId) => adherenceData[medId] || [85, 88, 90, 87, 92, 89];

  // Weekly schedule for visual timeline
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockWeekData = medications.map(med => ({
    ...med,
    week: weekDays.map((_, di) => ({
      morning: di < 5,
      evening: med.frequency?.toLowerCase().includes('twice') || med.frequency?.toLowerCase().includes('nightly'),
      taken: Math.random() > 0.15,
    })),
  }));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 className="page-title">Dosage Timeline</h2>
          <p className="page-subtitle">Visual history of your medication adherence over time</p>
        </div>
        <select
          id="timeline-med-filter"
          className="select"
          style={{ width: 'auto', minWidth: '180px' }}
          value={selectedMed}
          onChange={e => setSelectedMed(e.target.value)}
        >
          <option value="all">All Medications</option>
          {medications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Adherence Chart */}
      <div className="section-card animate-fade-up" style={{ marginBottom: '20px' }}>
        <div className="section-card-header">
          <span className="section-card-title">📊 6-Month Adherence Overview</span>
          <span className="badge badge-success">Avg: 91%</span>
        </div>
        <div className="section-card-body">
          {/* Bar Chart */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '180px', padding: '0 8px' }}>
            {last6Months.map((month, mi) => {
              const vals = displayMeds.map(m => getAdherence(m.id)[mi]);
              const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
              return (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{avg}%</span>
                  <div style={{
                    width: '100%', height: `${avg * 1.4}px`,
                    background: avg >= 90 ? 'var(--gradient-primary)' : avg >= 75 ? 'linear-gradient(180deg,#fbbf24,#f59e0b)' : 'linear-gradient(180deg,#f87171,#ef4444)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    transition: 'height 0.8s ease',
                    position: 'relative',
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{month}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { color: 'var(--gradient-primary)', label: '≥ 90% (Excellent)' },
              { color: 'linear-gradient(90deg,#fbbf24,#f59e0b)', label: '75–90% (Good)' },
              { color: 'linear-gradient(90deg,#f87171,#ef4444)', label: '< 75% (Needs attention)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Medication Adherence */}
      <div className="section-card animate-fade-up delay-2" style={{ marginBottom: '20px' }}>
        <div className="section-card-header">
          <span className="section-card-title">💊 Medication-by-Medication Breakdown</span>
        </div>
        <div className="section-card-body">
          {displayMeds.map((med, i) => {
            const adherence = getAdherence(med.id);
            const avgAdherence = Math.round(adherence.reduce((a, b) => a + b, 0) / adherence.length);
            return (
              <div key={med.id} style={{ marginBottom: i < displayMeds.length - 1 ? '20px' : 0, paddingBottom: i < displayMeds.length - 1 ? '20px' : 0, borderBottom: i < displayMeds.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: med.color }} />
                    <span style={{ fontWeight: 700 }}>{med.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{med.dosage} · {med.frequency}</span>
                  </div>
                  <span style={{
                    fontWeight: 800, fontSize: '0.9rem',
                    color: avgAdherence >= 90 ? 'var(--success)' : avgAdherence >= 75 ? 'var(--warning)' : 'var(--danger)',
                  }}>
                    {avgAdherence}%
                  </span>
                </div>
                {/* Mini sparkline */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px' }}>
                  {adherence.map((val, vi) => (
                    <div key={vi} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div style={{
                        width: '100%', height: `${val * 0.35}px`,
                        background: med.color,
                        borderRadius: '2px 2px 0 0',
                        opacity: 0.7,
                      }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  {last6Months.map(m => (
                    <span key={m} style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* This Week's Calendar View */}
      <div className="section-card animate-fade-up delay-3">
        <div className="section-card-header">
          <span className="section-card-title">📅 This Week at a Glance</span>
          <span className="badge badge-primary">June 17 – 23</span>
        </div>
        <div className="section-card-body" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medication</th>
                {weekDays.map(d => (
                  <th key={d} style={{ textAlign: 'center', padding: '8px 8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockWeekData.slice(0, displayMeds.length).map((med) => (
                <tr key={med.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: med.color }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{med.name}</span>
                    </div>
                  </td>
                  {med.week.map((day, di) => (
                    <td key={di} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: day.taken ? med.color : 'var(--bg-secondary)',
                        border: `2px solid ${day.taken ? med.color : 'var(--border-color)'}`,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: day.taken ? 'white' : 'var(--text-muted)',
                        fontWeight: 700,
                      }}>
                        {day.taken ? '✓' : '·'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
