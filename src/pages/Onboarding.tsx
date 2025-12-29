import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { OnboardingMenu } from '@/components/onboarding/OnboardingMenu';
import { WelcomeStep } from '@/components/onboarding/steps/WelcomeStep';
import { SidekickStep } from '@/components/onboarding/steps/SidekickStep';
import { VisionPromptStep } from '@/components/onboarding/steps/VisionPromptStep';
import { VisualizationStep } from '@/components/onboarding/steps/VisualizationStep';
import { DetailedDescriptionStep } from '@/components/onboarding/steps/DetailedDescriptionStep';
import { CurrentStatusStep } from '@/components/onboarding/steps/CurrentStatusStep';
import { ReviewStep } from '@/components/onboarding/steps/ReviewStep';
import { UserPhotoStep } from '@/components/onboarding/steps/UserPhotoStep';
import { GeneratingStep } from '@/components/onboarding/steps/GeneratingStep';
import { CelebrationStep } from '@/components/onboarding/steps/CelebrationStep';
import { useDreamStore } from '@/stores/dreamStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';

const TOTAL_STEPS = 10;
const ESTIMATED_TIME_PER_STEP = [1, 1, 2, 1, 3, 2, 2, 1, 2, 1]; // minutes per step
const TOTAL_ESTIMATED_TIME = ESTIMATED_TIME_PER_STEP.reduce((a, b) => a + b, 0);

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, updateState, nextStep, prevStep, goToStep, clearState } = useOnboardingState();
  const addDream = useDreamStore((state) => state.addDream);
  const setOnboardingComplete = useUserStore((state) => state.setOnboardingComplete);

  // Calculate remaining time
  const remainingTime = ESTIMATED_TIME_PER_STEP.slice(state.currentStep).reduce((a, b) => a + b, 0);

  // Add swipe gestures for navigation (except on generating and celebration steps)
  const canSwipe = state.currentStep !== 8 && state.currentStep !== 9;
  useSwipeGesture({
    onSwipeRight: canSwipe && state.currentStep > 0 ? prevStep : undefined,
    onSwipeLeft: canSwipe && state.currentStep < TOTAL_STEPS - 1 ? () => {
      // Only allow swipe forward if current step is complete
      const canProceed = validateCurrentStep();
      if (canProceed) {
        nextStep();
      }
    } : undefined,
  });

  const validateCurrentStep = () => {
    // Add validation logic for each step
    switch (state.currentStep) {
      case 2:
        return !!state.whatYouWant?.trim();
      case 4:
        return !!state.visionDescription?.trim();
      case 5:
        return !!state.currentStatus?.trim();
      default:
        return true;
    }
  };

  const handleSaveAndExit = () => {
    toast({
      title: "Progress saved",
      description: "Your vision is saved. Come back anytime to continue.",
    });
    navigate('/');
  };

  const handleImageGenerated = (imageUrl: string) => {
    updateState({ 
      generatedImageUrl: imageUrl, 
      hasGeneratedImage: true 
    });
    nextStep();
  };

  const handleSkipImageGeneration = () => {
    // Continue to celebration step without image
    updateState({ 
      generatedImageUrl: null, 
      hasGeneratedImage: false 
    });
    nextStep();
  };

  const handleRegenerate = () => {
    updateState({ hasGeneratedImage: false });
    goToStep(8); // Go back to generating step
  };

  const handleComplete = () => {
    // Create the dream from onboarding data
    addDream({
      title: state.whatYouWant,
      description: state.visionDescription,
      imageUrl: state.generatedImageUrl || undefined,
      timeFrame: 'mid',
      domain: 'work',
    });

    clearState();
    setOnboardingComplete(true);
    
    toast({
      title: "Vision created!",
      description: "Your first vision has been added to your board.",
    });
    
    navigate('/');
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      
      case 1:
        return (
          <SidekickStep
            selectedAvatar={state.sidekickAvatar}
            onSelectAvatar={(id) => updateState({ sidekickAvatar: id })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 2:
        return (
          <VisionPromptStep
            value={state.whatYouWant}
            onChange={(value) => updateState({ whatYouWant: value })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 3:
        return <VisualizationStep onNext={nextStep} />;
      
      case 4:
        return (
          <DetailedDescriptionStep
            value={state.visionDescription}
            onChange={(value) => updateState({ visionDescription: value })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 5:
        return (
          <CurrentStatusStep
            currentStatus={state.currentStatus}
            uploadedMaterials={state.uploadedMaterials}
            onStatusChange={(value) => updateState({ currentStatus: value })}
            onFilesChange={(files) => updateState({ uploadedMaterials: files })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 6:
        return (
          <ReviewStep
            whatYouWant={state.whatYouWant}
            visionDescription={state.visionDescription}
            currentStatus={state.currentStatus}
            onUpdateWhatYouWant={(value) => updateState({ whatYouWant: value })}
            onUpdateVisionDescription={(value) => updateState({ visionDescription: value })}
            onUpdateCurrentStatus={(value) => updateState({ currentStatus: value })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 7:
        return (
          <UserPhotoStep
            userPhotos={state.userPhotos}
            userDescription={state.userDescription}
            onPhotosChange={(photos) => updateState({ userPhotos: photos })}
            onDescriptionChange={(desc) => updateState({ userDescription: desc })}
            onNext={nextStep}
            onBack={prevStep}
            onSkip={nextStep}
          />
        );
      
      case 8:
        return (
          <GeneratingStep 
            onComplete={handleImageGenerated}
            onSkip={handleSkipImageGeneration}
            onSaveAndExit={handleSaveAndExit}
            whatYouWant={state.whatYouWant}
            visionDescription={state.visionDescription}
            userPhotos={state.userPhotos}
          />
        );
      
      case 9:
        return (
          <CelebrationStep
            imageUrl={state.generatedImageUrl || ''}
            whatYouWant={state.whatYouWant}
            visionDescription={state.visionDescription}
            currentStatus={state.currentStatus}
            onUpdateWhatYouWant={(value) => updateState({ whatYouWant: value })}
            onUpdateVisionDescription={(value) => updateState({ visionDescription: value })}
            onUpdateCurrentStatus={(value) => updateState({ currentStatus: value })}
            onRegenerate={handleRegenerate}
            onContinue={handleComplete}
          />
        );
      
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hide progress dots on generating step */}
      {state.currentStep !== 8 && (
        <>
          <ProgressDots currentStep={state.currentStep} totalSteps={TOTAL_STEPS} />
          {remainingTime > 0 && (
            <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{remainingTime} min left</span>
            </div>
          )}
        </>
      )}
      
      <OnboardingMenu onSaveAndExit={handleSaveAndExit} />
      
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}
