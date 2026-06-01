import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const POINTS = [
  { icon: "Warehouse", label: "Хранение товара на складе партнёра" },
  { icon: "PackageCheck", label: "Сборка и упаковка заказов" },
  { icon: "Tag", label: "Маркировка и Честный Знак" },
  { icon: "Truck", label: "Отгрузка на WB, Ozon и другие площадки" },
  { icon: "RotateCcw", label: "Обработка возвратов" },
  { icon: "BarChart2", label: "Учёт остатков и отчётность" },
];

export default function WhatIsFulfillmentTeaser() {
  return (
    <section className="bg-white border-b border-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-medium text-purple-600 font-ibm mb-4">
              <Icon name="BookOpen" size={12} />
              Для тех, кто только разбирается
            </div>
            <h2 className="font-golos font-bold text-2xl md:text-3xl text-navy-950 mb-3 leading-tight">
              Что такое фулфилмент<br className="hidden md:block" /> и зачем он нужен?
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              <strong className="text-navy-950">Фулфилмент</strong> — это когда сторонний склад берёт на себя всю логистику: хранит ваш товар, собирает заказы и отправляет их покупателям или на склад маркетплейса. Вы занимаетесь закупками и продажами — партнёр делает всё остальное.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Особенно актуально для продавцов на Wildberries и Ozon: фулфилмент-центр следит за остатками, маркирует товар по требованиям площадки и вовремя делает поставки, чтобы вы не теряли позиции из-за нулевых остатков.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/chto-takoe-fulfillment"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-lg text-sm font-medium font-golos transition-all"
              >
                Читать подробный гайд
                <Icon name="ArrowRight" size={14} />
              </Link>
              <Link
                to="/fbo-vs-fbs"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:border-navy-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium font-golos transition-all"
              >
                FBO vs FBS — в чём разница?
              </Link>
            </div>
          </div>

          {/* Right: what's included */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider font-ibm mb-4">Что входит в услугу</p>
            <ul className="space-y-3">
              {POINTS.map((p) => (
                <li key={p.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon name={p.icon as "Warehouse"} size={15} className="text-navy-700" />
                  </div>
                  <span className="text-sm text-gray-700 font-ibm">{p.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-ibm mb-3">Сравните стоимость у разных партнёров:</p>
              <Link
                to="/kalkulator-fulfillmenta"
                className="inline-flex items-center gap-1.5 text-sm text-navy-700 hover:text-navy-950 font-medium transition-colors"
              >
                <Icon name="Calculator" size={14} />
                Калькулятор фулфилмента
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
