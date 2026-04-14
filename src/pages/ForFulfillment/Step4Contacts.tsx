import Icon from "@/components/ui/icon";

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 placeholder:text-gray-400";

export interface Step4Props {
  contactName: string;  setContactName: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
  contactPhone: string; setContactPhone: (v: string) => void;
  contactTg: string;    setContactTg: (v: string) => void;
  agree: boolean;       setAgree: (v: boolean) => void;
  companyName: string;
  city: string;
  schemes: string[];
  marketplaces: string[];
  storagePrice: string;
  hasTrial: boolean;
}

export default function Step4Contacts({ contactName, setContactName, contactEmail, setContactEmail, contactPhone, setContactPhone, contactTg, setContactTg, agree, setAgree, companyName, city, schemes, marketplaces, storagePrice, hasTrial }: Step4Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Контактное лицо <span className="text-red-400">*</span></label>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Иван Иванов" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Телефон <span className="text-red-400">*</span></label>
          <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+7 (999) 123-45-67" className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Email <span className="text-red-400">*</span></label>
          <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="ivan@company.ru" type="email" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Telegram</label>
          <input value={contactTg} onChange={(e) => setContactTg(e.target.value)} placeholder="@username" className={inputCls} />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-navy-50 border border-navy-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-navy-900 font-golos uppercase tracking-wide mb-3">Ваша заявка</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Компания",       value: companyName || "—" },
            { label: "Город",          value: city || "—" },
            { label: "Схемы",          value: schemes.join(", ") || "—" },
            { label: "Маркетплейсы",   value: marketplaces.length ? `${marketplaces.length} шт.` : "—" },
            { label: "Хранение",       value: storagePrice ? `от ${storagePrice} ₽/ед/дн.` : "—" },
            { label: "Пробный период", value: hasTrial ? "Да ✓" : "Нет" },
          ].map((r) => (
            <div key={r.label}>
              <div className="text-xs text-gray-400 font-ibm">{r.label}</div>
              <div className="text-sm font-semibold text-navy-900 font-golos">{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
          agree ? "bg-navy-50 border-navy-200" : "bg-red-50 border-red-200"
        }`}
        onClick={() => setAgree(!agree)}
      >
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            agree ? "bg-navy-900 border-navy-900" : "bg-white border-red-300"
          }`}
        >
          {agree && <Icon name="Check" size={11} className="text-white" />}
        </div>
        <span className="text-xs font-ibm leading-relaxed select-none" onClick={(e) => e.stopPropagation()}>
          <span className={agree ? "text-navy-700" : "text-red-700"}>
            Обязательное поле.{" "}
          </span>
          <span className="text-gray-600">
            Я ознакомлен и принимаю условия{" "}
            <a href="/offer" target="_blank" rel="noopener noreferrer"
              className="text-navy-700 underline hover:text-navy-900 transition-colors"
              onClick={(e) => e.stopPropagation()}>
              Публичной оферты
            </a>
            {" "}и{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer"
              className="text-navy-700 underline hover:text-navy-900 transition-colors"
              onClick={(e) => e.stopPropagation()}>
              Политики конфиденциальности
            </a>
            {" "}FulfillHub.
          </span>
        </span>
      </div>
    </div>
  );
}
