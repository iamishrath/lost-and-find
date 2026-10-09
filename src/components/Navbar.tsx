import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  PlusCircle, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Database, 
  User, 
  LogOut, 
  ChevronDown,
  Info,
  CheckCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_USERS } from '../lib/supabase';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  unreadCount?: number;
  matchCount?: number;
  isSupabaseConnected: boolean;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onSwitchUser,
  unreadCount = 0,
  matchCount = 0,
  isSupabaseConnected,
  onOpenSupabaseModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'lost', label: 'Lost Items' },
    { id: 'found', label: 'Found Items' },
    { id: 'map', label: 'Interactive Map' },
    { 
      id: 'matches', 
      label: 'AI Matches', 
      badge: matchCount > 0 ? matchCount : null,
      badgeColor: 'bg-amber-500' 
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-teal-500' 
    },
    { id: 'safety', label: 'Safety Hub' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 px-4 py-1 text-center text-[11px] text-slate-300 border-b border-slate-800/80 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-teal-400">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
          <span>Chennai Community Lost & Found Network</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Safety Notice: Meet in public Chennai police or metro hubs. Never pay courier fees or share OTPs.</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              isSupabaseConnected 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                : 'bg-amber-950/80 text-amber-300 border border-amber-700/80 hover:bg-amber-900'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isSupabaseConnected ? 'Supabase Live' : 'Supabase Config / SQL'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              {/* Location pin with magnifying glass */}
              <div className="relative">
                <MapPin className="w-6 h-6 text-white stroke-[2.2]" />
                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-teal-400 shadow">
                  <Search className="w-3 h-3 text-teal-300 stroke-[3]" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  Lost & Found
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Chennai
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-wide">
                Lost Today, Found Together
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-teal-300 bg-slate-800/90 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${item.badgeColor} animate-pulse`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Report CTA dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Item</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {reportDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setReportDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setReportDropdownOpen(false);
                      onNavigate('report-lost');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-rose-950/40 hover:text-rose-300 text-xs text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <div>
                      <div className="font-bold text-rose-300">Report Lost Item</div>
                      <div className="text-[10px] text-slate-400">Search Chennai network</div>
                    </div>
                  </button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      setReportDropdownOpen(false);
                      onNavigate('report-found');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-teal-950/40 hover:text-teal-300 text-xs text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                    <div>
                      <div className="font-bold text-teal-300">Report Found Item</div>
                      <div className="text-[10px] text-slate-400">Reunite with owner</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Dashboard dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-400/50"
                />
                <div className="hidden md:block pr-1">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[90px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-400 leading-tight">
                    📍 {currentUser.area}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Verified Chennai Citizen
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-teal-400" />
                      <span>My Dashboard & Items</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('messages');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-teal-400" />
                      <span>In-App Messages</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('matches');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>AI Match Radar</span>
                    </button>
                  </div>

                  {/* Switch Demo User account for easy testing */}
                  <div className="pt-2 border-t border-slate-800">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Active Account:
                    </div>
                    {DEMO_USERS.map((usr) => (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => {
                          onSwitchUser(usr);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          usr.id === currentUser.id
                            ? 'bg-teal-950/60 text-teal-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img src={usr.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="truncate">{usr.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{usr.area}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('auth');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-rose-300 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Auth & Account Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('report-lost')}
              className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-xs font-semibold"
            >
              + Report
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                currentPage === item.id ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('report-lost');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center"
            >
              Report Lost
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('report-found');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center"
            >
              Report Found
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
              <div>
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-teal-400">📍 {currentUser.area}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-teal-400 underline font-medium"
            >
              Dashboard
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupabaseModal();
              }}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-2"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>Configure Supabase Backend & View SQL</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
