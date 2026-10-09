import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Item, ItemType, ItemCategory, ChennaiArea, Coordinates } from '../types';
import { CHENNAI_CENTER, CHENNAI_AREAS, SAFE_MEETUP_LOCATIONS } from '../data/chennaiLocations';
import { MapPin, Navigation, Shield, Layers, Filter, Compass, AlertCircle, CheckCircle2, Eye } from 'lucide-react';

interface ChennaiMapProps {
  items?: Item[];
  selectedItem?: Item | null;
  onSelectItem?: (item: Item) => void;
  // Picker mode props
  pickerMode?: boolean;
  selectedCoordinates?: Coordinates;
  onCoordinatesChange?: (coords: Coordinates, areaGuess?: ChennaiArea) => void;
  height?: string;
  initialArea?: ChennaiArea;
  showSafeSpots?: boolean;
}

export const ChennaiMap: React.FC<ChennaiMapProps> = ({
  items = [],
  selectedItem = null,
  onSelectItem,
  pickerMode = false,
  selectedCoordinates,
  onCoordinatesChange,
  height = '500px',
  initialArea,
  showSafeSpots = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [showMeetupSpots, setShowMeetupSpots] = useState(showSafeSpots);
  const [activeItemPopup, setActiveItemPopup] = useState<Item | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCoords = selectedCoordinates || CHENNAI_CENTER;
      const map = L.map(mapContainerRef.current, {
        center: [initialCoords.lat, initialCoords.lng],
        zoom: pickerMode ? 14 : 12,
        zoomControl: false,
      });

      // Add high-resolution standard CartoDB / OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://openstreetmap.org">OSM</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Click handler for picker mode
      if (pickerMode) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          // Find closest Chennai area
          let closestArea: ChennaiArea = 'Chennai Central';
          let minDistance = 999999;
          CHENNAI_AREAS.forEach((a) => {
            const dist = Math.hypot(a.coordinates.lat - lat, a.coordinates.lng - lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestArea = a.name;
            }
          });

          if (onCoordinatesChange) {
            onCoordinatesChange({ lat, lng }, closestArea);
          }
        });
      }
    }

    return () => {
      // Map cleanup if needed on unmount
    };
  }, [pickerMode]);

  // Handle initialArea changes
  useEffect(() => {
    if (initialArea && mapInstanceRef.current) {
      const areaObj = CHENNAI_AREAS.find((a) => a.name === initialArea);
      if (areaObj) {
        mapInstanceRef.current.setView([areaObj.coordinates.lat, areaObj.coordinates.lng], 14, {
          animate: true,
        });
      }
    }
  }, [initialArea]);

  // Handle Picker Mode Pin updates
  useEffect(() => {
    if (!pickerMode || !mapInstanceRef.current) return;

    const coords = selectedCoordinates || CHENNAI_CENTER;

    if (!pickerMarkerRef.current) {
      const pickerIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-teal-600 text-white shadow-xl flex items-center justify-center border-3 border-white ring-4 ring-teal-500/30 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="absolute -bottom-1 w-3 h-1.5 bg-black/40 rounded-full blur-[1px]"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      pickerMarkerRef.current = L.marker([coords.lat, coords.lng], {
        icon: pickerIcon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      pickerMarkerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        if (onCoordinatesChange) {
          onCoordinatesChange({ lat: position.lat, lng: position.lng });
        }
      });
    } else {
      pickerMarkerRef.current.setLatLng([coords.lat, coords.lng]);
    }
  }, [pickerMode, selectedCoordinates, onCoordinatesChange]);

  // Update Markers for items & safe spots
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current || pickerMode) return;

    markersLayerRef.current.clearLayers();

    // Filter items
    const filteredItems = items.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (filterArea !== 'all' && item.area !== filterArea) return false;
      return true;
    });

    // 1. Add Safe Meetup Spots
    if (showMeetupSpots) {
      SAFE_MEETUP_LOCATIONS.forEach((safe) => {
        const safeIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div class="relative group cursor-pointer" title="${safe.name} (Verified Safe Meetup Hub)">
              <div class="w-8 h-8 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center border-2 border-white ring-2 ring-blue-400/40 hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([safe.coordinates.lat, safe.coordinates.lng], { icon: safeIcon });
        marker.bindPopup(`
          <div class="p-2 font-sans max-w-xs">
            <div class="flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Verified Safe Meetup Spot
            </div>
            <h4 class="font-bold text-slate-900 text-sm leading-tight">${safe.name}</h4>
            <p class="text-xs text-slate-600 mt-1">${safe.address}</p>
            <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>🕒 ${safe.timings}</span>
              <span class="font-medium text-blue-600">📞 ${safe.contactNumber}</span>
            </div>
            <p class="mt-1 text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded">💡 ${safe.recommendationReason}</p>
          </div>
        `);
        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Add Lost and Found Items
    filteredItems.forEach((item) => {
      const isLost = item.type === 'lost';
      const isSelected = selectedItem?.id === item.id;

      const markerHtml = `
        <div class="relative cursor-pointer group">
          <div class="w-9 h-9 rounded-full ${
            isLost
              ? 'bg-rose-600 ring-rose-300'
              : 'bg-teal-600 ring-teal-300'
          } ${isSelected ? 'scale-125 ring-4' : 'hover:scale-110'} text-white shadow-xl flex items-center justify-center border-2 border-white ring-2 transition-transform">
            ${
              isLost
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`
            }
          </div>
          <div class="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm ${
            isLost ? 'bg-rose-800' : 'bg-teal-800'
          }">
            ${isLost ? 'LOST' : 'FOUND'}
          </div>
        </div>
      `;

      const itemIcon = L.divIcon({
        className: 'custom-map-pin',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: itemIcon });

      marker.on('click', () => {
        setActiveItemPopup(item);
        if (onSelectItem) {
          onSelectItem(item);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [items, selectedItem, filterType, filterCategory, filterArea, showMeetupSpots, pickerMode, onSelectItem]);

  // Center on Chennai
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([CHENNAI_CENTER.lat, CHENNAI_CENTER.lng], 12, { animate: true });
    }
  };

  // Center on user selected area
  const handleAreaSelect = (areaName: string) => {
    setFilterArea(areaName);
    if (areaName === 'all') {
      handleRecenter();
      return;
    }
    const areaObj = CHENNAI_AREAS.find((a) => a.name === areaName);
    if (areaObj && mapInstanceRef.current) {
      mapInstanceRef.current.setView([areaObj.coordinates.lat, areaObj.coordinates.lng], 14, {
        animate: true,
      });
      if (pickerMode && onCoordinatesChange) {
        onCoordinatesChange(areaObj.coordinates, areaObj.name);
      }
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
      {/* Controls Header for Browsing Mode */}
      {!pickerMode && (
        <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> Filter Map:
            </span>

            {/* Type toggle */}
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterType === 'all' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                All Items
              </button>
              <button
                type="button"
                onClick={() => setFilterType('lost')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterType === 'lost' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Lost Items
              </button>
              <button
                type="button"
                onClick={() => setFilterType('found')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterType === 'found' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Found Items
              </button>
            </div>

            {/* Area filter */}
            <select
              value={filterArea}
              onChange={(e) => handleAreaSelect(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">📍 All Chennai Hubs</option>
              {CHENNAI_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Safe Spots Toggle */}
            <button
              type="button"
              onClick={() => setShowMeetupSpots(!showMeetupSpots)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                showMeetupSpots
                  ? 'bg-blue-900/60 text-blue-200 border-blue-600'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Safe Meetup Hubs</span>
            </button>

            {/* Recenter */}
            <button
              type="button"
              onClick={handleRecenter}
              title="Recenter on Chennai Central"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <Compass className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      )}

      {/* Picker Mode Instruction Bar */}
      {pickerMode && (
        <div className="p-3 bg-teal-50 border-b border-teal-100 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 animate-pulse" />
            <span className="font-medium">
              Click anywhere on the Chennai map or drag the pin to set the exact spot where the item was lost/found.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Quick Jump:</span>
            <select
              onChange={(e) => handleAreaSelect(e.target.value)}
              className="bg-white border border-teal-200 text-teal-950 rounded px-2 py-0.5 text-xs font-medium"
            >
              <option value="">Select Chennai Area</option>
              {CHENNAI_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-md border border-slate-200 text-[11px] text-slate-700 flex flex-col gap-1 pointer-events-auto">
        <div className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-0.5">Legend</div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
          <span>Lost Item Report</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
          <span>Found Item Report</span>
        </div>
        {showMeetupSpots && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            <span>Verified Police/Metro Safe Hub</span>
          </div>
        )}
      </div>

      {/* Selected Item Drawer / Card Overlay when marker is clicked */}
      {activeItemPopup && !pickerMode && (
        <div className="absolute bottom-3 right-3 z-[400] max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                  activeItemPopup.type === 'lost' ? 'bg-rose-600' : 'bg-teal-600'
                }`}
              >
                {activeItemPopup.type}
              </span>
              <span className="text-xs text-slate-500 font-medium">📍 {activeItemPopup.area}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveItemPopup(null)}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 leading-none"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <img
              src={activeItemPopup.imageUrl}
              alt={activeItemPopup.title}
              className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">{activeItemPopup.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{activeItemPopup.locationDescription}</p>
              <div className="mt-1 text-[11px] text-slate-500">📅 {activeItemPopup.date}</div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">By {activeItemPopup.userName}</span>
            {onSelectItem && (
              <button
                type="button"
                onClick={() => {
                  onSelectItem(activeItemPopup);
                  setActiveItemPopup(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Details
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
