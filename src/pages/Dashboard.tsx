import { Link } from 'react-router-dom';
import { Mail, MapPin, Music, ArrowRight, Send, CheckCircle, MessageSquare, XCircle } from 'lucide-react';
import type { Profile, Outreach } from '../types';
import { PLAN_LIMITS, PLAN_LABELS } from '../types';

interface DashboardProps {
  profile: Profile | null;
  outreach: Outreach[];
  loading: boolean;
}

export function Dashboard({ profile, outreach, loading }: DashboardProps) {
  if (loading || !profile) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!profile.onboarding_complete) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <Music size={48} />
          <h2>Welcome to Backstage AI!</h2>
          <p>Complete your profile to start getting venue matches and booking gigs.</p>
          <Link to="/profile" className="btn btn-primary">
            Set Up Profile <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const limits = PLAN_LIMITS[profile.plan];
  const emailUsage = limits.emails_per_month === -1
    ? null
    : `${profile.emails_sent_this_month} / ${limits.emails_per_month}`;
  const matchUsage = limits.venue_matches === -1
    ? null
    : `${profile.venue_matches_used} / ${limits.venue_matches}`;

  const statusCounts = {
    sent: outreach.filter(o => o.status === 'sent').length,
    replied: outreach.filter(o => o.status === 'replied').length,
    booked: outreach.filter(o => o.status === 'booked').length,
    no_response: outreach.filter(o => o.status === 'no_response').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Welcome back, {profile.artist_name || 'Artist'}</h1>
          <p className="text-muted">
            {PLAN_LABELS[profile.plan]} Plan • {profile.genre || 'No genre set'} • {profile.area || 'No location set'}
          </p>
        </div>
        <Link to="/outreach" className="btn btn-primary">
          <Mail size={18} /> New Outreach
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sent"><Send size={20} /></div>
          <div className="stat-value">{statusCounts.sent}</div>
          <div className="stat-label">Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon replied"><MessageSquare size={20} /></div>
          <div className="stat-value">{statusCounts.replied}</div>
          <div className="stat-label">Replied</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon booked"><CheckCircle size={20} /></div>
          <div className="stat-value">{statusCounts.booked}</div>
          <div className="stat-label">Booked</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon no-response"><XCircle size={20} /></div>
          <div className="stat-value">{statusCounts.no_response}</div>
          <div className="stat-label">No Response</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Usage This Month</h3>
          <div className="usage-list">
            <div className="usage-item">
              <span>Emails Sent</span>
              <span className="usage-value">{emailUsage ?? 'Unlimited'}</span>
            </div>
            <div className="usage-item">
              <span>Venue Matches</span>
              <span className="usage-value">{matchUsage ?? 'Unlimited'}</span>
            </div>
          </div>
          {profile.plan === 'free' && (
            <Link to="/pricing" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
              Upgrade Plan
            </Link>
          )}
        </div>

        <div className="card">
          <h3>Recent Outreach</h3>
          {outreach.length === 0 ? (
            <p className="text-muted">No outreach yet. Start reaching out to venues!</p>
          ) : (
            <div className="outreach-list-mini">
              {outreach.slice(0, 5).map(o => (
                <div key={o.id} className="outreach-item-mini">
                  <div>
                    <MapPin size={14} />
                    <strong>{o.venue_name}</strong>
                  </div>
                  <span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/outreach" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
