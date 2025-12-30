import { useState } from 'react';

interface GeneratedContent {
  title: string;
  milestones: Array<{ title: string; estimate: string }>;
  roadmapSteps: Array<{ title: string }>;
}

interface UseGenerateDreamContentReturn {
  generateContent: (description: string, domain: string, timeFrame: string) => Promise<GeneratedContent | null>;
  isGenerating: boolean;
  error: string | null;
}

export function useGenerateDreamContent(): UseGenerateDreamContentReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (
    description: string,
    domain: string,
    timeFrame: string
  ): Promise<GeneratedContent | null> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      setError('Supabase URL not configured');
      return null;
    }

    if (!supabaseAnonKey) {
      setError('Supabase anon key not configured');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-dream-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ description, domain, timeFrame }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data: GeneratedContent = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error generating dream content:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateContent, isGenerating, error };
}
