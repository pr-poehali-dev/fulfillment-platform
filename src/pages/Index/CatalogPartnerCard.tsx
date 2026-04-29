import React, { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import type { Partner } from "./data";
import { FEATURE_FILTERS, SPECIALIZATION_FILTERS } from "./data";
import { ymGoal } from "@/lib/ym";

const PREVIEW_LIMIT = 4;

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

export default function PartnerCard({ p, inCompare, onCompare, isFavorite, onToggleFavorite, onOpenDetail, onRequestQuote }: PartnerCardProps) {

  return (
    <div className="bg-white border border-gray-100 rounded-xl card-hover shadow-sm flex flex-col overflow-hidden group">
      {/* Photo header */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => { ymGoal("card_open_detail", { partner: p.name }); onOpenDetail(); }}>
        {p.photos[0] && (
          <img src={p.photos[0]} alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
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
              <Icon name="MapPin" size={9} />
              {p.address ? p.address : p.location}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">

        {/* Work schemes + marketplaces */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {p.workSchemes.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 bg-navy-900 text-white rounded font-ibm font-medium">{s}</span>
          ))}
          {p.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>
          ))}
        </div>

        {/* Features */}
        {p.features.length > 0 && (
          <div className="mb-2">
            <CollapsibleTags items={p.features.map((fVal) => {
              const def = FEATURE_FILTERS.find((x) => x.key === fVal || x.label === fVal);
              if (!def) return (
                <span key={fVal} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                  {fVal}
                </span>
              );
              return (
                <span key={fVal} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                  <Icon name={def.icon as "Camera"} size={10} className={FEATURE_COLORS[def.key] || "text-gray-400"} />
                  {def.label}
                </span>
              );
            })} />
          </div>
        )}
        {/* Packaging types */}
        {(p.packagingTypes || []).length > 0 && (
          <div className="mb-2">
            <CollapsibleTags items={(p.packagingTypes || []).map((pkg) => (
              <span key={pkg} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                <Icon name="Package" size={10} className="text-purple-400" />
                {pkg}
              </span>
            ))} />
          </div>
        )}
        {/* Specializations */}
        {(p.specializations || []).length > 0 && (
          <div className="mb-2">
            <CollapsibleTags items={(p.specializations || []).map((sVal) => {
              const def = SPECIALIZATION_FILTERS.find((x) => x.key === sVal || x.label === sVal);
              if (!def) return (
                <span key={sVal} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                  {sVal}
                </span>
              );
              return (
                <span key={sVal} className="inline-flex items-center gap-1 text-[10px] font-ibm text-gray-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                  <Icon name={def.icon as "Boxes"} size={10} className={SPEC_COLORS[def.key] || "text-gray-400"} />
                  {def.label}
                </span>
              );
            })} />
          </div>
        )}

        {/* Rates */}
        <div className="grid grid-cols-3 gap-1 bg-gray-50 rounded-lg p-2 mb-3 mt-2">
          <div className="text-center">
            <div className="text-xs text-gray-400 font-ibm">Хранение</div>
            <div className="text-xs font-semibold text-navy-900">{p.storage || "по запросу"}</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="text-xs text-gray-400 font-ibm">Сборка</div>
            <div className="text-xs font-semibold text-navy-900">{p.assembly || "по запросу"}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 font-ibm">Доставка</div>
            <div className="text-xs font-semibold text-navy-900">{p.delivery || "по запросу"}</div>
          </div>
        </div>

        {/* Rating + compare */}
        <div className="flex-1" />
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mb-3 mt-3">
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
            onClick={() => { ymGoal("card_open_detail", { partner: p.name }); onOpenDetail(); }}>
            <Icon name="Eye" size={12} className="mr-1" />Подробнее
          </Button>
          <Button size="sm"
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos text-xs h-9"
            onClick={() => { ymGoal("card_request_quote", { partner: p.name }); onRequestQuote(); }}>
            <Icon name="Send" size={12} className="mr-1" />Запросить КП
          </Button>
        </div>
      </div>
    </div>
  );
}