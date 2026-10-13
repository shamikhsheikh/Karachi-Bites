import React, { useState } from 'react';
import { ArrowLeft, X, Plus, Minus, Trash2, ShoppingBag, AlertCircle, PlusCircle } from 'lucide-react';
import { CartItem } from '../types.ts';
import { resolveItemImage, getFoodPlaceholderSvg } from '../assets/images/index.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onProceedToCheckout: () => void;
  deliveryFee: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  deliveryFee,
}) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDecrement = (itemId: number, _currentQty: number) => {
    setWarningMessage(null);
    onUpdateQty(itemId, -1);
  };

  const handleIncrement = (itemId: number, currentQty: number) => {
    if (currentQty >= 10) {
      setWarningMessage('Maximum limit of 10 items per dish.');
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }
    setWarningMessage(null);
    onUpdateQty(itemId, 1);
  };

  const handleRemove = (itemId: number) => {
    setWarningMessage(null);
    onRemoveItem(itemId);
  };

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.menuItem.price * curr.qty,
    0
  );
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;
  const totalCount = cartItems.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EBECEF] shadow-2xl flex flex-col justify-between">
          
          {/* Header (Matching Reference Screen 3 "My Cart") */}
          <div className="p-5 sm:p-6 border-b border-[#EBECEF] flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#F7F8FA] hover:bg-[#EBECEF] text-[#121214] flex items-center justify-center transition-all cursor-pointer border border-[#EBECEF] shadow-2xs"
              aria-label="Back to Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#121214] tracking-tight">
              My Cart
            </h3>

            <div className="w-10 h-10 rounded-full bg-[#F7F8FA] text-[#525760] font-mono font-bold text-xs flex items-center justify-center border border-[#EBECEF]">
              {totalCount}
            </div>
          </div>

          {/* Warning Banner */}
          {warningMessage && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2 px-6 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-medium">{warningMessage}</span>
            </div>
          )}

          {/* Cart Items List (Matching Reference Screen 3 Layout) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F8FA] border border-[#EBECEF] mx-auto flex items-center justify-center text-[#8A8F98] shadow-xs">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-[#121214]">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-[#717680] max-w-xs mx-auto">
                    Explore our BBQ skewers, cast-iron karahis, and authentic biryani to begin.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#18181B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#27272A] transition-colors cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cartItems.map(({ menuItem, qty }) => (
                  <div
                    key={menuItem.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EBECEF] hover:border-[#D1D5DB] transition-all"
                  >
                    {/* Rounded Square Food Image (Matching Screen 3) */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shrink-0 border border-[#EBECEF] shadow-2xs">
                      <img
                        src={resolveItemImage(menuItem.image, menuItem.id)}
                        alt={menuItem.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getFoodPlaceholderSvg(menuItem.name, menuItem.category);
                        }}
                      />
                    </div>

                    {/* Item Name, Unit Price & Stepper */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-[#121214] truncate">
                        {menuItem.name}
                      </h4>
                      <div className="font-mono text-xs font-semibold text-[#525760]">
                        Rs. {menuItem.price}
                      </div>

                      {/* Tactile In-Cart Stepper (Matching Screen 3) */}
                      <div className="inline-flex items-center gap-2 p-1 rounded-full bg-white border border-[#EBECEF] shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleDecrement(menuItem.id, qty)}
                          className="w-6 h-6 rounded-full bg-[#F7F8FA] hover:bg-[#EBECEF] flex items-center justify-center text-[#121214] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="font-mono font-bold text-xs text-[#121214] min-w-[16px] text-center">
                          {qty}
                        </span>

                        <button
                          type="button"
                          disabled={qty >= 10}
                          onClick={() => handleIncrement(menuItem.id, qty)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            qty >= 10
                              ? 'opacity-30 cursor-not-allowed bg-neutral-200 text-neutral-400'
                              : 'bg-[#18181B] text-white hover:bg-[#27272A] cursor-pointer'
                          }`}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Cross Button (Matching Screen 3) */}
                    <button
                      type="button"
                      onClick={() => handleRemove(menuItem.id)}
                      className="p-1.5 rounded-full text-[#8A8F98] hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label={`Remove ${menuItem.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* "+ Add more items" Action Link (Matching Screen 3) */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-2xl border border-dashed border-[#D1D5DB] hover:border-[#18181B] text-xs font-semibold text-[#525760] hover:text-[#121214] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#E5A93C]" />
                  <span>+ Add more items</span>
                </button>
              </div>
            )}
          </div>

          {/* Order Summary & Checkout Footer (Matching Reference Screen 3) */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#EBECEF] bg-white space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#525760]">
                  <span>Sub total</span>
                  <span className="font-mono font-semibold text-[#121214]">
                    Rs. {subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-[#525760]">
                  <span>Taxes & Fees</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    Included
                  </span>
                </div>

                <div className="flex justify-between text-[#525760]">
                  <span>Delivery Fee</span>
                  <span className="font-mono font-semibold text-[#121214]">
                    Rs. {deliveryFee}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EBECEF] flex justify-between text-base font-bold text-[#121214]">
                  <span>Total</span>
                  <span className="font-mono text-lg text-[#121214]">
                    Rs. {total}
                  </span>
                </div>
              </div>

              {/* Solid Wide Black Checkout Button (Matching Reference Screen 3) */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-4 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Checkout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
