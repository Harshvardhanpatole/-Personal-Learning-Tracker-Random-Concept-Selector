import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { MoreHorizontal, Pencil, Trash2, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const [menu, setMenu] = useState(false); const Icon = Icons[project.icon] || Icons.BookOpen;
  return <motion.article layout whileHover={{ y: -4 }} className="card relative p-5"><div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan/15 text-ink"><Icon size={23}/></div><div className="relative"><button onClick={() => setMenu(!menu)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Project actions"><MoreHorizontal size={19}/></button>{menu && <div className="absolute right-0 z-10 mt-1 w-36 rounded-xl border border-slate-100 bg-white p-1 shadow-lg"><button onClick={() => { setMenu(false); onEdit(project); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50"><Pencil size={15}/>Edit</button><button onClick={() => { setMenu(false); onDelete(project); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"><Trash2 size={15}/>Delete</button></div>}</div></div><h2 className="mt-5 font-display text-lg font-bold text-ink">{project.name}</h2><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{project.description || 'A focused space for your next learning goal.'}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs font-medium text-slate-500">{project.pending_count || 0} pending · {project.completed_count || 0} done</span><Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900">Open <ArrowUpRight size={16}/></Link></div></motion.article>;
}
