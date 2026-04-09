import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import type { Partner } from "./data";

interface ComparePageProps {
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  partners: Partner[];
}

export default function ComparePage({ compareList, setCompareList, onClose, partners }: ComparePageProps) {
  const selected = compareList.slice(0, 3).map((id) => partners.find((p) => p.id === id)!).filter(Boolean);

  const featureDefs = [
    { key: "cameras", label: "Видеонаблюдение", icon: "Camera", color: "text-blue-500" },
    { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle", color: "text-red-500" },
    { key: "returns", label: "Работа с возвратами", icon: "RefreshCw", color: "text-emerald-500" },
    { key: "same_day", label: "Доставка день в день", icon: "Zap", color: "text-amber-500" },
    { key: "temp_control", label: "Температурный режим", icon: "Thermometer", color: "text-cyan-500" },
    { key: "packaging", label: "Упаковка", icon: "Package", color: "text-purple-500" },
  ];

  const rows: { label: string; render: (p: Partner) => React.ReactNode }[] = [
    { label: "Рейтинг", render: (p) => (
      <div className="flex items-center gap-1.5">
        <StarRating rating={p.rating} size={13} />
        <span className="font-golos font-bold text-navy-900">{p.rating}</span>
        <span className="text-xs text-gray-400">({p.reviews})</span>
      </div>
    )},
    { label: "Город", render: (p) => (
      <span className="flex items-center gap-1 text-sm font-ibm text-navy-900">
        <Icon name="MapPin" size={12} className="text-gray-400" />{p.location}
      </span>
    )},
    { label: "Мин. объём", render: (p) => <span className="text-sm font-ibm text-navy-900">{p.minVolume}</span> },
    { label: "Схемы работы", render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.workSchemes.map((s) => <span key={s} className="text-xs px-2 py-0.5 bg-navy-900 text-white rounded font-ibm font-medium">{s}</span>)}
      </div>
    )},
    { label: "Маркетплейсы", render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>)}
      </div>
    )},
    { label: "Хранение", render: (p) => (
      <div>
        <span className="font-golos font-bold text-navy-900">{p.storage}</span>
      </div>
    )},
    { label: "Сборка заказа", render: (p) => (
      <span className="font-golos font-bold text-navy-900">{p.assembly}</span>
    )},
    { label: "Доставка", render: (p) => (
      <span className="font-golos font-bold text-navy-900">{p.delivery}</span>
    )},
    { label: "Упаковка", render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.packagingTypes.map((pk) => <span key={pk} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-ibm">{pk}</span>)}
      </div>
    )},
    { label: "Дополнительные услуги", render: (p) => (
      <div className="flex flex-col gap-1.5">
        {featureDefs.map((f) => (
          <div key={f.key} className={`flex items-center gap-1.5 text-xs font-ibm ${p.features.includes(f.key) ? "text-gray-700" : "text-gray-300"}`}>
            <Icon name={f.icon as "Camera"} size={12} className={p.features.includes(f.key) ? f.color : "text-gray-300"} />
            {f.label}
            {p.features.includes(f.key)
              ? <Icon name="Check" size={11} className="text-emerald-500 ml-auto" />
              : <Icon name="Minus" size={11} className="text-gray-300 ml-auto" />}
          </div>
        ))}
      </div>
    )},
  ];

  const removePartner = (id: number) => setCompareList((prev) => prev.filter((x) => x !== id));

  const cheapestStorage = Math.min(...selected.map((p) => p.storageRate));
  const cheapestAssembly = Math.min(...selected.map((p) => p.assemblyRate));
  const cheapestDelivery = Math.min(...selected.map((p) => p.deliveryRate));
  const highestRating = Math.max(...selected.map((p) => p.rating));

  const colCount = selected.length;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={13} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-navy-900 hidden sm:inline">FulfillHub</span>
          </div>
          <div className="h-5 w-px bg-gray-200" />
          <Icon name="GitCompare" size={16} className="text-navy-700" />
          <span className="font-golos font-bold text-navy-900">Сравнение партнёров</span>
          <span className="text-xs bg-navy-100 text-navy-700 px-2 py-0.5 rounded font-ibm">{selected.length} из 3</span>
          <button onClick={onClose} className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors font-ibm">
            <Icon name="X" size={16} />
            <span className="hidden sm:inline">Закрыть</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {selected.length < 2 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="GitCompare" size={28} className="text-navy-300" />
              </div>
              <h3 className="font-golos font-bold text-xl text-navy-900 mb-2">Добавьте минимум 2 партнёра</h3>
              <p className="text-gray-500 font-ibm text-sm mb-5">Вернитесь в каталог и отметьте партнёров для сравнения</p>
              <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos" onClick={onClose}>
                <Icon name="ArrowLeft" size={15} className="mr-1.5" />Вернуться в каталог
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-white border border-gray-100 rounded-tl-xl w-44 align-bottom">
                      <span className="text-xs text-gray-400 font-ibm font-normal uppercase tracking-wide">Параметр</span>
                    </th>
                    {selected.map((p, idx) => (
                      <th key={p.id} className={`p-4 bg-white border border-gray-100 align-top text-left ${idx === selected.length - 1 ? "rounded-tr-xl" : ""}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 bg-navy-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{p.logo}</div>
                            <div>
                              <div className="font-golos font-black text-navy-900 text-base leading-tight">{p.name}</div>
                              <div className="text-xs text-gray-400 font-ibm flex items-center gap-0.5 mt-0.5">
                                <Icon name="MapPin" size={10} />{p.location}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removePartner(p.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5" title="Убрать из сравнения">
                            <Icon name="X" size={15} />
                          </button>
                        </div>
                        <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
                      </th>
                    ))}
                    {colCount < 3 && (
                      <th className="p-4 bg-gray-50/60 border border-dashed border-gray-200 rounded-tr-xl align-middle text-center">
                        <div className="text-gray-300 font-ibm text-xs">
                          <Icon name="Plus" size={20} className="mx-auto mb-1 opacity-40" />
                          Добавить<br />партнёра
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                      <td className="p-4 border border-gray-100 text-xs font-semibold text-gray-500 font-ibm uppercase tracking-wide align-top whitespace-nowrap">
                        {row.label}
                      </td>
                      {selected.map((p) => {
                        const isBestStorage = row.label === "Хранение" && p.storageRate === cheapestStorage;
                        const isBestAssembly = row.label === "Сборка заказа" && p.assemblyRate === cheapestAssembly;
                        const isBestDelivery = row.label === "Доставка" && p.deliveryRate === cheapestDelivery;
                        const isBestRating = row.label === "Рейтинг" && p.rating === highestRating;
                        const isBest = (isBestStorage || isBestAssembly || isBestDelivery || isBestRating) && selected.length > 1;
                        return (
                          <td key={p.id} className={`p-4 border border-gray-100 align-top relative ${isBest ? "bg-emerald-50/60" : ""}`}>
                            {isBest && (
                              <span className="absolute top-2 right-2 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded font-ibm font-medium">
                                Лучший
                              </span>
                            )}
                            {row.render(p)}
                          </td>
                        );
                      })}
                      {colCount < 3 && <td className="p-4 border border-dashed border-gray-200 bg-gray-50/30" />}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td className="p-4 border border-gray-100 rounded-bl-xl bg-white" />
                    {selected.map((p, idx) => (
                      <td key={p.id} className={`p-4 border border-gray-100 bg-white ${idx === selected.length - 1 && colCount === 3 ? "rounded-br-xl" : ""}`}>
                        <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-9 text-sm">
                          <Icon name="Send" size={13} className="mr-1.5" />Запросить КП
                        </Button>
                      </td>
                    ))}
                    {colCount < 3 && (
                      <td className="p-4 border border-dashed border-gray-200 bg-gray-50/30 rounded-br-xl">
                        <button onClick={onClose} className="w-full h-9 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 font-ibm hover:border-navy-300 hover:text-navy-500 transition-colors">
                          + Добавить
                        </button>
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
