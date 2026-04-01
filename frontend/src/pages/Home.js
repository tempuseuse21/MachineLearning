import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { value: '74K+', label: 'Listings Analysed' },
  { value: '92%',  label: 'Model Accuracy'    },
  { value: '10+',  label: 'Cities Covered'    },
  { value: '< 1s', label: 'Prediction Time'   },
];

const FEATURES_HIGHLIGHT = [
  { icon: '🏡', title: 'Property Type', desc: 'Apartment, house, villa & more' },
  { icon: '🛏️', title: 'Bedrooms & Beds', desc: 'Size and sleeping capacity' },
  { icon: '📍', title: 'City & Location', desc: '10 major US cities' },
  { icon: '⭐', title: 'Host Quality', desc: 'Response rate, verification status' },
  { icon: '🔑', title: 'Booking Policy', desc: 'Instant book & cancellation' },
  { icon: '🛁', title: 'Amenities', desc: 'Bathrooms, cleaning fees & more' },
];

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Parallax orb
  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          ref={heroRef}
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff5a3c, #ff8c6a, transparent)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-coral-500/30 text-coral-400 text-sm font-medium mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-coral-400 animate-pulse" />
            Powered by XGBoost + RandomForest ML
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-black leading-none mb-6 animate-fade-up delay-100"
            style={{ animationFillMode: 'both' }}
          >
            Predict Your{' '}
            <span className="gradient-text">Airbnb</span>
            <br />Price Instantly
          </h1>

          <p
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200"
            style={{ animationFillMode: 'both' }}
          >
            Our machine learning model analyses 19 property features — from room type
            to host quality — to give you an accurate nightly price estimate in under a second.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300"
            style={{ animationFillMode: 'both' }}
          >
            <button
              onClick={() => navigate('/predict')}
              className="btn-glow px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-semibold text-lg rounded-2xl shadow-2xl shadow-coral-500/30 transition-all hover:scale-105 hover:shadow-coral-500/50"
            >
              Start Prediction →
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 glass hover:bg-white/10 text-white font-semibold text-lg rounded-2xl border border-white/10 transition-all"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 text-center hover:border-coral-500/30 transition-all hover:scale-105 group"
            >
              <div className="font-display text-3xl md:text-4xl font-black gradient-text mb-1 group-hover:scale-110 transition-transform">
                {s.value}
              </div>
              <div className="text-slate-500 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              19 Features, One Smart Prediction
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our model considers everything that matters when pricing a rental property.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES_HIGHLIGHT.map((f, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 hover:border-coral-500/30 transition-all hover:bg-white/5 group cursor-default"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #ff5a3c, #ff8c6a)' }}
          />
          <h2 className="relative font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect price?
          </h2>
          <p className="relative text-slate-400 mb-8">
            Fill in your property details and get an ML-powered estimate in seconds.
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="relative btn-glow px-10 py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-coral-500/40 transition-all hover:scale-105"
          >
            Predict Now — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        Built with React + Flask + XGBoost · PriceAI © 2024
      </footer>
    </div>
  );
}
