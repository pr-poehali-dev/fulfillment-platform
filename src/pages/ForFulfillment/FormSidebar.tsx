import Icon from "@/components/ui/icon";

export default function FormSidebar() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="bg-navy-gradient rounded-2xl p-5 text-white">
        <div className="font-golos font-bold text-sm mb-4 text-gold-400">Платформа в цифрах</div>
        <div className="space-y-3">
          {[
            { value: "15 000+", label: "Селлеров на платформе" },
            { value: "200+",    label: "Фулфилмент-сервисов" },
            { value: "1 час",   label: "Среднее время модерации" },
            { value: "0 ₽",     label: "Комиссия с заявок" },
          ].map((s) => (
            <div key={s.value} className="flex items-center gap-3">
              <div className="text-xl font-golos font-black text-gold-gradient w-20 flex-shrink-0">{s.value}</div>
              <div className="text-xs text-white/60 font-ibm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 text-sm mb-3">Как это работает</div>
        <div className="space-y-3">
          {[
            { icon: "FileText",      step: "1", text: "Заполняете анкету — занимает ~10 минут" },
            { icon: "CheckCircle",   step: "2", text: "Модерация за 1 час, публикуем карточку" },
            { icon: "Inbox",         step: "3", text: "Заявки на КП приходят в личный кабинет" },
            { icon: "MessageSquare", step: "4", text: "Общаетесь с селлером напрямую" },
          ].map((b) => (
            <div key={b.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-navy-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-navy-700 font-golos">{b.step}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 font-ibm pt-0.5">
                <Icon name={b.icon as "FileText"} size={13} className="text-navy-400 flex-shrink-0" />
                {b.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 text-sm mb-3">Есть вопросы?</div>
        <div className="space-y-2.5">
          {[
            { icon: "Mail",          text: "partners@fulfillhub.ru" },
            { icon: "MessageSquare", text: "@fulfillhub_support" },
          ].map((c) => (
            <div key={c.text} className="flex items-center gap-2.5 text-sm text-gray-600 font-ibm">
              <Icon name={c.icon as "Mail"} size={14} className="text-navy-700 flex-shrink-0" />
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
