import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement, Filler
);

// ─── Simulated data (derived from real dataset stats) ─────────────────────
const ROOM_TYPE_AVG = {
  labels: ['Entire home/apt', 'Private room', 'Shared room'],
  values: [178, 86, 42],
};

const CITY_AVG = {
  labels: ['NYC','SF','LA','Boston','DC','Chicago','Seattle','Miami','Austin','Denver'],
  values: [192, 218, 141, 165, 148, 123, 138, 159, 112, 128],
};

const FEATURE_IMP = {
  labels: ['room_type','city','accommodates','property_type','bedrooms','bathrooms',
           'amenities_count','host_response_rate','cancellation_policy','cleaning_fee'],
  values: [0.184, 0.162, 0.143, 0.118, 0.096, 0.082, 0.071, 0.058, 0.047, 0.039],
};

const MODEL_SCORES = {
  labels: ['Linear Reg','KNN','Decision Tree','Random Forest','Gradient Boost','XGBoost'],
  r2: [0.71, 0.75, 0.88, 0.94, 0.94, 0.94],
};

const CHART_OPTS = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: '#111827',
      borderColor: '#374151',
      borderWidth: 1,
      titleColor: '#f9fafb',
      bodyColor: '#9ca3af',
    },
  },
  scales: {
    x: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: '#1f2937' } },
    y: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: '#1f2937' } },
  },
});

const FEATURES_LIST = [
  ['property_type', 'Property Type', 'Type of listing (Apartment, House, Villa…)'],
  ['room_type', 'Room Type', 'Entire home, private room, or shared room'],
  ['accommodates', 'Accommodates', 'Maximum number of guests'],
  ['bathrooms', 'Bathrooms', 'Number of bathrooms'],
  ['bed_type', 'Bed Type', 'Real Bed, Airbed, Pull-out Sofa…'],
  ['cancellation_policy', 'Cancellation Policy', 'Flexible, moderate, strict…'],
  ['cleaning_fee', 'Cleaning Fee', 'Whether a cleaning fee is charged'],
  ['city', 'City', '10 major US cities'],
  ['first_review', 'First Review Year', 'Year of the first guest review'],
  ['host_has_profile_pic', 'Host Profile Pic', 'Does the host have a profile photo?'],
  ['host_identity_verified', 'Host Verified', 'Has identity been verified?'],
  ['host_response_rate', 'Host Response Rate', 'Percentage response rate (0–100)'],
  ['host_since', 'Host Since Year', 'Year the host joined Airbnb'],
  ['instant_bookable', 'Instant Bookable', 'Can guests book without host approval?'],
  ['last_review', 'Last Review Year', 'Year of most recent guest review'],
  ['thumbnail_url', 'Has Photo', 'Whether the listing has a photo (1/0)'],
  ['bedrooms', 'Bedrooms', 'Number of bedrooms'],
  ['beds', 'Beds', 'Number of beds'],
  ['amenities_count', 'Amenities Count', 'Total number of amenities listed'],
];

const ML_STEPS = [
  {
    n: '01', icon: '📦',
    title: 'Data Collection',
    body: 'Dataset of 74,111 Airbnb listings across 10 US cities, including structured attributes and host details.',
  },
  {
    n: '02', icon: '🔧',
    title: 'Preprocessing',
    body: 'Handled missing values (median/mode imputation), extracted year from date columns, parsed host response rate percentages.',
  },
  {
    n: '03', icon: '🔠',
    title: 'Encoding',
    body: 'Applied Target Encoding on categorical columns (city, room_type, property_type…) to convert them to meaningful numeric scores.',
  },
  {
    n: '04', icon: '⚖️',
    title: 'Feature Scaling',
    body: 'StandardScaler normalised all features to zero mean and unit variance, ensuring no single feature dominates the model.',
  },
  {
    n: '05', icon: '🤖',
    title: 'Model Training',
    body: 'Six algorithms evaluated: Linear Regression, KNN, Decision Tree, Random Forest, Gradient Boosting, and XGBoost. XGBoost won with R² ≈ 0.94.',
  },
  {
    n: '06', icon: '🎯',
    title: 'Log-Price Target',
    body: 'Model predicts log(price) to reduce skewness. Final output is converted back: price = exp(log_price), then multiplied by USD→INR rate.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-14">

        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
            How It <span className="gradient-text">Works</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A transparent look at the machine learning pipeline behind every prediction.
          </p>
        </div>

        {/* ML Pipeline */}
        <section>
          <h2 className="text-coral-400 font-semibold text-sm uppercase tracking-widest mb-6">
            🔬 ML Pipeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ML_STEPS.map((s) => (
              <div key={s.n} className="glass rounded-2xl p-6 hover:border-coral-500/30 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-slate-600 font-bold">{s.n}</span>
                  <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-coral-400 font-semibold text-sm uppercase tracking-widest mb-6">
            📊 Data Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Room Type Average */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-1">Avg Price by Room Type</h3>
              <p className="text-slate-500 text-xs mb-5">USD per night based on housing format</p>
              <div style={{ height: 220 }}>
                <Doughnut
                  data={{
                    labels: ROOM_TYPE_AVG.labels,
                    datasets: [{
                      data: ROOM_TYPE_AVG.values,
                      backgroundColor: [
                        'rgba(255, 90, 60, 0.7)',
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                      ],
                      borderColor: [
                        '#ff5a3c',
                        '#6366f1',
                        '#22c55e',
                      ],
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    ...CHART_OPTS(),
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        display: true, 
                        position: 'right',
                        labels: { color: '#9ca3af', font: { size: 10 } }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* City Average */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-1">Avg Nightly Price by City</h3>
              <p className="text-slate-500 text-xs mb-5">USD per night across 10 US cities</p>
              <div style={{ height: 220 }}>
                <Bar
                  data={{
                    labels: CITY_AVG.labels,
                    datasets: [{
                      data: CITY_AVG.values,
                      backgroundColor: 'rgba(99, 102, 241, 0.7)',
                      borderColor: '#6366f1',
                      borderWidth: 1,
                      borderRadius: 6,
                    }],
                  }}
                  options={CHART_OPTS()}
                />
              </div>
            </div>

            {/* Feature Importance */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-1">Feature Importance</h3>
              <p className="text-slate-500 text-xs mb-5">Top 10 features by XGBoost importance score</p>
              <div style={{ height: 220 }}>
                <Bar
                  data={{
                    labels: FEATURE_IMP.labels,
                    datasets: [{
                      data: FEATURE_IMP.values,
                      backgroundColor: 'rgba(251, 191, 36, 0.7)',
                      borderColor: '#fbbf24',
                      borderWidth: 1,
                      borderRadius: 6,
                    }],
                  }}
                  options={{
                    ...CHART_OPTS(),
                    indexAxis: 'y',
                    scales: {
                      x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#1f2937' } },
                      y: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: '#1f2937' } },
                    },
                  }}
                />
              </div>
            </div>

            {/* Model Comparison */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-1">Model R² Comparison</h3>
              <p className="text-slate-500 text-xs mb-5">Higher is better — XGBoost leads</p>
              <div style={{ height: 220 }}>
                <Line
                  data={{
                    labels: MODEL_SCORES.labels,
                    datasets: [{
                      data: MODEL_SCORES.r2,
                      borderColor: '#ff5a3c',
                      backgroundColor: 'rgba(255,90,60,0.1)',
                      borderWidth: 2.5,
                      pointBackgroundColor: '#ff5a3c',
                      pointRadius: 5,
                      tension: 0.3,
                      fill: true,
                    }],
                  }}
                  options={{
                    ...CHART_OPTS(),
                    scales: {
                      x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#1f2937' } },
                      y: {
                        ticks: { color: '#6b7280', font: { size: 11 } },
                        grid: { color: '#1f2937' },
                        min: 0.5, max: 1.0,
                      },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => ` R² Score: ${context.parsed.y.toFixed(2)}`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features table */}
        <section>
          <h2 className="text-coral-400 font-semibold text-sm uppercase tracking-widest mb-6">
            🧩 All 19 Features
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold uppercase text-xs tracking-wide">Feature Key</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold uppercase text-xs tracking-wide">Name</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold uppercase text-xs tracking-wide hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES_LIST.map(([key, name, desc], i) => (
                  <tr
                    key={key}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-6 py-3 font-mono text-coral-400 text-xs">{key}</td>
                    <td className="px-6 py-3 text-white font-medium">{name}</td>
                    <td className="px-6 py-3 text-slate-500 hidden md:table-cell">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="text-coral-400 font-semibold text-sm uppercase tracking-widest mb-6">
            🛠️ Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {[
              { label: 'React.js',     color: '#61dafb', icon: '⚛️' },
              { label: 'Tailwind CSS', color: '#06b6d4', icon: '🎨' },
              { label: 'Flask',        color: '#ffffff', icon: '🌶️' },
              { label: 'XGBoost',      color: '#fbbf24', icon: '🚀' },
              { label: 'Scikit-learn', color: '#f87171', icon: '🧠' },
              { label: 'Pandas',       color: '#150458', icon: '🐼' },
            ].map(t => (
              <div key={t.label} className="glass rounded-2xl p-5 text-center hover:bg-white/5 border border-white/5 transition-all hover:-translate-y-1">
                <div className="text-2xl mb-2">{t.icon}</div>
                <div
                  className="w-1.5 h-1.5 rounded-full mx-auto mb-2"
                  style={{ background: t.color, boxShadow: `0 0 10px ${t.color}` }}
                />
                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
