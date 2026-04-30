import { useState, useEffect } from "react";
import { Navbar, HeroSection, Footer } from "./Index/Navigation";
import QuizForSellers from "./Index/QuizForSellers";
import { CatalogSection, ComparePage } from "./Index/Catalog";
import { ContactsSection } from "./Index/Calculator";
import { PartnerDetailModal, RequestQuoteModal } from "./Index/Modals";
import { useFavorites } from "./Index/useFavorites";
import type { Partner } from "./Index/data";
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
  og_image?: string;
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
    badge: f.badge || "Новый партнёр",
    badgeColor: f.badge_color || "blue",
    features: f.features || [],
    packagingTypes: f.packaging_types || [],
    workSchemes: f.work_schemes || [],
    hasRealPhoto: !!(f.photos && f.photos.length > 0) || !!f.og_image,
    photos: (f.photos && f.photos.length > 0)
      ? f.photos
      : (f.og_image
        ? [f.og_image]
        : ["https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/8256f2c4-241c-42d2-8230-d5bfc2500632.jpg"]),
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

export default function Index() {
  const [active, setActive] = useState("hero");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);
  const [quotePartners, setQuotePartners] = useState<Partner[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const { favorites, toggle: toggleFavorite, has: isFavorite } = useFavorites();

  useEffect(() => {
    api.listApproved()
      .then((data: { fulfillments: ApiFulfillment[] }) => {
        setPartners((data.fulfillments || []).map(mapToPartner));
      })
      .catch(() => setPartners([]))
      .finally(() => setLoadingPartners(false));
  }, []);

  const handleSetActive = (section: string) => {
    setActive(section);
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const handleOpenFavorites = () => {
    setShowFavoritesOnly(true);
    handleSetActive("catalog");
  };

  return (
    <div className="min-h-screen font-golos">
      <Navbar
        active={active}
        setActive={handleSetActive}
        onOpenCompare={() => setCompareOpen(true)}
        compareCount={compareList.length}
        favoritesCount={favorites.length}
        onOpenFavorites={handleOpenFavorites}
      />
      <div className="pt-14">
        <HeroSection setActive={handleSetActive} onOpenQuiz={() => setQuizOpen(true)} />
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
          loading={loadingPartners}
        />
        <Footer setActive={handleSetActive} />
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

      <QuizForSellers open={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}