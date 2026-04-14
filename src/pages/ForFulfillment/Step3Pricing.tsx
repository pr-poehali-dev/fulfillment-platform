import Icon from "@/components/ui/icon";

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 placeholder:text-gray-400";

export interface Step3Props {
  storagePrice: string;  setStoragePrice: (v: string) => void;
  assemblyPrice: string; setAssemblyPrice: (v: string) => void;
  deliveryPrice: string; setDeliveryPrice: (v: string) => void;
  minVolume: string;     setMinVolume: (v: string) => void;
  hasTrial: boolean;     setHasTrial: (v: boolean) => void;
}

export default function Step3Pricing({ storagePrice, setStoragePrice, assemblyPrice, setAssemblyPrice, deliveryPrice, setDeliveryPrice, minVolume, setMinVolume, hasTrial, setHasTrial }: Step3Props) {
  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2.5">
        <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 font-ibm leading-relaxed">
          Укажите стартовые тарифы — они отображаются как «от» в каталоге. Точная стоимость согласовывается с каждым клиентом индивидуально.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Хранение",      suffix: "₽/ед/день", value: storagePrice,  set: setStoragePrice,  placeholder: "12" },
          { label: "Сборка заказа", suffix: "₽/заказ",   value: assemblyPrice, set: setAssemblyPrice, placeholder: "18" },
          { label: "Доставка",      suffix: "₽/заказ",   value: deliveryPrice, set: setDeliveryPrice, placeholder: "85" },
        ].map(({ label, suffix, value, set, placeholder }) => (
          <div key={label}>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
              {label} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input value={value} onChange={(e) => set(e.target.value)}
                placeholder={placeholder} type="number"
                className={`${inputCls} pr-24`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-ibm whitespace-nowrap">{suffix}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Минимальный объём (SKU)</label>
        <input value={minVolume} onChange={(e) => setMinVolume(e.target.value)}
          placeholder="200 (оставьте пустым, если минимума нет)"
          type="number" className={inputCls} />
      </div>

      <label className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
        <div
          onClick={() => setHasTrial(!hasTrial)}
          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            hasTrial ? "bg-emerald-600 border-emerald-600" : "bg-white border-gray-300"
          }`}
        >
          {hasTrial && <Icon name="Check" size={12} className="text-white" />}
        </div>
        <div onClick={() => setHasTrial(!hasTrial)}>
          <div className="font-golos font-bold text-emerald-800 text-sm">Предоставляем пробный период</div>
          <div className="text-xs text-emerald-600 font-ibm mt-0.5">
            Это значительно увеличивает конверсию — клиенты могут проверить качество до долгосрочного договора.
          </div>
        </div>
      </label>
    </div>
  );
}
