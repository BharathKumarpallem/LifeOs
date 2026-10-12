import React, { useState } from 'react';
import {
  Users,
  Plus,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  Mail,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FamilyView: React.FC = () => {
  const {
    family,
    addFamilyMember,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem
  } = useApp();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'CHILD'>('MEMBER');

  const [shoppingInput, setShoppingInput] = useState('');
  const [shoppingQty, setShoppingQty] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    addFamilyMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole
    });
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const handleAddShopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoppingInput.trim()) return;
    addShoppingItem(shoppingInput.trim(), shoppingQty.trim() || undefined);
    setShoppingInput('');
    setShoppingQty('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-pink-400" /> Family & Shared Workspace
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Collaborative family group, shared errands, and partitioned role permissions.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-500/20 transition-all hover:scale-105"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Strict Privacy Safeguard:</strong> Personal documents, individual finances, career notes, and private health records are never exposed to family members unless you deliberately share them.
        </span>
      </div>

      {/* Invite Member Dialog */}
      {isInviteOpen && (
        <form onSubmit={handleInvite} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Invite Family Member</span>
            <button type="button" onClick={() => setIsInviteOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Full Name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-pink-500"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-pink-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-pink-500"
            >
              <option value="MEMBER">Member (Standard)</option>
              <option value="ADMIN">Co-Admin</option>
              <option value="CHILD">Child / Dependent</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-xs"
          >
            Send Secure Invitation
          </button>
        </form>
      )}

      {/* Grid: Family Members & Shared Shopping / Errands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Family Members */}
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Group Members ({family.members.length})
          </h2>
          <div className="space-y-3">
            {family.members.map(mem => (
              <div key={mem.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={mem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={mem.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-pink-500/30"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{mem.name}</p>
                    <p className="text-[11px] text-slate-400">{mem.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase
                  ${mem.role === 'ADMIN' ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-700 text-slate-300'}`}>
                  {mem.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Shared Shopping & Errands List */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Shared Household Shopping & Errands
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {family.sharedShoppingList.filter(s => s.completed).length}/{family.sharedShoppingList.length} Picked up
            </span>
          </div>

          {/* Add Item Input */}
          <form onSubmit={handleAddShopping} className="flex gap-2">
            <input
              type="text"
              placeholder="Add shared item (e.g. Sourdough Bread, AA Batteries)..."
              value={shoppingInput}
              onChange={(e) => setShoppingInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              placeholder="Qty (optional)"
              value={shoppingQty}
              onChange={(e) => setShoppingQty(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs"
            >
              Add
            </button>
          </form>

          {/* List */}
          <div className="space-y-2 pt-2">
            {family.sharedShoppingList.map(item => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors
                  ${item.completed
                    ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
              >
                <div
                  onClick={() => toggleShoppingItem(item.id)}
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${item.completed ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-600'}`}>
                    {item.completed && '✓'}
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {item.name} {item.quantity && <span className="text-slate-400">({item.quantity})</span>}
                    </p>
                    <span className="text-[10px] text-slate-500">Added by {item.addedBy}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteShoppingItem(item.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
