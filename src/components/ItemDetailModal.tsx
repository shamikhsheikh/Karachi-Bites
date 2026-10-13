import React, { useState } from 'react';
import { ArrowLeft, Heart, Plus, Minus, Star, Clock, Check, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types.ts';
import { resolveItemImage, getFoodPlaceholderSvg } from '../assets/images/index.ts';

interface ItemDetailModalProps {
  item: MenuItem;
  isOpen?: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity?: number, specialNotes?: string) => void;
}

// Extra ingredients / sides matching Reference Screen 2 "Add extra ingredients"
interface ExtraIngredient {
  id: string;
  name: string;
  portion: string;
  price: number;
}

const EXTRA_INGREDIENTS: ExtraIngredient[] = [
  { id: 'raita', name: 'Fresh Mint & Zeera Raita', portion: '1 bowl', price: 80 },
  { id: 'naan', name: 'Hot Tandoori Garlic Naan', portion: '1 pc', price: 90 },
  { id: 'salad', name: 'Kachumber Salad & Fresh Lemon', portion: '1 plate', price: 50 },
  { id: 'ghee', name: 'Pure Desi Ghee Drizzle', portion: '1 serving', price: 100 },
];

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen = true,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen || !item) return null;

  const extrasTotal = Object.entries(selectedExtras).reduce((acc, [extraId, count]) => {
    const extra = EXTRA_INGREDIENTS.find((e) => e.id === extraId);
    return acc + (extra ? extra.price * count : 0);
  }, 0);

  const totalPrice = (item.price + extrasTotal) * quantity;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) => {
      const current = prev[extraId] || 0;
      if (current > 0) {
        const copy = { ...prev };
        delete copy[extraId];
        return copy;
      }
      return { ...prev, [extraId]: 1 };
    });
  };

  const handleAdd = () => {
    const extrasSummary = Object.entries(selectedExtras)
      .map(([id, count]) => {
        const extra = EXTRA_INGREDIENTS.find((e) => e.id === id);
        return extra ? `${count}x ${extra.name}` : null;
      })
      .filter(Boolean)
      .join(', ');

    const combinedNotes = [
      extrasSummary ? `Extras: ${extrasSummary}` : '',
      specialInstructions.trim() ? `Notes: ${specialInstructions.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    onAddToCart(item, quantity, combinedNotes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Card (Designed to match Reference Screen 2 Product Detail layout) */}
      <div className="relative bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl max-w-md w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-[#EBECEF] max-h-[92vh] flex flex-col justify-between">
        
        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Header Bar with Back Arrow and Heart Favorite (Matching Reference Screen 2) */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-[#F7F8FA] hover:bg-[#EBECEF] text-[#121214] flex items-center justify-center transition-colors cursor-pointer border border-[#EBECEF] shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsFav((prev) => !prev)}
              aria-label="Add to favorites"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-[#EBECEF] shadow-2xs ${
                isFav
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-[#F7F8FA] hover:bg-[#EBECEF] text-[#717680]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Dish Title & Sub-row (Matching Reference Screen 2) */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#121214] leading-tight tracking-tight">
              {item.name}
            </h2>

            <div className="flex items-center gap-4 text-xs">
              <span className="font-semibold text-[#525760] flex items-center gap-1.5">
                <span className="text-sm">🔥</span>
                <span>{item.category} Authentic</span>
              </span>

              <span className="flex items-center gap-1 font-bold text-[#121214]">
                <Star className="w-3.5 h-3.5 text-[#E5A93C] fill-[#E5A93C]" />
                <span>4.9</span>
                <span className="font-normal text-[#8A8F98]">(1.4k reviews)</span>
              </span>
            </div>
          </div>

          {/* Prominent Rounded Food Photograph (Matching Reference Screen 2) */}
          <div className="relative aspect-[16/11] w-full rounded-3xl overflow-hidden bg-[#F7F8FA] shadow-md border border-[#EBECEF]">
            <img
              src={resolveItemImage(item.image, item.id)}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getFoodPlaceholderSvg(item.name, item.category);
              }}
            />
          </div>

          {/* Details Section (Matching Reference Screen 2) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#121214]">
                Details
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#717680]">
                <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>25-35 min</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#525760] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* "Add extra ingredients" Section (Matching Reference Screen 2) */}
          <div className="space-y-3 pt-2 border-t border-[#F0F1F3]">
            <h3 className="font-bold text-base text-[#121214]">
              Add extra ingredients
            </h3>

            <div className="space-y-2">
              {EXTRA_INGREDIENTS.map((extra) => {
                const isSelected = !!selectedExtras[extra.id];

                return (
                  <div
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F7F8FA] border-[#18181B] shadow-2xs'
                        : 'bg-white border-[#EBECEF] hover:bg-[#FAFBFD]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EBECEF] flex items-center justify-center text-sm font-bold text-[#525760] shrink-0">
                        +
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#121214]">
                          {extra.name}
                        </h4>
                        <span className="text-[11px] text-[#717680]">
                          {extra.portion} • +Rs. {extra.price}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox Icon */}
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-[#18181B] border-[#18181B] text-white'
                          : 'border-[#D1D5DB] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Special Instructions */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-[#717680] uppercase tracking-wider block">
              Special Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Mild spice, extra crispy, separate raita"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs text-[#121214] placeholder:text-[#8A8F98] outline-hidden focus:ring-1 focus:ring-[#18181B]"
            />
          </div>

        </div>

        {/* Bottom Fixed Action Bar (Matching Reference Screen 2) */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EBECEF] flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#F7F8FA] border border-[#EBECEF] shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 disabled:opacity-30 text-[#121214] flex items-center justify-center transition-all cursor-pointer shadow-2xs border border-[#EBECEF]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="font-mono font-bold text-sm min-w-[20px] text-center text-[#121214]">
              {quantity}
            </span>

            <button
              type="button"
              disabled={quantity >= 10}
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 disabled:opacity-30 text-[#121214] flex items-center justify-center transition-all cursor-pointer shadow-2xs border border-[#EBECEF]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Solid Black Wide Action Pill (Matching Reference Screen 2) */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={addedAnimation}
            className="flex-1 py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <span>Add to Cart • Rs. {totalPrice}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
