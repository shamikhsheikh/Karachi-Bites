import React, { useState } from 'react';
import { ShoppingBag, Search, Menu as MenuIcon, X, Compass, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartSubtotal: number;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  onOpenCart: () => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onFocusSearch: () => void;
  onOrderNow: () => void;
}

const BRANCHES = ['Clifton', 'Gulshan-e-Iqbal', 'North Nazimabad'];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartSubtotal,
  selectedBranch,
  onSelectBranch,
  onOpenCart,
  onOpenTrack,
  onOpenAdmin,
  onFocusSearch,
  onOrderNow,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EBECEF] transition-all shadow-2xs">
      {/* Top Delivery & Location Notification Bar */}
      <div className="bg-[#121214] text-[#F3F4F6] text-[11px] py-1.5 px-4 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[#E5A93C]">Kitchen Live</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-white/80">35-45 Min Hot Delivery across Karachi</span>
          </div>
          
          <div className="flex items-center gap-4 text-[#E5A93C]">
            {/* Branch Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBranchDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-white/90 hover:text-[#E5A93C] transition-colors cursor-pointer"
                title="Select Branch"
              >
                <MapPin className="w-3 h-3 text-[#E5A93C]" />
                <span className="font-medium">{selectedBranch}, Karachi</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {branchDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white text-[#121214] border border-[#EBECEF] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <span className="block px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8F98]">
                    Serving Kitchen Branch
                  </span>
                  {BRANCHES.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        onSelectBranch(b);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        selectedBranch === b
                          ? 'bg-[#121214] text-white'
                          : 'hover:bg-[#F4F5F7] text-[#33373E]'
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBranch === b && <span className="text-[#E5A93C] text-[10px]">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenTrack}
              className="hover:underline flex items-center gap-1 font-semibold text-white/90 hover:text-[#E5A93C] cursor-pointer"
            >
              <Compass className="w-3 h-3 text-[#E5A93C]" />
              <span className="hidden xs:inline">Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Emblem */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 sm:gap-3 text-left focus:outline-hidden"
              aria-label="Karachi Bites Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#121214] text-[#E5A93C] flex items-center justify-center font-bold text-sm tracking-wider shadow-sm transition-transform group-hover:scale-105">
                KB
              </div>
              <div>
                <span className="block font-bold text-lg sm:text-xl tracking-tight text-[#121214] uppercase leading-tight group-hover:text-[#E5A93C] transition-colors">
                  Karachi Bites
                </span>
                <span className="block text-[9.5px] sm:text-[10px] tracking-[0.16em] text-[#8A8F98] uppercase font-semibold">
                  Authentic Food Ordering
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#525760]">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-[#121214] transition-colors py-1 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('popular-section')}
              className="hover:text-[#121214] transition-colors py-1 cursor-pointer"
            >
              Popular
            </button>
            <button
              onClick={() => scrollToSection('menu-section')}
              className="hover:text-[#121214] transition-colors py-1 cursor-pointer"
            >
              Full Menu
            </button>
            <button
              onClick={() => scrollToSection('chefs-special')}
              className="hover:text-[#121214] transition-colors py-1 cursor-pointer"
            >
              Chef's Special
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#121214] transition-colors py-1 cursor-pointer"
            >
              Branches
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onFocusSearch}
              aria-label="Search Menu"
              className="p-2.5 text-[#525760] hover:text-[#121214] hover:bg-[#F4F5F7] rounded-full transition-colors cursor-pointer touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 border border-[#EBECEF]"
              title="Search dishes"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Pill Button (Matching Reference Screen 3 theme) */}
            <button
              onClick={onOpenCart}
              aria-label={`View Cart with ${cartCount} items`}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#121214] text-white hover:bg-[#25272B] active:scale-95 transition-all text-xs font-semibold cursor-pointer touch-manipulation min-h-[40px] shadow-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#E5A93C] shrink-0" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#E5A93C] text-[#121214] font-mono font-bold text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartCount > 0 ? `Rs. ${cartSubtotal}` : 'My Cart'}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Mobile Menu"
              className="lg:hidden p-2 text-[#525760] hover:text-[#121214] hover:bg-[#F4F5F7] rounded-full transition-colors cursor-pointer touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EBECEF] px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="p-3 text-left rounded-2xl bg-[#F7F8FA] text-xs font-bold text-[#121214]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('popular-section')}
              className="p-3 text-left rounded-2xl bg-[#F7F8FA] text-xs font-bold text-[#121214]"
            >
              Popular Items
            </button>
            <button
              onClick={() => scrollToSection('menu-section')}
              className="p-3 text-left rounded-2xl bg-[#F7F8FA] text-xs font-bold text-[#121214]"
            >
              Delicious Items
            </button>
            <button
              onClick={() => scrollToSection('chefs-special')}
              className="p-3 text-left rounded-2xl bg-[#F7F8FA] text-xs font-bold text-[#121214]"
            >
              Chef's Special
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="p-3 text-left rounded-2xl bg-[#F7F8FA] text-xs font-bold text-[#121214]"
            >
              Branches
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrack();
              }}
              className="p-3 text-left rounded-2xl bg-[#121214] text-white text-xs font-bold"
            >
              Track Order
            </button>
          </div>

          <div className="pt-2 border-t border-[#EBECEF] flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-[#E5A93C] underline font-semibold cursor-pointer"
            >
              Staff Dispatch Console
            </button>
            <span className="text-[#8A8F98]">Clifton · Gulshan · Nazimabad</span>
          </div>
        </div>
      )}
    </header>
  );
};
