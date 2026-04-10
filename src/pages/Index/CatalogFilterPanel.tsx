import { type Partner } from "./data";
import FilterTopBar from "./FilterTopBar";
import FilterGrid from "./FilterGrid";
import FilterActiveChips from "./FilterActiveChips";

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

  return (
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

      {filtersOpen && (
        <div className="border-t border-gray-100 bg-gray-50">
          <FilterGrid
            toggleArr={toggleArr}
            selectedMp={selectedMp} setSelectedMp={setSelectedMp}
            selectedSchemes={selectedSchemes} setSelectedSchemes={setSelectedSchemes}
            selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
            selectedSpecs={selectedSpecs} setSelectedSpecs={setSelectedSpecs}
            selectedPackaging={selectedPackaging} setSelectedPackaging={setSelectedPackaging}
            selectedCities={selectedCities} setSelectedCities={setSelectedCities}
            cityInput={cityInput} setCityInput={setCityInput}
            cityDropdownOpen={cityDropdownOpen} setCityDropdownOpen={setCityDropdownOpen}
            citySuggestions={citySuggestions} addCity={addCity}
            storageFrom={storageFrom} setStorageFrom={setStorageFrom}
            storageTo={storageTo} setStorageTo={setStorageTo}
            assemblyFrom={assemblyFrom} setAssemblyFrom={setAssemblyFrom}
            assemblyTo={assemblyTo} setAssemblyTo={setAssemblyTo}
            deliveryFrom={deliveryFrom} setDeliveryFrom={setDeliveryFrom}
            deliveryTo={deliveryTo} setDeliveryTo={setDeliveryTo}
            areaFrom={areaFrom} setAreaFrom={setAreaFrom}
            areaTo={areaTo} setAreaTo={setAreaTo}
            uniqueCerts={uniqueCerts} selectedCerts={selectedCerts} setSelectedCerts={setSelectedCerts}
            minRating={minRating} setMinRating={setMinRating}
          />

          {activeFilterCount > 0 && (
            <FilterActiveChips
              selectedMp={selectedMp} setSelectedMp={setSelectedMp}
              selectedSchemes={selectedSchemes} setSelectedSchemes={setSelectedSchemes}
              selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
              selectedSpecs={selectedSpecs} setSelectedSpecs={setSelectedSpecs}
              selectedPackaging={selectedPackaging} setSelectedPackaging={setSelectedPackaging}
              selectedCities={selectedCities} setSelectedCities={setSelectedCities}
              selectedCerts={selectedCerts} setSelectedCerts={setSelectedCerts}
              numStorageFrom={numStorageFrom} numStorageTo={numStorageTo}
              setStorageFrom={setStorageFrom} setStorageTo={setStorageTo}
              numAssemblyFrom={numAssemblyFrom} numAssemblyTo={numAssemblyTo}
              setAssemblyFrom={setAssemblyFrom} setAssemblyTo={setAssemblyTo}
              numDeliveryFrom={numDeliveryFrom} numDeliveryTo={numDeliveryTo}
              setDeliveryFrom={setDeliveryFrom} setDeliveryTo={setDeliveryTo}
              numAreaFrom={numAreaFrom} numAreaTo={numAreaTo}
              setAreaFrom={setAreaFrom} setAreaTo={setAreaTo}
              minRating={minRating} setMinRating={setMinRating}
              toggleArr={toggleArr}
            />
          )}
        </div>
      )}
    </div>
  );
}