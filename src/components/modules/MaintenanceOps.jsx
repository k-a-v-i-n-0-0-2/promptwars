import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Wrench, Zap, Trash2, Power } from 'lucide-react';

const MaintenanceOps = ({ stadiumData }) => {
  const { maintenance } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <Wrench className="text-slate-400" />
            Maintenance & Facilities
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <Zap size={20} className="text-amber-400 mb-2" />
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Power Grid</p>
              <p className="text-sm font-bold text-white capitalize">{maintenance.powerSystems.mainGrid}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <Power size={20} className="text-cyan mb-2" />
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Generators</p>
              <p className="text-sm font-bold text-white capitalize">{maintenance.powerSystems.backupGenerators}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <Trash2 size={20} className="text-emerald-400 mb-2" />
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Cleaning Staff</p>
              <p className="text-xl font-bold text-white">{maintenance.cleaningStaff.active}</p>
            </div>
            <div className="bg-void/40 rounded-xl p-4 border border-white/5">
              <Wrench size={20} className="text-purple-400 mb-2" />
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">HVAC</p>
              <p className="text-sm font-bold text-white capitalize">{maintenance.hvacStatus}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted">Restroom Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {maintenance.restrooms.map(room => (
                <div key={room.id} className="bg-void/40 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-sm">{room.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      room.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {room.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1 text-text-secondary text-[10px]">
                        <span>Usage</span>
                        <span>{room.usage}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${room.usage > 90 ? 'bg-rose-500' : 'bg-cyan'}`} style={{ width: `${room.usage}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-text-muted block">Clean In</span>
                      <span className={`font-bold ${room.cleaningDue < 5 ? 'text-amber-400' : 'text-white'}`}>{room.cleaningDue}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="maintenance" stadiumData={stadiumData} title="Facilities Forecast" />
      </div>
    </div>
  );
};

export default MaintenanceOps;
