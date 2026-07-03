# Phase 6: Visual Polish & Responsive Design - IMPLEMENTATION PLAN

## Overview
Phase 6 focuses on ensuring the app is beautiful, responsive, and accessible across all device sizes and interaction patterns.

## Task 6.1: Responsive Layout Pass

### Breakpoints
- **Mobile:** 375px (iPhone SE, iPhone 12 mini)
- **Tablet:** 768px (iPad, Galaxy Tab)
- **Desktop:** 1920px (Full HD monitor)

### Pages to Review
1. `/` - Homepage (hero, sections grid)
2. `/practice` - Practice selector
3. `/practice/[section]/[roundType]` - Practice player
4. `/join` - Join room form
5. `/room/[code]` - Room lobby
6. `/room/[code]/play` - Live round player
7. `/room/[code]/leaderboard` - Leaderboard
8. `/host` - Host panel
9. `/admin` - Admin question bank
10. `/certificate/[id]` - Certificate display

### Responsive Fixes Needed
- [ ] Remove horizontal scrolling on any device
- [ ] Font sizes scale appropriately per breakpoint
- [ ] Buttons/touch targets ≥44×44px on mobile
- [ ] Grid/flex layouts adapt to screen size
- [ ] Spacing/padding scales appropriately
- [ ] Images scale properly (if any)
- [ ] Fixed headers don't obscure content
- [ ] Modals/dialogs fit on screen
- [ ] Forms are easy to fill on mobile

## Task 6.2: Design System Implementation

### Color Palette
```
Primary:
  - ink-navy: #1a1d2e
  - ink-slate: #3d3f4d
  
Accent:
  - marigold: #f5a623 (gold)
  - sage: #7cb342 (green)
  - coral: #ff6b6b (red)
  - sky: #4ecdc4 (teal)
  
Neutral:
  - white, gray-50, gray-100, gray-300
```

### Typography
```
Headlines: Space Grotesk (bold, 700 weight)
Body: Inter (regular, 400 weight)
Code: IBM Plex Mono (monospace)
```

### Section Tier Colors
```
1. Little Maths Sprout (K-2): Sage (#7cb342)
2. Rising Maths Explorers (3-4): Coral (#ff6b6b)
3. Maths Navigators (5-6): Sky (#4ecdc4)
4. Problem Solvers Academy (7-8): Marigold (#f5a623)
5. Advanced Maths Craftsmen (9-10): Ink Slate (#3d3f4d)
6. Elite Maths Champions (11-12): Ink Navy (#1a1d2e)
```

### Design Elements
- [ ] Borders: navy (#1a1d2e), 2-3px solid
- [ ] Shadows: subtle box-shadow (0 4px 6px rgba(0,0,0,0.1))
- [ ] Rounded corners: 8px border-radius
- [ ] Spacing: use Tailwind scale (8px base: 4, 8, 12, 16, 24, 32, 48...)
- [ ] Focus ring: 2-3px solid outline with 2px offset

## Task 6.3: Accessibility & Motion

### Keyboard Navigation
- [ ] Tab order logical (left-to-right, top-to-bottom)
- [ ] All interactive elements focusable
- [ ] Skip-to-content link on homepage
- [ ] No keyboard traps
- [ ] Escape closes dialogs/modals
- [ ] Enter submits forms

### Focus States
- [ ] All buttons: 2px ring with -2px offset
- [ ] All inputs: 2px ring, or border color change
- [ ] Links: ring or underline
- [ ] Focus ring color: consistent (sage or marigold)

### Color Contrast
- [ ] Text on background: 4.5:1 (WCAG AA minimum)
- [ ] Light text on dark: verify contrast
- [ ] Dark text on light: verify contrast
- [ ] Buttons: sufficient contrast for text

### Motion & Animation
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No auto-playing videos/animations
- [ ] Animation duration: 200-400ms (human scale)
- [ ] Animations are smooth (60 fps)
- [ ] Loading states are clear
- [ ] Transitions don't cause layout shift

### ARIA & Semantics
- [ ] Semantic HTML (button, input, nav, header, main, footer)
- [ ] Alt text for images (if any)
- [ ] Form labels associated with inputs
- [ ] ARIA labels for icon-only buttons
- [ ] Landmark roles (nav, main, etc.)

## Task 6.4: Micro-interactions

### Button States
- **Hover:** Scale up 2-5%, shadow increase, opacity change
- **Press/Active:** Scale down 2%, shadow decrease
- **Disabled:** opacity 50%, cursor not-allowed
- **Loading:** Spinner icon, disabled state

### Input Focus
- [ ] Input border color changes to accent (sage/marigold)
- [ ] Focus ring visible on all inputs
- [ ] Placeholder text visible but faded
- [ ] Error state: red border, error message below
- [ ] Success state: green border, success message

### Transitions
- [ ] Links: `transition-all 200ms ease-out`
- [ ] Hover effects: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- [ ] Page transitions: fade in 300ms
- [ ] Modals: scale + fade in 300ms

### Loading & Feedback
- [ ] Loading spinner: animated, centered
- [ ] Success toast: green background, auto-dismiss 3s
- [ ] Error toast: red background, stay visible
- [ ] Form submission: button changes to "Saving..." then shows checkmark
- [ ] Skeleton loaders for data loading

### Interactive Elements
- [ ] Cards: subtle shadow on hover
- [ ] Buttons: all hover/press states
- [ ] Inputs: focus, error, success states
- [ ] Modals: overlay fade, content scale-in
- [ ] Dropdowns: smooth open/close animation
- [ ] Progress bars: smooth animated fill

## Implementation Approach

1. **Start with responsive pass** (most time-consuming)
   - Test each page at 3 breakpoints
   - Fix layout issues with Tailwind media queries
   - Ensure no horizontal scrolling

2. **Apply design system** (visual polish)
   - Review all colors match palette
   - Verify fonts are correct
   - Check spacing/alignment consistency
   - Apply section tier colors to cards

3. **Add accessibility** (keyboard nav, focus, contrast)
   - Test keyboard-only navigation
   - Add focus states to all interactive elements
   - Verify color contrast ratios
   - Add prefers-reduced-motion support

4. **Polish interactions** (animations, feedback)
   - Add hover/press states to buttons
   - Smooth transitions on everything
   - Add loading spinners/feedback
   - Test animations don't cause motion sickness

## Success Criteria

✅ **Responsive:** No horizontal scroll at 375px, 768px, 1920px  
✅ **Design:** Colors, fonts, spacing consistent throughout  
✅ **Accessible:** Keyboard navigation works, focus states visible, contrast compliant  
✅ **Polished:** Smooth animations, clear feedback, professional feel  
✅ **Tested:** Works on iOS Safari, Chrome Desktop, Firefox, Chrome Mobile  

---

**Timeline:** 2-3 days for full Phase 6  
**Priority:** High - user experience critical for adoption
