import React from 'react';
import { MapPin, Clock, Phone, ShieldCheck, Flame, UtensilsCrossed } from 'lucide-react';
import chickenBiryani from '../assets/images/dish_chicken_biryani_1791648623964.jpg';

export const AboutSection: React.FC = () => {
  const branches = [
    {
      name: 'Clifton Branch',
      location: 'Block 4, Near Boat Basin, Clifton, Karachi',
      phone: '021-35870001',
      timings: '12:00 PM – 1:00 AM Daily',
      zone: 'South Karachi',
    },
    {
      name: 'Gulshan-e-Iqbal Branch',
      location: 'Block 6, University Road, Gulshan-e-Iqbal, Karachi',
      phone: '021-34980002',
      timings: '12:00 PM – 1:00 AM Daily',
      zone: 'East Karachi',
    },
    {
      name: 'North Nazimabad Branch',
      location: 'Block D, Near Hydri Market, North Nazimabad, Karachi',
      phone: '021-36640003',
      timings: '12:00 PM – 1:00 AM Daily',
      zone: 'Central Karachi',
    },
  ];

  return (
    <section id="about" className="w-full py-8 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Heritage Narrative & Image Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold tracking-wider text-[#E5A93C] uppercase block">
            OUR STORY & HERITAGE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#121214] tracking-tight">
            Rooted in Karachi's Great Culinary Heritage
          </h2>
          <p className="text-xs sm:text-sm text-[#525760] leading-relaxed">
            Karachi is famous across the subcontinent for its lively food streets, sizzling open-air coals, and deep culinary devotion. Karachi Bites was founded to bring that dining heritage straight to your home with clean, premium preparation.
          </p>
          <p className="text-xs sm:text-sm text-[#525760] leading-relaxed">
            From our velvety Chicken Malai Boti basted over slow embers to fragrant saffron Dum Biryani and sizzling Shinwari woks, each recipe stays true to our authentic roots.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5 text-xs font-semibold text-[#121214]">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs">
              <Flame className="w-4 h-4 text-[#E5A93C]" />
              <span>Smoky Babul Charcoal Grilling</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs">
              <UtensilsCrossed className="w-4 h-4 text-[#E5A93C]" />
              <span>Aged Long-Grain Basmati Rice</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#EBECEF] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
              <span>100% Halal Certified</span>
            </div>
          </div>
        </div>

        {/* Highlight Image Showcase */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#EBECEF] bg-[#18181B] group">
            <img
              src={chickenBiryani || '/images/dish_chicken_biryani_1791648623964.jpg'}
              alt="Artisanal Karachi Dum Biryani"
              className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={700}
              height={525}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('/images/dish_chicken_biryani_1791648623964.jpg')) {
                  img.src = '/images/dish_chicken_biryani_1791648623964.jpg';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-white flex items-center justify-between">
              <span className="font-bold text-sm text-[#E5A93C]">Karachi Dum Biryani</span>
              <span className="text-[11px] font-mono text-white/90">Pure Saffron & Fried Golden Onions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Authentic Karachi Branches */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-bold tracking-wider text-[#E5A93C] uppercase block">
            CONVENIENT LOCATIONS
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#121214]">
            Our Karachi Branches
          </h3>
          <p className="text-xs text-[#717680]">
            Fast delivery across Clifton, Gulshan-e-Iqbal, and North Nazimabad within 35-45 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branches.map((b) => (
            <div
              key={b.name}
              className="rounded-3xl bg-white border border-[#EBECEF] p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#18181B] hover:shadow-md transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#8A8F98] tracking-wider uppercase">
                    {b.zone}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                
                <h4 className="text-lg font-bold text-[#121214]">
                  {b.name}
                </h4>

                <div className="mt-3 space-y-2 text-xs text-[#525760]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E5A93C] shrink-0" />
                    <span>{b.timings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
                    <a
                      href={`tel:${b.phone}`}
                      className="font-mono text-[#121214] font-semibold hover:text-[#E5A93C] transition-colors"
                    >
                      {b.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F1F3] flex items-center justify-between text-[11px]">
                <span className="text-[#525760] font-medium">Flat Rs. 150 Delivery</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  Open for Orders
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
