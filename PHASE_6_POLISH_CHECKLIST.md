# Phase 6 Polish Verification Checklist

This checklist verifies all 6 visual enhancements are working on the homepage after implementation.

## Enhancement 1: Level-Up Path Curve ✓
**Goal:** Replace straight line with winding SVG bezier curve (alternating up/down like a wave), animated on load

**Visual Checks:**
- [ ] Path between 6 hero nodes is a smooth, winding curve (not a straight line)
- [ ] Curve alternates up/down between nodes (wave pattern)
- [ ] Curve animates drawing from left to right on page load (2s duration)
- [ ] Animation respects prefers-reduced-motion (curve shown instantly if set)
- [ ] Curve appearance: gray (#D4D8E0) dashed lines between nodes

**Browser Test:**
1. Load homepage at http://localhost:3000
2. Look at the path between the 6 section icons
3. Watch for drawing animation on first load
4. Verify wave pattern (not straight line)
5. Disable animations in DevTools (reduce motion) and reload to verify instant display

---

## Enhancement 2: Grand Maths Master League Card Size ✓
**Goal:** Grand Maths Master League card should be visibly larger than other 5 cards

**Visual Checks:**
- [ ] Grand Maths Master League (6th) card is noticeably taller/wider
- [ ] Icon badge inside is larger
- [ ] Card has a subtle glow effect
- [ ] Desktop: Card appears at larger scale (110% or similar)
- [ ] Mobile/tablet: Still maintains layout but visually emphasized

**Browser Test:**
1. Scroll down to section grid
2. Look at the last card (Grand Maths Master League / Trophy icon)
3. Compare size to other 5 cards
4. Verify it stands out visually
5. Test on mobile (375px) and desktop (1920px) to ensure it scales correctly

---

## Enhancement 3: Card Hover Physics ✓
**Goal:** All section cards and round-type cards have sophisticated hover state

**Visual Checks:**
- [ ] On hover: Card lifts up (translateY -4px)
- [ ] On hover: Shadow appears/deepens (shadow-lg)
- [ ] On hover: Border/glow in tier color appears
- [ ] On hover: Icon scale increases (scale 1.1)
- [ ] On click/press: Slight scale-down (active:scale-95)
- [ ] Transition duration: ~150-200ms ease-out
- [ ] Round-type cards in /practice also have same hover effects

**Browser Test:**
1. Load homepage
2. Move mouse over section cards one by one
3. Observe:
   - Vertical movement (lift)
   - Shadow increase
   - Icon growing
   - Card color/glow in tier color
4. Click/press card - verify scale-down on press
5. Navigate to /practice, repeat for round-type cards

---

## Enhancement 4: Sticky Frosted Header ✓
**Goal:** Header becomes frosted (semi-transparent + blur) when scrolled

**Visual Checks:**
- [ ] At top of page: Header plain/opaque (bg-white)
- [ ] After scrolling down 20px: Header becomes semi-transparent
- [ ] On scroll: Background blur effect visible (backdrop-filter: blur(8px))
- [ ] On scroll: Subtle bottom border appears
- [ ] Logo and nav items remain readable through frosted effect
- [ ] Smooth transition between states (~200ms)

**Browser Test:**
1. Load homepage (header should be opaque at top)
2. Slowly scroll down
3. Observe header change from solid white to frosted glass appearance
4. Verify blur effect is visible
5. Continue scrolling and verify header stays frosted
6. Scroll back to top - verify transition back to opaque

---

## Enhancement 5: Scroll-Reveal on Section Cards ✓
**Goal:** Cards fade in and slide up as user scrolls section grid into view

**Visual Checks:**
- [ ] Cards start below viewport (or with opacity 0)
- [ ] As section becomes visible, cards fade in
- [ ] Cards slide up from translateY(16px) to 0
- [ ] Stagger timing: ~60-80ms per card (left-to-right, top-to-bottom)
- [ ] Uses IntersectionObserver (not scroll position library)
- [ ] Respects prefers-reduced-motion (shows cards instantly if set)
- [ ] Smooth 0.6s ease-out transition

**Browser Test:**
1. Load homepage (hero section visible)
2. Slowly scroll down to the "6 levels of challenge" section
3. Watch cards appear one by one with fade + slide-up effect
4. Observe stagger timing (each card starts a bit after the previous)
5. Scroll back up out of view, then scroll back down - verify animation triggers again
6. Enable reduce motion, reload, verify cards show instantly

---

## Enhancement 6: Live Stats Strip ✓
**Goal:** Stats bar below hero CTAs showing real Supabase data

**Visual Checks:**
- [ ] Stats section visible between CTAs and "6 levels of challenge" section
- [ ] Three stats displayed side-by-side (centered):
  - Total certificates issued (from certificates table COUNT)
  - Practice sessions completed this week (certificates WHERE mode='practice' AND date >= 7 days ago)
  - Live competition rooms currently active (rooms WHERE status='active')
- [ ] Numbers in IBM Plex Mono font (monospace)
- [ ] Large numbers (text-3xl/text-4xl)
- [ ] Muted labels underneath each number (text-xs/text-sm, opacity-70)
- [ ] Background: graph-paper color
- [ ] Text: ink-navy color
- [ ] On fresh install: Shows "0" for all stats (not hidden or fake numbers)
- [ ] Active rooms stat updates in real-time via Realtime subscription

**Browser Test:**
1. Load homepage
2. Scroll to just below CTA buttons
3. Verify stats bar displays:
   - Large monospace numbers
   - Muted labels below each
   - Graph-paper background
   - Centered layout
4. Create a test certificate via practice mode
5. Return to homepage - verify count increased (may need page refresh)
6. Create a live room - verify active rooms count updates in real-time

---

## Overall Visual Quality Checklist

- [ ] All 6 enhancements present and working
- [ ] No UI glitches, overlaps, or misaligned elements
- [ ] Animations smooth (60fps, no stuttering)
- [ ] Prefers-reduced-motion respected on all animations
- [ ] Touch targets ≥44×44px on mobile
- [ ] Responsive at all breakpoints:
  - [ ] Mobile (375px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1920px)
- [ ] Colors match design.md specification
- [ ] Typography correct (Space Grotesk, Inter, IBM Plex Mono)
- [ ] Focus rings visible on interactive elements
- [ ] No console errors in DevTools

---

## Browser Testing Matrix

Test in each browser at each viewport width:

| Browser | 375px | 768px | 1920px |
|---------|-------|-------|--------|
| Chrome  | ✓     | ✓     | ✓      |
| Firefox | ✓     | ✓     | ✓      |
| Safari  | ✓     | ✓     | ✓      |
| Edge    | ✓     | ✓     | ✓      |

---

## Screenshot Requirements

Provide screenshots showing:

1. **Homepage loaded state (Desktop 1920px)**
   - Full page from top of hero section
   - All 6 hero nodes visible with curve
   - CTAs and stats strip visible
   - Beginning of section cards grid

2. **Homepage scrolled state (Desktop 1920px)**
   - Header with frosted glass effect
   - Section cards with scroll-reveal animation in progress
   - Some cards faded in, some fading in
   - Bottom cards at bottom of viewport

3. **Homepage mobile state (375px)**
   - Hero section
   - Path/nodes at mobile size
   - Stats strip responsive layout
   - Cards grid in 2-column layout

---

## Notes

- All enhancements should feel polished and professional
- Animations should not distract from content
- No layout breaks or edge cases
- Data should be real (pulling from Supabase)
- Performance should be smooth on all devices

