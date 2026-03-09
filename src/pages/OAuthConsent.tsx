import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Guitar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface OAuthConsentProps {
  user: User | null;
}

export function OAuthConsent({ user }: OAuthConsentProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase returns tokens in the URL hash after OAuth redirect.
    // The supabase client auto-picks them up via onAuthStateChange,
    // so we just wait for the user to be set and redirect.
    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Also try to exchange the hash params explicitly
    const hash = window.location.hash;
    if (hash) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/dashboard', { replace: true });
        }
      });
    }

    // Fallback: if nothing happens after 5s, send to login
    const timeout = setTimeout(() => {
      if (!user) {
        navigate('/login', { replace: true });
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Guitar size={32} />
          <h1>Signing you in...</h1>
          <p>Completing authentication, one moment.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
          <div className="spinner" />
        </div>
      </div>
    </div>
  );
}
