import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogSection, ComparePage } from "./Index/Catalog";
import { PartnerDetailModal, RequestQuoteModal } from "./Index/Modals";
import { useFavorites } from "./Index/useFavorites";
import type { Partner } from "./Index/data";
import Icon from "@/components/ui/icon";
import api from "@/lib/api";

interface ApiFulfillment {
  id: number;
  company_name: string;
  city: string;
  warehouse_area: number;
  founded_year: number;
  description: string;
  detailed_description: string;
  logo: string;
  photos: string[];
  work_schemes: string[];
  features: string[];
  packaging_types: string[];
  marketplaces: string[];
  storage_price: string;
  assembly_price: string;
  delivery_price: string;
  storage_rate: number;
  assembly_rate: number;
  delivery_rate: number;
  min_volume: string;
  team_size: number;
  working_hours: string;
  certificates: string[];
  services: Array<{ name: string; description: string; price?: string; icon: string }>;
  badge: string;
  badge_color: string;
  rating: number;
  reviews_count: number;
  specializations?: string[];
  address?: string;
}

function mapToPartner(f: ApiFulfillment): Partner {
  return {
    id: f.id,
    name: f.company_name || "Без названия",
    logo: f.logo || "📦",
    rating: f.rating || 0,
    reviews: f.reviews_count || 0,
    location: f.city || "",
    tags: f.marketplaces || [],
    storage: f.storage_price || "по запросу",
    assembly: f.assembly_price || "по запросу",
    delivery: f.delivery_price || "по запросу",
    storageRate: f.storage_rate || 0,
    assemblyRate: f.assembly_rate || 0,
    deliveryRate: f.delivery_rate || 0,
    minVolume: f.min_volume || "",
    description: f.description || "",
    badge: f.badge || "Демо",
    badgeColor: f.badge_color || "blue",
    features: f.features || [],
    packagingTypes: f.packaging_types || [],
    workSchemes: f.work_schemes || [],
    photos: (f.photos && f.photos.length > 0) ? f.photos : ["https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/8256f2c4-241c-42d2-8230-d5bfc2500632.jpg"],
    detailedDescription: f.detailed_description || f.description || "",
    services: f.services || [],
    foundedYear: f.founded_year || new Date().getFullYear(),
    warehouseArea: f.warehouse_area || 0,
    team: f.team_size || 0,
    workingHours: f.working_hours || "",
    certificates: f.certificates || [],
    specializations: f.specializations || [],
    address: f.address || "",
  };
}

export default function Demo() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const [compareList, setCompareList] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);
  const [quotePartners, setQuotePartners] = useState<Partner[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { favorites, toggle: toggleFavorite, has: isFavorite } = useFavorites();

  useEffect(() => {
    if (!token) { setForbidden(true); setLoading(false); return; }
    api.listDemo(token)
      .then((data: { fulfillments: ApiFulfillment[] }) => {
        setPartners((data.fulfillments || []).map(mapToPartner));
      })
      .catch(() => setForbidden(true))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    meta.id = "noindex-demo";
    document.head.appendChild(meta);
    return () => { document.getElementById("noindex-demo")?.remove(); };
  }, []);

  if (!loading && forbidden) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center">
          <Icon name="Lock" size={28} className="text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="font-golos font-black text-2xl text-white mb-2">Доступ закрыт</h1>
          <p className="text-white/50 font-ibm text-sm">Для просмотра демо-каталога нужна специальная ссылка.</p>
        </div>
        <a href="/" className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos rounded-xl transition-all text-sm">
          На главную
        </a>
      </div>
    );
  }

  const handleSetActive = (section: string) => {
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  return (
    <div className="min-h-screen font-golos bg-gray-50">
      {/* Демо-баннер */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-navy-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center flex-shrink-0">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
              <Icon name="Eye" size={12} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold font-ibm">Демо-режим</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-white/40 font-ibm text-xs">
              Демонстрационный каталог — данные не настоящие
            </span>
            <a
              href="/for-fulfillment"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-lg text-sm font-semibold text-gold-400 hover:bg-gold-500/25 transition-all font-golos whitespace-nowrap"
            >
              <Icon name="Plus" size={13} />
              Добавить компанию
            </a>
          </div>
        </div>
      </div>

      <div className="pt-14">
        {/* Заголовок секции */}
        <div className="bg-navy-900 py-10 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-amber-500/15 rounded-full border border-amber-500/25">
              <Icon name="FlaskConical" size={13} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-medium font-ibm tracking-wide">Демонстрационные данные</span>
            </div>
            <h1 className="font-golos font-black text-3xl md:text-4xl text-white mb-3">
              Демо-каталог фулфилментов
            </h1>
            <p className="text-white/60 font-ibm text-sm max-w-xl mx-auto">
              Это закрытый демо-раздел с примерами карточек. Данные ненастоящие — используются для показа возможностей платформы.
            </p>
          </div>
        </div>

        <CatalogSection
          setActive={handleSetActive}
          compareList={compareList}
          setCompareList={setCompareList}
          onOpenCompare={() => setCompareOpen(true)}
          onOpenDetail={(p) => setDetailPartner(p)}
          onRequestQuote={(p) => setQuotePartners([p])}
          onRequestQuoteMany={(ps) => setQuotePartners(ps)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesFilter={() => setShowFavoritesOnly((v) => !v)}
          partners={partners}
          loading={loading}
        />

        <footer className="bg-navy-900 text-white py-8 border-t border-white/10 mt-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 font-ibm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={12} className="text-navy-950" />
              </div>
              <span className="text-white/50 font-golos font-bold">FulfillHub</span>
              <span>© 2026</span>
              <span className="text-amber-400/60">· Демо-режим</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="hover:text-white/60 transition-colors">Главная</a>
              <a href="/privacy" className="hover:text-white/60 transition-colors">Конфиденциальность</a>
            </div>
          </div>
        </footer>
      </div>

      {compareOpen && (
        <ComparePage
          compareList={compareList}
          setCompareList={setCompareList}
          onClose={() => setCompareOpen(false)}
          partners={partners}
        />
      )}

      {detailPartner && (
        <PartnerDetailModal
          partner={detailPartner}
          onClose={() => setDetailPartner(null)}
          onRequestQuote={(p) => { setDetailPartner(null); setQuotePartners([p]); }}
          isFavorite={isFavorite(detailPartner.id)}
          onToggleFavorite={() => toggleFavorite(detailPartner.id)}
        />
      )}

      {quotePartners && (
        <RequestQuoteModal
          partners={quotePartners}
          onClose={() => setQuotePartners(null)}
        />
      )}
    </div>
  );
}