import React from 'react';
import { ArrowRight, Sparkles, Clock, Flame, Award } from 'lucide-react';
import specialMuttonKarahi from '../assets/images/special_mutton_karahi_1791648611986.jpg';

interface ChefsSpecialProps {
  onDiscoverMenu: () => void;
}

export const ChefsSpecial: React.FC<ChefsSpecialProps> = ({ onDiscoverMenu }) => {
  return (
    <section id="chefs-special" className="w-full py-8 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="bg-white border border-[#EBECEF] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* LEFT: Photograph of Shinwari Mutton Karahi in cast iron wok */}
          <div className="lg:col-span-6 relative overflow-hidden min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] bg-[#18181B]">
            <img
              src={specialMuttonKarahi || '/images/special_mutton_karahi_1791648611986.jpg'}
              alt="Artisanal Shinwari Mutton Karahi cooked in traditional cast iron wok with fresh ginger juliennes"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
              width={700}
              height={600}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('/images/special_mutton_karahi_1791648611986.jpg')) {
                  img.src = '/images/special_mutton_karahi_1791648611986.jpg';
                }
              }}
            />
            
            {/* Floating Tag */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-4 py-2.5 bg-[#18181B]/95 border border-white/20 text-white rounded-2xl shadow-lg backdrop-blur-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">Shinwari Mutton Karahi (half)</span>
              <span className="font-mono text-xs text-[#E5A93C] font-bold ml-1">Rs. 1,650</span>
            </div>
          </div>

          {/* RIGHT: Modern Editorial Details */}
          <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#E5A93C] uppercase">
                <Award className="w-4 h-4 text-[#E5A93C]" />
                CHEF'S SIGNATURE SPECIAL
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#121214] tracking-tight leading-tight">
                Crafted in Seasoned Cast Iron Woks
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#525760] leading-relaxed">
              Our signature Mutton Karahi honors generations of authentic Khyber and Karachi tradition. Slow-simmered over live embers, we prepare every order with hand-crushed whole coriander seeds, wild black pepper, fresh mountain tomatoes, and pure desi ghee.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-[#F0F1F3]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7F8FA] border border-[#EBECEF] flex items-center justify-center text-[#E5A93C] shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#121214]">Live Charcoal Simmer</h4>
                  <p className="text-[11px] text-[#717680] mt-0.5">Thick, glistening gravy coating tender cuts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7F8FA] border border-[#EBECEF] flex items-center justify-center text-[#E5A93C] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#121214]">Daily Fresh Spices</h4>
                  <p className="text-[11px] text-[#717680] mt-0.5">Fresh ginger juliennes and roasted cumin.</p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={onDiscoverMenu}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#18181B] text-white hover:bg-[#27272A] rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 min-h-[44px] w-full sm:w-auto active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <span>Order Chef's Special</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
