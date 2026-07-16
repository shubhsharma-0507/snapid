'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, Globe, Sparkles, Download, ScanFace, Palette, Clock } from 'lucide-react';

const features = [
  { icon: ScanFace, title: 'AI Face Detection', desc: 'Advanced MediaPipe AI detects your face, eyes, and expression to ensure perfect positioning every time.', color: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/20' },
  { icon: Shield, title: 'Compliance Validated', desc: 'Meets all official requirements for passports, visas, and government IDs across 50+ countries worldwide.', color: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/20' },
  { icon: Globe, title: '50+ Country Presets', desc: 'Pre-configured dimensions and requirements for every major country — India, USA, UK, Schengen, and more.', color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/20' },
  { icon: Download, title: 'Instant Download', desc: 'Get print-ready files in PNG, JPG, or PDF format instantly. Multiple copies on one sheet, print-shop ready.', color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Complete your passport photo in under 60 seconds — from upload to download. No queues, no delays.', color: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/20' },
  { icon: Sparkles, title: 'AI Enhancement', desc: 'Smart algorithms auto-adjust lighting, contrast, skin tone, and clarity for studio-quality results.', color: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/20' },
  { icon: Palette, title: 'Custom Backgrounds', desc: 'Choose white, blue, grey, or any custom color background. Remove backgrounds instantly with one click.', color: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/20' },
  { icon: Clock, title: 'Save & Reuse', desc: 'Your photos are securely saved in your account. Redownload anytime, in any format, without re-uploading.', color: 'from-teal-500 to-cyan-500', glow: 'shadow-teal-500/20' },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card p-6 group cursor-default relative overflow-hidden"
    >
      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer pointer-events-none" />
      
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-5 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-full h-full text-white" />
      </div>

      <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>

      {/* Bottom glow line */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </motion.div>
  );
}

export function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="features" ref={ref} className="section-padding mesh-bg">
      <div className="container-max">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 mb-4">
            <Sparkles className="w-3 h-3" /> POWERFUL FEATURES
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need for
            <br />
            <span className="text-gradient">Perfect Passport Photos</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Professional-grade tools powered by AI, making passport photo generation fast, accurate, and stress-free.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
