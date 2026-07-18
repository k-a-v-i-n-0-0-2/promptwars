import React from 'react';

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-void/95 border border-white/[0.08] backdrop-blur-md rounded-lg p-3 text-[10px] font-mono shadow-xl">
      <div className="text-text-muted border-b border-white/[0.05] pb-1.5 mb-1.5">TIMELINE: {label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-6 py-0.5">
          <span className="text-text-secondary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color || '#E5C158' }} />
            {p.name.toUpperCase()}:
          </span>
          <span className="text-white font-bold">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value} {p.unit}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GlassTooltip;
