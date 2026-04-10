import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_FILTERS, type Partner } from "./data";

interface FilterTopBarProps {
  selectedMp: string[];
  toggleArr: <T>(arr: T[], val: T, set: (v: T[]) => void) => void;
  setSelectedMp: (v: string[]) => void;
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
  activeFilterCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  filtered: Partner[];
  partners: Partner[];
  onRequestQuoteMany: (ids: Partner[]) => void;
  compareList: number[];
  onOpenCompare: () => void;
  clearAll: () => void;
}

export default function FilterTopBar({
  selectedMp, toggleArr, setSelectedMp,
  filtersOpen, setFiltersOpen,
  activeFilterCount,
  showFavoritesOnly, onToggleFavoritesFilter,
  sortBy, setSortBy,
  filtered, partners,
  onRequestQuoteMany,
  compareList, onOpenCompare,
  clearAll,
}: FilterTopBarProps) {
  return (
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
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border font-medium transition-all relative
          ${filtersOpen || activeFilterCount > 0
            ? "bg-navy-900 text-white border-navy-900"
            : "border-gray-200 text-gray-600 hover:border-navy-400 animate-pulse-subtle"}`}
      >
        <Icon name="SlidersHorizontal" size={14} className={!filtersOpen && activeFilterCount === 0 ? "animate-wiggle" : ""} />
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

      {/* Results count + action buttons */}
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
  );
}