export interface Partner {
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

export const PARTNERS: Partner[] = [
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

// Feature definitions
export const FEATURE_FILTERS = [
  { key: "cameras", label: "Видеонаблюдение", icon: "Camera" },
  { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle" },
  { key: "returns", label: "Работа с возвратами", icon: "RefreshCw" },
  { key: "same_day", label: "Доставка день в день", icon: "Zap" },
  { key: "temp_control", label: "Температурный режим", icon: "Thermometer" },
];

export const SCHEME_FILTERS = ["FBS", "FBO", "DBS"];

export const PACKAGING_FILTERS = ["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка", "Деревянная обрешётка", "Металлический контейнер"];

export const MARKETPLACE_FILTERS = ["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Ali"];
