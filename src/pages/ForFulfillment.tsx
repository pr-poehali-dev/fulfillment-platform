import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

// ─── STEPS ───────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: "О компании", icon: "Building2" },
  { id: 2, title: "Склад и услуги", icon: "Warehouse" },
  { id: 3, title: "Тарифы", icon: "DollarSign" },
  { id: 4, title: "Контакты", icon: "Phone" },
];

const BENEFITS = [
  {
    icon: "Users",
    title: "15 000+ активных селлеров",
    desc: "Ваша карточка будет видна тысячам продавцов, ищущих фулфилмент прямо сейчас.",
  },
  {
    icon: "Shield",
    title: "Бесплатное размещение",
    desc: "Регистрация и размещение в каталоге — бесплатно. Комиссия только за успешную сделку.",
  },
  {
    icon: "BarChart3",
    title: "Аналитика и заявки",
    desc: "Отслеживайте просмотры, получайте заявки на КП и управляйте ими в личном кабинете.",
  },
  {
    icon: "Zap",
    title: "Быстрый запуск",
    desc: "Заполните анкету за 10 минут — модерация занимает до 24 часов.",
  },
];

const INTEGRATIONS = [
  { name: "Wildberries", icon: "🟣" },
  { name: "Ozon", icon: "🔵" },
  { name: "Яндекс Маркет", icon: "🟡" },
  { name: "1С", icon: "🔴" },
  { name: "МойСклад", icon: "🟢" },
  { name: "REST API", icon: "⚙️" },
];

const FAQ = [
  {
    q: "Сколько стоит размещение?",
    a: "Размещение в каталоге полностью бесплатно. Мы берём только комиссию за подтверждённые сделки с клиентами.",
  },
  {
    q: "Как долго проходит модерация?",
    a: "После заполнения анкеты модерация занимает до 24 часов в рабочие дни. Мы свяжемся с вами для подтверждения.",
  },
  {
    q: "Можно ли изменить тарифы после публикации?",
    a: "Да, в личном кабинете вы можете обновлять тарифы, описание и услуги в любое время.",
  },
  {
    q: "Как приходят заявки от селлеров?",
    a: "Заявки на КП приходят на указанный email и в личный кабинет. Вы можете ответить прямо в системе или связаться напрямую.",
  },
];

// ─── FORM ────────────────────────────────────────────────────────────────────

export default function ForFulfillment() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [city, setCity] = useState("");
  const [warehouseArea, setWarehouseArea] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [schemes, setSchemes] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [packaging, setPackaging] = useState<string[]>([]);
  const [marketplaces, setMarketplaces] = useState<string[]>([]);

  // Step 3
  const [storagePrice, setStoragePrice] = useState("");
  const [assemblyPrice, setAssemblyPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [minVolume, setMinVolume] = useState("");
  const [hasTrial, setHasTrial] = useState(false);

  // Step 4
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTg, setContactTg] = useState("");
  const [agree, setAgree] = useState(false);

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const canNext = () => {
    if (step === 1) return companyName.trim() && city.trim() && inn.trim();
    if (step === 2) return schemes.length > 0 && marketplaces.length > 0;
    if (step === 3) return storagePrice.trim() && assemblyPrice.trim();
    if (step === 4) return contactName.trim() && contactEmail.trim() && contactPhone.trim() && agree;
    return true;
  };

  const inputCls =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 font-golos">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/97 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
            <span className="hidden sm:inline text-white/30 text-sm ml-1">/ Для фулфилмента</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors font-ibm items-center gap-1.5">
              <Icon name="ArrowLeft" size={14} />
              Каталог
            </a>
            <a href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-lg text-sm font-semibold text-gold-400 hover:bg-gold-500/25 transition-all">
              <Icon name="LayoutDashboard" size={14} />
              Войти в кабинет
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy-gradient py-16 md:py-20">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gold-500/15 rounded-full border border-gold-500/25">
              <Icon name="Star" size={13} className="text-gold-400" />
              <span className="text-gold-400 text-xs font-medium font-ibm tracking-wide">Партнёрская программа FulfillHub</span>
            </div>
            <h1 className="font-golos font-black text-4xl md:text-6xl text-white mb-4 leading-tight">
              Разместите ваш<br />
              <span className="text-gold-gradient">фулфилмент-сервис</span><br />
              в каталоге
            </h1>
            <p className="text-white/65 text-lg font-ibm font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Получайте заявки от 15 000+ активных селлеров. Бесплатное размещение, прозрачная аналитика и удобный кабинет для управления клиентами.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 font-ibm text-sm">
              {[
                { icon: "Clock", text: "Модерация 24 часа" },
                { icon: "DollarSign", text: "Размещение бесплатно" },
                { icon: "TrendingUp", text: "Рост заявок с первого дня" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <Icon name={item.icon as "Clock"} size={14} className="text-gold-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={b.icon as "Users"} size={18} className="text-navy-700" />
                  </div>
                  <div>
                    <div className="font-golos font-bold text-navy-900 text-sm mb-1">{b.title}</div>
                    <div className="text-xs text-gray-500 font-ibm leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                {!done ? (
                  <>
                    {/* Stepper */}
                    <div className="flex items-center mb-6">
                      {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-golos font-bold text-sm transition-all shadow-sm ${
                                step > s.id
                                  ? "bg-emerald-500 text-white shadow-emerald-200"
                                  : step === s.id
                                  ? "bg-navy-900 text-white shadow-navy-200"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {step > s.id ? <Icon name="Check" size={15} /> : s.id}
                            </div>
                            <div
                              className={`text-xs mt-1.5 text-center hidden md:block font-ibm max-w-[80px] leading-tight ${
                                step === s.id ? "text-navy-900 font-semibold" : "text-gray-400"
                              }`}
                            >
                              {s.title}
                            </div>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mx-2 mb-4 md:mb-5 transition-all ${
                                step > s.id ? "bg-emerald-400" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
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

                      {/* STEP 1 */}
                      {step === 1 && (
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
                      )}

                      {/* STEP 2 */}
                      {step === 2 && (
                        <div className="space-y-6">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm block mb-2">
                              Схемы работы <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {["FBS", "FBO", "DBS", "Экспресс-доставка"].map((s) => (
                                <button key={s} onClick={() => toggle(schemes, s, setSchemes)}
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
                                <button key={mp} onClick={() => toggle(marketplaces, mp, setMarketplaces)}
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
                                { key: "cameras", label: "Видеонаблюдение на складе", icon: "Camera" },
                                { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle" },
                                { key: "returns", label: "Обработка возвратов", icon: "RefreshCw" },
                                { key: "same_day", label: "Доставка день в день", icon: "Zap" },
                                { key: "temp_control", label: "Температурный режим", icon: "Thermometer" },
                                { key: "marking", label: "Маркировка товаров", icon: "Tag" },
                                { key: "photo", label: "Фотосъёмка товаров", icon: "Camera" },
                                { key: "assembly_kits", label: "Комплектация наборов", icon: "Boxes" },
                              ].map((f) => (
                                <label key={f.key}
                                  className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${
                                    features.includes(f.key)
                                      ? "border-navy-200 bg-navy-50/50"
                                      : "border-gray-100 hover:border-gray-200"
                                  }`}
                                >
                                  <div
                                    onClick={() => toggle(features, f.key, setFeatures)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                                      features.includes(f.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300"
                                    }`}
                                  >
                                    {features.includes(f.key) && <Icon name="Check" size={10} className="text-white" />}
                                  </div>
                                  <div
                                    className="flex items-center gap-1.5 text-sm text-gray-700 font-ibm"
                                    onClick={() => toggle(features, f.key, setFeatures)}
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
                              {["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка", "Деревянная обрешётка", "Металлический контейнер", "Кастомная упаковка"].map((pk) => (
                                <button key={pk} onClick={() => toggle(packaging, pk, setPackaging)}
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
                      )}

                      {/* STEP 3 */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2.5">
                            <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 font-ibm leading-relaxed">
                              Укажите стартовые тарифы — они отображаются как «от» в каталоге. Точная стоимость согласовывается с каждым клиентом индивидуально.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              { label: "Хранение", suffix: "₽/ед/день", value: storagePrice, set: setStoragePrice, placeholder: "12" },
                              { label: "Сборка заказа", suffix: "₽/заказ", value: assemblyPrice, set: setAssemblyPrice, placeholder: "18" },
                              { label: "Доставка", suffix: "₽/заказ", value: deliveryPrice, set: setDeliveryPrice, placeholder: "85" },
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
                      )}

                      {/* STEP 4 */}
                      {step === 4 && (
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
                                { label: "Компания", value: companyName || "—" },
                                { label: "Город", value: city || "—" },
                                { label: "Схемы", value: schemes.join(", ") || "—" },
                                { label: "Маркетплейсы", value: marketplaces.length ? `${marketplaces.length} шт.` : "—" },
                                { label: "Хранение", value: storagePrice ? `от ${storagePrice} ₽/ед/дн.` : "—" },
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
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
                        <button
                          onClick={() => setStep((s) => Math.max(1, s - 1))}
                          className={`flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors ${step === 1 ? "invisible" : ""}`}
                        >
                          <Icon name="ChevronLeft" size={16} />Назад
                        </button>

                        <div className="flex items-center gap-1.5">
                          {STEPS.map((s) => (
                            <div
                              key={s.id}
                              className={`rounded-full transition-all ${
                                step === s.id ? "w-6 h-2 bg-navy-900" : step > s.id ? "w-2 h-2 bg-emerald-400" : "w-2 h-2 bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        {step < STEPS.length ? (
                          <Button
                            onClick={() => canNext() && setStep((s) => s + 1)}
                            disabled={!canNext()}
                            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Далее <Icon name="ChevronRight" size={16} className="ml-1" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => canNext() && setDone(true)}
                            disabled={!canNext()}
                            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Icon name="Send" size={15} className="mr-1.5" />Отправить заявку
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Success */
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Icon name="CheckCircle" size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="font-golos font-black text-2xl text-navy-900 mb-2">Заявка отправлена!</h2>
                    <p className="text-gray-500 font-ibm text-sm leading-relaxed mb-6 max-w-md mx-auto">
                      Мы получили заявку компании <strong className="text-navy-900">{companyName}</strong>.
                      Наш менеджер проверит данные и свяжется с вами в течение 24 часов на{" "}
                      <strong className="text-navy-900">{contactEmail}</strong>
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
                      {[
                        { icon: "Building2", label: "Компания", value: companyName },
                        { icon: "MapPin", label: "Город", value: city },
                        { icon: "Layers", label: "Схемы", value: schemes.join(", ") },
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                          <Icon name={item.icon as "Building2"} size={16} className="text-navy-700 mx-auto mb-1" />
                          <div className="text-xs text-gray-400 font-ibm">{item.label}</div>
                          <div className="text-xs font-semibold text-navy-900 font-golos truncate">{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <a href="/">
                        <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 font-ibm">
                          Перейти в каталог
                        </Button>
                      </a>
                      <Button
                        className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos"
                        onClick={() => { setDone(false); setStep(1); setCompanyName(""); setCity(""); setInn(""); setSchemes([]); setMarketplaces([]); }}
                      >
                        Ещё одна заявка
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-5">
                {/* Integrations */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="font-golos font-bold text-navy-900 text-sm mb-3">Поддерживаемые интеграции</div>
                  <div className="grid grid-cols-3 gap-2">
                    {INTEGRATIONS.map((i) => (
                      <div key={i.name} className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-2.5">
                        <span className="text-xl">{i.icon}</span>
                        <span className="text-xs text-gray-500 font-ibm text-center leading-tight">{i.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-navy-gradient rounded-2xl p-5 text-white">
                  <div className="font-golos font-bold text-sm mb-4 text-gold-400">Почему FulfillHub?</div>
                  <div className="space-y-3">
                    {[
                      { value: "15 000+", label: "Селлеров на платформе" },
                      { value: "200+", label: "Фулфилмент-сервисов" },
                      { value: "98%", label: "Успешных сделок" },
                      { value: "24ч", label: "Среднее время модерации" },
                    ].map((s) => (
                      <div key={s.value} className="flex items-center gap-3">
                        <div className="text-xl font-golos font-black text-gold-gradient w-16 flex-shrink-0">{s.value}</div>
                        <div className="text-xs text-white/60 font-ibm">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="font-golos font-bold text-navy-900 text-sm mb-3">Есть вопросы?</div>
                  <div className="space-y-2.5">
                    {[
                      { icon: "Phone", text: "+7 (800) 555-35-35" },
                      { icon: "Mail", text: "partners@fulfillhub.ru" },
                      { icon: "MessageSquare", text: "@fulfillhub_support" },
                    ].map((c) => (
                      <div key={c.text} className="flex items-center gap-2.5 text-sm text-gray-600 font-ibm">
                        <Icon name={c.icon as "Phone"} size={14} className="text-navy-700 flex-shrink-0" />
                        {c.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h2 className="font-golos font-black text-2xl text-navy-900 mb-5">Часто задаваемые вопросы</h2>
              <div className="space-y-2">
                {FAQ.map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-golos font-semibold text-navy-900 text-sm">{item.q}</span>
                      <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-gray-400 flex-shrink-0 ml-3" />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-gray-500 font-ibm leading-relaxed border-t border-gray-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-navy-gradient text-white py-8 mt-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 font-ibm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={12} className="text-navy-950" />
              </div>
              <span className="text-white/50 font-golos font-bold">FulfillHub</span>
              <span>© 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="hover:text-white/60 transition-colors">Каталог для селлеров</a>
              <button className="hover:text-white/60 transition-colors">Условия использования</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}