import { useState } from "react";
import { Navbar, HeroSection, Footer } from "./Index/Navigation";
import { CatalogSection, ComparePage } from "./Index/Catalog";
import { ContactsSection } from "./Index/Calculator";
import { PartnerDetailModal, RequestQuoteModal } from "./Index/Modals";
import { useFavorites } from "./Index/useFavorites";
import type { Partner } from "./Index/data";

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [active, setActive] = useState("hero");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);
  const [quotePartners, setQuotePartners] = useState<Partner[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { favorites, toggle: toggleFavorite, has: isFavorite } = useFavorites();

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
        <HeroSection setActive={handleSetActive} />
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
        />
        <ContactsSection />
        <Footer setActive={handleSetActive} />
      </div>

      {compareOpen && (
        <ComparePage
          compareList={compareList}
          setCompareList={setCompareList}
          onClose={() => setCompareOpen(false)}
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
