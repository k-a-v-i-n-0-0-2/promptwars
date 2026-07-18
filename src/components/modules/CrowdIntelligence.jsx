import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Users, AlertTriangle, ArrowRight } from 'lucide-react';

const CrowdIntelligence = ({ stadiumData }) => {
  const { crowd } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Real-time Data Panel */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <Users className="text-cyan" />
            Crowd Density Map
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-void/40 rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Current Occupancy</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-white">{crowd.currentOccupancy.toLocaleString()}</span>
                <span className="text-sm text-text-faint">/ {crowd.totalCapacity.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-void/40 rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Fill Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-white">{(crowd.entryRate - crowd.exitRate)}</span>
                <span className="text-sm text-text-faint">net fans/min</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(crowd.zones).map(([zone, data]) => (
              <div key={zone} className={`rounded-xl p-4 border transition-colors ${
                data.density > 90 ? 'bg-rose-500/10 border-rose-500/20' :
                data.density > 80 ? 'bg-amber-500/10 border-amber-500/20' :
                'bg-emerald-500/10 border-emerald-500/20'
              }`}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-2">Zone {zone}</p>
                <p className="text-xl font-bold text-white mb-1">{data.density.toFixed(1)}%</p>
                <div className="flex items-center gap-1 text-[10px] text-text-secondary">
                  {data.trend === 'rising' ? <ArrowRight size={12} className="-rotate-45 text-rose-400" /> :
                   data.trend === 'falling' ? <ArrowRight size={12} className="rotate-45 text-emerald-400" /> :
                   <ArrowRight size={12} className="text-text-muted" />}
                  {data.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Prediction Panel */}
      <div className="lg:col-span-1">
        <AIPredictionPanel domain="crowd" stadiumData={stadiumData} title="Crowd Flow Insight" />
      </div>
    </div>
  );
};

export default CrowdIntelligence;
