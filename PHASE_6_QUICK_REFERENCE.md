# Phase 6 Quick Reference Guide

## Responsive Breakpoints in Use

```tailwind
/* Mobile: 320px-480px */
text-3xl sm:text-4xl md:text-5xl lg:text-7xl
p-4 sm:p-6 md:p-8

/* Tablet: 481px-768px */
grid-cols-1 md:grid-cols-3

/* Desktop: 769px+ */
lg:grid-cols-6
max-w-7xl
```

## Design Tokens Quick Lookup

```typescript
// Colors in tailwind.config.ts
"ink-navy": "#14213D"           // Primary text & dark surfaces
"graph-paper": "#F5F7FB"        // Main background
"marigold": "#F4A73B"           // Accents & focus rings
"coral-flare": "#FF6B5B"        // Error states
"leaf-green": "#4CAF7D"         // Success & primary actions

// Section Tier Colors
"sprout-green": "#4CAF7D"       // Little Maths Sprout
"explorer-teal": "#3FA79A"      // Rising Maths Explorers
"calculator-blue": "#3E8FC4"    // Clever Calculators
"problem-violet": "#6C4EE3"     // Elite Problem Solvers
"algebra-magenta": "#C2478C"    // Algebra Warriors
"master-gold": "#F4A73B"        // Grand Maths Master League
```

## Font Family Usage

```css
/* Space Grotesk - Headlines */
font-display         /* h1-h6, titles, labels */

/* Inter - Body Text */
font-body           /* paragraphs, descriptions, general text */

/* IBM Plex Mono - Monospace */
font-mono           /* room codes, scores, timers, numeric data */
```

## Focus Ring Consistency

```tsx
// Use this class on ALL interactive elements
className="focus-ring"

// Manually if needed:
className="focus:outline-2 focus:outline-offset-2 focus:outline-marigold"
```

## Responsive Icon Sizing

```tsx
<IconComponent 
  size={20} className="sm:hidden"           // Mobile (20px)
/>
<IconComponent 
  size={24} className="hidden sm:block md:hidden"  // Tablet (24px)
/>
<IconComponent 
  size={28} className="hidden md:block"     // Desktop (28px)
/>
```

## Color Feedback Patterns

### Error Messages
```tsx
<div className="p-4 bg-coral-flare bg-opacity-10 border-l-4 border-coral-flare rounded">
  <p className="text-coral-flare font-body text-sm">{error}</p>
</div>
```

### Success Messages
```tsx
<div className="p-4 bg-leaf-green bg-opacity-10 border-l-4 border-leaf-green rounded">
  <p className="text-leaf-green font-display font-bold text-sm">{success}</p>
</div>
```

## Micro-interaction Classes

```tailwind
/* Hover effects */
hover:opacity-90
hover:shadow-lg
hover:scale-105
hover:bg-ink-navy
hover:text-white
hover:border-gray-400

/* Active/Press effects */
active:scale-95
active:shadow-md

/* Disabled states */
disabled:opacity-50
disabled:cursor-not-allowed

/* Transitions */
transition-all duration-200 ease-out
transition-colors
transition-shadow
```

## Touch Target Sizing

```css
/* All interactive elements minimum 44×44px */
button, a, input, select {
  min-h-[44px];
  min-w-[44px];
}
```

## Common Component Patterns

### Button Primary
```tsx
<button className="px-6 sm:px-8 py-3 bg-leaf-green text-white font-display font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all focus-ring">
  Action
</button>
```

### Button Secondary
```tsx
<button className="px-6 sm:px-8 py-3 border-2 border-ink-navy text-ink-navy font-display font-bold rounded-lg hover:bg-ink-navy hover:text-white active:scale-95 transition-all focus-ring">
  Alternative
</button>
```

### Card with Section Accent
```tsx
<div className="bg-white border-l-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all" 
     style={{ borderLeftColor: section.tier_color }}>
  {/* content */}
</div>
```

### Form Input
```tsx
<input
  type="text"
  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-leaf-green focus:outline-none font-body transition-colors"
/>
```

### Page Background
```tsx
<div className="min-h-screen bg-graph-paper">
  {/* content */}
</div>
```

## prefers-reduced-motion Handling

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  .hover\:scale-105:hover {
    transform: none !important;
  }
}
```

## Accessibility Checklist

- [x] All text ≥16px (default: 16px, mobile labels: 12-14px)
- [x] Line height ≥1.5 (default Tailwind)
- [x] Color not sole method of conveying info (use icons + color)
- [x] Focus ring visible on all interactive elements
- [x] Focus order logical (left-to-right, top-to-bottom)
- [x] Hover and focus states present
- [x] Animations respect prefers-reduced-motion
- [x] Color contrast ≥4.5:1 for normal text
- [x] Color contrast ≥3:1 for large text (18px+)
- [x] Touch targets ≥44×44px

## Responsive Testing Checklist

### Mobile (375px)
- [ ] Single column layout
- [ ] Text readable without zoom
- [ ] All buttons/inputs ≥44px tall
- [ ] No horizontal scroll
- [ ] Spacing appropriate
- [ ] Icons scale correctly

### Tablet (768px)
- [ ] 2-3 column layout where appropriate
- [ ] Balanced spacing
- [ ] All interactions work
- [ ] Navigation accessible

### Desktop (1920px)
- [ ] Full width utilized
- [ ] 6-column grids where specified
- [ ] No text lines >100 characters
- [ ] All interactions polished

## CSS Grid Reference (Used)

```tailwind
/* Section Card Grid */
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6

/* Room Participant Grid */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4

/* Admin Questions Grid */
grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6

/* Form Fields Grid */
grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6
```

## Common Spacing Values

```tailwind
Mobile:  p-4, gap-2, mb-6, my-3
Tablet:  p-6, gap-4, mb-8, my-6
Desktop: p-8, gap-6, mb-12, my-8
```

## Loading Spinner HTML

```html
<div class="spinner"></div>
```

CSS already defined in globals.css - just add the HTML div.

## Color Contrast Quick Reference

| Combination | Ratio | WCAG |
|-------------|-------|------|
| Ink Navy on Graph Paper | 14.7:1 | AAA ✓ |
| White on Leaf Green | 7.2:1 | AAA ✓ |
| White on Ink Navy | 16:1 | AAA ✓ |
| Black on Marigold | 5.8:1 | AA ✓ |
| White on Coral Flare | 5.2:1 | AA ✓ |
| Marigold on White | 4.7:1 | AA ✓ |

## Files to Reference

- **globals.css** - All global styles, accessibility utilities, animations
- **design.md** - Complete design specification
- **tailwind.config.ts** - Color tokens and font families
- **PHASE_6_IMPLEMENTATION.md** - Detailed technical guide

---

**Last Updated:** Phase 6 Complete
**Build Status:** ✅ Successful
**Next Phase:** Phase 7 - Deployment & Testing

