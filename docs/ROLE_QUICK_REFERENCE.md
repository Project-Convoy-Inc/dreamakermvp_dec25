# Role-Based Access Control - Quick Reference

## 🎯 The Two Roles

| Role | Icon | Description | Key Features |
|------|------|-------------|--------------|
| **user** | 👤 | Individual dreamer | Personal dreams, progress tracking, Sidekick AI, accountability partners |
| **admin** | 🛡️ | Platform admin | All user features + user management, analytics, full platform access |

**Note:** "Partners" refers to accountability partners (a feature), not a user role.

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Database Setup
```sql
CREATE TYPE user_role AS ENUM ('user', 'admin');
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'user' NOT NULL;
```

### 2️⃣ Add to Onboarding
```tsx
import { RoleSelectionStep } from '@/components/onboarding/steps/RoleSelectionStep';

// In renderStep():
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

### 3️⃣ Protect Routes
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 📦 Components Cheat Sheet

### ProtectedRoute
**Purpose:** Protect entire routes  
**Location:** `/src/components/ProtectedRoute.tsx`

```tsx
// Single role
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>

// Admin only
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>

// Show access denied
<ProtectedRoute requiredRole="admin" showAccessDenied>
  <Settings />
</ProtectedRoute>
```

### RoleBasedUI
**Purpose:** Show/hide UI elements  
**Location:** `/src/components/RoleBasedUI.tsx`

```tsx
// Simple
<RoleBasedUI requiredRole="admin">
  <AdminButton />
</RoleBasedUI>

// With fallback
<RoleBasedUI 
  requiredRole="admin"
  fallback={<AccessDenied />}
>
  <AdminFeature />
</RoleBasedUI>
```

### HideForRole
**Purpose:** Hide content from specific roles

```tsx
<HideForRole role="user">
  <PremiumFeature />
</HideForRole>
```

### RoleSwitcher
**Purpose:** Different content per role

```tsx
<RoleSwitcher
  user={<UserDashboard />}
  admin={<AdminDashboard />}
/>
```

### RequireRole
**Purpose:** Show upgrade prompt

```tsx
<RequireRole 
  requiredRole="partner"
  message="Upgrade to Partner"
>
  <Feature />
</RequireRole>
```

---

## 🎣 Hooks Cheat Sheet

### useHasRole
**Purpose:** Check if user has role(s)  
**Returns:** `boolean`

```tsx
import { useHasRole } from '@/components/ProtectedRoute';

const isAdmin = useHasRole('admin');
const isUser = useHasRole('user');

if (isAdmin) {
  // Do admin thing
}
```

### useUserRole
**Purpose:** Get current user's role  
**Returns:** `UserRole | undefined`

```tsx
import { useUserRole } from '@/components/ProtectedRoute';

const role = useUserRole();

switch (role) {
  case 'admin': return <AdminUI />;
  default: return <UserUI />;
}
```

---

## 🏪 Store Methods

### hasRole()
```tsx
import { useUserStore } from '@/stores/userStore';

const hasRole = useUserStore((state) => state.hasRole);

if (hasRole('admin')) {
  // Admin logic
}
```

### setProfile()
```tsx
const setProfile = useUserStore((state) => state.setProfile);

setProfile({
  name: "John Doe",
  email: "john@example.com",
  role: "partner"
});
```

---

## 🎨 Common Patterns

### Pattern 1: Role-Based Button
```tsx
function ActionBar() {
  const isAdmin = useHasRole('admin');
  
  return (
    <div>
      <Button>Save</Button>
      {isAdmin && <Button>Delete</Button>}
    </div>
  );
}
```

### Pattern 2: Role-Based Navigation
```tsx
function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <RoleBasedUI requiredRole="admin">
        <NavLink to="/admin">Admin</NavLink>
      </RoleBasedUI>
    </nav>
  );
}
```

### Pattern 3: Role-Based Data Fetching
```tsx
function Dashboard() {
  const isAdmin = useHasRole('admin');
  
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    enabled: isAdmin,
  });
  
  return <div>{/* ... */}</div>;
}
```

### Pattern 4: Role-Based Features
```tsx
function DreamCard() {
  const isAdmin = useHasRole('admin');
  
  return (
    <Card>
      <Title />
      <Content />
      {isAdmin && <AdminActions />}
    </Card>
  );
}
```

### Pattern 5: Multiple Role Checks
```tsx
function FeaturePage() {
  return (
    <div>
      {/* Everyone */}
      <BasicFeature />
      
      {/* Partners and admins */}
      <RoleBasedUI requiredRole={['partner', 'admin']}>
        <CollaborationFeature />
      </RoleBasedUI>
      
      {/* Admins only */}
      <RoleBasedUI requiredRole="admin">
        <AdminFeature />
      </RoleBasedUI>
    </div>
  );
}
```

---

## 🔐 Security Checklist

- [ ] ✅ Client-side checks implemented (UX)
- [ ] ⚠️ Server-side validation added (Security)
- [ ] ✅ Supabase RLS policies configured
- [ ] ✅ Edge functions validate roles
- [ ] ✅ Audit logging for role changes

### Example RLS Policy
```sql
CREATE POLICY "Only admins can delete dreams"
  ON dreams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Route not protected | Wrap with `<ProtectedRoute>` |
| UI still showing | Use `<RoleBasedUI>` or `useHasRole()` |
| Role not saving | Check `setProfile()` includes `role` |
| TypeScript error | Run `npm install` and check imports |
| Database error | Verify migration ran in Supabase |

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `/src/components/ProtectedRoute.tsx` | Route protection |
| `/src/components/RoleBasedUI.tsx` | UI components |
| `/src/components/onboarding/steps/RoleSelectionStep.tsx` | Onboarding step |
| `/src/stores/userStore.ts` | User state + role |
| `/src/types/onboarding.ts` | Onboarding types |
| `/src/integrations/supabase/types.ts` | Database types |
| `/src/App.example.tsx` | Usage example |

---

## 📚 Documentation

| Document | When to Use |
|----------|-------------|
| `ROLE_QUICK_REFERENCE.md` | Quick lookup (you are here!) |
| `QUICK_ROLE_INTEGRATION.md` | Step-by-step setup |
| `ROLE_BASED_ACCESS.md` | Complete guide |
| `ROLE_UI_EXAMPLES.md` | Code examples |
| `ROLE_IMPLEMENTATION_SUMMARY.md` | Overview |

---

## ⚡ Quick Commands

```bash
# Type check
npm run type-check

# Clear storage (testing)
localStorage.clear()

# Check role in console
JSON.parse(localStorage.getItem('dreamaker_user_profile'))

# Dev role switcher (add to component)
<select onChange={(e) => updateProfile({ role: e.target.value })}>
  <option value="user">User</option>
  <option value="partner">Partner</option>
  <option value="admin">Admin</option>
</select>
```

---

## 💡 Pro Tips

1. **Always use TypeScript types** - Import `UserRole` from `@/stores/userStore`
2. **Combine hooks for readability** - `const canEdit = useHasRole('admin') || isOwner`
3. **Provide fallbacks** - Better UX than hiding content silently
4. **Test all roles** - Use dev role switcher
5. **Validate server-side** - Client checks are for UX only

---

## 🎉 You're Ready!

You now have everything needed for role-based access control:

✅ Components  
✅ Hooks  
✅ Types  
✅ Documentation  
✅ Examples  

Start with `QUICK_ROLE_INTEGRATION.md` for step-by-step setup!

