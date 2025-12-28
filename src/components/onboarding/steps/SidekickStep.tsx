import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { AVATAR_OPTIONS } from '@/types/onboarding';
import { cn } from '@/lib/utils';

interface SidekickStepProps {
  selectedAvatar: number | null;
  onSelectAvatar: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SidekickStep({ 
  selectedAvatar, 
  onSelectAvatar, 
  onNext, 
  onBack 
}: SidekickStepProps) {
  // Mock user name - in real app would come from auth
  const userName = "there";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Hi {userName}, I'm your sidekick.
        </h1>

        <p className="text-lg text-muted-foreground mb-10">
          I'm here to help you build your vision, celebrate your wins, and support you every step of the way.
        </p>

        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-4">Choose your sidekick avatar</p>
          <div className="flex flex-wrap justify-center gap-4">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => onSelectAvatar(avatar.id)}
                className={cn(
                  "w-20 h-20 text-4xl rounded-2xl border-2 transition-all duration-200 flex items-center justify-center",
                  selectedAvatar === avatar.id
                    ? "border-primary bg-primary/10 scale-110 shadow-glow"
                    : "border-border bg-card hover:border-primary/50 hover:scale-105"
                )}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button size="lg" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
