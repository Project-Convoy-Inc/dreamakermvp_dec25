import { cn } from '@/lib/utils';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProgressDots.tsx:8',message:'ProgressDots render',data:{currentStep,totalSteps},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === currentStep
              ? "w-8 bg-primary"
              : index < currentStep
                ? "w-2 bg-primary/60"
                : "w-2 bg-muted"
          )}
        />
      ))}
    </div>
  );
}
