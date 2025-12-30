# System Architecture

## Two User Roles

Dreamaker uses a simple two-role system:

### 1. **User** (Default) 👤
- Regular platform users
- Access to all core features:
  - Create and track personal dreams
  - Sidekick AI assistant
  - Progress tracking and journaling
  - Personal vision board
  - Convoy (accountability partners)
  - All standard platform functionality

### 2. **Admin** 🛡️
- Platform administrators
- All user features, plus:
  - User management (invite, suspend, delete)
  - Analytics dashboard
  - Personal Empowerment Score metrics
  - Content moderation (future)
  - Platform oversight

## Role Assignment

**During Onboarding:**
- Users select their role from a dropdown
- Defaults to "User"
- Can select "Admin" if applicable

**Role is stored in:**
- `profiles` table in Supabase
- `userStore` in application state
- Persisted to localStorage

## Important Note: "Partners" Are Not a Role

The term "partner" in Dreamaker refers to **accountability partners** - a feature where users support each other's goals. This is NOT a user role:

- ✅ Accountability partners = Feature (users helping users)
- ❌ Partner role = Does not exist

All accountability partner features are available to regular "user" role.

## Database Schema

```sql
-- Role enum with two values
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Profiles table includes role
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'user' NOT NULL;
```

## TypeScript Types

```typescript
// Defined in /src/stores/userStore.ts
export type UserRole = 'user' | 'admin';

// Profile interface
interface UserProfile {
  name: string;
  email: string;
  role?: UserRole;
}
```

## Usage Examples

### Check if user is admin

```tsx
import { useHasRole } from '@/components/ProtectedRoute';

function MyComponent() {
  const isAdmin = useHasRole('admin');
  
  return (
    <div>
      {isAdmin && <AdminButton />}
    </div>
  );
}
```

### Protect admin routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Conditional UI rendering

```tsx
import { RoleBasedUI } from '@/components/RoleBasedUI';

<RoleBasedUI requiredRole="admin">
  <AdminTools />
</RoleBasedUI>
```

## Files & Components

**Core Files:**
- `/src/stores/userStore.ts` - Role type and state management
- `/src/components/ProtectedRoute.tsx` - Route protection
- `/src/components/RoleBasedUI.tsx` - Conditional rendering
- `/src/integrations/supabase/types.ts` - Database types

**Onboarding:**
- `/src/components/onboarding/steps/WelcomeStep.tsx` - Role selection dropdown

**Documentation:**
- `/docs/ADMIN_FEATURES.md` - Detailed admin capabilities
- `/docs/SYSTEM_ARCHITECTURE.md` - This file
- `/docs/ENHANCEMENTS_BACKLOG.md` - Future enhancements (including partner visibility features)

## Security

### Client-Side (UX)
- Role checks hide/show UI elements
- Improves user experience
- NOT for security

### Server-Side (Security)
- Always validate role in backend
- Use Supabase Row Level Security (RLS)
- Validate in Edge Functions
- Never trust client-side role checks

**Example RLS Policy:**
```sql
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    role = 'admin' OR id = auth.uid()
  );
```

## Migration from Three Roles

If upgrading from a previous version that had a 'partner' role:

```sql
-- Update existing partner users to user role
UPDATE profiles SET role = 'user' WHERE role = 'partner';

-- Drop and recreate enum
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN role TYPE TEXT;
DROP TYPE user_role;
CREATE TYPE user_role AS ENUM ('user', 'admin');
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
```

## Summary

✅ Two roles: `user` and `admin`  
✅ Simple, clear separation of permissions  
✅ Admin has full platform access  
✅ Users have all core features  
✅ Accountability partners are a feature, not a role  
✅ Role selected during onboarding  
✅ Stored in database and application state  

For detailed admin features, see `/docs/ADMIN_FEATURES.md`.

