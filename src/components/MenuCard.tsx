import React, { useState, useEffect } from 'react';
import { Plus, Minus, Flame, Leaf, Star, Heart, Check, X } from 'lucide-react';
import { MenuItem } from '../types.ts';
import { resolveItemImage, getFoodPlaceholderSvg } from '../assets/images/index.ts';

interface MenuCardProps {
  item: MenuItem;
  inCartQty: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQty?: (itemId: number, delta: number) => void;
  onRemoveItem?: (itemId: number) => void;
  onOpenDetails?: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  inCartQty,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onOpenDetails,
}) => {
  const isSpicy = item.tags.includes('spicy');
  const isVeg = item.tags.includes('veg');
  const [imgSrc, setImgSrc] = useState(() => resolveItemImage(item.image, item.id));
  const [isFav, setIsFav] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setImgSrc(resolveItemImage(item.image, item.id));
  }, [item.image, item.id]);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onOpenDetails) {
      onOpenDetails(item);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-[26px] bg-white border border-[#EBECEF] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Food Photography Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F8FA]">
        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={400}
          height={300}
          onError={() => {
            setImgSrc(getFoodPlaceholderSvg(item.name, item.category));
          }}
        />

        {/* Top Badges & Favorite Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Rating Badge (Matching Reference Screen 1) */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#121214] shadow-sm backdrop-blur-xs">
            <Star className="w-3 h-3 text-[#E5A93C] fill-[#E5A93C]" />
            <span>4.9</span>
          </div>

          {/* Right Action: Favorite Heart Button */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {isSpicy && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#18181B]/90 text-[#E5A93C] shadow-xs backdrop-blur-xs">
                <Flame className="w-3 h-3 text-[#E5A93C]" />
                <span>Spicy</span>
              </span>
            )}
            {isVeg && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 shadow-xs backdrop-blur-xs">
                <Leaf className="w-3 h-3 text-emerald-400" />
                <span>Veg</span>
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFav((prev) => !prev);
              }}
              aria-label="Add to favorites"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isFav
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/90 text-[#717680] hover:text-[#121214] hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Unavailable Overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-[#121214]/80 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest font-bold text-white px-3 py-1.5 border border-white/20 rounded-full bg-black/40">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        
        <div className="space-y-1">
          {/* Category kicker */}
          <span className="text-[10px] font-bold tracking-wider text-[#8A8F98] uppercase block">
            {item.category}
          </span>

          {/* Dish Name */}
          <h3 className="font-bold text-base sm:text-lg text-[#121214] group-hover:text-[#E5A93C] transition-colors leading-snug line-clamp-1">
            {item.name}
          </h3>

          {/* Culinary Description */}
          <p className="text-xs text-[#525760] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price & Add to Cart Action Row (Matching Reference Screen 1) */}
        <div className="pt-3 border-t border-[#F0F1F3] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8A8F98] block">
              Price
            </span>
            <span className="font-bold text-lg sm:text-xl text-[#121214] font-mono leading-tight">
              Rs. {item.price}
            </span>
          </div>

          {!item.available ? (
            <button
              disabled
              className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-semibold opacity-40 cursor-not-allowed bg-neutral-200 text-neutral-500"
            >
              Unavailable
            </button>
          ) : inCartQty > 0 ? (
            /* Tactile In-Card Stepper: [ − ] [ inCartQty ] [ + ] [ × ] */
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1 rounded-full border border-[#EBECEF] shadow-2xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpdateQty) onUpdateQty(item.id, -1);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-[#121214] transition-colors cursor-pointer touch-manipulation shadow-2xs border border-[#EBECEF]"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <div className="px-2 font-mono font-bold text-xs text-[#121214] min-w-[20px] text-center select-none">
                <span>{inCartQty}</span>
              </div>

              <button
                type="button"
                disabled={inCartQty >= 10}
                onClick={(e) => {
                  e.stopPropagation();
                  if (inCartQty < 10 && onUpdateQty) onUpdateQty(item.id, 1);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all touch-manipulation shadow-2xs ${
                  inCartQty >= 10
                    ? 'opacity-30 cursor-not-allowed bg-neutral-200 text-neutral-400'
                    : 'bg-[#18181B] hover:bg-[#27272A] active:scale-95 text-white cursor-pointer'
                }`}
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemoveItem) onRemoveItem(item.id);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-rose-200/60 shadow-2xs"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* Clean Modern Add to Cart Button */
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-xs cursor-pointer touch-manipulation bg-[#18181B] text-white hover:bg-[#27272A]"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
