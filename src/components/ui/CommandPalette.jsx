import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Map,
  Sparkles,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  Command,
} from 'lucide-react';

const COMMANDS = [
  { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, tab: 'overview', category: 'Navigation' },
  { id: 'map', label: 'Stadium Map', icon: Map, tab: 'map', category: 'Navigation' },
  { id: 'ai', label: 'Sophia AI Assistant', icon: Sparkles, tab: 'ai', category: 'Navigation' },
  { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3, tab: 'analytics', category: 'Navigation' },
  { id: 'emergency', label: 'Emergency Center', icon: ShieldAlert, tab: 'emergency', category: 'Navigation' },
];

const CommandPalette = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      onSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-elevated border border-glass-border">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-glass-border">
                <Search size={18} className="text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                />
                <kbd className="text-[10px] text-text-faint bg-surface-raised px-2 py-1 rounded border border-border-subtle">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div role="listbox" className="max-h-[300px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    No commands found
                  </div>
                ) : (
                  filtered.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      role="option"
                      aria-selected={i === selectedIndex}
                      onClick={() => onSelect(cmd)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors duration-150 cursor-pointer ${
                        i === selectedIndex
                          ? 'bg-cyan/8 text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <cmd.icon size={16} className={i === selectedIndex ? 'text-cyan' : 'text-text-muted'} />
                      <span className="flex-1 text-left">{cmd.label}</span>
                      <span className="text-[10px] text-text-faint">{cmd.category}</span>
                      {i === selectedIndex && <ArrowRight size={12} className="text-cyan" />}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-glass-border text-[10px] text-text-faint">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-surface-raised px-1.5 py-0.5 rounded border border-border-subtle">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-surface-raised px-1.5 py-0.5 rounded border border-border-subtle">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Command size={10} />
                  K to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
