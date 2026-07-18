import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles, ChevronDown, ArrowRight, Zap, Shield, Map, BarChart3, Radio } from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   Cinematic Image Background with Ken Burns + Parallax
   ══════════════════════════════════════════════════════════ */
const CinematicBackground = ({ scrollProgress, mouseX, mouseY }) => {
  const images = ['/hero-bg.jpg', '/hero-bg-2.jpg'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Ken Burns: slow zoom + subtle pan
  const scale = useTransform(scrollProgress, [0, 0.5, 1], [1.1, 1.18, 1.25]);
  const imgX = useTransform(scrollProgress, [0, 0.5, 1], ['0%', '-1.5%', '-3%']);
  const imgY = useTransform(scrollProgress, [0, 0.5, 1], ['0%', '-2%', '-5%']);
  const blur = useTransform(scrollProgress, [0, 0.4, 0.8, 1], [0, 1, 3, 5]);
  const overlayOpacity = useTransform(scrollProgress, [0, 0.5, 1], [0.65, 0.78, 0.9]);

  // Mouse-reactive parallax offset
  const mxSmooth = useSpring(mouseX, { stiffness: 60, damping: 30 });
  const mySmooth = useSpring(mouseY, { stiffness: 60, damping: 30 });
  const parallaxX = useTransform(mxSmooth, [0, 1], [10, -10]);
  const parallaxY = useTransform(mySmooth, [0, 1], [6, -6]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      {/* Main image — Ken Burns + parallax with smooth AnimatePresence cross-fade */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={images[index]}
          className="absolute inset-[-40px]"
          style={{
            scale,
            x: parallaxX,
            y: parallaxY,
            translateX: imgX,
            translateY: imgY,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <motion.img
            src={images[index]}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: useTransform(blur, (b) => `blur(${b}px)`) }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays for depth + text readability */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: overlayOpacity }}
      >
        {/* Bottom heavy gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/80 to-transparent" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080C]/60 via-[#07080C]/20 to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080C]/55 via-transparent to-[#07080C]/55" />
      </motion.div>

      {/* Radial spotlight — follows mouse with golden ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [mxSmooth, mySmooth],
            ([mx, my]) =>
              `radial-gradient(800px circle at ${mx * 100}% ${my * 100}%, rgba(229,193,88,0.035), transparent 60%)`
          ),
        }}
      />

      {/* Cinematic film grain texture */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Animated light streak — cinematic lens flare */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: useTransform(scrollProgress, [0, 0.4], [1, 0]) }}
      >
        <motion.div
          className="absolute w-[200%] h-[1px]"
          style={{
            top: '32%',
            left: '-50%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(229,193,88,0.06) 30%, rgba(229,193,88,0.1) 50%, rgba(229,193,88,0.06) 70%, transparent 100%)',
          }}
          animate={{
            x: ['-30%', '30%'],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating particles over the image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <FloatingMote key={i} index={i} />
        ))}
      </div>
    </div>
  );
};

/* ── Floating light motes (dust/bokeh particles) ── */
const FloatingMote = ({ index }) => {
  const config = useMemo(() => ({
    size: Math.random() * 3.5 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    dur: Math.random() * 14 + 12,
    delay: Math.random() * 8,
    hue: [42, 38, 45, 35][index % 4], // Golden shades
    alpha: Math.random() * 0.25 + 0.08,
  }), [index]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: config.size,
        height: config.size,
        left: `${config.x}%`,
        top: `${config.y}%`,
        background: `hsla(${config.hue}, 80%, 75%, ${config.alpha})`,
        boxShadow: config.size > 2.5 ? `0 0 ${config.size * 3}px hsla(${config.hue}, 85%, 70%, ${config.alpha * 0.3})` : 'none',
      }}
      animate={{
        y: [0, -45 - Math.random() * 25, 0],
        x: [0, (Math.random() - 0.5) * 30, 0],
        opacity: [config.alpha * 0.3, config.alpha, config.alpha * 0.3],
        scale: [0.85, 1.15, 0.85],
      }}
      transition={{
        duration: config.dur,
        repeat: Infinity,
        delay: config.delay,
        ease: 'easeInOut',
      }}
    />
  );
};

/* ══════════════════════════════════════════════════════════
   Scroll Section Reveal
   ══════════════════════════════════════════════════════════ */
const ScrollRevealSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={vis ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   Floating Stat Orb
   ══════════════════════════════════════════════════════════ */
const FloatingOrb = ({ value, label, icon: Icon, color, delay }) => (
  <ScrollRevealSection delay={delay * 0.1}>
    <motion.div
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
      className="group relative"
    >
      <div className="relative glass rounded-2xl px-6 py-5 border border-white/[0.05] hover:border-gold/25 transition-all duration-500 overflow-hidden">
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
          style={{ background: `${color}15` }}
        />
        <div className="relative z-10">
          <Icon size={16} style={{ color }} className="mb-3" />
          <p className="text-2xl font-bold text-text-primary font-display tracking-tight">{value}</p>
          <p className="text-[11px] text-text-muted mt-1 tracking-wide uppercase">{label}</p>
        </div>
      </div>
    </motion.div>
  </ScrollRevealSection>
);

/* ══════════════════════════════════════════════════════════
   Feature Showcase Card
   ══════════════════════════════════════════════════════════ */
const FeatureShowcase = ({ title, description, icon: Icon, color, delay }) => (
  <ScrollRevealSection delay={delay * 0.06}>
    <motion.div
      className="group relative glass rounded-3xl p-8 overflow-hidden border border-white/[0.04] hover:border-gold/15 transition-all duration-700"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700"
        style={{ background: color }}
      />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}10` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <h3 className="text-xl font-semibold text-text-primary font-display mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </motion.div>
  </ScrollRevealSection>
);

/* ══════════════════════════════════════════════════════════
   Live Ticker
   ══════════════════════════════════════════════════════════ */
const TICKERS = [
  '87,432 fans entering MetLife Stadium',
  'AI monitoring 24 active gates in real-time',
  'Average wait time: 2.4 minutes — 18% below target',
  'Emergency routes optimized — all corridors clear',
];

const LiveTicker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TICKERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-text-muted flex items-center justify-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          {TICKERS[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   HERO — Cinematic Normal Flow with Image BG
   ══════════════════════════════════════════════════════════ */
const Hero = ({ onEnter }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Mouse tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handler = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);

  // Animated counter
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = 87432;
    const duration = 2800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const t = setTimeout(tick, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen text-text-primary overflow-x-hidden"
    >
      {/* ── Fixed background wrapper ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CinematicBackground scrollProgress={scrollYProgress} mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* ── Content container (normal flow with spacing to avoid overlaps) ── */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* ═══ SECTION 1: Hero splash ═══ */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-4xl w-full text-center flex flex-col items-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 mb-10 border border-white/[0.08] hover:border-gold/35 transition-colors duration-300"
            >
              <Radio size={11} className="text-gold animate-pulse-glow" style={{ color: '#E5C158' }} />
              <span className="text-[11px] font-medium text-text-secondary tracking-wide">
                FIFA World Cup 2026 · Live Intelligence Platform
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-center leading-[0.95] tracking-[-0.04em] mb-8">
              <motion.span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                The Future of
              </motion.span>
              <motion.span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold mt-2"
                style={{
                  background: 'linear-gradient(135deg, #FFF 20%, #E5C158 60%, #C5A03A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                Stadium Intelligence
              </motion.span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-10"
            >
              AI-powered crowd analytics, real-time stadium mapping, and intelligent event
              coordination — engineered for the world's largest sporting event.
            </motion.p>

            {/* Live counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex items-center gap-3 mb-10"
            >
              <span className="text-4xl sm:text-5xl font-display font-bold tracking-tight" style={{ color: '#E5C158' }}>
                {count.toLocaleString()}
              </span>
              <span className="text-sm text-white/50 text-left">fans tracked<br />in real-time</span>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnter}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-void text-base overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #E5C158 0%, #C5A03A 100%)',
                boxShadow: '0 0 35px rgba(229,193,88,0.25)',
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Sparkles size={18} className="relative z-10" />
              <span className="relative z-10">Enter Command Center</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              className="mt-8"
            >
              <LiveTicker />
            </motion.div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.25em]">Scroll to explore</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown size={14} className="text-white/30" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: Live Telemetry Stats ═══ */}
        <section className="min-h-screen w-full flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl w-full text-center">
            <ScrollRevealSection>
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: '#E5C158' }}>Live Telemetry</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.95] mb-16">
                Every metric,{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #E5C158, #FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>every second.</span>
              </h2>
            </ScrollRevealSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <FloatingOrb value="87,432" label="Active Fans" icon={Zap} color="#E5C158" delay={0} />
              <FloatingOrb value="98.7%" label="Safety Score" icon={Shield} color="#E5C158" delay={1} />
              <FloatingOrb value="24/24" label="Gates Open" icon={Map} color="#E5C158" delay={2} />
              <FloatingOrb value="2.4 min" label="Avg Wait" icon={BarChart3} color="#E5C158" delay={3} />
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: Feature Grid ═══ */}
        <section className="min-h-screen w-full flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl w-full">
            <ScrollRevealSection className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: '#E5C158' }}>Platform Capabilities</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Built for the{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #FFF, #E5C158)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>impossible scale.</span>
              </h2>
            </ScrollRevealSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureShowcase icon={Map} title="Interactive Stadium Map" description="Real-time SVG heatmap with section-level density tracking, emergency route visualization, and interactive hotspot navigation." color="#E5C158" delay={0} />
              <FeatureShowcase icon={Sparkles} title="Sophia AI Coordinator" description="Conversational AI assistant with streaming responses, contextual stadium awareness, and predictive crowd management." color="#E5C158" delay={1} />
              <FeatureShowcase icon={BarChart3} title="Predictive Analytics" description="Machine learning-powered crowd flow predictions with 94.2% accuracy based on historical match-day patterns." color="#E5C158" delay={2} />
              <FeatureShowcase icon={Shield} title="Emergency Response" description="One-click protocol activation with automated PA broadcasting, security dispatch, and evacuation path optimization." color="#E5C158" delay={3} />
              <FeatureShowcase icon={Zap} title="Real-Time Telemetry" description="Sub-second data streaming from 200+ IoT sensors monitoring crowd density, temperature, air quality, and noise levels." color="#E5C158" delay={4} />
              <FeatureShowcase icon={Radio} title="Live Communications" description="Integrated command channel for security teams, medical responders, and stadium operations with priority routing." color="#E5C158" delay={5} />
            </div>

            <ScrollRevealSection className="mt-16 text-center" delay={0.2}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onEnter}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-sm glass border border-white/[0.08] hover:border-gold/30 transition-all duration-500 cursor-pointer"
              >
                <span className="text-white">Launch Dashboard</span>
                <ArrowRight size={16} className="text-gold group-hover:translate-x-1 transition-transform" style={{ color: '#E5C158' }} />
              </motion.button>
            </ScrollRevealSection>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
