import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const STEPS = [
  { num: "01", icon: "Package" as const, title: "Вы отправляете товар на склад", desc: "Продавец привозит или отправляет транспортной компанией свой товар на склад фулфилмент-партнёра. Партнёр принимает, пересчитывает и фиксирует приёмку." },
  { num: "02", icon: "ClipboardList" as const, title: "Партнёр принимает и хранит", desc: "Фулфилмент проверяет товар, ставит на учёт, размещает на стеллажах. Вы в любой момент видите остатки в личном кабинете." },
  { num: "03", icon: "ShoppingCart" as const, title: "Покупатель делает заказ", desc: "Заказ поступает с маркетплейса (WB, Ozon и др.) в систему фулфилмента автоматически — никакого ручного ввода." },
  { num: "04", icon: "PackageCheck" as const, title: "Партнёр собирает и упаковывает", desc: "Сотрудники склада комплектуют заказ, упаковывают по стандартам маркетплейса, наклеивают этикетку и код маркировки." },
  { num: "05", icon: "Truck" as const, title: "Отгрузка на маркетплейс или покупателю", desc: "По схеме FBO товар едет на склад маркетплейса, по FBS — напрямую покупателю через курьерскую службу. Партнёр берёт это на себя." },
];

const SERVICES = [
  { icon: "Warehouse" as const, title: "Хранение", desc: "Ответственное хранение на сертифицированных складах. Учёт по ячейкам, доступ к остаткам онлайн." },
  { icon: "Package" as const, title: "Упаковка", desc: "Упаковка по стандартам каждого маркетплейса: короба, пакеты, стрейч, пупырчатая плёнка." },
  { icon: "Tag" as const, title: "Маркировка", desc: "Штрихкоды, этикетки маркетплейсов, Честный Знак, ЕГАИС — в зависимости от категории товара." },
  { icon: "Truck" as const, title: "Доставка", desc: "Отгрузка на склады WB, Ozon, Яндекс Маркет и других площадок по расписанию поставок." },
  { icon: "RotateCcw" as const, title: "Возвраты", desc: "Приём, проверка и повторная подготовка к продаже возвратов от покупателей." },
  { icon: "BarChart2" as const, title: "Отчётность", desc: "Учёт остатков, история операций, отчёты по движению товара в личном кабинете." },
  { icon: "Camera" as const, title: "Фотосъёмка", desc: "Предметная съёмка товара для карточек маркетплейсов — есть у части партнёров." },
  { icon: "ShieldCheck" as const, title: "Проверка качества", desc: "Входной контроль: проверка на брак, соответствие количеству, целостность упаковки." },
];

const WHO_NEEDS = [
  {
    icon: "TrendingUp" as const,
    title: "Растущий продавец",
    desc: "У вас 200–500 заказов в месяц и больше, склад дома уже не справляется. Фулфилмент освобождает время и масштабирует операции без найма сотрудников.",
  },
  {
    icon: "MapPin" as const,
    title: "Иногородний продавец",
    desc: "Вы продаёте на Wildberries, но склад маркетплейса — в Москве или Питере. Фулфилмент-партнёр в нужном городе избавляет от дорогой доставки и штрафов за срыв поставок.",
  },
  {
    icon: "Layers" as const,
    title: "Мультиканальный продавец",
    desc: "Вы торгуете сразу на нескольких площадках: WB + Ozon + свой сайт. Фулфилмент обрабатывает все каналы из одного склада.",
  },
  {
    icon: "Zap" as const,
    title: "Селлер в сезонный пик",
    desc: "Новый год, 8 марта, Чёрная пятница — объём резко растёт. Партнёр масштабирует мощности, вы не теряете заказы из-за нехватки рук.",
  },
];

const MYTHS = [
  {
    myth: "Фулфилмент — только для крупного бизнеса",
    fact: "Многие партнёры работают от 100–300 единиц товара в месяц. Небольшим продавцам фулфилмент особенно выгоден — не нужно арендовать склад и нанимать людей.",
  },
  {
    myth: "Это слишком дорого",
    fact: "Когда вы считаете аренду склада, зарплату кладовщика, упаковочные материалы и своё время — фулфилмент часто оказывается дешевле. Используйте наш калькулятор для расчёта.",
  },
  {
    myth: "Я потеряю контроль над товаром",
    fact: "Нормальный партнёр предоставляет личный кабинет с остатками в реальном времени, актами приёмки и историей операций. Контроль остаётся за вами.",
  },
  {
    myth: "Все фулфилменты одинаковые",
    fact: "На рынке огромный разброс: от гаражных складов до сертифицированных операторов с аккредитацией маркетплейсов. Именно поэтому важно сравнивать партнёров перед выбором.",
  },
];

const FAQS = [
  {
    q: "Чем фулфилмент отличается от обычного склада?",
    a: "Обычный склад просто хранит товар. Фулфилмент — это комплексная услуга: хранение + упаковка + маркировка + отгрузка на маркетплейс + обработка возвратов. Фулфилмент полностью берёт на себя операционную логистику.",
  },
  {
    q: "Кому нужен фулфилмент?",
    a: "Прежде всего — продавцам на маркетплейсах (Wildberries, Ozon, Яндекс Маркет и др.), у которых нет своего склада или нет возможности самостоятельно обрабатывать и отправлять заказы. Также актуален для D2C-брендов и B2B-поставщиков.",
  },
  {
    q: "Сколько стоит фулфилмент?",
    a: "Стоимость складывается из нескольких статей: хранение (5–25 руб./ед. в месяц), сборка заказа (20–80 руб./заказ), упаковочные материалы (5–30 руб.), доставка на склад маркетплейса. Итоговая цена сильно зависит от объёма, типа товара и конкретного партнёра. Воспользуйтесь нашим калькулятором для предварительного расчёта.",
  },
  {
    q: "Как выбрать надёжный фулфилмент?",
    a: "Обращайте внимание на: опыт работы с вашим маркетплейсом, наличие договора и страховки, отзывы реальных продавцов, прозрачность тарифов, скорость обработки заказов, наличие личного кабинета с остатками. На FulfillHub вы можете сравнить всех партнёров по этим параметрам в одном месте.",
  },
  {
    q: "Что такое FBO и FBS?",
    a: "FBO (Fulfillment by Operator) — товар хранится на складе маркетплейса, площадка сама комплектует и отправляет заказы. FBS (Fulfillment by Seller) — товар хранится у вас или на складе фулфилмент-партнёра, вы или партнёр делаете поставку после каждого заказа. Подробнее — в нашем сравнении FBO vs FBS.",
  },
  {
    q: "Можно ли работать сразу с несколькими маркетплейсами?",
    a: "Да. Большинство крупных фулфилмент-центров работают со всеми основными площадками: Wildberries, Ozon, Яндекс Маркет и другими. Одновременное использование нескольких каналов из одного склада — стандартная практика.",
  },
  {
    q: "Что если партнёр потеряет или испортит товар?",
    a: "Надёжный партнёр работает по договору с прописанной материальной ответственностью. При приёмке составляется акт, и в случае недостачи или порчи партнёр компенсирует ущерб. Обязательно проверяйте этот пункт в договоре.",
  },
  {
    q: "Как быстро можно начать работу?",
    a: "Обычно 3–7 рабочих дней: подписание договора, согласование тарифов, первая поставка товара на склад. После этого партнёр начинает обрабатывать заказы. Некоторые фулфилменты предлагают ускоренный старт — уточняйте при запросе КП.",
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Что такое фулфилмент — полное руководство для селлеров маркетплейсов",
      "description": "Объясняем простыми словами: что такое фулфилмент, как он работает, кому нужен, сколько стоит и как выбрать партнёра для Wildberries и Ozon.",
      "url": "https://fulfillhub.ru/chto-takoe-fulfillment",
      "inLanguage": "ru",
      "publisher": { "@type": "Organization", "name": "FulfillHub", "url": "https://fulfillhub.ru" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  ],
};

export default function ChtoTakoeFulfillment() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Что такое фулфилмент — полное руководство для селлеров | FulfillHub";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Что такое фулфилмент, как он работает, кому нужен и сколько стоит. Полный гайд для продавцов на Wildberries, Ozon и Яндекс Маркете с примерами и сравнением партнёров.");
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(SCHEMA);
    script.id = "schema-what-is";
    document.head.appendChild(script);
    return () => { document.getElementById("schema-what-is")?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white text-navy-950">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-navy-950 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-gold-400" />
            </div>
            <span className="font-golos font-bold text-navy-950 text-base tracking-tight">FulfillHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/fbo-vs-fbs" className="hidden sm:block text-sm text-gray-500 hover:text-navy-950 transition-colors">FBO vs FBS</Link>
            <Link to="/kalkulator-fulfillmenta" className="hidden sm:block text-sm text-gray-500 hover:text-navy-950 transition-colors">Калькулятор</Link>
            <Link to="/" className="px-3 py-1.5 bg-navy-950 hover:bg-navy-800 text-white text-sm font-medium rounded-lg transition-all font-golos">
              Найти партнёра
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-14 px-4 bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 font-ibm mb-6">
            <Icon name="BookOpen" size={13} />
            Руководство для селлеров маркетплейсов
          </div>
          <h1 className="font-golos font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            Что такое <span className="text-gold-400">фулфилмент</span>
          </h1>
          <p className="text-white/65 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Полное объяснение: как работает фулфилмент, зачем он нужен продавцам на маркетплейсах, сколько стоит и как выбрать надёжного партнёра
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all text-base">
              <Icon name="Search" size={16} />
              Найти фулфилмент-партнёра
            </Link>
            <Link to="/kalkulator-fulfillmenta" className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-medium font-golos transition-all text-base">
              <Icon name="Calculator" size={16} />
              Рассчитать стоимость
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-gray-400 font-ibm">
          <Link to="/" className="hover:text-navy-950 transition-colors">FulfillHub</Link>
          <Icon name="ChevronRight" size={11} />
          <span className="text-gray-600">Что такое фулфилмент</span>
        </div>
      </div>

      {/* Definition */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-navy-950 text-white rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="BookMarked" size={18} className="text-gold-400" />
              <span className="text-sm font-medium text-white/60 font-ibm uppercase tracking-wider">Определение</span>
            </div>
            <p className="text-xl md:text-2xl font-golos font-medium leading-relaxed mb-4">
              <span className="text-gold-400">Фулфилмент</span> (от англ. fulfillment — «выполнение») — это комплекс услуг по хранению, обработке и доставке заказов, которые продавец передаёт стороннему партнёру.
            </p>
            <p className="text-white/60 text-base leading-relaxed">
              Фулфилмент-центр берёт на себя всю операционную логистику: принимает товар на склад, хранит его, собирает заказы, упаковывает по стандартам маркетплейса, маркирует и отправляет — на склад Wildberries или Ozon, либо напрямую покупателю. Продавец при этом занимается тем, что важно: закупками, маркетингом и развитием ассортимента.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-golos font-bold text-3xl md:text-4xl text-navy-950 mb-3">Как работает фулфилмент</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Весь путь от вашего товара до покупателя — 5 шагов</p>
          </div>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex gap-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-11 h-11 bg-navy-950 rounded-xl flex items-center justify-center">
                    <Icon name={s.icon} size={20} className="text-gold-400" />
                  </div>
                  {i < STEPS.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
                </div>
                <div className="pt-1.5">
                  <div className="text-xs font-ibm text-gray-400 mb-1">{s.num}</div>
                  <h3 className="font-golos font-semibold text-navy-950 text-base mb-1.5">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FBO/FBS link */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="GitCompare" size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-golos font-semibold text-navy-950 text-sm mb-1">FBO или FBS — что выбрать?</p>
              <p className="text-gray-500 text-sm mb-2">Схема работы влияет на скорость доставки, позиции в поиске и стоимость. Разобрали все различия в отдельном гайде.</p>
              <Link to="/fbo-vs-fbs" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Читать сравнение FBO vs FBS <Icon name="ArrowRight" size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-golos font-bold text-3xl md:text-4xl text-navy-950 mb-3">Что входит в услуги фулфилмента</h2>
            <p className="text-gray-500 text-lg">Стандартный и расширенный набор услуг партнёров</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="w-10 h-10 bg-navy-950 rounded-xl flex items-center justify-center mb-3">
                  <Icon name={s.icon} size={18} className="text-gold-400" />
                </div>
                <h3 className="font-golos font-semibold text-navy-950 text-sm mb-1.5">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who needs */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-golos font-bold text-3xl md:text-4xl text-navy-950 mb-3">Кому нужен фулфилмент</h2>
            <p className="text-gray-500 text-lg">Типичные ситуации, когда без партнёра не обойтись</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {WHO_NEEDS.map((w) => (
              <div key={w.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4">
                <div className="w-11 h-11 bg-gold-50 border border-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={w.icon} size={20} className="text-gold-600" />
                </div>
                <div>
                  <h3 className="font-golos font-semibold text-navy-950 text-base mb-1.5">{w.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myths */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-golos font-bold text-3xl md:text-4xl text-navy-950 mb-3">Мифы о фулфилменте</h2>
            <p className="text-gray-500 text-lg">Разбираем самые распространённые заблуждения</p>
          </div>
          <div className="space-y-4">
            {MYTHS.map((m) => (
              <div key={m.myth} className="grid md:grid-cols-2 gap-0 border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-red-50 border-b md:border-b-0 md:border-r border-red-100 p-5 flex gap-3">
                  <Icon name="X" size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-ibm text-red-400 uppercase tracking-wider mb-1">Миф</p>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{m.myth}</p>
                  </div>
                </div>
                <div className="bg-emerald-50 p-5 flex gap-3">
                  <Icon name="Check" size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-ibm text-emerald-500 uppercase tracking-wider mb-1">Факт</p>
                    <p className="text-sm text-gray-700 leading-snug">{m.fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to choose — CTA */}
      <section className="py-14 px-4 bg-navy-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-golos font-bold text-3xl md:text-4xl text-white mb-3">Как выбрать фулфилмент-партнёра</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">На что смотреть при выборе, чтобы не ошибиться</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: "Award" as const, title: "Опыт с вашим маркетплейсом", desc: "Партнёр должен знать требования WB или Ozon к упаковке и поставкам. Уточните, сколько продавцов с вашей площадкой они уже ведут." },
              { icon: "FileText" as const, title: "Прозрачный договор", desc: "Материальная ответственность за товар, сроки обработки, штрафы за нарушения — всё должно быть прописано. Без договора — риск." },
              { icon: "Star" as const, title: "Отзывы реальных продавцов", desc: "Ищите отзывы в тематических сообществах, форумах селлеров, спрашивайте у партнёра контакты действующих клиентов." },
              { icon: "BarChart2" as const, title: "Личный кабинет с остатками", desc: "Вы должны видеть остатки, историю операций и статус поставок в реальном времени. Отсутствие ЛК — красный флаг." },
              { icon: "Zap" as const, title: "Скорость обработки", desc: "Узнайте SLA: за сколько часов обрабатывается заказ после поступления. Медленная сборка = плохие отзывы на площадке." },
              { icon: "PhoneCall" as const, title: "Поддержка и коммуникация", desc: "Есть ли выделенный менеджер? Как быстро отвечают? Кто решает проблемы — конкретный человек или безликая поддержка?" },
            ].map((c) => (
              <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="w-9 h-9 bg-gold-500/15 rounded-xl flex items-center justify-center mb-3">
                  <Icon name={c.icon} size={17} className="text-gold-400" />
                </div>
                <h3 className="font-golos font-semibold text-white text-sm mb-1.5">{c.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-7 text-center">
            <p className="font-golos font-bold text-white text-xl mb-2">Не хотите разбираться самостоятельно?</p>
            <p className="text-white/60 text-sm mb-5 max-w-lg mx-auto">На FulfillHub собраны проверенные фулфилмент-центры со всеми параметрами: ценами, услугами, рейтингами и отзывами. Отфильтруйте по городу, маркетплейсу и услугам — и отправьте заявку сразу нескольким партнёрам.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl font-bold font-golos transition-all">
                <Icon name="Search" size={16} />
                Перейти в каталог
              </Link>
              <Link to="/kalkulator-fulfillmenta" className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-medium font-golos transition-all">
                <Icon name="Calculator" size={16} />
                Рассчитать стоимость
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-golos font-bold text-3xl md:text-4xl text-navy-950 mb-3">Частые вопросы</h2>
            <p className="text-gray-500 text-lg">Отвечаем на самые популярные вопросы о фулфилменте</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-golos font-semibold text-navy-950 text-sm md:text-base leading-snug">{f.q}</span>
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                    {i === 2 && (
                      <Link to="/kalkulator-fulfillmenta" className="inline-flex items-center gap-1 mt-3 text-sm text-navy-700 hover:text-navy-950 font-medium transition-colors">
                        Открыть калькулятор <Icon name="ArrowRight" size={13} />
                      </Link>
                    )}
                    {i === 4 && (
                      <Link to="/fbo-vs-fbs" className="inline-flex items-center gap-1 mt-3 text-sm text-navy-700 hover:text-navy-950 font-medium transition-colors">
                        Подробное сравнение FBO vs FBS <Icon name="ArrowRight" size={13} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-10 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-ibm text-gray-400 uppercase tracking-wider mb-5">Читайте также</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/fbo-vs-fbs" className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-navy-200 hover:shadow-sm transition-all group">
              <Icon name="GitCompare" size={20} className="text-navy-400 mb-3" />
              <p className="font-golos font-semibold text-navy-950 text-sm mb-1 group-hover:text-navy-700 transition-colors">FBO vs FBS</p>
              <p className="text-gray-400 text-xs leading-relaxed">Какую схему выбрать для Wildberries и Ozon — разбираем плюсы и минусы</p>
            </Link>
            <Link to="/kalkulator-fulfillmenta" className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-navy-200 hover:shadow-sm transition-all group">
              <Icon name="Calculator" size={20} className="text-navy-400 mb-3" />
              <p className="font-golos font-semibold text-navy-950 text-sm mb-1 group-hover:text-navy-700 transition-colors">Калькулятор фулфилмента</p>
              <p className="text-gray-400 text-xs leading-relaxed">Рассчитайте примерные затраты на хранение, сборку и доставку</p>
            </Link>
            <Link to="/" className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-navy-200 hover:shadow-sm transition-all group">
              <Icon name="Search" size={20} className="text-navy-400 mb-3" />
              <p className="font-golos font-semibold text-navy-950 text-sm mb-1 group-hover:text-navy-700 transition-colors">Каталог фулфилментов</p>
              <p className="text-gray-400 text-xs leading-relaxed">Сравните партнёров по городу, ценам и услугам — и отправьте заявку</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="bg-navy-950 text-white/40 py-6 px-4 text-center text-xs font-ibm">
        <Link to="/" className="text-white/60 hover:text-white transition-colors font-medium">FulfillHub</Link>
        {" — "}каталог фулфилмент-услуг для продавцов маркетплейсов
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/fulfillment/moskva" className="hover:text-white/70 transition-colors">Фулфилмент Москва</Link>
          <Link to="/fulfillment/sankt-peterburg" className="hover:text-white/70 transition-colors">Фулфилмент СПб</Link>
          <Link to="/fulfillment/wildberries" className="hover:text-white/70 transition-colors">Фулфилмент WB</Link>
          <Link to="/fulfillment/ozon" className="hover:text-white/70 transition-colors">Фулфилмент Ozon</Link>
        </div>
      </footer>
    </div>
  );
}
