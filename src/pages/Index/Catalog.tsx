import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import { FEATURE_FILTERS, SCHEME_FILTERS, PACKAGING_FILTERS, MARKETPLACE_FILTERS, SPECIALIZATION_FILTERS, type Partner } from "./data";

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

  // Уникальные города и сертификаты из профилей
  const uniqueCities = Array.from(new Set(PARTNERS.map((p) => p.location).filter(Boolean))).sort();
  const uniqueCerts = Array.from(new Set(PARTNERS.flatMap((p) => p.certificates || []))).sort();

  const citySuggestions = cityInput.trim()
    ? uniqueCities.filter((c) => c.toLowerCase().includes(cityInput.toLowerCase()) && !selectedCities.includes(c))
    : uniqueCities.filter((c) => !selectedCities.includes(c));

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) setSelectedCities([...selectedCities, city]);
    setCityInput("");
    setCityDropdownOpen(false);
  };

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

  // Hint to keep setActive referenced (preserves prop interface)
  void setActive;

  return (
    <section id="catalog" className="bg-white">
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-2">
          {/* Quick MP filters */}
          <div className="hidden lg:flex items-center gap-1.5">
            {MARKETPLACE_FILTERS.map((mp) => (
              <button key={mp}
                onClick={() => toggleArr(selectedMp, mp, setSelectedMp)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${selectedMp.includes(mp) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                {mp}
              </button>
            ))}
          </div>

          {/* All filters button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border font-medium transition-all ${filtersOpen || activeFilterCount > 0 ? "bg-navy-900 text-white border-navy-900" : "border-gray-200 text-gray-600 hover:border-navy-400"}`}
          >
            <Icon name="SlidersHorizontal" size={14} />
            Фильтры
            {activeFilterCount > 0 && (
              <span className="bg-gold-500 text-navy-950 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Favorites only */}
          <button
            onClick={onToggleFavoritesFilter}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border font-medium transition-all ${showFavoritesOnly ? "bg-red-50 text-red-600 border-red-200" : "border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"}`}
          >
            <Icon name="Heart" size={14} className={showFavoritesOnly ? "fill-current" : ""} />
            <span className="hidden sm:inline">Избранное</span>
          </button>

          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white font-ibm focus:outline-none cursor-pointer text-gray-700">
            <option value="rating">По рейтингу</option>
            <option value="reviews">По отзывам</option>
            <option value="price_asc">Дешевле</option>
            <option value="price_desc">Дороже</option>
            <option value="name">По названию</option>
          </select>

          {/* Results count + compare btn */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-ibm whitespace-nowrap">
              {filtered.length} из {PARTNERS.length}
            </span>
            {filtered.length > 0 && (activeFilterCount > 0 || showFavoritesOnly) && (
              <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold h-8 text-xs"
                onClick={() => onRequestQuoteMany(filtered)}>
                <Icon name="Send" size={13} className="mr-1" />
                Запросить КП {filtered.length > 1 ? `у ${filtered.length}` : ""}
              </Button>
            )}
            {compareList.length > 0 && (
              <Button size="sm" className="bg-navy-900 hover:bg-navy-800 text-white font-semibold h-8 text-xs" onClick={onOpenCompare}>
                <Icon name="GitCompare" size={13} className="mr-1" />
                Сравнить {compareList.length}
                {compareList.length < 3 && <span className="ml-1 opacity-60">/ 3</span>}
              </Button>
            )}
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-0.5 transition-colors">
                <Icon name="X" size={12} />Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Expanded filter panel */}
        {filtersOpen && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Marketplace (mobile) */}
              <div className="lg:hidden">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm">Маркетплейс</div>
                <div className="flex flex-wrap gap-1.5">
                  {MARKETPLACE_FILTERS.map((mp) => (
                    <button key={mp}
                      onClick={() => toggleArr(selectedMp, mp, setSelectedMp)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${selectedMp.includes(mp) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200"}`}>
                      {mp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work schemes */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm">Схема работы</div>
                <div className="flex flex-wrap gap-1.5">
                  {SCHEME_FILTERS.map((s) => (
                    <button key={s}
                      onClick={() => toggleArr(selectedSchemes, s, setSelectedSchemes)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${selectedSchemes.includes(s) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features / services */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm">Дополнительные услуги</div>
                <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {FEATURE_FILTERS.map((f) => (
                    <label key={f.key} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleArr(selectedFeatures, f.key, setSelectedFeatures)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedFeatures.includes(f.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
                        {selectedFeatures.includes(f.key) && <Icon name="Check" size={10} className="text-white" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-ibm"
                        onClick={() => toggleArr(selectedFeatures, f.key, setSelectedFeatures)}>
                        <Icon name={f.icon as "Camera"} size={12} className="text-gray-400 flex-shrink-0" />
                        {f.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Target" size={11} /> Специализация
                </div>
                <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {SPECIALIZATION_FILTERS.map((s) => (
                    <label key={s.key} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleArr(selectedSpecs, s.key, setSelectedSpecs)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedSpecs.includes(s.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
                        {selectedSpecs.includes(s.key) && <Icon name="Check" size={10} className="text-white" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-ibm"
                        onClick={() => toggleArr(selectedSpecs, s.key, setSelectedSpecs)}>
                        <Icon name={s.icon as "Boxes"} size={12} className="text-gray-400 flex-shrink-0" />
                        {s.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Packaging */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm">Тип упаковки</div>
                <div className="flex flex-col gap-1.5">
                  {PACKAGING_FILTERS.map((pk) => (
                    <label key={pk} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleArr(selectedPackaging, pk, setSelectedPackaging)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedPackaging.includes(pk) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
                        {selectedPackaging.includes(pk) && <Icon name="Check" size={10} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-700 font-ibm"
                        onClick={() => toggleArr(selectedPackaging, pk, setSelectedPackaging)}>
                        {pk}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City filter — input with autocomplete */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="MapPin" size={11} /> Город
                </div>
                <div className="relative">
                  <div className={`flex flex-wrap items-center gap-1 px-2 py-1.5 bg-white border rounded-lg transition-all min-h-[34px] ${cityDropdownOpen ? "border-navy-400 ring-2 ring-navy-900/10" : "border-gray-200"}`}>
                    {selectedCities.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded font-ibm">
                        {c}
                        <button onClick={() => setSelectedCities(selectedCities.filter((x) => x !== c))}>
                          <Icon name="X" size={10} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => { setCityInput(e.target.value); setCityDropdownOpen(true); }}
                      onFocus={() => setCityDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setCityDropdownOpen(false), 150)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && citySuggestions[0]) { e.preventDefault(); addCity(citySuggestions[0]); }
                        if (e.key === "Backspace" && !cityInput && selectedCities.length > 0) {
                          setSelectedCities(selectedCities.slice(0, -1));
                        }
                      }}
                      placeholder={selectedCities.length === 0 ? "Начните вводить..." : ""}
                      className="flex-1 min-w-[80px] text-xs font-ibm bg-transparent focus:outline-none"
                    />
                  </div>
                  {cityDropdownOpen && citySuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                      {citySuggestions.slice(0, 20).map((city) => (
                        <button
                          key={city}
                          onMouseDown={(e) => { e.preventDefault(); addCity(city); }}
                          className="w-full text-left px-3 py-1.5 text-xs font-ibm text-gray-700 hover:bg-navy-50 flex items-center gap-1.5"
                        >
                          <Icon name="MapPin" size={10} className="text-gray-400" />
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Min rating */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Star" size={11} /> Мин. рейтинг
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button key={r}
                      onClick={() => setMinRating(r)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${minRating === r ? "bg-gold-500 text-navy-950 border-gold-500" : "bg-white text-gray-600 border-gray-200 hover:border-gold-400"}`}>
                      {r === 0 ? "Любой" : `от ${r}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage rate range */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Warehouse" size={11} /> Цена хранения (₽/ед/день)
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">от</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={storageFrom}
                      onChange={(e) => setStorageFrom(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                  <span className="text-gray-300 text-xs">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={storageTo}
                      onChange={(e) => setStorageTo(e.target.value)}
                      placeholder="∞"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                </div>
              </div>

              {/* Assembly rate range */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Package" size={11} /> Цена сборки (₽/заказ)
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">от</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={assemblyFrom}
                      onChange={(e) => setAssemblyFrom(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                  <span className="text-gray-300 text-xs">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={assemblyTo}
                      onChange={(e) => setAssemblyTo(e.target.value)}
                      placeholder="∞"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery rate range */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Truck" size={11} /> Цена доставки (₽/заказ)
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">от</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={deliveryFrom}
                      onChange={(e) => setDeliveryFrom(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                  <span className="text-gray-300 text-xs">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={deliveryTo}
                      onChange={(e) => setDeliveryTo(e.target.value)}
                      placeholder="∞"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                </div>
              </div>

              {/* Warehouse area range */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Maximize" size={11} /> Площадь склада (м²)
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">от</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={areaFrom}
                      onChange={(e) => setAreaFrom(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                  <span className="text-gray-300 text-xs">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={areaTo}
                      onChange={(e) => setAreaTo(e.target.value)}
                      placeholder="∞"
                      className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15"
                    />
                  </div>
                </div>
              </div>

              {/* Founded year */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                  <Icon name="Calendar" size={11} /> Опыт работы
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { year: 0, label: "Любой" },
                    { year: new Date().getFullYear() - 1, label: "1+ год" },
                    { year: new Date().getFullYear() - 3, label: "3+ года" },
                    { year: new Date().getFullYear() - 5, label: "5+ лет" },
                    { year: new Date().getFullYear() - 10, label: "10+ лет" },
                  ].map((o) => (
                    <button key={o.year}
                      onClick={() => setMaxFoundedYear(o.year)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${maxFoundedYear === o.year ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              {uniqueCerts.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                    <Icon name="Award" size={11} /> Сертификаты
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                    {uniqueCerts.map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer group">
                        <div
                          onClick={() => toggleArr(selectedCerts, c, setSelectedCerts)}
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedCerts.includes(c) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
                          {selectedCerts.includes(c) && <Icon name="Check" size={10} className="text-white" />}
                        </div>
                        <span className="text-sm text-gray-700 font-ibm"
                          onClick={() => toggleArr(selectedCerts, c, setSelectedCerts)}>
                          {c}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Active filters chips */}
            {activeFilterCount > 0 && (
              <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400 font-ibm">Активные:</span>
                {[
                  ...selectedMp,
                  ...selectedSchemes,
                  ...selectedFeatures.map(f => FEATURE_FILTERS.find(x => x.key === f)?.label || f),
                  ...selectedSpecs.map(s => SPECIALIZATION_FILTERS.find(x => x.key === s)?.label || s),
                  ...selectedPackaging, ...selectedCities, ...selectedCerts,
                ].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    {tag}
                    <button onClick={() => {
                      if (selectedMp.includes(tag)) toggleArr(selectedMp, tag, setSelectedMp);
                      if (selectedSchemes.includes(tag)) toggleArr(selectedSchemes, tag, setSelectedSchemes);
                      const featureKey = FEATURE_FILTERS.find(f => f.label === tag)?.key;
                      if (featureKey) toggleArr(selectedFeatures, featureKey, setSelectedFeatures);
                      const specKey = SPECIALIZATION_FILTERS.find(s => s.label === tag)?.key;
                      if (specKey) toggleArr(selectedSpecs, specKey, setSelectedSpecs);
                      if (selectedPackaging.includes(tag)) toggleArr(selectedPackaging, tag, setSelectedPackaging);
                      if (selectedCities.includes(tag)) toggleArr(selectedCities, tag, setSelectedCities);
                      if (selectedCerts.includes(tag)) toggleArr(selectedCerts, tag, setSelectedCerts);
                    }}>
                      <Icon name="X" size={9} />
                    </button>
                  </span>
                ))}
                {(numStorageFrom > 0 || numStorageTo > 0) && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    хранение {numStorageFrom > 0 ? `от ${numStorageFrom}` : ""}{numStorageFrom > 0 && numStorageTo > 0 ? " " : ""}{numStorageTo > 0 ? `до ${numStorageTo}` : ""} ₽
                    <button onClick={() => { setStorageFrom(""); setStorageTo(""); }}><Icon name="X" size={9} /></button>
                  </span>
                )}
                {(numAssemblyFrom > 0 || numAssemblyTo > 0) && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    сборка {numAssemblyFrom > 0 ? `от ${numAssemblyFrom}` : ""}{numAssemblyFrom > 0 && numAssemblyTo > 0 ? " " : ""}{numAssemblyTo > 0 ? `до ${numAssemblyTo}` : ""} ₽
                    <button onClick={() => { setAssemblyFrom(""); setAssemblyTo(""); }}><Icon name="X" size={9} /></button>
                  </span>
                )}
                {(numDeliveryFrom > 0 || numDeliveryTo > 0) && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    доставка {numDeliveryFrom > 0 ? `от ${numDeliveryFrom}` : ""}{numDeliveryFrom > 0 && numDeliveryTo > 0 ? " " : ""}{numDeliveryTo > 0 ? `до ${numDeliveryTo}` : ""} ₽
                    <button onClick={() => { setDeliveryFrom(""); setDeliveryTo(""); }}><Icon name="X" size={9} /></button>
                  </span>
                )}
                {(numAreaFrom > 0 || numAreaTo > 0) && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    склад {numAreaFrom > 0 ? `от ${numAreaFrom.toLocaleString("ru-RU")}` : ""}{numAreaFrom > 0 && numAreaTo > 0 ? " " : ""}{numAreaTo > 0 ? `до ${numAreaTo.toLocaleString("ru-RU")}` : ""} м²
                    <button onClick={() => { setAreaFrom(""); setAreaTo(""); }}><Icon name="X" size={9} /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    рейтинг от {minRating}
                    <button onClick={() => setMinRating(0)}><Icon name="X" size={9} /></button>
                  </span>
                )}
                {maxFoundedYear > 0 && (
                  <span className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    опыт от {new Date().getFullYear() - maxFoundedYear} лет
                    <button onClick={() => setMaxFoundedYear(0)}><Icon name="X" size={9} /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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

function PartnerCard({ p, inCompare, onCompare, isFavorite, onToggleFavorite, onOpenDetail, onRequestQuote }: {
  p: Partner;
  inCompare: boolean;
  onCompare: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetail: () => void;
  onRequestQuote: () => void;
}) {
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

// ─── COMPARE PAGE (fullscreen overlay) ───────────────────────────────────────

export function ComparePage({ compareList, setCompareList, onClose, partners }: {
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  partners: Partner[];
}) {
  const selected = compareList.slice(0, 3).map((id) => partners.find((p) => p.id === id)!).filter(Boolean);

  const featureDefs = [
    { key: "cameras", label: "Видеонаблюдение", icon: "Camera", color: "text-blue-500" },
    { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle", color: "text-red-500" },
    { key: "returns", label: "Работа с возвратами", icon: "RefreshCw", color: "text-emerald-500" },
    { key: "same_day", label: "Доставка день в день", icon: "Zap", color: "text-amber-500" },
    { key: "temp_control", label: "Температурный режим", icon: "Thermometer", color: "text-cyan-500" },
    { key: "packaging", label: "Упаковка", icon: "Package", color: "text-purple-500" },
  ];

  const rows: { label: string; render: (p: Partner) => React.ReactNode }[] = [
    { label: "Рейтинг", render: (p) => (
      <div className="flex items-center gap-1.5">
        <StarRating rating={p.rating} size={13} />
        <span className="font-golos font-bold text-navy-900">{p.rating}</span>
        <span className="text-xs text-gray-400">({p.reviews})</span>
      </div>
    )},
    { label: "Город", render: (p) => (
      <span className="flex items-center gap-1 text-sm font-ibm text-navy-900">
        <Icon name="MapPin" size={12} className="text-gray-400" />{p.location}
      </span>
    )},
    { label: "Мин. объём", render: (p) => <span className="text-sm font-ibm text-navy-900">{p.minVolume}</span> },
    { label: "Схемы работы", render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.workSchemes.map((s) => <span key={s} className="text-xs px-2 py-0.5 bg-navy-900 text-white rounded font-ibm font-medium">{s}</span>)}
      </div>
    )},
    { label: "Маркетплейсы", render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>)}
      </div>
    )},
    { label: "Хранение", render: (p) => (
      <div>
        <span className="font-golos font-bold text-navy-900">{p.storage}</span>
      </div>
    )},
    { label: "Сборка заказа", render: (p) => (
      <span className="font-golos font-bold text-navy-900">{p.assembly}</span>
    )},
    { label: "Доставка", render: (p) => (
      <span className="font-golos font-bold text-navy-900">{p.delivery}</span>
    )},
    { label: "Упаковка", render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.packagingTypes.map((pk) => <span key={pk} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-ibm">{pk}</span>)}
      </div>
    )},
    { label: "Дополнительные услуги", render: (p) => (
      <div className="flex flex-col gap-1.5">
        {featureDefs.map((f) => (
          <div key={f.key} className={`flex items-center gap-1.5 text-xs font-ibm ${p.features.includes(f.key) ? "text-gray-700" : "text-gray-300"}`}>
            <Icon name={f.icon as "Camera"} size={12} className={p.features.includes(f.key) ? f.color : "text-gray-300"} />
            {f.label}
            {p.features.includes(f.key)
              ? <Icon name="Check" size={11} className="text-emerald-500 ml-auto" />
              : <Icon name="Minus" size={11} className="text-gray-300 ml-auto" />}
          </div>
        ))}
      </div>
    )},
  ];

  const removePartner = (id: number) => setCompareList((prev) => prev.filter((x) => x !== id));

  // Best values highlight
  const cheapestStorage = Math.min(...selected.map((p) => p.storageRate));
  const cheapestAssembly = Math.min(...selected.map((p) => p.assemblyRate));
  const cheapestDelivery = Math.min(...selected.map((p) => p.deliveryRate));
  const highestRating = Math.max(...selected.map((p) => p.rating));

  const colCount = selected.length;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={13} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-navy-900 hidden sm:inline">FulfillHub</span>
          </div>
          <div className="h-5 w-px bg-gray-200" />
          <Icon name="GitCompare" size={16} className="text-navy-700" />
          <span className="font-golos font-bold text-navy-900">Сравнение партнёров</span>
          <span className="text-xs bg-navy-100 text-navy-700 px-2 py-0.5 rounded font-ibm">{selected.length} из 3</span>
          <button onClick={onClose} className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors font-ibm">
            <Icon name="X" size={16} />
            <span className="hidden sm:inline">Закрыть</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {selected.length < 2 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="GitCompare" size={28} className="text-navy-300" />
              </div>
              <h3 className="font-golos font-bold text-xl text-navy-900 mb-2">Добавьте минимум 2 партнёра</h3>
              <p className="text-gray-500 font-ibm text-sm mb-5">Вернитесь в каталог и отметьте партнёров для сравнения</p>
              <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos" onClick={onClose}>
                <Icon name="ArrowLeft" size={15} className="mr-1.5" />Вернуться в каталог
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                {/* Partner headers */}
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-white border border-gray-100 rounded-tl-xl w-44 align-bottom">
                      <span className="text-xs text-gray-400 font-ibm font-normal uppercase tracking-wide">Параметр</span>
                    </th>
                    {selected.map((p, idx) => (
                      <th key={p.id} className={`p-4 bg-white border border-gray-100 align-top text-left ${idx === selected.length - 1 ? "rounded-tr-xl" : ""}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 bg-navy-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{p.logo}</div>
                            <div>
                              <div className="font-golos font-black text-navy-900 text-base leading-tight">{p.name}</div>
                              <div className="text-xs text-gray-400 font-ibm flex items-center gap-0.5 mt-0.5">
                                <Icon name="MapPin" size={10} />{p.location}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removePartner(p.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5" title="Убрать из сравнения">
                            <Icon name="X" size={15} />
                          </button>
                        </div>
                        <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
                      </th>
                    ))}
                    {/* Empty placeholder if < 3 */}
                    {colCount < 3 && (
                      <th className="p-4 bg-gray-50/60 border border-dashed border-gray-200 rounded-tr-xl align-middle text-center">
                        <div className="text-gray-300 font-ibm text-xs">
                          <Icon name="Plus" size={20} className="mx-auto mb-1 opacity-40" />
                          Добавить<br />партнёра
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Data rows */}
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                      <td className="p-4 border border-gray-100 text-xs font-semibold text-gray-500 font-ibm uppercase tracking-wide align-top whitespace-nowrap">
                        {row.label}
                      </td>
                      {selected.map((p) => {
                        // Highlight best prices
                        const isBestStorage = row.label === "Хранение" && p.storageRate === cheapestStorage;
                        const isBestAssembly = row.label === "Сборка заказа" && p.assemblyRate === cheapestAssembly;
                        const isBestDelivery = row.label === "Доставка" && p.deliveryRate === cheapestDelivery;
                        const isBestRating = row.label === "Рейтинг" && p.rating === highestRating;
                        const isBest = (isBestStorage || isBestAssembly || isBestDelivery || isBestRating) && selected.length > 1;
                        return (
                          <td key={p.id} className={`p-4 border border-gray-100 align-top relative ${isBest ? "bg-emerald-50/60" : ""}`}>
                            {isBest && (
                              <span className="absolute top-2 right-2 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded font-ibm font-medium">
                                Лучший
                              </span>
                            )}
                            {row.render(p)}
                          </td>
                        );
                      })}
                      {colCount < 3 && <td className="p-4 border border-dashed border-gray-200 bg-gray-50/30" />}
                    </tr>
                  ))}
                </tbody>

                {/* CTA row */}
                <tfoot>
                  <tr>
                    <td className="p-4 border border-gray-100 rounded-bl-xl bg-white" />
                    {selected.map((p, idx) => (
                      <td key={p.id} className={`p-4 border border-gray-100 bg-white ${idx === selected.length - 1 && colCount === 3 ? "rounded-br-xl" : ""}`}>
                        <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-9 text-sm">
                          <Icon name="Send" size={13} className="mr-1.5" />Запросить КП
                        </Button>
                      </td>
                    ))}
                    {colCount < 3 && (
                      <td className="p-4 border border-dashed border-gray-200 bg-gray-50/30 rounded-br-xl">
                        <button onClick={onClose} className="w-full h-9 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 font-ibm hover:border-navy-300 hover:text-navy-500 transition-colors">
                          + Добавить
                        </button>
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}