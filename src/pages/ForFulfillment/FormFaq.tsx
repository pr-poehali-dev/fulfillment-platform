import { useState } from "react";
import Icon from "@/components/ui/icon";

const FAQ = [
  {
    q: "Сколько стоит размещение?",
    a: "Размещение в каталоге полностью бесплатно. Мы не берём комиссию с заявок или сделок. Платформа зарабатывает на дополнительных инструментах продвижения — базовое размещение всегда бесплатно.",
  },
  {
    q: "Как долго проходит модерация?",
    a: "После заполнения анкеты модерация занимает до 1 часа. Мы проверяем данные и публикуем вашу карточку в каталоге.",
  },
  {
    q: "Как приходят заявки от селлеров?",
    a: "Все заявки на КП приходят напрямую в ваш личный кабинет. Там же вы можете управлять статусами, отвечать на запросы и отслеживать историю обращений.",
  },
  {
    q: "Можно ли изменить тарифы после публикации?",
    a: "Да, в личном кабинете вы можете обновлять тарифы, описание, фото и услуги в любое время без повторной модерации.",
  },
  {
    q: "Есть ли интеграция с нашей CRM?",
    a: "Да, мы можем индивидуально настроить интеграцию с вашей CRM-системой. Напишите нам — обсудим детали и формат передачи данных.",
  },
];

export default function FormFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h2 className="font-golos font-black text-navy-900 text-2xl mb-6 text-center">Частые вопросы</h2>
      <div className="space-y-2">
        {FAQ.map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-golos font-semibold text-navy-900 text-sm pr-4">{item.q}</span>
              <Icon
                name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                size={16}
                className="text-gray-400 flex-shrink-0 transition-transform"
              />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 font-ibm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
