import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  FEATURE_FILTERS,
  SCHEME_FILTERS,
  PACKAGING_FILTERS,
  MARKETPLACE_FILTERS,
  SPECIALIZATION_FILTERS,
  type Partner,
} from "./data";

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
  maxFoundedYear: number;
  setMaxFoundedYear: (v: number) => void;
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

export default function CatalogFilterPanel({
  partners,
  filtered,
  activeFilterCount,
  clearAll,
  compareList,
  onOpenCompare,
  onRequestQuoteMany,
  showFavoritesOnly,
  onToggleFavoritesFilter,
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
  maxFoundedYear, setMaxFoundedYear,
  sortBy, setSortBy,
  filtersOpen, setFiltersOpen,
}: CatalogFilterPanelProps) {
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
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-2">
        {/* Quick MP filters (desktop) */}
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
            {filtered.length} из {partners.length}
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

            {/* City filter */}
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
                        <Icon name="X" size={9} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={cityInput}
                    placeholder={selectedCities.length === 0 ? "Введите город..." : ""}
                    onChange={(e) => { setCityInput(e.target.value); setCityDropdownOpen(true); }}
                    onFocus={() => setCityDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setCityDropdownOpen(false), 150)}
                    className="flex-1 min-w-[80px] text-xs font-ibm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                {cityDropdownOpen && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                    {citySuggestions.map((c) => (
                      <button key={c} onMouseDown={() => addCity(c)}
                        className="w-full text-left px-3 py-2 text-xs font-ibm text-gray-700 hover:bg-navy-50 transition-colors">
                        <Icon name="MapPin" size={10} className="inline mr-1.5 text-gray-400" />{c}
                      </button>
                    ))}
                  </div>
                )}
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
                  <input type="number" min={0} inputMode="numeric" value={storageFrom}
                    onChange={(e) => setStorageFrom(e.target.value)} placeholder="0"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
                </div>
                <span className="text-gray-300 text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                  <input type="number" min={0} inputMode="numeric" value={storageTo}
                    onChange={(e) => setStorageTo(e.target.value)} placeholder="∞"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
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
                  <input type="number" min={0} inputMode="numeric" value={assemblyFrom}
                    onChange={(e) => setAssemblyFrom(e.target.value)} placeholder="0"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
                </div>
                <span className="text-gray-300 text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                  <input type="number" min={0} inputMode="numeric" value={assemblyTo}
                    onChange={(e) => setAssemblyTo(e.target.value)} placeholder="∞"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
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
                  <input type="number" min={0} inputMode="numeric" value={deliveryFrom}
                    onChange={(e) => setDeliveryFrom(e.target.value)} placeholder="0"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
                </div>
                <span className="text-gray-300 text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                  <input type="number" min={0} inputMode="numeric" value={deliveryTo}
                    onChange={(e) => setDeliveryTo(e.target.value)} placeholder="∞"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
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
                  <input type="number" min={0} inputMode="numeric" value={areaFrom}
                    onChange={(e) => setAreaFrom(e.target.value)} placeholder="0"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
                </div>
                <span className="text-gray-300 text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
                  <input type="number" min={0} inputMode="numeric" value={areaTo}
                    onChange={(e) => setAreaTo(e.target.value)} placeholder="∞"
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
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
                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {uniqueCerts.map((cert) => (
                    <label key={cert} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleArr(selectedCerts, cert, setSelectedCerts)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedCerts.includes(cert) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
                        {selectedCerts.includes(cert) && <Icon name="Check" size={10} className="text-white" />}
                      </div>
                      <span className="text-xs text-gray-700 font-ibm"
                        onClick={() => toggleArr(selectedCerts, cert, setSelectedCerts)}>
                        {cert}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating filter */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
                <Icon name="Star" size={11} /> Минимальный рейтинг
              </div>
              <div className="flex gap-1.5">
                {[0, 3, 4, 4.5].map((r) => (
                  <button key={r}
                    onClick={() => setMinRating(r)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${minRating === r ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                    {r === 0 ? "Любой" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Active filter chips */}
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
  );
}
