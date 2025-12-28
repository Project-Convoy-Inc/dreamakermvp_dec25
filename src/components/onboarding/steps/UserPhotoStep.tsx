import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, X } from 'lucide-react';

interface UserPhotoStepProps {
  userPhotos: string[];
  userDescription: string;
  onPhotosChange: (photos: string[]) => void;
  onDescriptionChange: (description: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function UserPhotoStep({
  userPhotos,
  userDescription,
  onPhotosChange,
  onDescriptionChange,
  onNext,
  onBack,
  onSkip,
}: UserPhotoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onPhotosChange([...userPhotos, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onPhotosChange([...userPhotos, dataUrl]);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(userPhotos.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
          Add yourself to your vision
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          Upload photos of yourself so we can personalize your vision image (optional)
        </p>

        {showCamera ? (
          <div className="mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg mb-4"
            />
            <div className="flex justify-center gap-4">
              <Button onClick={capturePhoto}>
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-4 mb-6">
            <Button variant="outline" onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {userPhotos.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {userPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`User photo ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Describe yourself (optional)
          </label>
          <Textarea
            value={userDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., I have brown hair and glasses..."
            rows={3}
          />
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
        
        <div className="text-center mt-4">
          <Button variant="ghost" className="text-muted-foreground" onClick={onSkip}>
            I'd like to do this later
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
