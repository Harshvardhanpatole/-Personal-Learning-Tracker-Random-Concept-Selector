import { BookOpen, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate('/'); };
  return <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
    <div className="flex items-center gap-6"><Link to="/dashboard" className="flex items-center gap-2 font-display font-bold text-ink"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-cyan"><BookOpen size={20}/></span><span className="hidden sm:inline">Learning Tracker</span></Link><Link to="/dashboard" className="hidden text-sm font-semibold text-slate-600 hover:text-ink md:block">My Projects</Link></div>
    <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{user?.name}</p><p className="text-xs text-slate-500">My learning space</p></div><button className="btn-ghost !px-3" onClick={signOut} aria-label="Log out"><LogOut size={17}/><span className="hidden sm:inline">Logout</span></button></div>
  </div></header>;
}
