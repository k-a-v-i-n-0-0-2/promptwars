import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Sparkles,
  BarChart3,
  ShieldAlert,
  Search,
  Bell,
  Settings,
} from 'lucide-react';

const Overview = lazy(() => import('./Overview'));
const InteractiveMap = lazy(() => import('./InteractiveMap'));
const AIAssistant = lazy(() => import('./AIAssistant'));
const AnalyticsPanel = lazy(() => import('./AnalyticsPanel'));
const EmergencyCenter = lazy(() => import('./EmergencyCenter'));

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'map', label: 'Stadium Map', icon: Map },
  { id: 'ai', label: 'Sophia AI', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
];

const PAGE_MAP = {
  overview: Overview,
  map: InteractiveMap,
  ai: AIAssistant,
  analytics: AnalyticsPanel,
  emergency: EmergencyCenter,
};

/* ──────────────────────────────────────────────────────────
   Sidebar Nav Item
   ────────────────────────────────────────────────────────── */
const SidebarItem = ({ item, active, onClick }) => (
  <button
    onClick={() => onClick(item.id)}
    className={`
      relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer
      ${active
        ? 'text-gold bg-gold/5 border border-gold/15'
        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02] border border-transparent'
      }
    `}
  >
    {/* Active indicator glow */}
    {active && (
      <motion.div
        layoutId="sidebar-active-glow"
        className="absolute inset-0 rounded-2xl bg-gold/[0.02] shadow-[inset_0_0_12px_rgba(229,193,88,0.05)] pointer-events-none"
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
    )}
    <item.icon size={15} style={active ? { color: '#E5C158' } : {}} />
    <span className="hidden lg:inline">{item.label}</span>
  </button>
);

/* ──────────────────────────────────────────────────────────
   Dashboard Layout Shell REDESIGN (Premium Floating Card theme)
   ────────────────────────────────────────────────────────── */
const DashboardLayout = ({ activeTab, onTabChange, onCommandPalette }) => {
  const ActivePage = PAGE_MAP[activeTab] || Overview;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex min-h-screen p-4 sm:p-5 gap-5 bg-void text-text-primary"
    >
      {/* ── Sidebar (Floating Premium Panel) ── */}
      <aside aria-label="Main navigation" className="hidden md:flex flex-col w-18 lg:w-64 glass-strong rounded-3xl border border-white/[0.05] h-[calc(100vh-40px)] sticky top-5 z-40 shrink-0 p-4 shadow-elevated">
        
        {/* Header/Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-amber flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(229,193,88,0.2)]">
            <Sparkles size={15} className="text-void" style={{ color: '#07080C' }} />
          </div>
          <div className="hidden lg:block">
            <h2 className="text-sm font-bold text-white tracking-tight font-display uppercase">ArenaAI</h2>
            <p className="text-[9px] text-text-muted font-bold tracking-wider">MetLife Command</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav aria-label="Primary" className="flex-1 flex flex-col gap-1.5 py-2">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              active={activeTab === item.id}
              onClick={onTabChange}
            />
          ))}
        </nav>

        {/* Bottom utility */}
        <div className="pt-3 border-t border-white/[0.04]">
          <button
            onClick={onCommandPalette}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-secondary hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
          >
            <Search size={14} />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline ml-auto text-[9px] text-text-faint bg-surface-raised px-1.5 py-0.5 rounded border border-border-subtle">⌘K</kbd>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace Panel ── */}
      <div className="flex-1 flex flex-col min-h-0 pb-16 md:pb-0">
        
        {/* Workspace Top bar */}
        <header role="banner" className="glass-strong border border-white/[0.05] rounded-3xl px-6 py-4 flex items-center justify-between shadow-elevated mb-5">
          <div>
            <span className="text-[9px] text-text-muted font-bold tracking-widest uppercase">System workspace</span>
            <h1 className="text-base font-bold text-white font-display tracking-tight uppercase mt-0.5">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Live active connection node */}
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Feed Live</span>
            </div>
            
            <div className="h-4 w-[1px] bg-white/[0.05]" />

            <button aria-label="Notifications" className="p-2 rounded-xl hover:bg-white/[0.03] transition-colors text-text-muted hover:text-text-secondary cursor-pointer border border-transparent hover:border-white/[0.04]">
              <Bell size={16} />
            </button>
            <button aria-label="Settings" className="p-2 rounded-xl hover:bg-white/[0.03] transition-colors text-text-muted hover:text-text-secondary cursor-pointer border border-transparent hover:border-white/[0.04]">
              <Settings size={16} />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main id="main-content" className="flex-1 min-h-0 overflow-y-auto relative">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan"></span>
              </span>
            </div>
          }>
            <ActivePage />
          </Suspense>
        </main>
      </div>

      {/* ── Bottom Nav (Mobile/Tablet viewport) ── */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-4 left-4 right-4 z-40 glass-strong border border-white/[0.06] rounded-2xl flex items-center justify-around px-2 py-2 shadow-elevated">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer
                ${active ? 'text-gold bg-gold/5 border border-gold/10' : 'text-text-secondary'}`}
            >
              <item.icon size={16} style={active ? { color: '#E5C158' } : {}} />
              <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default DashboardLayout;
