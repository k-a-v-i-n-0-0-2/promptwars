import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Car, Train, Navigation2 } from 'lucide-react';

const TransportIntelligence = ({ stadiumData }) => {
  const { transport } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <Car className="text-indigo-400" />
            Transport & Parking Operations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted">Parking Fill Rates</h3>
              {transport.parkingLots.map(lot => (
                <div key={lot.id} className="bg-void/40 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-white">{lot.name}</span>
                    <span className="text-text-secondary">{Math.round((lot.occupied / lot.capacity) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (lot.occupied / lot.capacity) > 0.9 ? 'bg-rose-500' :
                        (lot.occupied / lot.capacity) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${(lot.occupied / lot.capacity) * 100}%` }} 
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-text-muted">
                    <span>{lot.occupied.toLocaleString()} / {lot.capacity.toLocaleString()}</span>
                    <span>+{lot.fillRate}/min</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted mb-4">Public Transit Integration</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                    <Train size={16} className="text-indigo-400 mb-2" />
                    <p className="text-lg font-bold text-white">{transport.publicTransit.trainFrequencyMin}m</p>
                    <p className="text-[10px] text-text-secondary uppercase">Train Freq</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                    <Car size={16} className="text-indigo-400 mb-2" />
                    <p className="text-lg font-bold text-white">{transport.publicTransit.rideshareQueue}</p>
                    <p className="text-[10px] text-text-secondary uppercase">Rideshare Q</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted mb-4">VIP Tracking</h3>
                <div className="space-y-2">
                  {transport.vipArrivals.map(vip => (
                    <div key={vip.id} className="flex items-center justify-between bg-void/40 rounded-lg p-2 border border-white/5 text-sm">
                      <span className="text-text-primary">{vip.name}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        vip.status === 'arrived' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan/20 text-cyan'
                      }`}>
                        {vip.eta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="transport" stadiumData={stadiumData} title="Traffic Intelligence" />
      </div>
    </div>
  );
};

export default TransportIntelligence;
