import React from 'react';
import { Home, Utensils, Search, Compass, ShoppingBag, ShieldCheck } from 'lucide-react';

interface BottomNavBarProps {
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenTrack: () => void;
  onFocusSearch: () => void;
  onGoToMenu: () => void;
  onGoToHome: () => void;
  onOpenAdmin: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenTrack,
  onFocusSearch,
  onGoToMenu,
  onGoToHome,
  onOpenAdmin,
}) => {
  return (
    <>
      {/* Floating Order Cart Bar on Mobile when items exist */}
      {cartCount > 0 && (
        <div className="fixed bottom-[74px] left-3 right-3 z-40 sm:hidden pb-[env(safe-area-inset-bottom,0px)]">
          <button
            onClick={onOpenCart}
            className="w-full py-3 px-4 rounded-2xl bg-[#18181B] text-white border border-[#27272A] shadow-2xl flex items-center justify-between font-bold text-xs active:scale-[0.98] transition-transform cursor-pointer touch-manipulation min-h-[46px]"
            aria-label={`View Cart with ${cartCount} items`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#E5A93C] text-[#121214] flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                {cartCount}
              </div>
              <span className="font-semibold text-sm tracking-wide text-white">
                View My Cart
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#E5A93C]">
                Rs. {cartSubtotal}
              </span>
              <ShoppingBag className="w-4 h-4 text-[#E5A93C] shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* Modern Mobile App Bottom Dock with Elevated Center Cart Button (Matching Reference Screen 1) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#EBECEF] px-4 py-2 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] flex items-center justify-between shadow-lg"
      >
        <button
          onClick={onGoToHome}
          className="flex flex-col items-center justify-center gap-1 text-[#717680] hover:text-[#121214] active:text-[#E5A93C] py-1 px-2 transition-colors cursor-pointer min-w-[48px]"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={onGoToMenu}
          className="flex flex-col items-center justify-center gap-1 text-[#717680] hover:text-[#121214] active:text-[#E5A93C] py-1 px-2 transition-colors cursor-pointer min-w-[48px]"
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Menu</span>
        </button>

        {/* Elevated Floating Center Cart Button (Matching Reference Screen 1) */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={onOpenCart}
            aria-label={`Open Cart (${cartCount})`}
            className="w-13 h-13 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer border-3 border-white ring-2 ring-[#E5A93C]/40"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4.5 h-4.5 rounded-full bg-[#E5A93C] text-[#121214] font-mono font-bold text-[10px] flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={onOpenTrack}
          className="flex flex-col items-center justify-center gap-1 text-[#717680] hover:text-[#121214] active:text-[#E5A93C] py-1 px-2 transition-colors cursor-pointer min-w-[48px]"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Track</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center justify-center gap-1 text-[#717680] hover:text-[#121214] active:text-[#E5A93C] py-1 px-2 transition-colors cursor-pointer min-w-[48px]"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Admin</span>
        </button>
      </nav>
    </>
  );
};
