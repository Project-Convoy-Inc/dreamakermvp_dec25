import { ReactNode } from 'react';
import { useUserStore, UserRole } from '@/stores/userStore';

interface RoleBasedUIProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: ReactNode;
}

/**
 * RoleBasedUI Component
 * 
 * Conditionally renders children based on user role.
 * Unlike ProtectedRoute, this is for conditional UI rendering within a page.
 * 
 * @param children - Content to show if user has required role
 * @param requiredRole - Single role or array of roles required to see content
 * @param fallback - Optional content to show if user doesn't have required role
 * 
 * @example
 * // Show admin button only to admins
 * <RoleBasedUI requiredRole="admin">
 *   <Button>Admin Settings</Button>
 * </RoleBasedUI>
 * 
 * @example
 * // Show content with fallback for non-admins
 * <RoleBasedUI 
 *   requiredRole="admin"
 *   fallback={<p>Contact your administrator for access</p>}
 * >
 *   <AdminFeatures />
 * </RoleBasedUI>
 */
export function RoleBasedUI({
  children,
  requiredRole,
  fallback = null,
}: RoleBasedUIProps) {
  const hasRole = useUserStore((state) => state.hasRole);

  // If no role required, show children
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has required role
  const hasAccess = hasRole(requiredRole);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * HideForRole Component
 * 
 * Hides content for specific role(s). Opposite of RoleBasedUI.
 * Useful for hiding features from certain roles.
 * 
 * @example
 * // Hide admin tools from regular users
 * <HideForRole role="user">
 *   <AdminTools />
 * </HideForRole>
 */
export function HideForRole({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole | UserRole[];
}) {
  const hasRole = useUserStore((state) => state.hasRole);
  const shouldHide = hasRole(role);

  if (shouldHide) {
    return null;
  }

  return <>{children}</>;
}

/**
 * RoleSwitcher Component
 * 
 * Renders different content based on user's role.
 * Useful when you need completely different UIs for different roles.
 * 
 * @example
 * <RoleSwitcher
 *   user={<UserDashboard />}
 *   admin={<AdminDashboard />}
 *   fallback={<LoadingScreen />}
 * />
 */
export function RoleSwitcher({
  user,
  admin,
  fallback = null,
}: {
  user?: ReactNode;
  admin?: ReactNode;
  fallback?: ReactNode;
}) {
  const profile = useUserStore((state) => state.profile);
  const role = profile?.role;

  if (!role) {
    return <>{fallback}</>;
  }

  switch (role) {
    case 'user':
      return <>{user ?? fallback}</>;
    case 'admin':
      return <>{admin ?? fallback}</>;
    default:
      return <>{fallback}</>;
  }
}

/**
 * RequireRole Component
 * 
 * Similar to RoleBasedUI but with inverted logic - primarily for showing
 * upgrade prompts or access denied messages.
 * 
 * @example
 * <RequireRole 
 *   requiredRole="admin"
 *   message="Admin access required for this feature"
 * >
 *   <AdminOnlyFeature />
 * </RequireRole>
 */
export function RequireRole({
  children,
  requiredRole,
  message = "You don't have permission to access this feature.",
}: {
  children: ReactNode;
  requiredRole: UserRole | UserRole[];
  message?: string;
}) {
  const hasRole = useUserStore((state) => state.hasRole);
  const hasAccess = hasRole(requiredRole);

  if (!hasAccess) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  return <>{children}</>;
}

