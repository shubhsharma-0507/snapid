'use client';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { User, Mail, Lock, Trash2, LogOut, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ── These MUST be outside ProfilePage — if defined inside, React remounts
// them on every render and the input loses focus after each keystroke ──────
function InputField({ label, value, onChange, type='text', placeholder, accent='#00d4ff' }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder: string; accent?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: accent + '99' }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm outline-none transition-all"
        style={{ background: `${accent}06`, border: `1px solid ${accent}20` }}
        onFocus={e => { e.target.style.borderColor = `${accent}70`; e.target.style.boxShadow = `0 0 20px ${accent}15`; }}
        onBlur={e  => { e.target.style.borderColor = `${accent}20`; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function MsgBox({ msg }: { msg: { type: 'success'|'error'; text: string } }) {
  return (
    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
      className="flex items-center gap-2 p-3 rounded-xl text-sm"
      style={{ background: msg.type==='success'?'rgba(0,255,128,0.08)':'rgba(239,68,68,0.08)', border:`1px solid ${msg.type==='success'?'rgba(0,255,128,0.25)':'rgba(239,68,68,0.25)'}`, color: msg.type==='success'?'#00FF80':'#ff6b6b' }}>
      {msg.type==='success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0"/> : <AlertCircle className="w-4 h-4 flex-shrink-0"/>}
      {msg.text}
    </motion.div>
  );
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{type:'success'|'error';text:string}|null>(null);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{type:'success'|'error';text:string}|null>(null);

  const [nameInitialized, setNameInitialized] = useState(false);
  useEffect(()=>{ if(session?.user?.name && !nameInitialized){ setName(session.user.name); setNameInitialized(true); } },[session?.user?.name, nameInitialized]);

  const handleSaveProfile = async () => {
    if(!name.trim()){setProfileMsg({type:'error',text:'Name cannot be empty'});return;}
    setProfileLoading(true); setProfileMsg(null);
    try {
      const r=await fetch('/api/user/update-profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name.trim()})});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error);
      await update({name:name.trim()});
      setProfileMsg({type:'success',text:'Profile updated successfully!'});
    } catch(e:any){ setProfileMsg({type:'error',text:e.message}); }
    finally { setProfileLoading(false); }
  };

  const handleChangePassword = async () => {
    if(!currentPassword||!newPassword){setPassMsg({type:'error',text:'All fields required'});return;}
    if(newPassword.length<8){setPassMsg({type:'error',text:'Min 8 characters'});return;}
    if(newPassword!==confirmPassword){setPassMsg({type:'error',text:'Passwords do not match'});return;}
    setPassLoading(true); setPassMsg(null);
    try {
      const r=await fetch('/api/user/change-password',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword,newPassword})});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error);
      setPassMsg({type:'success',text:'Password changed!'});
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch(e:any){ setPassMsg({type:'error',text:e.message}); }
    finally { setPassLoading(false); }
  };

  const strengthLabel = !newPassword?'':newPassword.length<6?'Weak':newPassword.length<9?'Fair':newPassword.length<12?'Good':'Strong';
  const strengthColor = {Weak:'#FF1744',Fair:'#FF6B00',Good:'#FFD700',Strong:'#00FF80'}[strengthLabel]||'transparent';

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-cyan-500/10" style={{background:'rgba(4,5,14,0.88)',backdropFilter:'blur(28px)'}}>
        <motion.div className="h-px" style={{background:'linear-gradient(90deg,transparent,#00d4ff,#8B5CF6,transparent)'}} animate={{opacity:[0.5,1,0.5]}} transition={{duration:3,repeat:Infinity}}/>
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <motion.button whileHover={{scale:1.1}} onClick={()=>router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all">
            <ArrowLeft className="w-4 h-4"/>
          </motion.button>
          <div>
            <h1 className="text-lg font-extrabold text-white" style={{fontFamily:'Syne,sans-serif'}}>Profile Settings</h1>
            <p className="text-xs font-mono text-slate-500">Account Control Panel</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-6">

          {/* Account Info */}
          <div className="glass-card hud-corners p-6 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00d4ff,transparent)'}}/>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)',backgroundSize:'25px 25px'}}/>

            <div className="relative z-10">
              <h2 className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <User className="w-4 h-4"/> Account Information
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div whileHover={{scale:1.08,rotate:5}} className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white"
                    style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)'}}>
                    {(session?.user?.name||'U')[0].toUpperCase()}
                  </div>
                  <motion.div className="absolute inset-0 rounded-2xl" style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)',opacity:0.4,filter:'blur(8px)'}}
                    animate={{opacity:[0.2,0.5,0.2]}} transition={{duration:2,repeat:Infinity}}/>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-900"/>
                  </div>
                </motion.div>
                <div>
                  <p className="font-bold text-white text-lg">{session?.user?.name}</p>
                  <p className="text-slate-400 text-sm">{session?.user?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-cyan-400"/>
                    <span className="text-xs text-cyan-400 font-mono">Verified Account</span>
                  </div>
                </div>
              </div>

              <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name"/>

              <div className="mt-4">
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-slate-600">Email (read-only)</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)'}}>
                  <Mail className="w-4 h-4 text-slate-600"/>
                  <span className="text-slate-600 text-sm">{session?.user?.email}</span>
                  <span className="ml-auto text-xs text-slate-700 font-mono">locked</span>
                </div>
              </div>

              {profileMsg && <MsgBox msg={profileMsg}/>}

              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleSaveProfile} disabled={profileLoading}
                className="btn-primary w-full justify-center py-3 mt-4 disabled:opacity-50">
                {profileLoading?<><Loader2 className="w-4 h-4 animate-spin"/>Saving…</>:<><Zap className="w-4 h-4"/>Save Changes</>}
              </motion.button>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card hud-corners p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#8B5CF6,transparent)'}}/>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)',backgroundSize:'25px 25px'}}/>

            <div className="relative z-10">
              <h2 className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4"/> Change Password
              </h2>

              <div className="space-y-4">
                <InputField label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="••••••••" accent="#8B5CF6"/>
                <InputField label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="Min 8 characters" accent="#8B5CF6"/>
                <InputField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="Repeat new password" accent="#8B5CF6"/>
              </div>

              {newPassword && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i=>(
                      <motion.div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{background:newPassword.length>=i*3?strengthColor:'rgba(255,255,255,0.08)'}}
                        animate={{boxShadow:newPassword.length>=i*3?`0 0 8px ${strengthColor}60`:'none'}}/>
                    ))}
                  </div>
                  <p className="text-xs font-mono" style={{color:strengthColor}}>{strengthLabel}</p>
                </div>
              )}

              {passMsg && <MsgBox msg={passMsg}/>}

              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleChangePassword} disabled={passLoading}
                className="w-full justify-center py-3 mt-4 disabled:opacity-50 rounded-xl font-semibold flex items-center gap-2 transition-all"
                style={{background:'linear-gradient(135deg,#8B5CF6,#6D28D9)',color:'#fff',boxShadow:'0 0 25px rgba(139,92,246,0.3)'}}>
                {passLoading?<><Loader2 className="w-4 h-4 animate-spin"/>Updating…</>:<><Shield className="w-4 h-4"/>Update Password</>}
              </motion.button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card hud-corners p-6 space-y-4 relative overflow-hidden" style={{borderColor:'rgba(239,68,68,0.25)'}}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#FF1744,transparent)'}}/>
            <div className="relative z-10">
              <h2 className="text-sm font-bold text-red-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4"/> Danger Zone
              </h2>
              <p className="text-xs text-slate-500 mb-4">Permanent actions — cannot be undone</p>
              <div className="flex flex-col gap-2">
                <motion.button whileHover={{scale:1.02,backgroundColor:'rgba(239,68,68,0.12)'}} onClick={()=>signOut({callbackUrl:'/'})}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all"
                  style={{borderColor:'rgba(239,68,68,0.25)',color:'rgba(239,68,68,0.8)'}}>
                  <LogOut className="w-4 h-4"/> Sign Out
                </motion.button>
                <motion.button whileHover={{scale:1.02,backgroundColor:'rgba(239,68,68,0.12)'}}
                  onClick={()=>{if(confirm('Delete account? This cannot be undone.'))signOut({callbackUrl:'/'});}}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all"
                  style={{borderColor:'rgba(239,68,68,0.25)',color:'rgba(239,68,68,0.8)'}}>
                  <Trash2 className="w-4 h-4"/> Delete Account
                </motion.button>
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}