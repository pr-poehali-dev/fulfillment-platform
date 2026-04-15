import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import api from "@/lib/api";
import { toast } from "sonner";
import { type AdminQuote, type QuoteStats, QUOTE_STATUS_CFG } from "./ModerationTypes";

// ─── ADMIN QUOTE DETAIL MODAL ───────────────────────────────────────────────

function AdminQuoteModal({ quote, onClose }: {
  quote: AdminQuote;
  onClose: () => void;
}) {
  const qs = QUOTE_STATUS_CFG[quote.status] || QUOTE_STATUS_CFG.new;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-11 h-11 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold">
            {(quote.sender_name || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-black text-navy-900">{quote.sender_name}</div>
            <div className="text-xs text-gray-400 font-ibm">{quote.sender_company} · {formatDate(quote.created_at)}</div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${qs.bg} ${qs.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${qs.dot}`} />
            {qs.label}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Fulfillment target */}
          <div className="bg-navy-50 border border-navy-100 rounded-lg p-3 flex items-center gap-2">
            <Icon name="Building2" size={14} className="text-navy-700" />
            <span className="text-xs text-navy-500 font-ibm">Фулфилмент:</span>
            <span className="text-sm font-bold text-navy-900 font-golos">{quote.fulfillment_name || `ID: ${quote.fulfillment_id}`}</span>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Icon name="Mail" size={15} className="text-navy-700" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">Email</div>
                <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{quote.sender_email}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Icon name="Phone" size={15} className="text-navy-700" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">Телефон</div>
                <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{quote.sender_phone}</div>
              </div>
            </div>
          </div>

          {/* Params */}
          {(quote.sku_count > 0 || quote.orders_count > 0) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-ibm">SKU</div>
                <div className="font-golos font-bold text-navy-900 text-lg">{quote.sku_count.toLocaleString("ru-RU")}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-ibm">Заказов/мес</div>
                <div className="font-golos font-bold text-navy-900 text-lg">{quote.orders_count.toLocaleString("ru-RU")}</div>
              </div>
            </div>
          )}

          {/* Message */}
          {quote.message && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Сообщение</div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 font-ibm leading-relaxed">
                {quote.message}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QUOTES TAB ─────────────────────────────────────────────────────────────

export default function ModerationQuotesTab() {
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [stats, setStats] = useState<QuoteStats>({ total_leads: 0, total_revenue: 0, unpaid_revenue: 0, paid_revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<AdminQuote | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.adminAllQuotes();
      setQuotes(data.quotes || []);
      if (data.stats) setStats(data.stats);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить запросы");
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markPaid = async (quoteId: number) => {
    try {
      await api.adminMarkPaid(quoteId);
      toast.success("Лид отмечен оплаченным");
      load();
    } catch (err: unknown) {
      const e = err as { error?: string };
      toast.error(e.error || "Не удалось обновить");
    }
  };

  useEffect(() => { load(); }, [load]);

  const filtered = quotes.filter((q) => filter === "all" || q.status === filter);

  const counts = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === "new").length,
    in_progress: quotes.filter((q) => q.status === "in_progress").length,
    answered: quotes.filter((q) => q.status === "answered").length,
    closed: quotes.filter((q) => q.status === "closed").length,
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  const fmt = (n: number) => Math.round(n || 0).toLocaleString("ru-RU");

  return (
    <div>
      {/* Revenue Stats — Monetization */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-gradient-to-br from-gold-500 to-amber-600 rounded-xl p-4 shadow-md text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
            <Icon name="TrendingUp" size={15} />
          </div>
          <div className="font-golos font-black text-2xl">{fmt(stats.total_revenue)} ₽</div>
          <div className="text-xs text-white/80 font-ibm">Общий доход</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-4 shadow-md text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
            <Icon name="CheckCircle" size={15} />
          </div>
          <div className="font-golos font-black text-2xl">{fmt(stats.paid_revenue)} ₽</div>
          <div className="text-xs text-white/80 font-ibm">Оплачено</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 shadow-md text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
            <Icon name="Clock" size={15} />
          </div>
          <div className="font-golos font-black text-2xl">{fmt(stats.unpaid_revenue)} ₽</div>
          <div className="text-xs text-white/80 font-ibm">К оплате</div>
        </div>
        <div className="bg-gradient-to-br from-navy-800 to-navy-950 rounded-xl p-4 shadow-md text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
            <Icon name="Users" size={15} />
          </div>
          <div className="font-golos font-black text-2xl">{stats.total_leads}</div>
          <div className="text-xs text-white/70 font-ibm">Лидов отправлено</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Всего запросов", value: counts.all, icon: "MessageSquare", color: "bg-navy-50 text-navy-700" },
          { label: "Новые", value: counts.new, icon: "Sparkles", color: "bg-blue-50 text-blue-600" },
          { label: "В работе", value: counts.in_progress, icon: "Clock", color: "bg-amber-50 text-amber-600" },
          { label: "Отвечено", value: counts.answered, icon: "CheckCircle", color: "bg-emerald-50 text-emerald-600" },
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

      {/* Filters + table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Все", count: counts.all },
            { key: "new", label: "Новые", count: counts.new },
            { key: "in_progress", label: "В работе", count: counts.in_progress },
            { key: "answered", label: "Отвечено", count: counts.answered },
            { key: "closed", label: "Закрыты", count: counts.closed },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all font-golos ${
                filter === f.key ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? "text-white/70" : "text-gray-400"}`}>{f.count}</span>
            </button>
          ))}
          <button onClick={load} className="ml-auto text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100" title="Обновить">
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Запросов КП не найдено</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Отправитель</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Контакт</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Фулфилмент</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Дата</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Цена лида</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Оплата</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((q) => {
                    const isPaid = q.payment_status === "paid";
                    return (
                      <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 cursor-pointer" onClick={() => setSelected(q)}>
                          <div className="font-golos font-bold text-navy-900">{q.sender_name}</div>
                          <div className="text-xs text-gray-400 font-ibm">{q.sender_company}</div>
                        </td>
                        <td className="px-4 py-3 cursor-pointer" onClick={() => setSelected(q)}>
                          <div className="text-gray-700 font-ibm text-xs">{q.sender_email}</div>
                          <div className="text-gray-400 font-ibm text-xs">{q.sender_phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium text-navy-700 bg-navy-50 px-2 py-0.5 rounded font-ibm">
                            {q.fulfillment_name || `ID: ${q.fulfillment_id}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-ibm whitespace-nowrap">{formatDate(q.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="font-golos font-bold text-navy-900 text-sm">{fmt(q.lead_price || 0)} ₽</div>
                        </td>
                        <td className="px-4 py-3">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700">
                              <Icon name="CheckCircle" size={11} />
                              Оплачено
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700">
                              <Icon name="Clock" size={11} />
                              К оплате
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!isPaid && (
                            <button
                              onClick={() => markPaid(q.id)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-ibm font-semibold transition-colors"
                              title="Отметить оплаченным"
                            >
                              <Icon name="DollarSign" size={11} className="inline mr-0.5" />
                              Оплачено
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((q) => {
                const qs = QUOTE_STATUS_CFG[q.status] || QUOTE_STATUS_CFG.new;
                return (
                  <div key={q.id} onClick={() => setSelected(q)} className="p-4 space-y-1.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-golos font-bold text-navy-900 text-sm">{q.sender_name}</div>
                        <div className="text-xs text-gray-400 font-ibm">{q.sender_company}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${qs.bg} ${qs.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${qs.dot}`} />
                        {qs.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-ibm flex items-center gap-2 flex-wrap">
                      <span>{q.sender_email}</span>
                      <span>·</span>
                      <span className="text-navy-700 font-medium">{q.fulfillment_name || `FF #${q.fulfillment_id}`}</span>
                      <span>·</span>
                      <span>{formatDate(q.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Quote detail modal */}
      {selected && (
        <AdminQuoteModal quote={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
