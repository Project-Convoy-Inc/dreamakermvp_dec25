import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Pencil, Check, X } from 'lucide-react';

interface ReviewStepProps {
  whatYouWant: string;
  visionDescription: string;
  currentStatus: string;
  onUpdateWhatYouWant: (value: string) => void;
  onUpdateVisionDescription: (value: string) => void;
  onUpdateCurrentStatus: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ReviewStep({
  whatYouWant,
  visionDescription,
  currentStatus,
  onUpdateWhatYouWant,
  onUpdateVisionDescription,
  onUpdateCurrentStatus,
  onNext,
  onBack,
}: ReviewStepProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    whatYouWant,
    visionDescription,
    currentStatus,
  });

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

  const EditableCard = ({
    label,
    field,
    value,
    isTextarea = false,
    rows = 4,
  }: {
    label: string;
    field: string;
    value: string;
    isTextarea?: boolean;
    rows?: number;
  }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-primary">{label}</span>
        {editing !== field && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(field)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {editing === field ? (
        <div>
          {isTextarea ? (
            <Textarea
              value={editValues[field as keyof typeof editValues]}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              rows={rows}
              className="mb-2"
            />
          ) : (
            <Input
              value={editValues[field as keyof typeof editValues]}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              className="mb-2"
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSave(field)}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-foreground">{value}</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
          Review your vision
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          Take a moment to review. You can edit anything before we bring it to life.
        </p>

        <div className="space-y-4 mb-8">
          <EditableCard
            label="What you want"
            field="whatYouWant"
            value={whatYouWant}
          />
          <EditableCard
            label="Your vision"
            field="visionDescription"
            value={visionDescription}
            isTextarea
            rows={6}
          />
          <EditableCard
            label="Where you are today"
            field="currentStatus"
            value={currentStatus}
            isTextarea
            rows={4}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button size="lg" onClick={onNext}>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate my vision
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
