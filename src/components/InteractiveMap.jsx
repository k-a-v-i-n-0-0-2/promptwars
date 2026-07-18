import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  X,
  Play,
  Pause,
  DoorOpen,
  Utensils,
  Cross,
  Car,
  Volume2,
  VolumeX,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Mock Data & Telemetry Definitions
   ────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'north', label: 'North Stand', color: 'rgba(52, 211, 153, 0.25)', border: '#34d399', density: 0.92, fans: 22340, details: 'Level 1-3. High entry rate at Gate 2.' },
  { id: 'south', label: 'South Stand', color: 'rgba(167, 139, 250, 0.25)', border: '#a78bfa', density: 0.78, fans: 19120, details: 'Level 1-3. Concessions normal.' },
  { id: 'east', label: 'East Stand', color: 'rgba(34, 211, 238, 0.25)', border: '#22d3ee', density: 0.65, fans: 12400, details: 'Level 1-2. Low queues.' },
  { id: 'west', label: 'West Stand', color: 'rgba(251, 113, 133, 0.25)', border: '#fb7185', density: 0.88, fans: 18900, details: 'VIP & Press areas. Security clearance nominal.' },
];

const HOTSPOTS = [
  { id: 'gate1', icon: DoorOpen, label: 'Gate 1', x: 230, y: 190, status: 'open', detail: 'Wait: 1.2 min' },
  { id: 'gate2', icon: DoorOpen, label: 'Gate 2', x: 295, y: 110, status: 'open', detail: 'Wait: 3.8 min' },
  { id: 'gate3', icon: DoorOpen, label: 'Gate 3', x: 360, y: 190, status: 'open', detail: 'Wait: 0.9 min' },
  { id: 'gate4', icon: DoorOpen, label: 'Gate 4', x: 295, y: 270, status: 'open', detail: 'Wait: 2.1 min' },
  { id: 'food1', icon: Utensils, label: 'Concession Zone A', x: 260, y: 155, status: 'busy', detail: 'Queue: 8 min' },
  { id: 'food2', icon: Utensils, label: 'Concession Zone B', x: 330, y: 220, status: 'normal', detail: 'Queue: 3 min' },
  { id: 'medical', icon: Cross, label: 'First Aid Unit', x: 295, y: 190, status: 'ready', detail: '2 staff active' },
];

const getDensityColorString = (d) => {
  if (d > 0.85) return 'text-rose-400';
  if (d > 0.65) return 'text-amber-400';
  return 'text-emerald-400';
};

const statusColor = (s) => {
  switch (s) {
    case 'busy': return '#FB7185';
    case 'available': case 'open': case 'ready': case 'normal': return '#34D399';
    default: return '#E5C158';
  }
};

const InteractiveMap = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);

  const selectedSection = SECTIONS.find(s => s.id === selectedId);
  const selectedHotspot = HOTSPOTS.find(h => h.id === selectedId);
  const hoveredSection = SECTIONS.find(s => s.id === hoveredId);
  const hoveredHotspot = HOTSPOTS.find(h => h.id === hoveredId);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and media controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary font-display">Live Stadium Telemetry</h2>
          <p className="text-xs text-text-muted">MetLife Arena — Real video feedback with interactive overlay</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 glass rounded-lg hover:bg-white/[0.04] transition-colors text-text-secondary cursor-pointer text-xs flex items-center gap-1.5"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Feed' : 'Live Feed'}</span>
          </button>
          <button
            onClick={toggleMute}
            className="p-2 glass rounded-lg hover:bg-white/[0.04] transition-colors text-text-secondary cursor-pointer text-xs flex items-center gap-1.5"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'Muted' : 'Audio'}</span>
          </button>
          <button
            onClick={() => setSelectedId(null)}
            className="p-2 glass rounded-lg hover:bg-white/[0.04] transition-colors text-text-secondary cursor-pointer text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video Map Container */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden relative min-h-[400px] border border-white/[0.05] shadow-glow-sm">
          {/* Real Stadium Video Feed */}
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-drone-shot-of-a-huge-soccer-stadium-at-night-40742-large.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Vignette Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40 pointer-events-none z-10" />

          {/* Hover / Selection Tag Overlay */}
          {(hoveredSection || hoveredHotspot) && (
            <div className="absolute top-4 left-4 bg-void/85 border border-gold/30 rounded-lg px-3 py-1.5 text-xs text-gold font-medium pointer-events-none z-20 shadow-lg">
              {hoveredSection ? hoveredSection.label : hoveredHotspot.label}
            </div>
          )}

          {/* Interactive SVG Overlay mapped on top of the stadium video */}
          <svg
            viewBox="0 0 600 380"
            className="absolute inset-0 w-full h-full z-20 cursor-pointer select-none"
          >
            {/* North Stand overlay path */}
            <motion.path
              d="M 180 130 L 420 130 L 410 70 L 190 70 Z"
              fill={selectedId === 'north' ? 'rgba(52, 211, 153, 0.35)' : hoveredId === 'north' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(52, 211, 153, 0.05)'}
              stroke={selectedId === 'north' ? '#34d399' : hoveredId === 'north' ? 'rgba(52, 211, 153, 0.8)' : 'rgba(52, 211, 153, 0.2)'}
              strokeWidth={selectedId === 'north' || hoveredId === 'north' ? 2 : 1}
              onClick={() => setSelectedId('north')}
              onMouseEnter={() => setHoveredId('north')}
              onMouseLeave={() => setHoveredId(null)}
              className="transition-colors duration-200"
            />

            {/* South Stand overlay path */}
            <motion.path
              d="M 180 250 L 420 250 L 410 310 L 190 310 Z"
              fill={selectedId === 'south' ? 'rgba(167, 139, 250, 0.35)' : hoveredId === 'south' ? 'rgba(167, 139, 250, 0.2)' : 'rgba(167, 139, 250, 0.05)'}
              stroke={selectedId === 'south' ? '#a78bfa' : hoveredId === 'south' ? 'rgba(167, 139, 250, 0.8)' : 'rgba(167, 139, 250, 0.2)'}
              strokeWidth={selectedId === 'south' || hoveredId === 'south' ? 2 : 1}
              onClick={() => setSelectedId('south')}
              onMouseEnter={() => setHoveredId('south')}
              onMouseLeave={() => setHoveredId(null)}
              className="transition-colors duration-200"
            />

            {/* East Stand overlay path */}
            <motion.path
              d="M 420 130 L 420 250 L 470 230 L 470 150 Z"
              fill={selectedId === 'east' ? 'rgba(34, 211, 238, 0.35)' : hoveredId === 'east' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(34, 211, 238, 0.05)'}
              stroke={selectedId === 'east' ? '#22d3ee' : hoveredId === 'east' ? 'rgba(34, 211, 238, 0.8)' : 'rgba(34, 211, 238, 0.2)'}
              strokeWidth={selectedId === 'east' || hoveredId === 'east' ? 2 : 1}
              onClick={() => setSelectedId('east')}
              onMouseEnter={() => setHoveredId('east')}
              onMouseLeave={() => setHoveredId(null)}
              className="transition-colors duration-200"
            />

            {/* West Stand overlay path */}
            <motion.path
              d="M 180 130 L 180 250 L 130 230 L 130 150 Z"
              fill={selectedId === 'west' ? 'rgba(251, 113, 133, 0.35)' : hoveredId === 'west' ? 'rgba(251, 113, 133, 0.2)' : 'rgba(251, 113, 133, 0.05)'}
              stroke={selectedId === 'west' ? '#fb7185' : hoveredId === 'west' ? 'rgba(251, 113, 133, 0.8)' : 'rgba(251, 113, 133, 0.2)'}
              strokeWidth={selectedId === 'west' || hoveredId === 'west' ? 2 : 1}
              onClick={() => setSelectedId('west')}
              onMouseEnter={() => setHoveredId('west')}
              onMouseLeave={() => setHoveredId(null)}
              className="transition-colors duration-200"
            />

            {/* Hotspot Markers */}
            {HOTSPOTS.map((h) => {
              const color = statusColor(h.status);
              const isSelected = selectedId === h.id;
              const isHovered = hoveredId === h.id;

              return (
                <g
                  key={h.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(h.id);
                  }}
                  onMouseEnter={() => setHoveredId(h.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Outer pulse */}
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={isSelected || isHovered ? 12 : 8}
                    fill={color}
                    fillOpacity={isSelected || isHovered ? 0.35 : 0.15}
                    stroke={color}
                    strokeWidth={1}
                    className="transition-all duration-300"
                  />
                  {/* Inner solid dot */}
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={isSelected || isHovered ? 5 : 3}
                    fill={color}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[10px] text-text-muted bg-void/70 backdrop-blur-sm p-2 rounded-lg border border-white/[0.05] pointer-events-none z-30">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/70" /> Normal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/70" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/70" /> Busy</span>
          </div>
        </div>

        {/* Telemetry Info Panel */}
        <div className="glass rounded-2xl p-5 space-y-4 flex flex-col justify-between border border-white/[0.05]">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 font-display">Telemetry details</h3>

            <AnimatePresence mode="wait">
              {selectedSection && (
                <motion.div
                  key={selectedSection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{selectedSection.label}</span>
                    <button onClick={() => setSelectedId(null)} className="text-text-muted hover:text-text-secondary cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass rounded-xl p-3 border border-white/[0.03]">
                      <p className="text-[10px] text-text-muted">Occupancy</p>
                      <p className={`text-lg font-bold ${getDensityColorString(selectedSection.density)}`}>
                        {Math.round(selectedSection.density * 100)}%
                      </p>
                    </div>
                    <div className="glass rounded-xl p-3 border border-white/[0.03]">
                      <p className="text-[10px] text-text-muted">Live fans</p>
                      <p className="text-lg font-bold text-text-primary">{selectedSection.fans.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-text-secondary leading-relaxed">
                    {selectedSection.details}
                  </div>
                  {selectedSection.density > 0.85 && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <AlertTriangle size={15} className="text-rose-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-rose-300 leading-tight">Density alert: Exceeding 85% safe threshold. Activating flow redirections to side corridors.</span>
                    </div>
                  )}
                </motion.div>
              )}

              {selectedHotspot && (
                <motion.div
                  key={selectedHotspot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{selectedHotspot.label}</span>
                    <button onClick={() => setSelectedId(null)} className="text-text-muted hover:text-text-secondary cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="glass rounded-xl p-3.5 border border-white/[0.03]">
                    <p className="text-[10px] text-text-muted mb-1">Status</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      selectedHotspot.status === 'busy' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {selectedHotspot.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="glass rounded-xl p-3.5 border border-white/[0.03]">
                    <p className="text-[10px] text-text-muted">Wait metrics</p>
                    <p className="text-sm font-medium text-text-primary mt-1">{selectedHotspot.detail}</p>
                  </div>
                </motion.div>
              )}

              {!selectedId && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <Users size={32} className="text-text-faint mb-3" />
                  <p className="text-sm text-text-muted">No element selected</p>
                  <p className="text-xs text-text-faint mt-1.5 max-w-[180px]">Hover and click sections or pins on the live video map to view telemetry.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
