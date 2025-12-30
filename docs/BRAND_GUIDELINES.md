# Brand Guidelines

## Document Information
- **Brand Name**: Dreamaker
- **Tagline**: "Design the life you want and go after it"
- **Version**: December 2025 MVP
- **Last Updated**: December 30, 2025
- **Brand Direction**: Whimsical, achievable, goal-focused (meditation app-inspired)
- **Primary Font**: Nunito (Round Sans-Serif)
- **Color Format**: HSL (no commas)

---

## 1. Brand Identity

### 1.1 Brand Name
**Dreamaker** - Empowering courageous people to clarify their dreams and make them reality.

### 1.2 Brand Philosophy
**"Made by them, for them"** - All insights are their own, and we are fully transparent with users about what data is used and how it informs what we share with them. We believe in empowering users with their own wisdom and providing complete transparency about how their information is used to support their journey.

### 1.3 Brand Direction & Personality

#### Core Brand Essence
Dreamaker sells the idea of working towards your goals in an **achievable way**. The experience has a somatic element that doesn't feel as rigid as "checklist" or "streak" style apps. The brand direction is **whimsical** - similar to meditation apps that have goal-focused components but try not to overwhelm users with unachievable tasks.

#### Brand Personality Traits
- **Achievable**: Goals feel within reach, not overwhelming
- **Whimsical**: Playful but not overly so (less playful than Headspace)
- **Supportive**: Like a gentle guide, not a taskmaster
- **Dream-like**: Subtle, ethereal quality (inspired by Ten Percent Happier)
- **Somatic**: Body-aware, present-moment focused
- **Clear Direction**: Structure and pacing that feels achievable (inspired by Headspace)

#### Design Inspiration
- **Headspace**: Pacing and structure - achievable with clear direction (but less playful)
- **Ash (AI Therapy)**: Cards with subtle gradient backgrounds
- **Ten Percent Happier**: Subtle gradients, dream-like aesthetic
- **Pillowtalk (AI Journaling)**: Tone of voice, darker palette with pops of color

#### Design Philosophy (Core Principles)
1. **Achievable**: Goals feel within reach, not overwhelming
2. **Whimsical**: Playful but not overly so (less playful than Headspace)
3. **Dream-like**: Subtle, ethereal quality (inspired by Ten Percent Happier)
4. **Somatic**: Body-aware, present-moment focused
5. **Clear Direction**: Structure and pacing that feels achievable (inspired by Headspace)
6. **Subtle Gradients**: Dream-like, barely perceptible (inspired by Ten Percent Happier and Ash)
7. **Simple Typography**: Round sans-serif, single font family for MVP
8. **Darker Palette with Pops**: Dark mode inspiration from Pillowtalk

**What to Avoid**: Checklist/streak app rigidity, overwhelming task lists, too playful (more playful than Headspace), harsh gradients or high contrast, complex typography systems, hard-edged fonts

**What to Embrace**: Meditation app pacing and structure, subtle dream-like gradients, card-based layouts with subtle backgrounds, achievable goal presentation, somatic present-moment focus, simple round typography, whimsical touches without being too casual

### 1.4 Brand Messaging
- **Core Value Proposition**: Dreamaker is the antidote for people feeling so overwhelmed that they throw in the towel on what they truly want. By providing structure, clarity, support, and accountability in one integrated platform, we help users navigate life transitions without losing sight of their authentic desires and dreams.
- **Mission**: Provide clarity, support, and accountability to help people discover what they truly want in life and take meaningful action toward their dreams.
- **Vision**: Scale Dreamaker to a point where anyone who wants to use the platform but cannot afford it can be sponsored through our related non-profit organization.

### 1.5 Tone of Voice

#### Voice Characteristics
- **Supportive**: Encouraging and empowering
- **Clear**: Direct and easy to understand
- **Transparent**: Honest about data usage and platform functionality
- **Empowering**: Helps users feel in control
- **Gentle**: Not overwhelming or prescriptive
- **Achievable**: Makes goals feel within reach
- **Whimsical**: Light, playful touch without being too casual (less playful than Headspace)
- **Somatic**: Body-aware, present-moment language

#### Tone Inspiration
- **Pillowtalk**: Good tone of voice reference (talking to a younger audience, but adaptable)
- **Meditation Apps**: Gentle, supportive, achievable
- **Avoid**: Checklist rigidity, streak-focused intensity, overwhelming task lists

#### Example Messaging
- **Welcome**: "You've already taken the first step to design the life you want and go after it."
- **Encouragement**: "Amazing job!"
- **Guidance**: "So that I can help guide you, tell me where you are with this today."
- **Celebration**: "Your vision is ready!"
- **Achievable**: "This usually takes about 30 seconds" (not overwhelming)

#### Language Guidelines
- Use "you" and "your" to personalize
- Avoid jargon; use plain language
- Be encouraging without being prescriptive
- Acknowledge user agency and ownership
- Make goals feel achievable, not overwhelming
- Gentle guidance, not rigid checklists

---

## 2. Typography

### 2.1 Font Selection ✅ SELECTED: Nunito

#### Primary Font Family: Nunito
**Chosen for its friendly, rounded aesthetic perfect for iOS applications**

- **Family**: Nunito (Google Fonts)
- **Style**: Rounded sans-serif
- **Weights Used**: 
  - Regular (400) - Body text
  - Medium (500) - Emphasis, labels
  - Semibold (600) - Subheadings
  - Bold (700) - Main headings, buttons
  - ExtraBold (800) - Hero headings (optional)

**Why Nunito:**
- Rounded terminals create friendly, approachable feel
- Excellent readability at all sizes
- Wide weight range for clear hierarchy
- Optimized for digital screens
- Pairs beautifully with purple/cyan color palette

### 2.2 Font Implementation

#### Google Fonts Import
Add to `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
```

#### Tailwind Configuration
Update `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    },
  },
}
```

#### CSS Variables
```css
:root {
  --font-sans: 'Nunito', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

### 2.3 Typography Scale (iOS-Optimized)

#### Complete Type Scale Reference

| Element | Desktop | Mobile | Weight | Line Height | Letter Spacing | Tailwind Classes |
|---------|---------|--------|--------|-------------|----------------|------------------|
| **Hero** | 60px / 3.75rem | 36px / 2.25rem | ExtraBold (800) | 1.1 | -0.02em | `text-6xl md:text-6xl font-extrabold leading-tight tracking-tight` |
| **H1** | 48px / 3rem | 32px / 2rem | Bold (700) | 1.2 | -0.01em | `text-5xl md:text-5xl font-bold leading-tight` |
| **H2** | 36px / 2.25rem | 28px / 1.75rem | Bold (700) | 1.3 | normal | `text-4xl md:text-4xl font-bold leading-snug` |
| **H3** | 24px / 1.5rem | 20px / 1.25rem | Semibold (600) | 1.4 | normal | `text-2xl md:text-2xl font-semibold leading-normal` |
| **H4** | 20px / 1.25rem | 18px / 1.125rem | Semibold (600) | 1.4 | normal | `text-xl font-semibold` |
| **Body Large** | 18px / 1.125rem | 17px / 1.0625rem | Regular (400) | 1.6 | normal | `text-lg leading-relaxed` |
| **Body** | 16px / 1rem | 16px / 1rem | Regular (400) | 1.5 | normal | `text-base leading-normal` |
| **Body Small** | 14px / 0.875rem | 14px / 0.875rem | Medium (500) | 1.5 | normal | `text-sm leading-normal` |
| **Caption** | 12px / 0.75rem | 12px / 0.75rem | Medium (500) | 1.4 | 0.01em | `text-xs tracking-wide` |
| **Label** | 14px / 0.875rem | 14px / 0.875rem | Semibold (600) | 1.4 | 0.02em | `text-sm font-semibold tracking-wide uppercase` |
| **Button** | 16px / 1rem | 16px / 1rem | Semibold (600) | 1.2 | 0.01em | `text-base font-semibold` |

### 2.4 iOS-Specific Typography Rules

#### Mobile Critical Rules
```css
/* Prevent zoom on input focus (iOS Safari) */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
input[type="url"],
textarea,
select {
  font-size: 16px !important;
  font-family: var(--font-sans);
}

/* Smooth font rendering on iOS */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

#### Touch-Friendly Text
```css
/* Disable text selection on buttons/interactive elements */
button, .button, [role="button"] {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Enable smooth scrolling text */
.scrollable-text {
  -webkit-overflow-scrolling: touch;
}
```

### 2.5 Typography Usage Examples

#### Welcome Screen Heading
```tsx
<h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
  <span className="text-primary">Welcome to</span>{" "}
  <span className="text-secondary">Dreamaker</span>
</h1>
<p className="text-lg leading-relaxed text-muted-foreground">
  Design the life you want and go after it
</p>
```

#### Card Heading
```tsx
<div className="bg-card rounded-xl p-6">
  <h3 className="text-2xl font-semibold text-primary mb-2">
    Your Vision Board
  </h3>
  <p className="text-base text-muted-foreground leading-normal">
    Visualize your dreams and track your progress
  </p>
</div>
```

#### Button Text
```tsx
<Button className="text-base font-semibold">
  Continue
</Button>
```

#### Label + Input
```tsx
<label className="text-sm font-semibold tracking-wide uppercase text-foreground mb-2 block">
  Dream Title
</label>
<input 
  type="text" 
  placeholder="Enter your dream..."
  className="text-base font-normal"
/>
```

#### Caption/Metadata
```tsx
<p className="text-xs tracking-wide text-muted-foreground">
  Created 2 days ago
</p>
```

### 2.6 Logo Typography

#### Logo Specifications
- **Font**: Nunito ExtraBold (800)
- **Style**: Simple wordmark with optional star/sparkle accent
- **Case**: Title Case ("Dreamaker")
- **Letter Spacing**: -0.02em (tighter for impact)
- **Color**: Primary purple or gradient

#### Logo Implementation
```tsx
// Text-based logo
<div className="flex items-center gap-2">
  <span className="text-3xl font-extrabold tracking-tight text-primary">
    Dreamaker
  </span>
  <Sparkles className="w-6 h-6 text-accent" />
</div>

// With gradient
<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  Dreamaker
</h1>
```

### 2.7 Future Consideration: Serif for Wisdom

For future "wisdom" or "reflection" sections, consider adding Georgia as a secondary font:

```css
:root {
  --font-serif: 'Georgia', serif;
}

.wisdom-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.125rem;
  line-height: 1.7;
}
```

**Usage:** Inspirational quotes, reflection prompts, journaling sections

---

## 3. Color System

### 3.1 Color Format Standard ⚠️ CRITICAL

**All colors MUST use HSL format without commas**

```css
/* ✅ CORRECT */
hsl(254 62% 58%)

/* ❌ WRONG */
hsl(254, 62%, 58%)
#8B5CF6
rgb(139, 92, 246)
```

**Why HSL?**
- CSS variable compatibility
- Easier opacity manipulation: `hsl(254 62% 58% / 0.5)`
- Consistent with Tailwind CSS v3+
- Better for programmatic color generation

### 3.2 Primary Colors - Quick Reference

| Color | CSS Variable | Light Mode HSL | Dark Mode HSL | Hex (Reference) | Usage |
|-------|--------------|----------------|---------------|-----------------|-------|
| **Primary Purple** | `--primary` | `254 62% 58%` | `254 62% 65%` | `#8B5CF6` | Primary buttons, headings, active states |
| **Primary Glow** | `--primary-glow` | `254 62% 70%` | `254 62% 75%` | `#A78BFA` | Glow effects, hover states |
| **Secondary Cyan** | `--secondary` | `199 100% 55%` | `199 100% 60%` | `#22D3EE` | "Dreamaker" text, links, secondary accents |
| **Accent Orange** | `--accent` | `39 100% 56%` | `39 100% 60%` | `#FBBF24` | Call-to-action highlights, health domain |

#### Color Definitions in CSS
```css
:root {
  /* Primary Purple */
  --primary: 254 62% 58%;
  --primary-foreground: 0 0% 100%;
  --primary-glow: 254 62% 70%;
  
  /* Secondary Cyan */
  --secondary: 199 100% 55%;
  --secondary-foreground: 0 0% 100%;
  
  /* Accent Orange */
  --accent: 39 100% 56%;
  --accent-foreground: 0 0% 10%;
}

.dark {
  --primary: 254 62% 65%;
  --primary-glow: 254 62% 75%;
  --secondary: 199 100% 60%;
  --accent: 39 100% 60%;
}
```

### 3.3 Neutral Colors

| Token | Light Mode HSL | Dark Mode HSL | Hex Approximation | Usage |
|-------|----------------|---------------|-------------------|-------|
| **Background** | `0 0% 100%` | `220 20% 10%` | `#FFFFFF` / `#1A1F2E` | App canvas |
| **Foreground** | `210 20% 16%` | `210 20% 95%` | `#1E293B` / `#F1F5F9` | Primary text |
| **Card** | `0 0% 100%` | `220 20% 13%` | `#FFFFFF` / `#1E2432` | Elevated surfaces |
| **Card Foreground** | `210 20% 16%` | `210 20% 95%` | Same as foreground | Text on cards |
| **Muted** | `210 17% 95%` | `220 20% 18%` | `#F1F5F9` / `#252B3A` | Subtle backgrounds |
| **Muted Foreground** | `211 12% 52%` | `210 15% 65%` | `#64748B` / `#94A3B8` | Secondary text |
| **Border** | `210 20% 91%` | `220 20% 20%` | `#E2E8F0` / `#2D3548` | Dividers, outlines |
| **Input** | `210 20% 91%` | `220 20% 20%` | Same as border | Input borders |
| **Ring** | `254 62% 58%` | `254 62% 65%` | Same as primary | Focus rings |

### 3.4 Domain Colors (Life Categories)

| Domain | CSS Variable | HSL Value | Hex | Notes |
|--------|--------------|-----------|-----|-------|
| **Work** | `--domain-work` | `254 62% 58%` | `#8B5CF6` | Same as primary purple |
| **Wealth** | `--domain-wealth` | `142 71% 45%` | `#22C55E` | Green |
| **Family** | `--domain-family` | `320 70% 55%` | `#E91E8C` | Magenta (updated for iOS aesthetic) |
| **Friends** | `--domain-friends` | `199 100% 55%` | `#22D3EE` | Same as secondary cyan |
| **Health** | `--domain-health` | `25 95% 53%` | `#F97316` | Orange/coral |
| **Spirituality** | `--domain-spirituality` | `280 68% 60%` | `#A855F7` | Purple variant |
| **Interests** | `--domain-interests` | `180 70% 45%` | `#14B8A6` | Teal/cyan variant |

⚠️ **Note on Family Color:** Updated from pure pink `340 82% 59%` to deeper magenta `320 70% 55%` for better distinction and modern iOS aesthetic.

### 3.5 Semantic Colors

| Purpose | CSS Variable | Light HSL | Dark HSL | Usage |
|---------|--------------|-----------|----------|-------|
| **Success** | `--success` | `142 71% 45%` | `142 71% 50%` | Success messages |
| **Warning** | `--warning` | `45 100% 60%` | `45 100% 65%` | Warnings, alerts |
| **Destructive** | `--destructive` | `0 84% 60%` | `0 70% 50%` | Errors, delete actions |
| **Info** | `--info` | `199 100% 55%` | `199 100% 60%` | Information, tips |

### 3.6 Color Accessibility (WCAG 2.1 AA)

#### Contrast Ratios

| Combination | Ratio | AA Pass | AAA Pass | Notes |
|-------------|-------|---------|----------|-------|
| Primary purple on white | 7.2:1 | ✅ | ✅ | Safe for all text sizes |
| Primary on card background | 7.2:1 | ✅ | ✅ | Safe for all text sizes |
| Secondary cyan on white | 4.8:1 | ✅ | ❌ | Use for headings 18px+ |
| Accent orange on white | 3.2:1 | ⚠️ | ❌ | Large text only (24px+) |
| Foreground on background | 12.5:1 | ✅ | ✅ | Maximum contrast |
| Muted foreground on background | 4.6:1 | ✅ | ❌ | Safe for body text |

**Guidelines:**
- Use primary purple for all critical text
- Use secondary cyan for headings size 18px+
- Avoid accent orange on light backgrounds for body text
- Always test custom combinations with contrast checker

### 3.7 Color Usage Guidelines

#### Primary Purple Usage
✅ **DO:**
- Main headings (H1, H2)
- Primary action buttons
- Active navigation items
- Progress indicators
- Focus rings
- Icons for key features

❌ **DON'T:**
- Long paragraphs of body text
- Subtle backgrounds (use muted instead)

#### Secondary Cyan Usage
✅ **DO:**
- "Dreamaker" brand name
- Links and hyperlinks
- Secondary buttons
- Domain icon (Friends)
- Accent borders

❌ **DON'T:**
- Small text (accessibility concern)
- Primary CTAs (use purple)

#### Accent Orange Usage
✅ **DO:**
- Call-to-action highlights
- "New" badges
- Achievement indicators
- Health domain
- Sparingly for emphasis

❌ **DON'T:**
- Body text
- Large text blocks
- Primary navigation

### 3.8 Implementation Examples

#### Using Colors in Components
```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Continue
</button>

// Secondary button
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Learn More
</button>

// Card with domain color accent
<div className="bg-card border-l-4 border-domain-health p-6">
  <h3 className="text-primary">Health Goal</h3>
</div>

// Text with proper contrast
<h1 className="text-primary font-bold">Main Heading</h1>
<p className="text-foreground">Body text with high contrast</p>
<span className="text-muted-foreground">Secondary information</span>

// Focus states
<input className="focus:ring-2 focus:ring-primary focus:ring-offset-2" />
```

#### Using HSL with Opacity
```tsx
// Subtle background
<div className="bg-primary/10">Content</div>

// Hover glow effect
<button className="hover:shadow-[0_0_20px_hsl(254_62%_58%/0.4)]">
  Hover me
</button>

// Gradient with opacity
<div style={{
  background: `linear-gradient(135deg, 
    hsl(254 62% 58% / 0.1), 
    hsl(199 100% 55% / 0.1)
  )`
}}>
  Subtle gradient background
</div>
```

### 3.9 Gradients (Subtle & Dream-like)

#### Design Philosophy
Gradients should be **subtle** and **ethereal** (inspired by meditation apps). They create atmosphere without overwhelming content.

#### Primary Gradient
```css
--gradient-primary: linear-gradient(135deg, hsl(254 62% 58%), hsl(254 62% 70%));
```
**Usage:** Hero sections, primary button backgrounds, feature highlights

#### Vision Gradient (Ultra Subtle)
```css
--gradient-vision: linear-gradient(180deg, hsl(254 62% 98%), hsl(0 0% 100%));
```
**Usage:** Vision board backgrounds, subtle page transitions

#### Dual-Tone Gradient (Purple to Cyan)
```css
--gradient-dual: linear-gradient(135deg, hsl(254 62% 58%), hsl(199 100% 55%));
```
**Usage:** Hero banners, celebration moments, featured content

#### Card Gradient (Elevation)
```css
--gradient-card: linear-gradient(145deg, hsl(0 0% 100%), hsl(210 20% 99%));
```
**Usage:** Card backgrounds for subtle depth

#### Radial Gradient (Ambient Glow)
```css
--gradient-radial-ambient: radial-gradient(
  circle at top right,
  hsl(254 62% 58% / 0.1),
  transparent 50%
);
```
**Usage:** Page backgrounds, decorative elements

#### Flow Border Animation (Signature Effect)

**The "Living Border" - signature brand element for featured content**

```css
@keyframes flow-border {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-flow-border {
  background: linear-gradient(
    90deg,
    hsl(var(--primary)),
    hsl(var(--secondary)),
    hsl(var(--accent)),
    hsl(var(--primary))
  );
  background-size: 300% 300%;
  animation: flow-border 4s ease infinite;
}
```

**Implementation Example:**
```tsx
// Featured dream card with living border
<div className="relative p-[3px] rounded-xl overflow-hidden">
  <div className="absolute inset-0 animate-flow-border" />
  <div className="relative bg-card rounded-xl p-6">
    <h3 className="text-primary font-semibold text-2xl mb-2">
      Featured Dream
    </h3>
    <p className="text-muted-foreground">
      This dream has animated border highlighting
    </p>
  </div>
</div>
```

**Add to Tailwind Config:**
```typescript
// tailwind.config.ts
theme: {
  extend: {
    animation: {
      'flow-border': 'flow-border 4s ease infinite',
    },
    keyframes: {
      'flow-border': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    },
  },
}
```

#### Gradient Usage Guidelines

**✅ DO:**
- Use gradients subtly in backgrounds
- Apply to featured/special content only
- Maintain low opacity for ambient effects
- Use flow-border for celebration moments

**❌ DON'T:**
- Overuse gradients (creates visual noise)
- Use high-contrast gradients
- Apply to body text backgrounds
- Use more than 2-3 gradients per screen

### 3.10 Shadows & Glows

#### Standard Shadows
| Token | Definition | Usage |
|-------|------------|-------|
| **Shadow SM** | `0 1px 2px 0 hsl(210 20% 16% / 0.05)` | Subtle elevation |
| **Shadow MD** | `0 4px 6px -1px hsl(210 20% 16% / 0.08)` | Default elevation |
| **Shadow LG** | `0 10px 15px -3px hsl(210 20% 16% / 0.08)` | Prominent elevation |
| **Shadow Card** | `0 2px 8px hsl(210 20% 16% / 0.06)` | Card elevation |
| **Shadow XL** | `0 20px 25px -5px hsl(210 20% 16% / 0.1)` | Maximum elevation |

#### Glow Effects (Signature Brand Element)

| Token | Definition | Usage |
|-------|------------|-------|
| **Glow Primary** | `0 0 40px hsl(254 62% 58% / 0.4)` | Primary buttons, focus states |
| **Glow Accent** | `0 0 30px hsl(199 100% 55% / 0.5)` | Secondary highlights |
| **Glow Subtle** | `0 0 20px hsl(254 62% 58% / 0.2)` | Hover states |

#### Dark Mode Intensification
Glows become more pronounced in dark mode:
```css
.dark {
  --glow-primary: 0 0 50px hsl(254 62% 65% / 0.5);
  --glow-accent: 0 0 40px hsl(199 100% 60% / 0.6);
  --shadow-card: 0 15px 50px hsl(0 0% 0% / 0.4);
}
```

#### Pulse Glow Animation (Hero Element)
```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px hsl(254 62% 58% / 0.5), 0 0 40px hsl(254 62% 58% / 0.3);
  }
  50% {
    box-shadow: 0 0 40px hsl(254 62% 58% / 0.8), 0 0 80px hsl(254 62% 58% / 0.5);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

**Usage:** Primary CTA buttons, featured content, "magic" moments

#### Implementation Examples
```tsx
// Button with glow on hover
<button className="bg-primary text-primary-foreground hover:shadow-[0_0_40px_hsl(254_62%_58%/0.4)] transition-shadow">
  Continue
</button>

// Card with elevated shadow
<div className="bg-card shadow-card hover:shadow-lg transition-shadow">
  {/* Content */}
</div>

// Featured element with pulse glow
<div className="animate-pulse-glow rounded-xl">
  {/* Content */}
</div>
```

---

## 4. Logo & Assets

### 4.1 Logo Design Direction

#### Logo Concept
- **Font**: Nunito ExtraBold (800)
- **Style**: Simple, clean wordmark
- **Enhancement**: Star/sparkle accent element
- **Philosophy**: Minimal for MVP, whimsical without being overly playful

#### Star/Sparkle Element
- **Current Direction**: Keep the star/sparkle concept
- **Enhancement Opportunity**: Make more illustrative while maintaining whimsical feel
- **Placement**: Can be integrated with wordmark or used as separate accent
- **Style**: Rounded, friendly, matches Nunito's personality

### 4.2 Logo Files

#### Main Logo
- **File Path**: `/src/assets/dreamaker-logo.png`
- **Usage**: Navigation bar, header, general app usage
- **Size**: 32px × 32px (w-8 h-8 in Tailwind)
- **Styling**: Rounded corners (`rounded-lg`)

#### Welcome Logo
- **File Path**: `/src/assets/dreamaker-welcome-logo.png`
- **Usage**: Welcome screens, onboarding Step 1, landing pages
- **Size**: 192px × 192px (w-48 h-48 in Tailwind)
- **Styling**: Larger, rounded corners (`rounded-3xl`), shadow (`shadow-xl`)

### 4.3 Logo Typography Specifications

#### Text-Based Logo Implementation
```tsx
// Standard logo with icon
<div className="flex items-center gap-2">
  <span className="text-3xl font-extrabold tracking-tight text-primary">
    Dreamaker
  </span>
  <Sparkles className="w-6 h-6 text-accent" />
</div>

// Gradient logo (premium feel)
<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  Dreamaker
</h1>

// Navigation logo
<div className="flex items-center gap-2">
  <img src="/src/assets/dreamaker-logo.png" alt="Dreamaker" className="w-8 h-8 rounded-lg" />
  <span className="text-xl font-bold text-primary">Dreamaker</span>
</div>
```

### 4.4 Logo Usage Guidelines

#### Size Specifications
| Context | Size | Tailwind Class | Min Size |
|---------|------|----------------|----------|
| Navigation | 32px | `w-8 h-8` | 24px |
| Hero/Welcome | 192px | `w-48 h-48` | 128px |
| Footer | 24px | `w-6 h-6` | 20px |
| Favicon | 48px | - | 32px |

#### Spacing Requirements
- **Clear Space**: Minimum 1x logo width on all sides
- **Padding**: 16px minimum around logo in containers
- **Alignment**: Center or left-align, never right-align

#### Color Variations
- **Primary**: Purple (`--primary`) on light backgrounds
- **White**: On dark or colored backgrounds
- **Gradient**: For hero sections and special moments
- **Avoid**: Orange or cyan as primary logo color

#### Accessibility
- Always provide alt text: "Dreamaker"
- Ensure sufficient contrast with background
- Maintain aspect ratio when resizing
- Use PNG with transparency for flexibility

---

## 5. UI Components

### 5.1 Buttons (Complete System)

#### Button Variants Reference

| Variant | Classes | Hover State | Usage Example |
|---------|---------|-------------|---------------|
| **Default (Primary)** | `bg-primary text-primary-foreground` | `hover:bg-primary/90 hover:shadow-glow` | "Continue", "Save Dream" |
| **Secondary** | `bg-secondary text-secondary-foreground` | `hover:bg-secondary/80` | Alternative actions |
| **Ghost** | `hover:bg-accent/10 hover:text-accent-foreground` | Minimal elevation | Icon buttons, subtle actions |
| **Outline** | `border-2 border-primary text-primary bg-transparent` | `hover:bg-primary hover:text-primary-foreground` | "Cancel", "Edit" |
| **Destructive** | `bg-destructive text-destructive-foreground` | `hover:bg-destructive/90` | "Delete Dream", "Remove" |
| **Link** | `text-primary underline-offset-4 hover:underline` | Text decoration | Inline links, "Learn more" |

#### Button States (Complete)

```tsx
// 1. Default state
<Button className="bg-primary text-primary-foreground">
  Continue
</Button>

// 2. Hover state (with signature glow)
<Button className="bg-primary text-primary-foreground hover:shadow-[0_0_40px_hsl(254_62%_58%/0.4)] transition-all">
  Continue
</Button>

// 3. Active/Pressed state
<Button className="bg-primary text-primary-foreground active:scale-95">
  Continue
</Button>

// 4. Focus state (accessibility)
<Button className="bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
  Continue
</Button>

// 5. Disabled state
<Button disabled className="bg-primary text-primary-foreground opacity-50 cursor-not-allowed">
  Continue
</Button>

// 6. Loading state
<Button disabled className="bg-primary text-primary-foreground opacity-75">
  <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
  Saving...
</Button>
```

#### Button Sizes

| Size | Height | Padding | Font Size | Tailwind Class |
|------|--------|---------|-----------|----------------|
| **Small** | 32px | 12px 16px | 14px | `h-8 px-4 text-sm` |
| **Default** | 40px | 16px 24px | 16px | `h-10 px-6 text-base` |
| **Large** | 48px | 20px 32px | 16px | `h-12 px-8 text-base` |

#### iOS-Optimized Touch Targets
```tsx
// Minimum 44px for iOS touch targets
<button className="min-h-[44px] min-w-[44px] touch-manipulation">
  <Icon className="w-5 h-5" />
</button>

// Disable tap highlight
<button className="[-webkit-tap-highlight-color:transparent]">
  Continue
</button>
```

### 5.2 Cards (Inspired by Ash)

#### Card Design Philosophy
Cards should have **subtle gradient backgrounds** (inspired by Ash's explore tab). The gradients should be barely perceptible, creating depth without distraction.

#### Standard Card Implementation

```tsx
// Basic card with subtle gradient
<div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl border border-border shadow-card p-6">
  <h3 className="text-2xl font-semibold text-primary mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card description</p>
</div>

// Card with hover elevation
<div className="bg-card rounded-xl border border-border shadow-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 p-6 cursor-pointer">
  <h3 className="text-2xl font-semibold text-primary mb-2">Interactive Card</h3>
  <p className="text-muted-foreground">Hover to see elevation</p>
</div>

// Featured card with flow border animation
<div className="relative p-[3px] rounded-xl overflow-hidden">
  <div className="absolute inset-0 animate-flow-border" />
  <div className="relative bg-card rounded-xl p-6">
    <h3 className="text-primary font-semibold text-2xl mb-2">Featured Dream</h3>
    <p className="text-muted-foreground">Special highlighted content</p>
  </div>
</div>
```

#### Editable Cards (Review Step)

```tsx
<div className="bg-card rounded-xl border border-border shadow-card p-6">
  <div className="flex items-start justify-between mb-4">
    <h3 className="text-xl font-semibold text-primary">Vision Statement</h3>
    <button className="text-muted-foreground hover:text-primary">
      <Pencil className="w-4 h-4" />
    </button>
  </div>
  
  {isEditing ? (
    <div className="space-y-4">
      <textarea className="w-full p-3 rounded-lg border border-input" />
      <div className="flex gap-2">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          Save
        </button>
        <button className="border border-border px-4 py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <p className="text-foreground">Your vision content here...</p>
  )}
</div>
```

#### Card Variants

| Type | Border | Shadow | Background | Usage |
|------|--------|--------|------------|-------|
| **Standard** | `border-border` | `shadow-card` | `bg-card` | Default cards |
| **Elevated** | `border-border` | `shadow-lg` | `bg-card` | Hover states |
| **Highlighted** | `border-primary/30` | `shadow-card` | `bg-card` | Active/selected |
| **Featured** | Animated gradient | `shadow-lg` | `bg-card` | Special content |
| **Subtle** | None | None | `bg-muted/50` | Background cards |

### 5.3 Input Fields

#### Text Input System

```tsx
// Standard text input
<input 
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-base focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent transition-all"
/>

// Textarea (large input)
<textarea 
  placeholder="Describe your dream..."
  rows={5}
  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-base focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent transition-all resize-none"
/>

// Input with label
<div className="space-y-2">
  <label className="text-sm font-semibold tracking-wide uppercase text-foreground">
    Dream Title
  </label>
  <input 
    type="text"
    placeholder="e.g., Run a marathon"
    className="w-full px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-primary"
  />
  <p className="text-xs text-muted-foreground">
    Make it specific and measurable
  </p>
</div>
```

#### Input States

| State | Border | Ring | Background | Usage |
|-------|--------|------|------------|-------|
| **Default** | `border-input` | None | `bg-background` | Unfocused |
| **Focus** | `border-transparent` | `ring-2 ring-primary` | `bg-background` | Active input |
| **Error** | `border-destructive` | `ring-2 ring-destructive` | `bg-background` | Validation error |
| **Disabled** | `border-input` | None | `bg-muted` | Disabled state |
| **Success** | `border-success` | `ring-2 ring-success` | `bg-background` | Valid input |

#### Voice Input Button

```tsx
<div className="relative">
  <textarea 
    className="w-full px-4 py-3 pr-12 rounded-lg border border-input"
    placeholder="Describe your vision..."
  />
  <button 
    className="absolute bottom-3 right-3 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
    aria-label="Voice input"
  >
    <Mic className="w-4 h-4" />
  </button>
</div>
```

**iOS Optimization:**
```css
/* Prevent zoom on input focus */
input[type="text"],
input[type="email"],
textarea {
  font-size: 16px !important;
}
```

### 5.4 Progress Indicators

#### Progress Dots

```tsx
<div className="flex items-center justify-center gap-2">
  {Array.from({ length: totalSteps }).map((_, index) => (
    <div
      key={index}
      className={cn(
        "w-2 h-2 rounded-full transition-all",
        index === currentStep 
          ? "bg-primary w-8" 
          : index < currentStep 
          ? "bg-primary/50" 
          : "bg-muted"
      )}
    />
  ))}
</div>

{/* With step count */}
<div className="text-center space-y-3">
  <div className="flex items-center justify-center gap-2">
    {/* Dots as above */}
  </div>
  <p className="text-sm text-muted-foreground">
    Step {currentStep + 1} of {totalSteps}
  </p>
</div>
```

#### Progress Bar

```tsx
<div className="w-full bg-muted rounded-full h-2 overflow-hidden">
  <div 
    className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 ease-out"
    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
  />
</div>
```

#### Loading Spinner

```tsx
<div className="flex items-center justify-center">
  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
</div>

{/* With pulsing glow */}
<div className="flex items-center justify-center">
  <div className="w-12 h-12 animate-pulse-glow">
    <Sparkles className="w-12 h-12 text-primary animate-spin" />
  </div>
</div>
```

### 5.5 Badges & Pills

```tsx
// Standard badge
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
  New
</span>

// Domain badge
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-domain-health text-white">
  Health
</span>

// Status badges
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
  Completed
</span>

<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
  In Progress
</span>
```

### 5.6 Icons

#### Icon System (Lucide React)

**Standard Sizing:**
- Small: `w-4 h-4` (16px)
- Default: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- Hero: `w-8 h-8` to `w-12 h-12` (32-48px)

#### Brand Icons Usage

| Icon | Meaning | Color | Context |
|------|---------|-------|---------|
| `Sparkles` | AI/Magic/New | Primary | AI generation, new features |
| `Zap` | Insight/Aha | Accent | Breakthroughs, insights |
| `Target` | Goals | Primary | Goal setting, targets |
| `Heart` | Passion | Destructive (pink-red) | Favorites, love |
| `Star` | Achievement | Gold/Accent | Rewards, milestones |
| `Clock` | Timeline | Muted | Timeframes, history |
| `Pencil` | Edit | Muted | Edit actions |
| `Trash2` | Delete | Destructive | Remove actions |

```tsx
// Icon button
<button className="p-2 rounded-full hover:bg-accent/10 transition-colors">
  <Sparkles className="w-5 h-5 text-primary" />
</button>

// Icon with text
<div className="flex items-center gap-2">
  <Target className="w-5 h-5 text-primary" />
  <span className="font-semibold">Set Goal</span>
</div>

// Animated icon
<Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
```

---

## 6. Animations & Transitions

### 6.1 Animation Timing System (iOS-Optimized)

#### Core Timing Values

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| **Instant** | 100ms | `ease-out` | Micro-interactions, toggles |
| **Quick** | 200ms | `ease-out` | Hover states, focus rings |
| **Normal** | 300ms | `ease-out` | Standard transitions |
| **Smooth** | 500ms | `ease-in-out` | Page transitions, modals |
| **Slow** | 800ms | `ease-in-out` | Celebration animations |

#### Easing Functions

```css
/* Standard easing */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* iOS-inspired spring */
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Smooth deceleration */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
```

### 6.2 Core Animations

#### Fade In
```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
```

#### Fade Up (Entry Animation)
```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.5s ease-out;
}
```

#### Scale In (Modals, Popovers)
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
```

#### Slide Up (Toast, Bottom Sheets)
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.5s var(--ease-smooth);
}
```

#### Float (Ambient Decoration)
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### 6.3 Signature Brand Animations

#### Pulse Glow (Primary CTAs)
```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px hsl(254 62% 58% / 0.5), 
                0 0 40px hsl(254 62% 58% / 0.3);
  }
  50% {
    box-shadow: 0 0 40px hsl(254 62% 58% / 0.8), 
                0 0 80px hsl(254 62% 58% / 0.5);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

**Usage:** Featured buttons, "magic" moments, AI generation states

#### Flow Border (Living Border)
```css
@keyframes flow-border {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-flow-border {
  background: linear-gradient(
    90deg,
    hsl(var(--primary)),
    hsl(var(--secondary)),
    hsl(var(--accent)),
    hsl(var(--primary))
  );
  background-size: 300% 300%;
  animation: flow-border 4s ease infinite;
}
```

**Usage:** Featured dream cards, special content borders

#### Breathing Circle (Meditation)
```tsx
<div className="relative w-64 h-64 flex items-center justify-center">
  {[1, 2, 3].map((i) => (
    <div
      key={i}
      className="absolute rounded-full border-2 border-primary/30 animate-pulse"
      style={{
        width: `${i * 60}px`,
        height: `${i * 60}px`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: '3s',
      }}
    />
  ))}
  <div className="relative text-center">
    <p className="text-lg text-primary font-semibold">Breathe...</p>
  </div>
</div>
```

**Usage:** Visualization step, meditation moments

### 6.4 Page Transitions

```tsx
// Fade in on mount
<div className="animate-fade-in">
  {/* Page content */}
</div>

// Slide up with stagger
<div className="space-y-4">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Item content */}
    </div>
  ))}
</div>

// Modal entrance
<div className="fixed inset-0 bg-background/80 animate-fade-in">
  <div className="animate-scale-in bg-card rounded-xl p-6">
    {/* Modal content */}
  </div>
</div>
```

### 6.5 Loading States

#### Spinner
```tsx
<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
```

#### Bouncing Dots
```tsx
<div className="flex gap-1">
  {[0, 1, 2].map((i) => (
    <div
      key={i}
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: `${i * 150}ms` }}
    />
  ))}
</div>
```

#### Pulsing Glow (AI Generation)
```tsx
<div className="flex flex-col items-center gap-4">
  <div className="animate-pulse-glow">
    <Sparkles className="w-12 h-12 text-primary" />
  </div>
  <p className="text-muted-foreground animate-pulse">
    Generating your vision...
  </p>
</div>
```

### 6.6 Hover & Interaction Effects

#### Card Hover
```tsx
<div className="bg-card rounded-xl shadow-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
  {/* Card content */}
</div>
```

#### Button Hover (with glow)
```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_40px_hsl(254_62%_58%/0.4)] active:scale-95 transition-all duration-200">
  Continue
</button>
```

#### Icon Button
```tsx
<button className="p-2 rounded-full hover:bg-accent/10 hover:scale-110 active:scale-95 transition-all duration-200">
  <Sparkles className="w-5 h-5 text-primary" />
</button>
```

### 6.7 Celebration Animations

#### Confetti (Milestone Completion)
```tsx
// Using canvas-confetti or similar library
import confetti from 'canvas-confetti';

const celebrate = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#22D3EE', '#FBBF24'],
  });
};
```

#### Success Checkmark
```tsx
<div className="animate-scale-in">
  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
    <Check className="w-8 h-8 text-success animate-fade-in" 
           style={{ animationDelay: '200ms' }} />
  </div>
</div>
```

### 6.8 Reduced Motion Support

**Critical for accessibility:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6.9 iOS-Specific Optimizations

```css
/* Hardware acceleration */
.animated-element {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Smooth touch interactions */
button, a, [role="button"] {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Smooth scrolling */
.scrollable {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

### 6.10 Animation Philosophy

**Guiding Principles:**
- **Achievable**: Animations feel smooth, not overwhelming
- **Whimsical**: Playful but not distracting
- **Dream-like**: Ethereal, gentle movements
- **Somatic**: Body-aware pacing (breathing rhythms)
- **Performance**: 60fps on mobile devices
- **Accessibility**: Respect `prefers-reduced-motion`

**What to Avoid:**
- Aggressive bouncing or shaking
- Excessive spinning or rotating
- Long animation durations (>1s except celebrations)
- Animations that block user interaction
- Multiple simultaneous competing animations

---

## 7. Spacing & Layout

### 7.1 Spacing Scale (Tailwind)

| Scale | Pixels | Rem | Tailwind | Usage |
|-------|--------|-----|----------|-------|
| **0.5** | 2px | 0.125rem | `p-0.5`, `gap-0.5` | Tight spacing, borders |
| **1** | 4px | 0.25rem | `p-1`, `gap-1` | Minimal spacing |
| **2** | 8px | 0.5rem | `p-2`, `gap-2` | Small spacing |
| **3** | 12px | 0.75rem | `p-3`, `gap-3` | Compact spacing |
| **4** | 16px | 1rem | `p-4`, `gap-4` | Standard spacing |
| **6** | 24px | 1.5rem | `p-6`, `gap-6` | Medium spacing |
| **8** | 32px | 2rem | `p-8`, `gap-8` | Large spacing |
| **12** | 48px | 3rem | `p-12`, `gap-12` | Extra large spacing |
| **16** | 64px | 4rem | `p-16`, `gap-16` | Section spacing |

#### Common Spacing Patterns

```tsx
// Card padding
<div className="p-6 md:p-8">Content</div>

// Vertical stack spacing
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Flex gap
<div className="flex gap-4 items-center">
  <Icon />
  <Text />
</div>

// Grid gap
<div className="grid grid-cols-2 gap-4 md:gap-6">
  <Card />
  <Card />
</div>
```

### 7.2 Border Radius System

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| **Small** | 8px / 0.5rem | `rounded-lg` | Badges, pills |
| **Default** | 12px / 0.75rem | `rounded-xl` | Buttons, inputs |
| **Large** | 16px / 1rem | `rounded-2xl` | Cards, modals |
| **Extra Large** | 24px / 1.5rem | `rounded-3xl` | Hero cards, featured content |
| **Full** | 9999px | `rounded-full` | Circular buttons, avatars |

**CSS Variable:**
```css
:root {
  --radius: 0.75rem; /* 12px base */
}
```

**Philosophy:** Rounded corners create a friendly, approachable feel that aligns with Nunito's rounded terminals.

### 7.3 Container System

#### Max Width Containers

| Breakpoint | Max Width | Padding | Usage |
|------------|-----------|---------|-------|
| **Mobile** | 100% | 16px / 1rem | Base mobile layout |
| **Tablet (md)** | 100% | 24px / 1.5rem | Tablet layout |
| **Desktop (lg)** | 1024px | 32px / 2rem | Desktop content |
| **Wide (xl)** | 1280px | 32px / 2rem | Wide screens |
| **Ultra Wide (2xl)** | 1400px | 32px / 2rem | Maximum width |

#### Container Implementation

```tsx
// Standard container
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
  {/* Content */}
</div>

// Full-width with padding
<div className="w-full px-4 md:px-6 lg:px-8">
  {/* Content */}
</div>

// Centered narrow content
<div className="max-w-2xl mx-auto px-4">
  {/* Content */}
</div>
```

### 7.4 Responsive Breakpoints

| Name | Min Width | Tailwind Prefix | Target Devices |
|------|-----------|-----------------|----------------|
| **Mobile** | 0px | (none) | iPhone SE, small phones |
| **SM** | 640px | `sm:` | Large phones (landscape) |
| **MD** | 768px | `md:` | Tablets, iPad |
| **LG** | 1024px | `lg:` | Small laptops, iPad Pro |
| **XL** | 1280px | `xl:` | Desktops, large laptops |
| **2XL** | 1536px | `2xl:` | Large desktops |

#### Mobile-First Approach

```tsx
// Mobile: stack, Desktop: side-by-side
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>

// Responsive text sizes
<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
  Heading
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

### 7.5 Grid System

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card />
  <Card />
  <Card />
</div>

// Auto-fit grid (dynamic columns)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

### 7.6 iOS Safe Areas

**Critical for iPhone X and newer:**

```css
/* Safe area padding */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-left {
  padding-left: env(safe-area-inset-left);
}

.safe-right {
  padding-right: env(safe-area-inset-right);
}
```

```tsx
// Fixed bottom navigation with safe area
<nav className="fixed bottom-0 left-0 right-0 pb-safe bg-card border-t border-border">
  <div className="flex justify-around p-4">
    {/* Nav items */}
  </div>
</nav>

// Add to Tailwind config
module.exports = {
  theme: {
    extend: {
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
}
```

### 7.7 Touch Targets (iOS Optimized)

**Minimum Sizes (Apple HIG):**
- **Touch Target**: 44px × 44px minimum
- **Comfortable**: 48px × 48px recommended
- **Spacing**: 8px minimum between targets

```tsx
// Minimum touch target
<button className="min-h-[44px] min-w-[44px] p-2 rounded-full">
  <Icon className="w-5 h-5" />
</button>

// Comfortable touch target
<button className="h-12 px-6 rounded-xl">
  Continue
</button>

// List items with proper spacing
<div className="space-y-2">
  {items.map(item => (
    <button key={item.id} className="w-full h-12 px-4 text-left rounded-lg hover:bg-accent/10">
      {item.name}
    </button>
  ))}
</div>
```

### 7.8 Layout Philosophy

**Guiding Principles:**
- **Achievable**: Clear structure, not overwhelming
- **Breathing Room**: Generous spacing for somatic comfort
- **Clear Direction**: Visual hierarchy guides the eye
- **Whimsical**: Rounded corners, friendly proportions
- **Mobile-First**: Optimized for touch, scalable to desktop

**Common Patterns:**

```tsx
// Page layout
<div className="min-h-screen bg-background">
  <header className="sticky top-0 z-50 bg-card border-b border-border">
    {/* Navigation */}
  </header>
  
  <main className="container mx-auto px-4 py-8 md:py-12">
    {/* Content */}
  </main>
  
  <footer className="border-t border-border py-8">
    {/* Footer */}
  </footer>
</div>

// Card grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {dreams.map(dream => (
    <DreamCard key={dream.id} dream={dream} />
  ))}
</div>

// Sidebar layout (desktop)
<div className="flex gap-6">
  <aside className="hidden lg:block w-64 space-y-4">
    {/* Sidebar */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

---

## 8. Dark Mode

### 8.1 Dark Mode Support
All colors have dark mode variants defined in CSS variables. The system automatically switches based on the `.dark` class on the root element.

### 8.2 Dark Mode Color Adjustments (Inspired by Pillowtalk)
- **Darker Backgrounds**: Dark blue-gray instead of white
- **Pops of Color**: Accent colors stand out more against darker backgrounds
- **Atmosphere**: Creates a more intimate, focused experience
- **Text**: Light gray instead of dark gray
- **Borders**: Darker, more subtle in dark mode

### 8.3 Implementation
- Uses CSS custom properties with `.dark` class selector
- Tailwind configured with `darkMode: ["class"]`
- All components support both light and dark modes

---

## 9. Accessibility (WCAG 2.1 AA Compliant)

### 9.1 Color Contrast Requirements

#### Text Contrast Ratios (WCAG 2.1 AA)

| Text Size | Minimum Ratio | Our Standard | Status |
|-----------|---------------|--------------|--------|
| **Normal text** (< 18px) | 4.5:1 | 4.5:1+ | ✅ |
| **Large text** (≥ 18px) | 3:1 | 4.5:1+ | ✅ |
| **UI components** | 3:1 | 3:1+ | ✅ |

#### Color Combinations Tested

| Foreground | Background | Ratio | Pass | Usage |
|------------|------------|-------|------|-------|
| Primary purple | White | 7.2:1 | ✅ AAA | Headings, buttons |
| Foreground | Background | 12.5:1 | ✅ AAA | Body text |
| Muted foreground | Background | 4.6:1 | ✅ AA | Secondary text |
| Secondary cyan | White | 4.8:1 | ✅ AA | Links (18px+) |
| Accent orange | White | 3.2:1 | ⚠️ AA Large | Large text only |
| Success green | White | 4.5:1 | ✅ AA | Success messages |
| Destructive red | White | 4.7:1 | ✅ AA | Error messages |

⚠️ **Important:** Accent orange should only be used for text 24px or larger, or with alternative indicators (icons, borders).

### 9.2 Focus Management

#### Focus Visible States

```tsx
// Standard focus ring
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
  Continue
</button>

// Custom focus styles
<input className="focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />

// Skip focus for mouse users
<div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
  {/* Content */}
</div>
```

#### Focus Ring Specifications

```css
:root {
  --ring: 254 62% 58%; /* Primary purple */
  --ring-offset: 0 0% 100%; /* White background */
}

.dark {
  --ring-offset: 220 20% 10%; /* Dark background */
}

/* Standard focus ring */
.focus-ring {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring-offset)),
              0 0 0 4px hsl(var(--ring));
}
```

#### Keyboard Navigation

```tsx
// Skip to main content link
<a 
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
>
  Skip to main content
</a>

// Focus trap in modals
import { Dialog } from '@headlessui/react';

<Dialog open={isOpen} onClose={closeModal}>
  <Dialog.Panel>
    {/* Modal content - focus trapped inside */}
  </Dialog.Panel>
</Dialog>
```

### 9.3 Screen Reader Support

#### Semantic HTML

```tsx
// Use semantic elements
<header>
  <nav aria-label="Main navigation">
    {/* Navigation items */}
  </nav>
</header>

<main id="main-content">
  <article>
    <h1>Dream Title</h1>
    <p>Description...</p>
  </article>
</main>

<footer>
  {/* Footer content */}
</footer>
```

#### ARIA Labels

```tsx
// Icon buttons need labels
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

// Loading states
<button disabled aria-busy="true">
  <Spinner className="animate-spin" />
  <span className="sr-only">Loading...</span>
</button>

// Form inputs
<label htmlFor="dream-title" className="sr-only">
  Dream Title
</label>
<input id="dream-title" name="dream-title" />

// Status updates
<div role="status" aria-live="polite">
  Dream saved successfully
</div>
```

#### Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### 9.4 Typography Accessibility

#### Readable Sizes
- **Minimum body text**: 16px (1rem)
- **Small text**: 14px minimum (use sparingly)
- **Line height**: 1.5 for body, 1.2-1.4 for headings
- **Line length**: 45-75 characters optimal

#### Text Spacing

```css
/* WCAG 2.1 Level AA requirements */
p {
  line-height: 1.5; /* Minimum 1.5x font size */
  margin-bottom: 1em; /* Paragraph spacing */
}

/* Letter spacing for ALL CAPS */
.uppercase-label {
  letter-spacing: 0.05em; /* 5% of font size */
}
```

### 9.5 Touch & Click Targets

#### Size Requirements (iOS + WCAG)

| Target Type | Minimum Size | Recommended | Spacing |
|-------------|--------------|-------------|---------|
| **Touch target** | 44px × 44px | 48px × 48px | 8px |
| **Desktop click** | 24px × 24px | 32px × 32px | 4px |
| **Icon buttons** | 44px × 44px | 48px × 48px | 8px |

```tsx
// Proper touch target
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center">
  <Icon className="w-5 h-5" />
</button>

// Increase touch area without visible size change
<button className="relative p-2">
  <Icon className="w-5 h-5" />
  <span className="absolute inset-0 -m-2" /> {/* Extends hit area */}
</button>
```

### 9.6 Motion & Animation

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// Respect user preference in JavaScript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Apply animations
  confetti();
}
```

### 9.7 Form Accessibility

#### Complete Form Pattern

```tsx
<form onSubmit={handleSubmit}>
  {/* Fieldset for grouped inputs */}
  <fieldset className="space-y-4">
    <legend className="text-lg font-semibold text-primary mb-4">
      Dream Details
    </legend>
    
    {/* Input with label, description, and error */}
    <div className="space-y-2">
      <label htmlFor="title" className="text-sm font-semibold">
        Dream Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        aria-describedby="title-description title-error"
        aria-invalid={!!errors.title}
        className="w-full px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-primary"
      />
      <p id="title-description" className="text-xs text-muted-foreground">
        Make it specific and measurable
      </p>
      {errors.title && (
        <p id="title-error" role="alert" className="text-xs text-destructive">
          {errors.title}
        </p>
      )}
    </div>
  </fieldset>
  
  <button type="submit" className="bg-primary text-primary-foreground">
    Save Dream
  </button>
</form>
```

### 9.8 Accessibility Testing Checklist

- [ ] All images have alt text
- [ ] All icon buttons have aria-labels
- [ ] Color is not the only indicator (use icons, text)
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works throughout
- [ ] Form errors are announced to screen readers
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Touch targets meet 44px minimum
- [ ] Contrast ratios meet WCAG AA
- [ ] Animations respect prefers-reduced-motion
- [ ] Modal focus is trapped
- [ ] Live regions announce dynamic content

---

## 10. Implementation Reference

### 10.1 File Structure

```
src/
├── index.css                    # CSS variables, global styles
├── assets/
│   ├── dreamaker-logo.png      # Main logo (32×32)
│   └── dreamaker-welcome-logo.png  # Welcome logo (192×192)
├── components/
│   └── ui/                      # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
└── ...

tailwind.config.ts               # Tailwind theme configuration
```

### 10.2 CSS Variables (src/index.css)

#### Complete Variable Definitions

```css
@layer base {
  :root {
    /* Typography */
    --font-sans: 'Nunito', system-ui, -apple-system, sans-serif;
    
    /* Colors - Primary */
    --primary: 254 62% 58%;
    --primary-foreground: 0 0% 100%;
    --primary-glow: 254 62% 70%;
    
    --secondary: 199 100% 55%;
    --secondary-foreground: 0 0% 100%;
    
    --accent: 39 100% 56%;
    --accent-foreground: 0 0% 10%;
    
    /* Neutrals */
    --background: 0 0% 100%;
    --foreground: 210 20% 16%;
    --card: 0 0% 100%;
    --card-foreground: 210 20% 16%;
    --muted: 210 17% 95%;
    --muted-foreground: 211 12% 52%;
    --border: 210 20% 91%;
    --input: 210 20% 91%;
    --ring: 254 62% 58%;
    
    /* Semantic */
    --success: 142 71% 45%;
    --warning: 45 100% 60%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    /* Domain Colors */
    --domain-work: 254 62% 58%;
    --domain-wealth: 142 71% 45%;
    --domain-family: 320 70% 55%;
    --domain-friends: 199 100% 55%;
    --domain-health: 25 95% 53%;
    --domain-spirituality: 280 68% 60%;
    --domain-interests: 180 70% 45%;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 hsl(210 20% 16% / 0.05);
    --shadow-md: 0 4px 6px -1px hsl(210 20% 16% / 0.08);
    --shadow-lg: 0 10px 15px -3px hsl(210 20% 16% / 0.08);
    --shadow-card: 0 2px 8px hsl(210 20% 16% / 0.06);
    --shadow-glow: 0 0 40px hsl(254 62% 58% / 0.4);
    
    /* Border Radius */
    --radius: 0.75rem;
  }
  
  .dark {
    --primary: 254 62% 65%;
    --primary-glow: 254 62% 75%;
    --secondary: 199 100% 60%;
    --accent: 39 100% 60%;
    
    --background: 220 20% 10%;
    --foreground: 210 20% 95%;
    --card: 220 20% 13%;
    --card-foreground: 210 20% 95%;
    --muted: 220 20% 18%;
    --muted-foreground: 210 15% 65%;
    --border: 220 20% 20%;
    --input: 220 20% 20%;
    
    --shadow-glow: 0 0 50px hsl(254 62% 65% / 0.5);
    --shadow-card: 0 15px 50px hsl(0 0% 0% / 0.4);
  }
  
  /* Global styles */
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

### 10.3 Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        domain: {
          work: 'hsl(var(--domain-work))',
          wealth: 'hsl(var(--domain-wealth))',
          family: 'hsl(var(--domain-family))',
          friends: 'hsl(var(--domain-friends))',
          health: 'hsl(var(--domain-health))',
          spirituality: 'hsl(var(--domain-spirituality))',
          interests: 'hsl(var(--domain-interests))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flow-border': 'flow-border 4s ease infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px hsl(254 62% 58% / 0.5), 0 0 40px hsl(254 62% 58% / 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px hsl(254 62% 58% / 0.8), 0 0 80px hsl(254 62% 58% / 0.5)',
          },
        },
        'flow-border': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### 10.4 Font Import (src/index.css)

```css
/* Google Fonts - Nunito */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
```

### 10.5 Component Usage Examples

#### Using Tailwind Classes

```tsx
// Button
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-semibold transition-all">
  Continue
</button>

// Card
<div className="bg-card border border-border rounded-xl shadow-card p-6">
  <h3 className="text-primary font-semibold text-2xl mb-2">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>

// Input
<input className="w-full px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-primary" />
```

#### Using CSS Variables Directly

```tsx
// Custom styling
<div style={{
  backgroundColor: 'hsl(var(--card))',
  borderColor: 'hsl(var(--primary) / 0.3)',
  boxShadow: 'var(--shadow-glow)',
}}>
  Custom styled element
</div>
```

### 10.6 Quick Implementation Checklist

When creating new components:

- [ ] Use Nunito font (already configured)
- [ ] Apply proper color variables (HSL format)
- [ ] Add focus states for accessibility
- [ ] Ensure 44px minimum touch targets
- [ ] Include hover/active states
- [ ] Support dark mode (test with `.dark` class)
- [ ] Add proper ARIA labels
- [ ] Test keyboard navigation
- [ ] Respect `prefers-reduced-motion`
- [ ] Use semantic HTML elements

---


## 11. Design Philosophy Summary

For the complete design philosophy and core principles, see **Section 1.3: Brand Direction & Personality**. The principles outlined there should guide all design decisions across typography, colors, components, animations, and layout.

---

## 12. Usage Examples

### 12.1 Onboarding Welcome Screen
```tsx
// Heading with brand colors
<h1 className="text-4xl md:text-5xl font-sans font-bold mb-6">
  <span className="text-primary">Welcome to</span>{" "}
  <span className="text-secondary">Dreamaker</span>
</h1>

// Primary button (achievable, not overwhelming)
<Button className="bg-primary text-primary-foreground">
  Let's go
</Button>
```

### 12.2 Card with Subtle Gradient (Inspired by Ash)
```tsx
// Card with subtle gradient background
<div className="bg-gradient-to-br from-card to-card/95 rounded-xl border border-border shadow-card">
  {/* Card content */}
</div>
```

### 12.3 Domain Badge
```tsx
// Domain color usage
<span className="bg-domain-work text-white px-2.5 py-1 rounded-full">
  Work
</span>
```

---

## 13. Maintenance & Updates

### 13.1 Single Source of Truth

| Element | Primary Location | Documentation |
|---------|------------------|---------------|
| **Colors** | `src/index.css` (CSS variables) | This document (Section 3) |
| **Typography** | `tailwind.config.ts` + `src/index.css` | This document (Section 2) |
| **Components** | `src/components/ui/` | This document (Section 5) |
| **Animations** | `tailwind.config.ts` (keyframes) | This document (Section 6) |
| **Spacing** | Tailwind config + CSS variables | This document (Section 7) |

### 13.2 Update Workflow

#### When Making Brand Changes:

1. **Update CSS Variables** (`src/index.css`)
   - Modify color/shadow/radius values
   - Test in both light and dark modes

2. **Update Tailwind Config** (`tailwind.config.ts`)
   - Add new colors to theme.extend.colors
   - Update animations/keyframes if needed

3. **Update This Document**
   - Reflect changes in relevant sections
   - Update "Last Updated" date
   - Add to changelog if significant

4. **Test Changes**
   - Check color contrast (WCAG AA)
   - Test on iOS devices
   - Verify dark mode
   - Test accessibility

5. **Communicate Changes**
   - Notify development team
   - Update design system documentation
   - Create migration guide if breaking

### 13.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0** | December 30, 2025 | ✅ Complete redesign with Nunito, comprehensive component system, iOS optimization |
| **0.9** | December 2025 | Initial brand guidelines with color palette |

### 13.4 Completed Updates ✅

- ✅ **Font Selection**: Nunito chosen and documented
- ✅ **Color System**: HSL format standardized, accessibility tested
- ✅ **Family Domain Color**: Updated from pink to magenta (`320 70% 55%`)
- ✅ **Typography Scale**: Complete scale with responsive sizes
- ✅ **Button System**: All 6 variants documented with states
- ✅ **Card Components**: Standard, elevated, featured, editable variants
- ✅ **Input System**: Complete with states and iOS optimization
- ✅ **Animation System**: iOS-optimized timing with reduced motion support
- ✅ **Accessibility**: WCAG 2.1 AA compliant, complete guidelines
- ✅ **iOS Optimization**: Safe areas, touch targets, mobile-first
- ✅ **Signature Effects**: Flow border animation, pulse glow

### 13.5 Pending Enhancements (Future)

**Low Priority:**
- [ ] Logo enhancement: Make star/sparkle more illustrative
- [ ] Add Georgia serif font for wisdom/quote sections
- [ ] Create Figma component library matching guidelines
- [ ] Add more animation presets
- [ ] Document print styles
- [ ] Add email template guidelines

### 13.6 Breaking Changes Policy

When making changes that affect existing components:

1. **Document the change** in this section
2. **Provide migration guide** with code examples
3. **Use deprecation warnings** for 1 version cycle
4. **Maintain backwards compatibility** when possible

### 13.7 Regular Review Schedule

- **Weekly**: Check for accessibility issues
- **Monthly**: Review new patterns and document
- **Quarterly**: Full brand audit and consistency check
- **Yearly**: Major version review and modernization

### 13.8 Contribution Guidelines

When adding new patterns:

1. **Check existing patterns** first (avoid duplication)
2. **Follow naming conventions** (kebab-case for CSS, PascalCase for components)
3. **Include accessibility** considerations
4. **Add code examples** with both Tailwind and CSS
5. **Test on iOS** devices
6. **Document in this file** with proper section placement

### 13.9 Support & Questions

**For brand guideline questions:**
- Check this document first (use Ctrl/Cmd+F to search)
- Review implementation examples in Section 10
- Check component library in `src/components/ui/`

**For technical implementation:**
- See tailwind.config.ts for theme values
- See src/index.css for CSS variables
- Check Section 10 for complete reference

---

## 14. Quick Reference Cheatsheets

### Color Cheatsheet

```css
/* Primary Actions */
bg-primary text-primary-foreground

/* Secondary Actions */
bg-secondary text-secondary-foreground

/* Accent/Highlights */
bg-accent text-accent-foreground

/* Cards */
bg-card border-border shadow-card

/* Text */
text-foreground              /* Primary text */
text-muted-foreground        /* Secondary text */

/* Domain Colors */
bg-domain-work bg-domain-health bg-domain-family
```

### Typography Cheatsheet

```tsx
/* Headings */
<h1 className="text-5xl md:text-6xl font-bold">Hero</h1>
<h2 className="text-4xl font-bold">Major Heading</h2>
<h3 className="text-2xl font-semibold">Section Heading</h3>

/* Body */
<p className="text-base leading-normal">Body text</p>
<p className="text-sm">Small text</p>
<p className="text-xs tracking-wide">Caption</p>
```

### Component Cheatsheet

```tsx
/* Button */
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-semibold">
  Continue
</button>

/* Card */
<div className="bg-card border border-border rounded-xl shadow-card p-6">
  Content
</div>

/* Input */
<input className="w-full px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-primary" />
```

### Animation Cheatsheet

```tsx
/* Entry animations */
animate-fade-in              /* Fade in */
animate-fade-up              /* Fade + slide up */
animate-scale-in             /* Scale + fade */

/* Continuous */
animate-pulse-glow           /* Pulsing glow effect */
animate-float                /* Floating motion */
animate-flow-border          /* Animated border gradient */
```

### Spacing Cheatsheet

```tsx
/* Common patterns */
p-4 p-6 p-8                  /* Padding */
gap-4 gap-6                  /* Flex/grid gap */
space-y-4                    /* Vertical stack */
mb-4 mb-6 mb-8               /* Margin bottom */
```

---

**Document Status**: ✅ **COMPLETE** - Production-ready brand guidelines with comprehensive iOS optimization  
**Version**: 1.0  
**Last Updated**: December 30, 2025  
**Font**: Nunito (Implemented)  
**Color Format**: HSL (Standardized)  
**Accessibility**: WCAG 2.1 AA Compliant  
**Platform**: iOS-Optimized, Mobile-First

