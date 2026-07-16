'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Star, Crown } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for one-time use',
    features: ['3 photos per month','5 country presets','PNG & JPG download','Basic AI enhancement','Standard support'],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
    badge: null,
    color: '#00d4ff',
  },
  {
    name: 'Pro',
    price: '₹199',
    period: 'per month',
    desc: 'For frequent travelers',
    features: ['Unlimited photos','50+ country presets','PNG, JPG & PDF','Advanced AI enhancement','Priority support','Save photo history','Custom backgrounds'],
    cta: 'Start Pro Trial',
    href: '/register?plan=pro',
    highlight: true,
    badge: 'Most Popular',
    color: '#8B5CF6',
  },
  {
    name: 'Business',
    price: '₹799',
    period: 'per month',
    desc: 'For agencies & studios',
    features: ['Everything in Pro','Bulk processing','API access','White-label option','Dedicated support','Custom integrations','Team accounts'],
    cta: 'Contact Sales',
    href: 'mailto:sales@snapid.ai',   // ← email instead of /contact (no 404)
    highlight: false,
    badge: null,
    color: '#FFD700',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-padding mesh-bg">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-amber-500/30 text-amber-400 bg-amber-500/10 mb-4 tracking-widest uppercase">
            <Zap className="w-3 h-3" /> Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Choose Your <span className="text-gradient-gold">Plan</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        {/* Cards — pt-8 gives room for badge above */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              /* overflow:visible so badge is NOT clipped */
              className="relative group"
              style={{ overflow: 'visible' }}
            >
              {/* Most Popular badge — sits above card */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20
                  px-5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#8B5CF6,#00d4ff)', boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
                  <Star className="w-3 h-3 fill-white" /> {plan.badge}
                </div>
              )}

              {/* Card */}
              <div
                className="glass-card hud-corners p-8 h-full flex flex-col relative"
                style={{
                  overflow: 'hidden',
                  borderColor: plan.highlight ? 'rgba(139,92,246,0.5)' : `${plan.color}20`,
                  boxShadow: plan.highlight ? '0 0 40px rgba(139,92,246,0.15)' : 'none',
                  paddingTop: plan.badge ? '2.5rem' : '2rem',
                }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg,transparent,${plan.color},transparent)` }} />

                {/* Scan line */}
                <motion.div className="absolute left-0 right-0 h-px opacity-30"
                  style={{ background: `linear-gradient(90deg,transparent,${plan.color},transparent)` }}
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: 'linear' }} />

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 30%,${plan.color}12,transparent 65%)` }} />

                {/* Plan info */}
                <div className="relative z-10 mb-6">
                  {plan.highlight && (
                    <Crown className="w-5 h-5 mb-2" style={{ color: plan.color }} />
                  )}
                  <div className="text-sm font-semibold text-slate-400 mb-1 tracking-widest uppercase">{plan.name}</div>
                  <div className="text-5xl font-extrabold text-white mb-0.5" style={{ fontFamily: 'Syne, sans-serif' }}>{plan.price}</div>
                  <div className="text-xs text-slate-500 mb-2">{plan.period}</div>
                  <p className="text-sm text-slate-400">{plan.desc}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1 relative z-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="relative z-10">
                  <Link href={plan.href}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
                      style={plan.highlight ? {
                        background: `linear-gradient(135deg,${plan.color},#00d4ff)`,
                        color: '#fff',
                        boxShadow: `0 0 30px ${plan.color}50`,
                      } : {
                        border: `1px solid ${plan.color}40`,
                        color: plan.color,
                        background: `${plan.color}08`,
                      }}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg,transparent,${plan.color},transparent)` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}