'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/50">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gradient">SnapID AI</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">AI-powered passport photo generation for 50+ countries. Fast, compliant, and beautiful.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'How It Works', 'Pricing', 'Countries'].map(item => (
                <li key={item}><Link href="#" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <li key={item}><Link href="#" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map(item => (
                <li key={item}><Link href="#" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© 2025 SnapID AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <Link key={i} href="#" className="text-slate-600 hover:text-cyan-400 transition-colors">
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
