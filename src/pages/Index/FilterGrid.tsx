import Icon from "@/components/ui/icon";
import {
  FEATURE_FILTERS,
  SCHEME_FILTERS,
  PACKAGING_FILTERS,
  MARKETPLACE_FILTERS,
  SPECIALIZATION_FILTERS,
} from "./data";

interface FilterGridProps {
  toggleArr: <T>(arr: T[], val: T, set: (v: T[]) => void) => void;
  selectedMp: string[];
  setSelectedMp: (v: string[]) => void;
  selectedSchemes: string[];
  setSelectedSchemes: (v: string[]) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (v: string[]) => void;
  selectedSpecs: string[];
  setSelectedSpecs: (v: string[]) => void;
  selectedPackaging: string[];
  setSelectedPackaging: (v: string[]) => void;
  selectedCities: string[];
  setSelectedCities: (v: string[]) => void;
  cityInput: string;
  setCityInput: (v: string) => void;
  cityDropdownOpen: boolean;
  setCityDropdownOpen: (v: boolean) => void;
  citySuggestions: string[];
  addCity: (city: string) => void;
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
  maxFoundedYear: number;
  setMaxFoundedYear: (v: number) => void;
  uniqueCerts: string[];
  selectedCerts: string[];
  setSelectedCerts: (v: string[]) => void;
  minRating: number;
  setMinRating: (v: number) => void;
}

function RangeInput({ label, icon, from, setFrom, to, setTo }: {
  label: string;
  icon: string;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
        <Icon name={icon as "Warehouse"} size={11} /> {label}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">от</span>
          <input type="number" min={0} inputMode="numeric" value={from}
            onChange={(e) => setFrom(e.target.value)} placeholder="0"
            className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
        </div>
        <span className="text-gray-300 text-xs">—</span>
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-ibm uppercase">до</span>
          <input type="number" min={0} inputMode="numeric" value={to}
            onChange={(e) => setTo(e.target.value)} placeholder="∞"
            className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/15" />
        </div>
      </div>
    </div>
  );
}

function CheckboxList({ items, selected, onToggle, maxH = "max-h-64" }: {
  items: { key: string; label: string; icon?: string }[];
  selected: string[];
  onToggle: (key: string) => void;
  maxH?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${maxH} overflow-y-auto pr-1`}>
      {items.map((item) => (
        <label key={item.key} className="flex items-center gap-2 cursor-pointer group">
          <div
            onClick={() => onToggle(item.key)}
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selected.includes(item.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
            {selected.includes(item.key) && <Icon name="Check" size={10} className="text-white" />}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-ibm"
            onClick={() => onToggle(item.key)}>
            {item.icon && <Icon name={item.icon as "Camera"} size={12} className="text-gray-400 flex-shrink-0" />}
            {item.label}
          </div>
        </label>
      ))}
    </div>
  );
}

export default function FilterGrid({
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
  maxFoundedYear, setMaxFoundedYear,
  uniqueCerts, selectedCerts, setSelectedCerts,
  minRating, setMinRating,
}: FilterGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Marketplace (mobile only) */}
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
        <CheckboxList
          items={FEATURE_FILTERS}
          selected={selectedFeatures}
          onToggle={(key) => toggleArr(selectedFeatures, key, setSelectedFeatures)}
        />
      </div>

      {/* Specializations */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-ibm flex items-center gap-1">
          <Icon name="Target" size={11} /> Специализация
        </div>
        <CheckboxList
          items={SPECIALIZATION_FILTERS}
          selected={selectedSpecs}
          onToggle={(key) => toggleArr(selectedSpecs, key, setSelectedSpecs)}
        />
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

      {/* Price ranges */}
      <RangeInput label="Цена хранения (₽/ед/день)" icon="Warehouse"
        from={storageFrom} setFrom={setStorageFrom} to={storageTo} setTo={setStorageTo} />
      <RangeInput label="Цена сборки (₽/заказ)" icon="Package"
        from={assemblyFrom} setFrom={setAssemblyFrom} to={assemblyTo} setTo={setAssemblyTo} />
      <RangeInput label="Цена доставки (₽/заказ)" icon="Truck"
        from={deliveryFrom} setFrom={setDeliveryFrom} to={deliveryTo} setTo={setDeliveryTo} />
      <RangeInput label="Площадь склада (м²)" icon="Maximize"
        from={areaFrom} setFrom={setAreaFrom} to={areaTo} setTo={setAreaTo} />

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
          <CheckboxList
            items={uniqueCerts.map((c) => ({ key: c, label: c }))}
            selected={selectedCerts}
            onToggle={(key) => toggleArr(selectedCerts, key, setSelectedCerts)}
            maxH="max-h-32"
          />
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
  );
}
