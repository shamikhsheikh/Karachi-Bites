import React from 'react';
import { Plus, Minus, Trash2, Sparkles, X } from 'lucide-react';
import { MenuItem } from '../types.ts';
import dessertGulabJamunKheer from '../assets/images/dessert_gulab_jamun_kheer_1791648636566.jpg';

interface DessertSectionProps {
  dessertItems: MenuItem[];
  cartItemCounts: Record<number, number>;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQty?: (itemId: number, delta: number) => void;
  onRemoveItem?: (itemId: number) => void;
}

export const DessertSection: React.FC<DessertSectionProps> = ({
  dessertItems,
  cartItemCounts,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
}) => {
  return (
    <section id="sweet-finish" className="w-full px-3 sm:px-6 lg:px-8 py-8 md:py-16 scroll-mt-20 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#18181B] text-white border border-[#27272A] shadow-xl p-6 sm:p-10 lg:p-14">
        
        {/* Section Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold tracking-wider text-[#E5A93C] uppercase block">
            ROYAL CONFECTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            A Sweet Finish
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            Slow-cooked traditional desserts to complete your Karachi feast with pure sweetness.
          </p>
        </div>

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Atmospheric Photography Showcase */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#27272A] group">
              <img
                src={dessertGulabJamunKheer || '/images/dessert_gulab_jamun_kheer_1791648636566.jpg'}
                alt="Gulab Jamun and Kheer"
                className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
                width={700}
                height={525}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.includes('/images/dessert_gulab_jamun_kheer_1791648636566.jpg')) {
                    img.src = '/images/dessert_gulab_jamun_kheer_1791648636566.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                  <span className="text-xs sm:text-sm font-semibold">Warm Gulab Jamun & Royal Saffron Kheer</span>
                </div>
                <span className="text-[11px] text-[#E5A93C] uppercase font-mono">
                  Pure Khoya & Cardamom
                </span>
              </div>
            </div>
          </div>

          {/* Right: Curated Dessert Cards */}
          <div className="lg:col-span-5 space-y-4">
            {dessertItems.map((item) => {
              const inCartQty = cartItemCounts[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#27272A]/80 border border-white/10 p-5 transition-all duration-300 hover:border-[#E5A93C]/50 shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold tracking-wider text-[#E5A93C] uppercase block">
                        TRADITIONAL DESSERT
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-[#717680] block font-semibold">Price</span>
                      <span className="text-lg font-bold text-white font-mono">
                        Rs. {item.price}
                      </span>
                    </div>

                    {!item.available ? (
                      <button
                        disabled
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold opacity-40 cursor-not-allowed bg-neutral-700 text-neutral-400"
                      >
                        Sold Out
                      </button>
                    ) : inCartQty > 0 ? (
                      /* Tactile In-Card Stepper: [ − ] [ inCartQty ] [ + ] [ × ] */
                      <div className="flex items-center gap-1.5 bg-[#27272A] p-1 rounded-full border border-white/15 shadow-sm">
                        <button
                          type="button"
                          onClick={() => (onUpdateQty ? onUpdateQty(item.id, -1) : onAddToCart(item))}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#18181B] hover:bg-[#323238] flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <div className="px-2 font-mono font-bold text-xs text-[#E5A93C] min-w-[20px] text-center select-none">
                          <span>{inCartQty}</span>
                        </div>
                        <button
                          type="button"
                          disabled={inCartQty >= 10}
                          onClick={() => {
                            if (inCartQty < 10 && onUpdateQty) onUpdateQty(item.id, 1);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all border ${
                            inCartQty >= 10
                              ? 'opacity-30 cursor-not-allowed bg-[#18181B] text-neutral-500 border-transparent'
                              : 'bg-[#18181B] hover:bg-[#323238] text-white cursor-pointer border-white/10'
                          }`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        {onRemoveItem && (
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 flex items-center justify-center transition-colors cursor-pointer border border-rose-500/30"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-full bg-white text-[#18181B] hover:bg-[#F4F5F7] font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
