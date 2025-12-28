import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Sparkles, Pencil, Check, X } from 'lucide-react';

interface CelebrationStepProps {
  imageUrl: string;
  whatYouWant: string;
  visionDescription: string;
  currentStatus: string;
  onUpdateWhatYouWant: (value: string) => void;
  onUpdateVisionDescription: (value: string) => void;
  onUpdateCurrentStatus: (value: string) => void;
  onRegenerate: () => void;
  onContinue: () => void;
}

export function CelebrationStep({
  imageUrl,
  whatYouWant,
  visionDescription,
  currentStatus,
  onUpdateWhatYouWant,
  onUpdateVisionDescription,
  onUpdateCurrentStatus,
  onRegenerate,
  onContinue,
}: CelebrationStepProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    whatYouWant,
    visionDescription,
    currentStatus,
  });

  useEffect(() => {
    // Simple confetti effect using CSS
    const confettiCount = 50;
    const container = document.getElementById('confetti-container');
    if (!container) return;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        left: ${Math.random() * 100}vw;
        top: -10px;
        opacity: 0;
        animation: confetti-fall 3s ease-out forwards;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(confetti);
    }

    // Add confetti animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      container.innerHTML = '';
      style.remove();
    };
  }, []);

  const handleSave = (field: string) => {
    switch (field) {
      case 'whatYouWant':
        onUpdateWhatYouWant(editValues.whatYouWant);
        break;
      case 'visionDescription':
        onUpdateVisionDescription(editValues.visionDescription);
        break;
      case 'currentStatus':
        onUpdateCurrentStatus(editValues.currentStatus);
        break;
    }
    setEditing(null);
  };

  const handleCancel = () => {
    setEditValues({ whatYouWant, visionDescription, currentStatus });
    setEditing(null);
  };

  const CompactCard = ({
    label,
    field,
    value,
    lineClamp,
    isTextarea = false,
  }: {
    label: string;
    field: string;
    value: string;
    lineClamp: number;
    isTextarea?: boolean;
  }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-primary">{label}</span>
        {editing !== field && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(field)}>
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {editing === field ? (
        <div>
          {isTextarea ? (
            <Textarea
              value={editValues[field as keyof typeof editValues]}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              rows={3}
              className="mb-2 text-sm"
            />
          ) : (
            <Input
              value={editValues[field as keyof typeof editValues]}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              className="mb-2 text-sm"
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSave(field)}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <p className={`text-sm text-foreground line-clamp-${lineClamp}`}>{value}</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />
      
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Your vision is ready! ✨
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          You can edit anything to regenerate the image until it meets your expectations
        </p>

        <div className="flex justify-center mb-8">
          <img
            src={imageUrl}
            alt="Your generated vision"
            className="max-h-[500px] object-contain rounded-xl shadow-2xl"
          />
        </div>

        <div className="grid gap-3 mb-8">
          <CompactCard
            label="What you want"
            field="whatYouWant"
            value={whatYouWant}
            lineClamp={1}
          />
          <CompactCard
            label="Your vision"
            field="visionDescription"
            value={visionDescription}
            lineClamp={3}
            isTextarea
          />
          <CompactCard
            label="Where you are today"
            field="currentStatus"
            value={currentStatus}
            lineClamp={2}
            isTextarea
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={onRegenerate}>
            <Sparkles className="mr-2 h-4 w-4" />
            Regenerate image
          </Button>
          <Button size="lg" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
