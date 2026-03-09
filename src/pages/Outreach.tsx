import { useState, type FormEvent } from 'react';
import { Mail, Plus, Trash2, Edit3, X, Send, MapPin } from 'lucide-react';
import type { Outreach as OutreachType } from '../types';

interface OutreachProps {
  outreach: OutreachType[];
  loading: boolean;
  onAdd: (entry: Partial<OutreachType>) => Promise<{ error: unknown }>;
  onUpdate: (id: string, updates: Partial<OutreachType>) => Promise<{ error: unknown }>;
  onDelete: (id: string) => Promise<{ error: unknown }>;
}

export function Outreach({ outreach, loading, onAdd, onUpdate, onDelete }: OutreachProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    venue_name: '',
    venue_email: '',
    subject: '',
    body: '',
    status: 'sent' as OutreachType['status'],
    notes: '',
  });

  const resetForm = () => {
    setForm({ venue_name: '', venue_email: '', subject: '', body: '', status: 'sent', notes: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const startEdit = (entry: OutreachType) => {
    setForm({
      venue_name: entry.venue_name,
      venue_email: entry.venue_email || '',
      subject: entry.subject || '',
      body: entry.body || '',
      status: entry.status,
      notes: entry.notes || '',
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (editingId) {
      const { error } = await onUpdate(editingId, form);
      if (error) { setError((error as Error).message); return; }
    } else {
      const { error } = await onAdd(form);
      if (error) { setError((error as Error).message); return; }
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this outreach entry?')) return;
    await onDelete(id);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Outreach</h1>
          <p className="text-muted">Track your venue outreach and bookings</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn btn-primary">
          <Plus size={18} /> New Outreach
        </button>
      </div>

      {showForm && (
        <div className="card outreach-form-card">
          <div className="card-header">
            <h3>{editingId ? 'Edit Outreach' : 'New Outreach'}</h3>
            <button onClick={resetForm} className="btn-ghost"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="venue_name">Venue Name *</label>
                <input
                  id="venue_name"
                  type="text"
                  value={form.venue_name}
                  onChange={(e) => setForm(f => ({ ...f, venue_name: e.target.value }))}
                  placeholder="The Blue Note"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="venue_email">Venue Email</label>
                <input
                  id="venue_email"
                  type="email"
                  value={form.venue_email}
                  onChange={(e) => setForm(f => ({ ...f, venue_email: e.target.value }))}
                  placeholder="bookings@venue.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Booking Inquiry — Your Band Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="body">Email Body</label>
              <textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Write your booking email..."
                rows={6}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value as OutreachType['status'] }))}
                >
                  <option value="sent">Sent</option>
                  <option value="replied">Replied</option>
                  <option value="booked">Booked</option>
                  <option value="no_response">No Response</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <input
                  id="notes"
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any notes..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} /> {editingId ? 'Update' : 'Save Outreach'}
              </button>
            </div>
          </form>
        </div>
      )}

      {outreach.length === 0 ? (
        <div className="empty-state">
          <Mail size={48} />
          <h2>No outreach yet</h2>
          <p>Start reaching out to venues to book gigs!</p>
        </div>
      ) : (
        <div className="outreach-table">
          <div className="table-header">
            <span>Venue</span>
            <span>Subject</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {outreach.map(entry => (
            <div key={entry.id} className="table-row">
              <div className="venue-cell">
                <MapPin size={14} />
                <div>
                  <strong>{entry.venue_name}</strong>
                  {entry.venue_email && <small>{entry.venue_email}</small>}
                </div>
              </div>
              <span className="subject-cell">{entry.subject || '—'}</span>
              <span><span className={`badge badge-${entry.status}`}>{entry.status.replace('_', ' ')}</span></span>
              <span className="date-cell">{new Date(entry.sent_at).toLocaleDateString()}</span>
              <div className="actions-cell">
                <button onClick={() => startEdit(entry)} className="btn-icon" title="Edit">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(entry.id)} className="btn-icon btn-danger" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
