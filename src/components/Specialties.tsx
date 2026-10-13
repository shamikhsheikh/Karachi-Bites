import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Flame, Leaf, SlidersHorizontal, X, Utensils, Sparkles, Coffee, Cake, LayoutGrid, MapPin } from 'lucide-react';
import { MenuItem } from '../types.ts';
import { MenuCard } from './MenuCard.tsx';

interface SpecialtiesProps {
  menuItems: MenuItem[];
  cartItemCounts: Record<number, number>;
  selectedBranch: string;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQty?: (itemId: number, delta: number) => void;
  onRemoveItem?: (itemId: number) => void;
  onOpenDetails?: (item: MenuItem) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

// Category icons matching the reference app's circular icon badges
const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: LayoutGrid },
  { id: 'BBQ', label: 'BBQ Coals', icon: Flame },
  { id: 'KARAHI', label: 'Karahis', icon: Utensils },
  { id: 'RICE', label: 'Dum Biryani', icon: Sparkles },
  { id: 'ROLLS', label: 'Rolls', icon: Utensils },
  { id: 'DRINKS', label: 'Drinks', icon: Coffee },
  { id: 'DESSERTS', label: 'Desserts', icon: Cake },
] as const;

export const Specialties: React.FC<SpecialtiesProps> = ({
  menuItems,
  cartItemCounts,
  selectedBranch,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onOpenDetails,
  searchRef,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [spicyOnly, setSpicyOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  const { maxMenuPrice } = useMemo(() => {
    if (!menuItems.length) return { minMenuPrice: 150, maxMenuPrice: 2000 };
    const prices = menuItems.map((m) => m.price);
    return {
      minMenuPrice: Math.min(...prices),
      maxMenuPrice: Math.max(...prices),
    };
  }, [menuItems]);

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    searchQuery.trim() !== '' ||
    vegOnly ||
    spicyOnly ||
    maxPrice < maxMenuPrice ||
    sortBy !== 'default';

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setVegOnly(false);
    setSpicyOnly(false);
    setMaxPrice(maxMenuPrice);
    setSortBy('default');
  };

  const filteredItems = useMemo(() => {
    let result = menuItems.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      if (vegOnly && !item.tags.includes('veg')) return false;
      if (spicyOnly && !item.tags.includes('spicy')) return false;
      if (item.price > maxPrice) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [menuItems, selectedCategory, searchQuery, vegOnly, spicyOnly, maxPrice, sortBy]);

  return (
    <section id="menu-section" className="w-full py-6 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Search Bar + Location Pin + Orange Circular Filter Toggle (Matching Reference Screen 1) */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 mb-8 shadow-xs border border-[#EBECEF] flex items-center justify-between gap-3">
        {/* Search input with search icon */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#8A8F98] absolute left-3.5 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for delicious dishes, BBQ, karahi..."
            className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-[#F7F8FA] text-xs sm:text-sm text-[#121214] placeholder:text-[#8A8F98] outline-hidden focus:ring-1 focus:ring-[#E5A93C] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#8A8F98] hover:text-[#121214] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Indicator (Hidden on smallest mobile, visible on sm+) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#F7F8FA] text-xs text-[#525760] shrink-0 border border-[#EBECEF]">
          <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span className="font-medium">{selectedBranch}, Karachi</span>
        </div>

        {/* Circular Filter Button (Matching Orange Circle from Reference Screen 1) */}
        <button
          onClick={() => setShowFilterDrawer((prev) => !prev)}
          aria-label="Toggle Filters"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer touch-manipulation shadow-sm shrink-0 ${
            showFilterDrawer || hasActiveFilters
              ? 'bg-[#E5A93C] text-white ring-2 ring-[#E5A93C]/40'
              : 'bg-[#E5A93C] text-white hover:bg-[#D4982E]'
          }`}
          title="Filter and Sort Menu"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Category Navigation with Circular Icon Badges + Labels Beneath (Matching Reference Screen 1) */}
      <div className="mb-10">
        <div className="flex items-start justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group flex flex-col items-center gap-2 cursor-pointer touch-manipulation transition-all shrink-0 focus:outline-hidden"
              >
                {/* Circular Icon Badge */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs ${
                    isActive
                      ? 'bg-[#18181B] text-[#E5A93C] shadow-md scale-105 ring-2 ring-[#E5A93C]/50'
                      : 'bg-white text-[#525760] hover:text-[#121214] hover:bg-[#F4F5F7] border border-[#EBECEF]'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Category Label Beneath */}
                <span
                  className={`text-xs font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-[#121214] font-bold' : 'text-[#717680] group-hover:text-[#121214]'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Drawer / Accordion */}
      {showFilterDrawer && (
        <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 sm:p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBECEF]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#E5A93C]" />
              <span className="text-base font-bold text-[#121214]">
                Filter & Sort Options
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#E5A93C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {/* Dietary Tags */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F98] block">
                Dietary Preference
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setVegOnly((v) => !v)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    vegOnly
                      ? 'bg-emerald-950 text-emerald-200 border-emerald-800 shadow-xs'
                      : 'bg-[#F7F8FA] text-[#525760] border-[#EBECEF] hover:bg-neutral-100'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vegetarian Only</span>
                </button>

                <button
                  onClick={() => setSpicyOnly((s) => !s)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    spicyOnly
                      ? 'bg-amber-950 text-amber-200 border-amber-800 shadow-xs'
                      : 'bg-[#F7F8FA] text-[#525760] border-[#EBECEF] hover:bg-neutral-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Spicy Only</span>
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F98] block">
                Sort By
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'default', label: 'Default' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'name', label: 'Name: A-Z' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-[#F7F8FA] text-[#525760] border-[#EBECEF] hover:bg-neutral-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F98]">
                  Max Price
                </span>
                <span className="font-mono text-xs font-bold text-[#121214]">
                  Under Rs. {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={maxMenuPrice}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#E5A93C] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delicious Items Header (Matching Reference Screen 1 "Delicious items") */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#121214] tracking-tight flex items-center gap-2">
            <span>Delicious items</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBECEF] text-[#525760] font-mono font-medium">
              {filteredItems.length}
            </span>
          </h2>
          <p className="text-xs text-[#717680] mt-0.5">
            Prepared fresh to order using premium spices and pure desi ghee
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#E5A93C] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Food Cards Responsive Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#EBECEF] rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-8 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#F7F8FA] border border-[#EBECEF] mx-auto flex items-center justify-center text-[#8A8F98]">
            <Utensils className="w-6 h-6 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-[#121214]">
            No dishes found
          </h3>
          <p className="text-xs text-[#717680]">
            Try clearing filters or searching for something else like Biryani or Malai Boti.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-full bg-[#18181B] text-white text-xs font-bold hover:bg-[#27272A] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              inCartQty={cartItemCounts[item.id] || 0}
              onAddToCart={onAddToCart}
              onUpdateQty={onUpdateQty}
              onRemoveItem={onRemoveItem}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}

    </section>
  );
};
