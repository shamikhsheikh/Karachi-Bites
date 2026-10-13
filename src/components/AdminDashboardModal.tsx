import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, RefreshCw, Filter, AlertCircle, CheckCircle2, ChevronRight, LogOut, Phone, MapPin, UserCheck, ShieldAlert, Clock, ChefHat, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: OrderStatus[] = ['Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kb_admin_token'));
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; role: string } | null>(null);
  
  // Default login credentials hint
  const [identifier, setIdentifier] = useState('Karachi Bites');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Verify existing session on mount
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session expired');
          return res.json();
        })
        .then((data) => {
          if (data.user?.role !== 'admin') {
            handleLogout();
            setLoginError('Access Denied: Administrator role required.');
          } else {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Invalid username, email, or password');
      }

      if (data.user?.role !== 'admin') {
        throw new Error('Access Denied: This account does not possess administrator privileges.');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('kb_admin_token', data.token);
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('kb_admin_token');
  };

  const fetchAdminOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    setActionError(null);

    try {
      const params = new URLSearchParams();
      if (selectedBranch && selectedBranch !== 'All') {
        params.append('branch', selectedBranch);
      }
      if (selectedDate) {
        params.append('date', selectedDate);
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Session invalid or unauthorized. Please re-authenticate.');
        }
        throw new Error('Failed to load orders.');
      }

      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setActionError(err.message || 'Failed to retrieve orders.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (token && currentUser?.role === 'admin') {
      fetchAdminOrders();
    }
  }, [token, currentUser, selectedBranch, selectedDate]);

  if (!isOpen) return null;

  const handleAdvanceStatus = async (order: Order) => {
    const currentIndex = STATUS_STEPS.indexOf(order.status);
    if (currentIndex === -1 || currentIndex >= STATUS_STEPS.length - 1) return;

    const nextStatus = STATUS_STEPS[currentIndex + 1];
    setUpdatingOrderId(order.orderId);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update order status');
      }

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.orderId === updated.orderId ? updated : o))
      );
    } catch (err: any) {
      setActionError(err.message || 'Error advancing status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-[#FAF7F2] border border-[#EBE4D8] rounded-3xl shadow-2xl max-w-4xl w-full p-5 sm:p-8 z-10 max-h-[92vh] overflow-y-auto flex flex-col space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE4D8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#19171C] text-[#D7AE55] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#8C6D27] uppercase block">
                RESTAURANT MANAGEMENT
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#19171C]">
                Kitchen Dispatch Console
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C8479] hover:text-[#19171C] hover:bg-black/5 active:scale-95 transition-all cursor-pointer touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGIN VIEW */}
        {!token || currentUser?.role !== 'admin' ? (
          <div className="max-w-md mx-auto w-full py-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#EBE4D8] flex items-center justify-center mx-auto text-[#19171C] shadow-xs">
              <Lock className="w-6 h-6 text-[#D7AE55]" />
            </div>
            <div>
              <h4 className="font-serif text-2xl font-bold text-[#19171C]">
                Staff Authentication
              </h4>
              <p className="text-xs text-[#5A5550] mt-1">
                Authorized Karachi Bites management & kitchen dispatch access only.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs text-left flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#19171C] block mb-1">
                  Admin Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Karachi Bites or owner email"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE4D8] bg-white text-sm text-[#19171C] focus:outline-hidden focus:border-[#D7AE55] min-h-[44px]"
                />
                <span className="text-[10px] text-[#8C8479] block mt-1">
                  Accepts username <strong className="text-[#19171C]">Karachi Bites</strong>
                </span>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#19171C] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE4D8] bg-white text-sm text-[#19171C] focus:outline-hidden focus:border-[#D7AE55] min-h-[44px]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#19171C] hover:bg-[#D7AE55] text-[#F7EBD2] hover:text-[#19171C] rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[48px] active:scale-[0.98] shadow-sm"
              >
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOG IN TO DISPATCH CONSOLE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE4D8] shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#8C8479] flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Branch:</span>
                </span>
                {(['All', 'Clifton', 'Gulshan-e-Iqbal', 'North Nazimabad'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBranch(b)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer touch-manipulation min-h-[34px] flex items-center ${
                      selectedBranch === b
                        ? 'bg-[#19171C] text-[#F7EBD2] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#5A5550] hover:bg-[#EBE4D8]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EAE1]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D7AE55]/15 border border-[#D7AE55]/30 text-[11px] text-[#8C6D27] font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{currentUser.username}</span>
                </div>
                <button
                  onClick={fetchAdminOrders}
                  disabled={loadingOrders}
                  title="Refresh order queue"
                  className="p-2 rounded-xl border border-[#EBE4D8] hover:bg-[#FAF7F2] text-[#19171C] transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Refresh orders"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {actionError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Orders Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8C8479]">
                <span>
                  Active Queue: <strong className="text-[#19171C] font-mono">{orders.length}</strong> orders
                </span>
                <span>Live synchronization</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EBE4D8] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                  <p className="font-serif text-xl font-bold text-[#19171C]">No Active Orders</p>
                  <p className="text-xs text-[#5A5550]">No customer orders currently match the selected branch filter.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {orders.map((ord) => {
                    const currIndex = STATUS_STEPS.indexOf(ord.status);
                    const nextStatus = currIndex < STATUS_STEPS.length - 1 ? STATUS_STEPS[currIndex + 1] : null;

                    return (
                      <div
                        key={ord.orderId}
                        className="p-5 rounded-2xl bg-white border border-[#EBE4D8] shadow-2xs space-y-3.5 hover:border-[#D7AE55]/40 transition-all"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0EAE1]">
                          <div className="flex items-center gap-2.5">
                            <span className="font-serif font-bold text-lg text-[#19171C]">
                              {ord.orderId}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D7AE55]/20 text-[#8C6D27] uppercase">
                              {ord.branch}
                            </span>
                            <span className="text-xs text-[#8C8479] font-mono">
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Out for Delivery'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'Preparing'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5A5550]">
                          <div className="space-y-1">
                            <span className="font-bold text-[#19171C] text-sm block">{ord.customer?.name}</span>
                            <div className="flex items-center gap-1.5 font-mono text-[#19171C]">
                              <Phone className="w-3.5 h-3.5 text-[#D7AE55]" />
                              <a href={`tel:${ord.customer?.phone}`} className="hover:underline">
                                {ord.customer?.phone}
                              </a>
                            </div>
                            <div className="flex items-start gap-1.5 text-[#5A5550] pt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#D7AE55] shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{ord.customer?.address}</span>
                            </div>
                          </div>

                          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EBE4D8]">
                            <span className="font-bold text-[#19171C] block text-[11px] mb-1 uppercase tracking-wider">
                              Kitchen Ticket Items:
                            </span>
                            <ul className="space-y-0.5 text-xs">
                              {ord.items?.map((it) => (
                                <li key={it.id} className="flex justify-between">
                                  <span>{it.qty}× {it.name}</span>
                                  <span className="font-mono font-medium">Rs. {it.price * it.qty}</span>
                                </li>
                              ))}
                            </ul>
                            {ord.notes && (
                              <p className="mt-1.5 pt-1.5 border-t border-[#EBE4D8] text-[11px] text-amber-900 font-medium italic">
                                Special Note: {ord.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="pt-3 border-t border-[#F0EAE1] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                          <div className="text-xs">
                            <span className="text-[#8C8479]">Payable Amount: </span>
                            <span className="font-serif font-bold text-base text-[#19171C] font-mono">
                              Rs. {ord.total}
                            </span>
                            <span className="text-[10px] text-[#8C8479] ml-1">(COD)</span>
                          </div>

                          {nextStatus ? (
                            <button
                              onClick={() => handleAdvanceStatus(ord)}
                              disabled={updatingOrderId === ord.orderId}
                              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D7AE55] text-[#19171C] hover:bg-[#E8C878] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-60 cursor-pointer touch-manipulation min-h-[42px] active:scale-[0.98] shadow-xs"
                            >
                              <span>Advance to {nextStatus}</span>
                              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold py-1">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>Order Completed</span>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
