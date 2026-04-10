import { useEffect } from "react";
import { type Partner } from "./data";
import FilterTopBar from "./FilterTopBar";
import FilterGrid from "./FilterGrid";
import FilterActiveChips from "./FilterActiveChips";
import Icon from "@/components/ui/icon";

export interface FilterState {
  selectedMp: string[];
  setSelectedMp: (v: string[]) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (v: string[]) => void;
  selectedSchemes: string[];
  setSelectedSchemes: (v: string[]) => void;
  selectedPackaging: string[];
  setSelectedPackaging: (v: string[]) => void;
  selectedCities: string[];
  setSelectedCities: (v: string[]) => void;
  cityInput: string;
  setCityInput: (v: string) => void;
  cityDropdownOpen: boolean;
  setCityDropdownOpen: (v: boolean) => void;
  selectedCerts: string[];
  setSelectedCerts: (v: string[]) => void;
  selectedSpecs: string[];
  setSelectedSpecs: (v: string[]) => void;
  storageFrom: string;
  setStorageFrom: (v: string) => void;
  storageTo: string;
  setStorageTo: (v: string) => void;
  assemblyFrom: string;
  setAssemblyFrom: (v: string) => void;
  assemblyTo: string;
  setAssemblyTo: (v: string) => void;
  deliveryFrom: string;
  setDeliveryFrom: (v: string) => void;
  deliveryTo: string;
  setDeliveryTo: (v: string) => void;
  areaFrom: string;
  setAreaFrom: (v: string) => void;
  areaTo: string;
  setAreaTo: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
}

interface CatalogFilterPanelProps extends FilterState {
  partners: Partner[];
  filtered: Partner[];
  activeFilterCount: number;
  clearAll: () => void;
  compareList: number[];
  onOpenCompare: () => void;
  onRequestQuoteMany: (ids: Partner[]) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
  toggleArr: <T>(arr: T[], val: T, set: (v: T[]) => void) => void;
}

export default function CatalogFilterPanel(props: CatalogFilterPanelProps) {
  const {
    partners, filtered, activeFilterCount, clearAll,
    compareList, onOpenCompare, onRequestQuoteMany,
    showFavoritesOnly, onToggleFavoritesFilter,
    toggleArr,
    selectedMp, setSelectedMp,
    selectedFeatures, setSelectedFeatures,
    selectedSchemes, setSelectedSchemes,
    selectedPackaging, setSelectedPackaging,
    selectedCities, setSelectedCities,
    cityInput, setCityInput,
    cityDropdownOpen, setCityDropdownOpen,
    selectedCerts, setSelectedCerts,
    selectedSpecs, setSelectedSpecs,
    storageFrom, setStorageFrom,
    storageTo, setStorageTo,
    assemblyFrom, setAssemblyFrom,
    assemblyTo, setAssemblyTo,
    deliveryFrom, setDeliveryFrom,
    deliveryTo, setDeliveryTo,
    areaFrom, setAreaFrom,
    areaTo, setAreaTo,
    minRating, setMinRating,
    sortBy, setSortBy,
    filtersOpen, setFiltersOpen,
  } = props;

  const numStorageFrom = parseFloat(storageFrom) || 0;
  const numStorageTo = parseFloat(storageTo) || 0;
  const numAssemblyFrom = parseFloat(assemblyFrom) || 0;
  const numAssemblyTo = parseFloat(assemblyTo) || 0;
  const numDeliveryFrom = parseFloat(deliveryFrom) || 0;
  const numDeliveryTo = parseFloat(deliveryTo) || 0;
  const numAreaFrom = parseFloat(areaFrom) || 0;
  const numAreaTo = parseFloat(areaTo) || 0;

  const uniqueCities = Array.from(new Set(partners.map((p) => p.location).filter(Boolean))).sort();
  const uniqueCerts = Array.from(new Set(partners.flatMap((p) => p.certificates || []))).sort();

  const citySuggestions = cityInput.trim()
    ? uniqueCities.filter((c) => c.toLowerCase().includes(cityInput.toLowerCase()) && !selectedCities.includes(c))
    : uniqueCities.filter((c) => !selectedCities.includes(c));

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) setSelectedCities([...selectedCities, city]);
    setCityInput("");
    setCityDropdownOpen(false);
  };

  // Блокируем скролл body когда bottom sheet открыт на мобилке
  useEffect(() => {
    if (filtersOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  const filterGridProps = {
    toggleArr,
    selectedMp, setSelectedMp,
    selectedSchemes, setSelectedSchemes,
    selectedFeatures, setSelectedFeatures,
    selectedSpecs, setSelectedSpecs,
    selectedPackaging, setSelectedPackaging,
    selectedCities, setSelectedCities,
    cityInput, setCityInput,
    cityDropdownOpen, setCityDropdownOpen,
    citySuggestions, addCity,
    storageFrom, setStorageFrom,
    storageTo, setStorageTo,
    assemblyFrom, setAssemblyFrom,
    assemblyTo, setAssemblyTo,
    deliveryFrom, setDeliveryFrom,
    deliveryTo, setDeliveryTo,
    areaFrom, setAreaFrom,
    areaTo, setAreaTo,
    uniqueCerts, selectedCerts, setSelectedCerts,
    minRating, setMinRating,
  };

  const filterChipsProps = {
    selectedMp, setSelectedMp,
    selectedSchemes, setSelectedSchemes,
    selectedFeatures, setSelectedFeatures,
    selectedSpecs, setSelectedSpecs,
    selectedPackaging, setSelectedPackaging,
    selectedCities, setSelectedCities,
    selectedCerts, setSelectedCerts,
    numStorageFrom, numStorageTo, setStorageFrom, setStorageTo,
    numAssemblyFrom, numAssemblyTo, setAssemblyFrom, setAssemblyTo,
    numDeliveryFrom, numDeliveryTo, setDeliveryFrom, setDeliveryTo,
    numAreaFrom, numAreaTo, setAreaFrom, setAreaTo,
    minRating, setMinRating,
    toggleArr,
  };

  return (
    <>
      {/* ── Sticky top bar (всегда) ── */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 shadow-sm">
        <FilterTopBar
          selectedMp={selectedMp} toggleArr={toggleArr} setSelectedMp={setSelectedMp}
          filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}
          activeFilterCount={activeFilterCount}
          showFavoritesOnly={showFavoritesOnly} onToggleFavoritesFilter={onToggleFavoritesFilter}
          sortBy={sortBy} setSortBy={setSortBy}
          filtered={filtered} partners={partners}
          onRequestQuoteMany={onRequestQuoteMany}
          compareList={compareList} onOpenCompare={onOpenCompare}
          clearAll={clearAll}
        />

        {/* ── Десктоп: раскрывается вниз под топбаром ── */}
        {filtersOpen && (
          <div className="hidden lg:block border-t border-gray-100 bg-gray-50 max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain">
            <FilterGrid {...filterGridProps} />
            {activeFilterCount > 0 && <FilterActiveChips {...filterChipsProps} />}
          </div>
        )}
      </div>

      {/* ── Мобилка: bottom sheet ── */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Затемнение фона */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />

          {/* Шторка */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
            {/* Ручка */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Заголовок */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="font-golos font-bold text-navy-900 text-base">
                Фильтры
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-gold-500 text-navy-950 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-400 hover:text-red-500 font-ibm transition-colors"
                  >
                    Сбросить
                  </button>
                )}
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Скроллируемый контент */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <FilterGrid {...filterGridProps} />
              {activeFilterCount > 0 && <FilterActiveChips {...filterChipsProps} />}
            </div>

            {/* Кнопка «Показать» */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-12 transition-colors"
              >
                Показать {filtered.length} {filtered.length === 1 ? "результат" : filtered.length < 5 ? "результата" : "результатов"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
