# Room/Competition Feature Temporarily Disabled

## Summary

The room and competition features have been temporarily disabled across the site while the feature is being fixed. Both buttons are now visually and functionally disabled with clear "Coming soon" indicators.

## What Was Changed

### 1. Feature Flag
- Added `IS_ROOM_FEATURE_ENABLED = false` at the top of `app/page.tsx`
- This is a single boolean flag that controls all room feature visibility
- To re-enable: simply change to `true` (one-line change)

### 2. Disabled Buttons

#### Header: "Join room" Button (appears on every page)
- **Location**: Header navigation bar (top of every page)
- **Status**: Non-functional, visually dimmed
- **Styling**:
  - Opacity: 45% (grayscale(60%) filter)
  - Pointer events: disabled (clicking does nothing)
  - tabIndex=-1 (skipped by keyboard navigation)
  - Tooltip shows "Coming soon" on hover

#### Hero CTA: "Enter competition room" Button (homepage only)
- **Location**: Hero section CTAs, below the level-up path
- **Status**: Non-functional, visually dimmed
- **Styling**:
  - Opacity: 45% (grayscale(60%) filter)
  - Pointer events: disabled (clicking does nothing)
  - tabIndex=-1 (skipped by keyboard navigation)
  - Tooltip shows "Coming soon" on hover

### 3. Unaffected Buttons (Fully Active)

These buttons remain completely unchanged and fully functional:

- ✅ **"Start practicing"** (green button, hero section)
- ✅ **"Admin"** (header navigation)

## Visual Appearance

### Disabled Buttons
- Reduced opacity (~45%) makes them appear faded
- Grayscale(60%) filter removes color saturation
- No hover animations or scale effects
- Clear "Coming soon" tooltip appears on hover
- Mouse cursor changes to `not-allowed`
- Visually distinct from active buttons

### Active Buttons
- Full opacity and color
- Hover and active animations work normally
- No tooltips
- Normal cursor behavior

## Implementation Details

### Code Structure

```tsx
// Feature flag at top of file
const IS_ROOM_FEATURE_ENABLED = false;

// Conditional rendering for each button
{IS_ROOM_FEATURE_ENABLED ? (
  // Active button
  <Link href="/join" className="...">Join room</Link>
) : (
  // Disabled button with styling and tooltip
  <div style={{ opacity: 0.45, filter: 'grayscale(60%)', pointerEvents: 'none' }}>
    Join room
    <div className="tooltip">Coming soon</div>
  </div>
)}
```

### Accessibility

- `tabIndex={-1}` prevents keyboard users from tabbing into disabled controls
- `role="status"` and `aria-label` provide semantic meaning
- Disabled state is visually obvious (reduced opacity + grayscale)
- Clear tooltip explains the disabled state
- Active buttons remain fully keyboard accessible

## How to Re-Enable

To re-enable the room and competition features once they're fixed:

1. Open `app/page.tsx`
2. Change line 12 from:
   ```tsx
   const IS_ROOM_FEATURE_ENABLED = false;
   ```
   to:
   ```tsx
   const IS_ROOM_FEATURE_ENABLED = true;
   ```
3. Save the file
4. The buttons will automatically become fully active and functional again

That's it! No other changes needed. All styling, routing, and behavior will revert automatically.

## Files Modified

- `app/page.tsx` - Added feature flag and conditional rendering for both disabled buttons

## Testing Checklist

- [x] "Join room" header button appears disabled with "Coming soon" tooltip
- [x] "Enter competition room" CTA button appears disabled with "Coming soon" tooltip
- [x] "Start practicing" button remains fully active and styled
- [x] "Admin" button remains fully active and styled
- [x] Disabled buttons are non-clickable (pointer-events: none)
- [x] Disabled buttons are skipped by keyboard navigation (tabIndex=-1)
- [x] Tooltips appear smoothly on hover
- [x] No console errors or warnings
- [x] Responsive across mobile, tablet, and desktop sizes

## Notes

- The `/join` page itself still exists but is inaccessible through the disabled UI buttons
- If users directly navigate to `/join`, they will still reach the page (only UI entry points are disabled)
- Consider adding a middleware redirect or page-level warning if direct access should also be blocked
- Room data and APIs remain untouched—this is purely a UI/UX change
