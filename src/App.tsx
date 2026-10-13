import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { PopularItems } from './components/PopularItems.tsx';
import { Specialties } from './components/Specialties.tsx';
import { ChefsSpecial } from './components/ChefsSpecial.tsx';
import { DessertSection } from './components/DessertSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { FinalCTA } from './components/FinalCTA.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { TrackOrderModal } from './components/TrackOrderModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { ItemDetailModal } from './components/ItemDetailModal.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { INITIAL_MENU } from './data/menu.ts';
import { CartItem, MenuItem, Order } from './types.ts';
import { Check } from 'lucide-react';

const DELIVERY_FEE = 150;

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kb_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedBranch, setSelectedBranch] = useState<string>('Clifton');
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackParams, setTrackParams] = useState<{ id: string; phone: string }>({
    id: '',
    phone: '',
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check URL hash/path for direct navigation (e.g. /admin, #admin, #track)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin' || path.startsWith('/admin/')) {
        setIsAdminOpen(true);
      } else if (hash === '#track' || path === '/track') {
        setIsTrackOpen(true);
      }
    };
    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    return () => window.removeEventListener('hashchange', handleUrlRoute);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kb_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Fetch live menu from API with fallback
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => {
        if (!res.ok) throw new Error('API menu error');
        return res.json();
      })
      .then((data: MenuItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map((item) => {
            const fallback = INITIAL_MENU.find((m) => m.id === item.id);
            const rawImage = item.image || fallback?.image || '';
            const normalizedImage = rawImage.replace(/^\/src\/assets\/images\//, '/images/');
            return {
              ...item,
              image: normalizedImage,
            };
          });
          setMenuItems(merged);
        }
      })
      .catch((err) => {
        console.warn('Using seeded menu fallback:', err.message);
      });
  }, []);

  // Cart Add with optional quantity & notes (Strict 1-10 per product limit)
  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    let reachedLimit = false;
    setCartItems((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        if (existing.qty >= 10) {
          reachedLimit = true;
          return prev;
        }
        const updatedQty = Math.min(10, existing.qty + quantity);
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, qty: updatedQty } : c
        );
      }
      return [...prev, { menuItem: item, qty: Math.min(10, Math.max(1, quantity)) }];
    });

    if (reachedLimit) {
      setToastMessage(`Maximum limit of 10 reached for ${item.name}`);
    } else {
      setToastMessage(`Added ${quantity > 1 ? `${quantity}x ` : ''}${item.name} to cart`);
    }
    setTimeout(() => {
      setToastMessage((curr) => (curr?.includes(item.name) ? null : curr));
    }, 2200);
  };

  const handleUpdateQty = (itemId: number, delta: number) => {
    setCartItems((prev) => {
      const target = prev.find((c) => c.menuItem.id === itemId);
      if (!target) return prev;

      const newQty = target.qty + delta;
      // Requirement: When quantity is 1 and customer presses −, remove the item and restore Add to Cart
      if (newQty < 1) {
        return prev.filter((c) => c.menuItem.id !== itemId);
      }

      // Requirement: Maximum quantity per product: 10
      if (newQty > 10) {
        return prev;
      }

      return prev.map((c) =>
        c.menuItem.id === itemId ? { ...c, qty: newQty } : c
      );
    });
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prev) => {
      const target = prev.find((c) => c.menuItem.id === itemId);
      if (target) {
        setToastMessage(`Removed ${target.menuItem.name} from cart`);
        setTimeout(() => {
          setToastMessage((curr) => (curr?.includes(target.menuItem.name) ? null : curr));
        }, 2200);
      }
      return prev.filter((c) => c.menuItem.id !== itemId);
    });
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.qty, 0);
  const totalCartSubtotal = cartItems.reduce(
    (acc, curr) => acc + curr.menuItem.price * curr.qty,
    0
  );

  const cartCountsMap = cartItems.reduce<Record<number, number>>((acc, curr) => {
    acc[curr.menuItem.id] = curr.qty;
    return acc;
  }, {});

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    setIsConfirmOpen(true);
    setCartItems([]);
  };

  const handleTrackFromConfirm = (orderId: string, phone: string) => {
    setIsConfirmOpen(false);
    setTrackParams({ id: orderId, phone });
    setIsTrackOpen(true);
  };

  const handleFocusSearch = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 400);
  };

  const dessertItems = menuItems.filter((m) => m.category === 'DESSERTS');

  // Featured Popular Items matching Reference Screen 1
  const popularDishes = menuItems.filter((m) => [1, 3, 5].includes(m.id));

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#121214] font-sans relative selection:bg-[#E5A93C]/30 pb-20 sm:pb-0">
      
      {/* Main Page Layout */}
      <div className="relative z-10">
        
        {/* Navigation & Header */}
        <Header
          cartCount={totalCartCount}
          cartSubtotal={totalCartSubtotal}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTrack={() => {
            setTrackParams({ id: '', phone: '' });
            setIsTrackOpen(true);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onFocusSearch={handleFocusSearch}
          onOrderNow={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Hero Section */}
        <Hero
          onOrderNow={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreMenu={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Popular Items Showcase (Matching Reference Screen 1 "Popular items") */}
        {popularDishes.length > 0 && (
          <PopularItems
            popularItems={popularDishes}
            cartItemCounts={cartCountsMap}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onOpenDetails={(item) => setSelectedDetailItem(item)}
          />
        )}

        {/* Section Transition & Menu Grid with Category Carousel & Filter */}
        <Specialties
          menuItems={menuItems}
          cartItemCounts={cartCountsMap}
          selectedBranch={selectedBranch}
          onAddToCart={handleAddToCart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onOpenDetails={(item) => setSelectedDetailItem(item)}
          searchRef={searchInputRef}
        />

        {/* Chef's Special (Shinwari Karahi Spotlight) */}
        <ChefsSpecial
          onDiscoverMenu={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Dessert Section: A Sweet Finish */}
        <DessertSection
          dessertItems={dessertItems}
          cartItemCounts={cartCountsMap}
          onAddToCart={handleAddToCart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
        />

        {/* Heritage & 3 Branches Information */}
        <AboutSection />

        {/* Final CTA */}
        <FinalCTA
          onOrderNow={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Minimal Footer */}
        <Footer
          onOpenTrack={() => {
            setTrackParams({ id: '', phone: '' });
            setIsTrackOpen(true);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

      </div>

      {/* Modern Mobile App Bottom Navigation Bar with Elevated Center Cart Button */}
      <BottomNavBar
        cartCount={totalCartCount}
        cartSubtotal={totalCartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrack={() => {
          setTrackParams({ id: '', phone: '' });
          setIsTrackOpen(true);
        }}
        onFocusSearch={handleFocusSearch}
        onGoToMenu={() => {
          const el = document.getElementById('menu-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoToHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Instant Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-full bg-[#18181B] text-white border border-white/10 shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-4 h-4 rounded-full bg-[#E5A93C] text-[#121214] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Product Detail Modal (Matching Reference Screen 2) */}
      {selectedDetailItem && (
        <ItemDetailModal
          key={selectedDetailItem.id}
          item={selectedDetailItem}
          isOpen={true}
          onClose={() => setSelectedDetailItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Interactive Modals */}
      {isCartOpen && (
        <CartDrawer
          isOpen={true}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onProceedToCheckout={handleProceedToCheckout}
          deliveryFee={DELIVERY_FEE}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          deliveryFee={DELIVERY_FEE}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {isConfirmOpen && confirmedOrder && (
        <OrderConfirmationModal
          isOpen={true}
          order={confirmedOrder}
          onClose={() => setIsConfirmOpen(false)}
          onTrackOrder={handleTrackFromConfirm}
        />
      )}

      {isTrackOpen && (
        <TrackOrderModal
          isOpen={true}
          onClose={() => setIsTrackOpen(false)}
          initialOrderId={trackParams.id}
          initialPhone={trackParams.phone}
        />
      )}

      {isAdminOpen && (
        <AdminDashboardModal
          isOpen={true}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
}
