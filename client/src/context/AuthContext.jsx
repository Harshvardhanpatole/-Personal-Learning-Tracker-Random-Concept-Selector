import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.me().then(({ user: currentUser }) => setUser(currentUser)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const value = {
    user, loading,
    login: async (payload) => { const data = await api.login(payload); setUser(data.user); },
    register: async (payload) => { const data = await api.register(payload); setUser(data.user); },
    logout: async () => { await api.logout(); setUser(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
