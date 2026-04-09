import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PARTNERS = [
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
  },
];

const REVIEWS = [
  {
    id: 1,
    author: "Алексей Морозов",
    company: "BrandStore",
    avatar: "АМ",
    partner: "LogiMaster",
    rating: 5,
    text: "Работаем уже 2 года. Процент брака почти нулевой, скорость обработки отличная. Отдельно хочу отметить качество упаковки — покупатели часто пишут об этом в отзывах.",
    date: "Март 2026",
  },
  {
    id: 2,
    author: "Мария Иванова",
    company: "FashionLine",
    avatar: "МИ",
    partner: "FulFast",
    rating: 5,
    text: "Перешли от другого оператора — разница колоссальная. Заказы уходят в день поступления, менеджер всегда на связи. Рекомендую всем, кто работает с одеждой.",
    date: "Апрель 2026",
  },
  {
    id: 3,
    author: "Дмитрий Соколов",
    company: "TechGoods",
    avatar: "ДС",
    partner: "StorePro",
    rating: 5,
    text: "Для нас важна была API-интеграция с нашей CRM. Всё сделали за 3 дня. Теперь весь учёт автоматический, экономим минимум 40 часов в месяц.",
    date: "Февраль 2026",
  },
];

const INTEGRATIONS = [
  { name: "Wildberries API", icon: "🟣", status: "Активно", desc: "Полная интеграция: заказы, остатки, аналитика" },
  { name: "Ozon API", icon: "🔵", status: "Активно", desc: "Автосинхронизация каталога и статусов" },
  { name: "Яндекс Маркет", icon: "🟡", status: "Активно", desc: "FBS и FBY схемы работы" },
  { name: "1С Предприятие", icon: "🔴", status: "Активно", desc: "Двусторонняя синхронизация данных" },
  { name: "МойСклад", icon: "🟢", status: "Активно", desc: "Управление складскими остатками" },
  { name: "REST API", icon: "⚙️", status: "Документация", desc: "Полное API для разработчиков" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
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
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${colors[color] || colors.blue}`}>
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
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button onClick={() => setActive("hero")} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded flex items-center justify-center">
            <Icon name="Package" size={16} className="text-navy-950" />
          </div>
          <span className="font-golos font-bold text-white text-lg tracking-tight">FulfillHub</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setActive(l.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                active === l.id ? "bg-gold-500/20 text-gold-400" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActive("lk")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              active === "lk" ? "bg-gold-500/20 text-gold-400" : "text-white/70 hover:text-white"
            }`}
          >
            Войти
          </button>
          <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm" onClick={() => setActive("lk")}>
            Зарегистрироваться
          </Button>
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { setActive(l.id); setMobileOpen(false); }}
              className="text-left px-3 py-2 rounded text-sm text-white/80 hover:bg-white/10"
            >
              {l.label}
            </button>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 border-white/30 text-white bg-transparent hover:bg-white/10" onClick={() => { setActive("lk"); setMobileOpen(false); }}>Войти</Button>
            <Button size="sm" className="flex-1 bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400" onClick={() => { setActive("lk"); setMobileOpen(false); }}>Регистрация</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function HeroSection({ setActive }: { setActive: (s: string) => void }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-navy-gradient" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/8c7181ef-d597-45e4-8217-9f0563dabf62.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-transparent" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6 opacity-0 animate-fade-in">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase font-ibm">B2B Платформа</span>
          </div>
          <h1 className="font-golos font-black text-5xl md:text-7xl leading-none text-white mb-6 opacity-0 animate-slide-up delay-100">
            Найдите<br />
            <span className="text-gold-gradient">надёжного</span><br />
            партнёра
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-ibm font-light leading-relaxed mb-10 opacity-0 animate-fade-in delay-200">
            Маркетплейс фулфилмент-сервисов для селлеров. Сравнивайте тарифы, читайте проверенные отзывы и выбирайте партнёра под ваш бизнес.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-16 opacity-0 animate-fade-in delay-300">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-base px-8 h-12" onClick={() => setActive("catalog")}>
              <Icon name="Search" size={18} className="mr-2" />
              Найти партнёра
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10 font-semibold text-base h-12" onClick={() => setActive("calculator")}>
              <Icon name="Calculator" size={18} className="mr-2" />
              Рассчитать стоимость
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6 opacity-0 animate-fade-in delay-400">
            {[
              { value: "200+", label: "Фулфилмент сервисов" },
              { value: "15 000+", label: "Активных селлеров" },
              { value: "98%", label: "Успешных сделок" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="text-3xl md:text-4xl font-golos font-black text-gold-gradient">{stat.value}</div>
                <div className="text-white/50 text-sm font-ibm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-white/50 text-xs font-ibm">Прокрутите вниз</span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ─── CATALOG ─────────────────────────────────────────────────────────────────

function CatalogSection({ setActive, compareList, setCompareList }: {
  setActive: (s: string) => void;
  compareList: number[];
  setCompareList: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [search, setSearch] = useState("");
  const [selectedMp, setSelectedMp] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const marketplaces = ["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет"];

  const filtered = PARTNERS
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
      const matchMp = !selectedMp || p.tags.includes(selectedMp);
      return matchSearch && matchMp;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return a.name.localeCompare(b.name);
    });

  const toggleCompare = (id: number) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <section id="catalog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Партнёры</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-golos font-black text-4xl text-navy-900">Каталог фулфилмент сервисов</h2>
              <p className="text-gray-500 mt-2 font-ibm">200+ проверенных операторов по всей России</p>
            </div>
            {compareList.length > 0 && (
              <Button className="bg-navy-900 hover:bg-navy-800 text-white font-semibold" onClick={() => setActive("compare")}>
                <Icon name="GitCompare" size={16} className="mr-2" />
                Сравнить {compareList.length} из 3
              </Button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию или городу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 font-ibm">Маркетплейс:</span>
            {marketplaces.map((mp) => (
              <button
                key={mp}
                onClick={() => setSelectedMp(selectedMp === mp ? null : mp)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  selectedMp === mp ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-900/40"
                }`}
              >
                {mp}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white font-ibm focus:outline-none cursor-pointer"
          >
            <option value="rating">По рейтингу</option>
            <option value="reviews">По отзывам</option>
            <option value="name">По названию</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-5 card-hover shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-navy-50 rounded-lg flex items-center justify-center text-2xl">{p.logo}</div>
                  <div>
                    <div className="font-golos font-bold text-navy-900">{p.name}</div>
                    <div className="text-xs text-gray-400 font-ibm flex items-center gap-1 mt-0.5">
                      <Icon name="MapPin" size={11} />{p.location}
                    </div>
                  </div>
                </div>
                <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
              </div>
              <p className="text-sm text-gray-500 font-ibm leading-relaxed mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-ibm">Хранение</div>
                  <div className="text-xs font-semibold text-navy-900 mt-0.5">{p.storage}</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-xs text-gray-400 font-ibm">Сборка</div>
                  <div className="text-xs font-semibold text-navy-900 mt-0.5">{p.assembly}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-ibm">Доставка</div>
                  <div className="text-xs font-semibold text-navy-900 mt-0.5">{p.delivery}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating rating={p.rating} />
                  <span className="text-sm font-semibold text-navy-900">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews})</span>
                </div>
                <button
                  onClick={() => toggleCompare(p.id)}
                  className={`text-xs px-3 py-1.5 rounded border font-medium transition-all ${
                    compareList.includes(p.id) ? "bg-navy-900 text-white border-navy-900" : "border-gray-200 text-gray-500 hover:border-navy-900/50"
                  }`}
                >
                  {compareList.includes(p.id) ? "✓ Добавлено" : "Сравнить"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-ibm">
            <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-40" />
            <p>Ничего не найдено. Попробуйте изменить фильтры.</p>
          </div>
        )}
      </div>
    </section>
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
    { label: "Сборка заказа", key: "assembly" },
    { label: "Доставка", key: "delivery" },
  ];

  return (
    <section id="compare" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Сравнение</span>
          </div>
          <h2 className="font-golos font-black text-4xl text-navy-900">Сравнение партнёров</h2>
          <p className="text-gray-500 mt-2 font-ibm">Детальное сравнение услуг и тарифов</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <div className="grid min-w-[640px]" style={{ gridTemplateColumns: `1fr repeat(${selected.length}, 1fr)` }}>
            <div className="p-5 bg-gray-50 border-b border-r border-gray-100 font-golos font-semibold text-gray-500 text-sm">Параметр</div>
            {selected.map((p) => (
              <div key={p.id} className="p-5 border-b border-r border-gray-100 last:border-r-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{p.logo}</span>
                  <span className="font-golos font-bold text-navy-900">{p.name}</span>
                </div>
                <BadgeChip color={p.badgeColor}>{p.badge}</BadgeChip>
              </div>
            ))}

            {rows.map((row, i) => (
              <>
                <div key={`label-${row.key}`} className={`p-4 border-b border-r border-gray-100 font-medium text-gray-600 text-sm font-ibm flex items-center ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  {row.label}
                </div>
                {selected.map((p) => (
                  <div key={`${p.id}-${row.key}`} className={`p-4 border-b border-r border-gray-100 last:border-r-0 text-sm text-navy-900 font-ibm flex items-center ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    {row.key === "rating" ? (
                      <div className="flex items-center gap-1.5"><StarRating rating={p.rating} /><span className="font-semibold">{p.rating}</span></div>
                    ) : row.key === "reviews" ? (
                      `${p.reviews} отзывов`
                    ) : (
                      String(p[row.key as keyof typeof p])
                    )}
                  </div>
                ))}
              </>
            ))}

            <div className="p-4 border-r border-gray-100 font-medium text-gray-600 text-sm font-ibm">Маркетплейсы</div>
            {selected.map((p) => (
              <div key={`tags-${p.id}`} className="p-4 border-r border-gray-100 last:border-r-0 flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {compareList.length < 2 && (
          <p className="text-center text-sm text-gray-400 font-ibm mt-4">
            Для сравнения выбранных партнёров нажмите «Сравнить» в карточках каталога (до 3 партнёров)
          </p>
        )}
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
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Калькулятор</span>
          </div>
          <h2 className="font-golos font-black text-4xl text-navy-900">Рассчитайте стоимость</h2>
          <p className="text-gray-500 mt-2 font-ibm">Введите параметры и получите предварительный расчёт</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="text-sm font-semibold text-navy-900 mb-3 font-golos">Выберите партнёра</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PARTNERS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setPartnerIdx(i)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${
                      partnerIdx === i ? "border-navy-900 bg-navy-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-navy-900/40"
                    }`}
                  >
                    <span className="text-base">{p.logo}</span>
                    <span className="font-medium truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {[
              { label: "Количество SKU", value: sku, setValue: setSku, min: 50, max: 5000, step: 50, suffix: "позиций" },
              { label: "Заказов в месяц", value: orders, setValue: setOrders, min: 50, max: 10000, step: 50, suffix: "заказов" },
              { label: "Среднее кол-во единиц в заказе", value: avgItems, setValue: setAvgItems, min: 1, max: 10, step: 1, suffix: "ед." },
              { label: "Дней хранения в месяц", value: storageDays, setValue: setStorageDays, min: 1, max: 30, step: 1, suffix: "дней" },
            ].map(({ label, value, setValue, min, max, step, suffix }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-navy-900 font-golos">{label}</span>
                  <span className="text-base font-bold text-navy-900 font-golos">
                    {value.toLocaleString("ru-RU")} <span className="text-sm text-gray-400 font-normal">{suffix}</span>
                  </span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={(v) => setValue(v[0])}
                  min={min}
                  max={max}
                  step={step}
                />
                <div className="flex justify-between text-xs text-gray-400 font-ibm mt-1">
                  <span>{min.toLocaleString("ru-RU")}</span>
                  <span>{max.toLocaleString("ru-RU")}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-navy-gradient rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <Icon name="Calculator" size={16} className="text-gold-400" />
                </div>
                <span className="font-golos font-bold">Предварительный расчёт</span>
              </div>

              <div className="flex items-center gap-2 mb-5 p-3 bg-white/10 rounded-lg">
                <span className="text-lg">{selected.logo}</span>
                <div>
                  <div className="font-semibold text-sm">{selected.name}</div>
                  <div className="text-xs text-white/50">{selected.location}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Хранение", value: storageCost, desc: `${sku} × ${selected.storageRate} ₽ × ${storageDays} дн.` },
                  { label: "Сборка заказов", value: assemblyCost, desc: `${orders} × ${selected.assemblyRate} ₽ × ${avgItems} ед.` },
                  { label: "Доставка", value: deliveryCost, desc: `${orders} заказов × ${selected.deliveryRate} ₽` },
                ].map(({ label, value, desc }) => (
                  <div key={label} className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70 font-ibm">{label}</span>
                      <span className="font-golos font-bold">{fmt(value)} ₽</span>
                    </div>
                    <div className="text-xs text-white/40 font-ibm mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 font-ibm">Итого в месяц</span>
                  <span className="text-2xl font-golos font-black text-gold-gradient">{fmt(total)} ₽</span>
                </div>
                <div className="text-xs text-white/40 font-ibm mt-1">* Предварительный расчёт. Окончательная стоимость — после согласования с партнёром.</div>
              </div>

              <Button className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos">
                <Icon name="Send" size={16} className="mr-2" />
                Запросить КП
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
    <section id="integrations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Технологии</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-golos font-black text-4xl text-navy-900">Интеграции и API</h2>
              <p className="text-gray-500 mt-2 font-ibm">Подключайте платформу к вашим системам</p>
            </div>
            <Button variant="outline" className="border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-semibold w-fit">
              <Icon name="FileCode" size={16} className="mr-2" />
              API документация
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="bg-white border border-gray-100 rounded-xl p-5 card-hover shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <span className="font-golos font-bold text-navy-900">{int.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${int.status === "Активно" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                  {int.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-ibm">{int.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-navy-gradient rounded-2xl p-8 md:p-10 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Code2" size={20} className="text-gold-400" />
                <span className="text-gold-400 text-sm font-medium font-ibm">REST API</span>
              </div>
              <h3 className="font-golos font-black text-3xl mb-3">Открытый API для разработчиков</h3>
              <p className="text-white/70 font-ibm leading-relaxed mb-5">
                Полная документация OpenAPI 3.0. Управляйте заказами, остатками и аналитикой через HTTP запросы.
              </p>
              <div className="flex gap-3">
                <Button className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold">Получить токен</Button>
                <Button variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10">Документация</Button>
              </div>
            </div>
            <div className="bg-black/30 rounded-xl p-5 font-mono text-sm overflow-x-auto">
              <div className="text-green-400 mb-1">// GET /api/v1/partners</div>
              <div className="text-white/60">{"{"}</div>
              <div className="text-white/60 ml-4">"status": <span className="text-gold-400">"ok"</span>,</div>
              <div className="text-white/60 ml-4">"data": {"["}</div>
              <div className="text-white/60 ml-8">{"{"}</div>
              <div className="text-white/60 ml-12">"id": <span className="text-gold-400">1</span>,</div>
              <div className="text-white/60 ml-12">"name": <span className="text-gold-400">"LogiMaster"</span>,</div>
              <div className="text-white/60 ml-12">"rating": <span className="text-gold-400">4.9</span></div>
              <div className="text-white/60 ml-8">{"}"}</div>
              <div className="text-white/60 ml-4">{"]"}</div>
              <div className="text-white/60">{"}"}</div>
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
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Отзывы</span>
          </div>
          <h2 className="font-golos font-black text-4xl text-navy-900">Что говорят селлеры</h2>
          <p className="text-gray-500 mt-2 font-ibm">Реальные отзывы от проверенных пользователей платформы</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {REVIEWS.map((r) => (
            <div key={r.id} className="bg-gray-50 border border-gray-100 rounded-xl p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-sm">{r.avatar}</div>
                  <div>
                    <div className="font-golos font-bold text-navy-900 text-sm">{r.author}</div>
                    <div className="text-xs text-gray-400 font-ibm">{r.company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={r.rating} size={12} />
                  <div className="text-xs text-gray-400 font-ibm mt-0.5">{r.date}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-ibm leading-relaxed mb-3">"{r.text}"</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-ibm">
                <Icon name="Building2" size={11} />
                Партнёр: <span className="text-navy-700 font-medium">{r.partner}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-navy-50 border border-navy-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-golos font-bold text-xl text-navy-900">Работаете с фулфилмент партнёром?</h3>
            <p className="text-gray-500 font-ibm text-sm mt-1">Оставьте честный отзыв и помогите другим селлерам сделать правильный выбор</p>
          </div>
          <Button className="bg-navy-900 hover:bg-navy-800 text-white font-semibold whitespace-nowrap">
            <Icon name="PenLine" size={16} className="mr-2" />
            Написать отзыв
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
    <section id="lk" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Личный кабинет</span>
          </div>
          <h2 className="font-golos font-black text-4xl text-navy-900">Войти в систему</h2>
        </div>

        <div className="max-w-lg">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-6">
            <button onClick={() => setTab("seller")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all font-golos ${tab === "seller" ? "bg-navy-900 text-white" : "text-gray-500 hover:text-navy-900"}`}>
              Я — Селлер
            </button>
            <button onClick={() => setTab("ff")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all font-golos ${tab === "ff" ? "bg-navy-900 text-white" : "text-gray-500 hover:text-navy-900"}`}>
              Я — Фулфилмент
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
                <Icon name={tab === "seller" ? "ShoppingBag" : "Warehouse"} size={20} className="text-navy-900" />
              </div>
              <div>
                <div className="font-golos font-bold text-navy-900">{tab === "seller" ? "Кабинет селлера" : "Кабинет оператора"}</div>
                <div className="text-xs text-gray-400 font-ibm">{tab === "seller" ? "Управление заказами и партнёрами" : "Управление услугами и тарифами"}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 font-golos block mb-1.5">Email</label>
                <input type="email" placeholder="name@company.ru" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 font-golos block mb-1.5">Пароль</label>
                <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              </div>
              <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-11">Войти</Button>
              <div className="text-center">
                <span className="text-sm text-gray-400 font-ibm">Нет аккаунта? </span>
                <button className="text-sm text-navy-700 font-semibold font-ibm hover:underline">Зарегистрироваться</button>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="text-xs text-gray-400 font-ibm mb-3 uppercase tracking-wide">Доступно после входа</div>
              <div className="space-y-2">
                {(tab === "seller"
                  ? ["Мои партнёры и контракты", "Аналитика заказов", "Калькулятор тарифов", "Чат с поддержкой"]
                  : ["Управление тарифами", "Заявки от селлеров", "Аналитика загрузки", "API ключи и вебхуки"]
                ).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600 font-ibm">
                    <Icon name="Check" size={14} className="text-gold-500" />
                    {item}
                  </div>
                ))}
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
    <section id="contacts" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase font-ibm">Контакты</span>
          </div>
          <h2 className="font-golos font-black text-4xl text-navy-900">Свяжитесь с нами</h2>
          <p className="text-gray-500 mt-2 font-ibm">Ответим в течение 2 часов в рабочее время</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail", label: "Email", value: "hello@fulfillhub.ru", sub: "Ответим в течение 2 ч." },
              { icon: "MessageSquare", label: "Telegram", value: "@fulfillhub", sub: "Быстрая связь" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 card-hover">
                <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={c.icon as "Phone"} size={18} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-ibm">{c.label}</div>
                  <div className="font-golos font-semibold text-navy-900">{c.value}</div>
                  <div className="text-xs text-gray-400 font-ibm">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-gray-50 border border-gray-100 rounded-2xl p-7">
            <h3 className="font-golos font-bold text-xl text-navy-900 mb-5">Задайте вопрос</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 font-golos block mb-1.5">Имя</label>
                <input placeholder="Ваше имя" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 font-golos block mb-1.5">Компания</label>
                <input placeholder="Название компании" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 font-golos block mb-1.5">Email</label>
              <input type="email" placeholder="name@company.ru" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 font-golos block mb-1.5">Сообщение</label>
              <textarea rows={4} placeholder="Опишите ваш вопрос или запрос..." className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 resize-none" />
            </div>
            <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-11 px-8">
              <Icon name="Send" size={16} className="mr-2" />
              Отправить сообщение
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
    <footer className="bg-navy-gradient text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={16} className="text-navy-950" />
              </div>
              <span className="font-golos font-bold text-white text-lg">FulfillHub</span>
            </div>
            <p className="text-white/50 text-sm font-ibm leading-relaxed">B2B платформа для поиска и сравнения фулфилмент-партнёров</p>
          </div>
          {[
            { title: "Платформа", links: [{ label: "Каталог", id: "catalog" }, { label: "Сравнение", id: "compare" }, { label: "Калькулятор", id: "calculator" }, { label: "Отзывы", id: "reviews" }] },
            { title: "Для бизнеса", links: [{ label: "Для селлеров", id: "lk" }, { label: "Для операторов", id: "lk" }, { label: "API и интеграции", id: "integrations" }, { label: "Контакты", id: "contacts" }] },
            { title: "Компания", links: [{ label: "О нас", id: "hero" }, { label: "Блог", id: "hero" }, { label: "Партнёрство", id: "contacts" }, { label: "Поддержка", id: "contacts" }] },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-golos font-bold text-sm mb-3 text-white/80">{col.title}</div>
              <div className="space-y-2">
                {col.links.map((l) => (
                  <button key={l.label} onClick={() => setActive(l.id)} className="block text-sm text-white/50 hover:text-white/80 transition-colors font-ibm">{l.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 font-ibm">
          <span>© 2026 FulfillHub. Все права защищены.</span>
          <div className="flex gap-4">
            <button className="hover:text-white/60 transition-colors">Политика конфиденциальности</button>
            <button className="hover:text-white/60 transition-colors">Условия использования</button>
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
  );
}
