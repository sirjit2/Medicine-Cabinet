import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const SYMPTOMS = ['Nausea', 'Dizziness', 'Headache', 'Fatigue', 'Stomach pain', 'Dry mouth',
  'Insomnia', 'Rash', 'Itching', 'Shortness of breath', 'Muscle pain', 'Loss of appetite', 'Other'];

const SeverityLabel = ({ val }) => {
  const colors = ['', '#34d399', '#a3e635', '#fbbf24', '#f97316', '#f87171'];
  const labels = ['', 'Very Mild', 'Mild', 'Moderate', 'Severe', 'Very Severe'];
  return (
    <span style={{ color: colors[val], fontWeight: 700, fontSize: '0.8rem' }}>
      {labels[val]}
    </span>
  );
};

const SideEffects = () => {
  const { sideEffects, setSideEffects, medications, addToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    symptom: '',
    customSymptom: '',
    severity: 3,
    linkedMeds: [],
    notes: '',
  });

  const activeMeds = medications.filter(m => m.active);

  const handleSave = () => {
    if (!form.symptom) { addToast('Please select a symptom.', 'error'); return; }
    const symptomName = form.symptom === 'Other' ? form.customSymptom || 'Other' : form.symptom;
    const entry = {
      id: Date.now(),
      date: form.date,
      symptom: symptomName,
      severity: form.severity,
      linkedMeds: form.linkedMeds,
      notes: form.notes,
    };
    setSideEffects(prev => [entry, ...prev]);
    setShowModal(false);
    addToast(`Symptom logged: ${symptomName}`, 'success');
    setForm({ date: new Date().toISOString().split('T')[0], symptom: '', customSymptom: '', severity: 3, linkedMeds: [], notes: '' });
  };

  const handleDelete = (id) => {
    setSideEffects(prev => prev.filter(s => s.id !== id));
    addToast('Entry removed.', 'warning');
  };

  const toggleMed = (id) => {
    setForm(f => ({
      ...f,
      linkedMeds: f.linkedMeds.includes(id)
        ? f.linkedMeds.filter(m => m !== id)
        : [...f.linkedMeds, id],
    }));
  };

  const getMedName = (id) => medications.find(m => m.id === id)?.name || 'Unknown';
  const getMedColor = (id) => medications.find(m => m.id === id)?.color || 'var(--accent)';

  const severityColors = ['', '#34d399', '#a3e635', '#fbbf24', '#f97316', '#f87171'];

  // Pattern analysis
  const patterns = activeMeds.map(med => {
    const related = sideEffects.filter(se => se.linkedMeds.includes(med.id));
    return { med, count: related.length, effects: related };
  }).filter(p => p.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 className="page-title">Side Effects Tracker</h2>
          <p className="page-subtitle">{sideEffects.length} total entries — track patterns over time</p>
        </div>
        <button id="log-symptom-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Log Symptom
        </button>
      </div>

      <div className="content-grid main-side">
        {/* Side Effect Log */}
        <div>
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">📋 Symptom Log</span>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sideEffects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No symptoms logged yet. Click "Log Symptom" to start tracking.
                </div>
              ) : sideEffects.map((se, i) => (
                <div key={se.id} className={`card animate-fade-up delay-${(i % 4) + 1}`} style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 800,
                          color: severityColors[se.severity] || 'var(--accent)',
                          background: `${severityColors[se.severity] || 'var(--accent)'}20`,
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                        }}>
                          Severity {se.severity}/5
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{se.date}</span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{se.symptom}</div>
                      {se.linkedMeds.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          {se.linkedMeds.map(mid => (
                            <span key={mid} className="badge" style={{ background: `${getMedColor(mid)}20`, color: getMedColor(mid) }}>
                              💊 {getMedName(mid)}
                            </span>
                          ))}
                        </div>
                      )}
                      {se.notes && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {se.notes}
                        </p>
                      )}
                    </div>
                    <button
                      id={`delete-se-${se.id}`}
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => handleDelete(se.id)}
                      title="Remove entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Analysis */}
        <div>
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">🔍 Pattern Analysis</span>
            </div>
            <div className="section-card-body">
              {patterns.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Log more symptoms to see patterns emerge.
                </p>
              ) : patterns.map((p, i) => (
                <div key={p.med.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < patterns.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: p.med.color }}>{p.med.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.count} reports</span>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '6px' }}>
                    <div style={{ height: '100%', background: p.med.color, width: `${Math.min((p.count / sideEffects.length) * 100, 100)}%`, borderRadius: 'var(--radius-sm)', transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[...new Set(p.effects.map(e => e.symptom))].map(sym => (
                      <span key={sym} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{sym}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Summary */}
          <div className="section-card" style={{ marginTop: '16px' }}>
            <div className="section-card-header">
              <span className="section-card-title">📊 Severity Summary</span>
            </div>
            <div className="section-card-body">
              {[5, 4, 3, 2, 1].map(sev => {
                const count = sideEffects.filter(s => s.severity === sev).length;
                return (
                  <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <SeverityLabel val={sev} />
                    <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', height: '6px' }}>
                      <div style={{
                        height: '100%', background: severityColors[sev],
                        width: `${sideEffects.length ? (count / sideEffects.length) * 100 : 0}%`,
                        borderRadius: 'var(--radius-full)', transition: 'width 1s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '20px', textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📝 Log Symptom</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="se-date">Date</label>
                  <input id="se-date" className="input" type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="se-symptom">Symptom</label>
                  <select id="se-symptom" className="select" value={form.symptom} onChange={e => setForm(f => ({...f, symptom: e.target.value}))}>
                    <option value="">Select symptom...</option>
                    {SYMPTOMS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {form.symptom === 'Other' && (
                  <div className="input-group">
                    <label className="input-label" htmlFor="se-custom">Describe Symptom</label>
                    <input id="se-custom" className="input" type="text" placeholder="Describe your symptom..." value={form.customSymptom} onChange={e => setForm(f => ({...f, customSymptom: e.target.value}))} />
                  </div>
                )}
                <div className="input-group">
                  <label className="input-label">Severity: {form.severity}/5 — <SeverityLabel val={form.severity} /></label>
                  <input
                    id="se-severity"
                    type="range" min="1" max="5" value={form.severity}
                    onChange={e => setForm(f => ({...f, severity: Number(e.target.value)}))}
                    style={{ width: '100%', accentColor: severityColors[form.severity] }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>1 - Very Mild</span>
                    <span>5 - Very Severe</span>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Link to Medication(s)</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {activeMeds.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        id={`link-med-${m.id}`}
                        className={`btn btn-sm ${form.linkedMeds.includes(m.id) ? 'btn-primary' : 'btn-outline'}`}
                        style={form.linkedMeds.includes(m.id) ? { background: m.color, borderColor: m.color } : {}}
                        onClick={() => toggleMed(m.id)}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="se-notes">Notes</label>
                  <textarea id="se-notes" className="input" rows={3} placeholder="When did it start? What were you doing?..." value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button id="save-symptom-btn" className="btn btn-primary" onClick={handleSave}>Log Symptom</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideEffects;
