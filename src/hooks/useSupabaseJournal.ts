import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry, JournalCategory } from '@/types/journal';
import { useUserStore } from '@/stores/userStore';

export function useSupabaseJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useUserStore();
  const userEmail = profile?.email;

  const fetchEntries = async () => {
    if (!userEmail || !supabase) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get the user's profile to get the user_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();

      if (!profile) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journal entries:', error);
        setEntries([]);
      } else {
        setEntries(
          (data || []).map((entry) => ({
            id: entry.id,
            userId: entry.user_id,
            title: entry.title,
            content: entry.content || '',
            category: entry.category as JournalCategory,
            dreamId: entry.dream_id || undefined,
            imageUrl: entry.image_url || undefined,
            isAutomatic: entry.is_automatic,
            createdAt: new Date(entry.created_at),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [userEmail]);

  const addEntry = async (
    entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'isAutomatic'>
  ): Promise<string | null> => {
    if (!userEmail || !supabase) return null;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();

      if (!profile) return null;

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: profile.id,
          title: entry.title,
          content: entry.content,
          category: entry.category,
          dream_id: entry.dreamId || null,
          image_url: entry.imageUrl || null,
          is_automatic: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding journal entry:', error);
        return null;
      }

      await fetchEntries();
      return data.id;
    } catch (error) {
      console.error('Error adding journal entry:', error);
      return null;
    }
  };

  const updateEntry = async (
    id: string,
    updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>
  ) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          dream_id: updates.dreamId || null,
          image_url: updates.imageUrl || null,
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating journal entry:', error);
        return;
      }

      await fetchEntries();
    } catch (error) {
      console.error('Error updating journal entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting journal entry:', error);
        return;
      }

      await fetchEntries();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
}
