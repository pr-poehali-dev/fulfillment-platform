import Icon from "@/components/ui/icon";
import type { Fulfillment } from "./types";

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

const FEATURE_LABELS: Record<string, string> = {
  cameras: "Видеонаблюдение", dangerous: "Опасные грузы", returns: "Возвраты",
  same_day: "День в день", temp_control: "Темп. контроль", packaging: "Упаковка",
  honest_mark: "Честный Знак", defect_check: "Проверка брака", seller_packaging: "Пакет продавца",
  shipment_prep: "Подготовка к отгрузке", barcode_check: "Штрихкод", cargo_receive: "Карго",
};
const FEATURE_ICONS: Record<string, string> = {
  cameras: "Camera", dangerous: "AlertTriangle", returns: "RefreshCw",
  same_day: "Zap", temp_control: "Thermometer", packaging: "Package",
  honest_mark: "Tag", defect_check: "ShieldCheck", seller_packaging: "ShoppingBag",
  shipment_prep: "PackageCheck", barcode_check: "ScanLine", cargo_receive: "Ship",
};
const SPEC_LABELS: Record<string, string> = {
  small_goods: "Мелкие товары", cosmetics: "Косметика", clothing: "Одежда/Обувь",
  fuel_lubricants: "ГСМ", construction: "Стройматериалы", appliances: "Бытовая техника", electronics: "Электроника",
};
const SPEC_ICONS: Record<string, string> = {
  small_goods: "Boxes", cosmetics: "Sparkles", clothing: "Shirt",
  fuel_lubricants: "Fuel", construction: "Hammer", appliances: "Tv", electronics: "Cpu",
};

const withRuble = (s: string) => (s && s !== "по запросу" && !s.includes("₽") ? `${s} ₽` : s || "по запросу");

export default function FulfillmentCardPreview({ form }: { form: Fulfillment }) {
  const cover = form.photos[0] || form.og_image || "";
  const hasPhoto = !!cover;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden ring-2 ring-navy-900/5">
      {/* Photo header */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        {hasPhoto ? (
          <img src={cover} alt={form.company_name} className="w-full h-full object-cover" />
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
                <Icon name={(FEATURE_ICONS[fKey] || "Check") as "Check"} size={10} className={FEATURE_COLORS[fKey] || "text-gray-400"} />
                {FEATURE_LABELS[fKey] || fKey}
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
                <Icon name={(SPEC_ICONS[sKey] || "Tag") as "Tag"} size={10} className={SPEC_COLORS[sKey] || "text-gray-400"} />
                {SPEC_LABELS[sKey] || sKey}
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