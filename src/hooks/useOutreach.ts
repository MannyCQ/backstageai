import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Outreach } from '../types';

export function useOutreach(userId: string | undefined) {
  const [outreach, setOutreach] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutreach = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('outreach')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false });
    setOutreach(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  const addOutreach = async (entry: Partial<Outreach>) => {
    if (!userId) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('outreach')
      .insert({ ...entry, user_id: userId });
    if (!error) await fetchOutreach();
    return { error };
  };

  const updateOutreach = async (id: string, updates: Partial<Outreach>) => {
    const { error } = await supabase
      .from('outreach')
      .update(updates)
      .eq('id', id);
    if (!error) await fetchOutreach();
    return { error };
  };

  const deleteOutreach = async (id: string) => {
    const { error } = await supabase
      .from('outreach')
      .delete()
      .eq('id', id);
    if (!error) await fetchOutreach();
    return { error };
  };

  return { outreach, loading, addOutreach, updateOutreach, deleteOutreach, refetch: fetchOutreach };
}
