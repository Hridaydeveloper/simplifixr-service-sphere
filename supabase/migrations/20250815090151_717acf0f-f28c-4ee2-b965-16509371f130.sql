-- Create table for home page images
CREATE TABLE public.home_page_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.home_page_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view active home page images
CREATE POLICY "Anyone can view active home page images" 
ON public.home_page_images 
FOR SELECT 
USING (is_active = true);

-- Only authenticated users with admin role can manage home page images
CREATE POLICY "Admins can manage home page images" 
ON public.home_page_images 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_home_page_images_updated_at
BEFORE UPDATE ON public.home_page_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial home page images (excluding the problematic one)
INSERT INTO public.home_page_images (image_url, alt_text, display_order) VALUES
('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=80&auto=format&fit=crop', 'Spa and wellness services', 1),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop', 'Home maintenance services', 2),
('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600&q=80&auto=format&fit=crop', 'Tutoring and education services', 3),
('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format&fit=crop', 'Home cleaning services', 4),
('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop', 'Appliance repair services', 5);