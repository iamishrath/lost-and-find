import React from 'react';
import { Item } from '../types';
import { CATEGORY_METADATA } from '../data/chennaiLocations';
import { 
  MapPin, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Gift, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onViewDetails: (item: Item) => void;
  onContactUser?: (item: Item) => void;
  matchScore?: number;
  highlightReason?: string;
  isOwner?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onViewDetails,
  onContactUser,
  matchScore,
  highlightReason,
  isOwner = false,
}) => {
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';
  const categoryMeta = CATEGORY_METADATA[item.category] || CATEGORY_METADATA.other;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col hover:shadow-xl hover:-translate-y-1 ${
      matchScore 
        ? 'border-amber-400/80 ring-2 ring-amber-400/20' 
        : isLost 
          ? 'border-slate-200/90 hover:border-rose-300' 
          : 'border-slate-200/90 hover:border-teal-300'
    } ${isResolved ? 'opacity-75 grayscale-[20%]' : ''}`}>
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status & Type Pills */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md flex items-center gap-1 ${
            isLost ? 'bg-rose-600' : 'bg-teal-600'
          }`}>
            {isLost ? (
              <>
                <AlertCircle className="w-3 h-3" /> LOST
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" /> FOUND
              </>
            )}
          </span>

          {isResolved && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 text-white backdrop-blur-sm shadow flex items-center gap-1">
              ✓ Reunited
            </span>
          )}
        </div>

        {/* Category Pill Top Right */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-md backdrop-blur-sm border border-slate-100 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-500" />
            {categoryMeta.label.split('&')[0].trim()}
          </span>
        </div>

        {/* Match Score Badge (if passed) */}
        {matchScore !== undefined && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-xl text-xs font-black text-white shadow-lg backdrop-blur-md flex items-center gap-1.5 ${
              matchScore >= 80 
                ? 'bg-emerald-600 ring-2 ring-emerald-300' 
                : matchScore >= 60 
                  ? 'bg-amber-600 ring-2 ring-amber-300' 
                  : 'bg-indigo-600'
            }`}>
              ★ {matchScore}% AI Match
            </span>
          </div>
        )}

        {/* Reward Pill (if present on lost item) */}
        {item.reward && isLost && !isResolved && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500 text-slate-950 shadow flex items-center gap-1">
              <Gift className="w-3 h-3" /> Reward Offered
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Date Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2">
            <span className="flex items-center gap-1 font-semibold text-slate-700 truncate">
              <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="truncate">{item.area}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] flex-shrink-0 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {item.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-teal-700 transition-colors">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {item.description}
          </p>

          {/* Location description / landmark */}
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate">
            <span className="font-medium text-slate-700">Spot:</span>
            <span className="truncate">{item.locationDescription}</span>
          </div>

          {/* Reason highlight (for match screens) */}
          {highlightReason && (
            <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 p-1.5 rounded-lg font-medium">
              ✨ {highlightReason}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 truncate">
            {isOwner ? (
              <span className="font-semibold text-teal-700">Your Listing</span>
            ) : (
              <span>Reported by <strong className="text-slate-700">{item.userName.split(' ')[0]}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onContactUser && !isOwner && !isResolved && (
              <button
                type="button"
                onClick={() => onContactUser(item)}
                title="Send secure in-app message"
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onViewDetails(item)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
