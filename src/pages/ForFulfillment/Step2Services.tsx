import Icon from "@/components/ui/icon";

export interface Step2Props {
  schemes: string[];      toggleScheme: (v: string) => void;
  features: string[];     toggleFeature: (v: string) => void;
  packaging: string[];    togglePackaging: (v: string) => void;
  marketplaces: string[]; toggleMarketplace: (v: string) => void;
}

export default function Step2Services({ schemes, toggleScheme, features, toggleFeature, packaging, togglePackaging, marketplaces, toggleMarketplace }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">
          Схемы работы <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {["FBS", "FBO", "DBS", "Экспресс-доставка"].map((s) => (
            <button key={s} onClick={() => toggleScheme(s)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all font-golos ${
                schemes.includes(s)
                  ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">
          Маркетплейсы <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Ali", "Lamoda", "Свой интернет-магазин"].map((mp) => (
            <button key={mp} onClick={() => toggleMarketplace(mp)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                marketplaces.includes(mp)
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
              }`}>
              {mp}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">Дополнительные услуги</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: "cameras",       label: "Видеонаблюдение на складе", icon: "Camera"        },
            { key: "dangerous",     label: "Опасные грузы",             icon: "AlertTriangle" },
            { key: "returns",       label: "Обработка возвратов",       icon: "RefreshCw"     },
            { key: "same_day",      label: "Доставка день в день",      icon: "Zap"           },
            { key: "temp_control",  label: "Температурный режим",       icon: "Thermometer"   },
            { key: "marking",       label: "Маркировка товаров",        icon: "Tag"           },
            { key: "photo",         label: "Фотосъёмка товаров",        icon: "Camera"        },
            { key: "assembly_kits", label: "Комплектация наборов",      icon: "Boxes"         },
          ].map((f) => (
            <label key={f.key}
              className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${
                features.includes(f.key) ? "border-navy-200 bg-navy-50/50" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                onClick={() => toggleFeature(f.key)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  features.includes(f.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300"
                }`}
              >
                {features.includes(f.key) && <Icon name="Check" size={10} className="text-white" />}
              </div>
              <div
                className="flex items-center gap-1.5 text-sm text-gray-700 font-ibm"
                onClick={() => toggleFeature(f.key)}
              >
                <Icon name={f.icon as "Camera"} size={13} className="text-gray-400" />
                {f.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">Типы упаковки</label>
        <div className="flex flex-wrap gap-2">
          {["Полиэтилен (ПВД)", "Коробка (картон)", "Воздушно-пузырьковая плёнка (ВПП)", "Термоусадочная плёнка (ПОФ)", "Деревянная обрешётка", "Фирменные пакеты", "Индивидуальная упаковка"].map((pk) => (
            <button key={pk} onClick={() => togglePackaging(pk)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                packaging.includes(pk)
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
              }`}>
              {pk}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
