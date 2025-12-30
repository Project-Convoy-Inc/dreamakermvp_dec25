# Component Inventory

> **⚠️ ARCHIVED**: This document is archived as of December 2025. Most components listed here have been implemented. For ongoing enhancement tracking, see `/docs/ENHANCEMENTS_BACKLOG.md`.

## Document Purpose
This document tracks components, features, and design elements from various prototype codebases that will be incorporated into the Dreamaker MVP.

**Last Updated**: December 2025  
**Status**: 📦 ARCHIVED - See ENHANCEMENTS_BACKLOG.md for current tracking

---

## Prototype: dremakermvp

### Repository Information
- **Repository Name**: dremakermvp
- **GitHub URL**: https://github.com/Project-Convoy-Inc/dremakermvp
- **Location**: `/prototypes/dremakermvp/`
- **Technology Stack**: React + TypeScript + Vite, shadcn/ui, Tailwind CSS, Supabase
- **Status**: ✅ Selected components identified

---

## Components to Incorporate

### 1. Stylistic Guidance (Look & Feel) - Foundation

**Location**: 
- `src/index.css` - Design system definitions
- `tailwind.config.ts` - Tailwind configuration and custom theme

**Description**: 
Complete design system serving as the visual foundation for the MVP. Includes color palette, typography, animations, gradients, and mobile optimizations.

**Key Features**:
- **Color System**: HSL-based with light/dark mode support
  - Primary: Purple (270 70% 55% / 280 80% 65% dark)
  - Secondary: Pink (320 85% 60% / 320 85% 65% dark)
  - Accent: Cyan (190 85% 55% / 190 85% 60% dark)
  - Gold: (45 100% 60% / 45 100% 65% dark)
- **Gradients**: Primary, secondary, and radial gradient definitions
- **Glow Effects**: Custom box shadows with primary, accent, and secondary glows
- **Animations**: 
  - `pulse-glow` - Pulsing glow effect
  - `float` - Floating animation
  - `glow-pulse` - Glow pulsing
  - `scale-in`, `fade-in`, `slide-up` - Entry animations
- **Mobile Optimizations**: Touch-friendly interactions, safe area support, reduced motion support
- **Custom Utilities**: Perspective transforms, 3D effects, flowing gradient borders

**Priority**: 🔴 High (Foundation - must be implemented first)

**Status**: To be incorporated

**Notes**: 
- This will serve as the base design system for the entire MVP
- All colors are defined in HSL format for easy theme switching
- Includes comprehensive dark mode support
- Mobile-first responsive design patterns

**Files to Copy**:
- `src/index.css` (lines 58-244 - design system section)
- `tailwind.config.ts` (entire file)
- `src/App.css` (if any global styles)

---

### 2. UI Component Library (shadcn/ui Setup)

**Location**: 
- `src/components/ui/` - Complete shadcn/ui component library
- `components.json` - shadcn/ui configuration
- `src/lib/utils.ts` - Utility functions (cn helper)

**Description**: 
Complete shadcn/ui component library built on Radix UI primitives. Provides accessible, customizable UI components.

**Components Available**:
- Layout: `accordion`, `card`, `separator`, `sidebar`, `tabs`, `resizable`
- Forms: `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `form`, `label`
- Overlays: `dialog`, `alert-dialog`, `drawer`, `popover`, `hover-card`, `tooltip`, `sheet`
- Navigation: `navigation-menu`, `menubar`, `breadcrumb`, `pagination`
- Feedback: `toast`, `toaster`, `sonner`, `alert`, `progress`, `skeleton`
- Data Display: `table`, `avatar`, `badge`, `calendar`, `chart`, `carousel`
- Other: `aspect-ratio`, `collapsible`, `command`, `context-menu`, `dropdown-menu`, `input-otp`, `scroll-area`, `toggle`, `toggle-group`

**Priority**: 🔴 High (Foundation - required for all UI)

**Status**: To be incorporated

**Notes**: 
- All components are already styled with the design system
- Uses `cn()` utility for conditional class merging
- Fully accessible (WCAG compliant via Radix UI)
- TypeScript support throughout
- Can be selectively installed if not all components are needed

**Files to Copy**:
- Entire `src/components/ui/` directory
- `src/lib/utils.ts`
- `components.json` (for reference)

---

### 3. Journaling Feature (Journey/Timeline)

> **Note**: Journaling feature tracking has been moved to `/docs/ENHANCEMENTS_BACKLOG.md` (Section 9: Journal Enhancement). See that document for current status and implementation details.

**Status**: 📋 Tracked in ENHANCEMENTS_BACKLOG.md

**Original Details** (for reference):

**Location**: 
- `src/pages/Journey.tsx` - Main journaling page
- `src/components/TimelineEntryModal.tsx` - Entry creation/editing modal
- `src/components/JourneyShareButton.tsx` - Sharing functionality
- `src/components/CommentSection.tsx` - Comments on entries
- `src/components/ReactionBar.tsx` - Reactions/emojis

**Description**: 
Comprehensive journaling/timeline system that allows users to create, organize, and reflect on their journey entries. Maps to "Reflection Space" feature in PRD (Section 3.3).

**Key Features**:
- **Timeline View**: Chronological display of journal entries
- **Entry Creation**: 
  - Title and rich text content
  - Categories: Win 🏆, Learning 📚, Challenge 💪, Reflection 🤔, Milestone 🎯, Other 📝
  - Privacy levels: Private 🔒, Friends 👥, Family 👨‍👩‍👧‍👦, Public 🌍
  - Media uploads (images/videos with compression)
  - Link entries to specific dreams/goals
- **Filtering**: Filter by dream and privacy level
- **Pagination**: Infinite scroll with 20 items per page
- **Social Features**: Comments and reactions on entries
- **Sharing**: Share journey with others via token-based links
- **Editing**: Edit and delete existing entries
- **Visual Design**: Gradient backgrounds, category icons, privacy badges

**Priority**: 🔴 High

**Notes**: 
- Uses Supabase `timeline_captures` table
- Includes image optimization/compression utilities
- Privacy controls align with PRD requirements
- Can be linked to goals/dreams for integration with Vision Board

**Files to Copy**:
- `src/pages/Journey.tsx`
- `src/components/TimelineEntryModal.tsx`
- `src/components/JourneyShareButton.tsx`
- `src/components/CommentSection.tsx`
- `src/components/ReactionBar.tsx`
- Related hooks: `src/hooks/useViewHistory.ts` (if used)

**Database Requirements**:
- `timeline_captures` table with fields: id, user_id, title, content, capture_category, privacy_level, dream_id, media_urls, created_at

---

### 4. Vision Board (Integrated Life Vision)

**Location**: 
- `src/pages/VisionBoard.tsx` - Main vision board page
- `src/components/DreamCreationModal.tsx` - Dream creation
- `src/components/ActivityView.tsx` - Activity management
- `src/components/ActivityCard.tsx`, `ActivityModal.tsx`, `ActivityNode.tsx` - Activity components
- `src/components/MaterialsManager.tsx`, `MaterialsListModal.tsx`, `MaterialUploadButton.tsx` - Materials management
- `src/components/ChatWidget.tsx`, `FloatingChatButton.tsx` - AI chat integration
- `src/components/AncientWisdom.tsx` - Mantra/wisdom system
- `src/components/JourneyProgress.tsx` - Progress visualization
- `src/components/JourneySummary.tsx`, `JourneySummaryCard.tsx` - Journey summaries

**Description**: 
Visual board for managing dreams/goals with drag-and-drop organization, activities, materials, and AI assistance. Maps to "Integrated Life Vision" feature in PRD (Section 3.1).

**Key Features**:

#### 4.1 Visual Board & Organization
- **Drag-and-Drop**: Reorder dreams using @dnd-kit
- **Zones**: Short-term goals vs. long-term dreams
- **Grid Layout**: Responsive grid (6 items mobile, 12 desktop)
- **Dream Cards**: Visual representation with media (images/videos)
- **Flip Cards**: 3D flip effect to show details
- **Public/Private Dreams**: Toggle visibility

#### 4.2 Dream Creation & Management
- **Dream Creation Modal**: 
  - Title and description
  - Media upload (images/videos)
  - AI-generated visualizations
  - Reference images for generation
  - Domain categorization
  - Privacy settings
- **Dream Editing**: Edit descriptions, media, privacy
- **Dream Deletion**: Soft delete with confirmation

#### 4.3 Dream Activities/Tasks
- **Activity System**: Break down dreams into actionable activities
- **Activity Status**: Not started, In progress, Completed
- **Activity Tracking**: Time spent, commitment notes
- **Activity Ordering**: Locked/unlocked activities
- **Activity View**: Visual node-based or list view
- **Activity Cards**: Display activity details and progress

#### 4.4 Materials Management
- **File Upload**: Upload materials related to dreams
- **Material List**: View all materials for a dream
- **Material Context**: AI can use materials for assistance
- **File Processing**: Background processing of uploaded materials

#### 4.5 AI Chat Integration
- **Chat Widget**: Context-aware AI chat
- **Dream-Specific Context**: Chat knows about specific dream and its activities
- **Floating Button**: Always-accessible chat button
- **Conversation History**: Sidebar with chat history
- **Voice Support**: Realtime voice interaction (via edge function)

#### 4.6 Mantra System (AncientWisdom)
- **Wisdom Matching**: AI matches wisdom quotes to user's journey
- **Quote Display**: Beautiful card with quote and author
- **Tradition Info**: Includes tradition and approximate year
- **Mantra History**: Track user's mantras over time
- **Mantra Input**: Users can set their own mantras

#### 4.7 Progress & Insights
- **Journey Progress**: Visual progress indicators
- **Journey Summaries**: AI-generated summaries of progress
- **Summary Cards**: Display summaries for different timeframes

**Priority**: 🔴 High

**Status**: To be incorporated

**Notes**: 
- Complex feature with many sub-components
- Requires Supabase edge functions for AI features
- Drag-and-drop uses @dnd-kit library
- Media generation uses AI (image/video generation functions)
- Activities can be linked to timeline entries

**Files to Copy**:
- `src/pages/VisionBoard.tsx`
- `src/components/DreamCreationModal.tsx`
- `src/components/ActivityView.tsx`
- `src/components/ActivityCard.tsx`
- `src/components/ActivityModal.tsx`
- `src/components/ActivityNode.tsx`
- `src/components/MaterialsManager.tsx`
- `src/components/MaterialsListModal.tsx`
- `src/components/MaterialUploadButton.tsx`
- `src/components/ChatWidget.tsx`
- `src/components/FloatingChatButton.tsx`
- `src/components/ConversationHistorySidebar.tsx`
- `src/components/ChatMessage.tsx`
- `src/components/AncientWisdom.tsx`
- `src/components/JourneyProgress.tsx`
- `src/components/JourneySummary.tsx`
- `src/components/JourneySummaryCard.tsx`
- `src/components/UploadResultModal.tsx`
- `src/components/ViewHistoryModal.tsx`
- `src/components/DeliverableTimeline.tsx`

**Related Hooks**:
- `src/hooks/useChatWidget.ts`
- `src/hooks/useConversationHistory.ts`
- `src/hooks/useRealtimeVoice.ts`
- `src/hooks/useConvoy.ts` (if convoy features are used)

**Database Requirements**:
- `dreams` table: id, user_id, title, description, media_url, media_type, thumbnail_url, is_private, domain, display_order, goal_type, visualization_prompt, reference_image_url, generation_metadata, parent_dream_id, is_milestone, deleted_at
- `dream_activities` table: id, dream_id, activity_text, status, started_at, completed_at, time_spent_seconds, user_commitment, order_index, locked
- `dream_materials` table: (structure to be confirmed)
- `profiles` table: mantra, mantra_history fields

**Supabase Edge Functions Required**:
- `generate-dream-title`
- `generate-image`
- `generate-video`
- `generate-dream-activities`
- `generate-journey-summary`
- `generate-scheduled-summaries`
- `match-mantra-wisdom`
- `process-dream-materials`
- `retrieve-material-context`
- `ai-router` (for chat routing)
- `agent-*` functions (various specialized agents)

---

## Integration Plan

### Phase 1: Foundation (Week 1)
- [ ] Set up project structure
- [ ] Incorporate stylistic guidance (design system)
- [ ] Install and configure shadcn/ui component library
- [ ] Set up Tailwind with custom theme
- [ ] Verify color system and dark mode

### Phase 2: Core UI Components (Week 1-2)
- [ ] Copy UI component library
- [ ] Set up utility functions (cn helper)
- [ ] Test component accessibility
- [ ] Verify mobile responsiveness

### Phase 3: Journaling Feature (Week 2-3)
- [ ] Set up database schema for timeline_captures
- [ ] Implement Journey page
- [ ] Implement TimelineEntryModal
- [ ] Add filtering and pagination
- [ ] Integrate media upload with compression
- [ ] Add comments and reactions (if needed)
- [ ] Test privacy controls

### Phase 4: Vision Board (Week 3-5)
- [ ] Set up database schema for dreams, activities, materials
- [ ] Implement Vision Board page with drag-and-drop
- [ ] Implement DreamCreationModal
- [ ] Set up activity system
- [ ] Implement materials management
- [ ] Integrate AI chat widget
- [ ] Implement AncientWisdom/mantra system
- [ ] Add progress visualizations
- [ ] Set up Supabase edge functions (or adapt to new backend)

### Phase 5: Integration & Testing (Week 5-6)
- [ ] Link journaling entries to dreams
- [ ] Integrate features with authentication
- [ ] Test mobile experience
- [ ] Performance optimization
- [ ] Accessibility audit

---

## Dependencies to Install

### Core Dependencies
```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "@tanstack/react-query": "^5.83.0",
  "react-router-dom": "^6.30.1",
  "lucide-react": "^0.462.0",
  "date-fns": "^3.6.0",
  "zod": "^3.25.76",
  "react-hook-form": "^7.61.1",
  "@hookform/resolvers": "^3.10.0"
}
```

### UI Dependencies
All Radix UI packages (see package.json for complete list)
- `@radix-ui/react-*` packages for each component used

### Utilities
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

---

## Questions & Decisions Needed

- [ ] **Backend**: Will we use Supabase or migrate to a different backend? (Affects edge functions and database schema)
- [ ] **AI Features**: Which AI features are essential for MVP? (Image generation, video generation, chat, summaries)
- [ ] **Social Features**: Do we need comments/reactions on journal entries for MVP?
- [ ] **Materials Management**: Is file upload/storage needed for MVP, or can this be deferred?
- [ ] **Voice Features**: Is realtime voice interaction needed for MVP?
- [ ] **Activity System Complexity**: Should we start with a simplified activity system or full version?
- [ ] **Mantra System**: Is the AncientWisdom matching feature needed for MVP, or just basic mantra storage?

---

## Notes

### Design System Considerations
- All colors are in HSL format for easy theme customization
- Dark mode is fully supported
- Mobile-first approach with touch optimizations
- Accessibility is built into Radix UI components

### Performance Considerations
- Lazy loading is used for pages in App.tsx
- Image compression is implemented for uploads
- Pagination prevents loading too much data at once
- Consider code splitting for large components

### Migration Considerations
- Database schemas will need to be adapted to new backend (if not using Supabase)
- Edge functions will need to be rewritten or adapted
- Authentication flow may need adjustment
- File storage strategy needs to be determined

### Future Enhancements (Post-MVP)
- Convoy/Community features (already built in prototype)
- Insights/Progress tracking dashboard (already built in prototype)
- Knowledge/Aha Moments page (already built in prototype)
- Advanced AI features (video generation, etc.)

---

## Additional Prototypes

*Add other prototypes here as they are explored...*

---

**Document Status**: ✅ Initial inventory complete for dremakermvp prototype

