import React, { useState } from 'react';
import { Item, ChennaiArea } from '../types';
import { ChennaiMap } from '../components/ChennaiMap';
import { CHENNAI_AREAS, SAFE_MEETUP_LOCATIONS } from '../data/chennaiLocations';
import { MapPin, Shield, Layers, Filter, Compass, AlertCircle, CheckCircle2, Eye, Info } from 'lucide-react';

interface InteractiveMapViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onNavigate: (page: string) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  items,
  onSelectItem,
  onNavigate,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const lostCount = items.filter((i) => i.type === 'lost').length;
  const foundCount = items.filter((i) => i.type === 'found').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-800 border border-teal-500/30">
              Chennai Geospatial Radar
            </span>
            <span className="text-xs text-slate-500 font-medium">All 15 GCC Zones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Interactive Chennai Lost & Found Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explore reported locations across T. Nagar, Central, Anna Nagar, Velachery, Guindy, Tambaram, Adyar & OMR.
          </p>
        </div>

        {/* Legend metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>{lostCount} Lost Pins</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <span>{foundCount} Found Pins</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>{SAFE_MEETUP_LOCATIONS.length} Safe Hubs</span>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-950">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            <strong>Civic Privacy Guarantee:</strong> Coordinates on this map reflect approximate public spots (bus shelters, metro concourses, mall foyers) and never private home residences.
          </span>
        </div>
        <button
          onClick={() => onNavigate('safety')}
          className="text-blue-700 underline font-semibold flex-shrink-0"
        >
          Safety Guidelines
        </button>
      </div>

      {/* Big Map Canvas */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
        <ChennaiMap
          items={items}
          selectedItem={selectedItem}
          onSelectItem={(item) => {
            setSelectedItem(item);
            onSelectItem(item);
          }}
          height="620px"
          showSafeSpots={true}
        />
      </div>
    </div>
  );
};
