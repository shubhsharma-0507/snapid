'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLES = Array.from({length:80},(_,i)=>({
  id:i, x:(i*37.3)%100, y:(i*61.7)%100,
  size:(i%4)+1.2, dur:5+(i%9), delay:(i*0.28)%6,
  color:i%4===0?'#00d4ff':i%4===1?'#8B5CF6':i%4===2?'#FFD700':'#00FF80',
  op:0.25+(i%6)*0.09,
}));

export function RoyalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
    let raf:number;

    const onResize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    window.addEventListener('resize',onResize);

    // Matrix rain columns
    const cols = Math.floor(W/20);
    const drops = Array.from({length:cols},()=>Math.random()*H);
    const chars = '01アイウエオカキクケコABCDEF∑∆Ω∇⊕⊗◈◉▣';

    let frame=0;
    function draw() {
      frame++;
      ctx.fillStyle='rgba(4,5,14,0.06)';
      ctx.fillRect(0,0,W,H);

      // Matrix chars
      ctx.font='12px monospace';
      for(let i=0;i<cols;i++){
        const c=chars[Math.floor(Math.random()*chars.length)];
        const alpha=Math.random()*0.3;
        ctx.fillStyle=`rgba(0,212,255,${alpha})`;
        ctx.fillText(c,i*20,drops[i]);
        if(drops[i]>H&&Math.random()>0.975) drops[i]=0;
        drops[i]+=0.8;
      }

      // Grid lines pulse
      if(frame%3===0){
        const pulse=Math.sin(frame*0.02)*0.03+0.03;
        ctx.strokeStyle=`rgba(0,212,255,${pulse})`;
        ctx.lineWidth=0.5;
        for(let x=0;x<W;x+=70){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
        for(let y=0;y<H;y+=70){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      }

      // Scanning beam
      const scanY = (frame*1.5)%H;
      const sg = ctx.createLinearGradient(0,scanY-40,0,scanY+40);
      sg.addColorStop(0,'rgba(0,212,255,0)');
      sg.addColorStop(0.5,'rgba(0,212,255,0.04)');
      sg.addColorStop(1,'rgba(0,212,255,0)');
      ctx.fillStyle=sg;
      ctx.fillRect(0,scanY-40,W,80);

      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);};
  },[]);

  return (
    <>
      {/* Canvas matrix */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />

      {/* Particle field */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {PARTICLES.map(p=>(
          <motion.div key={p.id}
            className="absolute rounded-full"
            style={{left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,background:p.color,opacity:p.op,boxShadow:`0 0 ${p.size*3}px ${p.color}`}}
            animate={{y:[0,-35,0],x:[0,p.id%2===0?12:-12,0],opacity:[p.op,p.op*2.2,p.op],scale:[1,1.8,1]}}
            transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:'easeInOut'}}
          />
        ))}
      </div>

      {/* Ambient orbs */}
      {[
        {x:'-10%',y:'-15%',size:'800px',color:'#00d4ff',op:0.08,dur:10},
        {x:'75%',  y:'80%', size:'600px',color:'#8B5CF6',op:0.07,dur:13},
        {x:'40%',  y:'40%', size:'400px',color:'#FFD700', op:0.03,dur:16},
        {x:'90%',  y:'10%', size:'350px',color:'#00FF80', op:0.04,dur:11},
      ].map((orb,i)=>(
        <motion.div key={i}
          className="fixed rounded-full pointer-events-none z-0"
          style={{left:orb.x,top:orb.y,width:orb.size,height:orb.size,
            background:`radial-gradient(circle,${orb.color},transparent 70%)`,opacity:orb.op}}
          animate={{scale:[1,1.25,1],opacity:[orb.op,orb.op*1.8,orb.op]}}
          transition={{duration:orb.dur,repeat:Infinity,ease:'easeInOut',delay:i*2}}
        />
      ))}

      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`}}
      />
    </>
  );
}