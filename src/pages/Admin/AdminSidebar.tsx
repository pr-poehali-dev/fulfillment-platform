import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { Tab } from "./types";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  ownerName: string;
  userEmail: string;
  userId?: number;
  onLogout: () => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  tab,
  setTab,
  ownerName,
  userEmail,
  userId,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-950 text-white transition-transform duration-200 flex flex-col`}>
      {/* Brand */}
      <div className="h-14 px-4 flex items-center gap-2 border-b border-white/10 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
            <Icon name="Package" size={14} className="text-navy-950" />
          </div>
          <div>
            <div className="font-golos font-bold text-sm leading-none group-hover:text-gold-400 transition-colors">FulfillHub</div>
            <div className="text-xs text-white/40 mt-0.5">Личный кабинет</div>
          </div>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
          <Icon name="X" size={18} />
        </button>
      </div>

      {/* Owner info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center">
            <Icon name="User" size={18} className="text-navy-300" />
          </div>
          <div className="min-w-0">
            <div className="font-golos font-bold text-sm truncate">{ownerName || "Профиль не заполнен"}</div>
            {userId && (
              <div className="text-xs text-white/30 font-mono mt-0.5">PRO-{String(userId).padStart(6, "0")}</div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {([
          { id: "profile" as Tab, label: "Мой профиль", icon: "User" },
          { id: "fulfillments" as Tab, label: "Мои фулфилменты", icon: "Warehouse" },
          { id: "quotes" as Tab, label: "Заявки", icon: "Inbox" },
          { id: "subscribers" as Tab, label: "Подписчики", icon: "Mail" },
          { id: "settings" as Tab, label: "Настройки", icon: "Settings" },
          { id: "support" as Tab, label: "Техподдержка", icon: "LifeBuoy" },
        ]).map((item) => (
          <button key={item.id}
            onClick={() => { setTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === item.id ? "bg-gold-500/15 text-gold-400" : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}>
            <Icon name={item.icon} size={16} />
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
          <Icon name="ArrowLeft" size={14} />
          На главную
        </Link>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <Icon name="LogOut" size={14} />
          Выйти
        </button>
        <div className="px-3 pt-2 border-t border-white/5">
          <div className="text-xs text-white/20 font-ibm truncate">{userEmail}</div>
        </div>
      </div>
    </aside>
  );
}