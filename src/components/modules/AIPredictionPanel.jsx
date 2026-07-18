import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import useAIPrediction from '../../hooks/useAIPrediction';

const severityConfig = {
  low: { icon: ShieldCheck, color: '#34D399', bg: 'bg-emerald-500/10' },
  moderate: { icon: AlertCircle, color: '#FBBF24', bg: 'bg-amber-500/10' },
  high: { icon: AlertTriangle, color: '#FB7185', bg: 'bg-rose-500/10' },
  critical: { icon: AlertTriangle, color: '#E11D48', bg: 'bg-rose-600/20 animate-pulse' },
};

const AIPredictionPanel = React.memo(({ domain, stadiumData, title = "AI Operational Insight" }) => {
  const { prediction, loading, error, refresh, confidence } = useAIPrediction(domain, stadiumData);

  useEffect(() => {
    refresh();
    // Refresh predictions every 2 minutes
    const interval = setInterval(refresh, 120000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading && !prediction) {
    return (
      <div className="glass rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-cyan font-mono animate-pulse">Sophia is analyzing {domain} telemetry...</p>
      </div>
    );
  }

  if (error && !prediction) {
    return (
      <div className="glass rounded-2xl p-6 h-full border border-rose/20">
        <div className="flex items-center gap-2 text-rose mb-2">
          <AlertTriangle size={18} />
          <h3 className="font-semibold text-sm">Prediction Error</h3>
        </div>
        <p className="text-xs text-text-muted">{error}</p>
        <button onClick={refresh} className="mt-4 text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors">
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!prediction) return null;

  const config = severityConfig[prediction.severity] || severityConfig.low;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 h-full border border-cyan/10 relative overflow-hidden"
    >
      {/* Background glow based on severity */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 blur-3xl opacity-20 pointer-events-none"
        style={{ background: config.color }}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center">
            <Sparkles size={16} className="text-cyan" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.bg}`} style={{ color: config.color }}>
            <Icon size={12} />
            {prediction.severity} RISK
          </div>
          <button 
            onClick={refresh}
            disabled={loading}
            className={`p-1.5 rounded hover:bg-white/10 transition-colors ${loading ? 'animate-spin opacity-50' : ''}`}
            title="Refresh Prediction"
          >
            <RefreshCw size={14} className="text-text-muted" />
          </button>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <p className="text-base text-white leading-relaxed font-medium">
            {prediction.summary}
          </p>
        </div>

        <div className="bg-void/50 rounded-xl p-4 border border-white/5">
          <h4 className="text-[10px] uppercase text-text-faint font-bold tracking-widest mb-1.5">AI Reasoning Chain</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            {prediction.reasoning}
          </p>
        </div>

        {prediction.recommendation && (
          <div className="flex items-start gap-3 bg-cyan/5 border border-cyan/10 rounded-xl p-4">
            <div className="mt-0.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            </div>
            <div>
              <h4 className="text-[10px] uppercase text-cyan font-bold tracking-widest mb-1">Recommended Action</h4>
              <p className="text-xs text-text-primary leading-relaxed">
                {prediction.recommendation}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] text-text-faint font-mono">
          <div className="flex items-center gap-4">
            <span>CONFIDENCE: <strong className="text-text-muted">{confidence}%</strong></span>
            <span>HORIZON: <strong className="text-text-muted">{prediction.timeHorizon}</strong></span>
          </div>
          <span>SOURCE: {prediction.source.toUpperCase()}</span>
        </div>
      </div>
    </motion.div>
  );
});

AIPredictionPanel.displayName = 'AIPredictionPanel';

export default AIPredictionPanel;
