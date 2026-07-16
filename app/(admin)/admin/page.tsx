'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ImageIcon, Globe, Activity, Trash2, Shield, Crown, Search, RefreshCw, Loader2, ChevronLeft, ChevronRight, BarChart3, LogOut, Zap, AlertTriangle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
  users:  { total:number; today:number; week:number; month:number };
  photos: { total:number; today:number; week:number; month:number };
  copies: number;
  countryStats: { _id:string; count:number }[];
  recentUsers:  any[];
  recentPhotos: any[];
}
interface UserRow { _id:string; name:string; email:string; role:string; createdAt:string; photoCount:number; }

const cLabel = (id:string) => ({india:'🇮🇳 India',usa:'🇺🇸 USA',uk:'🇬🇧 UK',canada:'🇨🇦 Canada',australia:'🇦🇺 Australia',schengen:'🇪🇺 Schengen'}[id]||id);

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon:Icon, label, value, sub, color }:any) {
  return (
    <motion.div whileHover={{y:-4,scale:1.02}} className="glass-card hud-corners p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${color}18`,border:`1px solid ${color}35`}}>
          <Icon className="w-5 h-5" style={{color}}/>
        </div>
        <motion.div className="w-2 h-2 rounded-full mt-1" style={{background:color}} animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity}}/>
      </div>
      <div className="text-3xl font-extrabold text-white mb-0.5 font-mono">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
      {sub && <div className="text-xs mt-1" style={{color}}>{sub}</div>}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-40" style={{background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
    </motion.div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tab,      setTab]      = useState<'overview'|'users'>('overview');
  const [stats,    setStats]    = useState<Stats|null>(null);
  const [users,    setUsers]    = useState<UserRow[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [uLoading, setULoading] = useState(false);
  const [time,     setTime]     = useState('');

  useEffect(() => {
    const t = setInterval(()=>setTime(new Date().toLocaleTimeString('en-IN')),1000);
    return ()=>clearInterval(t);
  },[]);

  // Load stats
  useEffect(()=>{
    if(tab==='overview') loadStats();
  },[tab]);

  // Load users
  useEffect(()=>{
    if(tab==='users') loadUsers();
  },[tab,page,search]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/stats');
      const d = await r.json();
      if(d.success) setStats(d.stats);
    } finally { setLoading(false); }
  };

  const loadUsers = async () => {
    setULoading(true);
    try {
      const r = await fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
      const d = await r.json();
      if(d.success){ setUsers(d.users); setTotal(d.total); setPages(d.pages); }
    } finally { setULoading(false); }
  };

  const handleRoleChange = async (userId:string, role:string) => {
    if(!confirm(`Change role to ${role}?`)) return;
    await fetch('/api/admin/users',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId,role})});
    loadUsers();
  };

  const handleDeleteUser = async (userId:string, name:string) => {
    if(!confirm(`Delete user "${name}" and ALL their photos? This cannot be undone.`)) return;
    await fetch('/api/admin/users',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId})});
    loadUsers();
    if(tab==='overview') loadStats();
  };

  const tabs = [
    {id:'overview', label:'Overview',   icon:BarChart3},
    {id:'users',    label:'Users',      icon:Users},
  ] as const;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-red-500/20" style={{background:'rgba(4,5,14,0.92)',backdropFilter:'blur(28px)'}}>
        <motion.div className="h-px" style={{background:'linear-gradient(90deg,transparent,#FF1744,#FFD700,#FF1744,transparent)'}} animate={{opacity:[0.5,1,0.5]}} transition={{duration:2,repeat:Infinity}}/>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#FF1744,#FF6B00)'}}>
              <Crown className="w-4 h-4 text-white"/>
            </div>
            <div>
              <span className="font-extrabold text-white" style={{fontFamily:'Syne,sans-serif'}}>Admin Panel</span>
              <span className="text-xs text-red-400 font-mono ml-2">RESTRICTED</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400" animate={{opacity:[1,0.2,1]}} transition={{duration:1,repeat:Infinity}}/>
              <span className="text-xs font-mono text-red-400">{time}</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">{session?.user?.email}</span>
            <Link href="/dashboard">
              <motion.button whileHover={{scale:1.05}} className="text-xs text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-cyan-500/20 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5"/> Dashboard
              </motion.button>
            </Link>
            <motion.button whileHover={{scale:1.05}} onClick={()=>signOut({callbackUrl:'/'})}
              className="text-xs text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5"/> Sign Out
            </motion.button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 pb-0">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px"
              style={{borderColor:tab===t.id?'#FF1744':'transparent',color:tab===t.id?'#FF1744':'rgba(148,163,184,0.7)'}}>
              <t.icon className="w-4 h-4"/> {t.label}
              {t.id==='users'&&total>0&&<span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-mono" style={{background:'rgba(255,23,68,0.15)',color:'#FF1744'}}>{total}</span>}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ── OVERVIEW TAB ── */}
        {tab==='overview' && (
          <div className="space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                <motion.div animate={{rotate:360}} transition={{duration:1.5,repeat:Infinity,ease:'linear'}}>
                  <Loader2 className="w-6 h-6 text-red-400"/>
                </motion.div>
                <span className="font-mono text-sm">Loading stats...</span>
              </div>
            ) : stats && (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard icon={Users}     label="Total Users"  value={stats.users.total}  sub={`+${stats.users.today} today`}   color="#00d4ff"/>
                  <StatCard icon={ImageIcon} label="Total Photos" value={stats.photos.total} sub={`+${stats.photos.today} today`}  color="#8B5CF6"/>
                  <StatCard icon={Activity}  label="Total Copies" value={stats.copies}        sub="All time"                         color="#FFD700"/>
                  <StatCard icon={Globe}     label="This Month"   value={stats.users.month}   sub="New users"                        color="#00FF80"/>
                </div>

                {/* Growth row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {label:'Users This Week',   value:stats.users.week,   color:'#00d4ff'},
                    {label:'Photos This Week',  value:stats.photos.week,  color:'#8B5CF6'},
                    {label:'Photos This Month', value:stats.photos.month, color:'#FFD700'},
                  ].map((s,i)=>(
                    <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                      className="glass-card hud-corners p-4 flex items-center justify-between">
                      <span className="text-sm text-slate-400">{s.label}</span>
                      <span className="text-2xl font-bold font-mono" style={{color:s.color}}>{s.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Country breakdown */}
                <div className="glass-card hud-corners p-6">
                  <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#8B5CF6,transparent)'}}/>
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-violet-400"/> Photos by Country
                  </h3>
                  <div className="space-y-3">
                    {stats.countryStats.map((c,i)=>{
                      const max = stats.countryStats[0]?.count || 1;
                      const pct = Math.round((c.count/max)*100);
                      const colors = ['#00d4ff','#8B5CF6','#FFD700','#00FF80','#FF6B00','#FF1744'];
                      const color  = colors[i]||'#00d4ff';
                      return (
                        <div key={c._id} className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 w-28 flex-shrink-0">{cLabel(c._id)}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{background:color,boxShadow:`0 0 8px ${color}60`}}
                              initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.3+i*0.1,duration:0.8}}/>
                          </div>
                          <span className="text-xs font-mono w-8 text-right" style={{color}}>{c.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent users */}
                <div className="glass-card hud-corners p-6">
                  <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00d4ff,transparent)'}}/>
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400"/> Recent Registrations
                  </h3>
                  <div className="space-y-3">
                    {stats.recentUsers.map((u:any,i:number)=>(
                      <motion.div key={u._id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                        className="flex items-center justify-between p-3 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                            style={{background:u.role==='admin'?'linear-gradient(135deg,#FF1744,#FF6B00)':'linear-gradient(135deg,#00d4ff,#7c3aed)'}}>
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white flex items-center gap-1.5">
                              {u.name}
                              {u.role==='admin'&&<Crown className="w-3 h-3 text-red-400"/>}
                            </div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {new Date(u.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab==='users' && (
          <div className="space-y-5">
            {/* Search + refresh */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.15)'}}/>
              </div>
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={loadUsers}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                <RefreshCw className="w-4 h-4"/>
              </motion.button>
              <span className="text-xs text-slate-500 font-mono">{total} users</span>
            </div>

            {/* Users table */}
            {uLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
                <motion.div animate={{rotate:360}} transition={{duration:1.5,repeat:Infinity,ease:'linear'}}>
                  <Loader2 className="w-5 h-5 text-cyan-400"/>
                </motion.div>
                <span className="font-mono text-sm">Loading...</span>
              </div>
            ) : (
              <div className="glass-card hud-corners overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00d4ff,transparent)'}}/>

                {/* Table header */}
                <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs font-semibold text-slate-500 tracking-widest uppercase">
                  <div className="col-span-4">User</div>
                  <div className="col-span-2 text-center">Role</div>
                  <div className="col-span-2 text-center">Photos</div>
                  <div className="col-span-2 text-center">Joined</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {users.map((user,i)=>(
                      <motion.div key={user._id}
                        initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}} transition={{delay:i*0.04}}
                        className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Name + email */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                            style={{background:user.role==='admin'?'linear-gradient(135deg,#FF1744,#FF6B00)':'linear-gradient(135deg,#00d4ff,#7c3aed)'}}>
                            {user.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white flex items-center gap-1.5 truncate">
                              {user.name}
                              {user.role==='admin'&&<Crown className="w-3 h-3 text-red-400 flex-shrink-0"/>}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                          </div>
                        </div>

                        {/* Role badge */}
                        <div className="col-span-2 flex justify-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={user.role==='admin'
                              ?{background:'rgba(255,23,68,0.15)',color:'#FF1744',border:'1px solid rgba(255,23,68,0.3)'}
                              :{background:'rgba(0,212,255,0.1)',color:'#00d4ff',border:'1px solid rgba(0,212,255,0.2)'}}>
                            {user.role}
                          </span>
                        </div>

                        {/* Photos count */}
                        <div className="col-span-2 text-center">
                          <span className="text-sm font-mono text-slate-300">{user.photoCount}</span>
                        </div>

                        {/* Date */}
                        <div className="col-span-2 text-center">
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          {/* Toggle role */}
                          <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                            onClick={()=>handleRoleChange(user._id, user.role==='admin'?'user':'admin')}
                            title={user.role==='admin'?'Demote to User':'Promote to Admin'}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{background:user.role==='admin'?'rgba(0,212,255,0.1)':'rgba(255,23,68,0.1)',
                              border:`1px solid ${user.role==='admin'?'rgba(0,212,255,0.3)':'rgba(255,23,68,0.3)'}`,
                              color:user.role==='admin'?'#00d4ff':'#FF1744'}}>
                            {user.role==='admin'?<Shield className="w-3.5 h-3.5"/>:<Crown className="w-3.5 h-3.5"/>}
                          </motion.button>

                          {/* Delete */}
                          <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                            onClick={()=>handleDeleteUser(user._id, user.name)}
                            title="Delete user"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',color:'rgba(239,68,68,0.7)'}}>
                            <Trash2 className="w-3.5 h-3.5"/>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                    <span className="text-xs text-slate-500 font-mono">Page {page} of {pages}</span>
                    <div className="flex items-center gap-2">
                      <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                        <ChevronLeft className="w-4 h-4"/>
                      </motion.button>
                      {Array.from({length:Math.min(5,pages)},(_,i)=>{
                        const p = page<=3?i+1:page-2+i;
                        if(p<1||p>pages) return null;
                        return (
                          <motion.button key={p} whileHover={{scale:1.05}} onClick={()=>setPage(p)}
                            className="w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all"
                            style={p===page
                              ?{background:'rgba(0,212,255,0.15)',border:'1px solid rgba(0,212,255,0.4)',color:'#00d4ff'}
                              :{border:'1px solid rgba(255,255,255,0.07)',color:'rgba(148,163,184,0.7)'}}>
                            {p}
                          </motion.button>
                        );
                      })}
                      <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                        <ChevronRight className="w-4 h-4"/>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}