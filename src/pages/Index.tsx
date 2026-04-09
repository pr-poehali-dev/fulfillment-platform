import { useState } from "react";
import { Navbar, HeroSection, Footer } from "./Index/Navigation";
import { CatalogSection, ComparePage } from "./Index/Catalog";
import { CalculatorSection, ContactsSection } from "./Index/Calculator";

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [active, setActive] = useState("hero");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const handleSetActive = (section: string) => {
    setActive(section);
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  return (
    <div className="min-h-screen font-golos">
      <Navbar
        active={active}
        setActive={handleSetActive}
        onOpenCompare={() => setCompareOpen(true)}
        compareCount={compareList.length}
      />
      <div className="pt-14">
        <HeroSection setActive={handleSetActive} />
        <CatalogSection
          setActive={handleSetActive}
          compareList={compareList}
          setCompareList={setCompareList}
          onOpenCompare={() => setCompareOpen(true)}
        />
        <CalculatorSection />
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
    </div>
  );
}
