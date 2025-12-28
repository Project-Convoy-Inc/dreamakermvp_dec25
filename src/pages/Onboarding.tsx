import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useOnboardingState } from '@/hooks/useOnboardingState';
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

const TOTAL_STEPS = 10;

export default function Onboarding() {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Onboarding.tsx:22',message:'Onboarding component render start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, updateState, nextStep, prevStep, goToStep, clearState } = useOnboardingState();
  const addDream = useDreamStore((state) => state.addDream);
  const setOnboardingComplete = useUserStore((state) => state.setOnboardingComplete);

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Onboarding.tsx:29',message:'Onboarding - hooks initialized',data:{currentStep:state?.currentStep},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Onboarding.tsx:71',message:'renderStep called',data:{currentStep:state.currentStep},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    switch (state.currentStep) {
      case 0:
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Onboarding.tsx:75',message:'renderStep - returning WelcomeStep',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
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

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Onboarding.tsx:178',message:'Onboarding - about to render JSX',data:{currentStep:state.currentStep},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hide progress dots on generating step */}
      {state.currentStep !== 8 && (
        <ProgressDots currentStep={state.currentStep} totalSteps={TOTAL_STEPS} />
      )}
      
      <OnboardingMenu onSaveAndExit={handleSaveAndExit} />
      
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}
