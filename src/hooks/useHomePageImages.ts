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
      // No fallback - admin must add banners
      setImages([]);
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