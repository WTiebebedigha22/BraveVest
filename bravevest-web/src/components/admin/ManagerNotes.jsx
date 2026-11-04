import { useState } from 'react';
import { Save, Lock, Unlock } from 'lucide-react';
import { api } from '@/api/client';

export default function ManagerNotes({ requestId, initialNotes, readOnly = false }) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/api/funding/requests/${requestId}/notes`, { managerNotes: notes || null });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert('Failed to save notes');
    } finally { setSaving(false); }
  }

  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="data-label">Manager's Note</span>
          {!editing && <Lock size={12} color="var(--bybit-text-dim)" />}
          {saved && <span style={{ fontSize: '11px', color: 'var(--bybit-green)' }}>Saved</span>}
        </div>
        {!readOnly && !editing && (
          <button onClick={() => setEditing(true)} className="btn btn--ghost btn--sm"><Unlock size={12} /> Edit</button>
        )}
      </div>
      {editing ? (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add a note visible to the investor..."
            style={{ marginBottom: '8px', fontSize: '13px' }}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setEditing(false); setNotes(initialNotes || ''); }} className="btn btn--ghost btn--sm">Cancel</button>
            <button onClick={save} disabled={saving} className="btn btn--primary btn--sm"><Save size={12} /> {saving ? 'Saving…' : 'Save'}</button>
          </div>
        </>
      ) : (
        <p style={{ fontSize: '13px', color: notes ? 'var(--bybit-text)' : 'var(--bybit-text-muted)', fontStyle: notes ? 'normal' : 'italic', lineHeight: '1.6' }}>
          {notes || 'No note has been written for this opportunity yet.'}
        </p>
      )}
    </div>
  );
}
