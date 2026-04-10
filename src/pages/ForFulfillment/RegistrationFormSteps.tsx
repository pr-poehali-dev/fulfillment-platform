import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { STEPS } from "./RegistrationFormStepper";

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 placeholder:text-gray-400";

// ─── Step 1 ───────────────────────────────────────────────────────────────────

interface Step1Props {
  companyName: string; setCompanyName: (v: string) => void;
  inn: string;         setInn: (v: string) => void;
  city: string;        setCity: (v: string) => void;
  foundedYear: string; setFoundedYear: (v: string) => void;
  warehouseArea: string; setWarehouseArea: (v: string) => void;
  description: string; setDescription: (v: string) => void;
}

function Step1({ companyName, setCompanyName, inn, setInn, city, setCity, foundedYear, setFoundedYear, warehouseArea, setWarehouseArea, description, setDescription }: Step1Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
            Название компании <span className="text-red-400">*</span>
          </label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            placeholder='ООО "Мой Склад"' className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
            ИНН <span className="text-red-400">*</span>
          </label>
          <input value={inn} onChange={(e) => setInn(e.target.value)}
            placeholder="7712345678" maxLength={12} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
            Город склада <span className="text-red-400">*</span>
          </label>
          <input value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="Москва" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Год основания</label>
          <input value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)}
            placeholder="2018" maxLength={4} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Площадь склада (м²)</label>
        <input value={warehouseArea} onChange={(e) => setWarehouseArea(e.target.value)}
          placeholder="10 000" type="number" className={inputCls} />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">О компании</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          rows={4} placeholder="Расскажите о вашем сервисе, специализации и преимуществах..."
          className={`${inputCls} resize-none`} />
        <div className="text-xs text-gray-400 font-ibm mt-1">{description.length} / 500 символов</div>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

interface Step2Props {
  schemes: string[];      toggleScheme: (v: string) => void;
  features: string[];     toggleFeature: (v: string) => void;
  packaging: string[];    togglePackaging: (v: string) => void;
  marketplaces: string[]; toggleMarketplace: (v: string) => void;
}

function Step2({ schemes, toggleScheme, features, toggleFeature, packaging, togglePackaging, marketplaces, toggleMarketplace }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">
          Схемы работы <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {["FBS", "FBO", "DBS", "Экспресс-доставка"].map((s) => (
            <button key={s} onClick={() => toggleScheme(s)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all font-golos ${
                schemes.includes(s)
                  ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">
          Маркетплейсы <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Ali", "Lamoda", "Свой интернет-магазин"].map((mp) => (
            <button key={mp} onClick={() => toggleMarketplace(mp)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                marketplaces.includes(mp)
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
              }`}>
              {mp}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">Дополнительные услуги</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: "cameras",       label: "Видеонаблюдение на складе", icon: "Camera"        },
            { key: "dangerous",     label: "Опасные грузы",             icon: "AlertTriangle" },
            { key: "returns",       label: "Обработка возвратов",       icon: "RefreshCw"     },
            { key: "same_day",      label: "Доставка день в день",      icon: "Zap"           },
            { key: "temp_control",  label: "Температурный режим",       icon: "Thermometer"   },
            { key: "marking",       label: "Маркировка товаров",        icon: "Tag"           },
            { key: "photo",         label: "Фотосъёмка товаров",        icon: "Camera"        },
            { key: "assembly_kits", label: "Комплектация наборов",      icon: "Boxes"         },
          ].map((f) => (
            <label key={f.key}
              className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${
                features.includes(f.key) ? "border-navy-200 bg-navy-50/50" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                onClick={() => toggleFeature(f.key)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  features.includes(f.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300"
                }`}
              >
                {features.includes(f.key) && <Icon name="Check" size={10} className="text-white" />}
              </div>
              <div
                className="flex items-center gap-1.5 text-sm text-gray-700 font-ibm"
                onClick={() => toggleFeature(f.key)}
              >
                <Icon name={f.icon as "Camera"} size={13} className="text-gray-400" />
                {f.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">Типы упаковки</label>
        <div className="flex flex-wrap gap-2">
          {["Полиэтилен (ПВД)", "Коробка (картон)", "Воздушно-пузырьковая плёнка (ВПП)", "Термоусадочная плёнка (ПОФ)", "Деревянная обрешётка", "Фирменные пакеты", "Индивидуальная упаковка"].map((pk) => (
            <button key={pk} onClick={() => togglePackaging(pk)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                packaging.includes(pk)
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
              }`}>
              {pk}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

interface Step3Props {
  storagePrice: string;  setStoragePrice: (v: string) => void;
  assemblyPrice: string; setAssemblyPrice: (v: string) => void;
  deliveryPrice: string; setDeliveryPrice: (v: string) => void;
  minVolume: string;     setMinVolume: (v: string) => void;
  hasTrial: boolean;     setHasTrial: (v: boolean) => void;
}

function Step3({ storagePrice, setStoragePrice, assemblyPrice, setAssemblyPrice, deliveryPrice, setDeliveryPrice, minVolume, setMinVolume, hasTrial, setHasTrial }: Step3Props) {
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

// ─── Step 4 ───────────────────────────────────────────────────────────────────

interface Step4Props {
  contactName: string;  setContactName: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
  contactPhone: string; setContactPhone: (v: string) => void;
  contactTg: string;    setContactTg: (v: string) => void;
  agree: boolean;       setAgree: (v: boolean) => void;
  // summary data
  companyName: string;
  city: string;
  schemes: string[];
  marketplaces: string[];
  storagePrice: string;
  hasTrial: boolean;
}

function Step4({ contactName, setContactName, contactEmail, setContactEmail, contactPhone, setContactPhone, contactTg, setContactTg, agree, setAgree, companyName, city, schemes, marketplaces, storagePrice, hasTrial }: Step4Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Контактное лицо <span className="text-red-400">*</span></label>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Иван Иванов" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Телефон <span className="text-red-400">*</span></label>
          <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+7 (999) 123-45-67" className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Email <span className="text-red-400">*</span></label>
          <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="ivan@company.ru" type="email" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Telegram</label>
          <input value={contactTg} onChange={(e) => setContactTg(e.target.value)} placeholder="@username" className={inputCls} />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-navy-50 border border-navy-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-navy-900 font-golos uppercase tracking-wide mb-3">Ваша заявка</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Компания",       value: companyName || "—" },
            { label: "Город",          value: city || "—" },
            { label: "Схемы",          value: schemes.join(", ") || "—" },
            { label: "Маркетплейсы",   value: marketplaces.length ? `${marketplaces.length} шт.` : "—" },
            { label: "Хранение",       value: storagePrice ? `от ${storagePrice} ₽/ед/дн.` : "—" },
            { label: "Пробный период", value: hasTrial ? "Да ✓" : "Нет" },
          ].map((r) => (
            <div key={r.label}>
              <div className="text-xs text-gray-400 font-ibm">{r.label}</div>
              <div className="text-sm font-semibold text-navy-900 font-golos">{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <div
          onClick={() => setAgree(!agree)}
          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            agree ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300"
          }`}
        >
          {agree && <Icon name="Check" size={10} className="text-white" />}
        </div>
        <span className="text-xs text-gray-600 font-ibm leading-relaxed" onClick={() => setAgree(!agree)}>
          Я принимаю{" "}
          <span className="text-navy-700 underline cursor-pointer">условия размещения</span> и{" "}
          <span className="text-navy-700 underline cursor-pointer">политику конфиденциальности</span> FulfillHub{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export interface FormState {
  // Step 1
  companyName: string; setCompanyName: (v: string) => void;
  inn: string;         setInn: (v: string) => void;
  city: string;        setCity: (v: string) => void;
  warehouseArea: string; setWarehouseArea: (v: string) => void;
  foundedYear: string; setFoundedYear: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  // Step 2
  schemes: string[];      toggleScheme: (v: string) => void;
  features: string[];     toggleFeature: (v: string) => void;
  packaging: string[];    togglePackaging: (v: string) => void;
  marketplaces: string[]; toggleMarketplace: (v: string) => void;
  // Step 3
  storagePrice: string;  setStoragePrice: (v: string) => void;
  assemblyPrice: string; setAssemblyPrice: (v: string) => void;
  deliveryPrice: string; setDeliveryPrice: (v: string) => void;
  minVolume: string;     setMinVolume: (v: string) => void;
  hasTrial: boolean;     setHasTrial: (v: boolean) => void;
  // Step 4
  contactName: string;  setContactName: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
  contactPhone: string; setContactPhone: (v: string) => void;
  contactTg: string;    setContactTg: (v: string) => void;
  agree: boolean;       setAgree: (v: boolean) => void;
}

interface RegistrationFormStepsProps {
  step: number;
  state: FormState;
  canNext: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function RegistrationFormSteps({ step, state, canNext, submitting, onBack, onNext, onSubmit }: RegistrationFormStepsProps) {
  const s = state;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
        <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
          <Icon name={STEPS[step - 1].icon as "Building2"} size={19} className="text-navy-700" />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-ibm">Шаг {step} из {STEPS.length}</div>
          <div className="font-golos font-bold text-navy-900 text-lg">{STEPS[step - 1].title}</div>
        </div>
        <div className="ml-auto text-xs text-gray-300 font-ibm">{Math.round(((step - 1) / STEPS.length) * 100)}% заполнено</div>
      </div>

      {step === 1 && (
        <Step1
          companyName={s.companyName} setCompanyName={s.setCompanyName}
          inn={s.inn}                 setInn={s.setInn}
          city={s.city}               setCity={s.setCity}
          foundedYear={s.foundedYear} setFoundedYear={s.setFoundedYear}
          warehouseArea={s.warehouseArea} setWarehouseArea={s.setWarehouseArea}
          description={s.description} setDescription={s.setDescription}
        />
      )}
      {step === 2 && (
        <Step2
          schemes={s.schemes}           toggleScheme={s.toggleScheme}
          features={s.features}         toggleFeature={s.toggleFeature}
          packaging={s.packaging}       togglePackaging={s.togglePackaging}
          marketplaces={s.marketplaces} toggleMarketplace={s.toggleMarketplace}
        />
      )}
      {step === 3 && (
        <Step3
          storagePrice={s.storagePrice}   setStoragePrice={s.setStoragePrice}
          assemblyPrice={s.assemblyPrice} setAssemblyPrice={s.setAssemblyPrice}
          deliveryPrice={s.deliveryPrice} setDeliveryPrice={s.setDeliveryPrice}
          minVolume={s.minVolume}         setMinVolume={s.setMinVolume}
          hasTrial={s.hasTrial}           setHasTrial={s.setHasTrial}
        />
      )}
      {step === 4 && (
        <Step4
          contactName={s.contactName}   setContactName={s.setContactName}
          contactEmail={s.contactEmail} setContactEmail={s.setContactEmail}
          contactPhone={s.contactPhone} setContactPhone={s.setContactPhone}
          contactTg={s.contactTg}       setContactTg={s.setContactTg}
          agree={s.agree}               setAgree={s.setAgree}
          companyName={s.companyName}
          city={s.city}
          schemes={s.schemes}
          marketplaces={s.marketplaces}
          storagePrice={s.storagePrice}
          hasTrial={s.hasTrial}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors ${step === 1 ? "invisible" : ""}`}
        >
          <Icon name="ChevronLeft" size={16} />Назад
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((st) => (
            <div
              key={st.id}
              className={`rounded-full transition-all ${
                step === st.id ? "w-6 h-2 bg-navy-900" : step > st.id ? "w-2 h-2 bg-emerald-400" : "w-2 h-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step < STEPS.length ? (
          <Button
            onClick={onNext}
            disabled={!canNext}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Далее <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canNext || submitting}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Icon name="Loader2" size={15} className="mr-1.5 animate-spin" />Отправка...</>
            ) : (
              <><Icon name="Send" size={15} className="mr-1.5" />Отправить заявку</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}