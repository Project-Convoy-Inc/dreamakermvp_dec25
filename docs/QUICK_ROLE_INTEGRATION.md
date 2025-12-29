# Quick Role Integration Guide

This guide shows you exactly how to add role selection to your onboarding flow.

## Step 1: Run SQL Migration

Open Supabase SQL Editor and run:

```sql
CREATE TYPE user_role AS ENUM ('user', 'admin', 'partner');
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'user' NOT NULL;
CREATE INDEX idx_profiles_role ON profiles(role);
```

## Step 2: Update Onboarding.tsx

### 2.1 Import RoleSelectionStep

Add to the imports at the top of `/src/pages/Onboarding.tsx`:

```tsx
import { RoleSelectionStep } from '@/components/onboarding/steps/RoleSelectionStep';
```

### 2.2 Update Step Constants

Change from:
```tsx
const TOTAL_STEPS = 10;
const ESTIMATED_TIME_PER_STEP = [1, 1, 2, 1, 3, 2, 2, 1, 2, 1];
```

To:
```tsx
const TOTAL_STEPS = 11; // Added one more step
const ESTIMATED_TIME_PER_STEP = [1, 1, 1, 2, 1, 3, 2, 2, 1, 2, 1]; // Added 1 min for role selection
```

### 2.3 Add Role Selection to renderStep()

In the `renderStep()` function, add this case after the WelcomeStep (case 0):

```tsx
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

And update the existing cases to shift by one:
- Old case 1 (SidekickStep) → becomes case 2
- Old case 2 (VisionPromptStep) → becomes case 3
- And so on...

**Full example:**

```tsx
const renderStep = () => {
  switch (state.currentStep) {
    case 0:
      return <WelcomeStep onNext={nextStep} />;
    
    case 1: // NEW: Role Selection
      return (
        <RoleSelectionStep
          selectedRole={state.userRole}
          onSelectRole={(role) => updateState({ userRole: role })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );
    
    case 2: // Was case 1
      return (
        <SidekickStep
          selectedAvatar={state.sidekickAvatar}
          onSelectAvatar={(id) => updateState({ sidekickAvatar: id })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );
    
    case 3: // Was case 2
      return (
        <VisionPromptStep
          value={state.whatYouWant}
          onChange={(value) => updateState({ whatYouWant: value })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );
    
    // Continue shifting all other cases...
  }
};
```

### 2.4 Update handleComplete()

Update the `handleComplete()` function to save the role:

```tsx
const handleComplete = () => {
  // Create the dream from onboarding data
  addDream({
    title: state.whatYouWant,
    description: state.visionDescription,
    imageUrl: state.generatedImageUrl || undefined,
    timeFrame: 'mid',
    domain: 'work',
  });

  // Save profile WITH role
  setProfile({
    name: "User", // You might want to capture this in onboarding
    email: "user@example.com", // You might want to capture this too
    role: state.userRole || 'user', // NEW: Include the role
  });

  clearState();
  setOnboardingComplete(true);
  
  toast({
    title: "Vision created!",
    description: "Your first vision has been added to your board.",
  });
  
  navigate('/');
};
```

## Step 3: Update Progress Dots Visibility

Update the step number where progress dots should be hidden:

Change from:
```tsx
{state.currentStep !== 8 && ( // Generating step
```

To:
```tsx
{state.currentStep !== 9 && ( // Generating step (was 8, now 9)
```

## Step 4: Update Swipe Gesture Conditions

Update the swipe gesture condition:

Change from:
```tsx
const canSwipe = state.currentStep !== 8 && state.currentStep !== 9;
```

To:
```tsx
const canSwipe = state.currentStep !== 9 && state.currentStep !== 10;
```

## Complete Diff for Onboarding.tsx

Here's what changes in your `Onboarding.tsx`:

```diff
+ import { RoleSelectionStep } from '@/components/onboarding/steps/RoleSelectionStep';

- const TOTAL_STEPS = 10;
+ const TOTAL_STEPS = 11;

- const ESTIMATED_TIME_PER_STEP = [1, 1, 2, 1, 3, 2, 2, 1, 2, 1];
+ const ESTIMATED_TIME_PER_STEP = [1, 1, 1, 2, 1, 3, 2, 2, 1, 2, 1];

- const canSwipe = state.currentStep !== 8 && state.currentStep !== 9;
+ const canSwipe = state.currentStep !== 9 && state.currentStep !== 10;

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      
+     case 1:
+       return (
+         <RoleSelectionStep
+           selectedRole={state.userRole}
+           onSelectRole={(role) => updateState({ userRole: role })}
+           onNext={nextStep}
+           onBack={prevStep}
+         />
+       );
      
-     case 1:
+     case 2:
        return (
          <SidekickStep
            // ... same code
          />
        );
      
-     case 2:
+     case 3:
        return (
          <VisionPromptStep
            // ... same code
          />
        );
      
      // ... continue shifting all cases by 1
    }
  };

  const handleComplete = () => {
    // ... existing code ...
    
+   setProfile({
+     name: "User",
+     email: "user@example.com",
+     role: state.userRole || 'user',
+   });

-   {state.currentStep !== 8 && (
+   {state.currentStep !== 9 && (
      <>
        <ProgressDots currentStep={state.currentStep} totalSteps={TOTAL_STEPS} />
```

## Step 5: Optional - Add Supabase Integration

If you want to save the role to Supabase during onboarding:

```tsx
import { supabase } from '@/integrations/supabase/client';

const handleComplete = async () => {
  // ... existing dream creation code ...

  // Save to Supabase if available
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          name: "User",
          role: state.userRole || 'user' 
        })
        .eq('id', user.id);
    }
  }

  // ... rest of existing code ...
};
```

## Step 6: Protect Routes (Optional)

See `/src/App.example.tsx` for how to add protected routes with role-based access.

Quick example:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

// In your routes:
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

## Testing

1. Clear your localStorage: `localStorage.clear()`
2. Refresh the app
3. You should see the role selection step after the welcome screen
4. Select a role and complete onboarding
5. Check localStorage: `JSON.parse(localStorage.getItem('dreamaker_user_profile'))`
6. You should see `role: "user"` (or whatever you selected)

## Troubleshooting

**Role selection step not showing:**
- Make sure you incremented TOTAL_STEPS
- Check that the import for RoleSelectionStep is correct
- Verify the case number in renderStep()

**Role not saving:**
- Check that updateState is being called with `userRole`
- Verify setProfile includes the role in handleComplete
- Check browser console for errors

**TypeScript errors:**
- Run `npm install` to ensure all dependencies are up to date
- The types have already been updated in the codebase

That's it! You now have role-based access control integrated into your onboarding flow.

