import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Reports = () => {
  const { medications, sideEffects, addToast } = useApp();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [reportType, setReportType] = useState('appointment');

  const activeMeds = medications.filter(m => m.active);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      addToast('Report generated successfully! Ready to download.', 'success');
    }, 1800);
  };

  const reportTypes = [
    { id: 'appointment', label: 'Doctor Appointment', icon: '🏥', desc: 'Full medication list with notes for your next appointment' },
    { id: 'pharmacy', label: 'Pharmacy Summary', icon: '💊', desc: 'Current prescriptions formatted for pharmacist review' },
    { id: 'sideeffects', label: 'Side Effects Report', icon: '📋', desc: 'Detailed symptom log with medication correlations' },
    { id: 'emergency', label: 'Emergency Card', icon: '🚨', desc: 'Compact medication card for emergency situations' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Reports & Summaries</h2>
        <p className="page-subtitle">Generate clean, professional reports to share with your healthcare team.</p>
      </div>

      <div className="content-grid main-side">
        {/* Generator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Report Type Selector */}
          <div className="section-card animate-fade-up">
            <div className="section-card-header">
              <span className="section-card-title">📄 Report Type</span>
            </div>
            <div className="section-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {reportTypes.map(rt => (
                <button
                  key={rt.id}
                  id={`report-type-${rt.id}`}
                  onClick={() => setReportType(rt.id)}
                  style={{
                    background: reportType === rt.id ? 'var(--pill-bg)' : 'var(--bg-secondary)',
                    border: `2px solid ${reportType === rt.id ? 'var(--accent)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)', padding: '14px',
                    cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{rt.icon}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: reportType === rt.id ? 'var(--accent)' : 'var(--text-primary)', marginBottom: '3px' }}>
                    {rt.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {rt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="section-card animate-fade-up delay-2">
            <div className="section-card-header">
              <span className="section-card-title">⚙️ Generate Report</span>
            </div>
            <div className="section-card-body">
              <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                This report will include <strong style={{ color: 'var(--text-primary)' }}>{activeMeds.length} active medications</strong> and <strong style={{ color: 'var(--text-primary)' }}>{sideEffects.length} symptom entries</strong>.
              </div>
              <button
                id="generate-report-btn"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                    Generating PDF...
                  </span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Generate {reportTypes.find(r => r.id === reportType)?.label}
                  </>
                )}
              </button>

              {generated && (
                <div style={{
                  marginTop: '14px', padding: '14px', background: 'var(--success-bg)',
                  border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  animation: 'fadeInUp 0.3s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>✅</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)' }}>Report Ready</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generated {today}</div>
                    </div>
                  </div>
                  <button id="download-report-btn" className="btn btn-primary btn-sm" onClick={() => addToast('Download started!', 'info')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="section-card animate-fade-up delay-3" style={{ height: 'fit-content' }}>
            <div className="section-card-header">
              <span className="section-card-title">👁️ Report Preview</span>
              <span className="badge badge-primary">Live Preview</span>
            </div>
            <div className="section-card-body">
              {/* Preview Card */}
              <div style={{
                background: 'white', color: '#1a1a2e', borderRadius: 'var(--radius-md)',
                padding: '20px', fontFamily: 'Inter, sans-serif',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                {/* Report Header */}
                <div style={{ borderBottom: '2px solid #06b6d4', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', marginBottom: '2px' }}>
                        MEDICINE CABINET
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a2e' }}>
                        {reportTypes.find(r => r.id === reportType)?.label || 'Medical Report'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#666' }}>
                      <div style={{ fontWeight: 600 }}>Generated: {today}</div>
                      <div>Patient: John Doe</div>
                    </div>
                  </div>
                </div>

                {/* Medications Section */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.07em', marginBottom: '8px' }}>
                    ACTIVE MEDICATIONS ({activeMeds.length})
                  </div>
                  {activeMeds.slice(0, 4).map((med, i) => (
                    <div key={med.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '6px 0', borderBottom: i < Math.min(activeMeds.length, 4) - 1 ? '1px solid #eee' : 'none',
                      fontSize: '0.72rem',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{med.name}</div>
                        <div style={{ color: '#666', marginTop: '1px' }}>{med.dosage} · {med.frequency}</div>
                      </div>
                      <div style={{ textAlign: 'right', color: '#666' }}>
                        <div>{med.doctor}</div>
                        <div>{med.startDate}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Side Effects Summary */}
                {reportType !== 'pharmacy' && sideEffects.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.07em', marginBottom: '8px' }}>
                      RECENT SYMPTOMS
                    </div>
                    {sideEffects.slice(0, 3).map((se, i) => (
                      <div key={se.id} style={{
                        display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.7rem',
                        borderBottom: i < 2 ? '1px solid #eee' : 'none',
                      }}>
                        <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{se.symptom}</span>
                        <span style={{ color: '#666' }}>Severity {se.severity}/5 · {se.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #eee', fontSize: '0.6rem', color: '#999', textAlign: 'center' }}>
                  Not a substitute for professional medical advice. For informational purposes only.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
