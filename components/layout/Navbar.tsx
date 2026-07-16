'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Sparkles, Menu, X, Zap, Shield, Crown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');
  const { data: session } = useSession();
  const { scrollY } = useScroll();

  useEffect(()=>{
    const u=scrollY.on('change',v=>setScrolled(v>50));
    const t=setInterval(()=>setTime(new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})),1000);
    return ()=>{u();clearInterval(t);};
  },[scrollY]);

  const links=[{l:'Features',h:'#features'},{l:'How It Works',h:'#how-it-works'},{l:'Pricing',h:'#pricing'},{l:'FAQ',h:'#faq'}];

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50"
      animate={{
        backgroundColor: scrolled?'rgba(4,5,14,0.92)':'rgba(4,5,14,0.1)',
        backdropFilter: scrolled?'blur(28px)':'blur(8px)',
        borderBottomColor: scrolled?'rgba(0,212,255,0.18)':'rgba(0,212,255,0.05)',
        borderBottomWidth:'1px', borderBottomStyle:'solid',
      }} transition={{duration:0.4}}
    >
      {/* HUD top line */}
      <motion.div className="h-px w-full"
        style={{background:'linear-gradient(90deg,transparent,#00d4ff,#8B5CF6,#FFD700,transparent)'}}
        animate={{opacity:[0.4,1,0.4]}} transition={{duration:3,repeat:Infinity}}
      />

      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{scale:1.12,rotate:15}} className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
            style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)'}}>
            <Sparkles className="w-4 h-4 text-white relative z-10"/>
            <motion.div className="absolute inset-0" style={{background:'conic-gradient(transparent,rgba(255,255,255,0.4),transparent)'}}
              animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:'linear'}}/>
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold text-gradient" style={{fontFamily:'Syne,sans-serif'}}>SnapID AI</span>
            <span className="text-[9px] text-slate-500 tracking-widest uppercase font-mono">Royal Edition</span>
          </div>
        </Link>

        {/* Center: live HUD clock */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((l,i)=>(
            <motion.div key={l.h} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <Link href={l.h} className="relative text-sm font-medium text-slate-400 hover:text-white transition-colors group">
                {l.l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-400 group-hover:w-full transition-all duration-300"/>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live clock HUD */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{opacity:[1,0.3,1]}} transition={{duration:1.2,repeat:Infinity}}/>
            <span className="text-xs font-mono text-cyan-400">{time||'--:--:--'}</span>
          </div>

         {session ? (
  <>
    {(session.user as any)?.role === 'admin' && (
      <Link href="/admin">
        <motion.button whileHover={{scale:1.05}}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition-all"
          style={{color:'#FF1744',border:'1px solid rgba(255,23,68,0.3)',background:'rgba(255,23,68,0.08)'}}>
          <Crown className="w-3.5 h-3.5"/> Admin
        </motion.button>
      </Link>
    )}
    <Link href="/dashboard">
      <motion.button whileHover={{scale:1.03}} className="text-sm text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">Dashboard</motion.button>
    </Link>
    <motion.button whileHover={{scale:1.03}} onClick={()=>signOut({callbackUrl:'/'})} className="btn-outline text-sm px-5 py-2">Sign Out</motion.button>
  </>
):(
  <>
    <Link href="/login"><motion.button whileHover={{scale:1.03}} className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">Sign In</motion.button></Link>
    <Link href="/register">
      <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} className="btn-primary text-sm px-5 py-2.5">
        <Zap className="w-3.5 h-3.5"/> Get Started
      </motion.button>
    </Link>
  </>
)}
        </div>

        <motion.button whileTap={{scale:0.88}} onClick={()=>setOpen(!open)} className="md:hidden text-slate-400 hover:text-white p-2">
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}><X className="w-6 h-6"/></motion.div>
              : <motion.div key="m" initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}}><Menu className="w-6 h-6"/></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            className="md:hidden glass mx-4 mb-3 overflow-hidden rounded-xl border border-cyan-500/20">
            <div className="p-4 space-y-1">
              {links.map(l=>(
                <Link key={l.h} href={l.h} onClick={()=>setOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">{l.l}</Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                <Link href="/login"    className="btn-outline text-sm text-center py-2.5" onClick={()=>setOpen(false)}>Sign In</Link>
                <Link href="/register" className="btn-primary text-sm text-center py-2.5 justify-center" onClick={()=>setOpen(false)}><Zap className="w-3.5 h-3.5"/>Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}