import React from 'react';
import { Compass, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTrack, onOpenAdmin }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#121214] text-[#E4E4E7] border-t border-[#27272A] pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#27272A] text-[#E5A93C] flex items-center justify-center font-bold text-xs">
                KB
              </div>
              <div>
                <span className="block font-bold text-lg text-white uppercase tracking-tight">
                  Karachi Bites
                </span>
                <span className="block text-[10px] tracking-wider text-[#A1A1AA] uppercase font-semibold">
                  Authentic Pakistani Flavours
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
              Crafting authentic Pakistani dining experiences from charcoal-fired boti and hand-crafted seekh kebabs to slow-simmered cast iron karahi and royal saffron biryani.
            </p>

            <div className="space-y-1.5 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>12:00 PM – 1:00 AM Daily Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Clifton · Gulshan-e-Iqbal · North Nazimabad</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
              Quick Links
            </h4>
            <ul className="space-y-1 text-xs text-[#A1A1AA]">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-white transition-colors py-1 cursor-pointer block text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('popular-section')}
                  className="hover:text-white transition-colors py-1 cursor-pointer block text-left"
                >
                  Popular Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('menu-section')}
                  className="hover:text-white transition-colors py-1 cursor-pointer block text-left"
                >
                  Menu & Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('chefs-special')}
                  className="hover:text-white transition-colors py-1 cursor-pointer block text-left"
                >
                  Chef's Special (Karahi)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-white transition-colors py-1 cursor-pointer block text-left"
                >
                  Our Branches
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Operations */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
              Order Assistance
            </h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Need assistance with a live order or have a catering inquiry? Contact your nearest branch kitchen dispatch.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={onOpenTrack}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold transition-all cursor-pointer w-fit"
              >
                <Compass className="w-4 h-4 text-[#E5A93C]" />
                <span>Track Live Order</span>
              </button>
              
              <button
                onClick={onOpenAdmin}
                className="text-left text-xs text-[#717680] hover:text-[#E5A93C] transition-colors cursor-pointer pt-2"
              >
                Staff Dispatch Console →
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#717680] gap-4">
          <p>© {new Date().getFullYear()} Karachi Bites. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Halal Food</span>
            <span>•</span>
            <span>Safe Contactless Delivery</span>
            <span>•</span>
            <span>Karachi, Pakistan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
