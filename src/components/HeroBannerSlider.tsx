import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useHomePageImages } from "@/hooks/useHomePageImages";
import { useProviderStatus } from "@/hooks/useProviderStatus";
import { useAuth } from "@/contexts/AuthContext";

interface SlideContent {
  title: string;
  subtitle: string;
  image: string;
}

const HeroBannerSlider = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const providerStatus = useProviderStatus();
  const { images: heroImages } = useHomePageImages();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use slides from database - title and subtitle come directly from admin
  const slides: SlideContent[] = heroImages.length > 0
    ? heroImages.map((img) => ({
        title: img.title || '',
        subtitle: img.subtitle || '',
        image: img.image_url
      }))
    : [];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [slides.length, isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Auto-advance slides only if there are slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  const handleBookService = () => {
    navigate('/services', { state: { scrollToTop: true } });
  };

  const handleProviderDashboard = () => {
    if (providerStatus.isProvider) {
      navigate('/provider-dashboard');
    } else {
      navigate('/become-provider');
    }
  };

  const getProviderButtonText = () => {
    if (!user) return "Become a Provider";
    if (providerStatus.loading) return "Loading...";
    if (providerStatus.isVerified) return "Provider Dashboard";
    if (providerStatus.hasRegistration) return "View Status";
    return "Become a Provider";
  };

  // Show placeholder when no banners are set
  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[85vh] min-h-[550px] max-h-[800px] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="w-full text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              <span className="text-white text-sm font-medium">
                Services at Your Fingertips
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl mx-auto">
              Welcome to Simplifixr
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Your trusted platform for professional home services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Button 
                onClick={handleBookService} 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md"
              >
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleProviderDashboard}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-white/80 bg-white text-slate-800 hover:bg-white/90"
              >
                {getProviderButtonText()}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[550px] max-h-[800px] overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${slide.image})`,
              }}
            />
            
            {/* Subtle Dark Overlay - Same for light and dark modes */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </div>
        ))}
      </div>

      {/* Content Container - Centered */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full text-center">
          {/* Animated Content */}
          <div 
            key={currentSlide}
            className="space-y-6 animate-fade-in"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              <span className="text-white text-sm font-medium">
                Services at Your Fingertips
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl mx-auto">
              {slides[currentSlide]?.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {slides[currentSlide]?.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Button 
                onClick={handleBookService} 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={handleProviderDashboard}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-white/80 bg-white text-slate-800 hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
                disabled={providerStatus.loading}
              >
                {providerStatus.isVerified && <Shield className="w-5 h-5 mr-2" />}
                {getProviderButtonText()}
                {!providerStatus.isVerified && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-10 h-3 bg-primary' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroBannerSlider;
