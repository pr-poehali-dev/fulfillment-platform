import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import type { Partner } from "./data";
import api from "@/lib/api";
import YandexMap from "@/components/YandexMap";

// ─── PARTNER DETAIL MODAL ────────────────────────────────────────────────────

export function PartnerDetailModal({ partner, onClose, onRequestQuote, isFavorite, onToggleFavorite }: {
  partner: Partner;
  onClose: () => void;
  onRequestQuote: (p: Partner) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const featureLabels: Record<string, string> = {
    cameras: "Видеонаблюдение",
    dangerous: "Опасные грузы",
    returns: "Работа с возвратами",
    same_day: "Доставка день в день",
    temp_control: "Температурный режим",
    packaging: "Упаковка",
    honest_mark: "Маркировка Честный Знак",
    defect_check: "Проверка на брак",
    seller_packaging: "Упаковка в пакет продавца",
    shipment_prep: "Подготовка к отгрузке",
    barcode_check: "Проверка штрихкода",
    cargo_receive: "Получение товара карго",
  };

  const specializationLabels: Record<string, { label: string; icon: string }> = {
    small_goods: { label: "Мелкие товары", icon: "Boxes" },
    cosmetics: { label: "Косметика", icon: "Sparkles" },
    clothing: { label: "Обувь, одежда", icon: "Shirt" },
    fuel_lubricants: { label: "Горюче-смазочные материалы", icon: "Fuel" },
    construction: { label: "Строительные материалы", icon: "Hammer" },
    appliances: { label: "Бытовая техника", icon: "WashingMachine" },
    electronics: { label: "Электроника", icon: "Cpu" },
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white md:rounded-2xl shadow-2xl w-full h-full md:max-w-5xl md:max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-2xl">{partner.logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-golos font-black text-navy-900 text-lg truncate">{partner.name}</span>
              <BadgeChip color={partner.badgeColor}>{partner.badge}</BadgeChip>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-ibm mt-0.5">
              <span className="flex items-center gap-0.5"><Icon name="MapPin" size={10} />{partner.location}</span>
              <span>·</span>
              <div className="flex items-center gap-1"><StarRating rating={partner.rating} size={11} /><span>{partner.rating}</span><span>({partner.reviews})</span></div>
            </div>
          </div>
          <button onClick={onToggleFavorite}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${isFavorite ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"}`}>
            <Icon name="Heart" size={16} className={isFavorite ? "fill-current" : ""} />
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto">
          {/* Photo gallery */}
          <div className="relative bg-gray-100">
            <div className="aspect-[16/7] md:aspect-[16/6] overflow-hidden">
              <img src={partner.photos[activePhoto]} alt={partner.name}
                className="w-full h-full object-cover transition-opacity" />
            </div>
            {partner.photos.length > 1 && (
              <>
                <button onClick={() => setActivePhoto((p) => (p - 1 + partner.photos.length) % partner.photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                  <Icon name="ChevronLeft" size={18} />
                </button>
                <button onClick={() => setActivePhoto((p) => (p + 1) % partner.photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                  <Icon name="ChevronRight" size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {partner.photos.map((_, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)}
                      className={`transition-all rounded-full ${activePhoto === i ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-5 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-7">
              {/* About */}
              <section>
                <h3 className="font-golos font-black text-navy-900 text-xl mb-3 flex items-center gap-2">
                  <Icon name="Info" size={18} className="text-gold-500" />О компании
                </h3>
                <p className="text-gray-600 font-ibm leading-relaxed text-sm">{partner.detailedDescription}</p>
              </section>

              {/* Key stats */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: "Calendar", label: "На рынке", value: `с ${partner.foundedYear}` },
                  { icon: "Warehouse", label: "Площадь", value: `${partner.warehouseArea.toLocaleString("ru-RU")} м²` },
                  { icon: "Users", label: "Команда", value: `${partner.team} чел.` },
                  { icon: "Clock", label: "Режим", value: partner.workingHours },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <Icon name={s.icon as "Calendar"} size={15} className="text-gold-500 mb-1" />
                    <div className="text-xs text-gray-400 font-ibm">{s.label}</div>
                    <div className="text-sm font-golos font-bold text-navy-900 truncate">{s.value}</div>
                  </div>
                ))}
              </section>

              {/* Services */}
              <section>
                <h3 className="font-golos font-black text-navy-900 text-xl mb-3 flex items-center gap-2">
                  <Icon name="Sparkles" size={18} className="text-gold-500" />Услуги
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partner.services.map((s) => (
                    <div key={s.name} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-navy-200 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name={s.icon as "Package"} size={16} className="text-navy-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-golos font-bold text-navy-900 text-sm">{s.name}</span>
                            {s.price && <span className="text-xs text-gold-600 font-ibm font-semibold whitespace-nowrap">{s.price}</span>}
                          </div>
                          <p className="text-xs text-gray-500 font-ibm leading-relaxed">{s.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Work schemes & marketplaces */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-golos font-bold text-navy-900 text-sm mb-2 uppercase tracking-wide text-xs">Схемы работы</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.workSchemes.map((s) => (
                      <span key={s} className="text-xs px-3 py-1.5 bg-navy-900 text-white rounded-lg font-ibm font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-golos font-bold text-navy-900 text-sm mb-2 uppercase tracking-wide text-xs">Маркетплейсы</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.tags.map((t) => (
                      <span key={t} className="text-xs px-3 py-1.5 bg-navy-50 text-navy-700 rounded-lg font-ibm">{t}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Features */}
              <section>
                <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2">Дополнительные услуги</h3>
                <div className="flex flex-wrap gap-2">
                  {partner.features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-ibm">
                      <Icon name="Check" size={11} />
                      {featureLabels[f] || f}
                    </span>
                  ))}
                </div>
              </section>

              {/* Specializations */}
              {partner.specializations && partner.specializations.length > 0 && (
                <section>
                  <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2">Специализация</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.specializations.map((s) => {
                      const info = specializationLabels[s];
                      return (
                        <span key={s} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gold-50 text-amber-800 border border-amber-200 rounded-lg font-ibm">
                          <Icon name={(info?.icon as "Boxes") || "Package"} size={11} />
                          {info?.label || s}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Packaging */}
              <section>
                <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2">Типы упаковки</h3>
                <div className="flex flex-wrap gap-1.5">
                  {partner.packagingTypes.map((pk) => (
                    <span key={pk} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-ibm">{pk}</span>
                  ))}
                </div>
              </section>

              {/* Certificates */}
              {partner.certificates.length > 0 && (
                <section>
                  <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2">Сертификаты и документы</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.certificates.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-ibm">
                        <Icon name="Award" size={11} />{c}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Map */}
              {partner.address && (
                <section>
                  <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Icon name="MapPin" size={13} className="text-navy-700" />
                    Адрес склада
                  </h3>
                  <p className="text-sm text-gray-600 font-ibm mb-3">{partner.address}</p>
                  <YandexMap address={partner.address} className="w-full h-56 rounded-xl overflow-hidden" />
                </section>
              )}
            </div>

            {/* Sidebar pricing */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4 space-y-4">
                <div className="bg-navy-gradient text-white rounded-2xl p-5 shadow-lg">
                  <div className="text-xs text-white/50 font-ibm uppercase tracking-wide mb-3">Стартовые тарифы</div>
                  <div className="space-y-2.5 mb-5">
                    {[
                      { label: "Хранение", value: partner.storage, icon: "Warehouse" },
                      { label: "Сборка", value: partner.assembly, icon: "Package" },
                      { label: "Доставка", value: partner.delivery, icon: "Truck" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                        <Icon name={r.icon as "Package"} size={13} className="text-gold-400" />
                        <span className="text-xs text-white/70 font-ibm flex-1">{r.label}</span>
                        <span className="font-golos font-bold text-sm">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-white/40 font-ibm mb-4">
                    Минимальный объём: <span className="text-white/70 font-semibold">{partner.minVolume}</span>
                  </div>
                  <Button
                    onClick={() => onRequestQuote(partner)}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-11">
                    <Icon name="Send" size={15} className="mr-2" />Запросить КП
                  </Button>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Почему выбирают нас</div>
                  <div className="space-y-2">
                    {[
                      { icon: "Shield", text: "Официальный договор" },
                      { icon: "CreditCard", text: "Оплата по факту" },
                      { icon: "Headphones", text: "Персональный менеджер" },
                      { icon: "Clock", text: "Ответ в течение часа" },
                    ].map((b) => (
                      <div key={b.text} className="flex items-center gap-2 text-xs text-gray-600 font-ibm">
                        <Icon name={b.icon as "Shield"} size={12} className="text-emerald-500" />{b.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REQUEST QUOTE MODAL ─────────────────────────────────────────────────────

export function RequestQuoteModal({ partners, onClose }: {
  partners: Partner[];
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sku, setSku] = useState("");
  const [orders, setOrders] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canSubmit = name.trim() && email.trim() && phone.trim() && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        sku_count: parseInt(sku) || 0,
        orders_count: parseInt(orders) || 0,
        message: message.trim(),
      };
      const results = await Promise.allSettled(
        partners.map((p) => api.sendQuote({ ...payload, fulfillment_id: p.id }))
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed === partners.length) {
        setError("Не удалось отправить запросы. Попробуйте позже.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-lg md:max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 bg-gold-500/15 rounded-xl flex items-center justify-center">
            <Icon name="Send" size={16} className="text-gold-600" />
          </div>
          <div className="flex-1">
            <div className="font-golos font-black text-navy-900">Запрос коммерческого предложения</div>
            <div className="text-xs text-gray-400 font-ibm">
              {partners.length === 1 ? `Для ${partners[0].name}` : `Для ${partners.length} партнёров`}
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Body */}
        {sent ? (
          <div className="flex-1 overflow-auto p-6 flex flex-col gap-5">
            {/* Success header */}
            <div className="text-center pt-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Icon name="CheckCircle" size={28} className="text-emerald-600" />
              </div>
              <h3 className="font-golos font-black text-xl text-navy-900 mb-1">Запрос отправлен!</h3>
              <p className="text-sm text-gray-500 font-ibm max-w-xs mx-auto">
                {partners.length === 1 ? "Партнёр" : "Партнёры"} свяжутся с вами в течение 24 часов на{" "}
                <strong className="text-navy-900">{email}</strong>
              </p>
            </div>

            {/* Partners list */}
            <div className="space-y-1.5">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                  <span className="text-lg">{p.logo}</span>
                  <span className="text-xs font-ibm text-gray-700 flex-1">{p.name}</span>
                  <Icon name="Check" size={13} className="text-emerald-600" />
                </div>
              ))}
            </div>

            {/* Cabinet promo */}
            <div className="bg-gradient-to-br from-navy-50 to-gold-50/30 border border-navy-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="LayoutDashboard" size={14} className="text-gold-400" />
                </div>
                <span className="font-golos font-black text-navy-900 text-sm">Личный кабинет селлера</span>
              </div>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {[
                  { icon: "Bell",        text: "Уведомления о статусах ваших заявок" },
                  { icon: "Eye",         text: "Видно, когда фулфилмент просмотрел запрос" },
                  { icon: "FileText",    text: "«Отправлено КП» — узнаете о готовом предложении" },
                  { icon: "History",     text: "История всех ваших запросов в одном месте" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center flex-shrink-0 border border-navy-100">
                      <Icon name={item.icon as "Bell"} size={11} className="text-navy-600" />
                    </div>
                    <span className="text-xs text-gray-600 font-ibm">{item.text}</span>
                  </div>
                ))}
              </div>
              <a href="/seller">
                <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-9 text-sm">
                  <Icon name="ArrowRight" size={14} className="mr-1.5" />
                  Перейти в кабинет
                </Button>
              </a>
            </div>

            <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-500 hover:bg-gray-50 font-golos text-sm">
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-5 space-y-4">
              {/* Selected partners preview */}
              <div className="bg-gradient-to-br from-navy-50 to-gold-50/30 rounded-xl border border-navy-100 p-3">
                <div className="text-xs font-semibold text-navy-700 font-ibm mb-2 uppercase tracking-wide">
                  Запрос будет отправлен
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {partners.map((p) => (
                    <span key={p.id} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg font-ibm">
                      <span>{p.logo}</span>
                      <span className="font-semibold text-navy-900">{p.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Ваши контакты</div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Имя <span className="text-red-400">*</span></label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Компания</label>
                      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="BrandStore" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Email <span className="text-red-400">*</span></label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@company.ru" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Телефон <span className="text-red-400">*</span></label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Volume info */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Объёмы (необязательно)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Количество SKU</label>
                    <input value={sku} onChange={(e) => setSku(e.target.value)} type="number" placeholder="500" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Заказов в месяц</label>
                    <input value={orders} onChange={(e) => setOrders(e.target.value)} type="number" placeholder="300" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Комментарий</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  rows={3} placeholder="Опишите особенности товара, маркетплейсы, требования..."
                  className={`${inputCls} resize-none`} />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <Icon name="AlertCircle" size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-red-700 font-ibm">{error}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
              <div className="text-xs text-gray-400 font-ibm flex-1">
                Нажимая «Отправить», вы соглашаетесь с политикой обработки данных
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Отправка...</>
                ) : (
                  <><Icon name="Send" size={14} className="mr-1.5" />Отправить</>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}