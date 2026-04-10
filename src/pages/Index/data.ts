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
  photos: string[];
  detailedDescription: string;
  services: ServiceItem[];
  foundedYear: number;
  warehouseArea: number;
  team: number;
  workingHours: string;
  certificates: string[];
  specializations?: string[];
  address?: string;
}

export const PARTNERS: Partner[] = [];

// Feature definitions
export const FEATURE_FILTERS = [
  { key: "cameras", label: "Видеонаблюдение", icon: "Camera" },
  { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle" },
  { key: "returns", label: "Работа с возвратами", icon: "RefreshCw" },
  { key: "same_day", label: "Доставка день в день", icon: "Zap" },
  { key: "temp_control", label: "Температурный режим", icon: "Thermometer" },
  { key: "honest_mark", label: "Маркировка Честный Знак", icon: "Tag" },
  { key: "defect_check", label: "Проверка на брак", icon: "ShieldCheck" },
  { key: "seller_packaging", label: "Упаковка в пакет продавца", icon: "ShoppingBag" },
  { key: "shipment_prep", label: "Подготовка к отгрузке", icon: "PackageCheck" },
  { key: "barcode_check", label: "Проверка штрихкода", icon: "ScanLine" },
  { key: "cargo_receive", label: "Получение товара карго", icon: "Ship" },
];

export const SCHEME_FILTERS = ["FBS", "FBO", "DBS", "Кросс-докинг"];

export const PACKAGING_FILTERS = ["Полиэтилен (ПВД)", "Коробка (картон)", "Воздушно-пузырьковая плёнка (ВПП)", "Термоусадочная плёнка (ПОФ)", "Деревянная обрешётка", "Фирменные пакеты", "Индивидуальная упаковка"];

export const MARKETPLACE_FILTERS = ["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Ali"];

// Specialization definitions (типы товаров, с которыми работает фулфилмент)
export const SPECIALIZATION_FILTERS = [
  { key: "small_goods", label: "Мелкие товары", icon: "Boxes" },
  { key: "cosmetics", label: "Косметика", icon: "Sparkles" },
  { key: "clothing", label: "Обувь, одежда", icon: "Shirt" },
  { key: "fuel_lubricants", label: "Горюче-смазочные материалы", icon: "Fuel" },
  { key: "construction", label: "Строительные материалы", icon: "Hammer" },
  { key: "appliances", label: "Бытовая техника", icon: "WashingMachine" },
  { key: "electronics", label: "Электроника", icon: "Cpu" },
];