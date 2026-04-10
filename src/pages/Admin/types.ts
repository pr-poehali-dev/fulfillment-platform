// ─── OWNER PROFILE ───────────────────────────────────────────────────────────

export interface OwnerProfile {
  id?: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_tg: string;
  inn: string;
  created_at?: string;
}

export const EMPTY_OWNER_PROFILE: OwnerProfile = {
  contact_name: "", contact_email: "", contact_phone: "", contact_tg: "", inn: "",
};

// ─── FULFILLMENT ─────────────────────────────────────────────────────────────

export interface Fulfillment {
  id: number;
  company_name: string;
  city: string;
  warehouse_area: string;
  founded_year: string;
  description: string;
  detailed_description: string;
  logo: string;
  photos: string[];
  work_schemes: string[];
  features: string[];
  packaging_types: string[];
  marketplaces: string[];
  specializations: string[];
  storage_price: string;
  assembly_price: string;
  delivery_price: string;
  storage_rate: number;
  assembly_rate: number;
  delivery_rate: number;
  min_volume: string;
  has_trial: boolean;
  team_size: string;
  working_hours: string;
  certificates: string[];
  services: unknown[];
  badge: string;
  badge_color: string;
  rating: number;
  reviews_count: number;
  status: string;
  moderation_comment: string;
  created_at: string;
  updated_at: string;
}

export const EMPTY_FULFILLMENT: Omit<Fulfillment, "id" | "created_at" | "updated_at"> = {
  company_name: "", city: "", warehouse_area: "", founded_year: "",
  description: "", detailed_description: "", logo: "", photos: [],
  work_schemes: [], features: [], packaging_types: [], marketplaces: [], specializations: [],
  storage_price: "", assembly_price: "", delivery_price: "",
  storage_rate: 0, assembly_rate: 0, delivery_rate: 0,
  min_volume: "", has_trial: false, team_size: "", working_hours: "",
  certificates: [], services: [], badge: "", badge_color: "blue",
  rating: 0, reviews_count: 0, status: "draft", moderation_comment: "",
};

// ─── LEGACY (for compatibility) ───────────────────────────────────────────────

export type Profile = Fulfillment & { inn?: string; moderation_comment?: string };
export const EMPTY_PROFILE = { ...EMPTY_FULFILLMENT, id: 0, inn: "", created_at: "", updated_at: "" } as Profile;

// ─── QUOTES ──────────────────────────────────────────────────────────────────

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
  fulfillment_name?: string;
  fulfillment_id?: number;
}

export type Tab = "profile" | "fulfillments" | "quotes" | "settings" | "support";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

export const WORK_SCHEME_OPTIONS = ["FBS", "FBO", "DBS", "Кросс-докинг"];

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

export const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  pending:  { label: "На модерации", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-200" },
  approved: { label: "Активен",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  rejected: { label: "Отклонён",     bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     border: "border-red-200" },
  draft:    { label: "Черновик",     bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400",    border: "border-gray-200" },
  closed:   { label: "Закрыт",       bg: "bg-slate-100",  text: "text-slate-600",   dot: "bg-slate-400",   border: "border-slate-200" },
  active:   { label: "Активен",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
};

export const QUOTE_STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new:         { label: "Новая",        bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  in_progress: { label: "В работе",     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  answered:    { label: "Отправлено КП",bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  closed:      { label: "Закрыта",      bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
};