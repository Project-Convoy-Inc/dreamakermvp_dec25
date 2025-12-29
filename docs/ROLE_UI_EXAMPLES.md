# Role-Based UI Components - Usage Examples

This document provides practical examples of using the role-based UI components.

## Table of Contents

1. [RoleBasedUI Component](#rolebasedui-component)
2. [HideForRole Component](#hideforrole-component)
3. [RoleSwitcher Component](#roleswitcher-component)
4. [RequireRole Component](#requirerole-component)
5. [useHasRole Hook](#usehasrole-hook)
6. [useUserRole Hook](#useuserrole-hook)
7. [Real-World Examples](#real-world-examples)

---

## RoleBasedUI Component

Show content only to users with specific roles.

### Example 1: Admin-Only Button

```tsx
import { RoleBasedUI } from '@/components/RoleBasedUI';
import { Button } from '@/components/ui/button';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <RoleBasedUI requiredRole="admin">
        <Button onClick={() => navigateToAdmin()}>
          Admin Panel
        </Button>
      </RoleBasedUI>
    </div>
  );
}
```

### Example 2: Multiple Roles with Fallback

```tsx
import { RoleBasedUI } from '@/components/RoleBasedUI';
import { Card } from '@/components/ui/card';

function Features() {
  return (
    <RoleBasedUI 
      requiredRole={['admin', 'partner']}
      fallback={
        <Card className="p-4 bg-muted">
          <p>Upgrade to Partner to access collaboration features</p>
          <Button>Upgrade Now</Button>
        </Card>
      }
    >
      <CollaborationTools />
    </RoleBasedUI>
  );
}
```

### Example 3: Nested Role Checks

```tsx
function SettingsPage() {
  return (
    <div>
      {/* Everyone sees basic settings */}
      <BasicSettings />
      
      {/* Partners and admins see collaboration settings */}
      <RoleBasedUI requiredRole={['partner', 'admin']}>
        <CollaborationSettings />
      </RoleBasedUI>
      
      {/* Only admins see admin settings */}
      <RoleBasedUI requiredRole="admin">
        <AdminSettings />
      </RoleBasedUI>
    </div>
  );
}
```

---

## HideForRole Component

Hide content from specific roles.

### Example 1: Hide Premium Upsells from Admins

```tsx
import { HideForRole } from '@/components/RoleBasedUI';

function Sidebar() {
  return (
    <div>
      <Navigation />
      
      {/* Don't show upgrade prompts to admins */}
      <HideForRole role="admin">
        <UpgradePrompt />
      </HideForRole>
    </div>
  );
}
```

### Example 2: Hide Features from Regular Users

```tsx
function FeatureList() {
  return (
    <div>
      <Feature name="Basic Tracking" />
      <Feature name="Dream Board" />
      
      {/* Hide advanced features from regular users */}
      <HideForRole role="user">
        <Feature name="Team Collaboration" premium />
        <Feature name="Advanced Analytics" premium />
      </HideForRole>
    </div>
  );
}
```

---

## RoleSwitcher Component

Render completely different content based on role.

### Example 1: Different Dashboards

```tsx
import { RoleSwitcher } from '@/components/RoleBasedUI';

function Dashboard() {
  return (
    <RoleSwitcher
      user={<UserDashboard />}
      partner={<PartnerDashboard />}
      admin={<AdminDashboard />}
      fallback={<LoadingSpinner />}
    />
  );
}
```

### Example 2: Different Navigation

```tsx
function AppNavigation() {
  return (
    <nav>
      <Logo />
      
      <RoleSwitcher
        user={
          <div>
            <NavLink to="/">My Dreams</NavLink>
            <NavLink to="/progress">Progress</NavLink>
          </div>
        }
        partner={
          <div>
            <NavLink to="/">My Dreams</NavLink>
            <NavLink to="/convoy">Partners</NavLink>
            <NavLink to="/shared">Shared Dreams</NavLink>
          </div>
        }
        admin={
          <div>
            <NavLink to="/admin">Admin Panel</NavLink>
            <NavLink to="/users">User Management</NavLink>
            <NavLink to="/analytics">Analytics</NavLink>
          </div>
        }
      />
    </nav>
  );
}
```

### Example 3: Different Welcome Messages

```tsx
function WelcomeMessage() {
  return (
    <RoleSwitcher
      user={
        <h1>Welcome back! Let's make progress on your dreams.</h1>
      }
      partner={
        <h1>Welcome back! See how your partners are doing.</h1>
      }
      admin={
        <h1>Admin Dashboard - Platform Overview</h1>
      }
    />
  );
}
```

---

## RequireRole Component

Show upgrade prompts or access messages.

### Example 1: Feature Upgrade Prompt

```tsx
import { RequireRole } from '@/components/RoleBasedUI';

function AdvancedFeature() {
  return (
    <RequireRole 
      requiredRole="partner"
      message="Upgrade to Partner to unlock collaboration features and share dreams with others."
    >
      <CollaborationPanel />
    </RequireRole>
  );
}
```

### Example 2: Admin-Only Section

```tsx
function UserManagement() {
  return (
    <RequireRole 
      requiredRole="admin"
      message="Only administrators can access user management."
    >
      <UserTable />
      <UserActions />
    </RequireRole>
  );
}
```

---

## useHasRole Hook

For conditional logic and rendering.

### Example 1: Conditional Button Rendering

```tsx
import { useHasRole } from '@/components/ProtectedRoute';

function ActionBar() {
  const isAdmin = useHasRole('admin');
  const canCollaborate = useHasRole(['partner', 'admin']);

  return (
    <div className="flex gap-2">
      <Button>Save</Button>
      
      {canCollaborate && (
        <Button onClick={handleShare}>
          Share with Partner
        </Button>
      )}
      
      {isAdmin && (
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </div>
  );
}
```

### Example 2: Conditional Data Fetching

```tsx
import { useHasRole } from '@/components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';

function Analytics() {
  const isAdmin = useHasRole('admin');
  
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: fetchUserStats,
  });
  
  // Only fetch platform stats for admins
  const { data: platformStats } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: fetchPlatformStats,
    enabled: isAdmin, // Only run this query for admins
  });

  return (
    <div>
      <h2>Your Stats</h2>
      <StatsDisplay data={userStats} />
      
      {isAdmin && platformStats && (
        <>
          <h2>Platform Stats</h2>
          <PlatformStatsDisplay data={platformStats} />
        </>
      )}
    </div>
  );
}
```

### Example 3: Dynamic Form Fields

```tsx
import { useHasRole } from '@/components/ProtectedRoute';

function DreamForm() {
  const isPartner = useHasRole(['partner', 'admin']);
  
  return (
    <form>
      <Input label="Dream Title" />
      <Textarea label="Description" />
      
      {isPartner && (
        <>
          <Label>Share with Partners</Label>
          <PartnerSelector />
        </>
      )}
      
      <Button type="submit">Save Dream</Button>
    </form>
  );
}
```

---

## useUserRole Hook

Get the current user's role directly.

### Example 1: Role-Based Styling

```tsx
import { useUserRole } from '@/components/ProtectedRoute';

function Header() {
  const userRole = useUserRole();
  
  const headerClass = {
    user: 'bg-blue-500',
    partner: 'bg-purple-500',
    admin: 'bg-red-500',
  }[userRole || 'user'];

  return (
    <header className={`${headerClass} p-4 text-white`}>
      <h1>Dreamaker</h1>
      <span className="text-sm">({userRole} account)</span>
    </header>
  );
}
```

### Example 2: Conditional Navigation

```tsx
import { useUserRole } from '@/components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';

function useDefaultRoute() {
  const userRole = useUserRole();
  const navigate = useNavigate();
  
  const navigateToDefault = () => {
    switch (userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'partner':
        navigate('/convoy');
        break;
      default:
        navigate('/');
    }
  };

  return navigateToDefault;
}
```

### Example 3: Role Badge

```tsx
import { useUserRole } from '@/components/ProtectedRoute';
import { Badge } from '@/components/ui/badge';

function UserAvatar() {
  const userRole = useUserRole();
  
  const roleConfig = {
    user: { label: 'User', variant: 'default' },
    partner: { label: 'Partner', variant: 'secondary' },
    admin: { label: 'Admin', variant: 'destructive' },
  };
  
  const config = roleConfig[userRole || 'user'];

  return (
    <div className="flex items-center gap-2">
      <Avatar />
      <Badge variant={config.variant}>{config.label}</Badge>
    </div>
  );
}
```

---

## Real-World Examples

### Example 1: Vision Board with Role-Based Features

```tsx
import { RoleBasedUI, HideForRole } from '@/components/RoleBasedUI';
import { useHasRole } from '@/components/ProtectedRoute';

function VisionBoard() {
  const canShare = useHasRole(['partner', 'admin']);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>My Vision Board</h1>
        
        {canShare && (
          <Button onClick={handleShare}>
            Share Board
          </Button>
        )}
      </div>

      <DreamGrid dreams={dreams} />
      
      {/* Upgrade prompt for users */}
      <HideForRole role={['partner', 'admin']}>
        <Card className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3>Unlock Collaboration</h3>
          <p>Upgrade to Partner to share dreams and get accountability support</p>
          <Button>Learn More</Button>
        </Card>
      </HideForRole>
      
      {/* Admin tools */}
      <RoleBasedUI requiredRole="admin">
        <AdminTools />
      </RoleBasedUI>
    </div>
  );
}
```

### Example 2: Settings Page with Graduated Access

```tsx
import { RoleBasedUI, RequireRole } from '@/components/RoleBasedUI';

function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Everyone can access */}
      <section>
        <h2>Profile Settings</h2>
        <ProfileForm />
      </section>

      {/* Partners and admins */}
      <RequireRole 
        requiredRole={['partner', 'admin']}
        message="Upgrade to Partner to manage collaboration settings"
      >
        <section>
          <h2>Collaboration Settings</h2>
          <PartnerPreferences />
        </section>
      </RequireRole>

      {/* Admins only */}
      <RoleBasedUI requiredRole="admin">
        <section>
          <h2>Platform Administration</h2>
          <AdminControls />
        </section>
      </RoleBasedUI>
    </div>
  );
}
```

### Example 3: Dream Card with Role-Based Actions

```tsx
import { useHasRole } from '@/components/ProtectedRoute';
import { RoleBasedUI } from '@/components/RoleBasedUI';

function DreamCard({ dream }) {
  const isAdmin = useHasRole('admin');
  const canCollaborate = useHasRole(['partner', 'admin']);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dream.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p>{dream.description}</p>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button onClick={handleEdit}>Edit</Button>
        
        {canCollaborate && (
          <Button variant="outline" onClick={handleAddPartner}>
            Add Partner
          </Button>
        )}
        
        {isAdmin && (
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </CardFooter>
      
      {/* Show partner list for partners */}
      <RoleBasedUI requiredRole={['partner', 'admin']}>
        <CardFooter>
          <PartnerList partners={dream.partners} />
        </CardFooter>
      </RoleBasedUI>
    </Card>
  );
}
```

### Example 4: Navigation with Role-Based Menu Items

```tsx
import { useUserRole } from '@/components/ProtectedRoute';
import { RoleSwitcher } from '@/components/RoleBasedUI';

function MainNavigation() {
  const userRole = useUserRole();

  return (
    <nav className="flex items-center gap-4">
      {/* Common navigation */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/progress">Progress</NavLink>
      
      {/* Role-specific navigation */}
      <RoleSwitcher
        user={null}
        partner={
          <>
            <NavLink to="/convoy">Partners</NavLink>
            <NavLink to="/shared">Shared Dreams</NavLink>
          </>
        }
        admin={
          <>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/analytics">Analytics</NavLink>
            <NavLink to="/users">Users</NavLink>
          </>
        }
      />
      
      {/* Profile menu with role badge */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar />
          <Badge>{userRole}</Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
```

---

## Best Practices

1. **Use the right component for the job:**
   - `RoleBasedUI`: For showing/hiding UI elements
   - `ProtectedRoute`: For protecting entire routes
   - `useHasRole`: For conditional logic and multiple checks
   - `RoleSwitcher`: For completely different UIs per role

2. **Always provide fallbacks:**
   ```tsx
   <RoleBasedUI 
     requiredRole="admin"
     fallback={<p>Upgrade to access this feature</p>}
   >
     <AdminFeature />
   </RoleBasedUI>
   ```

3. **Combine hooks for complex logic:**
   ```tsx
   const isAdmin = useHasRole('admin');
   const canEdit = isAdmin || isOwner;
   ```

4. **Remember: Client-side checks are for UX only**
   - Always validate permissions server-side
   - Use Supabase RLS policies
   - Check roles in Edge Functions

5. **Keep role checks readable:**
   ```tsx
   // Good
   const canManageUsers = useHasRole('admin');
   if (canManageUsers) { /* ... */ }
   
   // Avoid
   if (useHasRole('admin')) { /* ... */ }
   ```

---

For more information, see:
- [ROLE_BASED_ACCESS.md](./ROLE_BASED_ACCESS.md) - Complete implementation guide
- [QUICK_ROLE_INTEGRATION.md](./QUICK_ROLE_INTEGRATION.md) - Quick setup guide

