import { Link } from 'react-router-dom';
import { Guitar, Mail, BarChart3, Zap, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-badge">
          <Zap size={14} />
          AI-Powered Booking for Musicians
        </div>
        <h1>
          Get More Gigs.<br />
          <span className="text-gradient">Less Hustle.</span>
        </h1>
        <p className="hero-subtitle">
          Backstage AI matches you with the right venues and writes personalized
          outreach emails — so you can focus on making music.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start Free <ArrowRight size={18} />
          </Link>
          <Link to="/pricing" className="btn btn-outline btn-lg">
            View Pricing
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Everything you need to book gigs</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Guitar size={28} />
            </div>
            <h3>Smart Venue Matching</h3>
            <p>
              AI analyzes your genre, style, and location to find venues that are
              the perfect fit for your sound.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Mail size={28} />
            </div>
            <h3>Auto-Written Emails</h3>
            <p>
              Professional, personalized booking emails generated from your profile
              — ready to send in one click.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={28} />
            </div>
            <h3>Track Your Outreach</h3>
            <p>
              Monitor sent emails, replies, and confirmed bookings all in one
              dashboard. Never lose track of a lead.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to fill your calendar?</h2>
        <p>Join musicians who are landing more gigs with less effort.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">
          Get Started Free <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
