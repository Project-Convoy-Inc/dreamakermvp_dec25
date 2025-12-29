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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserStore } from "@/stores/userStore";
import { useEffect, lazy, Suspense } from "react";
import { VisionBoardSkeleton, ProgressPageSkeleton } from "@/components/ui/loading-skeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Convoy = lazy(() => import("./pages/Convoy"));
const Progress = lazy(() => import("./pages/Progress"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Example: Admin-only pages
// const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
// const UserManagement = lazy(() => import("./pages/UserManagement"));

const queryClient = new QueryClient();

function AppContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const isOnboardingComplete = useUserStore((state) => state.isOnboardingComplete);
  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboardingComplete = useUserStore((state) => state.setOnboardingComplete);

  // Dev bypass: Skip onboarding with ?skipOnboarding=true (only in development)
  const skipOnboarding = searchParams.get('skipOnboarding') === 'true';
  const isDev = import.meta.env.DEV;
  
  useEffect(() => {
    if (skipOnboarding && isDev) {
      localStorage.removeItem('dreamaker_onboarding_state');
      
      if (!profile) {
        setProfile({
          name: "Test User",
          email: "test@example.com",
          role: "user", // Default role for dev bypass
        });
      }
      
      if (!isOnboardingComplete) {
        setOnboardingComplete(true);
      }
      
      navigate('/', { replace: true });
    }
  }, [skipOnboarding, isDev, profile, isOnboardingComplete, setProfile, setOnboardingComplete, navigate]);

  if (skipOnboarding && isDev) {
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
              {/* Public routes (authenticated users) */}
              <Route path="/" element={<Index />} />
              
              {/* Routes accessible by users and partners */}
              <Route 
                path="/convoy" 
                element={
                  <ProtectedRoute requiredRole={['user', 'partner']}>
                    <Convoy />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes accessible by all authenticated users */}
              <Route 
                path="/progress" 
                element={
                  <Suspense fallback={<ProgressPageSkeleton />}>
                    <Progress />
                  </Suspense>
                } 
              />

              {/* Admin-only routes */}
              {/* 
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="admin" showAccessDenied>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              */}

              {/* Partner-only routes */}
              {/* 
              <Route 
                path="/partner-dashboard" 
                element={
                  <ProtectedRoute requiredRole="partner">
                    <PartnerDashboard />
                  </ProtectedRoute>
                } 
              />
              */}

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

