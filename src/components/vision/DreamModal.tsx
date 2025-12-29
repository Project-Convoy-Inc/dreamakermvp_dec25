import { useState, useEffect } from 'react';
import { Dream, DOMAINS, TIMEFRAMES, Partner } from '@/types/dream';
import { useDreamStore } from '@/stores/dreamStore';
import { useGenerateDreamContent } from '@/hooks/useGenerateDreamContent';
import { DomainIcon } from './DomainIcon';
import { PartnerSelector } from './PartnerSelector';
import { DreamImageUploader } from './DreamImageUploader';
import { ProgressImageEditor } from './ProgressImageEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  GripVertical,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  checkForProgressSuggestion, 
  updateImageWithProgress,
  initializeProgressMetadata,
} from '@/lib/image-progress-tracking';

interface DreamModalProps {
  dream: Dream | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Milestone {
  title: string;
  estimate: string;
  added?: boolean;
}

export function DreamModal({ dream, open, onOpenChange }: DreamModalProps) {
  const { toggleStep, addStep, addMultipleSteps, deleteDream, updateDream } = useDreamStore();
  const { generateContent, isGenerating } = useGenerateDreamContent();
  const [newStepTitle, setNewStepTitle] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [hasGeneratedSuggestions, setHasGeneratedSuggestions] = useState(false);
  const [progressEditorOpen, setProgressEditorOpen] = useState(false);
  const [progressSuggestion, setProgressSuggestion] = useState<any>(null);
  
  if (!dream) return null;
  
  // Check for progress suggestions when modal opens
  useEffect(() => {
    if (open && dream) {
      const suggestion = checkForProgressSuggestion(dream);
      setProgressSuggestion(suggestion);
    }
  }, [open, dream]);
  
  const domainInfo = DOMAINS.find(d => d.key === dream.domain);
  const timeframeInfo = TIMEFRAMES.find(t => t.key === dream.timeFrame);
  const completedSteps = dream.steps.filter(s => s.completed).length;
  const nextStep = dream.steps.find(s => !s.completed);

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    
    addStep(dream.id, {
      title: newStepTitle.trim(),
      completed: false,
    });
    setNewStepTitle('');
    toast.success('Step added');
  };

  const handleDelete = () => {
    deleteDream(dream.id);
    onOpenChange(false);
    toast.success('Dream deleted');
  };

  const handleReorder = (newOrder: typeof dream.steps) => {
    updateDream(dream.id, { 
      steps: newOrder.map((step, index) => ({ ...step, order: index })) 
    });
  };

  const handlePartnersChange = (partners: Partner[]) => {
    updateDream(dream.id, { partners });
    toast.success(partners.length > 0 ? 'Partners updated' : 'Partners removed');
  };

  const handleImageChange = (imageUrl: string | undefined) => {
    // Initialize progress metadata if this is a new image
    if (imageUrl && !dream.progressImageMetadata) {
      const metadata = initializeProgressMetadata(
        imageUrl,
        dream.description,
        dream.title
      );
      updateDream(dream.id, { imageUrl, progressImageMetadata: metadata });
    } else {
      updateDream(dream.id, { imageUrl });
    }
    toast.success(imageUrl ? 'Image updated' : 'Image removed');
  };

  const handleProgressUpdate = async (changes: string) => {
    try {
      const result = await updateImageWithProgress(dream, changes, 'user');
      updateDream(dream.id, {
        imageUrl: result.imageUrl,
        progressImageMetadata: result.updatedMetadata,
      });
      toast.success('Vision image updated with your progress!');
    } catch (error) {
      console.error('Failed to update progress image:', error);
      toast.error('Failed to update image. Please try again.');
      throw error;
    }
  };

  const dismissProgressSuggestion = () => {
    setProgressSuggestion(null);
    toast('Suggestion dismissed. We\'ll remind you again in 2 weeks.');
  };

  const handleGenerateSuggestions = async () => {
    const content = await generateContent(
      dream.description || dream.title,
      dream.domain,
      dream.timeFrame
    );
    
    if (content) {
      setMilestones(content.milestones.map(m => ({ ...m, added: false })));
      setHasGeneratedSuggestions(true);
      toast.success('AI suggestions generated!');
    } else {
      toast.error('Failed to generate suggestions');
    }
  };

  const handleAddMilestone = (index: number) => {
    const milestone = milestones[index];
    if (milestone.added) return;
    
    addStep(dream.id, {
      title: milestone.title,
      completed: false,
    });
    
    setMilestones(prev => 
      prev.map((m, i) => i === index ? { ...m, added: true } : m)
    );
    toast.success('Milestone added to roadmap');
  };

  const handleAddAllMilestones = () => {
    const unaddedMilestones = milestones.filter(m => !m.added);
    if (unaddedMilestones.length === 0) return;
    
    addMultipleSteps(dream.id, unaddedMilestones.map(m => ({ title: m.title })));
    setMilestones(prev => prev.map(m => ({ ...m, added: true })));
    toast.success(`Added ${unaddedMilestones.length} milestones to roadmap`);
  };

  const unaddedCount = milestones.filter(m => !m.added).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader className="space-y-4">
          {/* Image Header - Always show uploader */}
          <div className="-mt-2">
            <DreamImageUploader
              imageUrl={dream.imageUrl}
              onImageChange={handleImageChange}
              dreamTitle={dream.title}
              dreamDescription={dream.description}
            />
          </div>
          
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
              <DomainIcon domain={dream.domain} size="sm" showBackground={false} />
              {domainInfo?.label}
            </div>
            <div className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {timeframeInfo?.label}
            </div>
            {dream.targetDate && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(dream.targetDate).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {/* Title and Partner Assignment Row */}
          <div className="space-y-3">
            <DialogTitle className="font-display text-2xl pr-8">
              {dream.title}
            </DialogTitle>
            
            {/* Partner Assignment */}
            <PartnerSelector
              selectedPartners={dream.partners}
              onPartnersChange={handlePartnersChange}
            />
          </div>
          
          {dream.description && (
            <p className="text-muted-foreground text-sm">{dream.description}</p>
          )}
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold text-foreground">{dream.progress}%</span>
            </div>
            <Progress value={dream.progress} className="h-2" />
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress Suggestion Card */}
          {progressSuggestion && !progressSuggestion.dismissed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary-glow/10 border border-primary/20"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                <RefreshCw className="w-3.5 h-3.5" />
                PROGRESS UPDATE AVAILABLE
              </div>
              <p className="text-sm text-foreground mb-3">
                {progressSuggestion.description}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setProgressEditorOpen(true)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Update Vision
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={dismissProgressSuggestion}
                >
                  Later
                </Button>
              </div>
            </motion.div>
          )}

          {/* Update Vision Button (when there's an image but no pending suggestion) */}
          {dream.imageUrl && !progressSuggestion && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setProgressEditorOpen(true)}
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Update Vision Image Based on Progress
            </Button>
          )}

          {/* Next Action Card */}
          {nextStep && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                NEXT ACTION
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={nextStep.completed}
                  onCheckedChange={() => toggleStep(dream.id, nextStep.id)}
                />
                <span className="font-medium text-foreground">{nextStep.title}</span>
              </div>
            </motion.div>
          )}
          
          {/* Roadmap Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Roadmap
              </h3>
              <span className="text-sm text-muted-foreground">
                {completedSteps}/{dream.steps.length} completed
              </span>
            </div>
            
            <Reorder.Group 
              axis="y" 
              values={dream.steps} 
              onReorder={handleReorder}
              className="space-y-2"
            >
              <AnimatePresence>
                {dream.steps.map((step) => (
                  <Reorder.Item
                    key={step.id}
                    value={step}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg bg-muted/50 group cursor-grab active:cursor-grabbing",
                      step.completed && "opacity-60"
                    )}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Checkbox
                      checked={step.completed}
                      onCheckedChange={() => toggleStep(dream.id, step.id)}
                    />
                    <span className={cn(
                      "flex-1 text-sm",
                      step.completed && "line-through text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
            
            {/* Add Step Input */}
            <div className="flex items-center gap-2">
              <Input
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Add a new step..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
              />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleAddStep}
                disabled={!newStepTitle.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* AI Suggestions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Milestone Suggestions
              </h3>
              {hasGeneratedSuggestions && unaddedCount > 0 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddAllMilestones}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add All ({unaddedCount})
                </Button>
              )}
            </div>
            
            {!hasGeneratedSuggestions ? (
              <div className="p-4 rounded-xl border border-dashed border-border">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered milestone suggestions based on your dream
                  </p>
                  <Button 
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Suggestions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all",
                      milestone.added 
                        ? "bg-primary/5 border-primary/20" 
                        : "bg-muted/30 border-border hover:border-primary/40 cursor-pointer"
                    )}
                    onClick={() => !milestone.added && handleAddMilestone(index)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {milestone.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Estimated: {milestone.estimate}
                      </p>
                    </div>
                    {milestone.added ? (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Check className="w-4 h-4" />
                        Added
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-primary">
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={handleGenerateSuggestions}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Regenerate Suggestions
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Dream
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>

      {/* Progress Image Editor Modal */}
      <ProgressImageEditor
        dream={dream}
        open={progressEditorOpen}
        onOpenChange={setProgressEditorOpen}
        onUpdate={handleProgressUpdate}
      />
    </Dialog>
  );
}
