import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { StarRating, BadgeChip } from "./Navigation";
import type { Partner } from "./data";
import YandexMap from "@/components/YandexMap";

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

// ─── Shared content (используется и в десктопе, и в мобилке) ─────────────────

function ModalContent({ partner, activePhoto, setActivePhoto, onRequestQuote }: {
  partner: Partner;
  activePhoto: number;
  setActivePhoto: (i: number) => void;
  onRequestQuote: (p: Partner) => void;
}) {
  return (
    <>
      {/* Photo gallery */}
      <div className="relative bg-gray-100 flex-shrink-0">
        <div className="aspect-[16/7] md:aspect-[16/6] overflow-hidden">
          <img src={partner.photos[activePhoto]} alt={partner.name}
            className="w-full h-full object-cover transition-opacity" />
        </div>
        {partner.photos.length > 1 && (
          <>
            <button onClick={() => setActivePhoto((activePhoto - 1 + partner.photos.length) % partner.photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
              <Icon name="ChevronLeft" size={18} />
            </button>
            <button onClick={() => setActivePhoto((activePhoto + 1) % partner.photos.length)}
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
              <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2">Схемы работы</h3>
              <div className="flex flex-wrap gap-1.5">
                {partner.workSchemes.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 bg-navy-900 text-white rounded-lg font-ibm font-semibold">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-golos font-bold text-navy-900 text-xs uppercase tracking-wide mb-2">Маркетплейсы</h3>
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

        {/* Sidebar pricing — только десктоп */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="lg:sticky lg:top-4">
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
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

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

  // ─── Shared header ────────────────────────────────────────────────────────

  const header = (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0 bg-white">
      <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{partner.logo}</div>
      <div className="flex-1 min-w-0">
        <div className="font-golos font-black text-navy-900 text-sm leading-tight truncate">{partner.name}</div>
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          <BadgeChip color={partner.badgeColor}>{partner.badge}</BadgeChip>
          {partner.location && (
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400 font-ibm">
              <Icon name="MapPin" size={9} />{partner.location}
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-ibm">
            <StarRating rating={partner.rating} size={10} />
            <span>{partner.rating}</span>
            <span>({partner.reviews})</span>
          </div>
        </div>
      </div>
      <button onClick={onToggleFavorite}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border flex-shrink-0 ${isFavorite ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"}`}>
        <Icon name="Heart" size={14} className={isFavorite ? "fill-current" : ""} />
      </button>
      <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
        <Icon name="X" size={14} />
      </button>
    </div>
  );

  return (
    <>
      {/* ── МОБИЛКА: bottom sheet ── */}
      <div className="md:hidden fixed inset-0 z-[70] flex flex-col justify-end" onClick={onClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] animate-slide-up"
        >
          {/* Ручка */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>
          {header}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <ModalContent
              partner={partner}
              activePhoto={activePhoto}
              setActivePhoto={setActivePhoto}
              onRequestQuote={onRequestQuote}
            />
          </div>
          {/* Фиксированная кнопка внизу */}
          <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
            <Button
              onClick={() => onRequestQuote(partner)}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-12 rounded-xl">
              <Icon name="Send" size={15} className="mr-2" />Запросить КП
            </Button>
          </div>
        </div>
      </div>

      {/* ── ДЕСКТОП: центрированный модал ── */}
      <div className="hidden md:flex fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm items-center justify-center p-4" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
          {header}
          <div className="flex-1 overflow-auto">
            <ModalContent
              partner={partner}
              activePhoto={activePhoto}
              setActivePhoto={setActivePhoto}
              onRequestQuote={onRequestQuote}
            />
          </div>
        </div>
      </div>
    </>
  );
}
