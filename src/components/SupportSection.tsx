import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function SupportSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await api.sendSupportRequest(name.trim(), email.trim(), message.trim());
      setSent(true);
    } catch {
      setError("Не удалось отправить сообщение. Попробуйте позже или напишите нам напрямую.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={26} className="text-emerald-600" />
        </div>
        <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Сообщение отправлено</h3>
        <p className="text-sm text-gray-400 font-ibm mb-4">Мы свяжемся с вами в течение 1 рабочего дня.</p>
        <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
          className="text-xs text-navy-600 hover:text-navy-900 font-golos font-semibold transition-colors">
          Отправить ещё
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-3 flex items-center gap-2">
          <Icon name="LifeBuoy" size={16} className="text-navy-700" />
          Техническая поддержка
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { icon: "MessageCircle", label: "Telegram", value: "@fulfillhub_support", href: "https://t.me/fulfillhub_support" },
            { icon: "Mail", label: "Email", value: "support@fulfillhub.ru", href: "mailto:support@fulfillhub.ru" },
            { icon: "Clock", label: "Часы работы", value: "Пн–Пт, 9:00–18:00" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <Icon name={item.icon as "Mail"} size={14} className="text-navy-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="text-xs font-semibold text-navy-700 hover:text-navy-900 font-golos transition-colors truncate block">
                    {item.value}
                  </a>
                ) : (
                  <div className="text-xs font-semibold text-navy-900 font-golos">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="text-xs font-semibold text-gray-600 font-golos">Написать в поддержку</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Ваше имя *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Email *</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.ru" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Опишите проблему *</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
              placeholder="Подробно опишите вашу проблему или вопрос..."
              className={`${inputCls} resize-none`} />
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
              <p className="text-red-500 text-xs font-ibm">{error}</p>
            </div>
          )}
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={handleSubmit}
              disabled={!name.trim() || !email.trim() || !message.trim() || submitting}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-10 px-6 disabled:opacity-40">
              {submitting
                ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Отправка...</>
                : <><Icon name="Send" size={14} className="mr-1.5" />Отправить</>
              }
            </Button>
            <p className="text-[11px] text-gray-400 font-ibm leading-relaxed">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">политикой конфиденциальности</a>
              {" "}и{" "}
              <a href="/offer" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">обработкой персональных данных</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}