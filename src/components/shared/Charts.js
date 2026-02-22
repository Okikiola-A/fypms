import React, { useEffect, useRef, useState } from 'react';

// ── Animated counter hook ──────────────────────────────────────────────
export const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

// ── Radial progress ring ───────────────────────────────────────────────
export const RadialProgress = ({ percent, size = 120, stroke = 10, color = '#6366f1', darkMode }) => {
  const [animated, setAnimated] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - (circ * animated) / 100}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
    </svg>
  );
};

// ── Horizontal bar chart ───────────────────────────────────────────────
export const BarChart = ({ data, darkMode, height = 180 }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{d.label}</span>
            <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{d.value}{d.unit || ''}</span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${(d.value / max) * 100}%` : '0%',
                background: d.color || 'linear-gradient(to right, #6366f1, #a855f7)',
                transitionDelay: `${i * 80}ms`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Donut chart ────────────────────────────────────────────────────────
export const DonutChart = ({ segments, size = 140, stroke = 22, darkMode }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 150); return () => clearTimeout(t); }, []);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={darkMode ? '#374151' : '#f3f4f6'} strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke} strokeLinecap="butt"
            strokeDasharray={`${animated ? dash : 0} ${circ}`}
            strokeDashoffset={-offset}
            style={{ transition: `stroke-dasharray 0.9s ease-out ${i * 120}ms` }} />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
};

// ── Sparkline (simple SVG polyline) ───────────────────────────────────
export const Sparkline = ({ data, color = '#6366f1', height = 48, darkMode }) => {
  const [animated, setAnimated] = useState(false);
  const pathRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  if (!data || data.length < 2) return null;
  const w = 280;
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 4;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + ((max - v) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  // Area fill path
  const first = `${pad},${height}`;
  const last  = `${pad + (w - pad * 2)},${height}`;
  const area  = `M ${first} L ${points.split(' ').map((p, i) => (i === 0 ? `${pad},${height} L ${p}` : p)).join(' ')} L ${last} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"
        style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.6s ease-out' }} />
      <polyline points={points} fill={`url(#sg-${color.replace('#','')})`}
        style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.6s ease-out 0.2s' }} />
    </svg>
  );
};

// ── Vertical grouped bar chart ─────────────────────────────────────────
export const ColumnChart = ({ data, labels, colors, darkMode, height = 140 }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  const allVals = data.flatMap(d => d.values);
  const max = Math.max(...allVals, 1);
  const barW = 10;
  const gap  = 4;
  const groupW = data[0].values.length * (barW + gap) - gap;
  const groupGap = 20;
  const totalW = data.length * (groupW + groupGap);

  return (
    <div className="overflow-x-auto">
      <svg width={totalW + 20} height={height + 28} style={{ minWidth: '100%' }}>
        {data.map((group, gi) => {
          const gx = 10 + gi * (groupW + groupGap);
          return (
            <g key={gi}>
              {group.values.map((val, vi) => {
                const bh = animated ? ((val / max) * (height - 16)) : 0;
                const bx = gx + vi * (barW + gap);
                return (
                  <rect key={vi}
                    x={bx} y={height - 8 - bh} width={barW} height={bh}
                    rx={3} fill={colors[vi]}
                    style={{ transition: `height 0.8s ease-out ${(gi * group.values.length + vi) * 60}ms, y 0.8s ease-out ${(gi * group.values.length + vi) * 60}ms` }}
                  />
                );
              })}
              <text x={gx + groupW / 2} y={height + 16} textAnchor="middle"
                fontSize="10" fill={darkMode ? '#9ca3af' : '#6b7280'}>
                {group.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── Mini stat card used inside dashboards ─────────────────────────────
export const StatCard = ({ label, value, sub, icon, gradient, darkMode }) => {
  const count = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <div className={`rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {typeof value === 'number' ? count : value}
          </p>
          {sub && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// ── Chart card wrapper ─────────────────────────────────────────────────
export const ChartCard = ({ title, subtitle, children, darkMode, className = '' }) => (
  <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm ${className}`}>
    <div className="mb-4">
      <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      {subtitle && <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
    </div>
    {children}
  </div>
);