import React, { useState } from 'react';
import { Item, ItemType, ItemCategory, ChennaiArea, Coordinates, UserProfile, MatchResult } from '../types';
import { CHENNAI_AREAS, CATEGORY_METADATA, CHENNAI_CENTER } from '../data/chennaiLocations';
import { ChennaiMap } from '../components/ChennaiMap';
import { saveItem } from '../lib/supabase';
import { findMatchesForItem } from '../lib/matching';
import { 
  AlertCircle, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Calendar, 
  Tag, 
  FileText, 
  Gift, 
  HelpCircle, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportItemViewProps {
  initialType?: ItemType;
  currentUser: UserProfile;
  allItems: Item[];
  onSubmitSuccess: (newItem: Item, matches: MatchResult[]) => void;
  onNavigate: (page: string) => void;
}

// Preset photo options by category for instant testing
const SAMPLE_IMAGE_PRESETS: Record<ItemCategory, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02543?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
  ],
  wallets: [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556774687-0e2fdd0116c0?auto=format&fit=crop&w=800&q=80',
  ],
  keys: [
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609147576596-f947a7605d3b?auto=format&fit=crop&w=800&q=80',
  ],
  documents: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  ],
  jewellery: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
  ],
  bags: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80',
  ],
  pets: [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  ],
  vehicles: [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  ],
  other: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  ],
};

export const ReportItemView: React.FC<ReportItemViewProps> = ({
  initialType = 'lost',
  currentUser,
  allItems,
  onSubmitSuccess,
  onNavigate,
}) => {
  const [reportType, setReportType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_IMAGE_PRESETS.electronics[0]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [area, setArea] = useState<ChennaiArea>('T. Nagar');
  const [locationDescription, setLocationDescription] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 13.0418, lng: 80.2341 }); // T. Nagar default
  const [reward, setReward] = useState('');
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [identifyingMarks, setIdentifyingMarks] = useState('');

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<Item | null>(null);
  const [detectedMatches, setDetectedMatches] = useState<MatchResult[]>([]);

  // Update image when category changes if using default preset
  const handleCategoryChange = (newCat: ItemCategory) => {
    setCategory(newCat);
    const presets = SAMPLE_IMAGE_PRESETS[newCat] || SAMPLE_IMAGE_PRESETS.other;
    setImageUrl(presets[0]);
  };

  // Update coordinates when area changes
  const handleAreaChange = (newArea: ChennaiArea) => {
    setArea(newArea);
    const found = CHENNAI_AREAS.find((a) => a.name === newArea);
    if (found) {
      setCoordinates(found.coordinates);
    }
  };

  // File upload reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Please enter a clear item title';
    if (!description.trim() || description.length < 15) {
      newErrors.description = 'Please provide at least 15 characters of description';
    }
    if (!locationDescription.trim()) {
      newErrors.locationDescription = 'Please describe the specific spot (e.g. Near Food Court, Platform 4)';
    }
    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Please provide or select an image for this item';
    }
    if (!date) {
      newErrors.date = 'Please select the date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save item to persistent store
      const newItem = saveItem({
        type: reportType,
        title: title.trim(),
        category,
        description: description.trim(),
        imageUrl,
        date,
        area,
        locationDescription: locationDescription.trim(),
        coordinates,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        reward: reportType === 'lost' && reward.trim() ? reward.trim() : undefined,
        verificationQuestion:
          reportType === 'found' && verificationQuestion.trim()
            ? verificationQuestion.trim()
            : undefined,
        identifyingMarks: identifyingMarks.trim() || undefined,
        contactPreference: 'chat',
      });

      // Run real AI / algorithmic matching immediately!
      const matches = findMatchesForItem(newItem, allItems);
      setDetectedMatches(matches);
      setSubmittedItem(newItem);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      onSubmitSuccess(newItem, matches);
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already submitted, display success card with instant matches
  if (submittedItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Listing Active in Chennai Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              Your {submittedItem.type.toUpperCase()} report for{' '}
              <strong className="text-slate-900">{submittedItem.title}</strong> is now live across
              the Chennai community.
            </p>
          </div>

          {/* Instant Matches Alert */}
          {detectedMatches.length > 0 ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-left space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
                <span>
                  Possible Match Found! ({detectedMatches[0].score}% Match Score)
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Our algorithm detected {detectedMatches.length} existing{' '}
                {submittedItem.type === 'lost' ? 'FOUND' : 'LOST'} listing(s) that closely match
                your item attributes, location, and date!
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('matches')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <span>Inspect Possible Matches</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              💡 No exact matches yet. We are actively monitoring new Chennai submissions and will alert you the moment a match appears.
            </div>
          )}

          {/* Navigation options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate(submittedItem.type === 'lost' ? 'lost' : 'found')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              View in {submittedItem.type === 'lost' ? 'Lost Items' : 'Found Items'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmittedItem(null);
                setTitle('');
                setDescription('');
                setLocationDescription('');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
            >
              Report Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Toggle */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-black text-slate-900">
          Report an Item in Chennai
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Provide accurate details to help reunite belongings with their rightful owners.
        </p>

        {/* Big Switcher Tabs: Lost vs Found */}
        <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 inline-flex shadow-inner max-w-sm w-full">
          <button
            type="button"
            onClick={() => setReportType('lost')}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              reportType === 'lost'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>I Lost an Item</span>
          </button>
          <button
            type="button"
            onClick={() => setReportType('found')}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              reportType === 'found'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Found an Item</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Form banner notice */}
        <div className={`p-4 text-xs font-medium flex items-center justify-between gap-3 text-white ${
          reportType === 'lost' ? 'bg-gradient-to-r from-rose-700 to-rose-600' : 'bg-gradient-to-r from-teal-700 to-teal-600'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              {reportType === 'lost'
                ? 'Tip: Describe distinctive scratches or stickers so the finder can verify ownership.'
                : 'Tip: Withhold one secret identifier (e.g. lockscreen wallpaper, exact engraving) to test claimants.'}
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold uppercase">
            Singara Chennai
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* 1. Item Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  reportType === 'lost'
                    ? "e.g. Apple iPhone 14 (Midnight Blue, 128GB)"
                    : "e.g. Blue Apple smartphone in transparent case"
                }
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.title ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ItemCategory)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, brand, condition, unique marks, contents inside bag/wallet, etc."
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.description ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* 3. Photo Upload & Preset Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Item Photo *
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview */}
              <div className="w-32 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Item Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200">
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-500">or choose from presets below:</span>
                </div>

                {/* Preset image buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(SAMPLE_IMAGE_PRESETS[category] || []).map((presetUrl, idx) => (
                    <button
                      key={presetUrl}
                      type="button"
                      onClick={() => setImageUrl(presetUrl)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        imageUrl === presetUrl
                          ? 'border-teal-500 ring-2 ring-teal-500/30'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {errors.imageUrl && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.imageUrl}</p>
            )}
          </div>

          {/* 4. Date & Chennai Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {reportType === 'lost' ? 'Date Lost *' : 'Date Found *'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {errors.date && <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Chennai Area / Neighborhood *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={area}
                  onChange={(e) => handleAreaChange(e.target.value as ChennaiArea)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  {CHENNAI_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.landmark.split('&')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 5. Specific Location Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Specific Public Location & Landmark *
            </label>
            <input
              type="text"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              placeholder="e.g. Near Phoenix Marketcity Food Court 2nd floor, or Platform 4 Waiting Room bench"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.locationDescription ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
              }`}
            />
            {errors.locationDescription && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.locationDescription}</p>
            )}
          </div>

          {/* 6. Interactive Chennai Map Pin Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pin Location on Chennai Map
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <ChennaiMap
                pickerMode={true}
                selectedCoordinates={coordinates}
                onCoordinatesChange={(coords, guessedArea) => {
                  setCoordinates(coords);
                  if (guessedArea) setArea(guessedArea);
                }}
                height="320px"
                initialArea={area}
              />
            </div>
          </div>

          {/* 7. Special Fields: Verification Question or Reward */}
          {reportType === 'found' ? (
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>Verification Question for Claimant (Recommended)</span>
              </div>
              <input
                type="text"
                value={verificationQuestion}
                onChange={(e) => setVerificationQuestion(e.target.value)}
                placeholder="e.g. What picture is on the lockscreen wallpaper? / What name is inside?"
                className="w-full px-4 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-teal-700">
                The person claiming this item must answer this question in private chat before handoff.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Optional Token Reward / Gratitude</span>
              </div>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="e.g. ₹1,000 & Hot Filter Coffee treat / Handwritten thanks"
                className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-amber-700">
                Optional gesture of gratitude to encourage good Samaritan returns.
              </p>
            </div>
          )}

          {/* 8. Citizen Safety Pledge Checkbox */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
            <input
              type="checkbox"
              id="safety-pledge"
              defaultChecked
              required
              className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <label htmlFor="safety-pledge" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              I agree to adhere to Chennai Civic Safety Rules: I will not share bank credentials, UPI OTPs, or demand unverified courier fees. Any physical return will be conducted in a safe, monitored public location in Chennai.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 rounded-xl bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl text-white font-bold text-xs tracking-wide shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${
                reportType === 'lost'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/25'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-900/25'
              } ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting & Scanning Matches...' : `Submit ${reportType.toUpperCase()} Report`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
