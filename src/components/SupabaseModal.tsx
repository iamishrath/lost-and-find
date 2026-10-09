import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, Key, Server, RefreshCw, X, Shield, FileText } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, resetDemoData } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'architecture'>('config');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, anonKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefreshData();
  };

  const sampleSql = `-- ==============================================================================
-- LOST & FOUND CHENNAI - SUPABASE POSTGRESQL SCHEMA
-- Tagline: "Lost Today, Found Together"
-- ==============================================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  area text default 'Chennai Central',
  avatar_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Items Table (Lost & Found in Chennai)
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('lost', 'found')) not null,
  title text not null,
  category text not null,
  description text not null,
  image_url text not null,
  date_occurred date not null,
  area text not null,
  location_description text not null,
  latitude double precision not null,
  longitude double precision not null,
  status text check (status in ('active', 'resolved')) default 'active' not null,
  reward text,
  verification_question text,
  contact_preference text default 'chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. In-App Private Chat Conversations
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  participant1_id uuid references public.profiles(id) on delete cascade not null,
  participant2_id uuid references public.profiles(id) on delete cascade not null,
  last_message text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. In-App Realtime Messages
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  is_verification_prompt boolean default false,
  is_resolved_notification boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Row Level Security Policies
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Public items are viewable" on public.items for select using (true);
create policy "Authenticated users can create items" on public.items for insert with check (auth.uid() = user_id);
create policy "Owners can update items" on public.items for update using (auth.uid() = user_id);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset local demo listings and conversations back to fresh Chennai seed state?')) {
      resetDemoData();
      onRefreshData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Supabase Backend & Architecture</h3>
              <p className="text-[11px] text-slate-400">Database Engine, RLS Policies & SQL Migrations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-lg leading-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-teal-400 text-teal-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Connection Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-teal-400 text-teal-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            PostgreSQL SQL Schema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-teal-400 text-teal-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            College Demonstration Guide
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-300 text-xs flex-1">
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/60 flex items-start gap-2.5 text-teal-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Zero-Breakage Dual Storage Engine:</strong> The application runs seamlessly out-of-the-box in local persistent mode with live reactive state across tabs. If you wish to bind to a cloud Supabase project, paste your credentials below.
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Supabase Anon Key (Public API Key)
                </label>
                <input
                  type="text"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono text-xs"
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Supabase credentials saved successfully!
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Seed Data</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20"
                >
                  Save Connection
                </button>
              </div>
            </form>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Execute this SQL in your Supabase SQL Editor to provision tables, foreign keys, and RLS policies:
                </p>
                <button
                  onClick={copySqlToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-300/90 overflow-x-auto max-h-64 leading-relaxed">
                {sampleSql}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3 leading-relaxed text-xs">
              <h4 className="font-bold text-white text-sm">College IT Project System Architecture:</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                <li>
                  <strong>Frontend Layer:</strong> React 19 + TypeScript + Tailwind CSS with responsive layout, custom Leaflet mapping, and real-time reactive event dispatchers.
                </li>
                <li>
                  <strong>Matching Engine (lib/matching.ts):</strong> Multi-factor algorithm evaluating lexical similarity, category cross-affinity, Haversine geo-distance across Chennai coordinates, and temporal windows.
                </li>
                <li>
                  <strong>Private Messaging:</strong> End-to-end masked messaging avoiding phone numbers or direct contact disclosure to deter extortion and fraud.
                </li>
                <li>
                  <strong>Database Schema (/supabase/schema.sql):</strong> Relational PostgreSQL schema with Row Level Security (RLS) restricting write access to authorized item owners.
                </li>
                <li>
                  <strong>Civic Safety:</strong> Integration of safe public meetup locations (Chennai Central RPF, T. Nagar R1 Police Station, Velachery Metro Station).
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
