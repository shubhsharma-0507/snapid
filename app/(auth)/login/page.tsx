'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Sparkles, ArrowRight, Zap, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    // Session cookie set hone ka wait
    await fetch("/api/auth/session");

    
    router.refresh();
router.push('/dashboard');

    // Thoda delay taaki App Router nayi cookie read kare
    setTimeout(() => {
      router.replace("/dashboard");
    }, 300);

  } catch {
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md relative z-10">

        {/* Orbiting rings behind form */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          {[220,320,420].map((s,i)=>(
            <motion.div key={i} className="absolute rounded-full border"
              style={{width:s,height:s,borderColor:i%2===0?'rgba(0,212,255,0.08)':'rgba(139,92,246,0.06)'}}
              animate={{rotate:i%2===0?360:-360}} transition={{duration:15+i*5,repeat:Infinity,ease:'linear'}}/>
          ))}
        </div>

        <motion.div initial={{opacity:0,y:40,scale:0.95}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.7}}>
          <div className="glass-card hud-corners p-8 relative overflow-hidden">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00d4ff,#8B5CF6,transparent)'}}/>
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#8B5CF6,#00d4ff,transparent)'}}/>

            {/* Grid bg */}
            <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)',backgroundSize:'30px 30px'}}/>

            <div className="relative z-10">
              {/* Logo */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex flex-col items-center gap-2">
                  <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                    style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)'}}
                    animate={{rotate:[0,360]}} transition={{duration:8,repeat:Infinity,ease:'linear'}}>
                    <Sparkles className="w-7 h-7 text-white"/>
                  </motion.div>
                  <span className="text-xl font-extrabold text-gradient" style={{fontFamily:'Syne,sans-serif'}}>SnapID AI</span>
                </Link>
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                  <p className="text-slate-400 text-sm mt-1">Sign in to your royal account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  {label:'Email',val:email,set:setEmail,type:'email',icon:Mail,placeholder:'you@example.com'},
                  {label:'Password',val:password,set:setPassword,type:'password',icon:Lock,placeholder:'••••••••'},
                ].map(({label,val,set,type,icon:Icon,placeholder})=>(
                  <div key={label}>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-widest uppercase">{label}</label>
                    <div className="relative group">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors"/>
                      <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={placeholder} required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none"
                        style={{background:'rgba(0,212,255,0.04)',border:'1px solid rgba(0,212,255,0.15)'}}
                        onFocus={e=>{e.target.style.borderColor='rgba(0,212,255,0.6)';e.target.style.boxShadow='0 0 20px rgba(0,212,255,0.15)';}}
                        onBlur={e=>{e.target.style.borderColor='rgba(0,212,255,0.15)';e.target.style.boxShadow='none';}}
                      />
                    </div>
                  </div>
                ))}

                {error && (
                  <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                    className="p-3 rounded-xl text-sm text-red-400"
                    style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
                    ⚠ {error}
                  </motion.div>
                )}

                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin"/>Authenticating…</> : <><Zap className="w-4 h-4"/>Sign In<ArrowRight className="w-4 h-4"/></>}
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <p className="text-slate-500 text-sm">Don't have an account?{' '}
                  <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Create Account</Link>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3 text-slate-600"/>
                <span className="text-xs text-slate-600">256-bit encrypted • Secure login</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}