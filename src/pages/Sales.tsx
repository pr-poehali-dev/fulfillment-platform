import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ymGoal } from "@/lib/ym";

const SUBSCRIBE_URL = "https://functions.poehali.dev/91f8b089-0115-4e67-921c-8243417a3853";

const BENEFITS = [
  {
    icon: "Target",
    title: "Квалифицированные лиды",
    desc: "Мы поставляем только горячих клиентов — селлеров, которые уже ищут фулфилмент прямо сейчас. Никакого холодного трафика.",
    accent: "gold",
  },
  {
    icon: "Megaphone",
    title: "Маркетинг на нас",
    desc: "SEO, реклама, аналитика, воронки продаж — всё это берём на себя. Вы занимаетесь складом и логистикой, мы — привлечением клиентов.",
    accent: "blue",
  },
  {
    icon: "ShieldCheck",
    title: "Только качественный трафик",
    desc: "Фокус на источниках с высоким намерением: SEO-запросы, тематические сообщества, платный трафик с узким таргетингом. Качество выгодно всем.",
    accent: "green",
  },
  {
    icon: "Zap",
    title: "Быстрый цикл сделки",
    desc: "Все фулфилменты в одном месте — селлер быстрее принимает решение. Вы получаете запрос от уже «прогретого» клиента.",
    accent: "purple",
  },
];

const STEPS = [
  { num: "01", title: "Регистрируетесь", desc: "Заполняете анкету с услугами, географией и тарифами. Это займёт 10–15 минут." },
  { num: "02", title: "Проходите модерацию", desc: "Наша команда проверяет анкету в течение 1 часа и публикует ваш профиль в каталоге." },
  { num: "03", title: "Получаете заявки", desc: "Селлеры находят вас и отправляют запросы на КП прямо в личный кабинет." },
  { num: "04", title: "Закрываете клиентов", desc: "Вы работаете только с тёплыми, заинтересованными клиентами. Конверсия в договор выше." },
];

const OBJECTIONS = [
  { q: "Это платно?", a: "Базовое размещение в каталоге полностью бесплатно. Первые 10 фулфилментов получают до 10 квалифицированных лидов бесплатно." },
  { q: "Сколько заявок можно ожидать?", a: "Зависит от ваших услуг и географии. Первые лиды, как правило, поступают в течение первой недели после публикации." },
  { q: "Как вы привлекаете селлеров?", a: "SEO, платный трафик, тематические сообщества и работа с блогерами в нише маркетплейсов. Мы постоянно расширяем каналы привлечения." },
  { q: "Можно выйти из программы?", a: "Да, в любой момент без штрафов. Просто свяжитесь с нами или удалите профиль из личного кабинета." },
];

function useContactForm(source: string) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const reset = () => { setEmail(""); setName(""); setStatus("idle"); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setStatus("loading");
    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source }),
      });
      if (!res.ok) throw new Error();
      ymGoal("sales_contact_submit");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return { email, setEmail, name, setName, status, submit, reset };
}

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

function ContactModal({ open, onClose, title = "Оставить заявку" }: ContactModalProps) {
  const form = useContactForm("sales_popup");

  useEffect(() => {
    if (!open) return;
    form.reset();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-navy-gradient px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icon name="X" size={14} className="text-white/70" />
          </button>
          <div className="w-10 h-10 bg-gold-500/20 border border-gold-500/30 rounded-xl flex items-center justify-center mb-3">
            <Icon name="Rocket" size={18} className="text-gold-400" />
          </div>
          <h2 className="font-golos font-black text-xl text-white mb-1">{title}</h2>
          <p className="text-white/55 font-ibm text-sm">Свяжемся в течение рабочего дня и расскажем подробнее</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {form.status === "done" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="CheckCircle" size={26} className="text-emerald-500" />
              </div>
              <p className="font-golos font-bold text-navy-900 text-lg mb-1">Заявка отправлена!</p>
              <p className="text-gray-400 font-ibm text-sm mb-5">Свяжемся с вами в течение рабочего дня</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-navy-950 text-white rounded-xl text-sm font-bold font-golos hover:bg-navy-900 transition-colors"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={form.submit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 font-ibm mb-1.5">Ваше имя</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => form.setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-ibm text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 font-ibm mb-1.5">Email для связи</label>
                <input
                  type="email"
                  placeholder="ivan@company.ru"
                  value={form.email}
                  onChange={(e) => form.setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-ibm text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-300 transition-all"
                />
              </div>
              {form.status === "error" && (
                <p className="text-red-500 font-ibm text-xs">Не удалось отправить. Попробуйте ещё раз.</p>
              )}
              <button
                type="submit"
                disabled={form.status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 rounded-xl text-sm font-black font-golos transition-all shadow-md shadow-gold-500/25 hover:-translate-y-0.5"
              >
                {form.status === "loading" ? (
                  <Icon name="Loader2" size={15} className="animate-spin" />
                ) : (
                  <Icon name="Send" size={15} />
                )}
                {form.status === "loading" ? "Отправляем..." : "Отправить заявку"}
              </button>
              <p className="text-center text-xs text-gray-400 font-ibm">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline hover:text-gray-600 transition-colors">политикой конфиденциальности</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sales() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Оставить заявку");

  const openModal = (title?: string) => {
    setModalTitle(title || "Оставить заявку");
    setModalOpen(true);
  };

  // inline contact form state
  const inlineForm = useContactForm("sales_inline");

  return (
    <div className="min-h-screen bg-gray-50 font-golos">
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-navy-950/95">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors font-ibm items-center gap-1.5">
              <Icon name="ArrowLeft" size={14} />
              Каталог
            </a>
            <button
              onClick={() => openModal("Зарегистрировать фулфилмент")}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-lg text-sm font-bold font-golos transition-all"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-navy-gradient py-20 md:py-28">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-gold-500/15 rounded-full border border-gold-500/25">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-gold-400 text-xs font-medium font-ibm tracking-wide">Первые 10 мест — до 10 лидов бесплатно</span>
            </div>

            <h1 className="font-golos font-black text-4xl md:text-6xl text-white mb-5 leading-tight">
              Получайте клиентов,<br />
              <span className="text-gold-gradient">не тратя на маркетинг</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-ibm font-light leading-relaxed max-w-2xl mx-auto mb-10">
              FulfillHub — это каталог фулфилмент-сервисов, который привлекает тысячи селлеров. Вы просто принимаете входящие заявки.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <button
                onClick={() => openModal("Разместить фулфилмент бесплатно")}
                className="flex items-center gap-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl text-base font-black font-golos transition-all shadow-lg shadow-gold-500/25 hover:shadow-xl hover:shadow-gold-500/30 hover:-translate-y-0.5"
              >
                <Icon name="Rocket" size={16} />
                Разместить фулфилмент бесплатно
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/8 hover:bg-white/12 border border-white/15 text-white rounded-xl text-sm font-medium font-ibm transition-all"
              >
                <Icon name="Eye" size={15} className="text-white/50" />
                Посмотреть каталог
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: "1 час", label: "время модерации" },
                { value: "0 ₽", label: "базовое размещение" },
                { value: "10", label: "бесплатных лидов" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-golos font-black text-2xl md:text-3xl text-gold-400">{s.value}</div>
                  <div className="text-white/45 text-xs font-ibm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM → SOLUTION ── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-red-50 rounded-full border border-red-100">
                  <Icon name="AlertCircle" size={13} className="text-red-400" />
                  <span className="text-red-500 text-xs font-medium font-ibm">Типичная ситуация</span>
                </div>
                <h2 className="font-golos font-black text-2xl md:text-3xl text-navy-900 mb-4 leading-tight">
                  Маркетинг отнимает время и деньги — а результат непредсказуем
                </h2>
                <div className="space-y-3">
                  {[
                    "Бюджет на рекламу уходит, а лиды — нецелевые",
                    "Сложно выстроить стабильный поток входящих заявок",
                    "Нет времени заниматься SEO и контент-маркетингом",
                    "Конкуренты уже в нескольких каталогах — вас там нет",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2.5">
                      <Icon name="X" size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-ibm text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-navy-950 rounded-2xl p-7">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-emerald-500/15 rounded-full border border-emerald-500/20">
                  <Icon name="CheckCircle" size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium font-ibm">С FulfillHub</span>
                </div>
                <h3 className="font-golos font-black text-xl text-white mb-4 leading-snug">
                  Вы получаете готовый поток заинтересованных клиентов
                </h3>
                <div className="space-y-3">
                  {[
                    "Только тёплые заявки — клиент уже ищет фулфилмент",
                    "Всё привлечение трафика — на нас, вы — на операционке",
                    "Быстрый старт: публикация за 1 час, первые заявки в течение недели",
                    "Ваш профиль видят тысячи активных селлеров",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2.5">
                      <Icon name="Check" size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/75 font-ibm text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-golos font-black text-3xl md:text-4xl text-navy-900 mb-3">
                Почему фулфилменты выбирают нас
              </h2>
              <p className="text-gray-500 font-ibm text-base max-w-xl mx-auto">
                Мы строим платформу так, чтобы качественные лиды были выгодны всем участникам
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BENEFITS.map((b) => {
                const accentMap: Record<string, { bg: string; icon: string; border: string }> = {
                  gold:   { bg: "bg-gold-50",    icon: "text-gold-600",    border: "border-gold-100" },
                  blue:   { bg: "bg-blue-50",    icon: "text-blue-600",    border: "border-blue-100" },
                  green:  { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
                  purple: { bg: "bg-purple-50",  icon: "text-purple-600",  border: "border-purple-100" },
                };
                const a = accentMap[b.accent];
                return (
                  <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 ${a.bg} border ${a.border} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon name={b.icon as "Target"} size={18} className={a.icon} />
                    </div>
                    <h3 className="font-golos font-bold text-navy-900 text-lg mb-2">{b.title}</h3>
                    <p className="text-gray-500 font-ibm text-sm leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SPECIAL OFFER ── */}
        <section className="py-6 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative overflow-hidden bg-navy-gradient rounded-2xl p-8 md:p-10">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-gold-500/20 rounded-full border border-gold-500/30">
                    <Icon name="Flame" size={13} className="text-gold-400" />
                    <span className="text-gold-400 text-xs font-medium font-ibm">Специальное предложение</span>
                  </div>
                  <h2 className="font-golos font-black text-2xl md:text-4xl text-white mb-3 leading-tight">
                    До 10 квалифицированных<br />лидов — <span className="text-gold-gradient">бесплатно</span>
                  </h2>
                  <p className="text-white/65 font-ibm text-sm leading-relaxed max-w-md">
                    Первые 10 фулфилментов, зарегистрировавшихся на платформе, получают гарантированный пакет целевых лидов без каких-либо условий. Мест осталось мало.
                  </p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="bg-white/8 border border-white/15 rounded-2xl p-6 mb-4">
                    <div className="text-5xl font-golos font-black text-gold-400 mb-1">10</div>
                    <div className="text-white/50 text-xs font-ibm">лидов бесплатно</div>
                    <div className="mt-3 text-white/30 text-xs font-ibm border-t border-white/10 pt-3">для первых 10 фулфилментов</div>
                  </div>
                  <button
                    onClick={() => openModal("Занять место — 10 лидов бесплатно")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-xl text-sm font-black font-golos transition-all shadow-lg shadow-gold-500/25 hover:-translate-y-0.5"
                  >
                    <Icon name="Rocket" size={15} />
                    Занять место
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-golos font-black text-3xl md:text-4xl text-navy-900 mb-3">
                Как это работает
              </h2>
              <p className="text-gray-500 font-ibm text-base">
                От регистрации до первого клиента — 4 простых шага
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {STEPS.map((s, i) => (
                <div key={s.num} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-gold-300/50 to-transparent z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-navy-950 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                      <span className="font-golos font-black text-gold-400 text-sm">{s.num}</span>
                    </div>
                    <h3 className="font-golos font-bold text-navy-900 text-base mb-1.5">{s.title}</h3>
                    <p className="text-gray-500 font-ibm text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-golos font-black text-3xl text-navy-900 mb-3">
                Частые вопросы
              </h2>
            </div>
            <div className="space-y-3">
              {OBJECTIONS.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-golos font-bold text-navy-900 text-sm">{item.q}</span>
                    <Icon
                      name="ChevronDown"
                      size={16}
                      className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-500 font-ibm leading-relaxed border-t border-gray-50 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT FORM (inline) ── */}
        <section className="py-16 bg-white">
          <div className="max-w-xl mx-auto px-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="text-center mb-6">
                <div className="w-11 h-11 bg-navy-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="Mail" size={20} className="text-navy-700" />
                </div>
                <h2 className="font-golos font-black text-2xl text-navy-900 mb-2">
                  Остались вопросы?
                </h2>
                <p className="text-gray-500 font-ibm text-sm">
                  Оставьте контакт — мы свяжемся и расскажем подробнее о работе с платформой
                </p>
              </div>

              {inlineForm.status === "done" ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="CheckCircle" size={22} className="text-emerald-500" />
                  </div>
                  <p className="font-golos font-bold text-navy-900 text-base mb-1">Заявка получена!</p>
                  <p className="text-gray-400 font-ibm text-sm">Свяжемся с вами в течение рабочего дня</p>
                </div>
              ) : (
                <form onSubmit={inlineForm.submit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={inlineForm.name}
                    onChange={(e) => inlineForm.setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-ibm text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-300 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email для связи"
                    value={inlineForm.email}
                    onChange={(e) => inlineForm.setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-ibm text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-300 transition-all"
                  />
                  {inlineForm.status === "error" && (
                    <p className="text-red-500 font-ibm text-xs">Не удалось отправить. Попробуйте ещё раз.</p>
                  )}
                  <button
                    type="submit"
                    disabled={inlineForm.status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-navy-950 hover:bg-navy-900 disabled:opacity-60 text-white rounded-xl text-sm font-bold font-golos transition-all"
                  >
                    {inlineForm.status === "loading" ? (
                      <Icon name="Loader2" size={15} className="animate-spin" />
                    ) : (
                      <Icon name="Send" size={15} />
                    )}
                    {inlineForm.status === "loading" ? "Отправляем..." : "Отправить заявку"}
                  </button>
                  <p className="text-center text-xs text-gray-400 font-ibm">
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <a href="/privacy" className="underline hover:text-gray-600 transition-colors">политикой конфиденциальности</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-golos font-black text-3xl md:text-4xl text-navy-900 mb-4 leading-tight">
              Готовы получать заявки<br />без маркетинговых затрат?
            </h2>
            <p className="text-gray-500 font-ibm text-base mb-8 max-w-lg mx-auto">
              Зарегистрируйтесь за 15 минут. Первые 10 фулфилментов получат до 10 лидов бесплатно.
            </p>
            <button
              onClick={() => openModal("Зарегистрировать фулфилмент")}
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-base font-black font-golos transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Icon name="Rocket" size={18} />
              Зарегистрировать фулфилмент
            </button>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 font-ibm">
              <div className="flex items-center gap-1.5">
                <Icon name="Shield" size={12} className="text-gray-300" />
                Бесплатное размещение
              </div>
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-1.5">
                <Icon name="Clock" size={12} className="text-gray-300" />
                Модерация за 1 час
              </div>
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-1.5">
                <Icon name="X" size={12} className="text-gray-300" />
                Без обязательств
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-navy-gradient text-white py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/25 font-ibm">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
                  <Icon name="Package" size={12} className="text-navy-950" />
                </div>
                <span className="text-white/50 font-golos font-bold">FulfillHub</span>
              </div>
              <span>© 2026 FulfillHub. Все права защищены.</span>
              <span className="hidden md:inline text-white/15">·</span>
              <span>Самозанятый Кругов М. Г. ИНН: 772379179900</span>
              <span className="hidden md:inline text-white/15">·</span>
              <a href="mailto:hello@fulfillhub.ru" className="hover:text-white/50 transition-colors">hello@fulfillhub.ru</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="hover:text-white/50 transition-colors">Каталог для селлеров</a>
              <a href="/for-fulfillment" className="hover:text-white/50 transition-colors">Для фулфилментов</a>
              <a href="/privacy" className="hover:text-white/50 transition-colors">Политика конфиденциальности</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
