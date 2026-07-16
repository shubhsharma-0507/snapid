'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Are the photos really accepted by governments?', a: 'Yes! Our AI ensures every photo meets the exact specifications required by government agencies. We\'ve processed millions of photos with a 99.9% acceptance rate across all countries.' },
  { q: 'What photo formats are supported for upload?', a: 'You can upload JPEG, PNG, WEBP, and HEIC formats. The minimum resolution should be 600x600 pixels for best results. Our AI will enhance and optimize the quality.' },
  { q: 'How does the background removal work?', a: 'We use advanced AI (powered by remove.bg API) to precisely detect and remove your background. It works even with complex hair, glasses, and clothing. You can then select any color background.' },
  { q: 'Is my photo data secure and private?', a: 'Absolutely. Photos are processed securely and stored encrypted. We never share your photos with third parties. You can delete all your data anytime from your account settings.' },
  { q: 'Can I use SnapID AI for multiple countries?', a: 'Yes! We support 50+ countries including India, USA, UK, Canada, Australia, all EU/Schengen countries, and more. Each preset includes exact dimensions, DPI, and background requirements.' },
  { q: 'What if my photo is rejected?', a: 'We offer a 100% money-back guarantee if your photo is rejected due to our error. Our AI validation checks for all common rejection reasons before you download.' },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-white pr-4">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
          <ChevronDown className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="section-padding">
      <div className="container-max max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-slate-400">Everything you need to know about SnapID AI.</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
        </div>
      </div>
    </section>
  );
}
