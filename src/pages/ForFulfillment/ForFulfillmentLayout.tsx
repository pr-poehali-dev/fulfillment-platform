import Icon from "@/components/ui/icon";

const BENEFITS = [
  {
    icon: "Users",
    title: "15 000+ активных селлеров",
    desc: "Ваша карточка будет видна тысячам продавцов, ищущих фулфилмент прямо сейчас.",
  },
  {
    icon: "Shield",
    title: "Бесплатное размещение",
    desc: "Регистрация и размещение в каталоге — бесплатно. Комиссия только за успешную сделку.",
  },
  {
    icon: "BarChart3",
    title: "Аналитика и заявки",
    desc: "Отслеживайте просмотры, получайте заявки на КП и управляйте ими в личном кабинете.",
  },
  {
    icon: "Zap",
    title: "Быстрый запуск",
    desc: "Заполните анкету за 10 минут — модерация занимает до 24 часов.",
  },
];

interface ForFulfillmentLayoutProps {
  children: React.ReactNode;
}

export default function ForFulfillmentLayout({ children }: ForFulfillmentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-golos">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between bg-slate-900">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
            <span className="hidden sm:inline text-white/30 text-sm ml-1">/ Для фулфилмента</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors font-ibm items-center gap-1.5">
              <Icon name="ArrowLeft" size={14} />
              Каталог
            </a>
            <a href="/auth" className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500/15 border border-gold-500/30 rounded-lg text-sm font-semibold text-gold-400 hover:bg-gold-500/25 transition-all">
              <Icon name="LayoutDashboard" size={14} />
              Войти в кабинет
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy-gradient py-16 md:py-20">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gold-500/15 rounded-full border border-gold-500/25">
              <Icon name="Star" size={13} className="text-gold-400" />
              <span className="text-gold-400 text-xs font-medium font-ibm tracking-wide">Партнёрская программа FulfillHub</span>
            </div>
            <h1 className="font-golos font-black text-4xl md:text-6xl text-white mb-4 leading-tight">
              Разместите ваш<br />
              <span className="text-gold-gradient">фулфилмент-сервис</span><br />
              в каталоге
            </h1>
            <p className="text-white/65 text-lg font-ibm font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Получайте заявки от 15 000+ активных селлеров. Бесплатное размещение, прозрачная аналитика и удобный кабинет для управления клиентами.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 font-ibm text-sm">
              {[
                { icon: "Clock", text: "Модерация 24 часа" },
                { icon: "DollarSign", text: "Размещение бесплатно" },
                { icon: "TrendingUp", text: "Рост заявок с первого дня" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <Icon name={item.icon as "Clock"} size={14} className="text-gold-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={b.icon as "Users"} size={18} className="text-navy-700" />
                  </div>
                  <div>
                    <div className="font-golos font-bold text-navy-900 text-sm mb-1">{b.title}</div>
                    <div className="text-xs text-gray-500 font-ibm leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content slot */}
        {children}

        {/* Footer */}
        <footer className="bg-navy-gradient text-white py-8 mt-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 font-ibm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={12} className="text-navy-950" />
              </div>
              <span className="text-white/50 font-golos font-bold">FulfillHub</span>
              <span>© 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="hover:text-white/60 transition-colors">Каталог для селлеров</a>
              <button className="hover:text-white/60 transition-colors">Условия использования</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
