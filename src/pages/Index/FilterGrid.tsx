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
  uniqueCerts: string[];
  selectedCerts: string[];
  setSelectedCerts: (v: string[]) => void;
  minRating: number;
  setMinRating: (v: number) => void;
}

const LABEL_CLS = "text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 font-ibm flex items-center gap-1";
const CHIP_BASE = "text-[11px] px-2 py-1 rounded border font-medium transition-all font-ibm";
const CHIP_ON = "bg-navy-900 text-white border-navy-900";
const CHIP_OFF = "bg-white text-gray-600 border-gray-200 hover:border-navy-400";

function SectionLabel({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div className={LABEL_CLS}>
      {icon && <Icon name={icon as "Star"} size={10} />}
      {children}
    </div>
  );
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
      <SectionLabel icon={icon}>{label}</SectionLabel>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 font-ibm uppercase">от</span>
          <input type="number" min={0} inputMode="numeric" value={from}
            onChange={(e) => setFrom(e.target.value)} placeholder="0"
            className="w-full pl-7 pr-1.5 py-1 border border-gray-200 rounded text-[11px] font-ibm bg-white focus:outline-none focus:ring-1 focus:ring-navy-900/20" />
        </div>
        <span className="text-gray-300 text-[10px]">—</span>
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 font-ibm uppercase">до</span>
          <input type="number" min={0} inputMode="numeric" value={to}
            onChange={(e) => setTo(e.target.value)} placeholder="∞"
            className="w-full pl-7 pr-1.5 py-1 border border-gray-200 rounded text-[11px] font-ibm bg-white focus:outline-none focus:ring-1 focus:ring-navy-900/20" />
        </div>
      </div>
    </div>
  );
}

function CheckboxList({ items, selected, onToggle, maxH = "max-h-52" }: {
  items: { key: string; label: string; icon?: string }[];
  selected: string[];
  onToggle: (key: string) => void;
  maxH?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${maxH} overflow-y-auto pr-0.5`}>
      {items.map((item) => (
        <label key={item.key} className="flex items-center gap-1.5 cursor-pointer group">
          <div
            onClick={() => onToggle(item.key)}
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selected.includes(item.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
            {selected.includes(item.key) && <Icon name="Check" size={9} className="text-white" />}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-700 font-ibm leading-tight"
            onClick={() => onToggle(item.key)}>
            {item.icon && <Icon name={item.icon as "Camera"} size={11} className="text-gray-400 flex-shrink-0" />}
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
  uniqueCerts, selectedCerts, setSelectedCerts,
  minRating, setMinRating,
}: FilterGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">

      {/* Marketplace (mobile only) */}
      <div className="lg:hidden">
        <SectionLabel>Маркетплейс</SectionLabel>
        <div className="flex flex-wrap gap-1">
          {MARKETPLACE_FILTERS.map((mp) => (
            <button key={mp} onClick={() => toggleArr(selectedMp, mp, setSelectedMp)}
              className={`${CHIP_BASE} ${selectedMp.includes(mp) ? CHIP_ON : CHIP_OFF}`}>
              {mp}
            </button>
          ))}
        </div>
      </div>

      {/* Work schemes */}
      <div>
        <SectionLabel>Схема работы</SectionLabel>
        <div className="flex flex-wrap gap-1">
          {SCHEME_FILTERS.map((s) => (
            <button key={s} onClick={() => toggleArr(selectedSchemes, s, setSelectedSchemes)}
              className={`${CHIP_BASE} ${selectedSchemes.includes(s) ? CHIP_ON : CHIP_OFF}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Features / services */}
      <div>
        <SectionLabel>Доп. услуги</SectionLabel>
        <CheckboxList
          items={FEATURE_FILTERS}
          selected={selectedFeatures}
          onToggle={(key) => toggleArr(selectedFeatures, key, setSelectedFeatures)}
        />
      </div>

      {/* Specializations */}
      <div>
        <SectionLabel icon="Target">Специализация</SectionLabel>
        <CheckboxList
          items={SPECIALIZATION_FILTERS}
          selected={selectedSpecs}
          onToggle={(key) => toggleArr(selectedSpecs, key, setSelectedSpecs)}
        />
      </div>

      {/* Packaging */}
      <div>
        <SectionLabel>Тип упаковки</SectionLabel>
        <CheckboxList
          items={PACKAGING_FILTERS.map((pk) => ({ key: pk, label: pk }))}
          selected={selectedPackaging}
          onToggle={(pk) => toggleArr(selectedPackaging, pk, setSelectedPackaging)}
        />
      </div>

      {/* City filter */}
      <div>
        <SectionLabel icon="MapPin">Город</SectionLabel>
        <div className="relative">
          <div className={`flex flex-wrap items-center gap-1 px-2 py-1 bg-white border rounded transition-all min-h-[30px] ${cityDropdownOpen ? "border-navy-400 ring-1 ring-navy-900/10" : "border-gray-200"}`}>
            {selectedCities.map((c) => (
              <span key={c} className="inline-flex items-center gap-0.5 bg-navy-900 text-white text-[10px] px-1.5 py-0.5 rounded font-ibm">
                {c}
                <button onClick={() => setSelectedCities(selectedCities.filter((x) => x !== c))}>
                  <Icon name="X" size={8} />
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
              className="flex-1 min-w-[80px] text-[11px] font-ibm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          {cityDropdownOpen && citySuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-36 overflow-y-auto">
              {citySuggestions.map((c) => (
                <button key={c} onMouseDown={() => addCity(c)}
                  className="w-full text-left px-2.5 py-1.5 text-[11px] font-ibm text-gray-700 hover:bg-navy-50 transition-colors flex items-center gap-1.5">
                  <Icon name="MapPin" size={10} className="text-gray-400" />{c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price ranges */}
      <RangeInput label="Хранение (₽/ед/день)" icon="Warehouse"
        from={storageFrom} setFrom={setStorageFrom} to={storageTo} setTo={setStorageTo} />
      <RangeInput label="Сборка (₽/заказ)" icon="Package"
        from={assemblyFrom} setFrom={setAssemblyFrom} to={assemblyTo} setTo={setAssemblyTo} />
      <RangeInput label="Доставка (₽/заказ)" icon="Truck"
        from={deliveryFrom} setFrom={setDeliveryFrom} to={deliveryTo} setTo={setDeliveryTo} />
      <RangeInput label="Площадь склада (м²)" icon="Maximize"
        from={areaFrom} setFrom={setAreaFrom} to={areaTo} setTo={setAreaTo} />

      {/* Certificates */}
      {uniqueCerts.length > 0 && (
        <div>
          <SectionLabel icon="Award">Сертификаты</SectionLabel>
          <CheckboxList
            items={uniqueCerts.map((c) => ({ key: c, label: c }))}
            selected={selectedCerts}
            onToggle={(key) => toggleArr(selectedCerts, key, setSelectedCerts)}
            maxH="max-h-28"
          />
        </div>
      )}

      {/* Rating filter */}
      <div>
        <SectionLabel icon="Star">Рейтинг</SectionLabel>
        <div className="flex gap-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)}
              className={`${CHIP_BASE} ${minRating === r ? CHIP_ON : CHIP_OFF}`}>
              {r === 0 ? "Любой" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
