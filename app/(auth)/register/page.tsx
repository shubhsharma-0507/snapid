'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Sparkles, ArrowRight, Zap, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({name:'',email:'',password:''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const r = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d = await r.json();
      if(!r.ok) { setError(d.error||'Registration failed'); return; }
      router.push('/login?registered=true');
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md relative z-10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          {[240,340,440].map((s,i)=>(
            <motion.div key={i} className="absolute rounded-full border"
              style={{width:s,height:s,borderColor:i%2===0?'rgba(139,92,246,0.08)':'rgba(255,215,0,0.05)'}}
              animate={{rotate:i%2===0?-360:360}} transition={{duration:18+i*5,repeat:Infinity,ease:'linear'}}/>
          ))}
        </div>

        <motion.div initial={{opacity:0,y:40,scale:0.95}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.7}}>
          <div className="glass-card hud-corners p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#8B5CF6,#FFD700,transparent)'}}/>
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#FFD700,#8B5CF6,transparent)'}}/>
            <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)',backgroundSize:'30px 30px'}}/>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex flex-col items-center gap-2">
                  <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                    style={{background:'linear-gradient(135deg,#8B5CF6,#FFD700)'}}
                    animate={{scale:[1,1.1,1]}} transition={{duration:2,repeat:Infinity}}>
                    <Sparkles className="w-7 h-7 text-white"/>
                  </motion.div>
                  <span className="text-xl font-extrabold text-gradient-alt" style={{fontFamily:'Syne,sans-serif'}}>SnapID AI</span>
                </Link>
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-white">Create Account</h1>
                  <p className="text-slate-400 text-sm mt-1">Join 2M+ users worldwide</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  {key:'name',    label:'Full Name', type:'text',     icon:User, placeholder:'Your Name'},
                  {key:'email',   label:'Email',     type:'email',    icon:Mail, placeholder:'you@example.com'},
                  {key:'password',label:'Password',  type:'password', icon:Lock, placeholder:'Min 8 characters'},
                ].map(({key,label,type,icon:Icon,placeholder})=>(
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-widest uppercase">{label}</label>
                    <div className="relative group">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors"/>
                      <input type={type} value={(form as any)[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder} required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none"
                        style={{background:'rgba(139,92,246,0.04)',border:'1px solid rgba(139,92,246,0.15)'}}
                        onFocus={e=>{e.target.style.borderColor='rgba(139,92,246,0.6)';e.target.style.boxShadow='0 0 20px rgba(139,92,246,0.15)';}}
                        onBlur={e=>{e.target.style.borderColor='rgba(139,92,246,0.15)';e.target.style.boxShadow='none';}}
                      />
                    </div>
                  </div>
                ))}

                {error && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}
                    className="p-3 rounded-xl text-sm text-red-400"
                    style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
                    ⚠ {error}
                  </motion.div>
                )}

                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin"/>Creating Account…</> : <><Zap className="w-4 h-4"/>Create Account<ArrowRight className="w-4 h-4"/></>}
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <p className="text-slate-500 text-sm">Already have an account?{' '}
                  <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign In</Link>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3 text-slate-600"/>
                <span className="text-xs text-slate-600">Free forever • No credit card needed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}