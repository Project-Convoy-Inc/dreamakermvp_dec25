import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/stores/userStore';
import { Partner } from '@/types/dream';
import { toast } from 'sonner';

export function useSupabasePartners() {
  const profile = useUserStore((state) => state.profile);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const userEmail = profile?.email;

  const fetchPartners = async () => {
    if (!userEmail || !supabase) {
      setPartners([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedPartners: Partner[] = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        avatar: p.avatar_url || undefined,
      }));

      setPartners(mappedPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [userEmail]);

  const addPartner = async (partner: Omit<Partner, 'id'>): Promise<string | null> => {
    if (!userEmail || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('partners')
        .insert({
          user_id: userEmail,
          name: partner.name,
          email: partner.email,
          avatar_url: partner.avatar || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchPartners();
      return data.id;
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error('Failed to add partner');
      return null;
    }
  };

  const removePartner = async (id: string) => {
    if (!userEmail || !supabase) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPartners();
    } catch (error) {
      console.error('Error removing partner:', error);
      toast.error('Failed to remove partner');
    }
  };

  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    if (!userEmail || !supabase) return;

    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

      const { error } = await supabase
        .from('partners')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      await fetchPartners();
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner');
    }
  };

  return {
    partners,
    loading,
    addPartner,
    removePartner,
    updatePartner,
    refetch: fetchPartners,
  };
}