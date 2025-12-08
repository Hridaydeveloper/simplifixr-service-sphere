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
      <section className="relative w-full h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden bg-gradient-to-br from-background to-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full lg:w-2/3 xl:w-1/2 space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-5 py-2.5 glass-effect rounded-full glow-border">
              <span className="w-2.5 h-2.5 bg-primary rounded-full mr-3 animate-pulse" />
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">
                Services at Your Fingertips
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Welcome to <span className="text-gradient">Simplifixr</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Your trusted platform for professional home services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleBookService} 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              >
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleProviderDashboard}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2"
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
    <section className="relative w-full h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden">
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
            
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full lg:w-2/3 xl:w-1/2">
          {/* Animated Content */}
          <div 
            key={currentSlide}
            className="space-y-8 animate-fade-in"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center px-5 py-2.5 glass-effect rounded-full glow-border">
              <span className="w-2.5 h-2.5 bg-primary rounded-full mr-3 animate-pulse" />
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">
                Services at Your Fingertips
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-display-lg font-extrabold text-foreground leading-tight">
              {slides[currentSlide]?.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">
                {slides[currentSlide]?.title.split(' ').slice(-1)}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {slides[currentSlide]?.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleBookService} 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={handleProviderDashboard}
                size="lg"
                variant="outline"
                className={`px-8 py-6 text-lg font-semibold rounded-xl border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                  providerStatus.isVerified 
                    ? "bg-primary/10 border-primary text-primary hover:bg-primary/20" 
                    : "border-border hover:border-primary hover:bg-primary/5 text-foreground"
                }`}
                disabled={providerStatus.loading}
              >
                {providerStatus.isVerified && <Shield className="w-5 h-5 mr-2" />}
                {getProviderButtonText()}
                {!providerStatus.isVerified && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex items-center glass-effect px-5 py-3 rounded-full">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-4 shadow-lg shadow-primary/20">
                  <span className="text-primary-foreground font-bold text-sm">4.5</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Service Rating</div>
                  <div className="text-xs text-muted-foreground">Based on reviews</div>
                </div>
              </div>
              
              <div className="flex items-center glass-effect px-5 py-3 rounded-full">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-4 shadow-lg shadow-primary/20">
                  <span className="text-primary-foreground font-bold text-xs">12M+</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Happy Customers</div>
                  <div className="text-xs text-muted-foreground">Worldwide</div>
                </div>
              </div>
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
                : 'w-3 h-3 bg-foreground/30 hover:bg-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-effect rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-card/80 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-effect rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-card/80 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroBannerSlider;
