import React, { useState } from 'react';
import { Item, UserProfile } from '../types';
import { ItemCard } from '../components/ItemCard';
import { updateItemStatus, deleteItem } from '../lib/supabase';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  PlusCircle, 
  Trash2, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  currentUser: UserProfile;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenChat: (item: Item) => void;
  onNavigate: (page: string) => void;
  onRefreshItems: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  items,
  onSelectItem,
  onOpenChat,
  onNavigate,
  onRefreshItems,
}) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'all'>('lost');

  // Filter items created by current user
  const myItems = items.filter((i) => i.userId === currentUser.id);
  const myLostItems = myItems.filter((i) => i.type === 'lost');
  const myFoundItems = myItems.filter((i) => i.type === 'found');
  const resolvedItems = myItems.filter((i) => i.status === 'resolved');

  const displayedList =
    activeTab === 'lost' ? myLostItems : activeTab === 'found' ? myFoundItems : myItems;

  const handleToggleStatus = (item: Item) => {
    const newStatus = item.status === 'active' ? 'resolved' : 'active';
    updateItemStatus(item.id, newStatus);
    if (newStatus === 'resolved') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    onRefreshItems();
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this listing from Chennai Lost & Found?')) {
      deleteItem(itemId);
      onRefreshItems();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-400 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                Verified Citizen
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {currentUser.area}, Chennai
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.email}
              </span>
              {currentUser.phoneMasked && (
                <>
                  <span>•</span>
                  <span>{currentUser.phoneMasked}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Post new report CTA */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={() => onNavigate('report-lost')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-all"
          >
            + Post Lost
          </button>
          <button
            type="button"
            onClick={() => onNavigate('report-found')}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all"
          >
            + Post Found
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-2xl font-black text-slate-900">{myItems.length}</span>
          <p className="text-xs text-slate-500 mt-1 font-medium">Total Listings</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-2xl font-black text-rose-600">{myLostItems.length}</span>
          <p className="text-xs text-slate-500 mt-1 font-medium">My Lost Reports</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-2xl font-black text-teal-600">{myFoundItems.length}</span>
          <p className="text-xs text-slate-500 mt-1 font-medium">My Found Reports</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-2xl font-black text-emerald-600">{resolvedItems.length}</span>
          <p className="text-xs text-slate-500 mt-1 font-medium">Reunions Achieved</p>
        </div>
      </div>

      {/* Manage Listings Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'lost'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              My Lost Items ({myLostItems.length})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'found'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              My Found Items ({myFoundItems.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All My Reports ({myItems.length})
            </button>
          </div>

          <button
            onClick={() => onNavigate('matches')}
            className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Check AI Matches</span>
          </button>
        </div>

        {/* Listings List with Edit / Toggle / Delete Controls */}
        {displayedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedList.map((item) => (
              <div key={item.id} className="relative group">
                <ItemCard
                  item={item}
                  onViewDetails={onSelectItem}
                  isOwner={true}
                />

                {/* Owner Control Overlay Bar */}
                <div className="mt-2 p-2 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                      item.status === 'resolved'
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status === 'resolved' ? 'Mark Active' : 'Mark Reunited'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No listings in this category</h3>
            <p className="text-xs text-slate-500">
              You haven't reported any {activeTab === 'lost' ? 'lost' : 'found'} items under this profile yet.
            </p>
            <button
              onClick={() => onNavigate(activeTab === 'found' ? 'report-found' : 'report-lost')}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
            >
              Post a Report Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
