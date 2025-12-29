import { cn } from '@/lib/utils';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
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
