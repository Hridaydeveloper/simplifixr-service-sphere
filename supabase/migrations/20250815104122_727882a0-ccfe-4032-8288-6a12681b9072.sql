-- Remove the first image (Spa and wellness services) since it's not loading properly
DELETE FROM home_page_images 
WHERE alt_text = 'Spa and wellness services' 
AND image_url = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=80&auto=format&fit=crop';