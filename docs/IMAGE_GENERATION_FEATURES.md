# Image Generation Features

## Document Purpose
This document details the image generation, enhancement, and refinement features from the `evolve-with-osa-v2` prototype. These features enable users to create, enhance, and iteratively refine AI-generated visualizations of their goals and dreams.

**Source Prototype**: `evolve-with-osa-v2`  
**Last Updated**: December 2025  
**Status**: 📋 Reference Document (To be incorporated later)

---

## Overview

The image generation system provides a complete workflow for:
1. **Prompt Enhancement** - Improving user prompts for better image generation
2. **Image Generation** - Creating initial AI-generated images
3. **Image Refinement** - Iteratively refining images through text-based edits

All features integrate with Supabase edge functions and support goal/dream association, position tracking, and refinement history.

---

## 1. Prompt Enhancement

### Description
Enhances user-provided prompts to improve the quality and specificity of AI-generated images. Uses AI to expand and refine prompts before image generation.

### Location
- **Edge Function**: `supabase/functions/enhance-prompt/index.ts`
- **Service Layer**: `src/lib/edge-functions.ts` (enhancePrompt function)
- **Usage**: Called before image generation to improve prompts

### Features
- Takes user's original prompt
- Uses AI to enhance/expand the prompt
- Returns both original and enhanced prompts
- Provides explanation text for the enhancement

### API Interface
```typescript
interface EnhancePromptParams {
  prompt: string;
}

interface EnhancePromptResponse {
  original_prompt: string;
  enhanced_prompt: string;
  text: string; // Explanation text
}
```

### Implementation Notes
- Can be called optionally before image generation
- Helps users who struggle with prompt writing
- Provides transparency by showing both original and enhanced prompts
- May be integrated into the image generation flow or offered as an optional step

---

## 2. Image Generation

### Description
Generates AI images from text prompts, with support for goal association, positioning, and inspiration card tracking.

### Location
- **Edge Function**: `supabase/functions/generate-image/index.ts`
- **Service Layer**: `src/lib/image-service.ts` (generateImageService)
- **Components**: 
  - `src/components/GoalImagination.tsx` - Goal-based generation
  - `src/components/InspirationImagination.tsx` - Inspiration card generation
  - `src/components/AddImageModal.tsx` - Direct image addition

### Features

#### 2.1 Basic Image Generation
- **Input**: Text prompt describing desired image
- **Output**: Generated image with unique ID and storage URL
- **Storage**: Images stored in Supabase Storage
- **Database**: Image metadata saved to `images` table

#### 2.2 Goal Association
- Images can be linked to specific user goals
- Goal text stored with image for context
- Enables goal-specific visualizations

#### 2.3 Position Tracking
- Images can be positioned on a life board
- X/Y coordinates stored in database
- Enables spatial organization of visualizations

#### 2.4 Inspiration Card Tracking
- Tracks if image was generated from inspiration card
- Stores the inspiration prompt used
- Prevents duplicate inspiration card usage

### API Interface
```typescript
interface GenerateImageParams {
  prompt: string;
  user_id: string;
  life_board_id?: string;
  position_x?: number;
  position_y?: number;
  goal_id?: string;
  inspiration_card_prompt?: string;
  image_id?: string; // For regeneration scenarios
}

interface GenerateImageResponse {
  imageUrl: string; // Storage path, not full URL
  message: string;
  imageId: string;
}
```

### Workflow

#### Standard Generation Flow
1. User provides prompt (optionally enhanced)
2. Service calls `generate-image` edge function
3. Edge function:
   - Validates input
   - Calls AI image generation service
   - Uploads image to Supabase Storage
   - Saves metadata to database
   - Returns image ID and storage path
4. Frontend retrieves full URL using `get-image-url` function
5. Image displayed to user

#### Goal-Based Generation Flow
1. User creates/selects a goal
2. User describes their vision for achieving the goal
3. System generates image associated with that goal
4. Image can be positioned on life board
5. Goal-specific chat context includes the image

### Database Schema
```sql
-- images table structure (key fields)
images (
  id: uuid (primary key)
  user_id: uuid (foreign key to profiles)
  life_board_id: uuid (foreign key to life_boards)
  goal_id: uuid (foreign key to user_goals, nullable)
  image_url: text (storage path)
  prompt: text (generation prompt)
  inspiration_card_prompt: text (nullable)
  position_x: numeric
  position_y: numeric
  visualization_prompt: jsonb (stores refinement history)
  created_at: timestamp
  updated_at: timestamp
)
```

### Edge Function: `generate-image`
**Location**: `supabase/functions/generate-image/index.ts`

**Responsibilities**:
- Validate user authentication
- Process prompt (may call enhance-prompt internally)
- Call external AI image generation API
- Upload generated image to Supabase Storage
- Create database record with metadata
- Return image ID and storage path

**Error Handling**:
- Authentication errors → 401
- Invalid input → 400
- Generation failures → 500 with error details
- Storage errors → 500

---

## 3. Image Refinement

### Description
Allows users to iteratively refine generated images by providing text-based edit instructions. Maintains a history of all refinements.

### Location
- **Edge Function**: `supabase/functions/regenerate-image/index.ts`
- **Service Layer**: `src/lib/image-service.ts` (regenerateImageService)
- **Components**:
  - `src/components/ImageEditModal.tsx` - Main refinement interface
  - `src/components/LifeBoardImage.tsx` - Image display with edit options
  - `src/components/TweaksHistory.tsx` - Refinement history viewer

### Features

#### 3.1 Refinement Process
- **Input**: Editing prompt describing desired changes
- **Process**: Uses original image + edit instructions
- **Output**: New refined image (replaces or creates variant)
- **History**: All refinements tracked in `visualization_prompt` JSONB field

#### 3.2 Refinement History
- **Storage**: Stored as array in `visualization_prompt.tweaks`
- **Tracking**: Each refinement includes:
  - Prompt text
  - Timestamp
  - Order/index
- **Display**: Users can view all previous refinements
- **Context**: Each refinement builds on previous state

#### 3.3 Refinement UI Components

##### ImageEditModal
- Modal interface for editing images
- Text input for refinement prompt
- Preview of current image
- Generate/refine button
- Loading states
- Error handling

##### TweaksHistory
- Displays chronological list of refinements
- Shows prompt text and timestamp for each
- Visual timeline of changes
- Can be collapsed/expanded

##### LifeBoardImage
- Image display component with hover controls
- Edit button opens refinement modal
- Delete functionality
- Share/download options
- Chat integration for goal-specific assistance

### API Interface
```typescript
interface RegenerateImageParams {
  editing_prompt: string; // User's refinement instructions
  user_id: string;
  image_id: string; // Original image to refine
  position_x?: number;
  position_y?: number;
}

interface RegenerateImageResponse {
  imageUrl: string;
  message: string;
  imageId: string; // May be same or new ID
}
```

### Workflow

#### Refinement Flow
1. User views generated image
2. User clicks "Edit" or "Refine" button
3. Modal opens with:
   - Current image preview
   - Text input for refinement prompt
   - Tweaks history (if any)
4. User enters refinement instructions (e.g., "make it brighter", "add more people", "change the background to sunset")
5. System calls `regenerate-image` edge function
6. Edge function:
   - Loads original image and refinement history
   - Combines context with new refinement prompt
   - Calls AI image editing service
   - Uploads new image to storage
   - Updates database with new image URL and adds to tweaks history
7. Frontend refreshes image display
8. New refinement added to history

#### Refinement History Structure
```json
{
  "visualization_prompt": {
    "tweaks": [
      {
        "prompt": "make the colors more vibrant",
        "timestamp": "2025-12-01T10:00:00Z",
        "order": 1
      },
      {
        "prompt": "add more people in the background",
        "timestamp": "2025-12-01T10:15:00Z",
        "order": 2
      }
    ]
  }
}
```

### Edge Function: `regenerate-image`
**Location**: `supabase/functions/regenerate-image/index.ts`

**Responsibilities**:
- Validate user owns the image
- Load original image and refinement history
- Process refinement prompt with context
- Call AI image editing service
- Upload refined image to storage
- Update database record with new image and history
- Return new image ID and path

**Context Building**:
- Combines original prompt with all previous refinements
- Provides full context to AI for coherent refinements
- Maintains visual consistency across iterations

---

## 4. Supporting Features

### 4.1 Image URL Retrieval
**Location**: `supabase/functions/get-image-url/index.ts`

**Purpose**: Retrieves signed URLs from Supabase Storage

**Why Needed**: 
- Supabase Storage paths are not directly accessible
- Requires signed URLs for security
- Handles URL expiration and refresh

**Usage**: Called whenever displaying images to get current signed URL

### 4.2 Image Caching
**Location**: `src/hooks/useImageUrl.ts`

**Features**:
- Caches signed URLs to reduce API calls
- Handles URL expiration
- Provides refresh mechanism
- Loading states for UI

### 4.3 Image Operations
**Location**: `src/lib/image-operations.ts`

**Utilities**:
- Image validation
- Format conversion
- Size optimization
- Metadata extraction

---

## 5. Integration Points

### 5.1 Goal/Dream Association
- Images can be linked to goals/dreams
- Enables goal-specific visualizations
- Supports filtering and organization
- Integrates with goal-specific chat

### 5.2 Life Board Positioning
- Images positioned on visual board
- Coordinates stored in database
- Enables spatial organization
- Supports drag-and-drop interface

### 5.3 Onboarding Flow
- First image generated during onboarding
- Guides users through goal → vision → image workflow
- Creates initial life board visualization
- Sets up user's first goal visualization

### 5.4 Inspiration Deck
- Inspiration cards can trigger image generation
- Tracks which prompts have been used
- Prevents duplicate card usage
- Provides starting points for users

---

## 6. Technical Implementation Details

### 6.1 Service Layer Pattern
```
Component → Service Layer → Edge Function → External API → Storage → Database
```

**Benefits**:
- Separation of concerns
- Reusable service functions
- Centralized error handling
- Type safety with TypeScript

### 6.2 Error Handling
- **Network Errors**: Retry logic with exponential backoff
- **Generation Failures**: User-friendly error messages
- **Storage Errors**: Fallback and retry mechanisms
- **Validation Errors**: Clear feedback to users

### 6.3 Loading States
- Generation progress indicators
- Image loading placeholders
- Refinement status updates
- Optimistic UI updates where appropriate

### 6.4 Performance Considerations
- Image URL caching
- Lazy loading of images
- Progressive image loading
- Optimized storage paths

---

## 7. Database Schema

### Images Table
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  life_board_id UUID REFERENCES life_boards(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL, -- Storage path
  prompt TEXT NOT NULL, -- Original generation prompt
  inspiration_card_prompt TEXT, -- If from inspiration card
  position_x NUMERIC DEFAULT 100,
  position_y NUMERIC DEFAULT 100,
  visualization_prompt JSONB, -- Refinement history
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_life_board_id ON images(life_board_id);
CREATE INDEX idx_images_goal_id ON images(goal_id);
```

### Visualization Prompt Structure
```typescript
interface VisualizationPrompt {
  tweaks?: Array<{
    prompt: string;
    timestamp: string;
    order: number;
    applied_at?: string;
  }>;
  original_prompt?: string;
  enhanced_prompt?: string;
}
```

---

## 8. Component Files Reference

### Core Components
- `src/components/GoalImagination.tsx` - Goal-based image generation modal
- `src/components/InspirationImagination.tsx` - Inspiration card generation
- `src/components/AddImageModal.tsx` - Direct image addition
- `src/components/ImageEditModal.tsx` - Image refinement interface
- `src/components/LifeBoardImage.tsx` - Image display with controls
- `src/components/TweaksHistory.tsx` - Refinement history viewer

### Service Files
- `src/lib/image-service.ts` - Image generation/regeneration services
- `src/lib/edge-functions.ts` - Edge function wrappers
- `src/lib/image-operations.ts` - Image utility functions

### Hooks
- `src/hooks/useImageUrl.ts` - Image URL loading and caching

### Edge Functions
- `supabase/functions/generate-image/index.ts` - Image generation
- `supabase/functions/regenerate-image/index.ts` - Image refinement
- `supabase/functions/enhance-prompt/index.ts` - Prompt enhancement
- `supabase/functions/get-image-url/index.ts` - URL retrieval

---

## 9. Future Considerations

### Potential Enhancements
- **Batch Generation**: Generate multiple variations at once
- **Style Transfer**: Apply artistic styles to images
- **Image Merging**: Combine multiple images
- **Template System**: Pre-defined image templates
- **A/B Testing**: Compare different prompt strategies
- **Analytics**: Track which prompts generate best results
- **Collaboration**: Share and remix images with others
- **Export Options**: Multiple format and quality options

### Integration Opportunities
- Link to journal entries (timeline captures)
- Connect to activity tracking
- Share in community feed
- Use in progress visualizations
- Include in journey summaries

---

## 10. Questions & Decisions Needed

- [ ] **AI Service**: Which image generation service to use? (DALL-E, Midjourney, Stable Diffusion, etc.)
- [ ] **Storage Strategy**: Supabase Storage or alternative? Cost considerations?
- [ ] **Refinement Approach**: Replace original or create variants?
- [ ] **History Limits**: How many refinements to track/store?
- [ ] **Image Sizes**: What resolutions to generate? Multiple sizes?
- [ ] **Caching Strategy**: How long to cache signed URLs?
- [ ] **Cost Management**: Rate limiting, usage quotas, cost alerts?
- [ ] **Quality Control**: Moderation, content filtering, safety checks?

---

**Document Status**: 📋 Reference - Ready for implementation planning

