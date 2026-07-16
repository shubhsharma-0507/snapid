'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Upload, Sparkles, Star, CheckCircle2, Zap, Shield, Globe } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';

// ── Particle System ───────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: (i * 37.3) % 100,
  y: (i * 61.7) % 100,
  size: (i % 4) + 1.5,
  duration: 6 + (i % 8),
  delay: (i * 0.3) % 5,
  color: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#8B5CF6' : '#FFD700',
  opacity: 0.3 + (i % 5) * 0.1,
}));

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, opacity: p.opacity }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.id % 2 === 0 ? 15 : -15, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Orbiting Rings ────────────────────────────────────────────────────────────
function OrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[200, 320, 440, 560].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size, height: size,
            borderColor: i % 2 === 0 ? 'rgba(0,212,255,0.12)' : 'rgba(139,92,246,0.10)',
            borderStyle: i === 1 ? 'dashed' : 'solid',
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
        >
          {/* Orbiting dot */}
          <motion.div
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: -4, left: '50%', marginLeft: -4,
              background: i % 2 === 0 ? '#00d4ff' : '#8B5CF6',
              boxShadow: `0 0 8px ${i % 2 === 0 ? '#00d4ff' : '#8B5CF6'}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ── 3D Floating Cards ─────────────────────────────────────────────────────────
const CARDS = [
  { flag: '🇮🇳', label: 'India Passport', size: '35×45mm', color: '#FF6B00', delay: 0 },
  { flag: '🇺🇸', label: 'USA Visa',       size: '2×2 inch', color: '#0052A5', delay: 0.15 },
  { flag: '🇬🇧', label: 'UK ID Card',     size: '35×45mm', color: '#C8102E', delay: 0.3 },
  { flag: '🇪🇺', label: 'Schengen',       size: '35×45mm', color: '#003399', delay: 0.45 },
  { flag: '🇨🇦', label: 'Canada PR',      size: '50×70mm', color: '#FF0000', delay: 0.6 },
  { flag: '🇦🇺', label: 'Australia',      size: '35×45mm', color: '#00843D', delay: 0.75 },
];

function FloatingCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const col = index % 3;
  const row = Math.floor(index / 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.5 + card.delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -12, scale: 1.05, rotateY: 8, rotateX: -5 }}
      className="glass-card holographic card-3d cursor-pointer group relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glow border on hover */}
      <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `0 0 30px ${card.color}40, inset 0 0 30px ${card.color}10` }} />

      <div className="p-4">
        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 relative"
          style={{ background: `linear-gradient(135deg, ${card.color}20, rgba(0,0,0,0.5))` }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-5xl filter drop-shadow-lg">{card.flag}</span>
            <div className="w-12 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xs text-white/60 font-mono">ID</span>
            </div>
          </div>
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 opacity-60"
            style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: card.delay }}
          />
          {/* Verified badge */}
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xs font-semibold text-white truncate">{card.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{card.size}</p>
        {/* Bottom glow bar */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} />
      </div>
    </motion.div>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────────
const WORDS = ['Seconds.', 'Perfection.', 'Any Country.', 'Instantly.'];

function TypewriterText() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wordIdx];
    let timeout: NodeJS.Timeout;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((wordIdx + 1) % WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  return (
    <span className="text-gradient-gold">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-1 h-14 bg-yellow-400 ml-1 align-middle"
      />
    </span>
  );
}

// ── Stats Counter ─────────────────────────────────────────────────────────────
function StatCounter({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-3xl font-bold font-display" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </motion.div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 30);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * -20);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden pt-16 grid-bg"
    >
      {/* Ambient orbs */}
      <motion.div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
      <motion.div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], x: [0,30,0], y: [0,-20,0] }} transition={{ duration: 12, repeat: Infinity, delay: 1 }} />

      <ParticleField />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Text ── */}
          <div className="space-y-8">

            {/* Royal badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full gold-border bg-yellow-500/5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
                <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase">AI-Powered • Royal Quality</span>
                <motion.span className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1,0,1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              </div>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="text-6xl sm:text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-tight"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                <span className="block text-white">Passport</span>
                <span className="block text-gradient">Photos in</span>
                <span className="block">
                  <TypewriterText />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-xl"
              >
                AI removes background, enhances skin tone, aligns face — and delivers
                <strong className="text-cyan-400"> print-ready photos</strong> compliant with
                <strong className="text-cyan-400"> 50+ countries</strong> in seconds.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/generator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary group w-full sm:w-auto text-base px-8 py-4"
                >
                  <Upload className="w-5 h-5" />
                  Generate Free Photo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline w-full sm:w-auto text-base px-8 py-4"
                >
                  <Zap className="w-5 h-5" />
                  See Features
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-2"
            >
              <StatCounter value="50+" label="Countries" color="#00d4ff" />
              <StatCounter value="2M+" label="Photos Made" color="#8B5CF6" />
              <StatCounter value="99.9%" label="Acceptance" color="#FFD700" />
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {['👨‍💼','👩‍💼','👨‍🎓','👩‍🎓','🧑‍💻'].map((e,i)=>(
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-base">{e}</div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i=><Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400"/>)}
              </div>
              <span className="text-sm text-slate-400">Trusted by <strong className="text-white">2M+ users</strong></span>
            </motion.div>
          </div>

          {/* ── RIGHT: 3D Cards + Orbits ── */}
          <motion.div
            style={{ rotateY: springX, rotateX: springY, transformStyle: 'preserve-3d', perspective: '1200px' }}
            className="relative"
          >
            {/* Orbit rings behind cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              <OrbitRings />
            </div>

            {/* Cards grid */}
            <div className="relative grid grid-cols-3 gap-3 z-10">
              {CARDS.map((card, i) => (
                <FloatingCard key={i} card={card} index={i} />
              ))}
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0,-12,0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-8 glass-card gold-border px-4 py-3 flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">100% Accepted</div>
                <div className="text-xs text-slate-500">Government verified</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0,12,0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-6 -right-6 glass-card px-4 py-3 flex items-center gap-3 z-20"
              style={{ borderColor: 'rgba(0,212,255,0.3)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">AI Verified</div>
                <div className="text-xs text-slate-500">Face + compliance</div>
              </div>
            </motion.div>

            {/* Central glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: '0 0 80px rgba(0,212,255,0.08), 0 0 160px rgba(139,92,246,0.05)' }} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0,8,0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-9 border border-slate-700 rounded-full flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2.5 bg-cyan-400 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}