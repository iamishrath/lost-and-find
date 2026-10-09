import React from 'react';
import { SAFE_MEETUP_LOCATIONS } from '../data/chennaiLocations';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Lock, 
  Eye, 
  UserCheck, 
  HelpCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const SafetyView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Safety Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Chennai Civic Safety Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Safety & Safe Return Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Essential protocols to protect yourself from scams, safeguard personal data, and ensure safe handovers in Chennai.
        </p>
      </div>

      {/* 5 Golden Rules of Safe Return */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
            5
          </span>
          <span>Golden Rules of Safe Handover</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>1. Meet Only in Monitored Public Places</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Never meet in secluded alleys, private residences, or hotel rooms. Choose high-visibility Chennai locations such as Metro customer booths, Railway RPF centers, or police station public desks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>2. Never Pay to Claim Your Own Property</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Lost & Found Chennai is 100% free. Any request demanding "courier advance fees", "token release deposit", or "fuel money" before meeting is a guaranteed scam.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600" />
              <span>3. Use Verification Questions</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Before handing over phones, wallets, or jewelry, ask for non-obvious details not visible in photos (e.g. lockscreen wallpaper, serial number suffix, inside pocket contents).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>4. Protect Personal Identifiers</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Never publish Aadhaar numbers, PAN cards, or debit card CVVs. If you find a document, obscure the key numbers in photos to protect the owner from identity theft.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 md:col-span-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>5. Bring a Friend During Handover</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              For high-value items (laptops, gold jewelry, expensive phones), bring a friend or family member along during daylight hours (9:00 AM – 6:00 PM).
            </p>
          </div>
        </div>
      </section>

      {/* Scammer Red Flags Warning */}
      <section className="bg-rose-50/70 border border-rose-200 rounded-3xl p-8 space-y-4 text-rose-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-rose-950">Watch Out for Common Scams in Chennai</h3>
            <p className="text-xs text-rose-800">Do not fall prey to fraudulent messages pretending to be finders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 space-y-1.5 shadow-2xs">
            <strong className="text-rose-900 font-bold block">1. The UPI "QR Code" Trap</strong>
            <p className="text-slate-600 leading-relaxed">
              Scammer sends a QR code claiming: "Scan this to receive your item delivery." Scanning a QR code or entering your UPI PIN DEDUCTS money from your account!
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 space-y-1.5 shadow-2xs">
            <strong className="text-rose-900 font-bold block">2. "I am Out of Station" Courier Scam</strong>
            <p className="text-slate-600 leading-relaxed">
              Scammer claims they traveled to Coimbatore or Madurai and asks for ₹800 courier charges via Google Pay. Refuse and request local police station drop-off instead.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 space-y-1.5 shadow-2xs">
            <strong className="text-rose-900 font-bold block">3. OTP Sharing Demands</strong>
            <p className="text-slate-600 leading-relaxed">
              Never share phone OTPs with anyone claiming to "verify" you on WhatsApp or phone calls. Legitimate handovers never require banking OTPs.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Chennai Safe Meetup Hubs */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Recommended Verified Meetup Hubs in Chennai
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Locations with 24x7 security personnel, active CCTV coverage, and easy transit access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAFE_MEETUP_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {loc.area}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{loc.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{loc.address}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {loc.timings}
                </span>
                <span className="font-semibold text-blue-700">
                  📞 {loc.contactNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
