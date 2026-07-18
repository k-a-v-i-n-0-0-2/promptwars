import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Target, AlertOctagon, TrendingUp, Shield } from 'lucide-react';

const RiskForecasting = ({ stadiumData }) => {
  const { safety, environment, crowd } = stadiumData;

  const riskScore = Math.floor(
    (crowd.peakDensity > 90 ? 15 : 5) +
    (safety.threatLevel === 'GREEN' ? 2 : 20) +
    (environment.rainProbability > 40 ? 10 : 2)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <Target className="text-rose-500" />
            Composite Risk Forecasting
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className={`sm:col-span-1 rounded-2xl p-6 border ${
              riskScore < 20 ? 'bg-emerald-500/10 border-emerald-500/20' : 
              riskScore < 50 ? 'bg-amber-500/10 border-amber-500/20' : 
              'bg-rose-500/10 border-rose-500/20'
            }`}>
              <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Global Risk Score</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-display font-bold ${
                  riskScore < 20 ? 'text-emerald-400' : riskScore < 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>{riskScore}</span>
                <span className="text-sm text-text-faint">/ 100</span>
              </div>
            </div>
            
            <div className="sm:col-span-2 bg-void/40 rounded-2xl p-6 border border-white/5">
              <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted mb-4">Risk Vectors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-text-secondary">Crowd Flow</span>
                  <div className="flex-1 h-2 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-cyan rounded-full" style={{ width: `${crowd.peakDensity}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-text-secondary">Security</span>
                  <div className="flex-1 h-2 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-text-secondary">Weather</span>
                  <div className="flex-1 h-2 bg-surface-raised rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${environment.rainProbability}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-void/30 rounded-xl p-4 border border-white/5 flex items-center gap-4">
            <Shield className="text-cyan shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-white mb-1">Evacuation Readiness</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                All primary and secondary egress routes are clear. Routing algorithms are pre-calculated. Estimated full-stadium evacuation time: <strong>14.2 minutes</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="risk" stadiumData={stadiumData} title="Predictive Risk Model" />
      </div>
    </div>
  );
};

export default RiskForecasting;
