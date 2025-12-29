# Role-Based Access Control (RBAC) Implementation Guide

This guide explains how to implement and use role-based access control in the Dreamaker application.

## Table of Contents

1. [Overview](#overview)
2. [Database Setup](#database-setup)
3. [Components](#components)
4. [Integration](#integration)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

---

## Overview

The RBAC system supports three roles:
- **user**: Regular users who track personal dreams
- **partner**: Users who can collaborate and support others
- **admin**: Administrators with full platform access

---

## Database Setup

### 1. Run SQL Migration in Supabase

Open your Supabase SQL Editor and run:

```sql
-- Add role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin', 'partner');

-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN role user_role DEFAULT 'user' NOT NULL;

-- Create index for faster role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);

-- Row Level Security Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 2. Update TypeScript Types

The types in `/src/integrations/supabase/types.ts` have been updated to include:
- `user_role` enum in the Enums section
- `role` field in the profiles table Row, Insert, and Update types

---

## Components

### ProtectedRoute Component

Located at: `/src/components/ProtectedRoute.tsx`

Protects routes based on user role(s).

**Props:**
- `children`: Component to render if access is granted
- `requiredRole`: Single role or array of roles (optional)
- `fallbackPath`: Redirect path if access denied (default: '/')
- `showAccessDenied`: Show access denied message instead of redirect

**Hooks Exported:**
- `useHasRole(role)`: Check if user has specific role(s)
- `useUserRole()`: Get current user's role

### RoleSelectionStep Component

Located at: `/src/components/onboarding/steps/RoleSelectionStep.tsx`

Allows users to select their role during onboarding.

**Props:**
- `selectedRole`: Currently selected role
- `onSelectRole`: Callback when role is selected
- `onNext`: Callback to proceed to next step
- `onBack`: Optional callback to go back

---

## Integration

### Adding Role Selection to Onboarding

1. **Update Onboarding.tsx** to include the role selection step:

```tsx
import { RoleSelectionStep } from '@/components/onboarding/steps/RoleSelectionStep';

// Add to renderStep() switch statement (e.g., as step 1 or 2):
case 1:
  return (
    <RoleSelectionStep
      selectedRole={state.userRole}
      onSelectRole={(role) => updateState({ userRole: role })}
      onNext={nextStep}
      onBack={prevStep}
    />
  );
```

2. **Update handleComplete()** to save the role:

```tsx
const handleComplete = async () => {
  // Save profile with role
  setProfile({
    name: state.userName || "User",
    email: state.userEmail || "",
    role: state.userRole || 'user', // Include the selected role
  });

  // If using Supabase, update the profile:
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ role: state.userRole || 'user' })
        .eq('id', user.id);
    }
  }

  // Continue with existing logic...
  addDream({ /* ... */ });
  clearState();
  setOnboardingComplete(true);
  navigate('/');
};
```

3. **Update TOTAL_STEPS** and **ESTIMATED_TIME_PER_STEP** arrays to include the new step.

### Protecting Routes in App.tsx

See `/src/App.example.tsx` for a complete example.

**Basic pattern:**

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

// In your Routes:
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/convoy" 
  element={
    <ProtectedRoute requiredRole={['user', 'partner']}>
      <Convoy />
    </ProtectedRoute>
  } 
/>
```

---

## Usage Examples

### 1. Route Protection

**Admin-only route:**
```tsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

**Multiple roles:**
```tsx
<Route 
  path="/shared" 
  element={
    <ProtectedRoute requiredRole={['admin', 'partner']}>
      <SharedPage />
    </ProtectedRoute>
  } 
/>
```

**Show access denied instead of redirect:**
```tsx
<Route 
  path="/settings" 
  element={
    <ProtectedRoute requiredRole="admin" showAccessDenied>
      <Settings />
    </ProtectedRoute>
  } 
/>
```

### 2. Conditional Rendering

**Using the useHasRole hook:**
```tsx
import { useHasRole } from '@/components/ProtectedRoute';

function Dashboard() {
  const isAdmin = useHasRole('admin');
  const canManagePartners = useHasRole(['admin', 'partner']);

  return (
    <div>
      <h1>Dashboard</h1>
      
      {isAdmin && (
        <Button onClick={handleAdminAction}>
          Admin Panel
        </Button>
      )}
      
      {canManagePartners && (
        <PartnerManagement />
      )}
    </div>
  );
}
```

**Using the useUserRole hook:**
```tsx
import { useUserRole } from '@/components/ProtectedRoute';

function Navigation() {
  const userRole = useUserRole();

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {userRole === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      {userRole === 'partner' && <NavLink to="/partner">Partner</NavLink>}
    </nav>
  );
}
```

### 3. Direct Store Access

**Using userStore:**
```tsx
import { useUserStore } from '@/stores/userStore';

function MyComponent() {
  const hasRole = useUserStore((state) => state.hasRole);
  const profile = useUserStore((state) => state.profile);

  if (hasRole('admin')) {
    return <AdminView />;
  }

  return <UserView />;
}
```

### 4. API Request Role Checking

**Server-side validation (Supabase Edge Function):**
```typescript
// In your Supabase Edge Function
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Get user from auth header
const authHeader = req.headers.get('Authorization')!;
const token = authHeader.replace('Bearer ', '');
const { data: { user } } = await supabase.auth.getUser(token);

// Check user role
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile.role !== 'admin') {
  return new Response('Unauthorized', { status: 403 });
}

// Continue with admin operation...
```

---

## Best Practices

### 1. Always Validate on Backend
- Client-side role checks are for UX only
- Always validate roles on the server/database level
- Use Supabase RLS policies for automatic enforcement

### 2. Use Least Privilege Principle
- Grant minimum required permissions
- Default to 'user' role for new accounts
- Require explicit elevation to 'partner' or 'admin'

### 3. Audit Trail
Consider adding role change tracking:
```sql
CREATE TABLE role_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  old_role user_role,
  new_role user_role,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Role Change Notifications
When implementing role changes, notify users:
```tsx
const handleRoleChange = async (userId: string, newRole: UserRole) => {
  // Update role in database
  await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  // Send notification
  toast({
    title: "Role Updated",
    description: `User role has been changed to ${newRole}`,
  });

  // Log the change
  await supabase
    .from('role_changes')
    .insert({
      user_id: userId,
      new_role: newRole,
      changed_by: currentUser.id,
    });
};
```

### 5. Testing Different Roles
Use dev mode to test different roles:
```tsx
// In development, add role switcher
{import.meta.env.DEV && (
  <select onChange={(e) => updateProfile({ role: e.target.value as UserRole })}>
    <option value="user">User</option>
    <option value="partner">Partner</option>
    <option value="admin">Admin</option>
  </select>
)}
```

---

## Troubleshooting

### Users Can't Access Protected Routes
1. Check that the user's profile has a role set
2. Verify RLS policies are correctly configured
3. Check that the route is using ProtectedRoute correctly

### Role Not Persisting
1. Ensure userStore is using persist middleware (already configured)
2. Check localStorage for 'dreamaker_user_profile'
3. Verify Supabase profile is updated correctly

### Type Errors
1. Run TypeScript compiler: `npm run type-check`
2. Ensure all role-related types are imported from the correct locations
3. Check that Database types are up to date

---

## Summary

The RBAC system provides:
- ✅ Database-level role enforcement
- ✅ Type-safe role checking
- ✅ Easy-to-use ProtectedRoute component
- ✅ Flexible role-based rendering
- ✅ Onboarding integration
- ✅ Server-side validation support

For questions or issues, refer to the components and examples in this guide.

