'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, ImageIcon, Plus, ArrowLeft, Loader2, RefreshCw, Globe, Calendar, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Photo { _id:string; processedUrl:string; sheetUrl:string; country:string; backgroundColor:string; copies:number; createdAt:string; }
const cLabel=(id:string)=>({india:'India',usa:'USA',uk:'UK',canada:'Canada',australia:'Australia',schengen:'Schengen'}[id]||id);
const COLORS:Record<string,string>={india:'#FF6B00',usa:'#0052A5',uk:'#C8102E',canada:'#FF0000',australia:'#00843D',schengen:'#003399'};

export default function HistoryPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [delId, setDelId] = useState<string|null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/photos/list');
      const d = await r.json();
      if(!r.ok) throw new Error(d.error);
      setPhotos(d.photos||[]);
    } catch(e:any){ setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleDelete = async (id:string) => {
    if(!confirm('Delete this photo?')) return;
    setDelId(id);
    try {
      await fetch('/api/photos/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({photoId:id})});
      setPhotos(p=>p.filter(x=>x._id!==id));
    } catch(e:any){ alert(e.message); }
    finally { setDelId(null); }
  };

  const handleDownload = (url:string, country:string) => {
    const a=document.createElement('a'); a.href=url; a.download=`snapid-${country}-${Date.now()}.png`; a.target='_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/10" style={{background:'rgba(4,5,14,0.88)',backdropFilter:'blur(28px)'}}>
        <motion.div className="h-px" style={{background:'linear-gradient(90deg,transparent,#00d4ff,#8B5CF6,#FFD700,transparent)'}} animate={{opacity:[0.5,1,0.5]}} transition={{duration:3,repeat:Infinity}}/>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>router.back()}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-cyan-500/20 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <ArrowLeft className="w-4 h-4"/>
            </motion.button>
            <div>
              <h1 className="text-lg font-extrabold text-white" style={{fontFamily:'Syne,sans-serif'}}>Photo History</h1>
              <p className="text-xs text-slate-500 font-mono">{photos.length} records found</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={load}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
              <RefreshCw className="w-4 h-4"/>
            </motion.button>
            <Link href="/generator">
              <motion.button whileHover={{scale:1.03}} className="btn-primary text-sm px-4 py-2">
                <Plus className="w-4 h-4"/> New Photo
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:'linear'}}
                className="w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-400 border-r-violet-400"/>
              <div className="absolute inset-2 rounded-full flex items-center justify-center" style={{background:'rgba(0,212,255,0.05)'}}>
                <Loader2 className="w-5 h-5 text-cyan-400"/>
              </div>
            </div>
            <p className="text-slate-400 font-mono text-sm">Loading records...</p>
          </div>
        )}

        {!loading && error && (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <motion.button whileHover={{scale:1.03}} onClick={load} className="btn-outline px-6 py-2 text-sm">Retry</motion.button>
          </div>
        )}

        {!loading && !error && photos.length===0 && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            className="glass-card hud-corners p-20 text-center space-y-6">
            <motion.div animate={{y:[0,-12,0],rotate:[0,5,-5,0]}} transition={{duration:4,repeat:Infinity}}>
              <ImageIcon className="w-20 h-20 text-slate-700 mx-auto"/>
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">No Photos Yet</h3>
              <p className="text-slate-400 text-sm">Generate your first passport photo to see it here.</p>
            </div>
            <Link href="/generator">
              <motion.button whileHover={{scale:1.05}} className="btn-primary"><Plus className="w-5 h-5"/> Generate First Photo</motion.button>
            </Link>
          </motion.div>
        )}

        {!loading && photos.length>0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {photos.map((photo,i)=>{
                const accentColor = COLORS[photo.country]||'#00d4ff';
                return (
                  <motion.div key={photo._id}
                    initial={{opacity:0,y:30,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
                    exit={{opacity:0,scale:0.8}} transition={{delay:i*0.06}}
                    whileHover={{y:-8}} className="glass-card hud-corners overflow-hidden group"
                  >
                    {/* Top accent */}
                    <div className="h-0.5 w-full" style={{background:`linear-gradient(90deg,transparent,${accentColor},transparent)`}}/>

                    {/* Photo */}
                    <div className="aspect-[3/4] relative overflow-hidden" style={{backgroundColor:photo.backgroundColor||'#0a0b14'}}>
                      {(photo.sheetUrl||photo.processedUrl) ? (
                        <img src={photo.sheetUrl||photo.processedUrl} alt={photo.country}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                      ):(
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-slate-700"/>
                        </div>
                      )}

                      {/* Scan line */}
                      <motion.div className="absolute left-0 right-0 h-px opacity-60"
                        style={{background:`linear-gradient(90deg,transparent,${accentColor},transparent)`}}
                        animate={{top:['0%','100%']}} transition={{duration:3+i*0.3,repeat:Infinity,ease:'linear'}}/>

                      {/* Country badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white"
                        style={{background:`${accentColor}30`,border:`1px solid ${accentColor}50`}}>
                        {cLabel(photo.country)}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{background:'linear-gradient(to top,rgba(4,5,14,0.95) 0%,rgba(4,5,14,0.4) 60%,transparent 100%)'}}>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                          <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
                            onClick={()=>handleDownload(photo.sheetUrl||photo.processedUrl,photo.country)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                            style={{background:'rgba(0,212,255,0.8)',backdropFilter:'blur(8px)'}}>
                            <Download className="w-3.5 h-3.5"/> Download
                          </motion.button>
                          <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
                            onClick={()=>handleDelete(photo._id)} disabled={delId===photo._id}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                            style={{background:'rgba(239,68,68,0.8)',backdropFilter:'blur(8px)'}}>
                            {delId===photo._id?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Trash2 className="w-3.5 h-3.5"/>}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:`${accentColor}20`,border:`1px solid ${accentColor}40`}}>
                            <Globe className="w-3 h-3" style={{color:accentColor}}/>
                          </div>
                          <span className="text-sm font-bold text-white">{cLabel(photo.country)}</span>
                        </div>
                        <div className="w-5 h-5 rounded border border-white/15" style={{backgroundColor:photo.backgroundColor}}/>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3"/>
                          {new Date(photo.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                        </div>
                        <div className="flex items-center gap-1">
                          <Copy className="w-3 h-3"/>
                          {photo.copies} copies
                        </div>
                      </div>
                      {/* Bottom action bar */}
                      <div className="flex gap-2 pt-1">
                        <motion.button whileHover={{scale:1.02}} onClick={()=>handleDownload(photo.sheetUrl||photo.processedUrl,photo.country)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{background:'rgba(0,212,255,0.08)',border:'1px solid rgba(0,212,255,0.2)',color:'#00d4ff'}}>
                          <Download className="w-3 h-3"/> Download
                        </motion.button>
                        <motion.button whileHover={{scale:1.05}} onClick={()=>handleDelete(photo._id)} disabled={delId===photo._id}
                          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
                          style={{border:'1px solid rgba(239,68,68,0.25)',color:'rgba(239,68,68,0.8)'}}>
                          {delId===photo._id?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Trash2 className="w-3.5 h-3.5"/>}
                        </motion.button>
                      </div>
                    </div>
                    <div className="h-0.5 w-full" style={{background:`linear-gradient(90deg,transparent,${accentColor}60,transparent)`}}/>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}