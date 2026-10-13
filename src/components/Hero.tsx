import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Flame, MapPin, Star, Clock, ShieldCheck } from 'lucide-react';
import heroFeastImage from '../assets/images/hero_pakistani_feast_1791648599401.jpg';

interface HeroProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onExploreMenu }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback silently
      });
    }
  }, []);

  return (
    <section id="hero" className="w-full px-3 sm:px-6 lg:px-8 py-3 md:py-6">
      {/* Clean Modern Rounded Hero Card */}
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#18181B] text-white border border-[#27272A] shadow-xl min-h-[500px] lg:min-h-[540px] flex flex-col justify-center">
        
        {/* Background Video & Fallback Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroFeastImage || '/images/hero_pakistani_feast_1791648599401.jpg'}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setHasVideoError(true)}
            aria-hidden="true"
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded && !hasVideoError ? 'opacity-80 scale-100' : 'opacity-60 scale-100'
            }`}
          >
            <source src="/videos/tandoor_fire.mp4" type="video/mp4" />
            <source src="/7091442-uhd_3840_2160_24fps.mp4" type="video/mp4" />
            <source src="/images/tandoor_fire.mp4" type="video/mp4" />
          </video>

          <img
            src={heroFeastImage || '/images/hero_pakistani_feast_1791648599401.jpg'}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              videoLoaded && !hasVideoError ? 'opacity-0 pointer-events-none' : 'opacity-70'
            }`}
          />
        </div>

        {/* Contrast Scrims */}
        <div className="absolute inset-0 bg-[#121214]/70 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121214]/95 via-[#121214]/75 to-transparent pointer-events-none z-[1]" />

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-14 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Modern Food-Ordering Typography */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-5">
              
              {/* Delivery Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[#E5A93C] text-[11px] font-semibold uppercase tracking-wider shadow-xs">
                <Flame className="w-3.5 h-3.5 text-[#E5A93C] animate-pulse" />
                <span>FRESH LIVE COALS • 35-MIN FAST DELIVERY</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                Authentic Karachi Dining, <span className="text-[#E5A93C]">Delivered Hot</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed max-w-xl font-normal">
                Slow-simmered cast iron karahis, melt-in-mouth chicken malai boti, saffron dum biryani, and handmade paratha rolls — cooked over live coals and dispatched hot to your door.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOrderNow}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#E5A93C] text-[#121214] hover:bg-[#F2BA55] rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md active:scale-[0.98] cursor-pointer min-h-[44px]"
                >
                  <span>ORDER ONLINE</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onExploreMenu}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 min-h-[44px] cursor-pointer active:scale-[0.98]"
                >
                  EXPLORE FULL MENU
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-5 border-t border-white/15 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#A1A1AA]">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#E5A93C] fill-[#E5A93C]" />
                  <span className="font-bold text-white">4.9/5 Rating</span>
                  <span>(1,200+ reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>35-45 mins average delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>100% Halal certified</span>
                </div>
              </div>

            </div>

            {/* Right Column: Featured Photography Card */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#27272A]/90 backdrop-blur-md group">
                  <img
                    src={heroFeastImage || '/images/hero_pakistani_feast_1791648599401.jpg'}
                    alt="Karachi Bites Authentic Platter"
                    className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider block">
                        CHEF RECOMMENDED
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Karachi Mixed BBQ & Karahi
                      </h4>
                    </div>
                    <button
                      onClick={onOrderNow}
                      className="px-3.5 py-1.5 rounded-full bg-[#E5A93C] text-[#121214] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F2BA55] transition-colors cursor-pointer"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
