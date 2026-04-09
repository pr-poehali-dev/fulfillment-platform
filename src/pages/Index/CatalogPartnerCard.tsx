import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import type { Partner } from "./data";

interface PartnerCardProps {
  p: Partner;
  inCompare: boolean;
  onCompare: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetail: () => void;
  onRequestQuote: () => void;
}

export default function PartnerCard({ p, inCompare, onCompare, isFavorite, onToggleFavorite, onOpenDetail, onRequestQuote }: PartnerCardProps) {
  const featureIcons: Record<string, { icon: string; label: string; color: string }> = {
    cameras: { icon: "Camera", label: "Камеры", color: "text-blue-500" },
    dangerous: { icon: "AlertTriangle", label: "Опасные грузы", color: "text-red-500" },
    returns: { icon: "RefreshCw", label: "Возвраты", color: "text-emerald-500" },
    same_day: { icon: "Zap", label: "День в день", color: "text-amber-500" },
    temp_control: { icon: "Thermometer", label: "Темп. режим", color: "text-cyan-500" },
    packaging: { icon: "Package", label: "Упаковка", color: "text-purple-500" },
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl card-hover shadow-sm flex flex-col overflow-hidden group">
      {/* Photo header */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden cursor-pointer" onClick={onOpenDetail}>
        {p.photos[0] && (
          <img src={p.photos[0]} alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute top-2 left-2">
          <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"}`}>
          <Icon name="Heart" size={14} className={isFavorite ? "fill-current" : ""} />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-white/95 backdrop-blur rounded-lg flex items-center justify-center text-lg shadow-sm">{p.logo}</div>
          <div>
            <div className="font-golos font-black text-white text-sm leading-tight drop-shadow">{p.name}</div>
            <div className="text-[10px] text-white/90 font-ibm flex items-center gap-0.5 drop-shadow">
              <Icon name="MapPin" size={9} />{p.location}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 font-ibm leading-relaxed mb-3 flex-1 line-clamp-3">{p.description}</p>

        {/* Work schemes */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {p.workSchemes.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 bg-navy-900 text-white rounded font-ibm font-medium">{s}</span>
          ))}
          {p.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>
          ))}
          {p.tags.length > 2 && <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-ibm">+{p.tags.length - 2}</span>}
        </div>

        {/* Feature icons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {p.features.map((f) => {
            const fi = featureIcons[f];
            if (!fi) return null;
            return (
              <div key={f} className="flex items-center gap-1 text-xs text-gray-500 font-ibm" title={fi.label}>
                <Icon name={fi.icon as "Camera"} size={12} className={fi.color} />
              </div>
            );
          })}
        </div>

        {/* Rates */}
        <div className="grid grid-cols-3 gap-1 bg-gray-50 rounded-lg p-2 mb-3">
          <div className="text-center">
            <div className="text-xs text-gray-400 font-ibm">Хранение</div>
            <div className="text-xs font-semibold text-navy-900">{p.storage}</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-xs text-gray-400 font-ibm">Сборка</div>
            <div className="text-xs font-semibold text-navy-900">{p.assembly}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 font-ibm">Доставка</div>
            <div className="text-xs font-semibold text-navy-900">{p.delivery}</div>
          </div>
        </div>

        {/* Rating + compare */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mb-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={p.rating} size={12} />
            <span className="text-sm font-semibold text-navy-900">{p.rating}</span>
            <span className="text-xs text-gray-400">({p.reviews})</span>
          </div>
          <button onClick={onCompare}
            className={`text-xs px-2 py-1 rounded border font-medium transition-all ${inCompare ? "bg-navy-900 text-white border-navy-900" : "border-gray-200 text-gray-500 hover:border-navy-900/50"}`}>
            {inCompare ? "✓" : "Сравнить"}
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 font-ibm text-xs h-9"
            onClick={onOpenDetail}>
            <Icon name="Eye" size={12} className="mr-1" />Подробнее
          </Button>
          <Button size="sm"
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos text-xs h-9"
            onClick={onRequestQuote}>
            <Icon name="Send" size={12} className="mr-1" />Запросить КП
          </Button>
        </div>
      </div>
    </div>
  );
}
