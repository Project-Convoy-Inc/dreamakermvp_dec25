import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VoiceInputButton } from '../VoiceInputButton';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface VisionPromptStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VisionPromptStep({ 
  value, 
  onChange, 
  onNext, 
  onBack 
}: VisionPromptStepProps) {
  const { isRecording, isSupported, startRecording, stopRecording } = useVoiceInput();

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
        <h2 className="text-lg text-muted-foreground mb-2 text-center">
          Let's start unpacking that vision
        </h2>
        
        <h1 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6 text-center">
          What's something you want?
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          This can be a dream, a goal, or something you want to maintain in your life
        </p>

        <div className="relative mb-8">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., Run a half marathon, Become a professional stylist, Strengthen my relationship with my cousin..."
            className="min-h-[120px] text-lg resize-none pr-12"
            rows={4}
          />
          <VoiceInputButton
            isRecording={isRecording}
            isSupported={isSupported}
            onToggle={handleVoiceToggle}
            className="absolute right-2 top-2"
          />
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
