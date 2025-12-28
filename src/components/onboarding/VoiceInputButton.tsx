import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  isRecording: boolean;
  isSupported: boolean;
  onToggle: () => void;
  className?: string;
}

export function VoiceInputButton({ 
  isRecording, 
  isSupported, 
  onToggle, 
  className 
}: VoiceInputButtonProps) {
  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "transition-all",
        isRecording && "text-destructive animate-pulse",
        className
      )}
    >
      {isRecording ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
