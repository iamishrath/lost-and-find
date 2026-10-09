import React, { useState, useMemo } from 'react';
import { Item, ItemType, ItemCategory, ChennaiArea } from '../types';
import { ItemCard } from '../components/ItemCard';
import { CHENNAI_AREAS, CATEGORY_METADATA } from '../data/chennaiLocations';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Tag, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface BrowseItemsViewProps {
  items: Item[];
  initialType?: ItemType | 'all';
  initialKeyword?: string;
  initialArea?: string;
  onSelectItem: (item: Item) => void;
  onContactUser: (item: Item) => void;
  onNavigate: (page: string) => void;
}

export const BrowseItemsView: React.FC<BrowseItemsViewProps> = ({
  items,
  initialType = 'all',
  initialKeyword = '',
  initialArea = 'all',
  onSelectItem,
  onContactUser,
  onNavigate,
}) => {
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>(initialType);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialKeyword);
  const [areaFilter, setAreaFilter] = useState<string>(initialArea);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Clear all filters
  const handleResetFilters = () => {
    setTypeFilter(initialType === 'all' ? 'all' : initialType);
    setSearchKeyword('');
    setAreaFilter('all');
    setCategoryFilter('all');
    setDateRange('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      // Area filter
      if (areaFilter !== 'all' && item.area !== areaFilter) return false;

      // Keyword search (title, description, area, landmark)
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesArea = item.area.toLowerCase().includes(query);
        const matchesSpot = item.locationDescription.toLowerCase().includes(query);
        const matchesMarks = item.identifyingMarks?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesSpot && !matchesMarks) {
          return false;
        }
      }

      // Date Range filter
      if (dateRange !== 'all') {
        const itemDate = new Date(item.date).getTime();
        const now = new Date().getTime();
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);

        if (dateRange === 'today' && diffDays > 1) return false;
        if (dateRange === '3days' && diffDays > 3) return false;
        if (dateRange === 'week' && diffDays > 7) return false;
        if (dateRange === 'month' && diffDays > 30) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [items, typeFilter, statusFilter, categoryFilter, areaFilter, searchKeyword, dateRange, sortBy]);

  const pageTitle =
    typeFilter === 'lost'
      ? 'Lost Belongings in Chennai'
      : typeFilter === 'found'
      ? 'Found Belongings in Chennai'
      : 'All Lost & Found Reports';

  const pageSubtitle =
    typeFilter === 'lost'
      ? 'Search for items misplaced or forgotten across Chennai'
      : typeFilter === 'found'
      ? 'Browse items safely recovered by good citizens awaiting their owners'
      : 'Browse and search through all reports across Greater Chennai';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white ${
                typeFilter === 'lost'
                  ? 'bg-rose-600'
                  : typeFilter === 'found'
                  ? 'bg-teal-600'
                  : 'bg-indigo-600'
              }`}
            >
              {typeFilter.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-medium">Chennai Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{pageTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{pageSubtitle}</p>
        </div>

        {/* Quick Report CTAs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('report-lost')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-900/20"
          >
            + Report Lost
          </button>
          <button
            type="button"
            onClick={() => onNavigate('report-found')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-900/20"
          >
            + Report Found
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by keywords (e.g. 'iPhone 14', 'leather wallet', 'Anna University', 'Activa key')..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Multi-facet Filter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* 1. Status Filter */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
          </div>

          {/* 2. Chennai Area */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Chennai Area</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">📍 All Chennai Hubs</option>
              {CHENNAI_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Category */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Date Range */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="3days">Past 3 Days</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>

          {/* 5. Listing Status */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active (Pending)</option>
              <option value="resolved">Reunited (Resolved)</option>
            </select>
          </div>

          {/* 6. Sort By */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter Summary bar */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>
            Found <strong className="text-slate-900">{filteredItems.length}</strong> matching report(s)
          </span>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Item Results Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onSelectItem}
              onContactUser={onContactUser}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No Items Match Your Filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try adjusting your search keywords, broadening your Chennai area selection, or resetting filters.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-150 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate(typeFilter === 'found' ? 'report-found' : 'report-lost')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              Post a New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
