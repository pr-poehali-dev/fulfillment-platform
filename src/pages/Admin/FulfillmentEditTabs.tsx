import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Fulfillment } from "./types";
import {
  WORK_SCHEME_OPTIONS,
  FEATURE_OPTIONS,
  SPECIALIZATION_OPTIONS,
  MARKETPLACE_OPTIONS,
} from "./types";
import FulfillmentCardPreview from "./FulfillmentCardPreview";

export type EditTab = "info" | "services" | "pricing" | "photos" | "preview";

export const EDIT_TABS: { id: EditTab; label: string; icon: string }[] = [
  { id: "info",     label: "Основное",      icon: "Building2"    },
  { id: "services", label: "Услуги",        icon: "Layers"       },
  { id: "pricing",  label: "Тарифы",        icon: "DollarSign"   },
  { id: "photos",   label: "Фото",          icon: "Camera"       },
  { id: "preview",  label: "Предпросмотр",  icon: "Eye"          },
];

interface FulfillmentEditTabsProps {
  form: Fulfillment;
  editTab: EditTab;
  setEditTab: (t: EditTab) => void;
  tabMissingCount: (t: EditTab) => number;
  set: (key: keyof Fulfillment, val: unknown) => void;
  toggleArr: (key: keyof Fulfillment, val: string) => void;
}

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

export default function FulfillmentEditTabs({
  form, editTab, setEditTab, tabMissingCount, set, toggleArr,
}: FulfillmentEditTabsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
      const er = err as { message?: string };
      toast.error(er.message || "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tab bar */}
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
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">
                  Адрес склада <span className="text-gray-400 font-normal">(отображается на карте)</span>
                </label>
                <input value={form.address || ""} onChange={(e) => set("address", e.target.value)} className={inputCls} placeholder="Москва, ул. Складская, д. 12, стр. 3" />
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
                { key: "storage_price" as const,  label: "Хранение, ₽/пал/день",    placeholder: "25"  },
                { key: "assembly_price" as const,  label: "Сборка, ₽/заказ",         placeholder: "60"  },
                { key: "delivery_price" as const,  label: "Доставка, ₽/заказ",       placeholder: "0"   },
                { key: "min_volume" as const,      label: "Мин. объём, заказов/мес", placeholder: "100" },
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
                  {uploading
                    ? <Icon name="Loader2" size={20} className="animate-spin" />
                    : <><Icon name="Plus" size={20} /><span className="text-xs font-ibm">Загрузить</span></>
                  }
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
  );
}