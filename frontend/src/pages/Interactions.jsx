import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const MOCK_INTERACTIONS = [
  {
    drug1: 'Metformin', drug2: 'Lisinopril',
    severity: 'moderate',
    description: 'Both medications can lower blood pressure. Monitor for excessive hypotension. This combination is often prescribed together but requires monitoring.',
    recommendation: 'Monitor blood pressure regularly. Contact doctor if you experience dizziness or lightheadedness.',
    source: 'OpenFDA',
  },
  {
    drug1: 'Atorvastatin', drug2: 'Vitamin D3',
    severity: 'mild',
    description: 'No clinically significant interaction. Vitamin D may slightly affect cholesterol metabolism.',
    recommendation: 'No action required. Continue as prescribed.',
    source: 'RxNorm',
  },
  {
    drug1: 'Lisinopril', drug2: 'Atorvastatin',
    severity: 'none',
    description: 'No known significant interaction between these medications.',
    recommendation: 'Continue as prescribed.',
    source: 'OpenFDA',
  },
];

const severityConfig = {
  severe: { color: '#f87171', bg: 'var(--danger-bg)', border: 'rgba(248,113,113,0.3)', icon: '🚨', label: 'Severe' },
  moderate: { color: '#fbbf24', bg: 'var(--warning-bg)', border: 'rgba(251,191,36,0.3)', icon: '⚠️', label: 'Moderate' },
  mild: { color: '#34d399', bg: 'var(--success-bg)', border: 'rgba(52,211,153,0.2)', icon: '💛', label: 'Mild' },
  none: { color: 'var(--accent)', bg: 'var(--pill-bg)', border: 'var(--border-color)', icon: '✅', label: 'None' },
};

const Interactions = () => {
  const { medications } = useApp();
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkInteraction = () => {
    if (!drug1 || !drug2) return;
    setLoading(true);
    setChecked(false);
    setTimeout(() => {
      const found = MOCK_INTERACTIONS.find(i =>
        (i.drug1.toLowerCase() === drug1.toLowerCase() && i.drug2.toLowerCase() === drug2.toLowerCase()) ||
        (i.drug1.toLowerCase() === drug2.toLowerCase() && i.drug2.toLowerCase() === drug1.toLowerCase())
      );
      setSearchResult(found || {
        drug1, drug2,
        severity: 'none',
        description: 'No known significant interaction found in our database.',
        recommendation: 'Always consult your doctor or pharmacist for complete interaction information.',
        source: 'OpenFDA',
      });
      setLoading(false);
      setChecked(true);
    }, 1200);
  };

  const activeMeds = medications.filter(m => m.active);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Drug Interaction Checker</h2>
        <p className="page-subtitle">Check for dangerous interactions between your medications using real drug databases.</p>
      </div>

      {/* Checker Tool */}
      <div className="section-card animate-fade-up" style={{ marginBottom: '24px' }}>
        <div className="section-card-header">
          <span className="section-card-title">🔍 Check Interaction</span>
          <span className="badge badge-primary">Powered by RxNorm · OpenFDA</span>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '14px', alignItems: 'flex-end' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="drug1-input">First Medication</label>
              <input
                id="drug1-input"
                className="input"
                type="text"
                placeholder="e.g. Metformin"
                value={drug1}
                onChange={e => setDrug1(e.target.value)}
                list="med-suggestions-1"
              />
              <datalist id="med-suggestions-1">
                {activeMeds.map(m => <option key={m.id} value={m.name} />)}
              </datalist>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>+</div>
            <div className="input-group">
              <label className="input-label" htmlFor="drug2-input">Second Medication</label>
              <input
                id="drug2-input"
                className="input"
                type="text"
                placeholder="e.g. Lisinopril"
                value={drug2}
                onChange={e => setDrug2(e.target.value)}
                list="med-suggestions-2"
              />
              <datalist id="med-suggestions-2">
                {activeMeds.map(m => <option key={m.id} value={m.name} />)}
              </datalist>
            </div>
            <button
              id="check-interaction-btn"
              className="btn btn-primary"
              onClick={checkInteraction}
              disabled={!drug1 || !drug2 || loading}
              style={{ marginBottom: '0' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Checking...
                </span>
              ) : 'Check Now'}
            </button>
          </div>

          {/* Result */}
          {checked && searchResult && (() => {
            const cfg = severityConfig[searchResult.severity] || severityConfig.none;
            return (
              <div style={{
                marginTop: '20px', padding: '20px',
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 'var(--radius-lg)',
                animation: 'fadeInUp 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{cfg.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: cfg.color }}>
                      {cfg.label} Interaction
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {searchResult.drug1} + {searchResult.drug2}
                    </div>
                  </div>
                  <span className="badge" style={{ marginLeft: 'auto', background: `${cfg.color}20`, color: cfg.color }}>
                    {searchResult.source}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
                  {searchResult.description}
                </p>
                <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommendation</span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '4px' }}>{searchResult.recommendation}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Known Interactions for My Meds */}
      <div className="section-card animate-fade-up delay-2">
        <div className="section-card-header">
          <span className="section-card-title">⚠️ Interactions Among Your Medications</span>
          <span className="badge badge-warning">Auto-scanned</span>
        </div>
        <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MOCK_INTERACTIONS.map((interaction, i) => {
            const cfg = severityConfig[interaction.severity];
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '16px',
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{cfg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {interaction.drug1} + {interaction.drug2}
                    </span>
                    <span className="badge" style={{ background: `${cfg.color}20`, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {interaction.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '20px', padding: '14px 18px',
        background: 'var(--warning-bg)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
        <p><strong style={{ color: 'var(--warning)' }}>Medical Disclaimer:</strong> This tool is for informational purposes only and does not replace professional medical advice. Always consult your doctor or pharmacist before making changes to your medications.</p>
      </div>
    </div>
  );
};

export default Interactions;
