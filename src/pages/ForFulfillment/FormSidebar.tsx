import Icon from "@/components/ui/icon";

const INTEGRATIONS = [
  { name: "Wildberries", icon: "🟣" },
  { name: "Ozon", icon: "🔵" },
  { name: "Яндекс Маркет", icon: "🟡" },
  { name: "1С", icon: "🔴" },
  { name: "МойСклад", icon: "🟢" },
  { name: "REST API", icon: "⚙️" },
];

export default function FormSidebar() {
  return (
    <div className="space-y-5">
      {/* Integrations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 text-sm mb-3">Поддерживаемые интеграции</div>
        <div className="grid grid-cols-3 gap-2">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-2.5">
              <span className="text-xl">{i.icon}</span>
              <span className="text-xs text-gray-500 font-ibm text-center leading-tight">{i.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-navy-gradient rounded-2xl p-5 text-white">
        <div className="font-golos font-bold text-sm mb-4 text-gold-400">Почему FulfillHub?</div>
        <div className="space-y-3">
          {[
            { value: "15 000+", label: "Селлеров на платформе" },
            { value: "200+", label: "Фулфилмент-сервисов" },
            { value: "98%", label: "Успешных сделок" },
            { value: "24ч", label: "Среднее время модерации" },
          ].map((s) => (
            <div key={s.value} className="flex items-center gap-3">
              <div className="text-xl font-golos font-black text-gold-gradient w-16 flex-shrink-0">{s.value}</div>
              <div className="text-xs text-white/60 font-ibm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 text-sm mb-3">Есть вопросы?</div>
        <div className="space-y-2.5">
          {[
            { icon: "Phone", text: "+7 (800) 555-35-35" },
            { icon: "Mail", text: "partners@fulfillhub.ru" },
            { icon: "MessageSquare", text: "@fulfillhub_support" },
          ].map((c) => (
            <div key={c.text} className="flex items-center gap-2.5 text-sm text-gray-600 font-ibm">
              <Icon name={c.icon as "Phone"} size={14} className="text-navy-700 flex-shrink-0" />
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
