import { useState, useEffect } from 'react';
import { homePageImageService, HomePageImage } from '@/services/homePageImageService';

export const useHomePageImages = () => {
  const [images, setImages] = useState<HomePageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await homePageImageService.getActiveImages();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch home page images:', err);
      setError('Failed to load images');
      // Fallback to default images if database fetch fails
      setImages([
        {
          id: 'fallback-1',
          image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=80&auto=format&fit=crop',
          alt_text: 'Spa and wellness services',
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop',
          alt_text: 'Home maintenance services',
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    error,
    refetch: fetchImages
  };
};