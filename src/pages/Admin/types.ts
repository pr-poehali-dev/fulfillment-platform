// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface Profile {
  id?: number;
  status?: string;
  moderation_comment?: string;
  company_name: string;
  inn: string;
  city: string;
  warehouse_area: string;
  founded_year: string;
  description: string;
  detailed_description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_tg: string;
  work_schemes: string[];
  features: string[];
  packaging_types: string[];
  marketplaces: string[];
  specializations: string[];
  storage_price: string;
  assembly_price: string;
  delivery_price: string;
  min_volume: string;
  has_trial: boolean;
  team_size: string;
  working_hours: string;
  photos: string[];
}

export interface Quote {
  id: number;
  sender_name: string;
  sender_company: string;
  sender_email: string;
  sender_phone: string;
  sku_count: number;
  orders_count: number;
  message: string;
  status: string;
  created_at: string;
}

export type Tab = "profile" | "quotes" | "settings";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

export const EMPTY_PROFILE: Profile = {
  company_name: "", inn: "", city: "", warehouse_area: "", founded_year: "",
  description: "", detailed_description: "",
  contact_name: "", contact_email: "", contact_phone: "", contact_tg: "",
  work_schemes: [], features: [], packaging_types: [], marketplaces: [], specializations: [],
  storage_price: "", assembly_price: "", delivery_price: "", min_volume: "",
  has_trial: false, team_size: "", working_hours: "", photos: [],
};

export const WORK_SCHEME_OPTIONS = ["FBS", "FBO", "DBS"];

export const FEATURE_OPTIONS: { key: string; label: string; icon: string }[] = [
  { key: "cameras", label: "Видеонаблюдение", icon: "Camera" },
  { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle" },
  { key: "returns", label: "Обработка возвратов", icon: "RefreshCw" },
  { key: "same_day", label: "Сборка день в день", icon: "Zap" },
  { key: "temp_control", label: "Температурный контроль", icon: "Thermometer" },
  { key: "packaging", label: "Упаковка под ключ", icon: "Package" },
  { key: "honest_mark", label: "Маркировка Честный Знак", icon: "Tag" },
  { key: "defect_check", label: "Проверка на брак", icon: "ShieldCheck" },
  { key: "seller_packaging", label: "Упаковка в пакет продавца", icon: "ShoppingBag" },
  { key: "shipment_prep", label: "Подготовка к отгрузке", icon: "PackageCheck" },
  { key: "barcode_check", label: "Проверка штрихкода", icon: "ScanLine" },
  { key: "cargo_receive", label: "Получение товара карго", icon: "Ship" },
];

export const SPECIALIZATION_OPTIONS: { key: string; label: string; icon: string }[] = [
  { key: "small_goods", label: "Мелкие товары", icon: "Boxes" },
  { key: "cosmetics", label: "Косметика", icon: "Sparkles" },
  { key: "clothing", label: "Обувь, одежда", icon: "Shirt" },
  { key: "fuel_lubricants", label: "Горюче-смазочные материалы", icon: "Fuel" },
  { key: "construction", label: "Строительные материалы", icon: "Hammer" },
  { key: "appliances", label: "Бытовая техника", icon: "WashingMachine" },
  { key: "electronics", label: "Электроника", icon: "Cpu" },
];

export const MARKETPLACE_OPTIONS = ["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Lamoda", "AliExpress"];

export const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "На модерации", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  approved: { label: "Одобрен", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Отклонён", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  draft: { label: "Черновик", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

export const QUOTE_STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: "Новая", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  in_progress: { label: "В работе", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  answered: { label: "Отправлено КП", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  closed: { label: "Закрыта", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};
