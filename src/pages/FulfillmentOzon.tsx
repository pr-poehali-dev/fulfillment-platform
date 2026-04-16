import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SERVICES = [
  { icon: "Warehouse" as const, title: "Хранение на складе партнёра", desc: "Товар хранится на складе фулфилмент-партнёра — вы отгружаете крупными партиями и не платите за хранение на складе Ozon." },
  { icon: "Package", title: "Упаковка по стандартам Ozon", desc: "Правильная упаковка, маркировка и этикетирование по требованиям Ozon: полибэги, короба, стрейч, паллеты." },
  { icon: "Truck", title: "Доставка на склад Ozon", desc: "Партнёры регулярно отвозят товар на распределительные центры Ozon с бронированием слотов приёмки." },
  { icon: "Zap", title: "Экспресс-отгрузка (FBS)", desc: "Партнёр собирает и отправляет заказы покупателям по схеме FBS — быстро и без задержек по дедлайнам Ozon." },
  { icon: "RotateCcw", title: "Обработка возвратов", desc: "Приём возвратов, осмотр, фотофиксация дефектов, переупаковка и повторная подготовка к продаже." },
  { icon: "ClipboardList", title: "Управление остатками", desc: "Синхронизация остатков с вашим магазином на Ozon, предупреждения о дефиците, автоматические пополнения." },
];

const FAQS = [
  { q: "Какие схемы работы с Ozon поддерживают фулфилменты?", a: "Большинство партнёров работают по FBO (товар на складе Ozon) и FBS (товар на складе продавца/фулфилмента). Схема realFBS также поддерживается рядом партнёров. Уточняйте при выборе партнёра." },
  { q: "Сколько стоит фулфилмент для Ozon?", a: "Стоимость зависит от объёма, типа товара и региона. Хранение — от 5–20 руб./ед. в месяц, сборка — от 25–60 руб./заказ. Используйте каталог для сравнения тарифов конкретных партнёров." },
  { q: "Как фулфилмент помогает избежать штрафов Ozon?", a: "Опытные партнёры знают все требования маркетплейса: соблюдают дедлайны отгрузки, правильно упаковывают и маркируют товар, своевременно обновляют остатки. Это снижает количество отмен и штрафов." },
  { q: "Можно ли работать одновременно с Ozon и Wildberries через одного партнёра?", a: "Да, большинство фулфилмент-сервисов работают с несколькими маркетплейсами одновременно. Это удобно: один склад и один партнёр для всех ваших площадок." },
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

export default function FulfillmentOzon() {
  useEffect(() => {
    document.title = "Фулфилмент для Ozon — сравнить партнёров и тарифы | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Найдите фулфилмент-партнёра для Ozon. Хранение, упаковка, маркировка и доставка на склады Ozon. Сравнивайте тарифы FBO и FBS.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "faq-schema-ozon";
    document.head.appendChild(script);
    return () => { document.getElementById("faq-schema-ozon")?.remove(); };
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#005BFF]/10 border border-[#005BFF]/20 rounded-full text-sm text-[#4d8eff] font-medium mb-6">
            <Icon name="ShoppingCart" size={14} />
            Ozon
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            Фулфилмент для <span className="text-[#4d8eff]">Ozon</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Сравнивайте фулфилмент-партнёров для Ozon: хранение, упаковка, маркировка и доставка на склады маркетплейса по схемам FBO и FBS.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/?marketplace=ozon"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#005BFF] hover:bg-[#0047cc] text-white rounded-xl font-bold font-golos transition-all text-base">
              <Icon name="Search" size={18} />
              Найти партнёра для Ozon
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
            { value: "FBO/FBS", label: "схемы работы" },
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
            Услуги фулфилмент-партнёров для Ozon
          </h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
            Полный цикл от хранения до доставки заказов покупателям через склады Ozon
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
                <div className="w-10 h-10 bg-[#005BFF]/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={s.icon} size={20} className="text-[#4d8eff]" />
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
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#005BFF]/20 to-[#005BFF]/5 border border-[#005BFF]/20 rounded-2xl p-8 text-center">
          <h2 className="font-golos font-bold text-2xl text-white mb-3">
            Сравните партнёров для Ozon прямо сейчас
          </h2>
          <p className="text-white/60 mb-6">Фильтруйте по городу, тарифам и схемам работы. Запрашивайте КП в один клик.</p>
          <Link to="/?marketplace=ozon"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005BFF] hover:bg-[#0047cc] text-white rounded-xl font-bold font-golos transition-all">
            <Icon name="ArrowRight" size={18} />
            Перейти в каталог
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-10">
            Частые вопросы о фулфилменте для Ozon
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
            <Link to="/fulfillment/wildberries" className="hover:text-white/70 transition-colors">Фулфилмент для Wildberries</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Условия</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
