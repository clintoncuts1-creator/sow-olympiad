-- ============================================================================
-- CLEANUP DUPLICATE SECTIONS
-- Removes the 4 incorrect leftover sections that should have been deleted
-- Keeps only the 6 correct sections
-- ============================================================================

-- First, identify and delete the 4 incorrect sections
-- The sections to DELETE are:
-- - Maths Navigators
-- - Problem Solvers Academy
-- - Advanced Maths Craftsmen
-- - Elite Maths Champions

-- Note: Cascade deletes will handle:
-- - questions referencing these sections
-- - rooms referencing these sections
-- - room_questions for those rooms
-- - certificates for those sections

DELETE FROM sections 
WHERE name IN (
  'Maths Navigators',
  'Problem Solvers Academy',
  'Advanced Maths Craftsmen',
  'Elite Maths Champions'
);

-- Verify: Should have exactly 6 sections remaining
-- The 6 correct sections are:
-- 1. Little Maths Sprout
-- 2. Rising Maths Explorers
-- 3. Clever Calculators
-- 4. Elite Problem Solvers
-- 5. Algebra Warriors
-- 6. Grand Maths Master League

SELECT id, name, grade_range, tier_color, icon_name, display_order 
FROM sections 
ORDER BY display_order;

-- Confirm count is exactly 6
SELECT COUNT(*) as section_count FROM sections;
