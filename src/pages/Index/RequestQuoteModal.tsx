import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { Partner } from "./data";
import api from "@/lib/api";

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

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

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[92vh] md:max-h-[92vh] overflow-hidden flex flex-col animate-slide-up md:animate-scale-in">

        {/* Ручка — только мобилка */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 bg-gold-500/15 rounded-xl flex items-center justify-center">
            <Icon name="Send" size={16} className="text-gold-600" />
          </div>
          <div className="flex-1">
            <div className="font-golos font-black text-navy-900">Запрос коммерческого предложения</div>
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
