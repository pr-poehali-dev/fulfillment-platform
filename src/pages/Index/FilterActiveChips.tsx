import Icon from "@/components/ui/icon";
import { FEATURE_FILTERS, SPECIALIZATION_FILTERS } from "./data";

interface FilterActiveChipsProps {
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
  selectedCerts: string[];
  setSelectedCerts: (v: string[]) => void;
  numStorageFrom: number;
  numStorageTo: number;
  setStorageFrom: (v: string) => void;
  setStorageTo: (v: string) => void;
  numAssemblyFrom: number;
  numAssemblyTo: number;
  setAssemblyFrom: (v: string) => void;
  setAssemblyTo: (v: string) => void;
  numDeliveryFrom: number;
  numDeliveryTo: number;
  setDeliveryFrom: (v: string) => void;
  setDeliveryTo: (v: string) => void;
  numAreaFrom: number;
  numAreaTo: number;
  setAreaFrom: (v: string) => void;
  setAreaTo: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  toggleArr: <T>(arr: T[], val: T, set: (v: T[]) => void) => void;
}

export default function FilterActiveChips({
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
}: FilterActiveChipsProps) {
  const chipCls = "inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm";

  return (
    <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-gray-400 font-ibm">Активные:</span>

      {[
        ...selectedMp,
        ...selectedSchemes,
        ...selectedFeatures.map(f => FEATURE_FILTERS.find(x => x.key === f)?.label || f),
        ...selectedSpecs.map(s => SPECIALIZATION_FILTERS.find(x => x.key === s)?.label || s),
        ...selectedPackaging, ...selectedCities, ...selectedCerts,
      ].map((tag) => (
        <span key={tag} className={chipCls}>
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
        <span className={chipCls}>
          хранение {numStorageFrom > 0 ? `от ${numStorageFrom}` : ""}{numStorageFrom > 0 && numStorageTo > 0 ? " " : ""}{numStorageTo > 0 ? `до ${numStorageTo}` : ""} ₽
          <button onClick={() => { setStorageFrom(""); setStorageTo(""); }}><Icon name="X" size={9} /></button>
        </span>
      )}
      {(numAssemblyFrom > 0 || numAssemblyTo > 0) && (
        <span className={chipCls}>
          сборка {numAssemblyFrom > 0 ? `от ${numAssemblyFrom}` : ""}{numAssemblyFrom > 0 && numAssemblyTo > 0 ? " " : ""}{numAssemblyTo > 0 ? `до ${numAssemblyTo}` : ""} ₽
          <button onClick={() => { setAssemblyFrom(""); setAssemblyTo(""); }}><Icon name="X" size={9} /></button>
        </span>
      )}
      {(numDeliveryFrom > 0 || numDeliveryTo > 0) && (
        <span className={chipCls}>
          доставка {numDeliveryFrom > 0 ? `от ${numDeliveryFrom}` : ""}{numDeliveryFrom > 0 && numDeliveryTo > 0 ? " " : ""}{numDeliveryTo > 0 ? `до ${numDeliveryTo}` : ""} ₽
          <button onClick={() => { setDeliveryFrom(""); setDeliveryTo(""); }}><Icon name="X" size={9} /></button>
        </span>
      )}
      {(numAreaFrom > 0 || numAreaTo > 0) && (
        <span className={chipCls}>
          склад {numAreaFrom > 0 ? `от ${numAreaFrom.toLocaleString("ru-RU")}` : ""}{numAreaFrom > 0 && numAreaTo > 0 ? " " : ""}{numAreaTo > 0 ? `до ${numAreaTo.toLocaleString("ru-RU")}` : ""} м²
          <button onClick={() => { setAreaFrom(""); setAreaTo(""); }}><Icon name="X" size={9} /></button>
        </span>
      )}
      {minRating > 0 && (
        <span className={chipCls}>
          рейтинг от {minRating}
          <button onClick={() => setMinRating(0)}><Icon name="X" size={9} /></button>
        </span>
      )}
    </div>
  );
}