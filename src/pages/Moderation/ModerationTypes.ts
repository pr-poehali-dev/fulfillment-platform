export interface FulfillmentItem {
  id: number;
  company_name: string;
  city: string;
  inn: string;
  warehouse_area: number | null;
  founded_year: number | null;
  description: string;
  detailed_description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_tg: string;
  work_schemes: string[];
  features: string[];
  marketplaces: string[];
  packaging_types: string[];
  storage_price: number | null;
  assembly_price: number | null;
  delivery_price: number | null;
  min_volume: number | null;
  has_trial: boolean;
  team_size: number | null;
  working_hours: string;
  photos: string[];
  status: string;
  moderation_comment: string;
  created_at: string;
  email_verified: boolean;
  user_email: string;
  lead_price?: number;
  total_leads?: number;
  balance?: number;
}

export interface AdminQuote {
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
  fulfillment_name: string;
  fulfillment_id: number;
  lead_price?: number;
  payment_status?: string;
}

export interface QuoteStats {
  total_leads: number;
  total_revenue: number;
  unpaid_revenue: number;
  paid_revenue: number;
}

export type Tab = "fulfillments" | "quotes";

export const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; icon: string }> = {
  pending:  { label: "На модерации", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   icon: "Clock" },
  approved: { label: "Одобрен",     bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: "CheckCircle" },
  rejected: { label: "Отклонён",    bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     icon: "XCircle" },
  draft:    { label: "Черновик",    bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400",    icon: "FileEdit" },
};

export const QUOTE_STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new:         { label: "Новая",          bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  in_progress: { label: "В работе",       bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  answered:    { label: "Отправлено КП",  bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  closed:      { label: "Закрыта",        bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
};

export const FEATURE_LABELS: Record<string, string> = {
  cameras: "Камеры", dangerous: "Опасные грузы", returns: "Возвраты",
  same_day: "День в день", temp_control: "Темп. режим", packaging: "Упаковка",
};
