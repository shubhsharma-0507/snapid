'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Upload, Loader2, CheckCircle2, Download,
  RefreshCw, Sparkles, ArrowLeft, Printer,
  Sun, Contrast, Wand2, User, Calendar
} from 'lucide-react';

type Step = 'upload' | 'processing' | 'color' | 'review';
type WatermarkStyle = 'sideBySide' | 'stacked';

const COUNTRIES = [
  { id: 'india',     label: 'India',     size: '35×45mm',  w: 413, h: 531 },
  { id: 'usa',       label: 'USA',       size: '2×2 inch', w: 600, h: 600 },
  { id: 'uk',        label: 'UK',        size: '35×45mm',  w: 413, h: 531 },
  { id: 'canada',    label: 'Canada',    size: '50×70mm',  w: 591, h: 827 },
  { id: 'australia', label: 'Australia', size: '35×45mm',  w: 413, h: 531 },
  { id: 'schengen',  label: 'Schengen',  size: '35×45mm',  w: 413, h: 531 },
];

const SIZE_GUIDE = [
  { label: 'Passport (India)',        w: 35, h: 45, note: 'Standard Indian passport application' },
  { label: 'PAN Card',                w: 25, h: 25, note: 'Income Tax PAN application' },
  { label: 'Voter ID (EPIC)',         w: 25, h: 35, note: 'Election Commission enrollment' },
  { label: 'Driving Licence',         w: 35, h: 45, note: 'RTO application (most states)' },
  { label: 'Govt Exam / Stamp Size',  w: 20, h: 25, note: 'UPSC, SSC, Railway, bank exam forms' },
  { label: 'US Visa',                 w: 51, h: 51, note: 'US visa DS-160 application (2×2 inch)' },
  { label: 'Schengen Visa',           w: 35, h: 45, note: 'EU Schengen visa application' },
  { label: 'UK Visa',                 w: 35, h: 45, note: 'UK visa application' },
  { label: 'Canada Visa',             w: 50, h: 70, note: 'Canada visa / PR application' },
];

const BG_COLORS = [
  { color: '#FFFFFF', label: 'White' },
  { color: '#D6E4FF', label: 'Light Blue' },
  { color: '#E8E8E8', label: 'Grey' },
  { color: '#F5F0E8', label: 'Cream' },
];

function enhanceImage(src: HTMLImageElement): string {
  const c   = document.createElement('canvas');
  c.width   = src.naturalWidth;
  c.height  = src.naturalHeight;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const imageData = ctx.getImageData(0, 0, c.width, c.height);
  const data      = imageData.data;
  let rMin=255,rMax=0,gMin=255,gMax=0,bMin=255,bMax=0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i+3] < 10) continue;
    rMin=Math.min(rMin,data[i]);   rMax=Math.max(rMax,data[i]);
    gMin=Math.min(gMin,data[i+1]); gMax=Math.max(gMax,data[i+1]);
    bMin=Math.min(bMin,data[i+2]); bMax=Math.max(bMax,data[i+2]);
  }
  const rRange = rMax-rMin||1, gRange = gMax-gMin||1, bRange = bMax-bMin||1;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i+3] < 10) continue;
    let r = ((data[i]   - rMin) / rRange) * 255;
    let g = ((data[i+1] - gMin) / gRange) * 255;
    let b = ((data[i+2] - bMin) / bRange) * 255;
    r += 18; g += 18; b += 18;
    const cf = 1.25;
    r = cf * (r - 128) + 128;
    g = cf * (g - 128) + 128;
    b = cf * (b - 128) + 128;
    r += 10; g += 4;
    const avg = (r + g + b) / 3;
    const sat = 0.12;
    r += (r - avg) * sat;
    g += (g - avg) * sat;
    b += (b - avg) * sat;
    data[i]   = Math.min(255, Math.max(0, r));
    data[i+1] = Math.min(255, Math.max(0, g));
    data[i+2] = Math.min(255, Math.max(0, b));
  }
  ctx.putImageData(imageData, 0, 0);
  const glowC   = document.createElement('canvas');
  glowC.width   = c.width; glowC.height = c.height;
  const glowCtx = glowC.getContext('2d')!;
  glowCtx.filter = 'blur(18px)';
  glowCtx.drawImage(c, 0, 0);
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.08;
  ctx.drawImage(glowC, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  const sharpC   = document.createElement('canvas');
  sharpC.width   = c.width; sharpC.height = c.height;
  const sCtx     = sharpC.getContext('2d')!;
  sCtx.filter    = 'blur(1px)';
  sCtx.drawImage(c, 0, 0);
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.06;
  ctx.drawImage(sharpC, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  return c.toDataURL('image/png');
}

function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) onFile(f);
  }, [onFile]);
  return (
    <label
      className={`flex flex-col items-center justify-center w-full h-72 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
        dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/20 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/5'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <div className="text-center px-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
          <Upload className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="text-lg font-semibold text-white mb-1">Drop your photo here</p>
        <p className="text-sm text-slate-400">or click to browse — JPG, PNG, WEBP</p>
        <p className="text-xs text-slate-500 mt-2">AI will auto-enhance your photo</p>
      </div>
    </label>
  );
}

export default function GeneratorPage() {
  const router = useRouter();

  const [step,            setStep]           = useState<Step>('upload');
  const [originalImage,   setOriginalImage]  = useState('');
  const [processedImage,  setProcessedImage] = useState('');
  const [enhancedImage,   setEnhancedImage]  = useState('');
  const [bgColor,         setBgColor]        = useState('#FFFFFF');
  const [country,         setCountry]        = useState('india');
  const [sizeMode,        setSizeMode]       = useState<'preset' | 'custom'>('preset');
  const [customWidthMM,   setCustomWidthMM]  = useState(35);
  const [customHeightMM,  setCustomHeightMM] = useState(45);
  const [showSizeGuide,   setShowSizeGuide]  = useState(false);
  const [copies,          setCopies]         = useState(4);
  const [layoutMode,      setLayoutMode]     = useState<'auto' | 'custom'>('auto');
  const [customRows,      setCustomRows]     = useState(2);
  const [customCols,      setCustomCols]     = useState(2);
  const [photoName,       setPhotoName]      = useState('');
  const [photoDate,       setPhotoDate]      = useState(() => new Date().toLocaleDateString('en-IN'));
  const [showWatermark,   setShowWatermark]  = useState(true);
  const [watermarkStyle,  setWatermarkStyle] = useState<WatermarkStyle>('stacked');
  const [loading,         setLoading]        = useState(false);
  const [loadingMsg,      setLoadingMsg]     = useState('');
  const [error,           setError]          = useState('');
  const [sheetDataUrl,    setSheetDataUrl]   = useState('');

  const stepNum    = { upload:1, processing:2, color:3, review:4 }[step];
  const MM_TO_PX = 300 / 25.4;
  const countryData = sizeMode === 'custom'
    ? { id: 'custom', label: 'Custom', size: `${customWidthMM}×${customHeightMM}mm`,
        w: Math.max(20, Math.round(customWidthMM  * MM_TO_PX)),
        h: Math.max(20, Math.round(customHeightMM * MM_TO_PX)) }
    : (COUNTRIES.find(c => c.id === country) || COUNTRIES[0]);
  const cols = layoutMode === 'custom'
    ? Math.max(1, customCols)
    : (copies <= 2 ? 1 : copies <= 4 ? 2 : copies <= 9 ? 3 : 4);
  const rows = layoutMode === 'custom'
    ? Math.max(1, customRows)
    : Math.ceil(copies / cols);
  const totalCopies = layoutMode === 'custom' ? cols * rows : copies;

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d')!.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.95));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
      img.src = url;
    });

  const handleFile = async (file: File) => {
    setError(''); setStep('processing'); setLoading(true);
    try {
      setLoadingMsg('Loading image…');
      const base64 = await fileToBase64(file);
      setOriginalImage(base64);
      setLoadingMsg('Removing background with AI…');
      const res  = await fetch('/api/process/remove-background', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (!res.ok || !data.imageWithoutBg) throw new Error(data.error || 'Background removal failed');
      setProcessedImage(data.imageWithoutBg);
      setLoadingMsg('Applying AI beauty enhancements…');
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try { const enhanced = enhanceImage(img); setEnhancedImage(enhanced); resolve(); }
          catch(e) { reject(e); }
        };
        img.onerror = reject;
        img.src = data.imageWithoutBg;
      });
      setLoading(false);
      setStep('color');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      setStep('upload');
    }
  };

  const handleGenerate = async () => {
    const sourceImage = enhancedImage || processedImage;
    if (!sourceImage) { setError('No image found. Please upload again.'); return; }
    setError(''); setLoading(true); setLoadingMsg('Building photo sheet…');
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res(); img.onerror = rej;
        img.src = sourceImage;
      });
      const photoW = countryData.w;
      const photoH = countryData.h;
      const wmH    = showWatermark
        ? Math.round(photoH * (watermarkStyle === 'stacked' ? 0.16 : 0.11))
        : 0;
      const gap     = 10;
      const padding = 20;
      const sheetW = cols * photoW + (cols - 1) * gap + padding * 2;
      const sheetH = rows * (photoH + wmH) + (rows - 1) * gap + padding * 2;
      const sheet   = document.createElement('canvas');
      sheet.width   = sheetW;
      sheet.height  = sheetH;
      const ctx     = sheet.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sheetW, sheetH);

      for (let i = 0; i < totalCopies; i++) {
        const col  = i % cols;
        const row  = Math.floor(i / cols);
        const x    = padding + col * (photoW + gap);
        const y    = padding + row * (photoH + wmH + gap);
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, photoW, photoH);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, photoW, photoH);
        ctx.clip();
        const scale  = Math.max(photoW / img.naturalWidth, photoH / img.naturalHeight);
        const drawW  = img.naturalWidth  * scale;
        const drawH  = img.naturalHeight * scale;
        const drawX  = x + (photoW - drawW) / 2;
        const drawY  = y;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth   = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, photoW - 1, photoH - 1);

        if (showWatermark && wmH > 0) {
          const wy   = y + photoH;
          const name = photoName.trim() || 'Name';
          const date = photoDate.trim() || new Date().toLocaleDateString('en-IN');
          if (watermarkStyle === 'sideBySide') {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(x, wy, photoW, wmH);
            const fontSize = Math.round(wmH * 0.38);
            ctx.font = `600 ${fontSize}px Arial, sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillText(name, x + 8, wy + wmH / 2);
            ctx.textAlign = 'right';
            ctx.fillText(date, x + photoW - 8, wy + wmH / 2);
            ctx.strokeStyle = '#333366';
            ctx.lineWidth   = 1;
            ctx.strokeRect(x + 0.5, wy + 0.5, photoW - 1, wmH - 1);
          } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, wy, photoW, wmH);
            const nameFontSize = Math.round(wmH * 0.32);
            const dateFontSize = Math.round(wmH * 0.24);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `700 ${nameFontSize}px Arial, sans-serif`;
            ctx.fillStyle = '#1a1a2e';
            ctx.fillText(name.toUpperCase(), x + photoW / 2, wy + wmH * 0.38);
            ctx.font = `500 ${dateFontSize}px Arial, sans-serif`;
            ctx.fillStyle = '#444444';
            ctx.fillText(date, x + photoW / 2, wy + wmH * 0.72);
            ctx.strokeStyle = '#dddddd';
            ctx.lineWidth   = 1;
            ctx.strokeRect(x + 0.5, wy + 0.5, photoW - 1, wmH - 1);
          }
        }
      }

      // ── Save to DB + Cloudinary ──────────────────────────────────────
      const sheetUrl = sheet.toDataURL('image/png');
      setSheetDataUrl(sheetUrl);

      // Only upload processedImage (smaller) — skip sheetImage to avoid request size limit
      fetch('/api/photos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processedImage: enhancedImage || processedImage,
          backgroundColor: bgColor,
          country: countryData.id,
          copies: totalCopies,
        }),
      })
        .then(r => r.json())
        .then(d => { if (!d.success) console.error('Save failed:', d.error); })
        .catch(e => console.error('Save error:', e));
      // ─────────────────────────────────────────────────────────────────

      setStep('review');
    } catch (err: any) {
      setError(err.message || 'Sheet generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!sheetDataUrl) return;
    const a = document.createElement('a');
    a.href = sheetDataUrl;
    a.download = `passport-${countryData.id}-${totalCopies}copies.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!sheetDataUrl) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
<title></title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{
    width:100%;height:100%;background:#fff;
    display:flex;align-items:center;justify-content:center;
    overflow:hidden;
  }
  img{
    display:block;
    max-width:100%;
    max-height:100%;
    width:auto;
    height:auto;
    object-fit:contain;
    page-break-inside:avoid;
    break-inside:avoid;
  }
  @media print{
    @page{margin:0;size:A4 portrait;}
    html,body{
      margin:0!important;padding:0!important;
      width:100vw;height:100vh;
    }
    img{
      max-width:100vw!important;
      max-height:100vh!important;
      width:auto!important;
      height:auto!important;
    }
  }
</style>
</head>
<body>
<img src="${sheetDataUrl}"/>
<script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script>
</body>
</html>`);
    win.document.close();
  };

  const handleReset = () => {
    setStep('upload'); setOriginalImage(''); setProcessedImage('');
    setEnhancedImage(''); setSheetDataUrl(''); setError('');
    setBgColor('#FFFFFF'); setCountry('india'); setCopies(4);
    setPhotoName(''); setShowWatermark(true); setWatermarkStyle('stacked');
    setLayoutMode('auto'); setCustomRows(2); setCustomCols(2);
    setSizeMode('preset'); setCustomWidthMM(35); setCustomHeightMM(45); setShowSizeGuide(false);
  };

  const handleBack = () => {
    if (step === 'review') { setError(''); setStep('color'); return; }
    if (step === 'color')  { setError(''); setStep('upload'); return; }
    router.back();
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> AI Passport Photo Generator
              </h1>
              <p className="text-xs text-slate-500">Step {stepNum} of 4</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[1,2,3,4].map(n => (
              <div key={n} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${n <= stepNum ? 'bg-cyan-400' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }} transition={{ duration:0.35 }}
          >
            {/* STEP 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Upload Your Photo</h2>
                  <p className="text-slate-400 text-sm">AI will auto-enhance brightness, contrast, glow & skin tone.</p>
                </div>
                <UploadZone onFile={handleFile} />
                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Sun,      label: 'Auto Brightness' },
                    { icon: Contrast, label: 'Auto Contrast'   },
                    { icon: Wand2,    label: 'Skin Glow'       },
                    { icon: Sparkles, label: 'AI Sharpen'      },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="glass-card p-3 flex flex-col items-center gap-2 text-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs text-slate-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Processing */}
            {step === 'processing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">AI is Working…</h2>
                {originalImage && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 max-h-72 flex items-center justify-center bg-white/5">
                    <img src={originalImage} alt="Original" className="max-h-72 object-contain" />
                  </div>
                )}
                <div className="glass-card p-6 space-y-4">
                  {[
                    'Removing background with AI…',
                    'Applying AI beauty enhancements…',
                    'Building photo sheet…',
                  ].map((msg, i) => {
                    const active = loadingMsg === msg;
                    const done   = [
                      'Applying AI beauty enhancements…',
                      'Building photo sheet…',
                    ].indexOf(loadingMsg) > [
                      'Removing background with AI…',
                      'Applying AI beauty enhancements…',
                      'Building photo sheet…',
                    ].indexOf(msg);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : active ? (
                          <Loader2 className="w-5 h-5 animate-spin text-cyan-400 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${active ? 'text-white font-medium' : done ? 'text-green-400' : 'text-slate-500'}`}>{msg}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Customize */}
            {step === 'color' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Customize Your Photo</h2>
                  <p className="text-slate-400 text-sm">AI enhancement applied ✨ — Now set your preferences.</p>
                </div>
                {enhancedImage && (
                  <div className="glass-card p-4">
                    <p className="text-xs text-slate-400 mb-3">AI Enhanced Preview</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 text-center">Original</p>
                        <div className="rounded-xl overflow-hidden border border-white/10 h-40 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                          <img src={processedImage} alt="Before" className="h-full object-contain" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400 mb-1 text-center">✨ AI Enhanced</p>
                        <div className="rounded-xl overflow-hidden border border-cyan-500/30 h-40 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                          <img src={enhancedImage} alt="After" className="h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Background Color */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Background Color</h3>
                  <div className="flex gap-3 flex-wrap items-end">
                    {BG_COLORS.map(({ color, label }) => (
                      <button key={color} onClick={() => setBgColor(color)} title={label}
                        className={`flex-1 min-w-[60px] h-12 rounded-xl border-2 transition-all ${bgColor===color?'border-cyan-400 scale-105':'border-white/10'}`}
                        style={{ backgroundColor: color }} />
                    ))}
                    <div className="flex flex-col items-center gap-1">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                        className="w-12 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent" />
                      <span className="text-xs text-slate-500">Custom</span>
                    </div>
                  </div>
                </div>

                {/* Country / Photo Size */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Country / Document</h3>
                    <button onClick={() => setShowSizeGuide(v => !v)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-full px-2.5 py-1 flex items-center gap-1 transition-colors">
                      📋 Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button onClick={() => setSizeMode('preset')}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${sizeMode==='preset'?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                      Preset Sizes
                      <div className="text-[10px] opacity-60 mt-0.5">Passport size (default)</div>
                    </button>
                    <button onClick={() => setSizeMode('custom')}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${sizeMode==='custom'?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                      Custom Size
                      <div className="text-[10px] opacity-60 mt-0.5">Set your own mm</div>
                    </button>
                  </div>
                  <AnimatePresence>
                    {showSizeGuide && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="overflow-hidden">
                        <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                          <p className="text-[11px] text-slate-400 mb-2">Tap a size to apply it to Custom Size — matched to common Indian document/utility requirements.</p>
                          {SIZE_GUIDE.map(g => (
                            <button key={g.label} onClick={() => { setSizeMode('custom'); setCustomWidthMM(g.w); setCustomHeightMM(g.h); setShowSizeGuide(false); }}
                              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                              <div>
                                <div className="text-xs font-medium text-white">{g.label}</div>
                                <div className="text-[10px] text-slate-500">{g.note}</div>
                              </div>
                              <div className="text-xs text-cyan-400 font-mono whitespace-nowrap ml-2">{g.w}×{g.h}mm</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {sizeMode === 'preset' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {COUNTRIES.map(c => (
                        <button key={c.id} onClick={() => setCountry(c.id)}
                          className={`p-3 rounded-xl text-left transition-all border ${country===c.id?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                          <div className="text-xs font-semibold">{c.label}</div>
                          <div className="text-xs opacity-60">{c.size}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-end gap-4">
                      <div>
                        <label className="text-xs text-slate-400 mb-1.5 block">Width (mm)</label>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setCustomWidthMM(Math.max(15, customWidthMM-1))} className="w-8 h-8 rounded-lg border border-white/10 text-white hover:bg-white/10 text-sm font-bold">−</button>
                          <input type="number" value={customWidthMM} onChange={e => setCustomWidthMM(Math.min(150, Math.max(15, Number(e.target.value) || 15)))}
                            className="w-14 text-center px-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                          <button onClick={() => setCustomWidthMM(Math.min(150, customWidthMM+1))} className="w-8 h-8 rounded-lg border border-white/10 text-white hover:bg-white/10 text-sm font-bold">+</button>
                        </div>
                      </div>
                      <span className="text-slate-500 pb-2">×</span>
                      <div>
                        <label className="text-xs text-slate-400 mb-1.5 block">Height (mm)</label>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setCustomHeightMM(Math.max(15, customHeightMM-1))} className="w-8 h-8 rounded-lg border border-white/10 text-white hover:bg-white/10 text-sm font-bold">−</button>
                          <input type="number" value={customHeightMM} onChange={e => setCustomHeightMM(Math.min(150, Math.max(15, Number(e.target.value) || 15)))}
                            className="w-14 text-center px-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                          <button onClick={() => setCustomHeightMM(Math.min(150, customHeightMM+1))} className="w-8 h-8 rounded-lg border border-white/10 text-white hover:bg-white/10 text-sm font-bold">+</button>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs pb-2">mm</span>
                    </div>
                  )}
                </div>

                {/* Copies / Layout */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Number of Copies</h3>
                    <p className="text-xs text-slate-500">Grid: {rows} rows × {cols} cols</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button onClick={() => setLayoutMode('auto')}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${layoutMode==='auto'?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                      Auto
                      <div className="text-[10px] opacity-60 mt-0.5">Just pick a count</div>
                    </button>
                    <button onClick={() => setLayoutMode('custom')}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${layoutMode==='custom'?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                      Custom Rows × Cols
                      <div className="text-[10px] opacity-60 mt-0.5">Set your own grid</div>
                    </button>
                  </div>
                  {layoutMode === 'auto' ? (
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCopies(Math.max(1,copies-1))} className="w-10 h-10 rounded-xl border border-white/10 text-white hover:bg-white/10 text-xl font-bold">−</button>
                      <span className="text-2xl font-bold text-white w-8 text-center">{copies}</span>
                      <button onClick={() => setCopies(Math.min(20,copies+1))} className="w-10 h-10 rounded-xl border border-white/10 text-white hover:bg-white/10 text-xl font-bold">+</button>
                      <span className="text-slate-400 text-sm ml-2">photos on sheet</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Rows</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setCustomRows(Math.max(1,customRows-1))} className="w-9 h-9 rounded-xl border border-white/10 text-white hover:bg-white/10 text-lg font-bold">−</button>
                          <span className="text-xl font-bold text-white w-6 text-center">{customRows}</span>
                          <button onClick={() => setCustomRows(Math.min(8,customRows+1))} className="w-9 h-9 rounded-xl border border-white/10 text-white hover:bg-white/10 text-lg font-bold">+</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Cols</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setCustomCols(Math.max(1,customCols-1))} className="w-9 h-9 rounded-xl border border-white/10 text-white hover:bg-white/10 text-lg font-bold">−</button>
                          <span className="text-xl font-bold text-white w-6 text-center">{customCols}</span>
                          <button onClick={() => setCustomCols(Math.min(8,customCols+1))} className="w-9 h-9 rounded-xl border border-white/10 text-white hover:bg-white/10 text-lg font-bold">+</button>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm">= {totalCopies} photos on sheet</span>
                    </div>
                  )}
                </div>

                {/* Watermark */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Name & Date on Photo</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Printed at bottom of each photo</p>
                    </div>
                    <button onClick={() => setShowWatermark(!showWatermark)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${showWatermark ? 'bg-cyan-500' : 'bg-white/10'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showWatermark ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  {showWatermark && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => setWatermarkStyle('sideBySide')}
                          className={`p-3 rounded-xl text-xs font-medium border transition-all ${watermarkStyle==='sideBySide'?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                          Side by Side
                          <div className="text-[10px] opacity-60 mt-1">Name ← → Date</div>
                        </button>
                        <button onClick={() => setWatermarkStyle('stacked')}
                          className={`p-3 rounded-xl text-xs font-medium border transition-all ${watermarkStyle==='stacked'?'border-cyan-400 bg-cyan-500/10 text-white':'border-white/10 text-slate-400 hover:border-white/20'}`}>
                          Stacked Centered
                          <div className="text-[10px] opacity-60 mt-1">Name / Date niche-niche</div>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                            <User className="w-3 h-3" /> Name
                          </label>
                          <input type="text" value={photoName} onChange={e => setPhotoName(e.target.value)} placeholder="Your Name"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
                        </div>
                        <div>
                          <label className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                            <Calendar className="w-3 h-3" /> Date
                          </label>
                          <input type="text" value={photoDate} onChange={e => setPhotoDate(e.target.value)} placeholder="DD/MM/YYYY"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                  onClick={handleGenerate} disabled={loading}
                  className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading
                    ? <><Loader2 className="w-5 h-5 animate-spin" />{loadingMsg}</>
                    : <><Sparkles className="w-5 h-5" />Generate Photo Sheet</>}
                </motion.button>
              </div>
            )}

            {/* STEP 4: Review */}
            {step === 'review' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Photo Sheet Ready!</h2>
                    <p className="text-slate-400 text-sm">{totalCopies} AI-enhanced photos · {countryData.label} · {rows}×{cols} grid</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label:'Copies',     value: String(totalCopies) },
                    { label:'Country',    value: countryData.label   },
                    { label:'Background', value: bgColor             },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass-card p-4 text-center">
                      <div className="text-xs text-slate-400 mb-1">{label}</div>
                      {label==='Background' ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: value }} />
                          <span className="text-xs text-white font-mono">{value}</span>
                        </div>
                      ) : (
                        <div className="text-base font-bold text-white">{value}</div>
                      )}
                    </div>
                  ))}
                </div>
                {sheetDataUrl && (
                  <div className="glass-card p-4">
                    <p className="text-xs text-slate-400 mb-3">Final sheet preview</p>
                    <img src={sheetDataUrl} alt="Photo sheet" className="w-full rounded-xl border border-white/10" />
                  </div>
                )}
                <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.98}}
                  onClick={() => setStep('color')}
                  className="btn-outline w-full flex items-center justify-center gap-2 py-3">
                  <ArrowLeft className="w-4 h-4" /> Edit Name / Background / Copies
                </motion.button>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={handleReset}
                    className="btn-outline flex items-center justify-center gap-2 py-3">
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </motion.button>
                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={handlePrint}
                    className="btn-outline flex items-center justify-center gap-2 py-3">
                    <Printer className="w-4 h-4" /> Print
                  </motion.button>
                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={handleDownload}
                    className="btn-primary justify-center py-3">
                    <Download className="w-5 h-5" /> Download PNG
                  </motion.button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}