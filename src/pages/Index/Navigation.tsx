import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 16 16" fill={star <= Math.round(rating) ? "#d4a017" : "#e2e8f0"}>
          <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" />
        </svg>
      ))}
    </div>
  );
}

export function BadgeChip({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    gold: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium whitespace-nowrap ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

export function Navbar({ active, setActive, onOpenCompare, compareCount, favoritesCount, onOpenFavorites }: {
  active: string;
  setActive: (s: string) => void;
  onOpenCompare: () => void;
  compareCount: number;
  favoritesCount: number;
  onOpenFavorites: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, fulfillment, loading: authLoading } = useAuth();
  const isLoggedIn = !authLoading && !!user;
  const displayName = fulfillment?.company_name || user?.email?.split("@")[0] || "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <button onClick={() => setActive("hero")} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
            <Icon name="Package" size={14} className="text-navy-950" />
          </div>
          <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
        </button>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={onOpenFavorites}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium transition-all ${favoritesCount > 0 ? "text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            title="Избранное">
            <Icon name="Heart" size={14} className={favoritesCount > 0 ? "fill-current" : ""} />
            {favoritesCount > 0 && <span className="text-xs font-bold">{favoritesCount}</span>}
          </button>
          {compareCount > 0 && (
            <button onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20">
              <Icon name="GitCompare" size={14} />
              <span>Сравнить</span>
              <span className="bg-gold-500 text-navy-950 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">{compareCount}</span>
            </button>
          )}
          <a href="/for-fulfillment" className="px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded transition-all">
            Разместить сервис
          </a>
          {isLoggedIn ? (
            <a href="/admin" className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-sm font-medium text-white transition-all">
              <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-navy-950 text-xs font-black font-golos">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{displayName}</span>
              <Icon name="ChevronRight" size={13} className="text-white/40" />
            </a>
          ) : (
            <a href="/auth" className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-lg text-sm font-bold font-golos transition-all">
              <Icon name="LogIn" size={14} />
              Вход / Регистрация
            </a>
          )}
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          <a href="/for-fulfillment" className="px-3 py-2 rounded text-sm text-gold-400 hover:bg-gold-500/10">Разместить сервис</a>
          {isLoggedIn ? (
            <a href="/admin" className="px-3 py-2 rounded text-sm text-white font-bold hover:bg-white/10 flex items-center gap-2">
              <div className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center text-navy-950 text-[10px] font-black font-golos">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{displayName}</span>
            </a>
          ) : (
            <a href="/auth" className="px-3 py-2 rounded text-sm text-white font-bold hover:bg-white/10 flex items-center gap-1.5">
              <Icon name="LogIn" size={14} />Вход / Регистрация
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

// ─── HERO (COMPACT) ──────────────────────────────────────────────────────────

export function HeroSection({ setActive }: { setActive: (s: string) => void }) {
  return (
    <section id="hero" className="relative flex items-center overflow-hidden" style={{ minHeight: "52vh" }}>
      <div className="absolute inset-0 bg-navy-gradient" />
      <div className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/8c7181ef-d597-45e4-8217-9f0563dabf62.jpg')`,
          backgroundSize: "cover", backgroundPosition: "center 40%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/40" />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 pt-24 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left: text */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3 opacity-0 animate-fade-in">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-widest uppercase font-ibm">B2B Маркетплейс фулфилмента</span>
            </div>
            <h1 className="font-golos font-black text-4xl md:text-5xl leading-tight text-white mb-3 opacity-0 animate-slide-up delay-100">
              Найдите <span className="text-gold-gradient">надёжного</span> партнёра
            </h1>
            <p className="text-white/60 text-base font-ibm font-light leading-relaxed mb-5 opacity-0 animate-fade-in delay-200">
              Сравнивайте тарифы, фильтруйте по нужным услугам и выбирайте фулфилмент под ваш товар
            </p>
            <div className="flex flex-wrap gap-2 opacity-0 animate-fade-in delay-300">
              <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold h-9 px-5" onClick={() => setActive("catalog")}>
                <Icon name="Search" size={15} className="mr-1.5" />Найти партнёра
              </Button>
              <a href="/for-fulfillment">
                <Button size="sm" variant="outline" className="border-gold-500/40 text-gold-400 bg-transparent hover:bg-gold-500/10 h-9 px-4">
                  <Icon name="Building2" size={15} className="mr-1.5" />Я — фулфилмент
                </Button>
              </a>
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex md:flex-col gap-4 md:gap-3 opacity-0 animate-fade-in delay-400">
            {[
              { value: "200+", label: "Операторов", icon: "Building2" },
              { value: "15 000+", label: "Селлеров", icon: "Users" },
              { value: "98%", label: "Успешных сделок", icon: "TrendingUp" },
            ].map((s) => (
              <div key={s.value} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={s.icon as "Users"} size={15} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-xl font-golos font-black text-gold-gradient leading-none">{s.value}</div>
                  <div className="text-white/50 text-xs font-ibm">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

export function Footer({ setActive }: { setActive: (s: string) => void }) {
  return (
    <footer className="bg-navy-gradient text-white py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={14} className="text-navy-950" />
              </div>
              <span className="font-golos font-bold text-white">FulfillHub</span>
            </div>
            <p className="text-white/50 text-xs font-ibm leading-relaxed">B2B маркетплейс фулфилмент-партнёров для селлеров</p>
          </div>
          {[
            { title: "Для селлеров", links: [{ label: "Каталог партнёров", id: "catalog" }, { label: "Контакты", id: "contacts" }] },
            { title: "Для фулфилмента", links: [{ label: "Разместить сервис →", id: "", href: "/for-fulfillment" }] as { label: string; id: string; href?: string }[] },
            { title: "Компания", links: [{ label: "О платформе", id: "hero" }, { label: "Контакты", id: "contacts" }] },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-golos font-bold text-xs mb-2.5 text-white/70 uppercase tracking-wide">{col.title}</div>
              <div className="space-y-1.5">
                {col.links.map((l) => (
                  l.href
                    ? <a key={l.label} href={l.href} className="block text-xs text-gold-400/70 hover:text-gold-300 transition-colors font-ibm">{l.label}</a>
                    : <button key={l.label} onClick={() => setActive(l.id)} className="block text-xs text-white/45 hover:text-white/75 transition-colors font-ibm">{l.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/25 font-ibm">
          <span>© 2026 FulfillHub. Все права защищены.</span>
          <div className="flex gap-4">
            <button className="hover:text-white/50 transition-colors">Политика конфиденциальности</button>
            <button className="hover:text-white/50 transition-colors">Условия использования</button>
          </div>
        </div>
      </div>
    </footer>
  );
}