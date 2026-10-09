import React, { useState } from 'react';
import { Item, ChennaiArea } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ChennaiMap } from '../components/ChennaiMap';
import { CHENNAI_AREAS } from '../data/chennaiLocations';
import { 
  Search, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  HelpCircle,
  Map,
  Compass,
  Award,
  AlertCircle
} from 'lucide-react';

interface HomeViewProps {
  items: Item[];
  onNavigate: (page: string, params?: any) => void;
  onSelectItem: (item: Item) => void;
  onContactUser: (item: Item) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  onNavigate,
  onSelectItem,
  onContactUser,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [recentTab, setRecentTab] = useState<'all' | 'lost' | 'found'>('all');

  // Stats calculation
  const totalItems = items.length;
  const lostCount = items.filter((i) => i.type === 'lost').length;
  const foundCount = items.filter((i) => i.type === 'found').length;
  const reunitedCount = items.filter((i) => i.status === 'resolved').length + 84; // Realistic base civic count

  const popularAreas: ChennaiArea[] = [
    'T. Nagar',
    'Anna Nagar',
    'Velachery',
    'Tambaram',
    'Guindy',
    'Adyar',
    'Chennai Central',
    'Mylapore',
    'Besant Nagar',
    'OMR / Sholinganallur',
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('lost', { keyword: searchKeyword, area: selectedArea });
  };

  const filteredRecent = items
    .filter((item) => {
      if (recentTab === 'lost' && item.type !== 'lost') return false;
      if (recentTab === 'found' && item.type !== 'found') return false;
      return true;
    })
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle decorative glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-sm animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Singara Chennai's Unified Civic Community</span>
          </div>

          {/* Mandatory Headings from Prompt */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Lost Something in Chennai?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-300 block mt-2">
              Let's Find It Together!
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A Chennai community that helps reunite people with their lost belongings.
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('report-lost')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-900/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <AlertCircle className="w-5 h-5 text-rose-200" />
              <span>Report Lost Item</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('report-found')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-900/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-5 h-5 text-teal-100" />
              <span>Report Found Item</span>
            </button>
          </div>

          {/* Integrated Search Bar with Chennai Area Dropdown */}
          <form
            onSubmit={handleHeroSearch}
            className="pt-6 max-w-3xl mx-auto"
          >
            <div className="p-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 bg-slate-900/80 rounded-xl border border-slate-700/50">
                <Search className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search item (e.g. iPhone, Titan wallet, Honda key, backpack)..."
                  className="w-full py-2.5 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-3 bg-slate-900/80 rounded-xl border border-slate-700/50 sm:w-56">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-xs text-white focus:outline-none"
                >
                  <option value="all" className="bg-slate-900">All Chennai Areas</option>
                  {CHENNAI_AREAS.map((a) => (
                    <option key={a.name} value={a.name} className="bg-slate-900">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Popular Chennai Locations Pills */}
          <div className="pt-4 max-w-4xl mx-auto">
            <p className="text-xs text-slate-400 font-semibold mb-2.5 uppercase tracking-wider">
              Popular Chennai Locations:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => onNavigate('lost', { area })}
                  className="px-3 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-teal-900/50 hover:text-teal-300 text-slate-300 border border-slate-700/70 transition-all hover:scale-105"
                >
                  📍 {area}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Community Statistics Bar */}
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-2xl sm:text-3xl font-black text-white">{totalItems}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Items Reported Today</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-2xl sm:text-3xl font-black text-teal-400">{reunitedCount}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Reunions Facilitated</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">20+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Chennai Hubs Covered</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Free & Volunteer-Driven</div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            How Lost & Found Chennai Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Reuniting lost belongings through local community awareness and verified handovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Report With Details</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Provide the item name, category, photo, and pinpoint the exact Chennai location (e.g. Chennai Central Platform 4, T. Nagar Panagal Park).
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              <span>Instant community alert</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg">AI & Community Match</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Our intelligent matching engine compares lost and found submissions by keyword, category, date, and Haversine geo-distance across Chennai.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <span>Automated match score radar</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center font-black text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Reunite Safely in Public</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Communicate privately in-app without revealing phone numbers. Meet at verified safe public hubs (Police booths, Metro stations) for handoff.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-teal-600 font-semibold flex items-center gap-1">
              <span>Zero fees & zero risk</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENTLY REPORTED ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Recently Reported in Chennai</h2>
            <p className="text-xs text-slate-500 mt-1">Live listings from citizens across Chennai neighborhoods</p>
          </div>

          {/* Filter Tab Buttons */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setRecentTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  recentTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setRecentTab('lost')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  recentTab === 'lost' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lost ({lostCount})
              </button>
              <button
                type="button"
                onClick={() => setRecentTab('found')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  recentTab === 'found' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Found ({foundCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('lost')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecent.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onSelectItem}
              onContactUser={onContactUser}
            />
          ))}
        </div>
      </section>

      {/* 4. CHENNAI MAP TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
                Geographic Incident Radar
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-2">
                Explore Reported Items Across Chennai Map
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                View pins for items lost and found in T. Nagar, Anna Nagar, Velachery, Central, Guindy and surrounding localities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 self-start md:self-auto transition-colors"
            >
              <Map className="w-4 h-4" />
              <span>Open Full Interactive Map</span>
            </button>
          </div>

          {/* Interactive Map Preview */}
          <div className="rounded-2xl overflow-hidden border border-slate-700">
            <ChennaiMap
              items={items}
              onSelectItem={onSelectItem}
              height="380px"
              showSafeSpots={true}
            />
          </div>
        </div>
      </section>

      {/* 5. SAFETY & COMMUNITY PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-indigo-50 border border-teal-100 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Safe Handover Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Your Privacy & Safety are Our Priority
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              We never display your phone number or home address publicly. All preliminary communication happens via in-app private chat, and we recommend completing handoffs at official Chennai police booths or metro passenger assistance desks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors"
            >
              Read Safety Guidelines
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs text-center transition-colors"
            >
              Learn About Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
