import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const ADVANTAGES = [
  { icon: "MapPin" as const, title: "Склады в Северо-Западном регионе", desc: "Партнёры в СПб работают с региональными складами Wildberries и Ozon, обеспечивая быструю доставку по СЗФО." },
  { icon: "Clock" as const, title: "Регулярные отгрузки", desc: "Поставки на склады маркетплейсов несколько раз в неделю. Ряд партнёров делает ежедневные отгрузки." },
  { icon: "Truck" as const, title: "Доставка по Петербургу и СЗФО", desc: "FBS-заказы отправляются покупателям по всему Северо-Западному федеральному округу в кратчайшие сроки." },
  { icon: "Building2" as const, title: "Современные склады", desc: "Партнёры располагают складами с соблюдением условий хранения: температурный режим, охрана, видеонаблюдение." },
];

const FAQS = [
  { q: "Есть ли склады Wildberries и Ozon в Санкт-Петербурге?", a: "Да, оба маркетплейса имеют склады и сортировочные центры в СПб и Ленинградской области. Это делает питерских фулфилмент-партнёров очень привлекательными для региональных продавцов." },
  { q: "Стоит ли питерский фулфилмент дешевле московского?", a: "Как правило, тарифы на хранение и обработку в Петербурге немного ниже московских при сопоставимом качестве услуг. Но итоговая стоимость зависит от конкретного партнёра — сравнивайте в каталоге." },
  { q: "Могу ли я работать с питерским фулфилментом, если я из другого города?", a: "Да. Вы отправляете товар на склад петербургского партнёра транспортной компанией, а дальше они берут на себя хранение, упаковку и отгрузку на маркетплейсы." },
  { q: "Как выбрать фулфилмент в Санкт-Петербурге?", a: "Перейдите в каталог FulfillHub, выберите город «Санкт-Петербург» и нужный маркетплейс. Сравните тарифы партнёров и отправьте запрос на КП тем, кто подходит." },
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
      "name": "FulfillHub — фулфилмент в Санкт-Петербурге",
      "description": "Каталог фулфилмент-партнёров в Санкт-Петербурге для селлеров маркетплейсов",
      "areaServed": { "@type": "City", "name": "Санкт-Петербург" },
      "url": "https://fulfillhub.ru/fulfillment/sankt-peterburg"
    }
  ]
};

export default function FulfillmentSpb() {
  useEffect(() => {
    document.title = "Фулфилмент в Санкт-Петербурге — партнёры для WB и Ozon | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Найдите фулфилмент-партнёра в Санкт-Петербурге. Хранение, упаковка и доставка на склады Wildberries и Ozon. Сравнивайте тарифы петербургских фулфилментов.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "schema-spb";
    document.head.appendChild(script);
    return () => { document.getElementById("schema-spb")?.remove(); };
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

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 font-medium mb-6">
            <Icon name="MapPin" size={14} />
            Санкт-Петербург и Ленинградская область
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            Фулфилмент в <span className="text-blue-400">Санкт-Петербурге</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Каталог фулфилмент-партнёров в СПб и Ленинградской области. Хранение, упаковка и доставка на склады Wildberries и Ozon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/?city=spb"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold font-golos transition-all text-base">
              <Icon name="Search" size={18} />
              Найти партнёра в СПб
            </Link>
            <Link to="/for-fulfillment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl font-medium transition-all text-base">
              <Icon name="Plus" size={18} />
              Разместить фулфилмент
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "СПб + ЛО", label: "зона покрытия" },
            { value: "WB + Ozon", label: "маркетплейсы" },
            { value: "2–3 дня", label: "доставка на склад" },
            { value: "0 ₽", label: "запрос КП бесплатно" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-golos font-bold text-2xl text-gold-400">{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-3">
            Преимущества фулфилмента в Петербурге
          </h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
            Удобная логистика для продавцов Северо-Западного региона
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={a.icon} size={20} className="text-blue-400" />
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

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-500/15 to-blue-500/5 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h2 className="font-golos font-bold text-2xl text-white mb-3">Найдите партнёра в Петербурге прямо сейчас</h2>
          <p className="text-white/60 mb-6">Фильтруйте по маркетплейсу, тарифам и услугам. КП — в один клик.</p>
          <Link to="/?city=spb" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold font-golos transition-all">
            <Icon name="ArrowRight" size={18} />
            Открыть каталог
          </Link>
        </div>
      </section>

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

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-xl text-white mb-5">Другие направления</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: "/fulfillment/moskva", label: "Фулфилмент в Москве", icon: "MapPin" as const },
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
            <Link to="/fulfillment/moskva" className="hover:text-white/70 transition-colors">Москва</Link>
            <Link to="/fulfillment/wildberries" className="hover:text-white/70 transition-colors">Wildberries</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
