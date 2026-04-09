import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface Profile {
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

interface Quote {
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

type Tab = "profile" | "quotes" | "settings";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const EMPTY_PROFILE: Profile = {
  company_name: "", inn: "", city: "", warehouse_area: "", founded_year: "",
  description: "", detailed_description: "",
  contact_name: "", contact_email: "", contact_phone: "", contact_tg: "",
  work_schemes: [], features: [], packaging_types: [], marketplaces: [], specializations: [],
  storage_price: "", assembly_price: "", delivery_price: "", min_volume: "",
  has_trial: false, team_size: "", working_hours: "", photos: [],
};

const WORK_SCHEME_OPTIONS = ["FBS", "FBO", "DBS"];
const FEATURE_OPTIONS: { key: string; label: string; icon: string }[] = [
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
const SPECIALIZATION_OPTIONS: { key: string; label: string; icon: string }[] = [
  { key: "small_goods", label: "Мелкие товары", icon: "Boxes" },
  { key: "cosmetics", label: "Косметика", icon: "Sparkles" },
  { key: "clothing", label: "Обувь, одежда", icon: "Shirt" },
  { key: "fuel_lubricants", label: "Горюче-смазочные материалы", icon: "Fuel" },
  { key: "construction", label: "Строительные материалы", icon: "Hammer" },
  { key: "appliances", label: "Бытовая техника", icon: "WashingMachine" },
  { key: "electronics", label: "Электроника", icon: "Cpu" },
];
const MARKETPLACE_OPTIONS = ["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Lamoda", "AliExpress"];

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "На модерации", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  approved: { label: "Одобрен", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Отклонён", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  draft: { label: "Черновик", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

const QUOTE_STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: "Новая", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  in_progress: { label: "В работе", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  answered: { label: "Отправлено КП", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  closed: { label: "Закрыта", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function Admin() {
  const navigate = useNavigate();
  const { user, fulfillment, loading, logout, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);

  // Email verification state
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [codeHint, setCodeHint] = useState("");
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── AUTH GUARD ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // ─── LOAD PROFILE ─────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const data = await api.getProfile();
      if (data) {
        setProfile({
          ...EMPTY_PROFILE,
          ...data,
          work_schemes: data.work_schemes || [],
          features: data.features || [],
          packaging_types: data.packaging_types || [],
          marketplaces: data.marketplaces || [],
          specializations: data.specializations || [],
          photos: data.photos || [],
          has_trial: !!data.has_trial,
          warehouse_area: data.warehouse_area?.toString() || "",
          founded_year: data.founded_year?.toString() || "",
          storage_price: data.storage_price?.toString() || "",
          assembly_price: data.assembly_price?.toString() || "",
          delivery_price: data.delivery_price?.toString() || "",
          min_volume: data.min_volume?.toString() || "",
          team_size: data.team_size?.toString() || "",
        });
      }
    } catch {
      // Profile may not exist yet - that's ok, use empty
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.email_verified) {
      loadProfile();
    }
  }, [user, loadProfile]);

  // ─── LOAD QUOTES ──────────────────────────────────────────────────────────

  const loadQuotes = useCallback(async () => {
    try {
      setQuotesLoading(true);
      const data = await api.myQuotes();
      setQuotes(data.quotes || data || []);
    } catch {
      setQuotes([]);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "quotes" && user?.email_verified) {
      loadQuotes();
    }
  }, [tab, user, loadQuotes]);

  // ─── RESEND COOLDOWN ─────────────────────────────────────────────────────

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ─── VERIFICATION HANDLERS ────────────────────────────────────────────────

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...verifyCode];
    next[index] = value.slice(-1);
    setVerifyCode(next);
    if (value && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setVerifyCode(next);
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyEmail = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) { setVerifyError("Введите 6-значный код"); return; }
    setVerifyError("");
    setVerifySubmitting(true);
    try {
      await api.verifyEmail(code);
      await refresh();
      toast.success("Email подтверждён");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setVerifyError(e.message || e.detail || "Неверный код");
    } finally {
      setVerifySubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      const data = await api.resendCode();
      if (data.email_code_hint) setCodeHint(data.email_code_hint);
      setResendCooldown(60);
      toast.success("Код отправлен повторно");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось отправить код");
    }
  };

  // ─── LOADING / AUTH CHECK ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // ─── EMAIL VERIFICATION SCREEN ────────────────────────────────────────────

  if (!user.email_verified) {
    return (
      <div className="min-h-screen bg-navy-950 font-golos">
        <nav className="border-b border-navy-800/50 bg-navy-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Icon name="Package" size={18} className="text-navy-950" />
              </div>
              <span className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                Fulfill<span className="text-gold-400 group-hover:text-gold-300">Hub</span>
              </span>
            </Link>
            <button onClick={() => { logout(); navigate("/auth"); }} className="text-sm text-navy-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>
        </nav>

        <div className="flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="MailCheck" size={32} className="text-gold-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Подтвердите email</h1>
              <p className="text-navy-300 text-sm">Мы отправили код на <span className="text-white font-medium">{user.email}</span></p>
            </div>

            <div className="bg-navy-900 border border-navy-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30 space-y-6">
              {codeHint && (
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3 flex items-start gap-2">
                  <Icon name="Info" size={16} className="text-gold-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gold-400 text-xs font-medium mb-0.5">Тестовый режим</p>
                    <p className="text-gold-300 text-sm font-ibm">Код: <span className="font-bold">{codeHint}</span></p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-navy-200 mb-3 text-center">Введите 6-значный код</label>
                <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleCodePaste}>
                  {verifyCode.map((digit, i) => (
                    <input key={i} ref={(el) => { codeRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleCodeInput(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 rounded-lg bg-navy-800 border border-navy-700 text-center text-xl font-ibm font-bold text-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {verifyError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">{verifyError}</p>
                </div>
              )}

              <Button onClick={handleVerifyEmail} disabled={verifySubmitting || verifyCode.join("").length !== 6}
                className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-base rounded-xl disabled:opacity-50">
                {verifySubmitting ? <Icon name="Loader2" size={20} className="animate-spin" /> : <><Icon name="CheckCircle" size={20} /> Подтвердить</>}
              </Button>

              <div className="text-center">
                <button onClick={handleResendCode} disabled={resendCooldown > 0}
                  className="text-sm text-navy-400 hover:text-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {resendCooldown > 0 ? `Отправить повторно (${resendCooldown}с)` : "Отправить повторно"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ───────────────────────────────────────────────────────

  const profileStatus = profile.status || fulfillment?.status || "draft";
  const statusCfg = STATUS_CFG[profileStatus] || STATUS_CFG.draft;

  return (
    <div className="min-h-screen bg-gray-50 font-golos flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-950 text-white transition-transform duration-200 flex flex-col`}>
        {/* Brand */}
        <div className="h-14 px-4 flex items-center gap-2 border-b border-white/10 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <div>
              <div className="font-golos font-bold text-sm leading-none group-hover:text-gold-400 transition-colors">FulfillHub</div>
              <div className="text-xs text-white/40 mt-0.5">Личный кабинет</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Company info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center">
              <Icon name="Building2" size={18} className="text-navy-300" />
            </div>
            <div className="min-w-0">
              <div className="font-golos font-bold text-sm truncate">{profile.company_name || "Не указано"}</div>
              <div className="text-xs text-white/40 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {([
            { id: "profile" as Tab, label: "Профиль", icon: "Building2" },
            { id: "quotes" as Tab, label: "Заявки", icon: "Inbox" },
            { id: "settings" as Tab, label: "Настройки", icon: "Settings" },
          ]).map((item) => (
            <button key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === item.id ? "bg-gold-500/15 text-gold-400" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              <Icon name={item.icon} size={16} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:bg-white/10 hover:text-white/80 transition-all">
            <Icon name="ExternalLink" size={14} />
            Вернуться на сайт
          </Link>
          <button onClick={() => { logout(); navigate("/auth"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:bg-white/10 hover:text-red-300 transition-all">
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 z-30" />}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-gray-500">
            <Icon name="Menu" size={20} />
          </button>
          <div>
            <div className="font-golos font-bold text-navy-900 text-sm">
              {tab === "profile" && "Профиль компании"}
              {tab === "quotes" && "Заявки на КП"}
              {tab === "settings" && "Настройки"}
            </div>
            <div className="text-xs text-gray-400 font-ibm">
              {tab === "profile" && "Как вас видят клиенты в каталоге"}
              {tab === "quotes" && "Входящие запросы от селлеров"}
              {tab === "settings" && "Управление аккаунтом"}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-ibm hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs">
              {(user.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {tab === "profile" && (
            <ProfileTab
              profile={profile}
              setProfile={setProfile}
              profileLoading={profileLoading}
              profileStatus={profileStatus}
              statusCfg={statusCfg}
              moderationComment={profile.moderation_comment}
              onReload={loadProfile}
            />
          )}
          {tab === "quotes" && (
            <QuotesTab quotes={quotes} quotesLoading={quotesLoading} onReload={loadQuotes} />
          )}
          {tab === "settings" && (
            <SettingsTab user={user} onLogout={() => { logout(); navigate("/auth"); }} />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── PROFILE TAB ────────────────────────────────────────────────────────────

function ProfileTab({
  profile, setProfile, profileLoading, profileStatus, statusCfg, moderationComment, onReload,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
  profileLoading: boolean;
  profileStatus: string;
  statusCfg: { label: string; bg: string; text: string; dot: string };
  moderationComment?: string;
  onReload: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Profile, val: unknown) => setProfile({ ...profile, [key]: val });

  const toggleArr = (key: keyof Profile, val: string) => {
    const arr = (profile[key] as string[]) || [];
    set(key, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        company_name: profile.company_name,
        inn: profile.inn,
        city: profile.city,
        warehouse_area: profile.warehouse_area ? Number(profile.warehouse_area) : null,
        founded_year: profile.founded_year ? Number(profile.founded_year) : null,
        description: profile.description,
        detailed_description: profile.detailed_description,
        contact_name: profile.contact_name,
        contact_email: profile.contact_email,
        contact_phone: profile.contact_phone,
        contact_tg: profile.contact_tg,
        work_schemes: profile.work_schemes,
        features: profile.features,
        packaging_types: profile.packaging_types,
        marketplaces: profile.marketplaces,
        specializations: profile.specializations,
        storage_price: profile.storage_price ? Number(profile.storage_price) : null,
        assembly_price: profile.assembly_price ? Number(profile.assembly_price) : null,
        delivery_price: profile.delivery_price ? Number(profile.delivery_price) : null,
        min_volume: profile.min_volume ? Number(profile.min_volume) : null,
        has_trial: profile.has_trial,
        team_size: profile.team_size ? Number(profile.team_size) : null,
        working_hours: profile.working_hours,
        photos: profile.photos,
      });
      toast.success("Профиль сохранён");
      onReload();
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForModeration = async () => {
    setSaving(true);
    try {
      await api.submitForModeration();
      toast.success("Профиль отправлен на модерацию. Ответ в течение 24 часов.");
      onReload();
    } catch (err: unknown) {
      const e = err as { error?: string; message?: string };
      toast.error(e.error || e.message || "Не удалось отправить на модерацию");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (profile.photos.length >= 10) {
      toast.error("Максимум 10 фотографий");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Загружайте только изображения");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(",")[1];
      const result = await api.uploadPhoto(base64, file.type);
      const url = result.url || result.photo_url;
      if (url) {
        set("photos", [...profile.photos, url]);
        toast.success("Фото загружено");
      }
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    set("photos", profile.photos.filter((_, i) => i !== index));
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Status banner */}
      <div className={`rounded-xl border p-4 flex items-start gap-3 ${
        profileStatus === "approved" ? "bg-emerald-50 border-emerald-200" :
        profileStatus === "rejected" ? "bg-red-50 border-red-200" :
        profileStatus === "pending" ? "bg-amber-50 border-amber-200" :
        "bg-gray-50 border-gray-200"
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          profileStatus === "approved" ? "bg-emerald-100" :
          profileStatus === "rejected" ? "bg-red-100" :
          profileStatus === "pending" ? "bg-amber-100" :
          "bg-gray-100"
        }`}>
          <Icon
            name={profileStatus === "approved" ? "CheckCircle" : profileStatus === "rejected" ? "XCircle" : profileStatus === "pending" ? "Clock" : "FileEdit"}
            size={16}
            className={statusCfg.text}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-sm font-bold font-golos ${statusCfg.text}`}>{statusCfg.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text} font-medium`}>{profileStatus}</span>
          </div>
          <p className="text-xs text-gray-600 font-ibm">
            {profileStatus === "approved" && "Ваш профиль опубликован в каталоге и виден клиентам."}
            {profileStatus === "rejected" && "Ваш профиль был отклонён модератором. Внесите изменения и отправьте повторно."}
            {profileStatus === "pending" && "Ваш профиль отправлен на модерацию. Обычно это занимает до 24 часов."}
            {profileStatus === "draft" && "Заполните профиль и сохраните, чтобы отправить на модерацию."}
          </p>
          {moderationComment && (
            <div className="mt-2 bg-white/70 rounded-lg p-2.5 text-xs text-gray-700 font-ibm">
              <span className="font-semibold">Комментарий модератора:</span> {moderationComment}
            </div>
          )}
        </div>
      </div>

      {/* Company info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Building2" size={16} className="text-navy-700" />
          Основная информация
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Название компании *</label>
            <input value={profile.company_name} onChange={(e) => set("company_name", e.target.value)} className={inputCls} placeholder="ООО Логистик" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">ИНН</label>
            <input value={profile.inn} onChange={(e) => set("inn", e.target.value)} className={inputCls} placeholder="7712345678" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Город</label>
            <input value={profile.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="Москва" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Площадь склада (м2)</label>
            <input value={profile.warehouse_area} onChange={(e) => set("warehouse_area", e.target.value)} type="number" className={inputCls} placeholder="5000" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Год основания</label>
            <input value={profile.founded_year} onChange={(e) => set("founded_year", e.target.value)} type="number" className={inputCls} placeholder="2018" />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Краткое описание</label>
          <textarea value={profile.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Коротко о вашей компании (для карточки в каталоге)" />
          <div className="text-xs text-gray-400 font-ibm mt-1">{profile.description.length} / 500</div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Подробное описание</label>
          <textarea value={profile.detailed_description} onChange={(e) => set("detailed_description", e.target.value)} rows={5} className={`${inputCls} resize-none`} placeholder="Подробное описание для детальной страницы" />
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={16} className="text-navy-700" />
          Контактная информация
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Контактное лицо</label>
            <input value={profile.contact_name} onChange={(e) => set("contact_name", e.target.value)} className={inputCls} placeholder="Иван Иванов" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Email для клиентов</label>
            <input value={profile.contact_email} onChange={(e) => set("contact_email", e.target.value)} type="email" className={inputCls} placeholder="sales@company.ru" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Телефон</label>
            <input value={profile.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} type="tel" className={inputCls} placeholder="+7 (999) 123-45-67" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Telegram</label>
            <input value={profile.contact_tg} onChange={(e) => set("contact_tg", e.target.value)} className={inputCls} placeholder="@username" />
          </div>
        </div>
      </div>

      {/* Work params */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Layers" size={16} className="text-navy-700" />
          Схемы работы и возможности
        </div>

        {/* Schemes */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Схемы работы</label>
          <div className="flex flex-wrap gap-2">
            {WORK_SCHEME_OPTIONS.map((s) => (
              <button key={s} onClick={() => toggleArr("work_schemes", s)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all font-golos ${
                  profile.work_schemes.includes(s) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Особенности и услуги</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {FEATURE_OPTIONS.map((f) => (
              <button key={f.key} onClick={() => toggleArr("features", f.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                  profile.features.includes(f.key) ? "bg-navy-50 border-navy-300 text-navy-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <Icon name={f.icon} size={14} className={profile.features.includes(f.key) ? "text-navy-700" : "text-gray-400"} />
                <span className="font-medium font-golos text-xs">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Специализация (типы товаров)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SPECIALIZATION_OPTIONS.map((s) => (
              <button key={s.key} onClick={() => toggleArr("specializations", s.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                  (profile.specializations || []).includes(s.key) ? "bg-gold-50 border-gold-300 text-navy-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <Icon name={s.icon} size={14} className={(profile.specializations || []).includes(s.key) ? "text-gold-600" : "text-gray-400"} />
                <span className="font-medium font-golos text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Packaging */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Виды упаковки (через запятую)</label>
          <input
            value={profile.packaging_types.join(", ")}
            onChange={(e) => set("packaging_types", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className={inputCls}
            placeholder="Короб, Полиэтилен, Пузырчатая плёнка"
          />
        </div>

        {/* Marketplaces */}
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Маркетплейсы</label>
          <div className="flex flex-wrap gap-2">
            {MARKETPLACE_OPTIONS.map((mp) => (
              <button key={mp} onClick={() => toggleArr("marketplaces", mp)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  profile.marketplaces.includes(mp) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
                }`}>
                {mp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={16} className="text-navy-700" />
          Тарифы
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Хранение, руб/пал/день</label>
            <input value={profile.storage_price} onChange={(e) => set("storage_price", e.target.value)} type="number" className={inputCls} placeholder="25" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Сборка, руб/заказ</label>
            <input value={profile.assembly_price} onChange={(e) => set("assembly_price", e.target.value)} type="number" className={inputCls} placeholder="60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Доставка, руб/заказ</label>
            <input value={profile.delivery_price} onChange={(e) => set("delivery_price", e.target.value)} type="number" className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Мин. объём, заказов/мес</label>
            <input value={profile.min_volume} onChange={(e) => set("min_volume", e.target.value)} type="number" className={inputCls} placeholder="100" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => set("has_trial", !profile.has_trial)}
            className={`relative w-11 h-6 rounded-full transition-colors ${profile.has_trial ? "bg-navy-900" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.has_trial ? "translate-x-5" : ""}`} />
          </button>
          <span className="text-sm text-gray-700 font-golos">Есть пробный период / тестовая партия</span>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Users" size={16} className="text-navy-700" />
          Команда
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Размер команды (чел.)</label>
            <input value={profile.team_size} onChange={(e) => set("team_size", e.target.value)} type="number" className={inputCls} placeholder="50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Часы работы</label>
            <input value={profile.working_hours} onChange={(e) => set("working_hours", e.target.value)} className={inputCls} placeholder="Пн-Пт 09:00-18:00" />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Camera" size={16} className="text-navy-700" />
          Фотографии
          <span className="text-xs text-gray-400 font-ibm font-normal ml-1">{profile.photos.length} / 10</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {profile.photos.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}

          {profile.photos.length < 10 && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-navy-400 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-navy-600 transition-all"
            >
              {uploading ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <>
                  <Icon name="Plus" size={20} />
                  <span className="text-xs font-ibm">Загрузить</span>
                </>
              )}
            </button>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        {profile.photos.length === 0 && (
          <p className="text-xs text-gray-400 font-ibm">Загрузите фотографии склада, рабочего процесса, команды. Фотографии повышают доверие клиентов.</p>
        )}
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 bg-gray-50/90 backdrop-blur-sm py-4 -mx-4 md:-mx-6 px-4 md:px-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-3 max-w-4xl">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-11 px-8"
          >
            {saving ? (
              <Icon name="Loader2" size={16} className="animate-spin mr-2" />
            ) : (
              <Icon name="Save" size={16} className="mr-2" />
            )}
            {saving ? "Сохранение..." : "Сохранить профиль"}
          </Button>
          {(profileStatus === "draft" || profileStatus === "rejected") && (
            <Button
              onClick={handleSubmitForModeration}
              disabled={saving}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos text-sm h-11 px-8"
            >
              <Icon name="Send" size={16} className="mr-2" />
              Отправить на модерацию
            </Button>
          )}
          {profileStatus === "pending" && (
            <span className="text-xs text-amber-700 font-ibm flex items-center gap-1.5">
              <Icon name="Clock" size={13} />
              Профиль на модерации
            </span>
          )}
          {profileStatus === "approved" && (
            <span className="text-xs text-emerald-700 font-ibm flex items-center gap-1.5">
              <Icon name="CheckCircle" size={13} />
              Профиль опубликован
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── QUOTES TAB ─────────────────────────────────────────────────────────────

function QuotesTab({ quotes, quotesLoading, onReload }: {
  quotes: Quote[];
  quotesLoading: boolean;
  onReload: () => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Quote | null>(null);

  const filtered = quotes.filter((q) => filter === "all" || q.status === filter);

  const counts = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === "new").length,
    in_progress: quotes.filter((q) => q.status === "in_progress").length,
    answered: quotes.filter((q) => q.status === "answered").length,
    closed: quotes.filter((q) => q.status === "closed").length,
  };

  const handleStatusChange = async (quoteId: number, status: string) => {
    try {
      await api.updateQuoteStatus(quoteId, status);
      toast.success("Статус обновлён");
      onReload();
      if (selected?.id === quoteId) setSelected({ ...selected, status });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось обновить статус");
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  if (quotesLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Всего заявок", value: counts.all, icon: "Inbox", color: "bg-navy-50 text-navy-700" },
          { label: "Новые", value: counts.new, icon: "Sparkles", color: "bg-blue-50 text-blue-600" },
          { label: "В работе", value: counts.in_progress, icon: "Clock", color: "bg-amber-50 text-amber-600" },
          { label: "Отвечено", value: counts.answered, icon: "CheckCircle", color: "bg-emerald-50 text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <Icon name={s.icon} size={15} />
            </div>
            <div className="font-golos font-black text-2xl text-navy-900">{s.value}</div>
            <div className="text-xs text-gray-400 font-ibm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Все", count: counts.all },
            { key: "new", label: "Новые", count: counts.new },
            { key: "in_progress", label: "В работе", count: counts.in_progress },
            { key: "answered", label: "Отвечено", count: counts.answered },
            { key: "closed", label: "Закрыты", count: counts.closed },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all font-golos ${
                filter === f.key ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? "text-white/70" : "text-gray-400"}`}>{f.count}</span>
            </button>
          ))}
          <button onClick={onReload} className="ml-auto text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Заявок пока нет</p>
            <p className="text-xs mt-1">Когда селлеры отправят запрос на КП, заявки появятся здесь</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((q) => {
              const qs = QUOTE_STATUS_CFG[q.status] || QUOTE_STATUS_CFG.new;
              return (
                <div key={q.id} onClick={() => setSelected(q)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs flex-shrink-0">
                    {(q.sender_name || "?")[0].toUpperCase()}{(q.sender_name || "?").split(" ")[1]?.[0]?.toUpperCase() || ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-golos font-bold text-navy-900 text-sm truncate">{q.sender_name}</span>
                      <span className="text-xs text-gray-400 font-ibm">{q.sender_company}</span>
                      {q.status === "new" && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm flex-wrap">
                      {q.sku_count > 0 && <span className="flex items-center gap-0.5"><Icon name="Package" size={10} />{q.sku_count} SKU</span>}
                      {q.sku_count > 0 && q.orders_count > 0 && <span>·</span>}
                      {q.orders_count > 0 && <span className="flex items-center gap-0.5"><Icon name="ShoppingCart" size={10} />{q.orders_count} зак/мес</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${qs.bg} ${qs.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${qs.dot}`} />
                      {qs.label}
                    </span>
                    <span className="text-xs text-gray-400 font-ibm">{formatDate(q.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote detail modal */}
      {selected && (
        <QuoteDetailModal quote={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

// ─── QUOTE DETAIL MODAL ─────────────────────────────────────────────────────

function QuoteDetailModal({ quote, onClose, onStatusChange }: {
  quote: Quote;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  const qs = QUOTE_STATUS_CFG[quote.status] || QUOTE_STATUS_CFG.new;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return d; }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-11 h-11 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold">
            {(quote.sender_name || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-black text-navy-900">{quote.sender_name}</div>
            <div className="text-xs text-gray-400 font-ibm">{quote.sender_company} · {formatDate(quote.created_at)}</div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${qs.bg} ${qs.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${qs.dot}`} />
            {qs.label}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Icon name="Mail" size={15} className="text-navy-700" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">Email</div>
                <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{quote.sender_email}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Icon name="Phone" size={15} className="text-navy-700" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">Телефон</div>
                <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{quote.sender_phone}</div>
              </div>
            </div>
          </div>

          {/* Params */}
          {(quote.sku_count > 0 || quote.orders_count > 0) && (
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 font-ibm">SKU</div>
                <div className="font-golos font-bold text-navy-900">{quote.sku_count.toLocaleString("ru-RU")}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-ibm">Заказов/мес</div>
                <div className="font-golos font-bold text-navy-900">{quote.orders_count.toLocaleString("ru-RU")}</div>
              </div>
            </div>
          )}

          {/* Message */}
          {quote.message && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Сообщение</div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 font-ibm leading-relaxed">
                {quote.message}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50">
          <select
            value={quote.status}
            onChange={(e) => onStatusChange(quote.id, e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white font-ibm focus:outline-none cursor-pointer"
          >
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="answered">Отправлено КП</option>
            <option value="closed">Закрыта</option>
          </select>
          <a href={`mailto:${quote.sender_email}`}
            className="ml-auto inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-9 px-5 rounded-md transition-colors">
            <Icon name="Send" size={14} />
            Написать
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ───────────────────────────────────────────────────────────

function SettingsTab({ user, onLogout }: {
  user: { email: string; role: string };
  onLogout: () => void;
}) {
  return (
    <div className="max-w-lg space-y-5">
      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={16} className="text-navy-700" />
          Аккаунт
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs text-gray-400 font-ibm">Email</div>
              <div className="text-sm font-semibold text-navy-900 font-ibm">{user.email}</div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Icon name="CheckCircle" size={14} />
              <span className="text-xs font-medium">Подтверждён</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-400 font-ibm">Роль</div>
              <div className="text-sm font-semibold text-navy-900 font-ibm capitalize">{user.role || "fulfillment"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
        <div className="font-golos font-bold text-red-700 mb-3 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} className="text-red-500" />
          Опасная зона
        </div>
        <p className="text-xs text-gray-500 font-ibm mb-4">
          Выход из аккаунта. Для повторного входа потребуется ввести логин и пароль.
        </p>
        <Button
          onClick={onLogout}
          variant="destructive"
          className="font-golos font-bold text-sm h-10"
        >
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}