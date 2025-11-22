-- Add navigation fields to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS show_in_navigation boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS navigation_order integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_label text;