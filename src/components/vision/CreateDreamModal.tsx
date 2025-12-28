import { useState, useEffect } from 'react';
import { TimeFrame, Domain, TIMEFRAMES, DOMAINS } from '@/types/dream';
import { useDreamStore } from '@/stores/dreamStore';
import { useGenerateDreamContent } from '@/hooks/useGenerateDreamContent';
import { DomainIcon } from './DomainIcon';
import { DreamImageUploader } from './DreamImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

interface CreateDreamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTimeFrame?: TimeFrame;
  initialDomain?: Domain;
  onDreamCreated?: (dreamId: string) => void;
}

export function CreateDreamModal({ 
  open, 
  onOpenChange, 
  initialTimeFrame = 'short',
  initialDomain = 'work',
  onDreamCreated
}: CreateDreamModalProps) {
  const { addDreamWithSteps } = useDreamStore();
  const { generateContent, isGenerating } = useGenerateDreamContent();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(initialTimeFrame);
  const [domain, setDomain] = useState<Domain>(initialDomain);

  // Reset form when modal opens with new context
  useEffect(() => {
    if (open) {
      setTimeFrame(initialTimeFrame);
      setDomain(initialDomain);
    }
  }, [open, initialTimeFrame, initialDomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Please describe your dream');
      return;
    }

    // Generate AI content
    const generatedContent = await generateContent(description, domain, timeFrame);
    
    if (!generatedContent) {
      toast.error('Failed to generate dream content. Please try again.');
      return;
    }

    // Use the provided title or the AI-generated one
    const finalTitle = title.trim() || generatedContent.title;
    
    // Create dream with AI-generated roadmap steps
    const dreamId = addDreamWithSteps(
      {
        title: finalTitle,
        description: description.trim(),
        imageUrl: imageUrl,
        timeFrame,
        domain,
      },
      generatedContent.roadmapSteps
    );
    
    toast.success('Dream created with AI roadmap!', {
      description: `Added to ${TIMEFRAMES.find(t => t.key === timeFrame)?.label} • ${DOMAINS.find(d => d.key === domain)?.label}`,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl(undefined);
    onOpenChange(false);
    
    // Notify parent to open dream modal
    if (onDreamCreated) {
      onDreamCreated(dreamId);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isGenerating) {
      setTitle('');
      setDescription('');
      setImageUrl(undefined);
    }
    if (!isGenerating) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create a Dream</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Vision Image */}
          <div className="space-y-2">
            <Label>Vision Image</Label>
            <DreamImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
              dreamTitle={title}
              dreamDescription={description}
            />
          </div>

          {/* Description - Primary Input */}
          <div className="space-y-2">
            <Label htmlFor="description">Describe Your Dream *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to achieve? Be as detailed as possible..."
              rows={3}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              AI will generate a title and roadmap based on your description
            </p>
          </div>

          {/* Title - Optional */}
          <div className="space-y-2">
            <Label htmlFor="title">Dream Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave empty for AI-generated title"
              className="text-base"
              disabled={isGenerating}
            />
          </div>
          
          {/* Timeframe Selector */}
          <div className="space-y-2">
            <Label>Goal Timeframe</Label>
            <div className="grid grid-cols-3 gap-2">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  type="button"
                  onClick={() => setTimeFrame(tf.key)}
                  disabled={isGenerating}
                  className={cn(
                    "p-2.5 rounded-lg border-2 text-left transition-all",
                    timeFrame === tf.key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                    isGenerating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="font-medium text-xs text-foreground">{tf.label}</div>
                  <div className="text-[10px] text-muted-foreground">{tf.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Domain Selector */}
          <div className="space-y-2">
            <Label>Life Domain</Label>
            <div className="grid grid-cols-3 gap-2">
              {DOMAINS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDomain(d.key)}
                  disabled={isGenerating}
                  className={cn(
                    "p-2.5 rounded-lg border-2 flex flex-col items-center gap-1.5 transition-all",
                    domain === d.key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                    isGenerating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <DomainIcon domain={d.key} size="sm" />
                  <span className="text-[10px] font-medium text-foreground text-center">
                    {d.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </form>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!description.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Dream
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

