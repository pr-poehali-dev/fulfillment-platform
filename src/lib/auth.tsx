import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api, { setToken } from "./api";

interface User {
  id: number;
  email: string;
  role: string;
  email_verified: boolean;
}

interface Fulfillment {
  id: number;
  company_name: string;
  status: string;
}

interface AuthCtx {
  user: User | null;
  fulfillment: Fulfillment | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string) => Promise<{ email_code_hint?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, fulfillment: null, loading: true,
  login: async () => {}, register: async () => ({}), logout: () => {}, refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("fh:token");
    if (!token) { setUser(null); setFulfillment(null); setLoading(false); return; }
    try {
      const data = await api.me();
      setUser(data.user);
      setFulfillment(data.fulfillment);
    } catch {
      setToken("");
      setUser(null);
      setFulfillment(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setToken(data.token);
    setUser(data.user);
    await refresh();
  };

  const register = async (email: string, password: string, phone: string) => {
    const data = await api.register(email, password, phone);
    setToken(data.token);
    setUser(data.user);
    await refresh();
    return { email_code_hint: data.email_code_hint };
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setFulfillment(null);
  };

  return (
    <Ctx.Provider value={{ user, fulfillment, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
