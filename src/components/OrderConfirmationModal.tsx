import React from 'react';
import { CheckCircle, Compass, ArrowRight, X } from 'lucide-react';
import { Order } from '../types.ts';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string, phone: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative bg-white border border-[#EBECEF] rounded-[32px] shadow-2xl max-w-md w-full p-6 sm:p-8 z-10 text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Accessible Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order confirmation"
          className="absolute top-4 right-4 w-9 h-9 rounded-full text-[#717680] hover:text-[#121214] hover:bg-[#F4F5F7] transition-colors z-20 cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
          <CheckCircle className="w-8 h-8" />
        </div>

        {/* Confirmation Header */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase block">
            Order Confirmed
          </span>
          <h3 className="text-2xl font-bold text-[#121214]">
            Order #{order.orderId}
          </h3>
          <p className="text-xs text-[#525760] max-w-xs mx-auto">
            Our kitchen dispatch has received your order and live coals are prepared.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="rounded-2xl bg-[#F7F8FA] border border-[#EBECEF] p-4 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-[#EBECEF]">
            <span className="text-[#717680]">Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
              {order.status}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#717680]">Branch Dispatch</span>
            <span className="font-semibold text-[#121214]">{order.branch}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#717680]">Customer</span>
            <span className="font-semibold text-[#121214]">{order.customer.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#717680]">Contact</span>
            <span className="font-mono text-[#121214] font-semibold">{order.customer.phone}</span>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="pt-2 border-t border-[#EBECEF] space-y-1">
              <span className="text-[10px] text-[#8A8F98] uppercase font-bold tracking-wider block">
                Dishes
              </span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-[#525760]">
                  <span>{item.qty}× {item.name}</span>
                  <span className="font-mono font-medium">Rs. {item.price * item.qty}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-[#EBECEF] font-bold text-sm text-[#121214]">
            <span>Total Payable (COD)</span>
            <span className="font-mono text-base text-[#121214]">Rs. {order.total}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => onTrackOrder(order.orderId, order.customer.phone)}
            className="w-full py-3.5 px-5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Compass className="w-4 h-4 text-[#E5A93C]" />
            <span>Track Live Order</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full text-xs font-semibold text-[#525760] hover:text-[#121214] transition-colors cursor-pointer"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
};
