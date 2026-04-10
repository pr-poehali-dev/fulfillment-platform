import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "sonner";
import SupportSection from "@/components/SupportSection";

interface SellerQuote {
  id: number;
  fulfillment_id: number;
  fulfillment_name: string;
  status: string;
  seller_status: "new" | "viewed" | "answered";
  viewed_by_fulfillment: boolean;
  sku_count: number;
  orders_count: number;
  message: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  sender_company: string;
}

const SELLER_STATUS_CFG = {
  new:      { label: "Новая",                           bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"    },
  viewed:   { label: "Просмотрено",                     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  answered: { label: "Отправлено коммерческое предложение", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

type SellerTab = "quotes" | "support";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-ibm placeholder:text-gray-400 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!currentPw || !newPw) { setError("Заполните все поля"); return; }
    if (newPw.length < 6) { setError("Новый пароль — минимум 6 символов"); return; }
    setSubmitting(true);
    try {
      await api.changePassword(currentPw, newPw);
      setDone(true);
      toast.success("Пароль успешно изменён");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Ошибка при смене пароля");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="Lock" size={16} className="text-gold-400" />
          </div>
          <div className="flex-1">
            <div className="font-golos font-black text-navy-950 text-sm">Смена пароля</div>
            <div className="text-[11px] text-gray-400 font-ibm mt-0.5">Введите текущий и новый пароль</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
            <Icon name="X" size={14} />
          </button>
        </div>
        <div className="p-5">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Icon name="CheckCircle" size={28} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-600 font-ibm">Пароль изменён. Письмо с подтверждением отправлено на вашу почту.</p>
              <button onClick={onClose} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 text-sm transition-colors">
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">Текущий пароль</label>
                <div className="relative">
                  <input value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                    type={showCurrent ? "text" : "password"} placeholder="Введите текущий пароль"
                    className={`${inputCls} pr-10`} autoFocus />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Icon name={showCurrent ? "EyeOff" : "Eye"} size={15} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">Новый пароль</label>
                <div className="relative">
                  <input value={newPw} onChange={(e) => setNewPw(e.target.value)}
                    type={showNew ? "text" : "password"} placeholder="Минимум 6 символов"
                    className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Icon name={showNew ? "EyeOff" : "Eye"} size={15} />
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-500 text-xs font-ibm">{error}</p>
                </div>
              )}
              <button type="submit" disabled={submitting}
                className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white font-bold font-golos rounded-xl h-10 text-sm transition-colors flex items-center justify-center gap-2">
                {submitting ? <><Icon name="Loader2" size={14} className="animate-spin" />Сохранение...</> : "Сохранить пароль"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Seller() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [tab, setTab] = useState<SellerTab>("quotes");
  const [quotes, setQuotes] = useState<SellerQuote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  const loadQuotes = useCallback(async () => {
    try {
      setQuotesLoading(true);
      const data = await api.sellerQuotes();
      setQuotes(data.quotes || []);
    } catch {
      setQuotes([]);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadQuotes();
  }, [user, loadQuotes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="text-gold-400 animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch { return d; }
  };

  const newCount = quotes.filter((q) => q.seller_status === "new").length;

  return (
    <div className="min-h-screen bg-gray-50 font-golos flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-950 text-white transition-transform duration-200 flex flex-col`}>
        <div className="h-14 px-4 flex items-center gap-2 border-b border-white/10 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <div>
              <div className="font-golos font-bold text-sm leading-none group-hover:text-gold-400 transition-colors">FulfillHub</div>
              <div className="text-xs text-white/40 mt-0.5">Кабинет селлера</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center">
              <Icon name="User" size={18} className="text-navy-300" />
            </div>
            <div className="min-w-0">
              <div className="font-golos font-bold text-sm truncate">{user.email.split("@")[0]}</div>
              <div className="text-xs text-white/40 font-ibm truncate">{user.email}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {([
            { id: "quotes" as SellerTab, label: "Мои заявки", icon: "Inbox", badge: newCount > 0 ? newCount : 0 },
            { id: "support" as SellerTab, label: "Техподдержка", icon: "LifeBuoy", badge: 0 },
          ]).map((item) => (
            <button key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === item.id ? "bg-gold-500/15 text-gold-400" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              <Icon name={item.icon} size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={() => { setChangePwOpen(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            <Icon name="Lock" size={14} />Сменить пароль
          </button>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            <Icon name="ArrowLeft" size={14} />На главную
          </Link>
          <button onClick={() => { logout(); navigate("/auth"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Icon name="LogOut" size={14} />Выйти
          </button>
        </div>
      </aside>

      {changePwOpen && <ChangePasswordModal onClose={() => setChangePwOpen(false)} />}

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-gray-500">
            <Icon name="Menu" size={20} />
          </button>
          <div>
            <div className="font-golos font-bold text-navy-900 text-sm">
              {tab === "quotes" && "Мои заявки на КП"}
              {tab === "support" && "Техническая поддержка"}
            </div>
            <div className="text-xs text-gray-400 font-ibm">
              {tab === "quotes" && "Статусы запросов коммерческих предложений"}
              {tab === "support" && "Мы всегда готовы помочь"}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-ibm hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs">
              {(user.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* ── QUOTES ── */}
          {tab === "quotes" && (
            <div className="max-w-3xl space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Всего заявок", value: quotes.length, icon: "Inbox", color: "text-navy-700 bg-navy-50" },
                  { label: "Новые", value: quotes.filter((q) => q.seller_status === "new").length, icon: "Sparkles", color: "text-blue-600 bg-blue-50" },
                  { label: "Получено КП", value: quotes.filter((q) => q.seller_status === "answered").length, icon: "CheckCircle", color: "text-emerald-600 bg-emerald-50" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                      <Icon name={s.icon} size={15} />
                    </div>
                    <div className="font-golos font-black text-2xl text-navy-900">{s.value}</div>
                    <div className="text-xs text-gray-400 font-ibm">{s.label}</div>
                  </div>
                ))}
              </div>

              {quotesLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
                </div>
              ) : quotes.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Inbox" size={28} className="text-gray-400" />
                  </div>
                  <h3 className="font-golos font-bold text-navy-900 mb-1">Заявок пока нет</h3>
                  <p className="text-sm text-gray-400 font-ibm mb-4">Отправьте запрос КП фулфилменту в каталоге</p>
                  <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900 font-golos transition-colors">
                    <Icon name="Search" size={14} />Перейти в каталог
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {quotes.map((q) => {
                      const st = SELLER_STATUS_CFG[q.seller_status] || SELLER_STATUS_CFG.new;
                      return (
                        <div key={q.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Warehouse" size={18} className="text-navy-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-golos font-black text-navy-900 text-sm">{q.fulfillment_name}</span>
                              <code className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                FL-{String(q.fulfillment_id).padStart(6, "0")}
                              </code>
                              {q.seller_status === "new" && (
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-ibm flex-wrap">
                              {q.sku_count > 0 && <span>{q.sku_count} SKU</span>}
                              {q.sku_count > 0 && q.orders_count > 0 && <span>·</span>}
                              {q.orders_count > 0 && <span>{q.orders_count} зак/мес</span>}
                              {q.message && <span className="truncate max-w-xs italic">"{q.message}"</span>}
                            </div>
                            <div className="text-xs text-gray-300 font-ibm mt-1">{formatDate(q.created_at)}</div>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${st.bg} ${st.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={loadQuotes} className="text-xs text-gray-400 hover:text-navy-700 font-ibm flex items-center gap-1.5 transition-colors">
                  <Icon name="RefreshCw" size={12} />Обновить
                </button>
              </div>
            </div>
          )}

          {/* ── SUPPORT ── */}
          {tab === "support" && (
            <div className="max-w-2xl">
              <SupportSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}