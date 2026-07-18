import React from 'react';
import AIPredictionPanel from './AIPredictionPanel';
import { Users2, Clock, CheckCircle } from 'lucide-react';

const VolunteerManagement = ({ stadiumData }) => {
  const { volunteers } = stadiumData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <Users2 className="text-purple-400" />
              Volunteer Management
            </h2>
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
              Shift End: <span className="text-white font-bold">{volunteers.shiftEnd}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-500/10 rounded-2xl p-5 border border-purple-500/20">
              <p className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">On Duty</p>
              <span className="text-3xl font-display font-bold text-white">{volunteers.totalOnDuty}</span>
            </div>
            <div className="bg-void/40 rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Standby</p>
              <span className="text-3xl font-display font-bold text-white">{volunteers.totalAvailable}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted">Assignments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {volunteers.assignments.map((assignment, idx) => {
                const deficit = assignment.count < assignment.needed;
                const surplus = assignment.count > assignment.needed;
                return (
                  <div key={idx} className={`bg-void/40 rounded-xl p-3 border ${deficit ? 'border-amber-500/30' : 'border-white/5'}`}>
                    <p className="font-bold text-sm text-white mb-2">{assignment.zone}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Staffed:</span>
                      <span className={`font-bold ${deficit ? 'text-amber-400' : surplus ? 'text-cyan' : 'text-emerald-400'}`}>
                        {assignment.count} / {assignment.needed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AIPredictionPanel domain="volunteer" stadiumData={stadiumData} title="Staffing Optimization" />
      </div>
    </div>
  );
};

export default VolunteerManagement;
