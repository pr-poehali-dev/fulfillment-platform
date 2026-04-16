import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const COMPARISON = [
  {
    aspect: "Где хранится товар",
    fbo: "На складе маркетплейса (WB, Ozon)",
    fbs: "На складе продавца или фулфилмент-партнёра",
  },
  {
    aspect: "Кто собирает и отправляет заказ",
    fbo: "Маркетплейс",
    fbs: "Продавец или фулфилмент-партнёр",
  },
  {
    aspect: "Скорость доставки покупателю",
    fbo: "Очень быстро — товар уже на складе маркетплейса",
    fbs: "Зависит от скорости сборки и курьерской службы",
  },
  {
    aspect: "Стоимость хранения",
    fbo: "Платите маркетплейсу за хранение на их складе",
    fbs: "Платите фулфилменту или храните сами",
  },
  {
    aspect: "Гибкость",
    fbo: "Меньше — маркетплейс устанавливает правила",
    fbs: "Больше — вы контролируете склад и упаковку",
  },
  {
    aspect: "Подходит для",
    fbo: "Высокооборотных товаров с большим спросом",
    fbs: "Нишевых, крупногабаритных или дорогих товаров",
  },
];

const FAQS = [
  { q: "Что лучше для новичка — FBO или FBS?", a: "Для старта часто рекомендуют FBS: вы сохраняете контроль над товаром, не рискуете большими остатками на складе маркетплейса и лучше понимаете спрос. Когда товар показывает стабильные продажи — переходите на FBO." },
  { q: "Можно ли работать по обеим схемам одновременно?", a: "Да. Многие продавцы используют FBO для топовых товаров (быстрая доставка = выше позиции в поиске) и FBS для нового или сезонного ассортимента. Фулфилмент-партнёры поддерживают обе схемы." },
  { q: "Влияет ли схема работы на позиции в поиске маркетплейса?", a: "Да. На Wildberries и Ozon товары по FBO, как правило, имеют преимущество в ранжировании, так как маркетплейс может гарантировать быструю доставку. FBS-товары могут уступать при прочих равных." },
  { q: "Как фулфилмент помогает с FBS?", a: "Фулфилмент-партнёр хранит ваш товар, собирает заказы за вас и отправляет их в сроки, установленные маркетплейсом. Вы получаете все преимущества FBS без необходимости держать собственный склад." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "FBO vs FBS: в чём разница и какую схему выбрать",
      "description": "Подробное сравнение схем FBO и FBS для продавцов на Wildberries и Ozon. Что лучше выбрать и как фулфилмент помогает с обеими схемами.",
      "url": "https://fulfillhub.ru/fbo-vs-fbs",
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

export default function FboVsFbs() {
  useEffect(() => {
    document.title = "FBO vs FBS — разница и что выбрать для Wildberries и Ozon | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Чем отличается FBO от FBS на Wildberries и Ozon. Сравнение схем работы, плюсы и минусы каждой, советы по выбору и как фулфилмент помогает продавцам.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "schema-fbo-fbs";
    document.head.appendChild(script);
    return () => { document.getElementById("schema-fbo-fbs")?.remove(); };
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 font-medium mb-6">
            <Icon name="GitCompare" size={14} />
            Сравнение схем работы
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            <span className="text-[#cb11ab]">FBO</span> vs <span className="text-[#005BFF]">FBS</span>: в чём разница
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Подробное сравнение двух схем работы на Wildberries и Ozon. Разбираемся, какую выбрать и как фулфилмент помогает с обеими схемами.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all text-base">
            <Icon name="Search" size={18} />
            Найти фулфилмент-партнёра
          </Link>
        </div>
      </section>

      {/* Quick definition */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#cb11ab]/10 border border-[#cb11ab]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#cb11ab]/20 rounded-xl flex items-center justify-center">
                <Icon name="Warehouse" size={20} className="text-[#cb11ab]" />
              </div>
              <h2 className="font-golos font-bold text-xl text-white">FBO</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              <strong className="text-white">Fulfillment by Operator</strong> — товар хранится на складе маркетплейса. Маркетплейс сам собирает и отправляет заказы покупателям.
            </p>
          </div>
          <div className="bg-[#005BFF]/10 border border-[#005BFF]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#005BFF]/20 rounded-xl flex items-center justify-center">
                <Icon name="Store" size={20} className="text-[#4d8eff]" />
              </div>
              <h2 className="font-golos font-bold text-xl text-white">FBS</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              <strong className="text-white">Fulfillment by Seller</strong> — товар хранится у продавца или фулфилмент-партнёра. Продавец/фулфилмент собирает и отправляет заказы.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-10">Сравнение FBO и FBS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/50 text-sm font-medium w-1/3">Параметр</th>
                  <th className="text-left py-3 px-4 text-[#cb11ab] text-sm font-bold">FBO</th>
                  <th className="text-left py-3 px-4 text-[#4d8eff] text-sm font-bold">FBS</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.aspect} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/2" : ""}`}>
                    <td className="py-4 px-4 text-white/60 text-sm font-medium">{row.aspect}</td>
                    <td className="py-4 px-4 text-white/80 text-sm">{row.fbo}</td>
                    <td className="py-4 px-4 text-white/80 text-sm">{row.fbs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-gold-500/15 to-gold-500/5 border border-gold-500/20 rounded-2xl p-8 text-center">
          <h2 className="font-golos font-bold text-2xl text-white mb-3">Нужен партнёр для FBO или FBS?</h2>
          <p className="text-white/60 mb-6">В каталоге FulfillHub — партнёры, работающие по обеим схемам. Сравнивайте тарифы и запрашивайте КП.</p>
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
              { to: "/chto-takoe-fulfillment", label: "Что такое фулфилмент", icon: "BookOpen" as const },
              { to: "/kalkulator-fulfillmenta", label: "Калькулятор стоимости", icon: "Calculator" as const },
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
            <Link to="/chto-takoe-fulfillment" className="hover:text-white/70 transition-colors">Что такое фулфилмент</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
