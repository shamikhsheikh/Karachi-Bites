import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, MapPin, Phone, User, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Order } from '../types.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  deliveryFee: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  deliveryFee,
  onOrderSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState<'Clifton' | 'Gulshan-e-Iqbal' | 'North Nazimabad'>('Clifton');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.menuItem.price * curr.qty,
    0
  );
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const pkPhoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
    if (!pkPhoneRegex.test(cleanPhone)) {
      setError('Please enter a valid Pakistani mobile number (e.g. 0300-1234567 or 03219876543).');
      return;
    }

    if (!address.trim() || address.trim().length < 8) {
      setError('Please provide a complete delivery address with street and area.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
      branch,
      items: cartItems.map((c) => ({
        id: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        qty: Math.min(10, Math.max(1, c.qty)),
      })),
      notes: notes.trim(),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to place order. Please check your information.');
      }

      const orderData = await res.json();
      onOrderSuccess(orderData);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative bg-white border border-[#EBECEF] rounded-[32px] shadow-2xl max-w-xl w-full p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBECEF]">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#8A8F98] uppercase block">
              Final Step
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#121214]">
              Delivery Checkout
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full text-[#717680] hover:text-[#121214] hover:bg-[#F4F5F7] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#121214] block mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs text-[#121214] focus:outline-hidden focus:border-[#18181B] min-h-[42px]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#121214] block mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs font-mono text-[#121214] focus:outline-hidden focus:border-[#18181B] min-h-[42px]"
                />
              </div>
              <span className="text-[10px] text-[#8A8F98] block mt-1">
                For delivery rider contact upon arrival.
              </span>
            </div>
          </div>

          {/* Branch Selector */}
          <div>
            <label className="text-xs font-bold text-[#121214] block mb-1.5">
              Select Dispatch Branch *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['Clifton', 'Gulshan-e-Iqbal', 'North Nazimabad'] as const).map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBranch(b)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    branch === b
                      ? 'border-[#18181B] bg-[#F7F8FA] shadow-xs ring-1 ring-[#18181B]'
                      : 'border-[#EBECEF] bg-white hover:bg-[#FAFBFD] text-[#525760]'
                  }`}
                >
                  <span className="block font-bold text-xs text-[#121214]">{b}</span>
                  <span className="block text-[10px] text-[#8A8F98] mt-0.5">35-min dispatch</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complete Delivery Address */}
          <div>
            <label className="text-xs font-bold text-[#121214] block mb-1.5">
              Complete Delivery Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-3.5 pointer-events-none" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Apartment #, Street, Block, Area..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs text-[#121214] focus:outline-hidden focus:border-[#18181B] resize-none"
              />
            </div>
          </div>

          {/* Kitchen Notes */}
          <div>
            <label className="text-xs font-bold text-[#121214] block mb-1.5">
              Special Instructions (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Mild spice on karahi, extra mint raita..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs text-[#121214] focus:outline-hidden focus:border-[#18181B] min-h-[42px]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EBECEF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#121214] block">Cash on Delivery (COD)</span>
                <span className="text-[11px] text-[#717680]">Pay rider in cash upon receiving hot food.</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Standard
            </span>
          </div>

          {/* Order Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#EBECEF] space-y-2 text-xs">
            <div className="flex justify-between text-[#525760]">
              <span>Dishes Subtotal ({cartItems.length} items)</span>
              <span className="font-mono font-semibold text-[#121214]">Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between text-[#525760]">
              <span>Flat Delivery Fee</span>
              <span className="font-mono font-semibold text-[#121214]">Rs. {deliveryFee}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#EBECEF] text-sm font-bold text-[#121214]">
              <span>Total Payable</span>
              <span className="font-mono text-base text-[#121214]">Rs. {total}</span>
            </div>
          </div>

          {/* Solid Black Submit Button (Matching Reference Screen 3) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md disabled:opacity-50 cursor-pointer min-h-[46px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>CONFIRMING ORDER...</span>
              </>
            ) : (
              <>
                <span>PLACE ORDER • RS. {total}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
