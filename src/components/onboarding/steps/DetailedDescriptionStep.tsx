import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VoiceInputButton } from '@/components/onboarding/VoiceInputButton';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { ROTATING_PROMPTS } from '@/types/onboarding';

interface DetailedDescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DetailedDescriptionStep({ 
  value, 
  onChange, 
  onNext, 
  onBack 
}: DetailedDescriptionStepProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const { isRecording, isSupported, startRecording, stopRecording } = useVoiceInput();

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording((text) => {
        onChange(value + (value ? ' ' : '') + text);
      });
    }
  };

  const isValid = value.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
          Describe what you saw
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          With as much detail as humanly possible, so we can bring that vision to life
        </p>

        <div className="relative mb-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe your vision in detail..."
            className="min-h-[200px] text-lg resize-none pr-12"
            rows={8}
          />
          <VoiceInputButton
            isRecording={isRecording}
            isSupported={isSupported}
            onToggle={handleVoiceToggle}
            className="absolute right-2 top-2"
          />
        </div>

        {/* Rotating prompts */}
        <div className="h-8 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={promptIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-primary italic"
            >
              {ROTATING_PROMPTS[promptIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button size="lg" onClick={onNext} disabled={!isValid}>
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
