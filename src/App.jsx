import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import DashboardLayout from './components/DashboardLayout';
import CommandPalette from './components/ui/CommandPalette';

const App = () => {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = useState('overview');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for Command Palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const enterDashboard = useCallback(() => {
    setScreen('dashboard');
  }, []);

  const handleCommandSelect = useCallback((command) => {
    setCommandPaletteOpen(false);
    if (command.tab) {
      setActiveTab(command.tab);
      if (screen !== 'dashboard') setScreen('dashboard');
    }
  }, [screen]);

  return (
    <>
      {/* Aurora background — only on dashboard (hero has its own cinematic bg) */}
      {screen === 'dashboard' && <div className="aurora-bg" />}
      {screen === 'dashboard' && <div className="noise-overlay" />}

      {/* Command Palette overlay */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelect={handleCommandSelect}
      />

      {/* Screen content */}
      <AnimatePresence mode="wait">
        {screen === 'landing' ? (
          <Hero key="hero" onEnter={enterDashboard} />
        ) : (
          <DashboardLayout
            key="dashboard"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCommandPalette={() => setCommandPaletteOpen(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
