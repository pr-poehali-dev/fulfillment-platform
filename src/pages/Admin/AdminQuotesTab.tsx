import { useState } from "react";
import Icon from "@/components/ui/icon";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Quote } from "./types";
import { QUOTE_STATUS_CFG } from "./types";

// ─── QUOTE DETAIL MODAL ─────────────────────────────────────────────────────

function QuoteDetailModal({ quote, onClose, onStatusChange }: {
  quote: Quote;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
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
          {/* Contact info */}
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
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 font-ibm">SKU</div>
                <div className="font-golos font-bold text-navy-900">{quote.sku_count.toLocaleString("ru-RU")}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-ibm">Заказов/мес</div>
                <div className="font-golos font-bold text-navy-900">{quote.orders_count.toLocaleString("ru-RU")}</div>
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
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50">
          <select
            value={quote.status}
            onChange={(e) => onStatusChange(quote.id, e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white font-ibm focus:outline-none cursor-pointer"
          >
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="answered">Отправлено КП</option>
            <option value="closed">Закрыта</option>
          </select>
          <a href={`mailto:${quote.sender_email}`}
            className="ml-auto inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-9 px-5 rounded-md transition-colors">
            <Icon name="Send" size={14} />
            Написать
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── QUOTES TAB ─────────────────────────────────────────────────────────────

interface AdminQuotesTabProps {
  quotes: Quote[];
  quotesLoading: boolean;
  onReload: () => void;
}

export default function AdminQuotesTab({ quotes, quotesLoading, onReload }: AdminQuotesTabProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Quote | null>(null);

  const filtered = quotes.filter((q) => filter === "all" || q.status === filter);

  const counts = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === "new").length,
    in_progress: quotes.filter((q) => q.status === "in_progress").length,
    answered: quotes.filter((q) => q.status === "answered").length,
    closed: quotes.filter((q) => q.status === "closed").length,
  };

  const handleStatusChange = async (quoteId: number, status: string) => {
    try {
      await api.updateQuoteStatus(quoteId, status);
      toast.success("Статус обновлён");
      onReload();
      if (selected?.id === quoteId) setSelected({ ...selected, status });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось обновить статус");
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  if (quotesLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Всего заявок", value: counts.all, icon: "Inbox", color: "bg-navy-50 text-navy-700" },
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

      {/* Filters */}
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
          <button onClick={onReload} className="ml-auto text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Заявок пока нет</p>
            <p className="text-xs mt-1">Когда селлеры отправят запрос на КП, заявки появятся здесь</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((q) => {
              const qs = QUOTE_STATUS_CFG[q.status] || QUOTE_STATUS_CFG.new;
              return (
                <div key={q.id} onClick={() => setSelected(q)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs flex-shrink-0">
                    {(q.sender_name || "?")[0].toUpperCase()}{(q.sender_name || "?").split(" ")[1]?.[0]?.toUpperCase() || ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-golos font-bold text-navy-900 text-sm truncate">{q.sender_name}</span>
                      <span className="text-xs text-gray-400 font-ibm">{q.sender_company}</span>
                      {q.status === "new" && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm flex-wrap">
                      {q.sku_count > 0 && <span className="flex items-center gap-0.5"><Icon name="Package" size={10} />{q.sku_count} SKU</span>}
                      {q.sku_count > 0 && q.orders_count > 0 && <span>·</span>}
                      {q.orders_count > 0 && <span className="flex items-center gap-0.5"><Icon name="ShoppingCart" size={10} />{q.orders_count} зак/мес</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${qs.bg} ${qs.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${qs.dot}`} />
                      {qs.label}
                    </span>
                    <span className="text-xs text-gray-400 font-ibm">{formatDate(q.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote detail modal */}
      {selected && (
        <QuoteDetailModal quote={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
