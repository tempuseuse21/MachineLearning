import React, { useState } from 'react';
import axios from 'axios';

// ─── Field definitions ─────────────────────────────────────────────────────
const FIELDS = [
  {
    key: 'city', label: 'City', type: 'select', group: 'location',
    icon: '📍',
    options: ['NYC','LA','SF','DC','Chicago','Boston','Austin','Seattle','Denver','Miami'],
  },
  {
    key: 'property_type', label: 'Property Type', type: 'select', group: 'property',
    icon: '🏠',
    options: ['Apartment','House','Condominium','Townhouse','Loft','Villa',
              'Guest suite','Bed and breakfast','Bungalow','Cabin','Hostel','Hotel','Other'],
  },
  {
    key: 'room_type', label: 'Room Type', type: 'select', group: 'property',
    icon: '🛏️',
    options: ['Entire home/apt','Private room','Shared room'],
  },
  {
    key: 'bed_type', label: 'Bed Type', type: 'select', group: 'property',
    icon: '🛌',
    options: ['Real Bed','Pull-out Sofa','Airbed','Couch','Futon'],
  },
  {
    key: 'accommodates', label: 'Accommodates (guests)', type: 'number', group: 'capacity',
    icon: '👥', min: 1, max: 16, default: 2,
  },
  {
    key: 'bedrooms', label: 'Bedrooms', type: 'number', group: 'capacity',
    icon: '🏠', min: 0, max: 10, default: 1,
  },
  {
    key: 'beds', label: 'Beds', type: 'number', group: 'capacity',
    icon: '🛏️', min: 0, max: 16, default: 1,
  },
  {
    key: 'bathrooms', label: 'Bathrooms', type: 'number', group: 'capacity',
    icon: '🚿', min: 0, max: 10, step: 0.5, default: 1,
  },
  {
    key: 'amenities_count', label: 'Number of Amenities', type: 'number', group: 'amenities',
    icon: '✨', min: 0, max: 100, default: 15,
  },
  {
    key: 'cleaning_fee', label: 'Cleaning Fee Charged?', type: 'select', group: 'pricing',
    icon: '🧹', options: ['True','False'],
  },
  {
    key: 'cancellation_policy', label: 'Cancellation Policy', type: 'select', group: 'policy',
    icon: '📋',
    options: ['flexible','moderate','strict','super_strict_30','super_strict_60'],
  },
  {
    key: 'instant_bookable', label: 'Instant Bookable?', type: 'select', group: 'policy',
    icon: '⚡', options: ['True','False'],
  },
  {
    key: 'host_has_profile_pic', label: 'Host Has Profile Picture?', type: 'select', group: 'host',
    icon: '📸', options: ['True','False'],
  },
  {
    key: 'host_identity_verified', label: 'Host Identity Verified?', type: 'select', group: 'host',
    icon: '✅', options: ['True','False'],
  },
  {
    key: 'host_response_rate', label: 'Host Response Rate (%)', type: 'number', group: 'host',
    icon: '💬', min: 0, max: 100, default: 90,
  },
  {
    key: 'host_since', label: 'Host Since (year)', type: 'select', group: 'host',
    icon: '📅', options: Array.from({length: 17}, (_, i) => (2008+i).toString()).reverse(),
  },
  {
    key: 'first_review', label: 'First Review Year', type: 'select', group: 'reviews',
    icon: '⭐', options: Array.from({length: 25}, (_, i) => (2000+i).toString()).reverse(),
  },
  {
    key: 'last_review', label: 'Last Review Year', type: 'select', group: 'reviews',
    icon: '📆', options: Array.from({length: 25}, (_, i) => (2000+i).toString()).reverse(),
  },
  {
    key: 'thumbnail_url', label: 'Has Listing Photo?', type: 'select', group: 'listing',
    icon: '🖼️', options: ['True','False'],
  },
];

const GROUPS = {
  location:  { title: 'Location',         icon: '📍' },
  property:  { title: 'Property Details',  icon: '🏠' },
  capacity:  { title: 'Capacity',          icon: '👥' },
  amenities: { title: 'Amenities',         icon: '✨' },
  pricing:   { title: 'Pricing Options',   icon: '💰' },
  policy:    { title: 'Policies',          icon: '📋' },
  host:      { title: 'Host Info',         icon: '👤' },
  reviews:   { title: 'Reviews',           icon: '⭐' },
  listing:   { title: 'Listing',           icon: '📸' },
};

function initForm() {
  const obj = {};
  FIELDS.forEach(f => {
    obj[f.key] = f.type === 'select' ? (f.options?.[0] ?? '') : (f.default ?? f.min ?? 0);
  });
  return obj;
}

function validate(form) {
  const errs = {};
  FIELDS.forEach(f => {
    const v = form[f.key];
    if (f.type === 'number') {
      const n = parseFloat(v);
      if (isNaN(n)) errs[f.key] = 'Required';
      else if (f.min !== undefined && n < f.min) errs[f.key] = `Min ${f.min}`;
      else if (f.max !== undefined && n > f.max) errs[f.key] = `Max ${f.max}`;
    }
  });
  return errs;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function Predict() {
  const [form, setForm]       = useState(initForm);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [apiErr, setApiErr]   = useState('');

  const grouped = Object.entries(GROUPS).map(([gKey, meta]) => ({
    ...meta,
    gKey,
    fields: FIELDS.filter(f => f.group === gKey),
  }));

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setResult(null);
    setApiErr('');

    try {
      const payload = {};
      FIELDS.forEach(f => {
        payload[f.key] = f.type === 'number' ? parseFloat(form[f.key]) : form[f.key];
      });

      const { data } = await axios.post('/predict', payload);
      if (data.success) setResult(data);
      else setApiErr(data.error || 'Prediction failed');
    } catch (e) {
      setApiErr(e.response?.data?.error || 'Could not connect to backend. Is Flask running?');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setForm(initForm()); setResult(null); setApiErr(''); setErrors({}); };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
            Price <span className="gradient-text">Predictor</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Fill in your property details below to get an ML-powered estimate.
          </p>
        </div>

        {/* Form card */}
        <div className="glass rounded-3xl p-6 md:p-10 mb-8">
          {grouped.map(g => (
            <div key={g.gKey} className="mb-10 last:mb-0">
              <h2 className="flex items-center gap-2 text-coral-400 font-semibold text-sm uppercase tracking-widest mb-5">
                <span>{g.icon}</span>{g.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                      {f.icon} {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <select
                        value={form[f.key]}
                        onChange={e => handleChange(f.key, e.target.value)}
                        className="input-field w-full px-3 py-2.5 text-sm"
                      >
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={form[f.key]}
                        min={f.min}
                        max={f.max}
                        step={f.step || 1}
                        onChange={e => handleChange(f.key, e.target.value)}
                        className={`input-field w-full px-3 py-2.5 text-sm ${errors[f.key] ? 'border-red-500' : ''}`}
                      />
                    )}
                    {errors[f.key] && (
                      <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-white/5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 btn-glow py-4 bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white font-bold text-lg rounded-2xl shadow-lg shadow-coral-500/30 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Predicting…
                </>
              ) : '⚡ Predict Price'}
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-4 glass hover:bg-white/10 text-slate-300 font-semibold rounded-2xl border border-white/10 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* API Error */}
        {apiErr && (
          <div className="glass border border-red-500/40 rounded-2xl px-6 py-4 text-red-400 text-sm mb-6 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <strong className="block mb-1">Prediction Error</strong>
              {apiErr}
            </div>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="price-pop glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Glow bg */}
            <div
              className="absolute inset-0 rounded-3xl opacity-10"
              style={{ background: 'radial-gradient(circle at 50% 50%, #ff5a3c, transparent 70%)' }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-500/10 border border-coral-500/20 text-coral-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500"></span>
                </span>
                Model: {result.model_used}
              </div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">
                🏘️ Estimated Nightly Price
              </p>
              <div className="font-display text-6xl md:text-8xl font-black gradient-text mb-2">
                ₹{result.price_inr.toLocaleString('en-IN')}
              </div>
              <p className="text-slate-500 text-lg mb-6">per night</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="glass rounded-xl px-5 py-3">
                  <span className="text-slate-500">USD Equivalent: </span>
                  <span className="text-white font-semibold">${result.price_usd}</span>
                </div>
                <div className="glass rounded-xl px-5 py-3 border border-coral-500/20">
                  <span className="text-slate-500">Model R² Score: </span>
                  <span className="text-coral-400 font-bold">{(result.r2_score * 100).toFixed(2)}%</span>
                </div>
                <div className="glass rounded-xl px-5 py-3">
                  <span className="text-slate-500">Log Price: </span>
                  <span className="text-white font-mono font-semibold">{result.log_price}</span>
                </div>
                <div className="glass rounded-xl px-5 py-3">
                  <span className="text-slate-500">Rate: </span>
                  <span className="text-white font-semibold">1 USD = ₹95</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs mt-6">
                * Estimate only. Actual prices may vary based on seasonality, availability, and local factors.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
