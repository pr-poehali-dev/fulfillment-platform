import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Fulfillment } from "./types";
import {
  STATUS_CFG,
  WORK_SCHEME_OPTIONS,
  FEATURE_OPTIONS,
  SPECIALIZATION_OPTIONS,
  MARKETPLACE_OPTIONS,
} from "./types";

type EditTab = "info" | "services" | "pricing" | "photos" | "preview";

// ─── Предпросмотр карточки каталога ──────────────────────────────────────────

const FEATURE_COLORS: Record<string, string> = {
  cameras: "text-blue-500", dangerous: "text-red-500", returns: "text-emerald-500",
  same_day: "text-amber-500", temp_control: "text-cyan-500", packaging: "text-purple-500",
  honest_mark: "text-indigo-500", defect_check: "text-green-600", seller_packaging: "text-violet-500",
  shipment_prep: "text-orange-500", barcode_check: "text-teal-500", cargo_receive: "text-sky-500",
};
const SPEC_COLORS: Record<string, string> = {
  small_goods: "text-slate-500", cosmetics: "text-pink-500", clothing: "text-rose-500",
  fuel_lubricants: "text-yellow-600", construction: "text-stone-500", appliances: "text-blue-600", electronics: "text-indigo-600",
};

function FulfillmentCardPreview({ form }: { form: Fulfillment }) {
  const withRuble = (s: string) => (s && s !== "по запросу" && !s.includes("₽") ? `${s} ₽` : s || "по запросу");

  const featureLabels: Record<string, string> = {
    cameras: "Видеонаблюдение", dangerous: "Опасные грузы", returns: "Возвраты",
    same_day: "День в день", temp_control: "Темп. контроль", packaging: "Упаковка",
    honest_mark: "Честный Знак", defect_check: "Проверка брака", seller_packaging: "Пакет продавца",
    shipment_prep: "Подготовка к отгрузке", barcode_check: "Штрихкод", cargo_receive: "Карго",
  };
  const featureIcons: Record<string, string> = {
    cameras: "Camera", dangerous: "AlertTriangle", returns: "RefreshCw",
    same_day: "Zap", temp_control: "Thermometer", packaging: "Package",
    honest_mark: "Tag", defect_check: "ShieldCheck", seller_packaging: "ShoppingBag",
    shipment_prep: "PackageCheck", barcode_check: "ScanLine", cargo_receive: "Ship",
  };
  const specLabels: Record<string, string> = {
    small_goods: "Мелкие товары", cosmetics: "Косметика", clothing: "Одежда/Обувь",
    fuel_lubricants: "ГСМ", construction: "Стройматериалы", appliances: "Бытовая техника", electronics: "Электроника",
  };
  const specIcons: Record<string, string> = {
    small_goods: "Boxes", cosmetics: "Sparkles", clothing: "Shirt",
    fuel_lubricants: "Fuel", construction: "Hammer", appliances: "Tv", electronics: "Cpu",
  };

  const hasPhoto = form.photos.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden ring-2 ring-navy-900/5">
      {/* Photo header */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        {hasPhoto ? (
          <img src={form.photos[0]} alt={form.company_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy-50 to-gray-100">
            <Icon name="Image" size={28} className="text-gray-300" />
            <span className="text-xs text-gray-300 font-ibm">Нет фото</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-white/95 backdrop-blur rounded-lg flex items-center justify-center shadow-sm">
            <Icon name="Warehouse" size={14} className="text-navy-700" />
          </div>
          <div>
            <div className="font-golos font-black text-white text-sm leading-tight drop-shadow">
              {form.company_name || <span className="opacity-50">Название компании</span>}
            </div>
            <div className="text-[10px] text-white/90 font-ibm flex items-center gap-0.5 drop-shadow">
              <Icon name="MapPin" size={9} />{form.city || "Город"}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5">
        <p className="text-xs text-gray-500 font-ibm leading-relaxed line-clamp-3">
          {form.description || <span className="italic text-gray-300">Краткое описание не добавлено</span>}
        </p>

        {/* Work schemes */}
        {(form.work_schemes.length > 0 || form.marketplaces.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {form.work_schemes.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 bg-navy-900 text-white rounded font-ibm font-medium">{s}</span>
            ))}
            {form.marketplaces.slice(0, 2).map((m) => (
              <span key={m} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{m}</span>
            ))}
            {form.marketplaces.length > 2 && (
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-ibm">+{form.marketplaces.length - 2}</span>
            )}
          </div>
        )}

        {/* Features */}
        {form.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {form.features.slice(0, 6).map((fKey) => (
              <span key={fKey} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                <Icon name={(featureIcons[fKey] || "Check") as "Check"} size={10} className={FEATURE_COLORS[fKey] || "text-gray-400"} />
                {featureLabels[fKey] || fKey}
              </span>
            ))}
            {form.features.length > 6 && (
              <span className="text-[10px] font-ibm text-gray-400 px-1.5 py-0.5">+{form.features.length - 6}</span>
            )}
          </div>
        )}

        {/* Specializations */}
        {form.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {form.specializations.map((sKey) => (
              <span key={sKey} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                <Icon name={(specIcons[sKey] || "Tag") as "Tag"} size={10} className={SPEC_COLORS[sKey] || "text-gray-400"} />
                {specLabels[sKey] || sKey}
              </span>
            ))}
          </div>
        )}

        {/* Rates */}
        <div className="grid grid-cols-3 gap-1 bg-gray-50 rounded-lg p-2">
          <div className="text-center">
            <div className="text-xs text-gray-400 font-ibm">Хранение</div>
            <div className="text-xs font-semibold text-navy-900">{withRuble(form.storage_price?.toString())}</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-xs text-gray-400 font-ibm">Сборка</div>
            <div className="text-xs font-semibold text-navy-900">{withRuble(form.assembly_price?.toString())}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 font-ibm">Доставка</div>
            <div className="text-xs font-semibold text-navy-900">{withRuble(form.delivery_price?.toString())}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button className="border border-gray-200 text-gray-700 rounded-lg text-xs h-9 font-ibm">Подробнее</button>
          <button className="bg-gold-500 text-navy-950 rounded-lg text-xs h-9 font-bold font-golos">Запросить КП</button>
        </div>
      </div>
    </div>
  );
}

interface CheckItem {
  label: string;
  done: boolean;
  tab: EditTab;
  hint?: string;
}

function useReadinessCheck(form: Fulfillment): { items: CheckItem[]; score: number; ready: boolean } {
  const items: CheckItem[] = [
    { label: "Название компании", done: !!form.company_name?.trim(), tab: "info" },
    { label: "Город", done: !!form.city?.trim(), tab: "info" },
    { label: "Краткое описание", done: form.description?.trim().length >= 30, tab: "info", hint: "Минимум 30 символов" },
    { label: "Схема работы (FBS/FBO/…)", done: form.work_schemes?.length > 0, tab: "services" },
    { label: "Маркетплейсы", done: form.marketplaces?.length > 0, tab: "services" },
    { label: "Хотя бы одна особенность", done: form.features?.length > 0, tab: "services" },
    { label: "Стоимость хранения", done: !!form.storage_price?.toString().trim(), tab: "pricing" },
    { label: "Стоимость сборки", done: !!form.assembly_price?.toString().trim(), tab: "pricing" },
    { label: "Фотографии (хотя бы 1)", done: form.photos?.length > 0, tab: "photos", hint: "Фото склада или производства" },
  ];
  const score = items.filter((i) => i.done).length;
  return { items, score, ready: score === items.length };
}

interface AdminFulfillmentEditProps {
  fulfillment: Fulfillment;
  onBack: () => void;
  onSaved: (f: Fulfillment) => void;
}

export default function AdminFulfillmentEdit({ fulfillment, onBack, onSaved }: AdminFulfillmentEditProps) {
  const [editTab, setEditTab] = useState<EditTab>("info");
  const [form, setForm] = useState<Fulfillment>({ ...fulfillment });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef(form);
  const isDirtyRef = useRef(false);

  // Отслеживаем изменения формы
  useEffect(() => {
    formRef.current = form;
    isDirtyRef.current = true;
  }, [form]);

  const st = STATUS_CFG[form.status] || STATUS_CFG.draft;
  const readiness = useReadinessCheck(form);
  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  const buildPayload = (f: Fulfillment) => ({
    id: f.id,
    company_name: f.company_name,
    city: f.city,
    warehouse_area: f.warehouse_area ? Number(f.warehouse_area) : null,
    founded_year: f.founded_year ? Number(f.founded_year) : null,
    description: f.description,
    detailed_description: f.detailed_description,
    work_schemes: f.work_schemes,
    features: f.features,
    packaging_types: f.packaging_types,
    marketplaces: f.marketplaces,
    specializations: f.specializations,
    storage_price: f.storage_price ? Number(f.storage_price) : null,
    assembly_price: f.assembly_price ? Number(f.assembly_price) : null,
    delivery_price: f.delivery_price ? Number(f.delivery_price) : null,
    min_volume: f.min_volume ? Number(f.min_volume) : null,
    has_trial: f.has_trial,
    team_size: f.team_size ? Number(f.team_size) : null,
    working_hours: f.working_hours,
    photos: f.photos,
  });

  const autoSave = useCallback(async () => {
    // Только черновики, только если были изменения
    if (!isDirtyRef.current) return;
    if (formRef.current.status !== "draft" && formRef.current.status !== "rejected") return;
    isDirtyRef.current = false;
    setAutoSaveStatus("saving");
    try {
      await api.updateFulfillment(buildPayload(formRef.current));
      setAutoSaveStatus("saved");
      setLastSavedAt(new Date());
      onSaved({ ...formRef.current });
    } catch {
      setAutoSaveStatus("error");
      isDirtyRef.current = true; // вернём флаг чтобы повторить при следующем тике
    }
  }, [onSaved]);

  // Таймер автосохранения каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(autoSave, 30_000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const set = (key: keyof Fulfillment, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArr = (key: keyof Fulfillment, val: string) => {
    const arr = (form[key] as string[]) || [];
    set(key, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSave = async () => {
    setSaving(true);
    isDirtyRef.current = false;
    try {
      await api.updateFulfillment(buildPayload(form));
      toast.success("Изменения сохранены");
      setAutoSaveStatus("saved");
      setLastSavedAt(new Date());
      onSaved({ ...form });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось сохранить");
      isDirtyRef.current = true;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitFulfillment(form.id);
      toast.success("Отправлено на модерацию. Ответ в течение 24 часов.");
      onSaved({ ...form, status: "pending" });
      setForm((f) => ({ ...f, status: "pending" }));
    } catch (err: unknown) {
      const e = err as { error?: string; message?: string };
      toast.error(e.error || e.message || "Не удалось отправить на модерацию");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!confirm("Закрыть фулфилмент? Он будет скрыт из каталога.")) return;
    setClosing(true);
    try {
      await api.closeFulfillment(form.id);
      toast.success("Фулфилмент закрыт");
      onSaved({ ...form, status: "closed" });
      setForm((f) => ({ ...f, status: "closed" }));
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Не удалось закрыть");
    } finally {
      setClosing(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.photos.length >= 10) { toast.error("Максимум 10 фотографий"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Загружайте только изображения"); return; }
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(",")[1];
      const result = await api.uploadPhoto(base64, file.type);
      const url = result.url || result.photo_url;
      if (url) { set("photos", [...form.photos, url]); toast.success("Фото загружено"); }
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const EDIT_TABS: { id: EditTab; label: string; icon: string }[] = [
    { id: "info", label: "Основное", icon: "Building2" },
    { id: "services", label: "Услуги", icon: "Layers" },
    { id: "pricing", label: "Тарифы", icon: "DollarSign" },
    { id: "photos", label: "Фото", icon: "Camera" },
    { id: "preview", label: "Предпросмотр", icon: "Eye" },
  ];

  const tabMissingCount = (tabId: EditTab) =>
    readiness.items.filter((i) => i.tab === tabId && !i.done).length;

  return (
    <div className="max-w-4xl space-y-5">
      {/* Topbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 font-golos transition-colors">
          <Icon name="ArrowLeft" size={16} />
          Назад к списку
        </button>
        <div className="flex-1" />
        {/* Индикатор автосохранения */}
        {(form.status === "draft" || form.status === "rejected") && autoSaveStatus !== "idle" && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-ibm ${
            autoSaveStatus === "saving" ? "text-gray-400" :
            autoSaveStatus === "saved" ? "text-emerald-600" :
            "text-red-500"
          }`}>
            {autoSaveStatus === "saving" && <Icon name="Loader2" size={12} className="animate-spin" />}
            {autoSaveStatus === "saved" && <Icon name="Check" size={12} />}
            {autoSaveStatus === "error" && <Icon name="AlertCircle" size={12} />}
            {autoSaveStatus === "saving" && "Сохранение..."}
            {autoSaveStatus === "saved" && lastSavedAt && `Сохранено в ${lastSavedAt.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}`}
            {autoSaveStatus === "error" && "Не сохранено"}
          </span>
        )}
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
        <code className="text-xs font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
          FL-{String(form.id).padStart(6, "0")}
        </code>
      </div>

      {/* Status banner */}
      {(form.status === "rejected" || form.status === "pending" || form.status === "approved") && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${st.bg} ${st.border}`}>
          <Icon
            name={form.status === "approved" ? "CheckCircle" : form.status === "rejected" ? "XCircle" : "Clock"}
            size={16} className={`${st.text} mt-0.5 flex-shrink-0`}
          />
          <div className="flex-1">
            <p className={`text-sm font-semibold font-golos ${st.text}`}>{st.label}</p>
            <p className="text-xs text-gray-600 font-ibm mt-0.5">
              {form.status === "approved" && "Ваш фулфилмент опубликован в каталоге и виден клиентам."}
              {form.status === "rejected" && "Фулфилмент отклонён модератором. Внесите правки и отправьте повторно."}
              {form.status === "pending" && "Фулфилмент на проверке. Обычно до 24 часов."}
            </p>
            {form.status === "rejected" && form.moderation_comment && (
              <p className="text-xs text-red-700 font-ibm mt-1 font-semibold">Комментарий: {form.moderation_comment}</p>
            )}
          </div>
        </div>
      )}

      {/* Edit tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 flex overflow-x-auto">
          {EDIT_TABS.map((t) => {
            const missing = tabMissingCount(t.id);
            return (
              <button key={t.id} onClick={() => setEditTab(t.id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold font-golos whitespace-nowrap transition-all border-b-2 ${
                  editTab === t.id
                    ? "border-navy-900 text-navy-900"
                    : "border-transparent text-gray-400 hover:text-navy-700"
                }`}>
                <Icon name={t.icon as "Building2"} size={14} />
                {t.label}
                {missing > 0 && form.status !== "pending" && form.status !== "approved" && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {missing}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {/* ── INFO ── */}
          {editTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Название компании *</label>
                  <input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} className={inputCls} placeholder="ООО Логистик" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Город</label>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="Москва" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Год основания</label>
                  <input value={form.founded_year} onChange={(e) => set("founded_year", e.target.value)} type="number" className={inputCls} placeholder="2018" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Площадь склада (м²)</label>
                  <input value={form.warehouse_area} onChange={(e) => set("warehouse_area", e.target.value)} type="number" className={inputCls} placeholder="5000" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Размер команды (чел.)</label>
                  <input value={form.team_size} onChange={(e) => set("team_size", e.target.value)} type="number" className={inputCls} placeholder="50" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Часы работы</label>
                  <input value={form.working_hours} onChange={(e) => set("working_hours", e.target.value)} className={inputCls} placeholder="Пн-Пт 09:00-18:00" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Краткое описание</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Коротко о вашей компании (для карточки в каталоге)" />
                <div className="text-xs text-gray-400 font-ibm mt-1">{form.description.length} / 500</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Подробное описание</label>
                <textarea value={form.detailed_description} onChange={(e) => set("detailed_description", e.target.value)} rows={5} className={`${inputCls} resize-none`} placeholder="Подробное описание для страницы фулфилмента" />
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {editTab === "services" && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Схемы работы</label>
                <div className="flex flex-wrap gap-2">
                  {WORK_SCHEME_OPTIONS.map((s) => (
                    <button key={s} onClick={() => toggleArr("work_schemes", s)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all font-golos ${
                        form.work_schemes.includes(s) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Особенности и услуги</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FEATURE_OPTIONS.map((f) => (
                    <button key={f.key} onClick={() => toggleArr("features", f.key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                        form.features.includes(f.key) ? "bg-navy-50 border-navy-300 text-navy-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      <Icon name={f.icon} size={14} className={form.features.includes(f.key) ? "text-navy-700" : "text-gray-400"} />
                      <span className="font-medium font-golos text-xs">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Специализация (типы товаров)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATION_OPTIONS.map((s) => (
                    <button key={s.key} onClick={() => toggleArr("specializations", s.key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                        form.specializations.includes(s.key) ? "bg-gold-50 border-gold-300 text-navy-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      <Icon name={s.icon} size={14} className={form.specializations.includes(s.key) ? "text-gold-600" : "text-gray-400"} />
                      <span className="font-medium font-golos text-xs">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Виды упаковки (через запятую)</label>
                <input
                  value={form.packaging_types.join(", ")}
                  onChange={(e) => set("packaging_types", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  className={inputCls}
                  placeholder="Короб, Полиэтилен, Пузырчатая плёнка"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Маркетплейсы</label>
                <div className="flex flex-wrap gap-2">
                  {MARKETPLACE_OPTIONS.map((mp) => (
                    <button key={mp} onClick={() => toggleArr("marketplaces", mp)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        form.marketplaces.includes(mp) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
                      }`}>
                      {mp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PRICING ── */}
          {editTab === "pricing" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: "storage_price" as const, label: "Хранение, ₽/пал/день", placeholder: "25" },
                  { key: "assembly_price" as const, label: "Сборка, ₽/заказ", placeholder: "60" },
                  { key: "delivery_price" as const, label: "Доставка, ₽/заказ", placeholder: "0" },
                  { key: "min_volume" as const, label: "Мин. объём, заказов/мес", placeholder: "100" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">{label}</label>
                    <input value={form[key] as string} onChange={(e) => set(key, e.target.value)} type="number" className={inputCls} placeholder={placeholder} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => set("has_trial", !form.has_trial)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.has_trial ? "bg-navy-900" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.has_trial ? "translate-x-5" : ""}`} />
                </button>
                <span className="text-sm text-gray-700 font-golos">Есть пробный период / тестовая партия</span>
              </div>
            </div>
          )}

          {/* ── PHOTOS ── */}
          {editTab === "photos" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-400 font-ibm">{form.photos.length} / 10 фотографий</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                {form.photos.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => set("photos", form.photos.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
                {form.photos.length < 10 && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-navy-400 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-navy-600 transition-all"
                  >
                    {uploading ? <Icon name="Loader2" size={20} className="animate-spin" /> : <><Icon name="Plus" size={20} /><span className="text-xs font-ibm">Загрузить</span></>}
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              {form.photos.length === 0 && (
                <p className="text-xs text-gray-400 font-ibm">Загрузите фотографии склада, рабочего процесса, команды.</p>
              )}
            </div>
          )}

          {/* ── PREVIEW ── */}
          {editTab === "preview" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-ibm">Так ваша карточка будет выглядеть в каталоге для клиентов.</p>
              <div className="max-w-sm">
                <FulfillmentCardPreview form={form} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Readiness checklist — показываем только для черновиков и отклонённых */}
      {(form.status === "draft" || form.status === "rejected") && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-golos font-bold text-navy-900 text-sm flex items-center gap-2">
              <Icon name="ClipboardCheck" size={15} className="text-navy-600" />
              Готовность к публикации
            </div>
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${readiness.ready ? "bg-emerald-500" : "bg-amber-400"}`}
                  style={{ width: `${(readiness.score / readiness.items.length) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-bold font-golos ${readiness.ready ? "text-emerald-600" : "text-amber-600"}`}>
                {readiness.score}/{readiness.items.length}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {readiness.items.map((item) => (
              <button
                key={item.label}
                onClick={() => !item.done && setEditTab(item.tab)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.done
                    ? "bg-emerald-50 cursor-default"
                    : "bg-amber-50 hover:bg-amber-100 cursor-pointer"
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-500" : "bg-amber-200"}`}>
                  {item.done
                    ? <Icon name="Check" size={10} className="text-white" />
                    : <Icon name="Minus" size={10} className="text-amber-600" />
                  }
                </div>
                <div className="min-w-0">
                  <span className={`text-xs font-medium font-golos ${item.done ? "text-emerald-700" : "text-amber-800"}`}>
                    {item.label}
                  </span>
                  {!item.done && item.hint && (
                    <span className="text-xs text-amber-600 font-ibm block leading-none mt-0.5">{item.hint}</span>
                  )}
                </div>
                {!item.done && (
                  <Icon name="ArrowRight" size={12} className="text-amber-500 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          {readiness.ready && (
            <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <Icon name="CheckCircle" size={14} className="text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-golos font-semibold">
                Всё заполнено — можно отправлять на модерацию!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 md:-mx-6 px-4 md:px-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-3 max-w-4xl">
          <Button onClick={handleSave} disabled={saving}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-11 px-8">
            {saving ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="Save" size={16} className="mr-2" />}
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>

          {(form.status === "draft" || form.status === "rejected") && (
            <Button onClick={handleSubmit} disabled={submitting}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos text-sm h-11 px-8">
              {submitting ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="Send" size={16} className="mr-2" />}
              Отправить на модерацию
            </Button>
          )}

          {form.status === "pending" && (
            <span className="text-xs text-amber-700 font-ibm flex items-center gap-1.5">
              <Icon name="Clock" size={13} />На модерации
            </span>
          )}
          {(form.status === "approved" || form.status === "active") && (
            <span className="text-xs text-emerald-700 font-ibm flex items-center gap-1.5">
              <Icon name="CheckCircle" size={13} />Опубликован в каталоге
            </span>
          )}

          {form.status !== "closed" && (
            <button onClick={handleClose} disabled={closing}
              className="ml-auto text-xs text-gray-400 hover:text-red-500 font-ibm transition-colors flex items-center gap-1.5">
              <Icon name="Archive" size={13} />
              {closing ? "Закрываю..." : "Закрыть фулфилмент"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}