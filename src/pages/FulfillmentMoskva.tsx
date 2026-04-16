import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const ADVANTAGES = [
  { icon: "MapPin" as const, title: "Склады рядом с WB и Ozon", desc: "Партнёры в Москве расположены в зонах быстрого доступа к распределительным центрам Wildberries (Подольск, Электросталь) и Ozon (Хоругвино, Пушкино)." },
  { icon: "Clock" as const, title: "Быстрая приёмка", desc: "Московские партнёры делают поставки на склады маркетплейсов ежедневно — ваш товар появляется в продаже максимально быстро." },
  { icon: "Truck" as const, title: "Курьерская доставка", desc: "Отправка FBS-заказов покупателям по Москве и МО в день сборки. Широкая сеть курьерских служб." },
  { icon: "Building2" as const, title: "Крупные склады", desc: "Московские фулфилмент-центры располагают площадями от 500 до 10 000 м² — подходят для любых объёмов." },
];

const FAQS = [
  { q: "Почему важно выбирать фулфилмент именно в Москве?", a: "Основные склады Wildberries и Ozon сосредоточены в Московской области. Близость партнёра к этим складам сокращает время и стоимость доставки, снижает риск задержек приёмки." },
  { q: "Сколько стоит фулфилмент в Москве?", a: "Стоимость хранения — от 5–15 руб./ед. в месяц, сборка заказа — от 30–70 руб. Московские партнёры немного дороже региональных, но быстрее доставляют на склады маркетплейсов." },
  { q: "Как найти фулфилмент в Москве через FulfillHub?", a: "Перейдите в каталог, выберите город «Москва» в фильтрах и укажите нужный маркетплейс. Вы увидите всех подходящих партнёров с тарифами и можете отправить запрос на КП прямо с сайта." },
  { q: "Работают ли московские фулфилменты с регионами?", a: "Да, большинство московских партнёров принимают товар от клиентов со всей России — вы отправляете товар на склад партнёра транспортной компанией, дальше они берут все операции на себя." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@type": "LocalBusiness",
      "name": "FulfillHub — фулфилмент в Москве",
      "description": "Каталог фулфилмент-партнёров в Москве для селлеров маркетплейсов",
      "areaServed": { "@type": "City", "name": "Москва" },
      "url": "https://fulfillhub.ru/fulfillment/moskva"
    }
  ]
};

export default function FulfillmentMoskva() {
  useEffect(() => {
    document.title = "Фулфилмент в Москве — партнёры для Wildberries и Ozon | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Найдите фулфилмент-партнёра в Москве. Хранение, упаковка и доставка на склады Wildberries и Ozon. Сравнивайте тарифы московских фулфилментов.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "schema-moskva";
    document.head.appendChild(script);
    return () => { document.getElementById("schema-moskva")?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-white">
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
            <Link to="/for-fulfillment" className="px-3 py-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded transition-all">Разместить сервис</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-sm text-gold-400 font-medium mb-6">
            <Icon name="MapPin" size={14} />
            Москва и Московская область
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            Фулфилмент в <span className="text-gold-400">Москве</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Каталог фулфилмент-партнёров в Москве и МО. Хранение, упаковка, маркировка и доставка на склады Wildberries и Ozon — сравнивайте тарифы и выбирайте.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/?city=moskva"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all text-base">
              <Icon name="Search" size={18} />
              Найти партнёра в Москве
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
            { value: "Москва", label: "и Московская область" },
            { value: "WB + Ozon", label: "основные маркетплейсы" },
            { value: "1 день", label: "доставка на склад WB/Ozon" },
            { value: "0 ₽", label: "запрос КП бесплатно" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-golos font-bold text-2xl text-gold-400">{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-3">
            Преимущества фулфилмента в Москве
          </h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
            Московские партнёры — оптимальный выбор для продаж на крупнейших маркетплейсах России
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 bg-gold-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={a.icon} size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-golos font-semibold text-white text-base mb-1.5">{a.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-gold-500/15 to-gold-500/5 border border-gold-500/20 rounded-2xl p-8 text-center">
          <h2 className="font-golos font-bold text-2xl text-white mb-3">Найдите фулфилмент в Москве за 3 минуты</h2>
          <p className="text-white/60 mb-6">Сравнивайте тарифы, отправляйте запросы на КП, выбирайте лучшего партнёра.</p>
          <Link to="/?city=moskva" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all">
            <Icon name="ArrowRight" size={18} />
            Открыть каталог
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-10">Частые вопросы</h2>
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

      {/* Internal links */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-xl text-white mb-5">Другие направления</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: "/fulfillment/sankt-peterburg", label: "Фулфилмент в Санкт-Петербурге", icon: "MapPin" as const },
              { to: "/fulfillment/wildberries", label: "Фулфилмент для Wildberries", icon: "ShoppingBag" as const },
              { to: "/fulfillment/ozon", label: "Фулфилмент для Ozon", icon: "ShoppingCart" as const },
              { to: "/chto-takoe-fulfillment", label: "Что такое фулфилмент", icon: "BookOpen" as const },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all text-white/70 hover:text-white text-sm font-medium">
                <Icon name={l.icon} size={16} className="text-gold-400" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={11} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-sm">FulfillHub</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/40 justify-center">
            <Link to="/" className="hover:text-white/70 transition-colors">Каталог</Link>
            <Link to="/fulfillment/wildberries" className="hover:text-white/70 transition-colors">Для Wildberries</Link>
            <Link to="/fulfillment/ozon" className="hover:text-white/70 transition-colors">Для Ozon</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
