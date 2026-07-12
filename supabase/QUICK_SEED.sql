-- Quick Seed: Just Sections (Minimal Data)
-- Run this in Supabase SQL Editor to populate sections so the home page works

-- Insert 6 sections
INSERT INTO sections (name, description, grade_range, tier_color, icon_name, display_order) VALUES
('Little Maths Sprout', 'Perfect for young mathematicians just beginning their journey', 'K-2', 'sage', 'sprout', 1),
('Rising Maths Explorers', 'For curious minds exploring the wonder of numbers', '3-4', 'coral', 'explorer', 2),
('Maths Navigators', 'Charting the course through mathematical landscapes', '5-6', 'sky', 'compass', 3),
('Problem Solvers Academy', 'Where logic and creativity intersect', '7-8', 'marigold', 'lightbulb', 4),
('Advanced Maths Craftsmen', 'Mastering complex mathematical thinking', '9-10', 'ink-slate', 'hammer', 5),
('Elite Maths Champions', 'The pinnacle of mathematical excellence and innovation', '11-12', 'ink-navy', 'trophy', 6);

-- Insert a few sample questions for each section so practice mode works
INSERT INTO questions (section_id, round_type, difficulty_tier, content, answer_type, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
((SELECT id FROM sections WHERE name = 'Little Maths Sprout'), 'grid', 'easy', 'What is 2 + 3?', 'mcq', '4', '5', '6', '7', '5', 1),
((SELECT id FROM sections WHERE name = 'Little Maths Sprout'), 'grid', 'easy', 'What is 5 + 4?', 'mcq', '8', '9', '10', '11', '9', 1),
((SELECT id FROM sections WHERE name = 'Little Maths Sprout'), 'tiered', 'easy', 'Solve: x + 2 = 5', 'numeric', NULL, NULL, NULL, NULL, '3', 1),
((SELECT id FROM sections WHERE name = 'Little Maths Sprout'), 'sprint', NULL, 'What is 1 + 1?', 'mcq', '1', '2', '3', '4', '2', 1),
((SELECT id FROM sections WHERE name = 'Rising Maths Explorers'), 'grid', 'easy', 'What is 12 + 8?', 'mcq', '18', '19', '20', '21', '20', 1),
((SELECT id FROM sections WHERE name = 'Rising Maths Explorers'), 'grid', 'medium', 'What is 7 × 6?', 'mcq', '40', '41', '42', '43', '42', 1),
((SELECT id FROM sections WHERE name = 'Rising Maths Explorers'), 'tiered', 'easy', 'Solve: x + 5 = 12', 'numeric', NULL, NULL, NULL, NULL, '7', 1),
((SELECT id FROM sections WHERE name = 'Rising Maths Explorers'), 'sprint', NULL, 'What is 30 + 20?', 'mcq', '45', '50', '55', '60', '50', 1),
((SELECT id FROM sections WHERE name = 'Maths Navigators'), 'grid', 'easy', 'What is the square root of 36?', 'mcq', '4', '5', '6', '7', '6', 1),
((SELECT id FROM sections WHERE name = 'Maths Navigators'), 'tiered', 'easy', 'Convert 0.5 to a fraction', 'numeric', NULL, NULL, NULL, NULL, '0.5', 1),
((SELECT id FROM sections WHERE name = 'Problem Solvers Academy'), 'grid', 'medium', 'Solve: 2x + 3 = 11', 'numeric', NULL, NULL, NULL, NULL, '4', 1),
((SELECT id FROM sections WHERE name = 'Problem Solvers Academy'), 'sprint', NULL, 'What is 256 ÷ 4?', 'mcq', '62', '63', '64', '65', '64', 1),
((SELECT id FROM sections WHERE name = 'Advanced Maths Craftsmen'), 'grid', 'hard', 'What is the derivative of x³?', 'numeric', NULL, NULL, NULL, NULL, '3x²', 1),
((SELECT id FROM sections WHERE name = 'Elite Maths Champions'), 'grid', 'hard', 'What is e (Euler''s number) approximately?', 'mcq', '2.71', '2.72', '3.14', '1.41', '2.72', 1);

-- Verify sections were inserted
SELECT COUNT(*) as section_count FROM sections;
SELECT COUNT(*) as question_count FROM questions;
