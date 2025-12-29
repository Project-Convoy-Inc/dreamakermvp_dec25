import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore, UserRole } from '@/stores/userStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes based on user authentication and role-based permissions.
 * 
 * @param children - The component to render if access is granted
 * @param requiredRole - Single role or array of roles that have access
 * @param fallbackPath - Path to redirect to if access is denied (default: '/')
 * @param showAccessDenied - Whether to show an access denied message instead of redirecting
 * 
 * @example
 * // Protect route for admins only
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect route for admins or partners
 * <ProtectedRoute requiredRole={['admin', 'partner']}>
 *   <SharedDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Show access denied message instead of redirecting
 * <ProtectedRoute requiredRole="admin" showAccessDenied>
 *   <AdminSettings />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/',
  showAccessDenied = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const profile = useUserStore((state) => state.profile);
  const hasRole = useUserStore((state) => state.hasRole);

  // Check if user is authenticated
  if (!profile) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If no role is required, just check authentication
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has the required role
  const hasAccess = hasRole(requiredRole);

  if (!hasAccess) {
    if (showAccessDenied) {
      return (
        <div className="container flex items-center justify-center min-h-screen py-8">
          <Alert variant="destructive" className="max-w-md">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. 
              {Array.isArray(requiredRole) 
                ? ` Required roles: ${requiredRole.join(', ')}`
                : ` Required role: ${requiredRole}`
              }
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * Hook to check if user has specific role(s)
 * Useful for conditional rendering within components
 * 
 * @example
 * const canAccessAdmin = useHasRole('admin');
 * const canAccessDashboard = useHasRole(['admin', 'partner']);
 */
export function useHasRole(role: UserRole | UserRole[]): boolean {
  return useUserStore((state) => state.hasRole(role));
}

/**
 * Hook to get current user's role
 */
export function useUserRole(): UserRole | undefined {
  return useUserStore((state) => state.profile?.role);
}

