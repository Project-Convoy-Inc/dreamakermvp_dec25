import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/stores/userStore';
import { Dream, DreamStep, TimeFrame, Domain, Partner } from '@/types/dream';
import { toast } from 'sonner';

export function useSupabaseDreams() {
  const profile = useUserStore((state) => state.profile);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  // Use email as a simple user identifier since we don't have auth
  const userEmail = profile?.email;

  // Fetch dreams with steps and partners
  const fetchDreams = async () => {
    if (!userEmail || !supabase) {
      setDreams([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch dreams by user email (stored in user_id field for now)
      const { data: dreamsData, error: dreamsError } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', userEmail)
        .order('created_at', { ascending: false });

      if (dreamsError) throw dreamsError;

      // Fetch steps for all dreams
      const { data: stepsData, error: stepsError } = await supabase
        .from('dream_steps')
        .select('*')
        .in('dream_id', dreamsData?.map(d => d.id) || [])
        .order('step_order', { ascending: true });

      if (stepsError) throw stepsError;

      // Fetch dream_partners relations
      const { data: dreamPartnersData, error: dpError } = await supabase
        .from('dream_partners')
        .select('dream_id, partner_id')
        .in('dream_id', dreamsData?.map(d => d.id) || []);

      if (dpError) throw dpError;

      // Fetch partners
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userEmail);

      if (partnersError) throw partnersError;

      // Map data to Dream type
      const mappedDreams: Dream[] = (dreamsData || []).map(dream => {
        const dreamSteps: DreamStep[] = (stepsData || [])
          .filter(s => s.dream_id === dream.id)
          .map(s => ({
            id: s.id,
            title: s.title,
            completed: s.completed || false,
            order: s.step_order,
          }));

        const partnerIds = (dreamPartnersData || [])
          .filter(dp => dp.dream_id === dream.id)
          .map(dp => dp.partner_id);

        const dreamPartners: Partner[] = (partnersData || [])
          .filter(p => partnerIds.includes(p.id))
          .map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            avatar: p.avatar_url || undefined,
          }));

        return {
          id: dream.id,
          title: dream.title,
          description: dream.description || undefined,
          timeFrame: dream.time_frame as TimeFrame,
          domain: dream.domain as Domain,
          progress: dream.progress || 0,
          targetDate: dream.target_date || undefined,
          imageUrl: dream.image_url || undefined,
          steps: dreamSteps,
          partners: dreamPartners,
          createdAt: dream.created_at,
          updatedAt: dream.updated_at,
        };
      });

      setDreams(mappedDreams);
    } catch (error) {
      console.error('Error fetching dreams:', error);
      toast.error('Failed to load dreams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, [userEmail]);

  // Add a new dream
  const addDream = async (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'steps' | 'partners' | 'progress'>): Promise<string | null> => {
    if (!userEmail || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('dreams')
        .insert({
          user_id: userEmail,
          title: dream.title,
          description: dream.description || null,
          time_frame: dream.timeFrame,
          domain: dream.domain,
          target_date: dream.targetDate || null,
          image_url: dream.imageUrl || null,
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchDreams();
      return data.id;
    } catch (error) {
      console.error('Error adding dream:', error);
      toast.error('Failed to add dream');
      return null;
    }
  };

  // Add dream with steps
  const addDreamWithSteps = async (
    dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'steps' | 'partners' | 'progress'>,
    steps: Array<{ title: string }>
  ): Promise<string | null> => {
    if (!userEmail || !supabase) return null;

    try {
      const { data: dreamData, error: dreamError } = await supabase
        .from('dreams')
        .insert({
          user_id: userEmail,
          title: dream.title,
          description: dream.description || null,
          time_frame: dream.timeFrame,
          domain: dream.domain,
          target_date: dream.targetDate || null,
          image_url: dream.imageUrl || null,
          progress: 0,
        })
        .select()
        .single();

      if (dreamError) throw dreamError;

      if (steps.length > 0) {
        const { error: stepsError } = await supabase
          .from('dream_steps')
          .insert(steps.map((step, index) => ({
            dream_id: dreamData.id,
            title: step.title,
            completed: false,
            step_order: index,
          })));

        if (stepsError) throw stepsError;
      }

      await fetchDreams();
      return dreamData.id;
    } catch (error) {
      console.error('Error adding dream with steps:', error);
      toast.error('Failed to add dream');
      return null;
    }
  };

  // Update a dream
  const updateDream = async (id: string, updates: Partial<Dream>) => {
    if (!userEmail || !supabase) return;

    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.timeFrame !== undefined) dbUpdates.time_frame = updates.timeFrame;
      if (updates.domain !== undefined) dbUpdates.domain = updates.domain;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
      if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

      const { error } = await supabase
        .from('dreams')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Handle partners update
      if (updates.partners !== undefined) {
        // Remove existing partner relations
        await supabase
          .from('dream_partners')
          .delete()
          .eq('dream_id', id);

        // Add new partner relations
        if (updates.partners.length > 0) {
          await supabase
            .from('dream_partners')
            .insert(updates.partners.map(p => ({
              dream_id: id,
              partner_id: p.id,
            })));
        }
      }

      await fetchDreams();
    } catch (error) {
      console.error('Error updating dream:', error);
      toast.error('Failed to update dream');
    }
  };

  // Delete a dream
  const deleteDream = async (id: string) => {
    if (!userEmail || !supabase) return;

    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDreams();
    } catch (error) {
      console.error('Error deleting dream:', error);
      toast.error('Failed to delete dream');
    }
  };

  // Move a dream
  const moveDream = async (id: string, timeFrame: TimeFrame, domain: Domain) => {
    await updateDream(id, { timeFrame, domain });
  };

  // Add a step
  const addStep = async (dreamId: string, step: Omit<DreamStep, 'id' | 'order'>) => {
    if (!userEmail || !supabase) return;

    try {
      const dream = dreams.find(d => d.id === dreamId);
      const order = dream?.steps.length || 0;

      const { error } = await supabase
        .from('dream_steps')
        .insert({
          dream_id: dreamId,
          title: step.title,
          completed: step.completed,
          step_order: order,
        });

      if (error) throw error;
      await fetchDreams();
    } catch (error) {
      console.error('Error adding step:', error);
      toast.error('Failed to add step');
    }
  };

  // Add multiple steps
  const addMultipleSteps = async (dreamId: string, steps: Array<{ title: string }>) => {
    if (!userEmail || !supabase) return;

    try {
      const dream = dreams.find(d => d.id === dreamId);
      const startOrder = dream?.steps.length || 0;

      const { error } = await supabase
        .from('dream_steps')
        .insert(steps.map((step, index) => ({
          dream_id: dreamId,
          title: step.title,
          completed: false,
          step_order: startOrder + index,
        })));

      if (error) throw error;
      await fetchDreams();
    } catch (error) {
      console.error('Error adding steps:', error);
      toast.error('Failed to add steps');
    }
  };

  // Toggle step completion
  const toggleStep = async (dreamId: string, stepId: string) => {
    if (!userEmail || !supabase) return;

    try {
      const dream = dreams.find(d => d.id === dreamId);
      const step = dream?.steps.find(s => s.id === stepId);
      if (!step) return;

      const { error: stepError } = await supabase
        .from('dream_steps')
        .update({ completed: !step.completed })
        .eq('id', stepId);

      if (stepError) throw stepError;

      // Recalculate progress
      const updatedSteps = dream.steps.map(s => 
        s.id === stepId ? { ...s, completed: !s.completed } : s
      );
      const completedCount = updatedSteps.filter(s => s.completed).length;
      const progress = updatedSteps.length > 0 
        ? Math.round((completedCount / updatedSteps.length) * 100)
        : 0;

      const { error: dreamError } = await supabase
        .from('dreams')
        .update({ progress })
        .eq('id', dreamId);

      if (dreamError) throw dreamError;

      await fetchDreams();
    } catch (error) {
      console.error('Error toggling step:', error);
      toast.error('Failed to update step');
    }
  };

  // Get dreams by cell
  const getDreamsByCell = (timeFrame: TimeFrame, domain: Domain) => {
    return dreams.filter(d => d.timeFrame === timeFrame && d.domain === domain);
  };

  // Get dream by ID
  const getDreamById = (id: string) => {
    return dreams.find(d => d.id === id);
  };

  // Remove partner from all dreams
  const removePartnerFromAllDreams = async (partnerId: string) => {
    if (!userEmail || !supabase) return;

    try {
      const { error } = await supabase
        .from('dream_partners')
        .delete()
        .eq('partner_id', partnerId);

      if (error) throw error;
      await fetchDreams();
    } catch (error) {
      console.error('Error removing partner from dreams:', error);
    }
  };

  return {
    dreams,
    loading,
    addDream,
    addDreamWithSteps,
    updateDream,
    deleteDream,
    moveDream,
    addStep,
    addMultipleSteps,
    toggleStep,
    getDreamsByCell,
    getDreamById,
    removePartnerFromAllDreams,
    refetch: fetchDreams,
  };
}