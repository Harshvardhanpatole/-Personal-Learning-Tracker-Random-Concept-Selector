import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

export default function App() { const location = useLocation(); return <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}><Route path="/" element={<WelcomePage/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/signup" element={<AuthPage mode="signup"/>}/><Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/projects/:id" element={<ProjectDetails/>}/></Route><Route path="*" element={<WelcomePage/>}/></Routes></AnimatePresence>; }
