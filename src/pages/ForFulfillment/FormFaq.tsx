import { useState } from "react";
import Icon from "@/components/ui/icon";

const FAQ = [
  {
    q: "Сколько стоит размещение?",
    a: "Размещение в каталоге полностью бесплатно. Мы берём только комиссию за подтверждённые сделки с клиентами.",
  },
  {
    q: "Как долго проходит модерация?",
    a: "После заполнения анкеты модерация занимает до 24 часов в рабочие дни. Мы свяжемся с вами для подтверждения.",
  },
  {
    q: "Можно ли изменить тарифы после публикации?",
    a: "Да, в личном кабинете вы можете обновлять тарифы, описание и услуги в любое время.",
  },
  {
    q: "Как приходят заявки от селлеров?",
    a: "Заявки на КП приходят на указанный email и в личный кабинет. Вы можете ответить прямо в системе или связаться напрямую.",
  },
];

export default function FormFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mt-12">
      <h2 className="font-golos font-black text-2xl text-navy-900 mb-5">Часто задаваемые вопросы</h2>
      <div className="space-y-2">
        {FAQ.map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span className="font-golos font-semibold text-navy-900 text-sm">{item.q}</span>
              <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-gray-400 flex-shrink-0 ml-3" />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4 text-sm text-gray-500 font-ibm leading-relaxed border-t border-gray-100 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
