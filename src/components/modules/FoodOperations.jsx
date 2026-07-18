import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Coffee, DollarSign, Timer } from 'lucide-react';

const FoodOperations = ({ stadiumData }) => {
  const { food } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <Coffee className="text-orange-400" />
              Food & Vendor Operations
            </h2>
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono">
              Halftime in: <span className="text-orange-400 font-bold">{food.minutesToHalftime}m</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-void/40 rounded-2xl p-5 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1">Total Revenue</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-white">${(food.totalRevenue / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted">Concession Zones</h3>
            {food.zones.map(zone => (
              <div key={zone.id} className="bg-void/40 rounded-xl p-4 border border-white/5 grid grid-cols-3 gap-4 items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{zone.name}</h4>
                  <p className="text-[10px] text-text-secondary">{zone.transactions.toLocaleString()} tx</p>
                </div>
                
                <div className="flex flex-col items-center border-l border-r border-white/5">
                  <div className="flex items-center gap-1.5 mb-1 text-sm font-bold">
                    <Timer size={14} className={zone.queueWait > 6 ? 'text-amber-400' : 'text-emerald-400'} />
                    <span>{zone.queueWait}m wait</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-white mb-1">Inventory: {zone.inventoryPercent.toFixed(0)}%</span>
                  <div className="w-full max-w-[100px] h-1.5 bg-surface-raised rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${zone.inventoryPercent < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${zone.inventoryPercent}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="food" stadiumData={stadiumData} title="Demand Forecasting" />
      </div>
    </div>
  );
};

export default FoodOperations;
