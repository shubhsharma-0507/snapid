'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Upload, LogOut, Sparkles, Plus, History, Settings, 
  Download, Trash2, User, Loader2, ImageIcon, Zap, Shield, 
  Globe, Activity, Crown } from 'lucide-react';
interface Photo { _id:string; processedUrl:string; sheetUrl:string; country:string; backgroundColor:string; copies:number; createdAt:string; }
const cLabel=(id:string)=>({india:'India',usa:'USA',uk:'UK',canada:'Canada',australia:'Australia',schengen:'Schengen'}[id]||id);

function HUDPanel({ label, value, color, icon: Icon }: any) {
  return (
    <motion.div whileHover={{scale:1.03,y:-3}} className="glass-card hud-corners p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${color}20`,border:`1px solid ${color}40`}}>
          <Icon className="w-5 h-5" style={{color}}/>
        </div>
        <motion.div className="w-2 h-2 rounded-full" style={{background:color}} animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity}}/>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:`linear-gradient(90deg,transparent,${color}60,transparent)`}}/>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState('');

  useEffect(()=>{
    fetch('/api/photos/list').then(r=>r.json()).then(d=>setPhotos(d.photos||[])).catch(()=>{}).finally(()=>setLoading(false));
    const t=setInterval(()=>setTime(new Date().toLocaleTimeString('en-IN')),1000);
    return ()=>clearInterval(t);
  },[]);

  const handleDownload=(url:string,country:string)=>{
    const a=document.createElement('a'); a.href=url; a.download=`passport-${country}.png`; a.target='_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const handleDelete=async(id:string)=>{
    if(!confirm('Delete?'))return;
    await fetch('/api/photos/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({photoId:id})});
    setPhotos(p=>p.filter(x=>x._id!==id));
  };

  const actions=[
    {label:'Generate Photo', href:'/generator', icon:Plus,    color:'#00d4ff', desc:'AI-powered passport photo'},
    {label:'Photo History',  href:'/history',   icon:History,  color:'#8B5CF6', desc:'View & download past photos'},
    {label:'Profile',        href:'/profile',   icon:Settings, color:'#FFD700', desc:'Account & security settings'},
     // Admin button — sirf admin user ko dikhega
  ...(( session?.user as any)?.role === 'admin' ? [{
    label: 'Admin Panel',
    href:  '/admin',
    icon:  Crown,
    color: '#FF1744',
    desc:  'Manage users & system stats',
  }] : []),
  ];

  return (
    <div className="min-h-screen">
      {/* Royal Header */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/10" style={{background:'rgba(4,5,14,0.85)',backdropFilter:'blur(28px)'}}>
        <motion.div className="h-px w-full" style={{background:'linear-gradient(90deg,transparent,#00d4ff,#8B5CF6,transparent)'}} animate={{opacity:[0.4,1,0.4]}} transition={{duration:3,repeat:Infinity}}/>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden" style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)'}}
              animate={{rotate:[0,360]}} transition={{duration:8,repeat:Infinity,ease:'linear'}}>
              <Sparkles className="w-4 h-4 text-white"/>
            </motion.div>
            <div>
              <span className="font-extrabold text-gradient" style={{fontFamily:'Syne,sans-serif'}}>SnapID AI</span>
              <span className="text-xs text-slate-500 ml-2 font-mono">{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{opacity:[1,0.2,1]}} transition={{duration:1.2,repeat:Infinity}}/>
              <span className="text-xs font-mono text-green-400">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-cyan-400"/>
              </div>
              <span className="hidden sm:block">{session?.user?.name}</span>
            </div>
            <motion.button whileHover={{scale:1.05}} onClick={()=>signOut({callbackUrl:'/'})}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
              <LogOut className="w-4 h-4"/> <span className="hidden sm:block">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* Welcome */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="relative">
          <div className="glass-card hud-corners p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(0,212,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.05) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div className="w-2 h-2 rounded-full bg-cyan-400" animate={{scale:[1,1.5,1],opacity:[1,0.5,1]}} transition={{duration:1.5,repeat:Infinity}}/>
                  <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">System Active</span>
                </div>
                <h1 className="text-4xl font-extrabold mb-2" style={{fontFamily:'Syne,sans-serif'}}>
                  Welcome, <span className="text-gradient">{session?.user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="text-slate-400">Your AI passport photo command center</p>
              </div>
              <Link href="/generator">
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} className="btn-primary px-6 py-3">
                  <Zap className="w-5 h-5"/> Generate New Photo
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* HUD Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {label:'Total Photos',  value:photos.length,        color:'#00d4ff', icon:ImageIcon},
            {label:'Countries Used',value:new Set(photos.map(p=>p.country)).size, color:'#8B5CF6',icon:Globe},
            {label:'Total Copies',  value:photos.reduce((a,p)=>a+p.copies,0),    color:'#FFD700', icon:Activity},
            {label:'Status',        value:'ONLINE',             color:'#00FF80', icon:Shield},
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <HUDPanel {...s}/>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((a,i)=>(
            <Link key={i} href={a.href}>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.1}}
                whileHover={{y:-6,scale:1.02}} className="glass-card hud-corners p-6 cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{background:`radial-gradient(circle at 50% 50%,${a.color}10,transparent 70%)`}}/>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{background:`${a.color}15`,border:`1px solid ${a.color}40`}}>
                    <a.icon className="w-6 h-6" style={{color:a.color}}/>
                  </div>
                  <div>
                    <div className="font-bold text-white mb-1">{a.label}</div>
                    <div className="text-xs text-slate-500">{a.desc}</div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{background:`linear-gradient(90deg,transparent,${a.color},transparent)`}}/>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent Photos */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white" style={{fontFamily:'Syne,sans-serif'}}>Recent Photos</h2>
              <div className="px-2 py-0.5 rounded-full text-xs font-mono border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">{photos.length}</div>
            </div>
            <Link href="/history" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono">View All →</Link>
          </div>

          {loading ? (
            <div className="glass-card p-16 flex flex-col items-center gap-4">
              <motion.div animate={{rotate:360}} transition={{duration:1.5,repeat:Infinity,ease:'linear'}}>
                <Loader2 className="w-8 h-8 text-cyan-400"/>
              </motion.div>
              <span className="text-slate-400 font-mono text-sm">Loading photos...</span>
            </div>
          ) : photos.length===0 ? (
            <div className="glass-card hud-corners p-16 text-center space-y-4">
              <motion.div animate={{y:[0,-10,0]}} transition={{duration:3,repeat:Infinity}}>
                <ImageIcon className="w-16 h-16 text-slate-700 mx-auto"/>
              </motion.div>
              <p className="text-slate-400">No photos yet</p>
              <Link href="/generator">
                <motion.button whileHover={{scale:1.05}} className="btn-primary mt-2"><Plus className="w-4 h-4"/>Generate First Photo</motion.button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <AnimatePresence>
                {photos.slice(0,4).map((photo,i)=>(
                  <motion.div key={photo._id}
                    initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{delay:i*0.08}}
                    whileHover={{y:-8}} className="glass-card overflow-hidden group cursor-pointer hud-corners">
                    <div className="aspect-[3/4] relative overflow-hidden" style={{backgroundColor:photo.backgroundColor||'#1a1a2e'}}>
                      {(photo.sheetUrl||photo.processedUrl) ? (
                        <img src={photo.sheetUrl||photo.processedUrl} alt={photo.country}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-slate-600"/>
                        </div>
                      )}
                      {/* Scan effect */}
                      <motion.div className="absolute left-0 right-0 h-0.5 opacity-50"
                        style={{background:'linear-gradient(90deg,transparent,#00d4ff,transparent)'}}
                        animate={{top:['0%','100%']}} transition={{duration:3,repeat:Infinity,ease:'linear',delay:i*0.7}}/>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{background:'linear-gradient(to top,rgba(0,0,0,0.85),transparent)'}}>
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                          <motion.button whileHover={{scale:1.15}} onClick={()=>handleDownload(photo.sheetUrl||photo.processedUrl,photo.country)}
                            className="w-9 h-9 rounded-xl bg-cyan-500/80 hover:bg-cyan-500 text-white flex items-center justify-center">
                            <Download className="w-4 h-4"/>
                          </motion.button>
                          <motion.button whileHover={{scale:1.15}} onClick={()=>handleDelete(photo._id)}
                            className="w-9 h-9 rounded-xl bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center">
                            <Trash2 className="w-4 h-4"/>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{cLabel(photo.country)}</p>
                        <p className="text-xs text-slate-500 font-mono">{new Date(photo.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="w-5 h-5 rounded border border-white/20" style={{backgroundColor:photo.backgroundColor}}/>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
          className="glass-card hud-corners p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)',backgroundSize:'50px 50px'}}/>
          <div className="relative z-10">
            <motion.div animate={{rotate:360}} transition={{duration:10,repeat:Infinity,ease:'linear'}} className="w-16 h-16 mx-auto mb-5">
              <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#00d4ff20,#7c3aed20)',border:'1px solid rgba(0,212,255,0.3)'}}>
                <Upload className="w-8 h-8 text-cyan-400"/>
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily:'Syne,sans-serif'}}>Ready to Generate?</h3>
            <p className="text-slate-400 mb-6">AI-powered passport photos in under 60 seconds</p>
            <Link href="/generator">
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} className="btn-primary px-8 py-4 text-base">
                <Zap className="w-5 h-5"/> Generate New Photo
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}