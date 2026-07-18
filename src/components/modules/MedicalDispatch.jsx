import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Activity, Heart, Clock, Navigation } from 'lucide-react';

const MedicalDispatch = ({ stadiumData }) => {
  const { medical } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <Heart className="text-rose-400" />
            Medical Dispatch
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Active Units</p>
              <p className="text-2xl font-bold text-white">{medical.unitsDeployed}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Standby</p>
              <p className="text-2xl font-bold text-white">{medical.unitsAvailable}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Avg Response</p>
              <p className="text-2xl font-bold text-white">{medical.avgResponseTime}m</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Defibrillators</p>
              <p className="text-2xl font-bold text-white">{medical.defibrillators.online}/{medical.defibrillators.total}</p>
            </div>
          </div>

          <div className="bg-void/30 rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs uppercase font-bold text-text-muted mb-4 tracking-widest">Accessibility Services</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center">
                  <Navigation size={18} className="text-cyan" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{medical.wheelchairsAvailable}</p>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wide">Wheelchairs Avail</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden">
                  <div className="h-full bg-cyan rounded-full" style={{ width: `${(medical.wheelchairsAvailable / 30) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="medical" stadiumData={stadiumData} title="Medical Risk Forecast" />
      </div>
    </div>
  );
};

export default MedicalDispatch;
