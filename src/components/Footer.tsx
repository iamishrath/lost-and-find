import React from 'react';
import { MapPin, Search, Shield, Heart, Phone, Mail, ExternalLink, Code } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabaseModal }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top Chennai Civic Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Chennai Citizen Protection Notice</h4>
              <p className="text-xs text-slate-400">
                Never pay money to claim belongings. Always inspect in safe public hubs (Metro stations or police booths).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-normal">Police Control: </span>
              <span className="text-teal-400 font-bold">100 / 112</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-normal">Cyber Helpline: </span>
              <span className="text-teal-400 font-bold">1930</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-normal">Railway RPF: </span>
              <span className="text-teal-400 font-bold">139</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base">Lost & Found Chennai</span>
                <p className="text-[11px] text-teal-400 font-medium">Lost Today, Found Together</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A community-driven digital lost and found platform serving the citizens of Chennai. Helping reunite lost belongings with transparent AI matching, verified maps, and safe handover points.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span>📍 Serving: </span>
              <span className="text-slate-300 font-medium">
                T. Nagar, Anna Nagar, Velachery, Guindy, Tambaram, Adyar, Central, OMR & all 15 Greater Chennai Corporation Zones.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lost')} className="hover:text-teal-400 transition-colors">
                  Browse Lost Items
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('found')} className="hover:text-teal-400 transition-colors">
                  Browse Found Items
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-teal-400 transition-colors">
                  Chennai Interactive Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('matches')} className="hover:text-teal-400 transition-colors">
                  AI-Powered Match Radar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-teal-400 transition-colors">
                  User Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Trust & Safety</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-teal-400 transition-colors">
                  5 Golden Rules of Safe Return
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-teal-400 transition-colors">
                  Recommended Chennai Police Meetup Hubs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-teal-400 transition-colors">
                  Avoid UPI / Courier Advance Scams
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors">
                  About Our Community Initiative
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors">
                  Contact Support & Report Grievance
                </button>
              </li>
            </ul>
          </div>

          {/* College Project & Technology */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Project & Stack</h3>
            <p className="text-xs text-slate-400">
              Developed as a 2nd Year Information Technology Demonstration Project with React, TypeScript, Supabase PostgreSQL, Tailwind CSS & OpenStreetMap / Google Maps integration.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSupabaseModal}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-teal-400" />
                <span>View Database Schema & SQL</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Chennai Civic Tech • Open & Free For All Citizens
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Lost & Found Chennai. All rights reserved. “Lost Today, Found Together.”</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('safety')} className="hover:text-teal-400">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('safety')} className="hover:text-teal-400">
              Citizen Terms
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-teal-400">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
