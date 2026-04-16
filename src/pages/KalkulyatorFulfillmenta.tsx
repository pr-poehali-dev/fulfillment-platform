import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const STORAGE_RATES: Record<string, number> = { small: 8, medium: 12, large: 18, oversized: 25 };
const ASSEMBLY_RATES: Record<string, number> = { small: 25, medium: 35, large: 55, oversized: 90 };
const DELIVERY_RATES: Record<string, number> = { wb: 12, ozon: 14, yandex: 16, other: 15 };

type SizeKey = "small" | "medium" | "large" | "oversized";
type MarketKey = "wb" | "ozon" | "yandex" | "other";

const SIZE_LABELS: Record<SizeKey, string> = {
  small: "Мелкий (до 0.5 кг)",
  medium: "Средний (0.5–2 кг)",
  large: "Крупный (2–10 кг)",
  oversized: "Негабарит (>10 кг)",
};

const MARKET_LABELS: Record<MarketKey, string> = {
  wb: "Wildberries",
  ozon: "Ozon",
  yandex: "Яндекс Маркет",
  other: "Другой маркетплейс",
};

const FAQS = [
  { q: "Из чего складывается стоимость фулфилмента?", a: "Основные статьи: хранение (за единицу товара в месяц), сборка заказа (за каждый заказ), доставка на склад маркетплейса. Дополнительно могут быть: маркировка, возвраты, обработка брака." },
  { q: "Почему тарифы у партнёров различаются?", a: "Разница в тарифах зависит от расположения склада, оборудования, объёма ваших отгрузок и набора услуг. Крупные партнёры с большим потоком могут предложить более низкие цены." },
  { q: "Как снизить стоимость фулфилмента?", a: "Основные способы: увеличить объём (партнёры дают скидки), выбрать склад в регионе (дешевле Москвы), оптимизировать упаковку, работать по FBO для ходовых товаров." },
  { q: "Калькулятор показывает точную стоимость?", a: "Нет, это примерный расчёт для ориентира. Точные тарифы зависят от конкретного партнёра, объёмов, типа товара и набора услуг. Запросите КП у партнёров в каталоге для точных цифр." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Калькулятор стоимости фулфилмента",
      "url": "https://fulfillhub.ru/kalkulator-fulfillmenta",
      "description": "Рассчитайте примерную стоимость фулфилмента для вашего товара на Wildberries, Ozon и других маркетплейсах.",
      "applicationCategory": "BusinessApplication"
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

export default function KalkulyatorFulfillmenta() {
  const [units, setUnits] = useState(500);
  const [ordersPerMonth, setOrdersPerMonth] = useState(200);
  const [size, setSize] = useState<SizeKey>("medium");
  const [market, setMarket] = useState<MarketKey>("wb");

  const storageMonth = units * STORAGE_RATES[size];
  const assemblyMonth = ordersPerMonth * ASSEMBLY_RATES[size];
  const deliveryMonth = ordersPerMonth * DELIVERY_RATES[market];
  const totalMonth = storageMonth + assemblyMonth + deliveryMonth;
  const perOrder = ordersPerMonth > 0 ? Math.round(totalMonth / ordersPerMonth) : 0;

  useEffect(() => {
    document.title = "Калькулятор стоимости фулфилмента для маркетплейсов | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Рассчитайте стоимость фулфилмента для Wildberries, Ozon и других маркетплейсов. Онлайн-калькулятор: хранение, сборка, доставка. Сравните тарифы партнёров.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "schema-calc";
    document.head.appendChild(script);
    return () => { document.getElementById("schema-calc")?.remove(); };
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
      <section className="pt-28 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-sm text-gold-400 font-medium mb-6">
            <Icon name="Calculator" size={14} />
            Онлайн-калькулятор
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Калькулятор стоимости <span className="text-gold-400">фулфилмента</span>
          </h1>
          <p className="text-white/60 text-lg mb-4 max-w-2xl mx-auto">
            Рассчитайте примерные затраты на хранение, сборку и доставку для вашего товара на маркетплейсах
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="font-golos font-bold text-xl text-white">Параметры товара</h2>

            {/* Units */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Остаток на складе (единиц): <span className="text-white font-bold">{units.toLocaleString("ru")}</span></label>
              <input type="range" min={50} max={10000} step={50} value={units}
                onChange={e => setUnits(Number(e.target.value))}
                className="w-full accent-gold-500" />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>50</span><span>10 000</span></div>
            </div>

            {/* Orders */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Заказов в месяц: <span className="text-white font-bold">{ordersPerMonth.toLocaleString("ru")}</span></label>
              <input type="range" min={10} max={5000} step={10} value={ordersPerMonth}
                onChange={e => setOrdersPerMonth(Number(e.target.value))}
                className="w-full accent-gold-500" />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>10</span><span>5 000</span></div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Размер товара</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SIZE_LABELS) as SizeKey[]).map(k => (
                  <button key={k} onClick={() => setSize(k)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${size === k ? "bg-gold-500 text-navy-950 border-gold-500 font-bold" : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"}`}>
                    {SIZE_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>

            {/* Market */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Маркетплейс</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MARKET_LABELS) as MarketKey[]).map(k => (
                  <button key={k} onClick={() => setMarket(k)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${market === k ? "bg-gold-500 text-navy-950 border-gold-500 font-bold" : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"}`}>
                    {MARKET_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-gold-500/20 to-gold-500/5 border border-gold-500/30 rounded-2xl p-6 text-center">
              <p className="text-white/60 text-sm mb-2">Итого в месяц (ориентир)</p>
              <p className="font-golos font-bold text-4xl text-gold-400">{totalMonth.toLocaleString("ru")} ₽</p>
              <p className="text-white/40 text-xs mt-2">{perOrder} ₽ на один заказ</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="font-golos font-semibold text-white text-sm mb-3">Разбивка затрат</h3>
              {[
                { label: "Хранение", value: storageMonth, icon: "Warehouse" as const },
                { label: "Сборка заказов", value: assemblyMonth, icon: "Package" as const },
                { label: "Доставка на склад", value: deliveryMonth, icon: "Truck" as const },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Icon name={item.icon} size={14} className="text-white/40" />
                    {item.label}
                  </div>
                  <span className="text-white font-medium text-sm">{item.value.toLocaleString("ru")} ₽</span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white/50 text-xs leading-relaxed mb-4">
                Расчёт ориентировочный. Точные тарифы зависят от партнёра, объёма и условий договора.
              </p>
              <Link to="/" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all text-sm">
                <Icon name="ArrowRight" size={16} />
                Получить точное КП
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-golos font-bold text-3xl text-white text-center mb-10">Частые вопросы о стоимости фулфилмента</h2>
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
              { to: "/fbo-vs-fbs", label: "FBO vs FBS: в чём разница", icon: "GitCompare" as const },
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
            <Link to="/fbo-vs-fbs" className="hover:text-white/70 transition-colors">FBO vs FBS</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
