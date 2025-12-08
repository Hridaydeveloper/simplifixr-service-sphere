-- Add title and subtitle columns to home_page_images table
ALTER TABLE public.home_page_images 
ADD COLUMN title text,
ADD COLUMN subtitle text;