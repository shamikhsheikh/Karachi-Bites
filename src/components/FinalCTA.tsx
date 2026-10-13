import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface FinalCTAProps {
  onOrderNow: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOrderNow }) => {
  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 py-8 md:py-16 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#18181B] text-white border border-[#27272A] shadow-xl px-6 sm:px-12 py-12 sm:py-16 text-center">
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-[#E5A93C] text-[11px] font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>FINE PAKISTANI DINING DELIVERED FRESH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Ready to Taste Karachi?
          </h2>

          <p className="text-xs sm:text-base text-[#D4D4D8] leading-relaxed">
            Order your favourite charcoal BBQ, authentic hand-ground biryani, and rich shinwari karahi in minutes.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={onOrderNow}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E5A93C] text-[#121214] hover:bg-[#F2BA55] rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg active:scale-[0.98] w-full sm:w-auto min-h-[46px] cursor-pointer"
            >
              <span>ORDER ONLINE NOW</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
            </button>
          </div>

          <p className="text-xs text-[#A1A1AA] pt-1">
            Delivering across Clifton · Gulshan-e-Iqbal · North Nazimabad · Flat Rs. 150 Delivery
          </p>
        </div>

      </div>
    </section>
  );
};
