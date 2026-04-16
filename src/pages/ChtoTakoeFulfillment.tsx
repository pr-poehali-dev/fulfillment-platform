import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const STEPS = [
  { num: "01", icon: "Package" as const, title: "Вы отправляете товар на склад", desc: "Продавец привозит или отправляет транспортной компанией свой товар на склад фулфилмент-партнёра." },
  { num: "02", icon: "ClipboardList" as const, title: "Партнёр принимает и хранит", desc: "Фулфилмент проверяет товар, ставит на учёт, размещает на стеллажах. Вы в любой момент видите остатки." },
  { num: "03", icon: "ShoppingCart" as const, title: "Покупатель делает заказ", desc: "Заказ поступает с маркетплейса (WB, Ozon и др.) в систему фулфилмента автоматически." },
  { num: "04", icon: "PackageCheck" as const, title: "Партнёр собирает и упаковывает", desc: "Сотрудники склада комплектуют заказ, упаковывают по стандартам маркетплейса и наклеивают этикетку." },
  { num: "05", icon: "Truck" as const, title: "Отгрузка на маркетплейс или покупателю", desc: "По схеме FBO товар едет на склад маркетплейса, по FBS — напрямую покупателю через курьерскую службу." },
];

const SERVICES = [
  { icon: "Warehouse" as const, title: "Хранение", desc: "Ответственное хранение на сертифицированных складах" },
  { icon: "Package" as const, title: "Упаковка", desc: "Упаковка по стандартам каждого маркетплейса" },
  { icon: "Tag" as const, title: "Маркировка", desc: "Штрихкоды, этикетки, честный знак" },
  { icon: "Truck" as const, title: "Доставка", desc: "Отгрузка на склады WB, Ozon и других площадок" },
  { icon: "RotateCcw" as const, title: "Возвраты", desc: "Приём и обработка возвратов от покупателей" },
  { icon: "BarChart2" as const, title: "Отчётность", desc: "Учёт остатков, отчёты, личный кабинет" },
];

const FAQS = [
  { q: "Чем фулфилмент отличается от обычного склада?", a: "Обычный склад просто хранит товар. Фулфилмент — это комплексная услуга: хранение + упаковка + маркировка + отгрузка на маркетплейс + обработка возвратов. Фулфилмент полностью берёт на себя логистику." },
  { q: "Кому нужен фулфилмент?", a: "Фулфилмент нужен продавцам на маркетплейсах (Wildberries, Ozon, Яндекс Маркет и др.), у которых нет своего склада или возможности самостоятельно обрабатывать и отправлять заказы." },
  { q: "Сколько стоит фулфилмент?", a: "Стоимость складывается из: хранения (5–20 руб./ед. в месяц), сборки заказа (20–70 руб.), доставки на склад маркетплейса. Итоговая цена зависит от объёма, типа товара и партнёра." },
  { q: "Как выбрать надёжный фулфилмент?", a: "Обращайте внимание на опыт работы с вашим маркетплейсом, наличие договора, отзывы других продавцов, прозрачность тарифов и скорость обработки заказов. На FulfillHub вы можете сравнить всех партнёров в одном месте." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Что такое фулфилмент — полное руководство для селлеров маркетплейсов",
      "description": "Объясняем простыми словами: что такое фулфилмент, как он работает, сколько стоит и как выбрать партнёра для Wildberries и Ozon.",
      "url": "https://fulfillhub.ru/chto-takoe-fulfillment",
      "inLanguage": "ru",
      "publisher": { "@type": "Organization", "name": "FulfillHub", "url": "https://fulfillhub.ru" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};

export default function ChtoTakoeFulfillment() {
  useEffect(() => {
    document.title = "Что такое фулфилмент — руководство для селлеров маркетплейсов | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Что такое фулфилмент, как он работает и зачем нужен продавцам на маркетплейсах. Объясняем простыми словами: хранение, упаковка, отгрузка на Wildberries и Ozon.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "schema-what-is";
    document.head.appendChild(script);
    return () => { document.getElementById("schema-what-is")?.remove(); };
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 font-medium mb-6">
            <Icon name="BookOpen" size={14} />
            Руководство для селлеров
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            Что такое <span className="text-gold-400">фулфилмент</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Простое объяснение: как работает фулфилмент, зачем он нужен продавцам на маркетплейсах и как выбрать надёжного партнёра
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all text-base">
            <Icon name="Search" size={18} />
            Найти фулфилмент-партнёра
          </Link>
        </div>
      </section>

      {/* Definition */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="font-golos font-bold text-2xl text-white mb-4">Определение</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            <strong className="text-white">Фулфилмент</strong> (от англ. fulfillment — «выполнение») — это комплекс услуг по обработке и доставке заказов. Фулфилмент-партнёр берёт на себя хранение товара продавца, упаковку заказов, маркировку и отправку на склады маркетплейсов или покупателям.
          </p>
          <p className="text-white/60 text-base leading-relaxed mt-4">
            Для продавца на Wildberries или Ozon это означает: вы занимаетесь закупкой и продажами, а всю логистику — хранение, упаковку, отгрузку — берёт на себя партнёр.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-3">Как работает фулфилмент</h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">5 шагов от вашего товара до покупателя</p>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.num} className="flex gap-5 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 bg-gold-500/15 rounded-xl flex items-center justify-center">
                    <Icon name={s.icon} size={20} className="text-gold-400" />
                  </div>
                  <span className="font-golos font-bold text-xs text-white/30">{s.num}</span>
                </div>
                <div>
                  <h3 className="font-golos font-semibold text-white text-base mb-1.5">{s.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-3">Что входит в услуги фулфилмента</h2>
          <p className="text-white/50 text-center mb-10">Стандартный набор услуг большинства партнёров</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-gold-500/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name={s.icon} size={20} className="text-gold-400" />
                </div>
                <h3 className="font-golos font-semibold text-white text-sm mb-1">{s.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-gold-500/15 to-gold-500/5 border border-gold-500/20 rounded-2xl p-8 text-center">
          <h2 className="font-golos font-bold text-2xl text-white mb-3">Готовы выбрать фулфилмент-партнёра?</h2>
          <p className="text-white/60 mb-6">В каталоге FulfillHub — проверенные партнёры для Wildberries, Ozon и других маркетплейсов. Сравнивайте тарифы и запрашивайте КП бесплатно.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all">
            <Icon name="ArrowRight" size={18} />
            Открыть каталог партнёров
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

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-xl text-white mb-5">Читайте также</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: "/fbo-vs-fbs", label: "FBO vs FBS: в чём разница", icon: "GitCompare" as const },
              { to: "/kalkulator-fulfillmenta", label: "Калькулятор стоимости фулфилмента", icon: "Calculator" as const },
              { to: "/fulfillment/wildberries", label: "Фулфилмент для Wildberries", icon: "ShoppingBag" as const },
              { to: "/fulfillment/ozon", label: "Фулфилмент для Ozon", icon: "ShoppingCart" as const },
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
            <Link to="/fulfillment/wildberries" className="hover:text-white/70 transition-colors">Wildberries</Link>
            <Link to="/fulfillment/ozon" className="hover:text-white/70 transition-colors">Ozon</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
