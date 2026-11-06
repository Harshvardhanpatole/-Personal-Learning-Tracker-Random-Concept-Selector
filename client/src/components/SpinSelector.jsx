import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SpinSelector({ pending, hasActive, onSpin }) {
  const [display, setDisplay] = useState('Ready when you are'); const [spinning, setSpinning] = useState(false); const [selected, setSelected] = useState(null);
  useEffect(() => { if (!spinning && !selected) setDisplay(pending.length ? 'Choose your next focus' : 'Add concepts to get started'); }, [pending.length, spinning, selected]);
  const spin = async () => {
    if (spinning || hasActive || !pending.length) return;
    setSpinning(true); setSelected(null); let interval; const started = Date.now();
    interval = setInterval(() => setDisplay(pending[Math.floor(Math.random() * pending.length)].name), 75);
    try {
      const response = await onSpin();
      const elapsed = Date.now() - started; await new Promise((resolve) => setTimeout(resolve, Math.max(900, 1700 - elapsed)));
      clearInterval(interval); setDisplay(response.name); setSelected(response.name);
    } catch (error) { clearInterval(interval); setDisplay(error.message); }
    finally { setSpinning(false); }
  };
  const disabled = spinning || hasActive || !pending.length;
  return <section className="relative overflow-hidden rounded-2xl bg-ink p-5 text-white shadow-soft"><div className="absolute -right-9 -top-10 h-32 w-32 rounded-full bg-cyan/15"/><div className="relative"><div className="flex items-center gap-2 text-sm font-bold text-cyan"><Sparkles size={18}/> Random concept selector</div><div className="mt-5 grid min-h-24 place-items-center rounded-xl border border-white/10 bg-white/5 px-4 text-center"><AnimatePresence mode="wait"><motion.p key={display} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -9 }} transition={{ duration: .12 }} className={`font-display text-lg font-bold ${selected ? 'text-cyan' : 'text-white'}`}>{display}</motion.p></AnimatePresence></div>{hasActive && <p className="mt-3 text-xs leading-5 text-slate-300">Complete the current concept before spinning again.</p>} {!hasActive && !pending.length && <p className="mt-3 text-xs leading-5 text-slate-300">Add a pending concept to make a selection.</p>}<button onClick={spin} disabled={disabled} className="btn-secondary mt-5 w-full">{spinning ? 'Selecting…' : 'Spin now'}</button></div></section>;
}
