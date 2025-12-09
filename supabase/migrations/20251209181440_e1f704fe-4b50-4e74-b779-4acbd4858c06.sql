-- Create home_page_images table for banner management
CREATE TABLE public.home_page_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.home_page_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view active banners (for homepage display)
CREATE POLICY "Anyone can view active home page images"
ON public.home_page_images
FOR SELECT
USING (is_active = true);

-- Admins can view all banners
CREATE POLICY "Admins can view all home page images"
ON public.home_page_images
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert banners
CREATE POLICY "Admins can insert home page images"
ON public.home_page_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update banners
CREATE POLICY "Admins can update home page images"
ON public.home_page_images
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete banners
CREATE POLICY "Admins can delete home page images"
ON public.home_page_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_home_page_images_updated_at
BEFORE UPDATE ON public.home_page_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for banner images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banner images
CREATE POLICY "Anyone can view banner images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banner images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'banners' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update banner images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'banners' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete banner images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'banners' AND has_role(auth.uid(), 'admin'::app_role));