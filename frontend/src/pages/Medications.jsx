import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Diabetes', 'Blood Pressure', 'Cholesterol', 'Supplement', 'Other'];
const COLORS = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#f87171', '#60a5fa', '#34d399'];

const emptyForm = {
  name: '', dosage: '', frequency: '', startDate: '', endDate: '',
  doctor: '', category: 'Other', color: '#06b6d4', notes: '', active: true,
};

const Medications = () => {
  const { medications, setMedications, addToast } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = medications.filter(m => {
    const matchCat = filter === 'All' || m.category === filter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.doctor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (med) => {
    setForm({ ...med });
    setEditingId(med.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { addToast('Please enter a medication name.', 'error'); return; }
    if (!form.dosage.trim()) { addToast('Please enter dosage.', 'error'); return; }

    if (editingId) {
      setMedications(prev => prev.map(m => m.id === editingId ? { ...form, id: editingId } : m));
      addToast(`${form.name} updated successfully!`, 'success');
    } else {
      const newMed = { ...form, id: Date.now() };
      setMedications(prev => [...prev, newMed]);
      addToast(`${form.name} added to your cabinet!`, 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const med = medications.find(m => m.id === id);
    setMedications(prev => prev.filter(m => m.id !== id));
    setDeleteId(null);
    addToast(`${med?.name} removed.`, 'warning');
  };

  const toggleActive = (id) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Once weekly', 'As needed'];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 className="page-title">My Medications</h2>
          <p className="page-subtitle">{medications.filter(m => m.active).length} active · {medications.filter(m => !m.active).length} inactive</p>
        </div>
        <button id="add-medication-btn" className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Medication
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="nav-search" style={{ width: '100%', maxWidth: '300px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              id="med-search-input"
              className="nav-search-input"
              type="text"
              placeholder="Search medications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💊</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>No medications found</div>
          <div style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try a different filter or add a new medication</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map((med, i) => (
            <div key={med.id} className={`card animate-fade-up delay-${(i % 4) + 1}`} style={{ borderLeft: `3px solid ${med.color}`, opacity: med.active ? 1 : 0.65 }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: med.color }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{med.name}</h3>
                  </div>
                  <span className="badge badge-primary" style={{ marginTop: '6px', background: `${med.color}20`, color: med.color }}>
                    {med.category}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    id={`edit-med-${med.id}`}
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => openEdit(med)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    id={`delete-med-${med.id}`}
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => setDeleteId(med.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Dosage</span>
                  <span style={{ fontWeight: 600 }}>{med.dosage}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Frequency</span>
                  <span style={{ fontWeight: 600 }}>{med.frequency}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Doctor</span>
                  <span style={{ fontWeight: 600 }}>{med.doctor}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Since</span>
                  <span style={{ fontWeight: 600 }}>{med.startDate || '—'}</span>
                </div>
              </div>

              {med.notes && (
                <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  📝 {med.notes}
                </div>
              )}

              {/* Toggle Active */}
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {med.active ? '✅ Active' : '⏸️ Inactive'}
                </span>
                <button
                  id={`toggle-med-${med.id}`}
                  className={`btn btn-sm ${med.active ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => toggleActive(med.id)}
                >
                  {med.active ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? '✏️ Edit Medication' : '➕ Add Medication'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label" htmlFor="form-name">Medication Name *</label>
                  <input id="form-name" className="input" type="text" placeholder="e.g. Metformin" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="form-dosage">Dosage *</label>
                  <input id="form-dosage" className="input" type="text" placeholder="e.g. 500mg" value={form.dosage} onChange={e => setForm(f => ({...f, dosage: e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="form-frequency">Frequency</label>
                  <select id="form-frequency" className="select" value={form.frequency} onChange={e => setForm(f => ({...f, frequency: e.target.value}))}>
                    <option value="">Select frequency</option>
                    {FREQUENCIES.map(fr => <option key={fr} value={fr}>{fr}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="form-startdate">Start Date</label>
                  <input id="form-startdate" className="input" type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="form-enddate">End Date (optional)</label>
                  <input id="form-enddate" className="input" type="date" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="form-doctor">Prescribing Doctor</label>
                  <input id="form-doctor" className="input" type="text" placeholder="e.g. Dr. Smith" value={form.doctor} onChange={e => setForm(f => ({...f, doctor: e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="form-category">Category</label>
                  <select id="form-category" className="select" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                    {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Color Label</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%', background: c,
                          border: form.color === c ? '3px solid white' : '2px solid transparent',
                          cursor: 'pointer', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                          transition: 'all 0.15s',
                        }}
                        onClick={() => setForm(f => ({...f, color: c}))}
                      />
                    ))}
                  </div>
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label" htmlFor="form-notes">Notes</label>
                  <textarea id="form-notes" className="input" rows={3} placeholder="Any special instructions or notes..." value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button id="save-medication-btn" className="btn btn-primary" onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Add Medication'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">🗑️ Remove Medication</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{medications.find(m => m.id === deleteId)?.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button id="confirm-delete-btn" className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;
