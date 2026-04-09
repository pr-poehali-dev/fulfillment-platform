import { useState } from "react";
import Icon from "@/components/ui/icon";
import { FEATURE_FILTERS, SPECIALIZATION_FILTERS, type Partner } from "./data";
import CatalogFilterPanel from "./CatalogFilterPanel";
import PartnerCard from "./CatalogPartnerCard";
import ComparePageComponent from "./CatalogComparePage";

// ─── CATALOG WITH ADVANCED FILTERS ───────────────────────────────────────────

export function CatalogSection({ setActive, compareList, setCompareList, onOpenCompare, onOpenDetail, onRequestQuote, onRequestQuoteMany, isFavorite, onToggleFavorite, showFavoritesOnly, onToggleFavoritesFilter, partners, loading }: {
  setActive: (s: string) => void;
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
  onOpenCompare: () => void;
  onOpenDetail: (p: Partner) => void;
  onRequestQuote: (p: Partner) => void;
  onRequestQuoteMany: (ids: Partner[]) => void;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
  partners: Partner[];
  loading: boolean;
}) {
  const PARTNERS = partners;
  const [selectedMp, setSelectedMp] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [storageFrom, setStorageFrom] = useState<string>("");
  const [storageTo, setStorageTo] = useState<string>("");
  const [assemblyFrom, setAssemblyFrom] = useState<string>("");
  const [assemblyTo, setAssemblyTo] = useState<string>("");
  const [deliveryFrom, setDeliveryFrom] = useState<string>("");
  const [deliveryTo, setDeliveryTo] = useState<string>("");
  const [areaFrom, setAreaFrom] = useState<string>("");
  const [areaTo, setAreaTo] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [maxFoundedYear, setMaxFoundedYear] = useState<number>(0);
  const [sortBy, setSortBy] = useState("rating");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleArr = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const numStorageFrom = parseFloat(storageFrom) || 0;
  const numStorageTo = parseFloat(storageTo) || 0;
  const numAssemblyFrom = parseFloat(assemblyFrom) || 0;
  const numAssemblyTo = parseFloat(assemblyTo) || 0;
  const numDeliveryFrom = parseFloat(deliveryFrom) || 0;
  const numDeliveryTo = parseFloat(deliveryTo) || 0;
  const numAreaFrom = parseFloat(areaFrom) || 0;
  const numAreaTo = parseFloat(areaTo) || 0;

  const activeFilterCount =
    selectedMp.length + selectedFeatures.length + selectedSchemes.length + selectedPackaging.length +
    selectedCities.length + selectedCerts.length + selectedSpecs.length +
    (numStorageFrom > 0 || numStorageTo > 0 ? 1 : 0) +
    (numAssemblyFrom > 0 || numAssemblyTo > 0 ? 1 : 0) +
    (numDeliveryFrom > 0 || numDeliveryTo > 0 ? 1 : 0) +
    (numAreaFrom > 0 || numAreaTo > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) + (maxFoundedYear > 0 ? 1 : 0);

  const clearAll = () => {
    setSelectedMp([]);
    setSelectedFeatures([]);
    setSelectedSchemes([]);
    setSelectedPackaging([]);
    setSelectedCities([]);
    setCityInput("");
    setSelectedCerts([]);
    setSelectedSpecs([]);
    setStorageFrom("");
    setStorageTo("");
    setAssemblyFrom("");
    setAssemblyTo("");
    setDeliveryFrom("");
    setDeliveryTo("");
    setAreaFrom("");
    setAreaTo("");
    setMinRating(0);
    setMaxFoundedYear(0);
  };

  const filtered = PARTNERS.filter((p) => {
    if (showFavoritesOnly && !isFavorite(p.id)) return false;
    if (selectedMp.length && !selectedMp.some((mp) => p.tags.includes(mp))) return false;
    if (selectedCities.length && !selectedCities.includes(p.location)) return false;
    if (selectedCerts.length && !selectedCerts.some((c) => (p.certificates || []).includes(c))) return false;
    if (selectedSpecs.length && !selectedSpecs.some((s) => (p.specializations || []).includes(s))) return false;
    if (numStorageFrom > 0 && (p.storageRate || 0) < numStorageFrom) return false;
    if (numStorageTo > 0 && (p.storageRate || 0) > numStorageTo) return false;
    if (numAssemblyFrom > 0 && (p.assemblyRate || 0) < numAssemblyFrom) return false;
    if (numAssemblyTo > 0 && (p.assemblyRate || 0) > numAssemblyTo) return false;
    if (numDeliveryFrom > 0 && (p.deliveryRate || 0) < numDeliveryFrom) return false;
    if (numDeliveryTo > 0 && (p.deliveryRate || 0) > numDeliveryTo) return false;
    if (numAreaFrom > 0 && (p.warehouseArea || 0) < numAreaFrom) return false;
    if (numAreaTo > 0 && (p.warehouseArea || 0) > numAreaTo) return false;
    if (minRating > 0 && (p.rating || 0) < minRating) return false;
    if (maxFoundedYear > 0 && (p.foundedYear || 0) > maxFoundedYear) return false;
    if (selectedFeatures.length && !selectedFeatures.every((f) => p.features.includes(f))) return false;
    if (selectedSchemes.length && !selectedSchemes.some((s) => p.workSchemes.includes(s))) return false;
    if (selectedPackaging.length && !selectedPackaging.some((pk) => p.packagingTypes.includes(pk))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    if (sortBy === "price_asc") return a.storageRate - b.storageRate;
    if (sortBy === "price_desc") return b.storageRate - a.storageRate;
    return a.name.localeCompare(b.name);
  });

  const toggleCompare = (id: number) =>
    setCompareList((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);

  void setActive;

  return (
    <section id="catalog" className="bg-white">
      <CatalogFilterPanel
        partners={PARTNERS}
        filtered={filtered}
        activeFilterCount={activeFilterCount}
        clearAll={clearAll}
        compareList={compareList}
        onOpenCompare={onOpenCompare}
        onRequestQuoteMany={onRequestQuoteMany}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesFilter={onToggleFavoritesFilter}
        toggleArr={toggleArr}
        selectedMp={selectedMp} setSelectedMp={setSelectedMp}
        selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
        selectedSchemes={selectedSchemes} setSelectedSchemes={setSelectedSchemes}
        selectedPackaging={selectedPackaging} setSelectedPackaging={setSelectedPackaging}
        selectedCities={selectedCities} setSelectedCities={setSelectedCities}
        cityInput={cityInput} setCityInput={setCityInput}
        cityDropdownOpen={cityDropdownOpen} setCityDropdownOpen={setCityDropdownOpen}
        selectedCerts={selectedCerts} setSelectedCerts={setSelectedCerts}
        selectedSpecs={selectedSpecs} setSelectedSpecs={setSelectedSpecs}
        storageFrom={storageFrom} setStorageFrom={setStorageFrom}
        storageTo={storageTo} setStorageTo={setStorageTo}
        assemblyFrom={assemblyFrom} setAssemblyFrom={setAssemblyFrom}
        assemblyTo={assemblyTo} setAssemblyTo={setAssemblyTo}
        deliveryFrom={deliveryFrom} setDeliveryFrom={setDeliveryFrom}
        deliveryTo={deliveryTo} setDeliveryTo={setDeliveryTo}
        areaFrom={areaFrom} setAreaFrom={setAreaFrom}
        areaTo={areaTo} setAreaTo={setAreaTo}
        minRating={minRating} setMinRating={setMinRating}
        maxFoundedYear={maxFoundedYear} setMaxFoundedYear={setMaxFoundedYear}
        sortBy={sortBy} setSortBy={setSortBy}
        filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}
      />

      {/* Partner cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-ibm">
            <Icon name="Loader2" size={36} className="mx-auto mb-3 animate-spin text-navy-300" />
            <p className="text-base">Загружаем каталог партнёров...</p>
          </div>
        ) : PARTNERS.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Building2" size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-golos font-bold text-navy-900 text-lg mb-1">Пока нет одобренных фулфилментов</p>
            <p className="text-gray-500 font-ibm text-sm mb-4">Мы ведём модерацию новых партнёров. Загляните позже!</p>
            <a href="/for-fulfillment" className="inline-flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700 font-semibold font-ibm">
              Разместить свой фулфилмент <Icon name="ArrowRight" size={13} />
            </a>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-ibm">
            <Icon name="SearchX" size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-base">Ничего не найдено</p>
            <button onClick={clearAll} className="mt-2 text-sm text-navy-700 hover:underline">Сбросить все фильтры</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <PartnerCard
                key={p.id}
                p={p}
                inCompare={compareList.includes(p.id)}
                onCompare={() => toggleCompare(p.id)}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={() => onToggleFavorite(p.id)}
                onOpenDetail={() => onOpenDetail(p)}
                onRequestQuote={() => onRequestQuote(p)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── COMPARE PAGE (fullscreen overlay) ───────────────────────────────────────

export function ComparePage({ compareList, setCompareList, onClose, partners }: {
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  partners: Partner[];
}) {
  return (
    <ComparePageComponent
      compareList={compareList}
      setCompareList={setCompareList}
      onClose={onClose}
      partners={partners}
    />
  );
}

// Re-export filter constants for external use
export { FEATURE_FILTERS, SPECIALIZATION_FILTERS };
