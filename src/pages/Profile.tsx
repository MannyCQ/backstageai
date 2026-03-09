import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User } from 'lucide-react';
import type { Profile as ProfileType } from '../types';

interface ProfileProps {
  profile: ProfileType | null;
  loading: boolean;
  onUpdate: (updates: Partial<ProfileType>) => Promise<{ error: unknown }>;
}

export function Profile({ profile, loading, onUpdate }: ProfileProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    artist_name: profile?.artist_name || '',
    genre: profile?.genre || '',
    area: profile?.area || '',
    similar_artists: profile?.similar_artists || '',
    bio: profile?.bio || '',
    spotify_url: profile?.spotify_url || '',
    soundcloud_url: profile?.soundcloud_url || '',
    instagram_url: profile?.instagram_url || '',
    website_url: profile?.website_url || '',
  });

  // Update form when profile loads
  if (profile && !form.artist_name && profile.artist_name) {
    setForm({
      artist_name: profile.artist_name || '',
      genre: profile.genre || '',
      area: profile.area || '',
      similar_artists: profile.similar_artists || '',
      bio: profile.bio || '',
      spotify_url: profile.spotify_url || '',
      soundcloud_url: profile.soundcloud_url || '',
      instagram_url: profile.instagram_url || '',
      website_url: profile.website_url || '',
    });
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const isOnboarding = !profile?.onboarding_complete;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const updates = {
      ...form,
      onboarding_complete: true,
    };

    const { error } = await onUpdate(updates);
    if (error) {
      setError((error as Error).message);
    } else {
      setSuccess('Profile saved!');
      if (isOnboarding) {
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    }
    setSaving(false);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{isOnboarding ? 'Set Up Your Profile' : 'Edit Profile'}</h1>
          <p className="text-muted">
            {isOnboarding
              ? 'Tell us about your music so we can find the best venues for you.'
              : 'Update your artist information.'}
          </p>
        </div>
        <User size={32} />
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-section">
          <h3>Artist Info</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="artist_name">Artist / Band Name *</label>
              <input
                id="artist_name"
                type="text"
                value={form.artist_name}
                onChange={(e) => updateField('artist_name', e.target.value)}
                placeholder="Your artist or band name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="genre">Genre *</label>
              <input
                id="genre"
                type="text"
                value={form.genre}
                onChange={(e) => updateField('genre', e.target.value)}
                placeholder="e.g. Indie Rock, Jazz, Hip Hop"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="area">Location / Area *</label>
              <input
                id="area"
                type="text"
                value={form.area}
                onChange={(e) => updateField('area', e.target.value)}
                placeholder="e.g. London, NYC, Austin TX"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="similar_artists">Similar Artists</label>
              <input
                id="similar_artists"
                type="text"
                value={form.similar_artists}
                onChange={(e) => updateField('similar_artists', e.target.value)}
                placeholder="e.g. Arctic Monkeys, The Strokes"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell venues about your sound, your story, and what makes your live show special..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Links</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="spotify_url">Spotify</label>
              <input
                id="spotify_url"
                type="url"
                value={form.spotify_url}
                onChange={(e) => updateField('spotify_url', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="soundcloud_url">SoundCloud</label>
              <input
                id="soundcloud_url"
                type="url"
                value={form.soundcloud_url}
                onChange={(e) => updateField('soundcloud_url', e.target.value)}
                placeholder="https://soundcloud.com/..."
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="instagram_url">Instagram</label>
              <input
                id="instagram_url"
                type="url"
                value={form.instagram_url}
                onChange={(e) => updateField('instagram_url', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="website_url">Website</label>
              <input
                id="website_url"
                type="url"
                value={form.website_url}
                onChange={(e) => updateField('website_url', e.target.value)}
                placeholder="https://yourband.com"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : isOnboarding ? 'Complete Setup' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
