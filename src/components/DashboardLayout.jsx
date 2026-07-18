import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map, Sparkles, BarChart3, ShieldAlert,
  Search, Bell, Settings, Briefcase, Users, Navigation2,
  Heart, CloudRain, Users2, Wrench, Target, Coffee, Activity, Car
} from 'lucide-react';
import useRoleAccess, { ROLES } from '../hooks/useRoleAccess';
import useStadiumData from '../hooks/useStadiumData';
import ErrorBoundary from './ui/ErrorBoundary';

const Overview = lazy(() => import('./Overview'));
const InteractiveMap = lazy(() => import('./InteractiveMap'));
const AIAssistant = lazy(() => import('./AIAssistant'));
const AnalyticsPanel = lazy(() => import('./AnalyticsPanel'));
const EmergencyCenter = lazy(() => import('./EmergencyCenter'));

// New Modules
const ExecutiveDashboard = lazy(() => import('./modules/ExecutiveDashboard'));
const CrowdIntelligence = lazy(() => import('./modules/CrowdIntelligence'));
const SecurityCommand = lazy(() => import('./modules/SecurityCommand'));
const MedicalDispatch = lazy(() => import('./modules/MedicalDispatch'));
const TransportIntelligence = lazy(() => import('./modules/TransportIntelligence'));
const FoodOperations = lazy(() => import('./modules/FoodOperations'));
const WeatherIntelligence = lazy(() => import('./modules/WeatherIntelligence'));
const VolunteerManagement = lazy(() => import('./modules/VolunteerManagement'));
const MaintenanceOps = lazy(() => import('./modules/MaintenanceOps'));
const RiskForecasting = lazy(() => import('./modules/RiskForecasting'));

const NAV_GROUPS = [
  {
    category: 'Command',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'executive', label: 'Executive Command', icon: Briefcase },
      { id: 'risk', label: 'Risk Forecasting', icon: Target },
    ]
  },
  {
    category: 'Operations',
    items: [
      { id: 'crowd', label: 'Crowd Flow', icon: Users },
      { id: 'transport', label: 'Transport & Parking', icon: Car },
      { id: 'food', label: 'Food & Vendor', icon: Coffee },
    ]
  },
  {
    category: 'Safety',
    items: [
      { id: 'security', label: 'Security Command', icon: ShieldAlert },
      { id: 'medical', label: 'Medical Dispatch', icon: Heart },
      { id: 'emergency', label: 'Emergency Center', icon: Activity },
    ]
  },
  {
    category: 'Facilities',
    items: [
      { id: 'maintenance', label: 'Maintenance', icon: Wrench },
      { id: 'weather', label: 'Weather Impact', icon: CloudRain },
      { id: 'volunteer', label: 'Volunteer Mgmt', icon: Users2 },
    ]
  },
  {
    category: 'Intelligence',
    items: [
      { id: 'map', label: 'Stadium Map', icon: Map },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'ai', label: 'Sophia AI', icon: Sparkles },
    ]
  }
];

const PAGE_MAP = {
  overview: Overview,
  executive: ExecutiveDashboard,
  risk: RiskForecasting,
  crowd: CrowdIntelligence,
  transport: TransportIntelligence,
  food: FoodOperations,
  security: SecurityCommand,
  medical: MedicalDispatch,
  emergency: EmergencyCenter,
  maintenance: MaintenanceOps,
  weather: WeatherIntelligence,
  volunteer: VolunteerManagement,
  map: InteractiveMap,
  analytics: AnalyticsPanel,
  ai: AIAssistant,
};

const SidebarItem = ({ item, active, onClick }) => (
  <button
    role="tab"
    aria-selected={active}
    aria-controls={`panel-${item.id}`}
    id={`tab-${item.id}`}
    onClick={() => onClick(item.id)}
    className={`
      relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer
      ${active
        ? 'text-gold bg-gold/5 border border-gold/15'
        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02] border border-transparent'
      }
    `}
  >
    {active && (
      <motion.div
        layoutId="sidebar-active-glow"
        className="absolute inset-0 rounded-xl bg-gold/[0.02] shadow-[inset_0_0_12px_rgba(229,193,88,0.05)] pointer-events-none"
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
    )}
    <item.icon size={15} style={active ? { color: '#E5C158' } : {}} />
    <span className="hidden lg:inline">{item.label}</span>
  </button>
);

const DashboardLayout = ({ activeTab, onTabChange, onCommandPalette }) => {
  const { activeRole, setRole, hasAccessToModule, currentRole } = useRoleAccess('admin');
  const stadiumData = useStadiumData();
  const ActivePage = PAGE_MAP[activeTab] || Overview;

  // Auto-switch tab if current role loses access
  useEffect(() => {
    if (!hasAccessToModule(activeTab)) {
      onTabChange('overview');
    }
  }, [activeRole, activeTab, hasAccessToModule, onTabChange]);

  const allNavItems = NAV_GROUPS.flatMap(g => g.items);

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
        <div className="flex items-center justify-between mb-4 px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-amber flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(229,193,88,0.2)]">
              <Sparkles size={15} className="text-void" style={{ color: '#07080C' }} />
            </div>
            <div className="hidden lg:block">
              <h2 className="text-sm font-bold text-white tracking-tight font-display uppercase">ArenaAI</h2>
              <p className="text-[9px] text-text-muted font-bold tracking-wider">Command Center</p>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div className="hidden lg:block mb-4 px-2">
          <label htmlFor="role-select" className="sr-only">Select Role</label>
          <select
            id="role-select"
            value={activeRole}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-void/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white uppercase tracking-wider font-bold appearance-none cursor-pointer focus:outline-none focus:border-cyan transition-colors"
          >
            {Object.values(ROLES).map(role => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </div>

        {/* Nav Items grouped */}
        <nav role="tablist" aria-label="Primary" className="flex-1 flex flex-col gap-3 py-2 overflow-y-auto custom-scrollbar pr-1">
          {NAV_GROUPS.map(group => {
            const accessibleItems = group.items.filter(item => hasAccessToModule(item.id));
            if (accessibleItems.length === 0) return null;

            return (
              <div key={group.category} className="mb-2">
                <h3 className="hidden lg:block text-[9px] uppercase font-bold text-text-faint tracking-widest px-3 mb-2">
                  {group.category}
                </h3>
                <div className="flex flex-col gap-1">
                  {accessibleItems.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      active={activeTab === item.id}
                      onClick={onTabChange}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom utility */}
        <div className="pt-3 border-t border-white/[0.04] mt-2">
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
            <span className="text-[9px] text-text-muted font-bold tracking-widest uppercase">
              {currentRole.label} Workspace
            </span>
            <h1 className="text-base font-bold text-white font-display tracking-tight uppercase mt-0.5">
              {allNavItems.find((n) => n.id === activeTab)?.label || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-full px-3 py-1.5" aria-live="polite">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Feed Live</span>
            </div>
            
            <div className="h-4 w-[1px] bg-white/[0.05]" />

            <button aria-label="Notifications" className="p-2 rounded-xl hover:bg-white/[0.03] transition-colors text-text-muted hover:text-text-secondary cursor-pointer border border-transparent hover:border-white/[0.04]">
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main 
          id="main-content" 
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="flex-1 min-h-0 overflow-y-auto relative custom-scrollbar"
        >
          <ErrorBoundary>
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan"></span>
                </span>
              </div>
            }>
              <ActivePage stadiumData={stadiumData} />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </motion.div>
  );
};

export default DashboardLayout;
