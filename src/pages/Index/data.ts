export interface ServiceItem {
  name: string;
  description: string;
  price?: string;
  icon: string;
}

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
  // Extended profile
  photos: string[];
  detailedDescription: string;
  services: ServiceItem[];
  foundedYear: number;
  warehouseArea: number;
  team: number;
  workingHours: string;
  certificates: string[];
}

const WAREHOUSE_1 = "https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/8256f2c4-241c-42d2-8230-d5bfc2500632.jpg";
const WAREHOUSE_2 = "https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/50769c7c-14e6-4e75-916e-8ad4935738ae.jpg";
const WAREHOUSE_3 = "https://cdn.poehali.dev/projects/2ad3c041-f607-4d31-bfee-ec63231b2c3d/files/2e0a9110-d53d-405e-8f72-d5769a958f6c.jpg";

const DEFAULT_SERVICES: ServiceItem[] = [
  { name: "Приёмка товара", description: "Разгрузка, пересчёт, проверка качества и соответствия накладным", icon: "Truck" },
  { name: "Хранение", description: "Адресное хранение с климат-контролем и круглосуточной охраной", icon: "Warehouse" },
  { name: "Сборка заказов", description: "Быстрая комплектация и упаковка с гарантией отсутствия брака", icon: "Package" },
  { name: "Отгрузка на маркетплейсы", description: "Доставка на склады WB, Ozon, Яндекс Маркет по расписанию", icon: "Send" },
  { name: "Работа с возвратами", description: "Приёмка возвратов, оценка состояния, возврат в продажу или клиенту", icon: "RefreshCw" },
  { name: "Маркировка «Честный знак»", description: "Нанесение кодов Data Matrix на товары подлежащие маркировке", icon: "Tag" },
];

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
    photos: [WAREHOUSE_1, WAREHOUSE_2, WAREHOUSE_3],
    detailedDescription: "LogiMaster — один из лидеров российского рынка фулфилмент-услуг для e-commerce. С 2015 года мы помогаем селлерам масштабировать бизнес на маркетплейсах. Наш собственный склад класса A площадью 15 000 м² расположен в 10 км от МКАД, оборудован автоматизированной системой хранения и отгрузки. Команда из 120 сотрудников обрабатывает до 12 000 заказов в сутки. Мы работаем со всеми крупными маркетплейсами и гарантируем скорость обработки заказов в течение 2 часов с момента поступления.",
    services: [
      ...DEFAULT_SERVICES,
      { name: "Доставка день-в-день", description: "Экспресс-отгрузка в Москве и МО в течение 4 часов", price: "от 350 ₽", icon: "Zap" },
      { name: "Видеоконтроль 24/7", description: "Онлайн-доступ к камерам склада через личный кабинет", icon: "Camera" },
      { name: "Работа с опасными грузами", description: "Сертифицированное хранение ЛВЖ, АКБ, аэрозолей", icon: "AlertTriangle" },
    ],
    foundedYear: 2015,
    warehouseArea: 15000,
    team: 120,
    workingHours: "Пн–Вс, 24/7",
    certificates: ["ISO 9001", "Сертификат WB", "Сертификат Ozon"],
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
    photos: [WAREHOUSE_2, WAREHOUSE_1, WAREHOUSE_3],
    detailedDescription: "FulFast специализируется на быстром фулфилменте для fashion-сегмента. Мы знаем все тонкости работы с одеждой и аксессуарами: правильное хранение, деликатная обработка, проверка качества перед отгрузкой. Наш склад в Санкт-Петербурге обрабатывает до 3 000 заказов в сутки с гарантированной скоростью сборки — 90 минут с момента поступления заказа. Работаем с брендами одежды любого масштаба — от начинающих селлеров до известных marketplace-игроков.",
    services: DEFAULT_SERVICES.slice(0, 5).concat([
      { name: "Глажка и отпаривание", description: "Профессиональная подготовка одежды перед отгрузкой", price: "от 30 ₽/ед", icon: "Sparkles" },
      { name: "Фотосъёмка товара", description: "Предметная и имиджевая съёмка для карточек товаров", price: "от 200 ₽", icon: "Camera" },
    ]),
    foundedYear: 2018,
    warehouseArea: 6500,
    team: 45,
    workingHours: "Пн–Сб, 08:00–22:00",
    certificates: ["Сертификат WB", "Сертификат Ozon"],
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
    photos: [WAREHOUSE_3, WAREHOUSE_1, WAREHOUSE_2],
    detailedDescription: "StorePro — надёжный партнёр для селлеров Уральского региона. 8 лет на рынке, более 200 довольных клиентов. Мы предоставляем полный цикл фулфилмент-услуг: от приёмки до отгрузки и работы с возвратами. Главное наше преимущество — персональный менеджер для каждого клиента и гибкая API-интеграция, которая позволяет подключить нашу систему к вашей CRM за 2–3 дня. Работаем по всем схемам — FBS, FBO и DBS.",
    services: DEFAULT_SERVICES.concat([
      { name: "API-интеграция", description: "Подключение к вашей CRM или 1С за 2–3 дня", price: "бесплатно", icon: "Code2" },
      { name: "Персональный менеджер", description: "Закреплённый специалист с ответом в течение 15 минут", icon: "Headphones" },
    ]),
    foundedYear: 2017,
    warehouseArea: 8200,
    team: 60,
    workingHours: "Пн–Пт, 09:00–21:00",
    certificates: ["ISO 9001", "Сертификат Ozon", "Сертификат Яндекс Маркет"],
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
    photos: [WAREHOUSE_1, WAREHOUSE_3, WAREHOUSE_2],
    detailedDescription: "NordLogistics — идеальный выбор для селлеров, которые только начинают работу на маркетплейсах. Мы предлагаем самые низкие тарифы в регионе и работаем даже с минимальными объёмами от 100 SKU. Наш склад в Новосибирске — ваш надёжный хаб для выхода на сибирский рынок. Команда поможет с первыми отгрузками, подскажет оптимальные решения и проконсультирует по работе с WB.",
    services: DEFAULT_SERVICES.slice(0, 5).concat([
      { name: "Бесплатный пробный период", description: "14 дней бесплатного хранения для новых клиентов", icon: "Gift" },
    ]),
    foundedYear: 2020,
    warehouseArea: 3500,
    team: 22,
    workingHours: "Пн–Сб, 09:00–20:00",
    certificates: ["Сертификат WB"],
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
    photos: [WAREHOUSE_2, WAREHOUSE_3, WAREHOUSE_1],
    detailedDescription: "MegaFulfill — крупнейший независимый фулфилмент-оператор Москвы. Мы управляем тремя складами класса A+ общей площадью 50 000 м². В нашей команде более 300 сотрудников. Обрабатываем свыше 50 000 заказов в сутки для сотен селлеров крупного и среднего бизнеса. Располагаем температурным режимом (от -25°C до +25°C), зоной для опасных грузов, автоматизированными конвейерами и собственной курьерской службой.",
    services: DEFAULT_SERVICES.concat([
      { name: "Температурный режим", description: "Холодильные камеры от -25°C до +25°C", price: "от 25 ₽/ед/день", icon: "Thermometer" },
      { name: "Опасные грузы", description: "Сертифицированные склады класса B и C", price: "по запросу", icon: "AlertTriangle" },
      { name: "Собственная доставка", description: "Курьерская служба по всей Москве и МО", price: "от 95 ₽", icon: "Truck" },
      { name: "Комплектация наборов", description: "Сборка подарочных и товарных наборов", price: "от 25 ₽/набор", icon: "Boxes" },
    ]),
    foundedYear: 2012,
    warehouseArea: 50000,
    team: 320,
    workingHours: "24/7 без выходных",
    certificates: ["ISO 9001", "ISO 14001", "Сертификат WB", "Сертификат Ozon", "Сертификат Яндекс Маркет"],
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
    photos: [WAREHOUSE_3, WAREHOUSE_2, WAREHOUSE_1],
    detailedDescription: "SmartStore — первый роботизированный фулфилмент-склад в Поволжье. Используем складские роботы AutoStore, которые сокращают время сборки заказа в 3 раза и полностью исключают пересорт. Современная WMS-система с открытым API позволяет подключиться к нашей платформе из любой учётной системы. Работаем с категориями, требующими температурного режима — косметика, БАДы, продукты питания.",
    services: DEFAULT_SERVICES.concat([
      { name: "Роботизированная сборка", description: "Автоматизированные ячейки AutoStore — 0% пересорта", icon: "Bot" },
      { name: "Температурный режим +5°C", description: "Хранение косметики, БАДов и парфюмерии", price: "от 18 ₽/ед/день", icon: "Thermometer" },
      { name: "Открытый API", description: "REST API для интеграции с любыми системами", price: "бесплатно", icon: "Code2" },
    ]),
    foundedYear: 2019,
    warehouseArea: 9500,
    team: 55,
    workingHours: "Пн–Вс, 08:00–23:00",
    certificates: ["ISO 9001", "Сертификат Ozon"],
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
    photos: [WAREHOUSE_1, WAREHOUSE_2, WAREHOUSE_3],
    detailedDescription: "SafeCargo — единственный в регионе фулфилмент-оператор с полным пакетом разрешений на работу с опасными и крупногабаритными грузами. Наши склады классов B и C сертифицированы МЧС. Мы работаем с ЛВЖ, аккумуляторами, аэрозолями, пиротехникой и бытовой химией. Отдельная зона для крупногабаритных товаров весом до 500 кг. Круглосуточная вооружённая охрана, видеонаблюдение по всему периметру.",
    services: DEFAULT_SERVICES.concat([
      { name: "Опасные грузы класса B", description: "ЛВЖ, аэрозоли, бытовая химия", price: "от 20 ₽/ед/день", icon: "AlertTriangle" },
      { name: "Крупногабаритные товары", description: "Вес до 500 кг, высота до 3 м", price: "по запросу", icon: "Package" },
      { name: "Вооружённая охрана 24/7", description: "Пост охраны и патрулирование территории", icon: "Shield" },
    ]),
    foundedYear: 2016,
    warehouseArea: 7800,
    team: 48,
    workingHours: "Пн–Пт, 08:00–20:00",
    certificates: ["ISO 9001", "Разрешение МЧС", "Лицензия на хранение ЛВЖ"],
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
    photos: [WAREHOUSE_2, WAREHOUSE_1, WAREHOUSE_3],
    detailedDescription: "ExpressHub — это фулфилмент с акцентом на скорость. Наше ключевое преимущество — гарантированная доставка день-в-день по Москве и Московской области. Мы обрабатываем заказы в течение 30 минут с момента поступления и отправляем курьера сразу же. Подходит для селлеров, которым критична скорость доставки: fashion, гаджеты, подарки, продукты.",
    services: DEFAULT_SERVICES.slice(0, 5).concat([
      { name: "Доставка за 2 часа", description: "Экспресс по Москве в пределах ТТК", price: "от 450 ₽", icon: "Zap" },
      { name: "Доставка день-в-день", description: "По Москве и МО", price: "от 120 ₽", icon: "Clock" },
      { name: "Ночная сборка", description: "Сборка заказов с 22:00 до 06:00", icon: "Moon" },
    ]),
    foundedYear: 2019,
    warehouseArea: 5200,
    team: 38,
    workingHours: "24/7 без выходных",
    certificates: ["Сертификат WB", "Сертификат Ozon"],
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
