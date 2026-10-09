import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Building,
  Train,
  Bus
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Phone className="w-4 h-4 text-teal-600" />
          <span>Support & Official Helplines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Contact Us & Chennai Civic Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Reach our moderation team or contact official Chennai authorities for valuable lost property.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Chennai Helplines */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Official Chennai Lost Property Contacts
          </h2>
          <p className="text-xs text-slate-500">
            If you lost government IDs, passport, or expensive electronics in transit, contact these authorities immediately:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                <span>Greater Chennai Police (Control Room)</span>
              </div>
              <p className="text-slate-600">Commissioner Office, Vepery, Chennai</p>
              <div className="pt-1 text-teal-700 font-bold">📞 100 / 112 • 044-23452359</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Tamil Nadu Cyber Crime Police</span>
              </div>
              <p className="text-slate-600">For phone blocking, CEIR registration & online fraud</p>
              <div className="pt-1 text-indigo-700 font-bold">📞 Helpline: 1930</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Train className="w-4 h-4 text-blue-600" />
                <span>Railway Protection Force (RPF) Chennai</span>
              </div>
              <p className="text-slate-600">Chennai Central & Egmore Railway Stations</p>
              <div className="pt-1 text-blue-700 font-bold">📞 139 • 044-25353545</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>MTC Chennai City Bus Lost Property</span>
              </div>
              <p className="text-slate-600">Pallavan House, Anna Salai, Chennai 600002</p>
              <div className="pt-1 text-amber-700 font-bold">📞 044-23455801</div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-black text-slate-900 text-xl">Send Us a Message</h3>
            <p className="text-xs text-slate-500 mt-1">
              Have questions, feedback, or need help removing an accidental duplicate listing?
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-teal-50 rounded-2xl border border-teal-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h4>
              <p className="text-xs text-slate-600">
                Thank you for contacting Lost & Found Chennai. Our team will review your query within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Raja"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. karthik.it@chennai.edu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Query regarding listing in Velachery"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
