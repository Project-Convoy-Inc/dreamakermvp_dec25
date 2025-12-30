import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ImagePlus, Sparkles, Upload, Camera, X, Loader2, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateImage } from '@/lib/image-service';
import { toast } from 'sonner';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface DreamImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
  className?: string;
  dreamTitle?: string;
  dreamDescription?: string;
}

export function DreamImageUploader({ 
  imageUrl, 
  onImageChange, 
  className,
  dreamTitle,
  dreamDescription 
}: DreamImageUploaderProps) {
  const [open, setOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
        setOpen(false);
        resetAIGenerator();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIGenerate = () => {
    // Pre-fill prompt with dream context
    const defaultPrompt = [dreamTitle, dreamDescription]
      .filter(Boolean)
      .join(' - ');
    setGenerationPrompt(defaultPrompt);
    setShowAIGenerator(true);
  };

  const handleGenerateImage = async () => {
    if (!generationPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const referenceImages = referenceImage ? [referenceImage] : undefined;
      const generatedImageUrl = await generateImage({
        prompt: generationPrompt,
        referenceImages,
      });
      
      onImageChange(generatedImageUrl);
      toast.success('Image generated successfully!');
      setOpen(false);
      resetAIGenerator();
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAIGenerator = () => {
    setShowAIGenerator(false);
    setGenerationPrompt('');
    setReferenceImage(undefined);
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetAIGenerator();
    }
  };

  if (imageUrl) {
    return (
      <div className={cn("relative group", className)}>
        <div className="w-full rounded-xl overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt="Dream vision" 
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background flex items-center gap-1.5"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Change
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-popover" align="end">
            <AnimatePresence mode="wait">
              {showAIGenerator ? (
                <AIGeneratorUI
                  key="ai-generator"
                  prompt={generationPrompt}
                  onPromptChange={setGenerationPrompt}
                  referenceImage={referenceImage}
                  onReferenceChange={setReferenceImage}
                  onReferenceUploadClick={() => referenceInputRef.current?.click()}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerateImage}
                  onBack={resetAIGenerator}
                />
              ) : (
                <ImageOptions
                  key="options"
                  onAIGenerate={handleAIGenerate}
                  onUpload={() => fileInputRef.current?.click()}
                  onCamera={() => cameraInputRef.current?.click()}
                />
              )}
            </AnimatePresence>
          </PopoverContent>
        </Popover>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input
          ref={referenceInputRef}
          type="file"
          accept="image/*"
          onChange={handleReferenceUpload}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full h-32 rounded-xl border-2 border-dashed border-border",
              "flex flex-col items-center justify-center gap-2",
              "text-muted-foreground transition-all duration-200",
              "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              "group"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <ImagePlus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Add Vision Image</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 bg-popover" align="center">
          <AnimatePresence mode="wait">
            {showAIGenerator ? (
              <AIGeneratorUI
                key="ai-generator"
                prompt={generationPrompt}
                onPromptChange={setGenerationPrompt}
                referenceImage={referenceImage}
                onReferenceChange={setReferenceImage}
                onReferenceUploadClick={() => referenceInputRef.current?.click()}
                isGenerating={isGenerating}
                onGenerate={handleGenerateImage}
                onBack={resetAIGenerator}
              />
            ) : (
              <ImageOptions
                key="options"
                onAIGenerate={handleAIGenerate}
                onUpload={() => fileInputRef.current?.click()}
                onCamera={() => cameraInputRef.current?.click()}
              />
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={referenceInputRef}
        type="file"
        accept="image/*"
        onChange={handleReferenceUpload}
        className="hidden"
      />
    </div>
  );
}

interface ImageOptionsProps {
  onAIGenerate: () => void;
  onUpload: () => void;
  onCamera: () => void;
}

function ImageOptions({ onAIGenerate, onUpload, onCamera }: ImageOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-1"
    >
      <button
        onClick={onAIGenerate}
        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">AI Generate</p>
          <p className="text-xs text-muted-foreground">Create with AI</p>
        </div>
      </button>
      
      <button
        onClick={onUpload}
        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Upload className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Upload Image</p>
          <p className="text-xs text-muted-foreground">From your device</p>
        </div>
      </button>
      
      <button
        onClick={onCamera}
        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Camera className="w-4 h-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Take Photo</p>
          <p className="text-xs text-muted-foreground">Use your camera</p>
        </div>
      </button>
    </motion.div>
  );
}

interface AIGeneratorUIProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  referenceImage?: string;
  onReferenceChange: (value: string | undefined) => void;
  onReferenceUploadClick: () => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

function AIGeneratorUI({
  prompt,
  onPromptChange,
  referenceImage,
  onReferenceChange,
  onReferenceUploadClick,
  isGenerating,
  onGenerate,
  onBack,
}: AIGeneratorUIProps) {
  const { isRecording, isSupported, startRecording, stopRecording } = useVoiceInput();

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording((text) => {
        onPromptChange(prompt ? `${prompt} ${text}` : text);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI Generate</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-prompt" className="text-xs">Describe your vision</Label>
        <div className="relative">
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="A confident entrepreneur standing in a modern office, feeling accomplished and proud..."
            disabled={isGenerating}
            className="text-sm min-h-[100px] resize-none pr-10"
            rows={4}
          />
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isGenerating}
              className={cn(
                "absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors",
                isRecording 
                  ? "bg-destructive text-destructive-foreground animate-pulse" 
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {isRecording ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Reference Image (optional)</Label>
        {referenceImage ? (
          <div className="relative group">
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-20 object-cover rounded-lg"
            />
            <button
              onClick={() => onReferenceChange(undefined)}
              disabled={isGenerating}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={onReferenceUploadClick}
            disabled={isGenerating}
            className="w-full h-16 rounded-lg border border-dashed border-border flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Add inspiration image
          </button>
        )}
      </div>

      <Button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
        size="sm"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating (1-2 min)...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Image
          </>
        )}
      </Button>
    </motion.div>
  );
}