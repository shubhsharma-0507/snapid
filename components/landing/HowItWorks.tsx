'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, Download, CheckCircle, Zap } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Photo',
    desc: 'Drag & drop or click to upload any photo. Selfies, portraits — any clear photo works.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(0,212,255,0.4)',
    step: '01',
  },
  {
    icon: Cpu,
    title: 'AI Processes It',
    desc: 'Our AI detects your face, removes background, enhances lighting, and validates compliance.',
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(139,92,246,0.4)',
    step: '02',
  },
  {
    icon: CheckCircle,
    title: 'Review & Customize',
    desc: 'Choose your country, background color, and number of copies. Preview in real-time.',
    color: 'from-green-500 to-emerald-500',
    glow: 'rgba(0,255,128,0.4)',
    step: '03',
  },
  {
    icon: Download,
    title: 'Download & Print',
    desc: 'Get your print-ready file instantly. Works at any photo shop or home printer.',
    color: 'from-orange-500 to-amber-500',
    glow: 'rgba(255,165,0,0.4)',
    step: '04',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding mesh-bg">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-500/30 text-purple-400 bg-purple-500/10 mb-4 tracking-widest uppercase">
            <Zap className="w-3 h-3" /> How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            4 Steps to Your{' '}
            <span className="text-gradient-alt">Perfect Photo</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            From upload to print-ready in under 60 seconds.
          </p>
        </motion.div>

        {/* Steps grid — pt-8 gives room for the badge that sticks out above */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg,rgba(0,212,255,0),rgba(0,212,255,0.4) 30%,rgba(139,92,246,0.4) 70%,rgba(0,212,255,0))' }} />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                whileHover={{ y: -8 }}
                /* ── KEY FIX: overflow-visible so the badge is NOT clipped ── */
                className="relative group"
                style={{ overflow: 'visible' }}
              >
                {/* Step badge — sits above the card */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold font-mono text-white border border-white/20"
                  style={{
                    background: 'linear-gradient(135deg,#0a0b14,#1a1b2e)',
                    boxShadow: `0 0 12px ${step.glow}`,
                  }}>
                  {step.step}
                </div>

                {/* Card */}
                <div className="glass-card hud-corners p-6 pt-8 text-center h-full relative"
                  style={{ overflow: 'hidden' }}>
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg,transparent,${step.glow},transparent)` }} />

                  {/* Scan line animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-px opacity-40"
                    style={{ background: `linear-gradient(90deg,transparent,${step.glow},transparent)` }}
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Glow bg on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 40%,${step.glow}18,transparent 70%)` }} />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} p-3.5 mb-4 relative z-10 shadow-lg`}
                    style={{ boxShadow: `0 8px 24px ${step.glow}` }}
                  >
                    <Icon className="w-full h-full text-white" />
                  </motion.div>

                  <h3 className="text-base font-bold text-white mb-2 relative z-10">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed relative z-10">{step.desc}</p>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg,transparent,${step.glow},transparent)` }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}