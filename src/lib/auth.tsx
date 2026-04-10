import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api, { setToken } from "./api";

interface User {
  id: number;
  email: string;
  role: string;
  email_verified: boolean;
}

interface OwnerProfileMini {
  id: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_tg: string;
  inn: string;
}

interface FulfillmentMini {
  id: number;
  company_name: string;
  status: string;
}

interface AuthCtx {
  user: User | null;
  ownerProfile: OwnerProfileMini | null;
  fulfillment: FulfillmentMini | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, ownerProfile: null, fulfillment: null, loading: true,
  login: async () => {}, register: async () => ({}), logout: () => {}, refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfileMini | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMini | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("fh:token");
    if (!token) { setUser(null); setOwnerProfile(null); setFulfillment(null); setLoading(false); return; }
    try {
      const data = await api.me();
      setUser(data.user);
      setOwnerProfile(data.owner_profile || null);
      setFulfillment(data.fulfillment || null);
    } catch {
      setToken("");
      setUser(null);
      setOwnerProfile(null);
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
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setOwnerProfile(null);
    setFulfillment(null);
  };

  return (
    <Ctx.Provider value={{ user, ownerProfile, fulfillment, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
