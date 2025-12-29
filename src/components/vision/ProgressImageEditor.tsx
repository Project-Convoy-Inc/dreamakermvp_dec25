/**
 * Progress Image Editor Component
 * Allows users to update their vision images based on progress
 */

import { useState } from 'react';
import { Sparkles, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Dream } from '@/types/dream';
import { getSuggestedChanges } from '@/lib/image-progress-tracking';

interface ProgressImageEditorProps {
  dream: Dream;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (changes: string) => Promise<void>;
}

export function ProgressImageEditor({
  dream,
  open,
  onOpenChange,
  onUpdate,
}: ProgressImageEditorProps) {
  const [changes, setChanges] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = getSuggestedChanges(dream);

  const handleUpdate = async () => {
    if (!changes.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(changes);
      setChanges('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update image:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setChanges(prev => {
      if (!prev) return suggestion;
      return `${prev}\n${suggestion}`;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Your Vision Image</DialogTitle>
          <DialogDescription>
            Describe how you want your vision image to change based on your progress.
            The image will be updated to reflect your achievements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Image Preview */}
          {dream.imageUrl && (
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={dream.imageUrl}
                alt={dream.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">Current</Badge>
              </div>
            </div>
          )}

          {/* Progress Information */}
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium">Current Progress</div>
              <div className="text-2xl font-bold text-primary">
                {dream.progress}%
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Steps Completed</div>
              <div className="text-2xl font-bold text-primary">
                {dream.steps.filter(s => s.completed).length} / {dream.steps.length}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && showSuggestions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Suggested Updates
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="text-left p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Change Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Describe the changes you want to see
            </label>
            <Textarea
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              placeholder="e.g., Add book titles to show the 3 books I've read, change the background to show a library, add a certificate on the wall..."
              className="min-h-[120px]"
              disabled={isUpdating}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about what elements to add, change, or enhance in your image.
            </p>
          </div>

          {/* Enhancement History */}
          {dream.progressImageMetadata &&
            dream.progressImageMetadata.enhancementHistory.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Previous Updates</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {dream.progressImageMetadata.enhancementHistory
                    .slice(-3)
                    .reverse()
                    .map((enhancement, index) => (
                      <div
                        key={index}
                        className="text-xs p-2 bg-muted/30 rounded border border-muted"
                      >
                        <div className="font-medium">{enhancement.change}</div>
                        <div className="text-muted-foreground">
                          {new Date(enhancement.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!changes.trim() || isUpdating}
          >
            {isUpdating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Update Image
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

