import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { ShieldAlert, Video, Radio, Activity } from 'lucide-react';

const SecurityCommand = ({ stadiumData }) => {
  const { safety } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <ShieldAlert className="text-amber-400" />
              Security Command Operations
            </h2>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase ${
              safety.threatLevel === 'GREEN' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              safety.threatLevel === 'YELLOW' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              Threat Level: {safety.threatLevel}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Safety Score</p>
              <p className="text-2xl font-bold text-white">{safety.overallScore}%</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Personnel</p>
              <p className="text-2xl font-bold text-white">{safety.securityPersonnel.deployed}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">CCTV Active</p>
              <p className="text-2xl font-bold text-white">{safety.cctvOnline}/{safety.cctvTotal}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Alerts</p>
              <p className="text-2xl font-bold text-white">{safety.activeAlerts}</p>
            </div>
          </div>

          <div className="bg-void/30 rounded-2xl p-1 border border-white/5 overflow-hidden">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="aspect-video bg-surface-raised relative group overflow-hidden border border-void">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                    <Video size={12} className="text-cyan" />
                  </div>
                  <div className="absolute top-1 left-1 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[6px] font-mono text-white/50">CAM-{i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="security" stadiumData={stadiumData} title="Threat Intelligence" />
      </div>
    </div>
  );
};

export default SecurityCommand;
