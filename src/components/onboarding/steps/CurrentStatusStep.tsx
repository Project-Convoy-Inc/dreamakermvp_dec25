import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Dumbbell, BookOpen, Link } from 'lucide-react';
import { VoiceInputButton } from '../VoiceInputButton';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { DocumentUpload } from '../DocumentUpload';

interface CurrentStatusStepProps {
  currentStatus: string;
  uploadedMaterials: File[];
  onStatusChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CurrentStatusStep({ 
  currentStatus,
  uploadedMaterials,
  onStatusChange,
  onFilesChange,
  onNext, 
  onBack 
}: CurrentStatusStepProps) {
  const { isRecording, isSupported, startRecording, stopRecording } = useVoiceInput();

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording((text) => {
        onStatusChange(currentStatus + (currentStatus ? ' ' : '') + text);
      });
    }
  };

  const isValid = currentStatus.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
          Amazing job!
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          So that I can help guide you, tell me where you are with this today.
        </p>

        <div className="relative mb-8">
          <Textarea
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            placeholder="Describe where you are right now with this vision..."
            className="min-h-[150px] text-lg resize-none pr-12"
            rows={6}
          />
          <VoiceInputButton
            isRecording={isRecording}
            isSupported={isSupported}
            onToggle={handleVoiceToggle}
            className="absolute right-2 top-2"
          />
        </div>

        {/* Document upload section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">
            Share any plans, milestones, or resources you're already using
          </h3>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <FileText className="h-4 w-4" />
              Course syllabus
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <Dumbbell className="h-4 w-4" />
              Training plan
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <BookOpen className="h-4 w-4" />
              Budget sheet
            </div>
            <Button variant="secondary" size="sm" className="rounded-full">
              <Link className="h-4 w-4 mr-1.5" />
              Integrations
            </Button>
          </div>

          <DocumentUpload 
            files={uploadedMaterials}
            onFilesChange={onFilesChange}
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
