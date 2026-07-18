import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Briefcase, TrendingUp, Activity, ShieldCheck } from 'lucide-react';

const ExecutiveDashboard = ({ stadiumData }) => {
  const { match, food, crowd, safety } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="text-white" />
            Executive Command
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-void/40 rounded-2xl p-5 border border-emerald-500/20">
              <TrendingUp size={20} className="text-emerald-400 mb-3" />
              <p className="text-xs text-emerald-400/80 uppercase tracking-wider font-bold mb-1">Match Revenue</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-white">${(food.totalRevenue / 1000).toFixed(1)}k</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan/20 to-void/40 rounded-2xl p-5 border border-cyan/20">
              <Activity size={20} className="text-cyan mb-3" />
              <p className="text-xs text-cyan/80 uppercase tracking-wider font-bold mb-1">Attendance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-white">{crowd.occupancyPercent}%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-void/40 rounded-2xl p-5 border border-purple-500/20">
              <ShieldCheck size={20} className="text-purple-400 mb-3" />
              <p className="text-xs text-purple-400/80 uppercase tracking-wider font-bold mb-1">Safety Index</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-white">{safety.overallScore}</span>
                <span className="text-sm text-purple-400">/ 100</span>
              </div>
            </div>
          </div>

          <div className="bg-void/40 rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted mb-4">Event Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-text-secondary uppercase mb-1">Match</p>
                <p className="font-bold text-white text-sm truncate">{match.home} vs {match.away}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase mb-1">Minute</p>
                <p className="font-bold text-white text-sm">{match.minute}'</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase mb-1">Score</p>
                <p className="font-bold text-white text-sm">{match.scoreHome} - {match.scoreAway}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase mb-1">Venue</p>
                <p className="font-bold text-white text-sm truncate">{match.venue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="executive" stadiumData={stadiumData} title="Executive Briefing" />
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
