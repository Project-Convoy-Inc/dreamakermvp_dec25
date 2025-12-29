# Database Role Migration Guide

## For New Installations

If you're setting up Dreamaker for the first time, run this SQL in your Supabase SQL Editor:

```sql
-- Create role enum with two values
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Add role column to profiles table  
ALTER TABLE profiles 
ADD COLUMN role user_role DEFAULT 'user' NOT NULL;

-- Create index for faster queries
CREATE INDEX idx_profiles_role ON profiles(role);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Only admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## For Existing Installations (Upgrading from 3 roles to 2)

If you previously had a 'partner' role and need to migrate to the two-role system:

```sql
-- Step 1: Update all 'partner' users to 'user' role
UPDATE profiles SET role = 'user' WHERE role = 'partner';

-- Step 2: Drop default temporarily
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- Step 3: Convert column to text
ALTER TABLE profiles ALTER COLUMN role TYPE TEXT;

-- Step 4: Drop old enum
DROP TYPE IF EXISTS user_role;

-- Step 5: Create new enum with only 2 values
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Step 6: Convert column back to enum
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role 
USING role::user_role;

-- Step 7: Restore default
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'user';
```

## Verify Migration

Run this query to check your role distribution:

```sql
SELECT role, COUNT(*) as user_count
FROM profiles
GROUP BY role
ORDER BY role;
```

Expected output:
```
role   | user_count
-------+-----------
admin  | 1 (or more)
user   | (majority of users)
```

## TypeScript Types

The TypeScript types are already updated in:
- `/src/stores/userStore.ts` - `UserRole` type
- `/src/integrations/supabase/types.ts` - Database types

No code changes needed if you've pulled the latest version.

## Testing

After migration, test:

1. **Login as regular user:**
   - Can access user features
   - Cannot access admin routes
   - Profile shows role: 'user'

2. **Login as admin:**
   - Can access all features
   - Can access admin dashboard
   - Profile shows role: 'admin'

3. **Onboarding:**
   - Role dropdown shows only User and Admin
   - Defaults to User
   - Selected role is saved correctly

## Rollback (If Needed)

If you need to rollback to 3 roles:

```sql
-- Add partner role back
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN role TYPE TEXT;
DROP TYPE user_role;
CREATE TYPE user_role AS ENUM ('user', 'admin', 'partner');
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
```

Then revert code changes in git.

## Support

If you encounter issues:
- Check Supabase logs for errors
- Verify all users have valid roles
- Ensure RLS policies are applied
- Check console for TypeScript errors

---

**Last Updated:** December 2025

