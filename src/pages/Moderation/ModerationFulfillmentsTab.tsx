import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { type FulfillmentItem, STATUS_CFG, FEATURE_LABELS } from "./ModerationTypes";

// ─── INFO FIELD HELPER ──────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <div className="text-xs text-gray-400 font-ibm">{label}</div>
      <div className="text-sm font-semibold text-navy-900 font-ibm">{value || "---"}</div>
    </div>
  );
}

// ─── LEAD PRICE EDITOR ──────────────────────────────────────────────────────

function LeadPriceEditor({ fulfillmentId, initialPrice, onSaved }: {
  fulfillmentId: number;
  initialPrice: number;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initialPrice || 0));
  const [saving, setSaving] = useState(false);

  useEffect(() => { setValue(String(initialPrice || 0)); }, [initialPrice]);

  const save = async () => {
    const price = parseFloat(value) || 0;
    if (price < 0) return;
    setSaving(true);
    try {
      await api.adminSetLeadPrice(fulfillmentId, price);
      toast.success("Цена лида обновлена");
      setEditing(false);
      onSaved();
    } catch (err: unknown) {
      const e = err as { error?: string };
      toast.error(e.error || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-left hover:bg-gray-50 rounded px-1.5 py-0.5 transition-colors group"
        title="Нажмите чтобы изменить"
      >
        <div className="font-golos font-bold text-navy-900 text-sm">{Math.round(initialPrice || 0)} ₽</div>
        <div className="text-[10px] text-gray-400 group-hover:text-navy-500 font-ibm flex items-center gap-0.5">
          <Icon name="Pencil" size={9} /> изменить
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        autoFocus
        className="w-20 px-2 py-1 border border-navy-300 rounded text-xs font-ibm focus:outline-none focus:ring-1 focus:ring-navy-500"
      />
      <button
        onClick={save}
        disabled={saving}
        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
      >
        <Icon name={saving ? "Loader2" : "Check"} size={13} className={saving ? "animate-spin" : ""} />
      </button>
      <button
        onClick={() => { setEditing(false); setValue(String(initialPrice || 0)); }}
        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
      >
        <Icon name="X" size={13} />
      </button>
    </div>
  );
}

// ─── FULFILLMENT DETAIL MODAL ───────────────────────────────────────────────

function FulfillmentDetailModal({ item, onClose, onModerate }: {
  item: FulfillmentItem;
  onClose: () => void;
  onModerate: (id: number, status: string, comment?: string) => void;
}) {
  const [rejectComment, setRejectComment] = useState(item.moderation_comment || "");
  const [showReject, setShowReject] = useState(false);

  const st = STATUS_CFG[item.status] || STATUS_CFG.draft;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
          <div className="w-11 h-11 bg-navy-900 text-white rounded-xl flex items-center justify-center">
            <Icon name="Building2" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-black text-navy-900 truncate">{item.company_name || "Без названия"}</div>
            <div className="text-xs text-gray-400 font-ibm">ID: {item.id} · {formatDate(item.created_at)}</div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 flex-shrink-0 ${st.bg} ${st.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors flex-shrink-0">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Verification status */}
          <div className={`rounded-lg p-3 flex items-center gap-2 text-sm ${
            item.email_verified ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            <Icon name={item.email_verified ? "CheckCircle" : "AlertCircle"} size={16} />
            <span className="font-medium">Email {item.email_verified ? "подтверждён" : "не подтверждён"}</span>
            <span className="text-xs opacity-70 ml-1">({item.user_email || item.contact_email})</span>
          </div>

          {/* Company info */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Компания</div>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Город" value={item.city} />
              <InfoField label="ИНН" value={item.inn} />
              <InfoField label="Площадь склада" value={item.warehouse_area ? `${item.warehouse_area.toLocaleString("ru-RU")} м2` : null} />
              <InfoField label="Год основания" value={item.founded_year?.toString()} />
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Описание</div>
              <p className="text-sm text-gray-700 font-ibm leading-relaxed bg-gray-50 rounded-xl p-3">{item.description}</p>
            </div>
          )}

          {item.detailed_description && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Подробное описание</div>
              <p className="text-sm text-gray-700 font-ibm leading-relaxed bg-gray-50 rounded-xl p-3">{item.detailed_description}</p>
            </div>
          )}

          {/* Contact */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Контакты</div>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Контактное лицо" value={item.contact_name} />
              <InfoField label="Email" value={item.contact_email} />
              <InfoField label="Телефон" value={item.contact_phone} />
              <InfoField label="Telegram" value={item.contact_tg} />
            </div>
          </div>

          {/* Work params */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Параметры работы</div>
            <div className="space-y-2">
              {item.work_schemes?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-ibm w-20 flex-shrink-0">Схемы:</span>
                  {item.work_schemes.map((s) => (
                    <span key={s} className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded font-medium">{s}</span>
                  ))}
                </div>
              )}
              {item.features?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-ibm w-20 flex-shrink-0">Услуги:</span>
                  {item.features.map((f) => (
                    <span key={f} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">
                      {FEATURE_LABELS[f] || f}
                    </span>
                  ))}
                </div>
              )}
              {item.marketplaces?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-ibm w-20 flex-shrink-0">МП:</span>
                  {item.marketplaces.map((mp) => (
                    <span key={mp} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{mp}</span>
                  ))}
                </div>
              )}
              {item.packaging_types?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-ibm w-20 flex-shrink-0">Упаковка:</span>
                  {item.packaging_types.map((p) => (
                    <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{p}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Тарифы</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoField label="Хранение" value={item.storage_price ? `${item.storage_price} руб` : null} />
              <InfoField label="Сборка" value={item.assembly_price ? `${item.assembly_price} руб` : null} />
              <InfoField label="Доставка" value={item.delivery_price ? `${item.delivery_price} руб` : null} />
              <InfoField label="Мин. объём" value={item.min_volume ? `${item.min_volume} зак/мес` : null} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <InfoField label="Пробный период" value={item.has_trial ? "Да" : "Нет"} />
              <InfoField label="Команда" value={item.team_size ? `${item.team_size} чел.` : null} />
              <InfoField label="Часы работы" value={item.working_hours} />
            </div>
          </div>

          {/* Photos */}
          {item.photos?.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Фотографии ({item.photos.length})</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {item.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:opacity-80 transition-opacity">
                    <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Existing moderation comment */}
          {item.moderation_comment && !showReject && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-700 mb-1">Комментарий модерации</div>
              <p className="text-sm text-amber-800 font-ibm">{item.moderation_comment}</p>
            </div>
          )}

          {/* Reject form */}
          {showReject && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <div className="text-sm font-bold text-red-700 font-golos flex items-center gap-2">
                <Icon name="XCircle" size={16} />
                Отклонение заявки
              </div>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={3}
                placeholder="Укажите причину отклонения (необязательно)..."
                className="w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => { onModerate(item.id, "rejected", rejectComment); }}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold font-golos text-sm h-9 px-5"
                >
                  <Icon name="XCircle" size={14} className="mr-1.5" />
                  Отклонить
                </Button>
                <button onClick={() => setShowReject(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm">
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center gap-2 bg-gray-50 flex-shrink-0">
          {item.status !== "approved" && (
            <Button
              onClick={() => onModerate(item.id, "approved")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-golos text-sm h-9 px-5"
            >
              <Icon name="CheckCircle" size={14} className="mr-1.5" />
              Одобрить
            </Button>
          )}
          {item.status !== "rejected" && !showReject && (
            <Button
              variant="outline"
              onClick={() => setShowReject(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 font-bold font-golos text-sm h-9 px-5"
            >
              <Icon name="XCircle" size={14} className="mr-1.5" />
              Отклонить
            </Button>
          )}
          {item.status !== "pending" && (
            <Button
              variant="outline"
              onClick={() => onModerate(item.id, "pending")}
              className="border-amber-200 text-amber-600 hover:bg-amber-50 font-golos text-sm h-9 px-4"
            >
              <Icon name="RotateCcw" size={14} className="mr-1.5" />
              На модерацию
            </Button>
          )}
          <button onClick={onClose} className="ml-auto text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FULFILLMENTS TAB ───────────────────────────────────────────────────────

export default function ModerationFulfillmentsTab() {
  const [items, setItems] = useState<FulfillmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<FulfillmentItem | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.adminList();
      setItems(data.fulfillments || data || []);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить список");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((f) => filter === "all" || f.status === filter);

  const counts = {
    all: items.length,
    pending: items.filter((f) => f.status === "pending").length,
    approved: items.filter((f) => f.status === "approved").length,
    rejected: items.filter((f) => f.status === "rejected").length,
  };

  const handleModerate = async (id: number, status: string, comment?: string) => {
    try {
      await api.adminModerate(id, status, comment);
      toast.success(
        status === "approved" ? "Фулфилмент одобрен" :
        status === "rejected" ? "Фулфилмент отклонён" :
        "Статус обновлён"
      );
      load();
      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось обновить статус");
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
    } catch { return d; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Всего заявок", value: counts.all, icon: "Building2", color: "bg-navy-50 text-navy-700" },
          { label: "На модерации", value: counts.pending, icon: "Clock", color: "bg-amber-50 text-amber-600" },
          { label: "Одобрено", value: counts.approved, icon: "CheckCircle", color: "bg-emerald-50 text-emerald-600" },
          { label: "Отклонено", value: counts.rejected, icon: "XCircle", color: "bg-red-50 text-red-600" },
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
            { key: "pending", label: "На модерации", count: counts.pending },
            { key: "approved", label: "Одобрено", count: counts.approved },
            { key: "rejected", label: "Отклонено", count: counts.rejected },
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

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Building2" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Заявок не найдено</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Компания</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Город</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Контакт</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Дата</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Статус</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Цена лида</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Лиды</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => {
                    const st = STATUS_CFG[item.status] || STATUS_CFG.draft;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <button onClick={() => setSelected(item)} className="text-left hover:text-navy-700 transition-colors">
                            <div className="font-golos font-bold text-navy-900">{item.company_name || "Без названия"}</div>
                            {item.inn && <div className="text-xs text-gray-400 font-ibm">ИНН: {item.inn}</div>}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-ibm">{item.city || "---"}</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-700 font-ibm text-xs">{item.contact_email || item.user_email || "---"}</div>
                          <div className="text-gray-400 font-ibm text-xs">{item.contact_phone || "---"}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-ibm whitespace-nowrap">{formatDate(item.created_at)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <LeadPriceEditor
                            fulfillmentId={item.id}
                            initialPrice={Number(item.lead_price || 0)}
                            onSaved={load}
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 font-ibm whitespace-nowrap">
                          <div className="font-bold text-navy-900">{item.total_leads || 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {item.status !== "approved" && (
                              <button
                                onClick={() => handleModerate(item.id, "approved")}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Одобрить"
                              >
                                <Icon name="Check" size={14} />
                              </button>
                            )}
                            {item.status !== "rejected" && (
                              <button
                                onClick={() => setSelected(item)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Отклонить / подробности"
                              >
                                <Icon name="X" size={14} />
                              </button>
                            )}
                            {item.status !== "pending" && (
                              <button
                                onClick={() => handleModerate(item.id, "pending")}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors" title="Вернуть на модерацию"
                              >
                                <Icon name="RotateCcw" size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => setSelected(item)}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-navy-700 transition-colors" title="Подробнее"
                            >
                              <Icon name="Eye" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((item) => {
                const st = STATUS_CFG[item.status] || STATUS_CFG.draft;
                return (
                  <div key={item.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => setSelected(item)} className="text-left">
                        <div className="font-golos font-bold text-navy-900">{item.company_name || "Без названия"}</div>
                        <div className="text-xs text-gray-400 font-ibm">{item.city || "---"} {item.inn ? `· ИНН: ${item.inn}` : ""}</div>
                      </button>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-ibm">
                      {item.contact_email || item.user_email} · {item.contact_phone || "---"}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      {item.status !== "approved" && (
                        <Button size="sm" onClick={() => handleModerate(item.id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-3">
                          <Icon name="Check" size={12} className="mr-1" /> Одобрить
                        </Button>
                      )}
                      {item.status !== "rejected" && (
                        <Button size="sm" variant="outline" onClick={() => setSelected(item)}
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-8 px-3">
                          <Icon name="X" size={12} className="mr-1" /> Отклонить
                        </Button>
                      )}
                      {item.status !== "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleModerate(item.id, "pending")}
                          className="border-amber-200 text-amber-600 hover:bg-amber-50 text-xs h-8 px-3">
                          <Icon name="RotateCcw" size={12} className="mr-1" /> Pending
                        </Button>
                      )}
                      <button onClick={() => setSelected(item)}
                        className="ml-auto text-xs text-gray-400 hover:text-navy-700 transition-colors underline">
                        Подробнее
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <FulfillmentDetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onModerate={handleModerate}
        />
      )}
    </div>
  );
}
