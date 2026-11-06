import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function LoadingScreen() {
  return <div className="grid min-h-screen place-items-center bg-ink text-white"><div className="text-center">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border-2 border-cyan bg-white/10"><GraduationCap className="h-8 w-8 text-cyan" /></motion.div>
    <p className="font-display text-lg">Preparing your learning space</p><div className="mx-auto mt-4 h-1.5 w-36 overflow-hidden rounded-full bg-white/15"><motion.div className="h-full rounded-full bg-cyan" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }} /></div>
  </div></div>;
}
