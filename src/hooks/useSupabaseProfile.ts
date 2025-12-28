import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export function useSupabaseProfile() {
  const storeProfile = useUserStore((state) => state.profile);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const userEmail = storeProfile?.email;

  const fetchProfile = async () => {
    if (!userEmail || !supabase) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userEmail]);

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id'>>) => {
    if (!userEmail || !supabase) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('email', userEmail);

      if (error) throw error;
      
      await fetchProfile();
      toast.success('Profile updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
}