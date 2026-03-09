import { Link, useNavigate } from 'react-router-dom';
import { Guitar, LogOut, User, LayoutDashboard, Mail, CreditCard } from 'lucide-react';
import type { User as AuthUser } from '@supabase/supabase-js';

interface NavbarProps {
  user: AuthUser | null;
  onSignOut: () => Promise<{ error: unknown }>;
}

export function Navbar({ user, onSignOut }: NavbarProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await onSignOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
        <Guitar size={24} />
        <span>Backstage AI</span>
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/outreach" className="nav-link">
              <Mail size={18} />
              <span>Outreach</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <User size={18} />
              <span>Profile</span>
            </Link>
            <Link to="/pricing" className="nav-link">
              <CreditCard size={18} />
              <span>Pricing</span>
            </Link>
            <button onClick={handleSignOut} className="nav-link btn-ghost">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
