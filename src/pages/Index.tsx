import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Partner {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  location: string;
  tags: string[];
  storage: string;
  assembly: string;
  delivery: string;
  storageRate: number;
  assemblyRate: number;
  deliveryRate: number;
  minVolume: string;
  description: string;
  badge: string;
  badgeColor: string;
  features: string[];
  packagingTypes: string[];
  workSchemes: string[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PARTNERS: Partner[] = [
  {
    id: 1,
    name: "LogiMaster",
    logo: "🏭",
    rating: 4.9,
    reviews: 124,
    location: "Москва",
    tags: ["Wildberries", "Ozon", "Яндекс Маркет"],
    storage: "от 12 ₽/ед/день",
    assembly: "от 18 ₽/заказ",
    delivery: "от 85 ₽",
    storageRate: 12,
    assemblyRate: 18,
    deliveryRate: 85,
    minVolume: "500 SKU",
    description: "Комплексный фулфилмент для маркетплейсов. Собственный склад 15 000 м², автоматизированная система учёта.",
    badge: "Топ партнёр",
    badgeColor: "gold",
    features: ["cameras", "returns", "same_day", "packaging", "dangerous"],
    packagingTypes: ["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка"],
    workSchemes: ["FBS", "FBO"],
  },
  {
    id: 2,
    name: "FulFast",
    logo: "⚡",
    rating: 4.7,
    reviews: 89,
    location: "Санкт-Петербург",
    tags: ["Wildberries", "Ozon"],
    storage: "от 9 ₽/ед/день",
    assembly: "от 15 ₽/заказ",
    delivery: "от 75 ₽",
    storageRate: 9,
    assemblyRate: 15,
    deliveryRate: 75,
    minVolume: "200 SKU",
    description: "Быстрая обработка заказов до 3 000 штук в день. Специализация — одежда и аксессуары.",
    badge: "Быстрая обработка",
    badgeColor: "blue",
    features: ["cameras", "returns", "same_day", "packaging"],
    packagingTypes: ["Полиэтилен", "Короб"],
    workSchemes: ["FBS"],
  },
  {
    id: 3,
    name: "StorePro",
    logo: "📦",
    rating: 4.8,
    reviews: 211,
    location: "Екатеринбург",
    tags: ["Ozon", "Яндекс Маркет", "СберМегаМаркет"],
    storage: "от 10 ₽/ед/день",
    assembly: "от 20 ₽/заказ",
    delivery: "от 90 ₽",
    storageRate: 10,
    assemblyRate: 20,
    deliveryRate: 90,
    minVolume: "300 SKU",
    description: "Опыт работы 8 лет. Интеграция с любыми маркетплейсами через API. Персональный менеджер.",
    badge: "Проверенный",
    badgeColor: "green",
    features: ["cameras", "returns", "packaging"],
    packagingTypes: ["Короб", "Пузырчатая плёнка", "Деревянная обрешётка"],
    workSchemes: ["FBS", "FBO", "DBS"],
  },
  {
    id: 4,
    name: "NordLogistics",
    logo: "🚚",
    rating: 4.6,
    reviews: 67,
    location: "Новосибирск",
    tags: ["Wildberries"],
    storage: "от 8 ₽/ед/день",
    assembly: "от 12 ₽/заказ",
    delivery: "от 70 ₽",
    storageRate: 8,
    assemblyRate: 12,
    deliveryRate: 70,
    minVolume: "100 SKU",
    description: "Лучшие тарифы для старта. Подходит для малого бизнеса. Возможность работы без минимального объёма.",
    badge: "Выгодный старт",
    badgeColor: "purple",
    features: ["returns", "packaging"],
    packagingTypes: ["Полиэтилен", "Короб"],
    workSchemes: ["FBS"],
  },
  {
    id: 5,
    name: "MegaFulfill",
    logo: "🏗️",
    rating: 4.9,
    reviews: 302,
    location: "Москва",
    tags: ["Wildberries", "Ozon", "Яндекс Маркет", "Ali"],
    storage: "от 15 ₽/ед/день",
    assembly: "от 22 ₽/заказ",
    delivery: "от 95 ₽",
    storageRate: 15,
    assemblyRate: 22,
    deliveryRate: 95,
    minVolume: "1000 SKU",
    description: "Крупнейший фулфилмент-оператор. 3 склада в Москве, 50 000 м² площадей. Для среднего и крупного бизнеса.",
    badge: "Масштаб",
    badgeColor: "gold",
    features: ["cameras", "returns", "same_day", "packaging", "dangerous", "temp_control"],
    packagingTypes: ["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка", "Деревянная обрешётка"],
    workSchemes: ["FBS", "FBO", "DBS"],
  },
  {
    id: 6,
    name: "SmartStore",
    logo: "🤖",
    rating: 4.7,
    reviews: 143,
    location: "Казань",
    tags: ["Ozon", "СберМегаМаркет"],
    storage: "от 11 ₽/ед/день",
    assembly: "от 16 ₽/заказ",
    delivery: "от 80 ₽",
    storageRate: 11,
    assemblyRate: 16,
    deliveryRate: 80,
    minVolume: "250 SKU",
    description: "Полная автоматизация процессов. Роботизированный склад, API-интеграции с любыми системами.",
    badge: "Автоматизация",
    badgeColor: "blue",
    features: ["cameras", "returns", "packaging", "temp_control"],
    packagingTypes: ["Полиэтилен", "Короб", "Термоусадка"],
    workSchemes: ["FBS", "FBO"],
  },
  {
    id: 7,
    name: "SafeCargo",
    logo: "🔐",
    rating: 4.8,
    reviews: 58,
    location: "Москва",
    tags: ["Ozon", "Wildberries"],
    storage: "от 14 ₽/ед/день",
    assembly: "от 25 ₽/заказ",
    delivery: "от 110 ₽",
    storageRate: 14,
    assemblyRate: 25,
    deliveryRate: 110,
    minVolume: "300 SKU",
    description: "Специализация на опасных и крупногабаритных грузах. Сертифицированные склады, охрана 24/7.",
    badge: "Опасные грузы",
    badgeColor: "red",
    features: ["cameras", "dangerous", "packaging", "returns"],
    packagingTypes: ["Короб", "Деревянная обрешётка", "Металлический контейнер"],
    workSchemes: ["FBS", "DBS"],
  },
  {
    id: 8,
    name: "ExpressHub",
    logo: "🚀",
    rating: 4.6,
    reviews: 91,
    location: "Москва",
    tags: ["Wildberries", "Ozon", "Яндекс Маркет"],
    storage: "от 13 ₽/ед/день",
    assembly: "от 20 ₽/заказ",
    delivery: "от 120 ₽",
    storageRate: 13,
    assemblyRate: 20,
    deliveryRate: 120,
    minVolume: "200 SKU",
    description: "Специализируемся на срочной доставке. Гарантированная доставка день-в-день по Москве и МО.",
    badge: "День в день",
    badgeColor: "blue",
    features: ["cameras", "same_day", "returns", "packaging"],
    packagingTypes: ["Полиэтилен", "Короб", "Пузырчатая плёнка"],
    workSchemes: ["FBS", "DBS"],
  },
];

const REVIEWS = [
  { id: 1, author: "Алексей Морозов", company: "BrandStore", avatar: "АМ", partner: "LogiMaster", rating: 5, text: "Работаем уже 2 года. Процент брака почти нулевой, скорость обработки отличная. Камеры на складе — можно смотреть онлайн!", date: "Март 2026" },
  { id: 2, author: "Мария Иванова", company: "FashionLine", avatar: "МИ", partner: "FulFast", rating: 5, text: "Перешли от другого оператора — разница колоссальная. Заказы уходят в день поступления, менеджер всегда на связи.", date: "Апрель 2026" },
  { id: 3, author: "Дмитрий Соколов", company: "TechGoods", avatar: "ДС", partner: "StorePro", rating: 5, text: "Для нас важна была API-интеграция с нашей CRM. Всё сделали за 3 дня. Теперь весь учёт автоматический.", date: "Февраль 2026" },
];

const INTEGRATIONS = [
  { name: "Wildberries API", icon: "🟣", status: "Активно", desc: "Полная интеграция: заказы, остатки, аналитика" },
  { name: "Ozon API", icon: "🔵", status: "Активно", desc: "Автосинхронизация каталога и статусов" },
  { name: "Яндекс Маркет", icon: "🟡", status: "Активно", desc: "FBS и FBY схемы работы" },
  { name: "1С Предприятие", icon: "🔴", status: "Активно", desc: "Двусторонняя синхронизация данных" },
  { name: "МойСклад", icon: "🟢", status: "Активно", desc: "Управление складскими остатками" },
  { name: "REST API", icon: "⚙️", status: "Документация", desc: "Полное API для разработчиков" },
];

// Feature definitions
const FEATURE_FILTERS = [
  { key: "cameras", label: "Видеонаблюдение", icon: "Camera" },
  { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle" },
  { key: "returns", label: "Работа с возвратами", icon: "RefreshCw" },
  { key: "same_day", label: "Доставка день в день", icon: "Zap" },
  { key: "temp_control", label: "Температурный режим", icon: "Thermometer" },
];

const SCHEME_FILTERS = ["FBS", "FBO", "DBS"];

const PACKAGING_FILTERS = ["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка", "Деревянная обрешётка", "Металлический контейнер"];

const MARKETPLACE_FILTERS = ["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Ali"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 16 16" fill={star <= Math.round(rating) ? "#d4a017" : "#e2e8f0"}>
          <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" />
        </svg>
      ))}
    </div>
  );
}

function BadgeChip({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    gold: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium whitespace-nowrap ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { id: "catalog", label: "Каталог" },
    { id: "compare", label: "Сравнение" },
    { id: "calculator", label: "Калькулятор" },
    { id: "integrations", label: "Интеграции" },
    { id: "reviews", label: "Отзывы" },
    { id: "contacts", label: "Контакты" },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <button onClick={() => setActive("hero")} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
            <Icon name="Package" size={14} className="text-navy-950" />
          </div>
          <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
        </button>
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <button key={l.id} onClick={() => setActive(l.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${active === l.id ? "bg-gold-500/20 text-gold-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => setActive("lk")} className="px-3 py-1.5 text-sm text-white/70 hover:text-white">Войти</button>
          <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm h-8" onClick={() => setActive("lk")}>
            Регистрация
          </Button>
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <button key={l.id} onClick={() => { setActive(l.id); setMobileOpen(false); }}
              className="text-left px-3 py-2 rounded text-sm text-white/80 hover:bg-white/10">{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO (COMPACT) ──────────────────────────────────────────────────────────

function HeroSection({ setActive }: { setActive: (s: string) => void }) {
  return (
    <section id="hero" className="relative flex items-center overflow-hidden" style={{ minHeight: "52vh" }}>
      <div className="absolute inset-0 bg-navy-gradient" />
      <div className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/8c7181ef-d597-45e4-8217-9f0563dabf62.jpg')`,
          backgroundSize: "cover", backgroundPosition: "center 40%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/40" />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 pt-24 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left: text */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3 opacity-0 animate-fade-in">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-widest uppercase font-ibm">B2B Маркетплейс фулфилмента</span>
            </div>
            <h1 className="font-golos font-black text-4xl md:text-5xl leading-tight text-white mb-3 opacity-0 animate-slide-up delay-100">
              Найдите <span className="text-gold-gradient">надёжного</span> партнёра
            </h1>
            <p className="text-white/60 text-base font-ibm font-light leading-relaxed mb-5 opacity-0 animate-fade-in delay-200">
              Сравнивайте тарифы, фильтруйте по нужным услугам и выбирайте фулфилмент под ваш товар
            </p>
            <div className="flex gap-2 opacity-0 animate-fade-in delay-300">
              <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold h-9 px-5" onClick={() => setActive("catalog")}>
                <Icon name="Search" size={15} className="mr-1.5" />Найти партнёра
              </Button>
              <Button size="sm" variant="outline" className="border-white/25 text-white bg-transparent hover:bg-white/10 h-9 px-4" onClick={() => setActive("calculator")}>
                <Icon name="Calculator" size={15} className="mr-1.5" />Калькулятор
              </Button>
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex md:flex-col gap-4 md:gap-3 opacity-0 animate-fade-in delay-400">
            {[
              { value: "200+", label: "Операторов", icon: "Building2" },
              { value: "15 000+", label: "Селлеров", icon: "Users" },
              { value: "98%", label: "Успешных сделок", icon: "TrendingUp" },
            ].map((s) => (
              <div key={s.value} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={s.icon as "Users"} size={15} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-xl font-golos font-black text-gold-gradient leading-none">{s.value}</div>
                  <div className="text-white/50 text-xs font-ibm">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CATALOG WITH ADVANCED FILTERS ───────────────────────────────────────────

function CatalogSection({ setActive, compareList, setCompareList }: {
  setActive: (s: string) => void;
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [search, setSearch] = useState("");
  const [selectedMp, setSelectedMp] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleArr = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const activeFilterCount =
    selectedMp.length + selectedFeatures.length + selectedSchemes.length + selectedPackaging.length;

  const clearAll = () => {
    setSelectedMp([]);
    setSelectedFeatures([]);
    setSelectedSchemes([]);
    setSelectedPackaging([]);
    setSearch("");
  };

  const filtered = PARTNERS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedMp.length && !selectedMp.some((mp) => p.tags.includes(mp))) return false;
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

  return (
    <section id="catalog" className="bg-white">
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Город или название..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/15"
            />
          </div>

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
            {compareList.length > 0 && (
              <Button size="sm" className="bg-navy-900 hover:bg-navy-800 text-white font-semibold h-8 text-xs" onClick={() => setActive("compare")}>
                <Icon name="GitCompare" size={13} className="mr-1" />
                Сравнить {compareList.length}
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
                <div className="flex flex-col gap-1.5">
                  {FEATURE_FILTERS.map((f) => (
                    <label key={f.key} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleArr(selectedFeatures, f.key, setSelectedFeatures)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${selectedFeatures.includes(f.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300 group-hover:border-navy-400"}`}>
                        {selectedFeatures.includes(f.key) && <Icon name="Check" size={10} className="text-white" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 font-ibm"
                        onClick={() => toggleArr(selectedFeatures, f.key, setSelectedFeatures)}>
                        <Icon name={f.icon as "Camera"} size={13} className="text-gray-400" />
                        {f.label}
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

            </div>

            {/* Active filters chips */}
            {activeFilterCount > 0 && (
              <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400 font-ibm">Активные:</span>
                {[...selectedMp, ...selectedSchemes, ...selectedFeatures.map(f => FEATURE_FILTERS.find(x => x.key === f)?.label || f), ...selectedPackaging].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-navy-900 text-white text-xs px-2 py-0.5 rounded-full font-ibm">
                    {tag}
                    <button onClick={() => {
                      if (selectedMp.includes(tag)) toggleArr(selectedMp, tag, setSelectedMp);
                      if (selectedSchemes.includes(tag)) toggleArr(selectedSchemes, tag, setSelectedSchemes);
                      const featureKey = FEATURE_FILTERS.find(f => f.label === tag)?.key;
                      if (featureKey) toggleArr(selectedFeatures, featureKey, setSelectedFeatures);
                      if (selectedPackaging.includes(tag)) toggleArr(selectedPackaging, tag, setSelectedPackaging);
                    }}>
                      <Icon name="X" size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Partner cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-ibm">
            <Icon name="SearchX" size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-base">Ничего не найдено</p>
            <button onClick={clearAll} className="mt-2 text-sm text-navy-700 hover:underline">Сбросить все фильтры</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <PartnerCard key={p.id} p={p} inCompare={compareList.includes(p.id)} onCompare={() => toggleCompare(p.id)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PartnerCard({ p, inCompare, onCompare }: { p: Partner; inCompare: boolean; onCompare: () => void }) {
  const featureIcons: Record<string, { icon: string; label: string; color: string }> = {
    cameras: { icon: "Camera", label: "Камеры", color: "text-blue-500" },
    dangerous: { icon: "AlertTriangle", label: "Опасные грузы", color: "text-red-500" },
    returns: { icon: "RefreshCw", label: "Возвраты", color: "text-emerald-500" },
    same_day: { icon: "Zap", label: "День в день", color: "text-amber-500" },
    temp_control: { icon: "Thermometer", label: "Темп. режим", color: "text-cyan-500" },
    packaging: { icon: "Package", label: "Упаковка", color: "text-purple-500" },
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 card-hover shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{p.logo}</div>
          <div>
            <div className="font-golos font-bold text-navy-900 text-sm leading-tight">{p.name}</div>
            <div className="text-xs text-gray-400 font-ibm flex items-center gap-0.5 mt-0.5">
              <Icon name="MapPin" size={10} />{p.location}
            </div>
          </div>
        </div>
        <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
      </div>

      <p className="text-xs text-gray-500 font-ibm leading-relaxed mb-3 flex-1">{p.description}</p>

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
              <span className="hidden xl:inline">{fi.label}</span>
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <StarRating rating={p.rating} size={12} />
          <span className="text-sm font-semibold text-navy-900">{p.rating}</span>
          <span className="text-xs text-gray-400">({p.reviews})</span>
        </div>
        <button onClick={onCompare}
          className={`text-xs px-2.5 py-1 rounded border font-medium transition-all ${inCompare ? "bg-navy-900 text-white border-navy-900" : "border-gray-200 text-gray-500 hover:border-navy-900/50"}`}>
          {inCompare ? "✓ Добавлен" : "Сравнить"}
        </button>
      </div>
    </div>
  );
}

// ─── COMPARE ─────────────────────────────────────────────────────────────────

function CompareSection({ compareList }: { compareList: number[] }) {
  const selected = compareList.length >= 2
    ? compareList.slice(0, 3).map((id) => PARTNERS.find((p) => p.id === id)!)
    : PARTNERS.slice(0, 3);

  const rows = [
    { label: "Рейтинг", key: "rating" },
    { label: "Отзывы", key: "reviews" },
    { label: "Город", key: "location" },
    { label: "Мин. объём", key: "minVolume" },
    { label: "Хранение", key: "storage" },
    { label: "Сборка", key: "assembly" },
    { label: "Доставка", key: "delivery" },
  ];

  return (
    <section id="compare" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Сравнение</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Сравнение партнёров</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <div className="grid min-w-[640px]" style={{ gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}>
            <div className="p-4 bg-gray-50 border-b border-r border-gray-100 font-ibm text-xs text-gray-500 font-semibold uppercase tracking-wide">Параметр</div>
            {selected.map((p) => (
              <div key={p.id} className="p-4 border-b border-r border-gray-100 last:border-r-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{p.logo}</span>
                  <span className="font-golos font-bold text-navy-900 text-sm">{p.name}</span>
                </div>
                <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
              </div>
            ))}

            {rows.map((row, i) => (
              <>
                <div key={`l-${row.key}`} className={`p-3 border-b border-r border-gray-100 font-medium text-gray-600 text-xs font-ibm flex items-center ${i % 2 === 0 ? "" : "bg-gray-50/60"}`}>{row.label}</div>
                {selected.map((p) => (
                  <div key={`${p.id}-${row.key}`} className={`p-3 border-b border-r border-gray-100 last:border-r-0 text-sm text-navy-900 font-ibm flex items-center ${i % 2 === 0 ? "" : "bg-gray-50/60"}`}>
                    {row.key === "rating" ? <div className="flex items-center gap-1.5"><StarRating rating={p.rating} /><span className="font-semibold">{p.rating}</span></div>
                      : row.key === "reviews" ? `${p.reviews} отз.`
                        : String(p[row.key as keyof typeof p])}
                  </div>
                ))}
              </>
            ))}

            {/* Schemes row */}
            <div className="p-3 border-b border-r border-gray-100 font-medium text-gray-600 text-xs font-ibm">Схемы</div>
            {selected.map((p) => (
              <div key={`schemes-${p.id}`} className="p-3 border-b border-r border-gray-100 last:border-r-0 flex gap-1 flex-wrap">
                {p.workSchemes.map((s) => <span key={s} className="text-xs px-1.5 py-0.5 bg-navy-900 text-white rounded font-ibm">{s}</span>)}
              </div>
            ))}

            {/* Features row */}
            <div className="p-3 border-r border-gray-100 font-medium text-gray-600 text-xs font-ibm">Услуги</div>
            {selected.map((p) => (
              <div key={`feat-${p.id}`} className="p-3 border-r border-gray-100 last:border-r-0 flex flex-wrap gap-1.5">
                {p.features.includes("cameras") && <span className="text-xs text-gray-600 font-ibm flex items-center gap-0.5"><Icon name="Camera" size={11} className="text-blue-500" />Камеры</span>}
                {p.features.includes("returns") && <span className="text-xs text-gray-600 font-ibm flex items-center gap-0.5"><Icon name="RefreshCw" size={11} className="text-emerald-500" />Возвраты</span>}
                {p.features.includes("same_day") && <span className="text-xs text-gray-600 font-ibm flex items-center gap-0.5"><Icon name="Zap" size={11} className="text-amber-500" />День в день</span>}
                {p.features.includes("dangerous") && <span className="text-xs text-gray-600 font-ibm flex items-center gap-0.5"><Icon name="AlertTriangle" size={11} className="text-red-500" />Опасные</span>}
                {p.features.includes("temp_control") && <span className="text-xs text-gray-600 font-ibm flex items-center gap-0.5"><Icon name="Thermometer" size={11} className="text-cyan-500" />Темп.</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CALCULATOR ──────────────────────────────────────────────────────────────

function CalculatorSection() {
  const [sku, setSku] = useState(500);
  const [orders, setOrders] = useState(300);
  const [avgItems, setAvgItems] = useState(2);
  const [storageDays, setStorageDays] = useState(30);
  const [partnerIdx, setPartnerIdx] = useState(0);

  const selected = PARTNERS[partnerIdx];
  const storageCost = sku * selected.storageRate * storageDays;
  const assemblyCost = orders * selected.assemblyRate * avgItems;
  const deliveryCost = orders * selected.deliveryRate;
  const total = storageCost + assemblyCost + deliveryCost;
  const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Калькулятор</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Рассчитайте стоимость</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm font-semibold text-navy-900 mb-2 font-golos">Выберите партнёра</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PARTNERS.map((p, i) => (
                  <button key={p.id} onClick={() => setPartnerIdx(i)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs transition-all ${partnerIdx === i ? "border-navy-900 bg-navy-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-navy-900/40"}`}>
                    <span>{p.logo}</span>
                    <span className="font-medium truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {[
              { label: "Количество SKU", value: sku, setValue: setSku, min: 50, max: 5000, step: 50, suffix: "позиций" },
              { label: "Заказов в месяц", value: orders, setValue: setOrders, min: 50, max: 10000, step: 50, suffix: "заказов" },
              { label: "Единиц в заказе (среднее)", value: avgItems, setValue: setAvgItems, min: 1, max: 10, step: 1, suffix: "ед." },
              { label: "Дней хранения", value: storageDays, setValue: setStorageDays, min: 1, max: 30, step: 1, suffix: "дней" },
            ].map(({ label, value, setValue, min, max, step, suffix }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-navy-900 font-golos">{label}</span>
                  <span className="text-sm font-bold text-navy-900 font-golos">{value.toLocaleString("ru-RU")} <span className="text-xs text-gray-400 font-normal">{suffix}</span></span>
                </div>
                <Slider value={[value]} onValueChange={(v) => setValue(v[0])} min={min} max={max} step={step} />
              </div>
            ))}
          </div>

          <div>
            <div className="sticky top-20 bg-navy-gradient rounded-2xl p-5 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Calculator" size={16} className="text-gold-400" />
                <span className="font-golos font-bold">Предварительный расчёт</span>
              </div>
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-white/10 rounded-lg">
                <span className="text-lg">{selected.logo}</span>
                <div>
                  <div className="font-semibold text-sm">{selected.name}</div>
                  <div className="text-xs text-white/50">{selected.location}</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Хранение", value: storageCost },
                  { label: "Сборка заказов", value: assemblyCost },
                  { label: "Доставка", value: deliveryCost },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-sm text-white/70 font-ibm">{label}</span>
                    <span className="font-golos font-bold text-sm">{fmt(value)} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 font-ibm text-sm">Итого / месяц</span>
                  <span className="text-2xl font-golos font-black text-gold-gradient">{fmt(total)} ₽</span>
                </div>
                <div className="text-xs text-white/30 font-ibm mt-1">* Предварительный расчёт</div>
              </div>
              <Button className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos">
                <Icon name="Send" size={15} className="mr-2" />Запросить КП
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── INTEGRATIONS ────────────────────────────────────────────────────────────

function IntegrationsSection() {
  return (
    <section id="integrations" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Технологии</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Интеграции и API</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="bg-white border border-gray-100 rounded-xl p-4 card-hover shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{int.icon}</span>
                  <span className="font-golos font-bold text-navy-900 text-sm">{int.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${int.status === "Активно" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{int.status}</span>
              </div>
              <p className="text-xs text-gray-500 font-ibm">{int.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-navy-gradient rounded-2xl p-7 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3"><Icon name="Code2" size={18} className="text-gold-400" /><span className="text-gold-400 text-sm font-ibm">REST API</span></div>
              <h3 className="font-golos font-black text-2xl mb-2">Открытый API для разработчиков</h3>
              <p className="text-white/70 font-ibm text-sm leading-relaxed mb-4">OpenAPI 3.0. Управляйте заказами, остатками и аналитикой через HTTP запросы.</p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold">Получить токен</Button>
                <Button size="sm" variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10">Документация</Button>
              </div>
            </div>
            <div className="bg-black/30 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <div className="text-green-400 mb-1">// GET /api/v1/partners</div>
              <div className="text-white/60">{"{ \"status\": \"ok\", \"data\": ["}</div>
              <div className="text-white/60 ml-4">{"{ \"id\": 1, \"name\": "}<span className="text-gold-400">"LogiMaster"</span>{","}</div>
              <div className="text-white/60 ml-6">{"\"rating\": "}<span className="text-gold-400">4.9</span>{", \"schemes\": ["}<span className="text-gold-400">"FBS","FBO"</span>{"] }"}</div>
              <div className="text-white/60">{"} ]}"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

function ReviewsSection() {
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Отзывы</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Что говорят селлеры</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {REVIEWS.map((r) => (
            <div key={r.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs">{r.avatar}</div>
                  <div>
                    <div className="font-golos font-bold text-navy-900 text-sm">{r.author}</div>
                    <div className="text-xs text-gray-400 font-ibm">{r.company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={r.rating} size={11} />
                  <div className="text-xs text-gray-400 font-ibm mt-0.5">{r.date}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-ibm leading-relaxed mb-2">"{r.text}"</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-ibm">
                <Icon name="Building2" size={10} />Партнёр: <span className="text-navy-700 font-medium">{r.partner}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-golos font-bold text-lg text-navy-900">Работаете с фулфилмент партнёром?</h3>
            <p className="text-gray-500 font-ibm text-sm">Оставьте отзыв и помогите другим селлерам</p>
          </div>
          <Button className="bg-navy-900 hover:bg-navy-800 text-white font-semibold whitespace-nowrap">
            <Icon name="PenLine" size={15} className="mr-2" />Написать отзыв
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── LK ──────────────────────────────────────────────────────────────────────

function LKSection() {
  const [tab, setTab] = useState<"seller" | "ff">("seller");
  return (
    <section id="lk" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Личный кабинет</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Войти в систему</h2>
        </div>
        <div className="max-w-md">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-5">
            {(["seller", "ff"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all font-golos ${tab === t ? "bg-navy-900 text-white" : "text-gray-500 hover:text-navy-900"}`}>
                {t === "seller" ? "Я — Селлер" : "Я — Фулфилмент"}
              </button>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center">
                <Icon name={tab === "seller" ? "ShoppingBag" : "Warehouse"} size={18} className="text-navy-900" />
              </div>
              <div>
                <div className="font-golos font-bold text-navy-900 text-sm">{tab === "seller" ? "Кабинет селлера" : "Кабинет оператора"}</div>
                <div className="text-xs text-gray-400 font-ibm">{tab === "seller" ? "Заказы, партнёры, аналитика" : "Тарифы, заявки, API"}</div>
              </div>
            </div>
            <div className="space-y-3">
              <input type="email" placeholder="Email" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              <input type="password" placeholder="Пароль" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10">Войти</Button>
              <div className="text-center text-sm text-gray-400 font-ibm">
                Нет аккаунта? <button className="text-navy-700 font-semibold hover:underline">Зарегистрироваться</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACTS ────────────────────────────────────────────────────────────────

function ContactsSection() {
  return (
    <section id="contacts" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Контакты</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Свяжитесь с нами</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {[
              { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail", label: "Email", value: "hello@fulfillhub.ru", sub: "Ответим в течение 2 ч." },
              { icon: "MessageSquare", label: "Telegram", value: "@fulfillhub", sub: "Быстрая связь" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3.5 card-hover">
                <div className="w-9 h-9 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={c.icon as "Phone"} size={16} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-ibm">{c.label}</div>
                  <div className="font-golos font-semibold text-navy-900 text-sm">{c.value}</div>
                  <div className="text-xs text-gray-400 font-ibm">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h3 className="font-golos font-bold text-lg text-navy-900 mb-4">Задайте вопрос</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input placeholder="Имя" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              <input placeholder="Компания" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
            </div>
            <input type="email" placeholder="Email" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 mb-3" />
            <textarea rows={3} placeholder="Сообщение..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 resize-none mb-4" />
            <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10 px-7">
              <Icon name="Send" size={14} className="mr-2" />Отправить
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer({ setActive }: { setActive: (s: string) => void }) {
  return (
    <footer className="bg-navy-gradient text-white py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={14} className="text-navy-950" />
              </div>
              <span className="font-golos font-bold text-white">FulfillHub</span>
            </div>
            <p className="text-white/50 text-xs font-ibm leading-relaxed">B2B маркетплейс фулфилмент-партнёров для селлеров</p>
          </div>
          {[
            { title: "Платформа", links: [{ label: "Каталог", id: "catalog" }, { label: "Сравнение", id: "compare" }, { label: "Калькулятор", id: "calculator" }, { label: "Отзывы", id: "reviews" }] },
            { title: "Для бизнеса", links: [{ label: "Для селлеров", id: "lk" }, { label: "Для операторов", id: "lk" }, { label: "Интеграции", id: "integrations" }, { label: "Контакты", id: "contacts" }] },
            { title: "Компания", links: [{ label: "О нас", id: "hero" }, { label: "Блог", id: "hero" }, { label: "Партнёрство", id: "contacts" }, { label: "Поддержка", id: "contacts" }] },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-golos font-bold text-xs mb-2.5 text-white/70 uppercase tracking-wide">{col.title}</div>
              <div className="space-y-1.5">
                {col.links.map((l) => (
                  <button key={l.label} onClick={() => setActive(l.id)} className="block text-xs text-white/45 hover:text-white/75 transition-colors font-ibm">{l.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/25 font-ibm">
          <span>© 2026 FulfillHub. Все права защищены.</span>
          <div className="flex gap-4">
            <button className="hover:text-white/50 transition-colors">Политика конфиденциальности</button>
            <button className="hover:text-white/50 transition-colors">Условия использования</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [active, setActive] = useState("hero");
  const [compareList, setCompareList] = useState<number[]>([]);

  const handleSetActive = (section: string) => {
    setActive(section);
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  return (
    <div className="min-h-screen font-golos">
      <Navbar active={active} setActive={handleSetActive} />
      <div className="pt-14">
        <HeroSection setActive={handleSetActive} />
        <CatalogSection setActive={handleSetActive} compareList={compareList} setCompareList={setCompareList} />
        <CompareSection compareList={compareList} />
        <CalculatorSection />
        <IntegrationsSection />
        <ReviewsSection />
        <LKSection />
        <ContactsSection />
        <Footer setActive={handleSetActive} />
      </div>
    </div>
  );
}
