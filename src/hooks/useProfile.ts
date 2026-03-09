import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (!error) await fetchProfile();
    return { error };
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
