import React, { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import type { Partner } from "./data";
import { FEATURE_FILTERS, SPECIALIZATION_FILTERS } from "./data";
import { ymGoal } from "@/lib/ym";

const PREVIEW_LIMIT = 5;

function CollapsibleTags({ items }: { items: React.ReactNode[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, PREVIEW_LIMIT);
  const hidden = items.length - PREVIEW_LIMIT;
  return (
    <div className="flex flex-wrap gap-1">
      {visible}
      {!expanded && hidden > 0 && (
        <button onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          className="text-[10px] font-ibm px-1.5 py-0.5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded transition-colors">
          +{hidden}
        </button>
      )}
    </div>
  );
}

interface PartnerCardProps {
  p: Partner;
  inCompare: boolean;
  onCompare: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetail: () => void;
  onRequestQuote: () => void;
}

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

const PREMIUM_BADGE = "Premium Fulfilment";

export default function PartnerCard({ p, inCompare, onCompare, isFavorite, onToggleFavorite, onOpenDetail, onRequestQuote }: PartnerCardProps) {
  const isPremium = p.badge === PREMIUM_BADGE;

  return (
    <div
      className={`flex flex-col overflow-hidden group h-full rounded-xl transition-all duration-300 ${
        isPremium
          ? "border-2 border-amber-400 shadow-lg shadow-amber-100 bg-gradient-to-b from-amber-50/60 to-white ring-1 ring-amber-300/40"
          : "bg-white border border-gray-100 shadow-sm card-hover"
      }`}
    >
      {/* Photo header */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => { ymGoal("card_open_detail", { partner: p.name }); onOpenDetail(); }}>
        {p.photos[0] && (
          <img src={p.photos[0]} alt={p.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${isPremium ? "from-amber-950/80 via-black/10 to-black/10" : "from-black/75 via-black/10 to-black/20"}`} />

        {/* Premium crown strip */}
        {isPremium && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
        )}

        <div className="absolute top-2 left-2">
          {isPremium ? (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border font-semibold whitespace-nowrap bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-300 shadow-sm">
              <Icon name="Crown" size={11} />
              Premium
            </span>
          ) : (
            <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"}`}>
          <Icon name="Heart" size={14} className={isFavorite ? "fill-current" : ""} />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <div className={`w-8 h-8 backdrop-blur rounded-lg flex items-center justify-center text-lg shadow-sm ${isPremium ? "bg-amber-100/95" : "bg-white/95"}`}>{p.logo}</div>
          <div>
            <div className="font-golos font-black text-white text-sm leading-tight drop-shadow">{p.name}</div>
            <div className="text-[10px] text-white/90 font-ibm flex items-center gap-0.5 drop-shadow">
              <Icon name="MapPin" size={9} />
              {p.address ? p.address : p.location}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">

        {/* Description */}
        {p.description && (
          <p className="text-xs text-gray-500 font-ibm leading-relaxed mb-2 line-clamp-2">{p.description}</p>
        )}

        {/* Work schemes + marketplaces */}
        <div className="flex flex-wrap gap-1 mb-2">
          {p.workSchemes.map((s) => (
            <span key={s} className={`text-xs px-2 py-0.5 rounded font-ibm font-medium ${isPremium ? "bg-amber-800 text-amber-50" : "bg-navy-900 text-white"}`}>{s}</span>
          ))}
          {p.tags.map((t) => (
            <span key={t} className={`text-xs px-2 py-0.5 rounded font-ibm ${isPremium ? "bg-amber-100 text-amber-800" : "bg-navy-50 text-navy-700"}`}>{t}</span>
          ))}
        </div>

        {/* Features */}
        {p.features.length > 0 && (
          <div className="mb-1">
            <CollapsibleTags items={p.features.map((fVal) => {
              const def = FEATURE_FILTERS.find((x) => x.key === fVal || x.label === fVal);
              if (!def) return (
                <span key={fVal} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                  {fVal}
                </span>
              );
              return (
                <span key={fVal} className={`inline-flex items-center gap-1 text-[10px] font-ibm px-1.5 py-0.5 rounded border ${isPremium ? "text-amber-800 bg-amber-50 border-amber-200" : "text-gray-600 bg-gray-50 border-gray-100"}`}>
                  <Icon name={def.icon as "Camera"} size={10} className={isPremium ? "text-amber-500" : (FEATURE_COLORS[def.key] || "text-gray-400")} />
                  {def.label}
                </span>
              );
            })} />
          </div>
        )}

        {/* Packaging types */}
        {(p.packagingTypes || []).length > 0 && (
          <div className="mb-1">
            <CollapsibleTags items={(p.packagingTypes || []).map((pkg) => (
              <span key={pkg} className={`inline-flex items-center gap-1 text-[10px] font-ibm px-1.5 py-0.5 rounded border ${isPremium ? "text-amber-800 bg-amber-50 border-amber-200" : "text-gray-600 bg-purple-50 border-purple-100"}`}>
                <Icon name="Package" size={10} className={isPremium ? "text-amber-500" : "text-purple-400"} />
                {pkg}
              </span>
            ))} />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Rates */}
        <div className={`grid grid-cols-3 gap-1 rounded-lg p-2 mt-3 mb-3 ${isPremium ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}>
          <div className="text-center">
            <div className={`text-xs font-ibm ${isPremium ? "text-amber-600" : "text-gray-400"}`}>Хранение</div>
            <div className={`text-xs font-semibold ${isPremium ? "text-amber-900" : "text-navy-900"}`}>{p.storage || "по запросу"}</div>
          </div>
          <div className={`text-center border-x ${isPremium ? "border-amber-200" : "border-gray-200"}`}>
            <div className={`text-xs font-ibm ${isPremium ? "text-amber-600" : "text-gray-400"}`}>Сборка</div>
            <div className={`text-xs font-semibold ${isPremium ? "text-amber-900" : "text-navy-900"}`}>{p.assembly || "по запросу"}</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-ibm ${isPremium ? "text-amber-600" : "text-gray-400"}`}>Доставка</div>
            <div className={`text-xs font-semibold ${isPremium ? "text-amber-900" : "text-navy-900"}`}>{p.delivery || "по запросу"}</div>
          </div>
        </div>

        <div className={`flex items-center justify-between pt-2 border-t mb-3 ${isPremium ? "border-amber-200" : "border-gray-100"}`}>
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
            className={`font-ibm text-xs h-9 ${isPremium ? "border-amber-300 text-amber-800 hover:bg-amber-50" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            onClick={() => { ymGoal("card_open_detail", { partner: p.name }); onOpenDetail(); }}>
            <Icon name="Eye" size={12} className="mr-1" />Подробнее
          </Button>
          <Button size="sm"
            className={`font-bold font-golos text-xs h-9 ${isPremium ? "bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-amber-950 shadow-sm" : "bg-gold-500 hover:bg-gold-400 text-navy-950"}`}
            onClick={() => { ymGoal("card_request_quote", { partner: p.name }); onRequestQuote(); }}>
            <Icon name="Send" size={12} className="mr-1" />Запросить КП
          </Button>
        </div>
      </div>
    </div>
  );
}