import Icon from "@/components/ui/icon";

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
            <p className="text-white/75 text-lg font-ibm font-light leading-relaxed max-w-2xl mx-auto mb-6">
              Работа с площадкой позволяет получать целевые лиды и запросы на КП от заинтересованных селлеров напрямую —
              без затрат на маркетинг, рекламу и аналитику. Вы сосредоточены на операционке, мы берём на себя привлечение клиентов.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 font-ibm text-sm mb-8">
              {[
                { icon: "Clock",        text: "Модерация за 1 час" },
                { icon: "DollarSign",   text: "Размещение бесплатно" },
                { icon: "TrendingUp",   text: "Целевые лиды с первого дня" },
                { icon: "Target",       text: "Только заинтересованные селлеры" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <Icon name={item.icon as "Clock"} size={14} className="text-gold-400" />
                  {item.text}
                </div>
              ))}
            </div>

            {/* Value props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { icon: "UserCheck", title: "Целевая аудитория", desc: "Селлеры, уже ищущие фулфилмент" },
                { icon: "Inbox",     title: "Заявки в кабинет",  desc: "КП и запросы — всё в одном месте" },
                { icon: "Zap",       title: "Быстрый старт",     desc: "Заполните анкету за 10 минут" },
              ].map((b) => (
                <div key={b.title} className="bg-white/8 border border-white/10 rounded-xl p-4 text-left">
                  <div className="w-8 h-8 bg-gold-500/15 rounded-lg flex items-center justify-center mb-2">
                    <Icon name={b.icon as "Zap"} size={15} className="text-gold-400" />
                  </div>
                  <div className="font-golos font-bold text-white text-sm mb-0.5">{b.title}</div>
                  <div className="text-xs text-white/50 font-ibm">{b.desc}</div>
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
