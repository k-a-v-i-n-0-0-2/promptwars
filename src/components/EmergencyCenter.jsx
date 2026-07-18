import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Siren,
  MapPin,
  Users,
  Phone,
  FileText,
  ChevronRight,
  X,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Emergency checklist items
   ────────────────────────────────────────────────────────── */
const CHECKLIST = [
  { id: 1, text: 'Activate PA emergency broadcast system', critical: true },
  { id: 2, text: 'Notify stadium security team leads (24 units)', critical: true },
  { id: 3, text: 'Deploy medical response teams to affected area', critical: true },
  { id: 4, text: 'Open all emergency exit gates', critical: false },
  { id: 5, text: 'Activate crowd dispersion algorithm', critical: false },
  { id: 6, text: 'Notify local emergency services (911)', critical: true },
  { id: 7, text: 'Enable real-time crowd tracking overlay', critical: false },
  { id: 8, text: 'Suspend concession operations in affected zone', critical: false },
  { id: 9, text: 'Activate backup communication channels', critical: false },
  { id: 10, text: 'Generate incident report', critical: false },
];

const EVAC_ROUTES = [
  { id: 'route-n', label: 'North Exit Route', gates: 'Gates 1, 2', capacity: '15,000/hr', status: 'ready' },
  { id: 'route-s', label: 'South Exit Route', gates: 'Gates 3, 4', capacity: '12,000/hr', status: 'ready' },
  { id: 'route-e', label: 'East Emergency', gates: 'Emergency Exit E1-E4', capacity: '8,000/hr', status: 'standby' },
  { id: 'route-w', label: 'West Emergency', gates: 'Emergency Exit W1-W4', capacity: '8,000/hr', status: 'standby' },
];

const CONTACTS = [
  { name: 'Chief Security Officer', phone: '+1 (555) 000-1234', status: 'online' },
  { name: 'Medical Director', phone: '+1 (555) 000-5678', status: 'online' },
  { name: 'Fire Marshal', phone: '+1 (555) 000-9012', status: 'online' },
  { name: 'Local Police Liaison', phone: '+1 (555) 000-3456', status: 'standby' },
];

/* ──────────────────────────────────────────────────────────
   Emergency Center Component
   ────────────────────────────────────────────────────────── */
const EmergencyCenter = () => {
  const [activeProtocol, setActiveProtocol] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [selectedRoute, setSelectedRoute] = useState(null);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = checkedItems.size;
  const progress = (completedCount / CHECKLIST.length) * 100;

  return (
    <div className="space-y-6">
      {/* Protocol activation banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 border transition-all duration-500 ${
          activeProtocol
            ? 'bg-rose/8 border-rose/25'
            : 'glass border-glass-border'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`rounded-xl p-3 ${activeProtocol ? 'bg-rose/15' : 'bg-amber/10'}`}>
              {activeProtocol ? (
                <Siren size={24} className="text-rose animate-pulse" />
              ) : (
                <ShieldAlert size={24} className="text-amber" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary font-display">
                {activeProtocol ? 'Emergency Protocol Active' : 'Emergency Response Center'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {activeProtocol
                  ? `Protocol activated — ${completedCount}/${CHECKLIST.length} items completed`
                  : 'All systems nominal — no active emergencies'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveProtocol(!activeProtocol)}
            aria-pressed={activeProtocol}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeProtocol
                ? 'bg-surface-raised text-text-primary hover:bg-surface-overlay border border-border'
                : 'bg-rose text-white hover:bg-rose/90'
            }`}
          >
            {activeProtocol ? 'Deactivate Protocol' : 'Activate Emergency Protocol'}
          </button>
        </div>

        {/* Progress bar */}
        {activeProtocol && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between text-xs text-text-muted mb-2">
              <span>Response Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose to-amber"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <FileText size={16} className="text-amber" />
            <h3 className="text-sm font-semibold text-text-primary">Response Checklist</h3>
          </div>

          <div className="space-y-2">
            {CHECKLIST.map((item) => {
              const checked = checkedItems.has(item.id);
              return (
                <motion.button
                  key={item.id}
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => activeProtocol && toggleCheck(item.id)}
                  layout
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 cursor-pointer ${
                    checked
                      ? 'bg-emerald/8 border border-emerald/20 text-emerald'
                      : activeProtocol
                        ? 'glass hover:bg-white/[0.03] text-text-secondary'
                        : 'bg-surface-raised/50 text-text-faint'
                  }`}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    checked ? 'bg-emerald border-emerald' : 'border-border'
                  }`}>
                    {checked && <CheckCircle2 size={12} className="text-void" />}
                  </div>
                  <span className={checked ? 'line-through opacity-70' : ''}>{item.text}</span>
                  {item.critical && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-2 py-0.5 rounded-full shrink-0">
                      Critical
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar: Routes + Contacts */}
        <div className="space-y-4">
          {/* Evacuation routes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Evacuation Routes</h3>
            </div>

            <div className="space-y-2">
              {EVAC_ROUTES.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                    selectedRoute === route.id
                      ? 'glass border border-cyan/20'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-text-primary">{route.label}</span>
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      route.status === 'ready' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'
                    }`}>
                      {route.status}
                    </span>
                  </div>
                  <AnimatePresence>
                    {selectedRoute === route.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-1 text-text-muted"
                      >
                        <p>Gates: {route.gates}</p>
                        <p>Capacity: {route.capacity}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Emergency contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Phone size={16} className="text-emerald" />
              <h3 className="text-sm font-semibold text-text-primary">Emergency Contacts</h3>
            </div>

            <div className="space-y-3">
              {CONTACTS.map((contact) => (
                <div key={contact.name} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    contact.status === 'online' ? 'bg-emerald' : 'bg-amber'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{contact.name}</p>
                    <p className="text-[10px] text-text-muted">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCenter;
