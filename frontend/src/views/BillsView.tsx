import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Calendar,
  History,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BillsView: React.FC = () => {
  const { bills, markBillPaid, deleteBill, openQuickAdd } = useApp();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UNPAID' | 'PAID' | 'OVERDUE'>('ALL');
  const [selectedBillForPay, setSelectedBillForPay] = useState<string | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState('');

  const unpaidBills = bills.filter(b => b.paymentStatus !== 'PAID');
  const overdueBills = bills.filter(b => b.paymentStatus === 'OVERDUE');
  const totalUnpaidAmount = unpaidBills.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredBills = bills.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.paymentStatus === filterStatus;
  });

  const handleConfirmPayment = () => {
    if (selectedBillForPay) {
      markBillPaid(selectedBillForPay, paymentRefInput || undefined);
      setSelectedBillForPay(null);
      setPaymentRefInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-amber-400" /> Bills, Deadlines & Obligations
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Track recurring financial deadlines with zero card credentials stored.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('bill')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Bill
        </button>
      </div>

      {/* Security notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Privacy Guard Active:</strong> LifeOS tracks due dates and payment records without storing bank passwords, credit card numbers, or financial credentials.
        </span>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Unpaid Obligations</span>
          <p className="text-2xl font-extrabold text-amber-400">${totalUnpaidAmount.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500">{unpaidBills.length} pending billing statements</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Overdue Bills</span>
          <p className={`text-2xl font-extrabold ${overdueBills.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {overdueBills.length}
          </p>
          <p className="text-[11px] text-slate-500">Require immediate settlement</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Settled History</span>
          <p className="text-2xl font-extrabold text-teal-400">
            {bills.filter(b => b.paymentStatus === 'PAID').length}
          </p>
          <p className="text-[11px] text-slate-500">Verified receipts logged</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        {(['ALL', 'UNPAID', 'OVERDUE', 'PAID'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
              ${filterStatus === tab
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            {tab === 'ALL' ? 'All Statements' : tab}
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
        {filteredBills.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No bills found in this status category.
          </div>
        ) : (
          filteredBills.map(bill => {
            const isOverdue = bill.paymentStatus === 'OVERDUE';
            const isPaid = bill.paymentStatus === 'PAID';

            return (
              <div
                key={bill.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors
                  ${isPaid
                    ? 'bg-slate-950/40 border-slate-800/40 opacity-70'
                    : isOverdue
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-100 truncate">{bill.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase
                      ${isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isOverdue ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                      {bill.paymentStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Payee: <span className="text-slate-300">{bill.payee || 'Direct Billing'}</span> • Category:{' '}
                    <span className="capitalize text-slate-300">{bill.category}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" /> Due: {bill.dueDate}
                    </span>
                    <span>• Cycle: {bill.recurringInterval}</span>
                    {bill.paidDate && (
                      <span className="text-emerald-400 font-semibold">• Paid on {bill.paidDate}</span>
                    )}
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-white">${bill.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">{bill.currency}</span>
                  </div>

                  {!isPaid && (
                    <button
                      onClick={() => setSelectedBillForPay(bill.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all hover:scale-105"
                    >
                      Mark Paid ✓
                    </button>
                  )}

                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedBillForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Record Bill Payment</h3>
            <p className="text-xs text-slate-300">
              Confirm that you have settled this payment outside LifeOS.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Optional Confirmation Ref or Check #
              </label>
              <input
                type="text"
                placeholder="e.g. TXN-948291 or Bank Ref"
                value={paymentRefInput}
                onChange={(e) => setPaymentRefInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedBillForPay(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Confirm Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
