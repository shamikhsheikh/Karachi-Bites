import React, { useState } from 'react';
import { Star, Heart, Plus, Minus, X } from 'lucide-react';
import { MenuItem } from '../types.ts';
import { resolveItemImage, getFoodPlaceholderSvg } from '../assets/images/index.ts';

interface PopularItemsProps {
  popularItems: MenuItem[];
  cartItemCounts: Record<number, number>;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onOpenDetails: (item: MenuItem) => void;
}

export const PopularItems: React.FC<PopularItemsProps> = ({
  popularItems,
  cartItemCounts,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onOpenDetails,
}) => {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!popularItems.length) return null;

  return (
    <section id="popular-section" className="w-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#121214] tracking-tight flex items-center gap-2">
            <span>Popular items</span>
            <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
          </h2>
          <p className="text-xs text-[#717680] mt-0.5">
            Most ordered dishes from our live coal tandoor & wok kitchen
          </p>
        </div>
      </div>

      {/* Featured Cards Grid (Matching Reference Screen 1 Popular Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {popularItems.map((item) => {
          const isFav = !!favorites[item.id];
          const inCartQty = cartItemCounts[item.id] || 0;

          return (
            <div
              key={item.id}
              onClick={() => onOpenDetails(item)}
              className="relative overflow-hidden rounded-[30px] bg-[#18181B] text-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-[#27272A] flex flex-col justify-between min-h-[220px]"
            >
              {/* Card Content Row */}
              <div className="grid grid-cols-12 gap-3 items-center">
                
                {/* Left: Info & Details */}
                <div className="col-span-7 flex flex-col justify-between space-y-3 z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C]">
                      {item.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight group-hover:text-[#E5A93C] transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-xl sm:text-2xl text-white font-mono">
                      Rs. {item.price}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                      <Star className="w-3.5 h-3.5 text-[#E5A93C] fill-[#E5A93C]" />
                      <span className="font-bold text-white">4.9</span>
                      <span>(1.8k+)</span>
                    </div>
                  </div>

                  {/* Buttons Row (State 1: Add to Cart | State 2: [ − ] [ qty ] [ + ] [ × ]) */}
                  <div className="flex items-center gap-2 pt-1">
                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-[#27272A] p-1 rounded-full border border-white/15 shadow-sm">
                        {/* Minus Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateQty(item.id, -1);
                          }}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#18181B] hover:bg-[#323238] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        {/* Current Quantity */}
                        <div className="px-2 font-mono font-bold text-xs sm:text-sm text-[#E5A93C] min-w-[20px] text-center select-none">
                          {inCartQty}
                        </div>

                        {/* Plus Button (disabled at max 10) */}
                        <button
                          type="button"
                          disabled={inCartQty >= 10}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (inCartQty < 10) onUpdateQty(item.id, 1);
                          }}
                          aria-label={`Increase quantity of ${item.name}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all border ${
                            inCartQty >= 10
                              ? 'opacity-30 cursor-not-allowed bg-[#18181B] text-neutral-500 border-transparent'
                              : 'bg-[#18181B] hover:bg-[#323238] active:scale-95 text-white cursor-pointer border-white/10'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        {/* Remove (X) Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveItem(item.id);
                          }}
                          aria-label={`Remove ${item.name} from cart`}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-rose-500/30"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item);
                        }}
                        className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm bg-white text-[#18181B] hover:bg-[#F4F5F7]"
                      >
                        <span>Add to Cart</span>
                      </button>
                    )}

                    {/* Heart Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, item.id)}
                      aria-label="Add to favorites"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                        isFav
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Right: Circular / Rounded Prominent Food Photography */}
                <div className="col-span-5 relative flex justify-end">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#2E2E33] shadow-lg group-hover:scale-105 transition-transform duration-500 bg-[#27272A] shrink-0">
                    <img
                      src={resolveItemImage(item.image, item.id)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getFoodPlaceholderSvg(item.name, item.category);
                      }}
                    />
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
