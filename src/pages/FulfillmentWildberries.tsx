import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SERVICES = [
  { icon: "Warehouse" as const, title: "Хранение товаров", desc: "Партнёры хранят ваш товар на сертифицированных складах рядом со складами Wildberries — быстрая отгрузка без задержек." },
  { icon: "Package", title: "Упаковка и маркировка", desc: "Соответствие всем требованиям WB: штрихкоды, этикетки, полибэги, короба и паллеты по стандартам маркетплейса." },
  { icon: "Truck", title: "Доставка на склад WB", desc: "Фулфилмент-партнёры самостоятельно доставляют товар на склады Wildberries по расписанию приёмки." },
  { icon: "RotateCcw", title: "Обработка возвратов", desc: "Приём, проверка, переупаковка и повторная отправка возвратов от покупателей Wildberries." },
  { icon: "ClipboardList", title: "Контроль остатков", desc: "Мониторинг товарных остатков, уведомления об исчерпании запасов, управление поставками." },
  { icon: "ShieldCheck", title: "Работа по FBO и FBS", desc: "Поддержка обеих схем: FBO — товар на складе WB, FBS — отгрузка со склада фулфилмента." },
];

const FAQS = [
  { q: "Чем отличается FBO от FBS на Wildberries?", a: "FBO (Fulfillment by Operator) — вы отвозите товар на склад Wildberries, они хранят и отправляют покупателям. FBS (Fulfillment by Seller) — товар хранится у фулфилмент-партнёра, и он отправляет заказы по мере поступления. Фулфилмент помогает с обеими схемами." },
  { q: "Сколько стоит фулфилмент для Wildberries?", a: "Стоимость зависит от объёма товара, типа упаковки и региона. Хранение обычно от 5–15 руб./единицу в месяц, сборка заказа — от 20–50 руб. На платформе вы можете сравнить тарифы разных партнёров." },
  { q: "Как быстро фулфилмент доставит товар на склад WB?", a: "Большинство партнёров делают регулярные отгрузки на склады Wildberries 2–5 раз в неделю. Ряд партнёров работает ежедневно. Уточняйте расписание у каждого партнёра." },
  { q: "Нужен ли договор с фулфилментом?", a: "Да, с выбранным партнёром заключается договор оказания услуг. Большинство партнёров работают по ИП или ООО с полным пакетом документов." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
};

export default function FulfillmentWildberries() {
  useEffect(() => {
    document.title = "Фулфилмент для Wildberries — сравнить партнёров и тарифы | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Найдите фулфилмент-партнёра для Wildberries. Хранение, упаковка, маркировка и доставка на склады WB. Сравнивайте тарифы и выбирайте лучшего партнёра.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "faq-schema-wb";
    document.head.appendChild(script);
    return () => { document.getElementById("faq-schema-wb")?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Каталог</Link>
            <Link to="/for-fulfillment" className="px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded transition-all">
              Разместить сервис
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#cb11ab]/10 border border-[#cb11ab]/20 rounded-full text-sm text-[#cb11ab] font-medium mb-6">
            <Icon name="ShoppingBag" size={14} />
            Wildberries
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            Фулфилмент для <span className="text-[#cb11ab]">Wildberries</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Сравнивайте фулфилмент-партнёров для WB: хранение, упаковка, маркировка и доставка на склады маркетплейса. Выбирайте по тарифам и услугам.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/?marketplace=wildberries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#cb11ab] hover:bg-[#a50e8c] text-white rounded-xl font-bold font-golos transition-all text-base">
              <Icon name="Search" size={18} />
              Найти партнёра для WB
            </Link>
            <Link to="/for-fulfillment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl font-medium transition-all text-base">
              <Icon name="Plus" size={18} />
              Разместить фулфилмент
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "FBO", label: "и FBS схемы" },
            { value: "1 час", label: "модерация партнёра" },
            { value: "0 ₽", label: "базовое размещение" },
            { value: "24/7", label: "заявки в кабинете" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-golos font-bold text-2xl text-gold-400">{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-3">
            Услуги фулфилмент-партнёров для WB
          </h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
            Всё необходимое для продаж на Wildberries — от хранения до отгрузки на склад маркетплейса
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
                <div className="w-10 h-10 bg-[#cb11ab]/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={s.icon} size={20} className="text-[#cb11ab]" />
                </div>
                <h3 className="font-golos font-semibold text-white text-base mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#cb11ab]/20 to-[#cb11ab]/5 border border-[#cb11ab]/20 rounded-2xl p-8 text-center">
          <h2 className="font-golos font-bold text-2xl text-white mb-3">
            Сравните партнёров для Wildberries прямо сейчас
          </h2>
          <p className="text-white/60 mb-6">Фильтруйте по городу, тарифам и услугам. Запрашивайте КП в один клик.</p>
          <Link to="/?marketplace=wildberries"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#cb11ab] hover:bg-[#a50e8c] text-white rounded-xl font-bold font-golos transition-all">
            <Icon name="ArrowRight" size={18} />
            Перейти в каталог
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-10">
            Частые вопросы о фулфилменте для Wildberries
          </h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-golos font-semibold text-white text-base mb-2">{f.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={11} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-sm">FulfillHub</span>
          </div>
          <div className="flex gap-4 text-sm text-white/40">
            <Link to="/fulfillment/ozon" className="hover:text-white/70 transition-colors">Фулфилмент для Ozon</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Условия</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}