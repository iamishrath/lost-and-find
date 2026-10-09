import React from 'react';
import { 
  MapPin, 
  Heart, 
  Code2, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  CheckCircle, 
  GraduationCap,
  Layers,
  Users
} from 'lucide-react';

interface AboutViewProps {
  onOpenSupabaseModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenSupabaseModal }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-teal-600" />
          <span>College IT Demonstration Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          About Lost & Found Chennai
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          “Lost Today, Found Together”
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-4">
        <h2 className="text-xl font-black text-slate-900">Our Civic Mission</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Every day, hundreds of students, commuters, shoppers, and office workers across Chennai inadvertently misplace critical personal belongings—from college ID cards at Guindy, metro passes at Central, to phones at Phoenix Marketcity or keys at Elliot's Beach.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong>Lost & Found Chennai</strong> was engineered as a community-driven digital public square designed to eliminate friction in recovering items. Through automated proximity matching, verified interactive maps, and private in-app messaging, we eliminate public phone number exposure and empower honest Chennai citizens to return items quickly and safely.
        </p>
      </section>

      {/* Technical Stack Breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Technical Architecture & Stack</h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for a second-year Information Technology demonstration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Frontend Engineering</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>React 19 + TypeScript SPA</li>
              <li>Tailwind CSS Modern Palette</li>
              <li>Lucide Icons & Framer Animations</li>
              <li>Zero-pill typographic hierarchy</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Supabase & PostgreSQL</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Supabase Authentication & RLS</li>
              <li>Relational PostgreSQL tables</li>
              <li>Image storage buckets</li>
              <li>Realtime in-app chat bus</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Intelligent Matching</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Jaccard Token Text Correlation</li>
              <li>Haversine Geo-distance Formula</li>
              <li>Temporal window bounds</li>
              <li>Category compatibility weights</li>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm">Want to inspect the SQL schema or test live connection?</h4>
            <p className="text-xs text-slate-300 mt-0.5">Explore our complete database migration and security policies.</p>
          </div>
          <button
            onClick={onOpenSupabaseModal}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex-shrink-0 transition-colors"
          >
            Open Supabase Manager
          </button>
        </div>
      </section>

      {/* College Project Credits */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-2">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Student Information Technology Project
        </p>
        <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
          Crafted with care for Chennai citizens. Demonstrates full-stack software development principles, UX accessibility, spatial mapping, and algorithmic correlation.
        </p>
      </section>
    </div>
  );
};
