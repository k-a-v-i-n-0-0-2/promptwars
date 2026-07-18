import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Terminal,
  Cpu,
  Database,
  Wifi,
  Thermometer,
  ShieldCheck,
  TrendingUp,
  Server,
  Play,
  Pause,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ──────────────────────────────────────────────────────────
   Mock Data & Logs Definitions
   ────────────────────────────────────────────────────────── */
const LOG_TEMPLATES = [
  { level: 'OK', source: 'INGRESS', desc: 'Scanner handshake accepted at GATE_04 (UID: 9f81a)' },
  { level: 'OK', source: 'THERMAL', desc: 'HVAC fan speed auto-adjusted in ZONE_EAST to 65%' },
  { level: 'WARN', source: 'INGRESS', desc: 'Gate 2 queue length approaching 5-minute threshold' },
  { level: 'OK', source: 'NETWORK', desc: 'Sensor grid ping check complete (1420/1420 active)' },
  { level: 'OK', source: 'SYSTEM', desc: 'Evacuation routing optimization completed in 4.2ms' },
  { level: 'OK', source: 'CONCESS', desc: 'Transaction node CONCESS_B registered 12.4 tx/sec' },
  { level: 'OK', source: 'INGRESS', desc: 'Redirection script GATE_02_OVERFLOW initialized' },
  { level: 'WARN', source: 'AUDIO', desc: 'Decibel peak registered in Section North (106.4 dB)' },
];

const generateTimelineData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    spectators: Math.floor(45000 + Math.sin((i - 8) * 0.25) * 32000 + Math.random() * 4000),
    bandwidth: parseFloat((1.2 + Math.cos((i - 8) * 0.2) * 0.6 + Math.random() * 0.2).toFixed(2)),
  }));
};

const SENSOR_NODES = Array.from({ length: 16 }, (_, i) => ({
  id: `N-${String(i + 1).padStart(2, '0')}`,
  zone: ['NW', 'NE', 'SW', 'SE'][i % 4],
  temp: parseFloat((21.5 + (i % 3) * 0.8 + Math.random() * 0.5).toFixed(1)),
  status: i === 6 ? 'WARN' : 'OK',
  load: Math.floor(40 + (i * 3.5) % 45),
}));

const HighDensityTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-void/95 border border-white/[0.08] backdrop-blur-md rounded-lg p-3 text-[10px] font-mono shadow-xl">
      <div className="text-text-muted border-b border-white/[0.05] pb-1.5 mb-1.5">TIMELINE: {label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-6 py-0.5">
          <span className="text-text-secondary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color || '#E5C158' }} />
            {p.name.toUpperCase()}:
          </span>
          <span className="text-white font-bold">{p.value.toLocaleString()} {p.unit}</span>
        </div>
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Enterprise Telemetry Dashboard Screen (with Executive HUD)
   ────────────────────────────────────────────────────────── */
const Overview = () => {
  const [logs, setLogs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineData] = useState(generateTimelineData());
  const [currentBriefing, setCurrentBriefing] = useState(0);
  const terminalEndRef = useRef(null);

  // Simple, human-readable executive briefings
  const BRIEFINGS = [
    { status: 'OPTIMAL', text: 'All 24 stadium gates are open and flowing. Average entry wait time is 2.4 minutes. Air quality and temperature remain within comfortable thresholds.' },
    { status: 'ATTENTION', text: 'Gate 2 experiencing higher arrival volumes than predicted. Flow is active but wait times are slightly increased. Redirections are handling the load.' },
    { status: 'OPTIMAL', text: 'Next flow peak is expected in 15 minutes as kickoff approaches. Medical and safety grids are fully synched with local command protocols.' },
  ];

  useEffect(() => {
    // Seed initial logs
    const initialLogs = Array.from({ length: 12 }, (_, i) => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const date = new Date(Date.now() - (12 - i) * 8000);
      return {
        timestamp: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
        ...template,
      };
    });
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const date = new Date();
      const newLog = {
        timestamp: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
        ...template,
      };
      setLogs((prev) => [...prev.slice(-25), newLog]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const briefInterval = setInterval(() => {
      setCurrentBriefing((prev) => (prev + 1) % BRIEFINGS.length);
    }, 6000);
    return () => clearInterval(briefInterval);
  }, [BRIEFINGS.length]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="space-y-5 font-mono">
      
      {/* ═══ EXECUTIVE BRIEFING BANNER (Simple human translation of complex data) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 border border-gold/25 relative overflow-hidden group shadow-glow-sm bg-gold/[0.01]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(229,193,88,0.1)]">
              <Sparkles size={16} style={{ color: '#E5C158' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gold font-bold tracking-widest uppercase">Executive Status Briefing</span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
              </div>
              
              {/* Dynamic text briefing block */}
              <div className="min-h-[36px] mt-1 pr-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentBriefing}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-white/90 leading-relaxed font-sans"
                  >
                    {BRIEFINGS[currentBriefing].text}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Core high-level aggregates */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/[0.04] pt-3.5 md:pt-0 md:pl-6 shrink-0 text-left">
            <div>
              <p className="text-[8px] text-text-muted font-bold tracking-wider uppercase">Gate Queue</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-white">NOMINAL</span>
                <span className="text-[9px] text-emerald-400">(2.4m)</span>
              </div>
            </div>
            <div>
              <p className="text-[8px] text-text-muted font-bold tracking-wider uppercase">Capacity</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-white">98%</span>
                <span className="text-[9px] text-text-muted">FILL</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── HIGH-DENSITY SYSINFO ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { label: 'ingress_load', val: '87,432', unit: 'FANS', sub: '98.2% CAPACITY', color: '#E5C158', icon: Cpu },
          { label: 'network_latency', val: '12.4', unit: 'MS', sub: '0.00% PACKET_LOSS', color: '#38BDF8', icon: Wifi },
          { label: 'database_health', val: '100%', unit: 'STATUS', sub: 'NODE_REDUNDANCY_OK', color: '#34D399', icon: Database },
          { label: 'system_uptime', val: '99.98%', unit: 'UPTIME', sub: 'SYS_NOMINAL_LOCK', color: '#A78BFA', icon: Server },
        ].map((sys) => (
          <div
            key={sys.label}
            className="bg-abyss/85 border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 text-[10px] text-text-muted font-bold tracking-wider">
              <span>{sys.label.toUpperCase()}</span>
              <sys.icon size={13} style={{ color: sys.color }} />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white tracking-tight">{sys.val}</span>
                <span className="text-[9px] text-text-muted">{sys.unit}</span>
              </div>
              <p className="text-[9px] text-text-secondary mt-1 tracking-wide">{sys.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CENTRAL CONSOLE VIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Graph Console Panel (Row 1, Cols 1-2) */}
        <div className="lg:col-span-2 bg-abyss/85 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.03] pb-3">
            <div>
              <span className="text-[10px] text-gold font-bold tracking-widest uppercase">system_ingress_telemetry</span>
              <p className="text-[9px] text-text-muted mt-0.5">Real-time load analytics (24-hour cycle)</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E5C158' }} /> Ingress Rate
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E5C158" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#E5C158" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.02)' }}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<HighDensityTooltip />} />
              <Area
                type="monotone"
                dataKey="spectators"
                name="Spectators"
                stroke="#E5C158"
                strokeWidth={1}
                unit=" Fans"
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Live Terminal Logger (Row 1, Col 3) */}
        <div className="bg-abyss/85 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between h-[320px] lg:h-auto">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.03] pb-2">
            <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Terminal size={12} className="text-gold" /> syslog_daemon
            </span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-[9px] text-text-secondary hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-white/[0.02] border border-white/[0.05] rounded px-2 py-0.5"
            >
              {isPlaying ? <Pause size={10} /> : <Play size={10} />}
              <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
            </button>
          </div>

          {/* Scrolling log container */}
          <div className="flex-1 overflow-y-auto pr-1 text-[9px] space-y-1.5 scrollbar-thin">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-1.5 leading-normal">
                <span className="text-text-faint shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 font-bold ${
                  log.level === 'WARN' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {log.level}
                </span>
                <span className="text-text-muted shrink-0">{log.source}:</span>
                <span className="text-text-secondary">{log.desc}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: SENSOR MATRIX & TELEMETRY CONTROLS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Node Sensor Status Matrix (Row 2, Cols 1-2) */}
        <div className="lg:col-span-2 bg-abyss/85 border border-white/[0.04] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.03] pb-2">
            <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">sensor_grid_node_matrix</span>
            <span className="text-[9px] text-emerald-400 font-bold">1420 / 1420 SENSORS ACTIVE</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SENSOR_NODES.map((node) => (
              <div
                key={node.id}
                className="bg-void/50 border border-white/[0.02] hover:border-gold/30 rounded-lg p-2.5 transition-all duration-300 relative group cursor-crosshair text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] text-text-secondary font-bold font-mono">{node.id}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    node.status === 'WARN' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                </div>
                <div className="text-[9px] font-bold text-white">{node.temp}°C</div>
                <div className="text-[8px] text-text-faint">ZONE_{node.zone}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Security Clearance telemetry (Row 2, Col 3) */}
        <div className="bg-abyss/85 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.03] pb-2">
            <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">sys_node_redundancy</span>
            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck size={11} /> LOCKED
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'HVAC_STABILITY', status: 'OK', val: '99.9%' },
              { id: 'RFID_GATEWAYS', status: 'OK', val: '24/24' },
              { id: 'DECI_LEVEL', status: 'NOMINAL', val: '94 dB' },
            ].map((node) => (
              <div key={node.id} className="flex items-center justify-between text-[10px] border-b border-white/[0.02] pb-2">
                <span className="text-text-secondary">{node.id}</span>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted font-mono">{node.val}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[8px] text-text-faint mb-1.5">
              <span>CORE TEMPERATURE THRESHOLD</span>
              <span>NOMINAL (42.4°C)</span>
            </div>
            <div className="w-full h-1 bg-white/[0.02] rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full w-[42%]" style={{ background: '#E5C158' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
