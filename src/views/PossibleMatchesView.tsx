import React, { useState } from 'react';
import { Item, MatchResult, UserProfile } from '../types';
import { scanAllMatches } from '../lib/matching';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sliders,
  Filter
} from 'lucide-react';

interface PossibleMatchesViewProps {
  items: Item[];
  currentUser: UserProfile;
  onSelectItem: (item: Item) => void;
  onOpenChat: (item: Item) => void;
  onNavigate: (page: string) => void;
}

export const PossibleMatchesView: React.FC<PossibleMatchesViewProps> = ({
  items,
  currentUser,
  onSelectItem,
  onOpenChat,
  onNavigate,
}) => {
  const [minConfidence, setMinConfidence] = useState<number>(45);
  const [filterMineOnly, setFilterMineOnly] = useState<boolean>(false);

  // Compute all cross matches dynamically
  const allMatches = scanAllMatches(items, minConfidence);

  const displayedMatches = filterMineOnly
    ? allMatches.filter(
        (m) => m.lostItem.userId === currentUser.id || m.foundItem.userId === currentUser.id
      )
    : allMatches;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Real Algorithmic Matching Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Intelligent Lost & Found Match Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automated correlation system calculating name overlap, category compatibility, date timelines, and Haversine geo-distance across Chennai neighborhoods.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-center">
              <span className="text-2xl font-black text-amber-400">{displayedMatches.length}</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Matches Identified
              </p>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>Min Confidence Score: <strong>{minConfidence}%</strong></span>
              <input
                type="range"
                min="35"
                max="85"
                step="5"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-24 accent-teal-400 cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                checked={filterMineOnly}
                onChange={(e) => setFilterMineOnly(e.target.checked)}
                className="rounded accent-teal-500"
              />
              <span>Only show matches for my items ({currentUser.name.split(' ')[0]})</span>
            </label>
          </div>

          <div className="text-[11px] text-slate-400">
            Scanning {items.length} Chennai listings in real-time
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {displayedMatches.length > 0 ? (
        <div className="space-y-6">
          {displayedMatches.map((match) => {
            const isUserLostOwner = match.lostItem.userId === currentUser.id;
            const isUserFoundOwner = match.foundItem.userId === currentUser.id;

            return (
              <div
                key={match.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Match Header Bar */}
                <div className="bg-slate-900 px-6 py-3.5 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-xl font-black text-xs shadow flex items-center gap-1.5 ${
                      match.score >= 80
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300/40'
                        : match.score >= 60
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300/40'
                        : 'bg-indigo-400 text-slate-950'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match.score}% Match Relevance</span>
                    </span>

                    <span className="text-slate-300 font-semibold hidden sm:inline-block">
                      Level: <strong className="text-white">{match.matchLevel} Confidence</strong>
                    </span>

                    {(isUserLostOwner || isUserFoundOwner) && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        Affects Your Listing!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                    <span>📍 ~{match.distanceKm} km apart</span>
                    <span>•</span>
                    <span>📅 {match.dateDiffDays} days interval</span>
                  </div>
                </div>

                {/* Match Body: Side-by-Side Comparison */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Lost Item */}
                  <div className="md:col-span-5 bg-rose-50/40 rounded-2xl p-4 border border-rose-100 flex flex-col justify-between space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={match.lostItem.imageUrl}
                        alt={match.lostItem.title}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-rose-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                          LOST ITEM
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-1">
                          {match.lostItem.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          📍 {match.lostItem.area} • {match.lostItem.date}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 italic">
                          "{match.lostItem.locationDescription}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-rose-100 text-xs">
                      <span className="text-slate-500 text-[11px]">By {match.lostItem.userName}</span>
                      <button
                        type="button"
                        onClick={() => onSelectItem(match.lostItem)}
                        className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </div>
                  </div>

                  {/* Middle: Correlation Connector */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center text-center space-y-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm font-bold text-xs">
                      VS
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Comparison
                    </span>
                  </div>

                  {/* Right: Found Item */}
                  <div className="md:col-span-5 bg-teal-50/40 rounded-2xl p-4 border border-teal-100 flex flex-col justify-between space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={match.foundItem.imageUrl}
                        alt={match.foundItem.title}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-teal-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white">
                          FOUND ITEM
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-1">
                          {match.foundItem.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          📍 {match.foundItem.area} • {match.foundItem.date}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 italic">
                          "{match.foundItem.locationDescription}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-teal-100 text-xs">
                      <span className="text-slate-500 text-[11px]">By {match.foundItem.userName}</span>
                      <button
                        type="button"
                        onClick={() => onSelectItem(match.foundItem)}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </div>
                  </div>
                </div>

                {/* Match Reasoning & Action Bar */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Match Evidence:</span>
                    {match.reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => onOpenChat(match.foundItem)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-900/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact Other Party</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No Matches Above Current Confidence</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try sliding the confidence threshold lower to 40% to reveal looser geographical and keyword pairings.
            </p>
          </div>
          <button
            onClick={() => {
              setMinConfidence(40);
              setFilterMineOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Reset Confidence to 40%
          </button>
        </div>
      )}
    </div>
  );
};
