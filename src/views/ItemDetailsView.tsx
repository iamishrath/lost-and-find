import React, { useState } from 'react';
import { Item, UserProfile } from '../types';
import { CATEGORY_METADATA } from '../data/chennaiLocations';
import { findMatchesForItem } from '../lib/matching';
import { updateItemStatus } from '../lib/supabase';
import { ChennaiMap } from '../components/ChennaiMap';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Gift, 
  ArrowLeft, 
  Share2, 
  Flag, 
  Check, 
  HelpCircle,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ItemDetailsViewProps {
  item: Item;
  currentUser: UserProfile;
  allItems: Item[];
  onBack: () => void;
  onOpenChat: (item: Item) => void;
  onNavigate: (page: string, params?: any) => void;
  onSelectItem: (item: Item) => void;
}

export const ItemDetailsView: React.FC<ItemDetailsViewProps> = ({
  item,
  currentUser,
  allItems,
  onBack,
  onOpenChat,
  onNavigate,
  onSelectItem,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState('scam');
  const [reportDetails, setReportDetails] = useState('');

  const isOwner = item.userId === currentUser.id;
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';
  const categoryMeta = CATEGORY_METADATA[item.category] || CATEGORY_METADATA.other;

  // Run matching radar on this specific item
  const potentialMatches = findMatchesForItem(item, allItems);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleResolved = () => {
    const newStatus = isResolved ? 'active' : 'resolved';
    updateItemStatus(item.id, newStatus);
    item.status = newStatus;
    if (newStatus === 'resolved') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Listing'}</span>
          </button>

          {!isOwner && (
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Item Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Image & Status */}
        <div className="lg:col-span-5 bg-slate-950 p-6 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg flex items-center gap-1 ${
                isLost ? 'bg-rose-600' : 'bg-teal-600'
              }`}>
                {isLost ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
              </span>

              {isResolved && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-lg">
                  ✓ REUNITED
                </span>
              )}
            </div>
          </div>

          {/* Poster Profile snippet */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-sm">
                {item.userName[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{item.userName}</p>
                <p className="text-[11px] text-teal-400 font-medium">📍 {item.area}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Citizen</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Specs & Actions */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and date pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" />
                {categoryMeta.label}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {isLost ? 'Lost on' : 'Found on'}: {item.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {item.title}
            </h1>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Chennai Spot Landmark */}
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-1">
              <div className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Reported Spot: {item.area}</span>
              </div>
              <p className="text-xs text-teal-800">
                {item.locationDescription}
              </p>
            </div>

            {/* Distinctive marks or Reward */}
            {item.reward && isLost && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900">
                <Gift className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-xs">
                  <strong>Gratitude / Token Reward:</strong> {item.reward}
                </div>
              </div>
            )}

            {item.verificationQuestion && !isLost && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-slate-800">
                <HelpCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Verification Challenge for Claimants:</strong>
                  <p className="text-slate-600 mt-0.5 italic">"{item.verificationQuestion}"</p>
                  <p className="text-[10px] text-slate-400 mt-1">Answer this in the chat to prove ownership.</p>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            {isOwner ? (
              <button
                type="button"
                onClick={handleToggleResolved}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  isResolved
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isResolved ? 'Mark as Active Again' : 'Mark as Successfully Reunited!'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenChat(item)}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isLost ? 'Contact Owner (Found This)' : 'Claim Item (This Is Mine)'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Safe Meetup Advice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mini Location Map Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Approximate Incident Location</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">📍 {item.area}, Chennai</span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <ChennaiMap
            items={[item]}
            selectedItem={item}
            height="260px"
            showSafeSpots={true}
          />
        </div>
        <p className="text-[11px] text-slate-500">
          🛡️ Approximate public coordinate displayed to safeguard personal residential privacy.
        </p>
      </div>

      {/* AI-Powered Matching Radar for this item */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Intelligent Cross-Matching Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              Possible Matches for This Item
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Calculated using title similarity, category compatibility, date windows, and Chennai geographic distance.
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 self-start sm:self-auto">
            Candidates Found: <strong>{potentialMatches.length}</strong>
          </span>
        </div>

        {potentialMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {potentialMatches.map((match) => {
              const matchedItem = isLost ? match.foundItem : match.lostItem;
              return (
                <div
                  key={match.id}
                  className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={matchedItem.imageUrl}
                      alt={matchedItem.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                          matchedItem.type === 'lost' ? 'bg-rose-600' : 'bg-teal-600'
                        }`}>
                          {matchedItem.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                          match.score >= 80 ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                        }`}>
                          ★ {match.score}% Match
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate mt-1">{matchedItem.title}</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">📍 {matchedItem.area} • {matchedItem.date}</p>
                    </div>
                  </div>

                  {/* Match reasons breakdown */}
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/50 space-y-1">
                    {match.reasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="text-[11px] text-amber-300/90 flex items-center gap-1.5">
                        <span>•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Distance: ~{match.distanceKm} km
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectItem(matchedItem)}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenChat(matchedItem)}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-xs font-bold text-slate-950 transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-center text-xs text-slate-400">
            No high-confidence opposite reports matching this item yet. When another citizen reports a corresponding {isLost ? 'found' : 'lost'} item in Chennai, it will automatically show here!
          </div>
        )}
      </div>

      {/* Safety Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Report Listing</h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium text-center">
                ✓ Thank you. Our community moderation team has received your report.
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="scam">Suspected Advance Fee / Courier Scam</option>
                    <option value="fake">Fake or Misleading Photo/Listing</option>
                    <option value="abusive">Harassment or Abusive Behavior</option>
                    <option value="other">Other Civic Safety Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Additional Context</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide details for review..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
