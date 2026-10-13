import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Home, AlertCircle, Loader2, MapPin, Phone, ChefHat } from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  initialPhone?: string;
}

const STATUS_STAGES: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    status: 'Received',
    label: 'Order Confirmed',
    desc: 'Ticket confirmed by kitchen dispatch.',
    icon: Clock,
  },
  {
    status: 'Preparing',
    label: 'Live Kitchen Preparing',
    desc: 'Charcoal flames lit & dishes hand-crafted.',
    icon: ChefHat,
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    desc: 'Rider en route with insulated hot bag.',
    icon: Truck,
  },
  {
    status: 'Delivered',
    label: 'Delivered to Doorstep',
    desc: 'Delivered hot and fresh. Bon appétit!',
    icon: Home,
  },
];

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  initialPhone = '',
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (idToSearch: string, phoneToSearch: string) => {
    if (!idToSearch.trim()) {
      setError('Please enter your Order ID (e.g. KB-1001).');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const url = `/api/orders/${encodeURIComponent(idToSearch.trim())}${
        phoneToSearch.trim() ? `?phone=${encodeURIComponent(phoneToSearch.trim())}` : ''
      }`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Order not found. Please verify your Order ID and phone number.');
        }
        throw new Error('Unable to retrieve order details.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Error loading order tracking.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      if (initialPhone) setPhone(initialPhone);
      fetchOrder(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, phone);
  };

  const currentStatusIndex = order
    ? STATUS_STAGES.findIndex((s) => s.status === order.status)
    : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative bg-white border border-[#EBECEF] rounded-[32px] shadow-2xl max-w-xl w-full p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBECEF]">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#8A8F98] uppercase block">
              Live Kitchen Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#121214]">
              Track Your Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full text-[#717680] hover:text-[#121214] hover:bg-[#F4F5F7] transition-all cursor-pointer flex items-center justify-center"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#121214] block mb-1">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. KB-1001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs font-mono uppercase text-[#121214] focus:outline-hidden focus:border-[#18181B] min-h-[42px]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#121214] block mb-1">
                Customer Mobile
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBECEF] bg-[#F7F8FA] text-xs font-mono text-[#121214] focus:outline-hidden focus:border-[#18181B] min-h-[42px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer min-h-[44px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-[#E5A93C]" />
            )}
            <span>LOOK UP ORDER STATUS</span>
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Tracking Timeline */}
        {order && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            
            {/* Status Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[10px] text-[#8C8479] uppercase font-bold tracking-wider block">
                  Current Stage
                </span>
                <span className="font-serif text-lg font-bold text-[#19171C]">
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C8479] uppercase font-bold tracking-wider block">
                  Branch
                </span>
                <span className="text-xs font-bold text-[#8C6D27]">
                  {order.branch}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 px-2">
              {STATUS_STAGES.map((stage, idx) => {
                const isPassed = currentStatusIndex >= idx;
                const isCurrent = currentStatusIndex === idx;
                const StageIcon = stage.icon;

                return (
                  <div key={stage.status} className="flex items-start gap-4 relative">
                    {/* Connecting line */}
                    {idx < STATUS_STAGES.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                          currentStatusIndex > idx ? 'bg-emerald-500' : 'bg-[#EBE4D8]'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isCurrent
                          ? 'bg-[#19171C] text-[#D7AE55] ring-4 ring-[#D7AE55]/30'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FAF7F2] border border-[#EBE4D8] text-[#8C8479]'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <StageIcon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Label & Description */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isCurrent
                              ? 'text-[#19171C]'
                              : isPassed
                              ? 'text-emerald-800'
                              : 'text-[#8C8479]'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5A5550] mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Items Breakdown */}
            <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] space-y-2.5 text-xs shadow-2xs">
              <span className="font-bold text-[#19171C] block pb-1 border-b border-[#F0EAE1]">
                Order Items Summary
              </span>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-[#5A5550]">
                  <span>{item.qty}× {item.name}</span>
                  <span className="font-mono">Rs. {item.price * item.qty}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-[#F0EAE1] font-bold text-[#19171C]">
                <span>Total Payable (COD)</span>
                <span className="font-mono text-sm text-[#8C6D27]">Rs. {order.total}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
