import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Navigation } from "@/components/layout/Navigation";
import { SidekickChatWidget } from "@/components/sidekick/SidekickChatWidget";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SyncStatus } from "@/components/ui/sync-status";
import { useUserStore } from "@/stores/userStore";
import { useEffect, lazy, Suspense } from "react";
import { VisionBoardSkeleton, ProgressPageSkeleton } from "@/components/ui/loading-skeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Convoy = lazy(() => import("./pages/Convoy"));
const Progress = lazy(() => import("./pages/Progress"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AppContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const isOnboardingComplete = useUserStore((state) => state.isOnboardingComplete);
  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboardingComplete = useUserStore((state) => state.setOnboardingComplete);

  // Dev bypass: Skip onboarding with ?skipOnboarding=true (only in development)
  // Check this FIRST before the onboarding check
  const skipOnboarding = searchParams.get('skipOnboarding') === 'true';
  const isDev = import.meta.env.DEV;
  
  useEffect(() => {
    if (skipOnboarding && isDev) {
      // Clear any existing onboarding state
      localStorage.removeItem('dreamaker_onboarding_state');
      
      // Set up test user if not already set
      if (!profile) {
        setProfile({
          name: "Test User",
          email: "test@example.com"
        });
      }
      
      // Mark onboarding as complete
      if (!isOnboardingComplete) {
        setOnboardingComplete(true);
      }
      
      // Remove the parameter from URL and navigate to home
      navigate('/', { replace: true });
    }
  }, [skipOnboarding, isDev, profile, isOnboardingComplete, setProfile, setOnboardingComplete, navigate]);

  // If bypass is active, don't show onboarding (even if state hasn't updated yet)
  if (skipOnboarding && isDev) {
    // Return null or a loading state while the effect runs
    // The effect will navigate away, so this is just a brief moment
    return null;
  }

  // If no profile or onboarding not complete, show onboarding
  if (!profile || !isOnboardingComplete) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
        </div>}>
          <Onboarding />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <OfflineIndicator />
        <SyncStatus />
        <Navigation />
        <main className="container pt-20 md:pt-24 pb-24 md:pb-8">
          <Suspense fallback={<VisionBoardSkeleton />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/convoy" element={<Convoy />} />
              <Route path="/progress" element={<Suspense fallback={<ProgressPageSkeleton />}><Progress /></Suspense>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <SidekickChatWidget />
      </div>
    </ErrorBoundary>
  );
}

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

