import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

interface LeadItem {
  id: number;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  sku: number;
  orders: number;
  avgItems: number;
  storageDays: number;
  estimatedTotal: number;
  marketplaces: string[];
  schemes: string[];
  needs: string[];
  message?: string;
  status: "new" | "in_progress" | "answered" | "closed";
  date: string;
  time: string;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 1,
    clientName: "Алексей Морозов",
    company: "BrandStore",
    email: "alex@brandstore.ru",
    phone: "+7 (916) 234-56-78",
    avatar: "АМ",
    sku: 1200,
    orders: 800,
    avgItems: 2,
    storageDays: 30,
    estimatedTotal: 78500,
    marketplaces: ["Wildberries", "Ozon"],
    schemes: ["FBS", "FBO"],
    needs: ["returns", "cameras", "same_day"],
    message: "Ищем фулфилмент для одежды. Важны возвраты и скорость сборки.",
    status: "new",
    date: "9 апр",
    time: "14:32",
  },
  {
    id: 2,
    clientName: "Мария Иванова",
    company: "FashionLine",
    email: "m.ivanova@fashionline.ru",
    phone: "+7 (903) 123-45-67",
    avatar: "МИ",
    sku: 500,
    orders: 300,
    avgItems: 1,
    storageDays: 30,
    estimatedTotal: 42300,
    marketplaces: ["Wildberries"],
    schemes: ["FBS"],
    needs: ["packaging", "returns"],
    status: "new",
    date: "9 апр",
    time: "11:15",
  },
  {
    id: 3,
    clientName: "Дмитрий Соколов",
    company: "TechGoods",
    email: "d.sokolov@techgoods.ru",
    phone: "+7 (925) 987-65-43",
    avatar: "ДС",
    sku: 3500,
    orders: 2100,
    avgItems: 1,
    storageDays: 30,
    estimatedTotal: 185000,
    marketplaces: ["Ozon", "Яндекс Маркет"],
    schemes: ["FBS", "FBO"],
    needs: ["cameras", "temp_control"],
    message: "Нужны температурный режим и видеонаблюдение. Крупный объём.",
    status: "in_progress",
    date: "8 апр",
    time: "16:48",
  },
  {
    id: 4,
    clientName: "Елена Волкова",
    company: "BeautyShop",
    email: "e.volkova@beauty.ru",
    phone: "+7 (911) 555-77-88",
    avatar: "ЕВ",
    sku: 800,
    orders: 450,
    avgItems: 3,
    storageDays: 30,
    estimatedTotal: 61200,
    marketplaces: ["Wildberries", "Ozon", "Яндекс Маркет"],
    schemes: ["FBS"],
    needs: ["packaging", "returns", "same_day"],
    status: "answered",
    date: "7 апр",
    time: "09:22",
  },
  {
    id: 5,
    clientName: "Игорь Петров",
    company: "HomeGoods",
    email: "igor@homegoods.ru",
    phone: "+7 (905) 333-22-11",
    avatar: "ИП",
    sku: 2200,
    orders: 1500,
    avgItems: 2,
    storageDays: 30,
    estimatedTotal: 124000,
    marketplaces: ["Ozon"],
    schemes: ["FBO"],
    needs: ["dangerous", "cameras"],
    status: "closed",
    date: "5 апр",
    time: "13:10",
  },
];

const NEED_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  cameras: { label: "Камеры", icon: "Camera", color: "text-blue-500" },
  dangerous: { label: "Опасные грузы", icon: "AlertTriangle", color: "text-red-500" },
  returns: { label: "Возвраты", icon: "RefreshCw", color: "text-emerald-500" },
  same_day: { label: "День в день", icon: "Zap", color: "text-amber-500" },
  temp_control: { label: "Темп. режим", icon: "Thermometer", color: "text-cyan-500" },
  packaging: { label: "Упаковка", icon: "Package", color: "text-purple-500" },
};

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: "Новая", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  in_progress: { label: "В работе", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  answered: { label: "Отправлено КП", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  closed: { label: "Закрыта", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [tab, setTab] = useState<"leads" | "profile" | "rates">("leads");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-golos flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-950 text-white transition-transform duration-200 flex flex-col`}>
        {/* Brand */}
        <div className="h-14 px-4 flex items-center gap-2 border-b border-white/10 flex-shrink-0">
          <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
            <Icon name="Package" size={14} className="text-navy-950" />
          </div>
          <div>
            <div className="font-golos font-bold text-sm leading-none">FulfillHub</div>
            <div className="text-xs text-white/40 mt-0.5">Админ-панель</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Company info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center text-xl">🏭</div>
            <div className="min-w-0">
              <div className="font-golos font-bold text-sm truncate">LogiMaster</div>
              <div className="text-xs text-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Активен
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { id: "leads", label: "Заявки на КП", icon: "Inbox", badge: 2 },
            { id: "profile", label: "Профиль компании", icon: "Building2" },
            { id: "rates", label: "Тарифы и услуги", icon: "DollarSign" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id as "leads" | "profile" | "rates"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === item.id
                  ? "bg-gold-500/15 text-gold-400"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon name={item.icon as "Inbox"} size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-gold-500 text-navy-950 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:bg-white/10 hover:text-white/80 transition-all">
            <Icon name="ExternalLink" size={14} />
            Вернуться на сайт
          </a>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:bg-white/10 hover:text-red-300 transition-all">
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 z-30" />}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-gray-500">
            <Icon name="Menu" size={20} />
          </button>
          <div>
            <div className="font-golos font-bold text-navy-900 text-sm">
              {tab === "leads" && "Заявки на коммерческое предложение"}
              {tab === "profile" && "Профиль компании"}
              {tab === "rates" && "Тарифы и услуги"}
            </div>
            <div className="text-xs text-gray-400 font-ibm">
              {tab === "leads" && "Управляйте входящими запросами от селлеров"}
              {tab === "profile" && "Как вас видят клиенты в каталоге"}
              {tab === "rates" && "Стартовые цены и дополнительные услуги"}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 relative">
              <Icon name="Bell" size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs">
              АК
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {tab === "leads" && <LeadsTab />}
          {tab === "profile" && <ProfileTab />}
          {tab === "rates" && <RatesTab />}
        </div>
      </main>
    </div>
  );
}

// ─── LEADS TAB ───────────────────────────────────────────────────────────────

function LeadsTab() {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [filter, setFilter] = useState<"all" | "new" | "in_progress" | "answered" | "closed">("all");
  const [selected, setSelected] = useState<LeadItem | null>(null);
  const [search, setSearch] = useState("");

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    in_progress: leads.filter((l) => l.status === "in_progress").length,
    answered: leads.filter((l) => l.status === "answered").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  const updateStatus = (id: number, status: LeadItem["status"]) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const fmt = (n: number) => n.toLocaleString("ru-RU");

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Всего заявок", value: leads.length, icon: "Inbox", color: "bg-navy-50 text-navy-700" },
          { label: "Новые", value: counts.new, icon: "Sparkles", color: "bg-blue-50 text-blue-600" },
          { label: "В работе", value: counts.in_progress, icon: "Clock", color: "bg-amber-50 text-amber-600" },
          { label: "Конверсия", value: "42%", icon: "TrendingUp", color: "bg-emerald-50 text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon as "Inbox"} size={15} />
              </div>
            </div>
            <div className="font-golos font-black text-2xl text-navy-900">{s.value}</div>
            <div className="text-xs text-gray-400 font-ibm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Все", count: counts.all },
            { key: "new", label: "Новые", count: counts.new },
            { key: "in_progress", label: "В работе", count: counts.in_progress },
            { key: "answered", label: "Отправлено", count: counts.answered },
            { key: "closed", label: "Закрыты", count: counts.closed },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all font-golos ${
                filter === f.key
                  ? "bg-navy-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? "text-white/70" : "text-gray-400"}`}>{f.count}</span>
            </button>
          ))}
          <div className="ml-auto relative min-w-[200px]">
            <Icon name="Search" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/15"
            />
          </div>
        </div>

        {/* Lead list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Заявок нет</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((lead) => {
              const status = STATUS_LABELS[lead.status];
              return (
                <div key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs flex-shrink-0">
                    {lead.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-golos font-bold text-navy-900 text-sm truncate">{lead.clientName}</span>
                      <span className="text-xs text-gray-400 font-ibm">{lead.company}</span>
                      {lead.status === "new" && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-ibm flex-wrap">
                      <span className="flex items-center gap-0.5"><Icon name="Package" size={10} />{fmt(lead.sku)} SKU</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Icon name="ShoppingCart" size={10} />{fmt(lead.orders)} зак./мес</span>
                      <span>·</span>
                      <span className="text-navy-700 font-semibold">~{fmt(lead.estimatedTotal)} ₽</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 font-ibm">{lead.date} · {lead.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead detail modal */}
      {selected && (
        <LeadDetail lead={selected} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} />
      )}
    </div>
  );
}

function LeadDetail({ lead, onClose, onUpdateStatus }: {
  lead: LeadItem;
  onClose: () => void;
  onUpdateStatus: (id: number, status: LeadItem["status"]) => void;
}) {
  const [reply, setReply] = useState("");
  const status = STATUS_LABELS[lead.status];
  const fmt = (n: number) => n.toLocaleString("ru-RU");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-11 h-11 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold">
            {lead.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-black text-navy-900">{lead.clientName}</div>
            <div className="text-xs text-gray-400 font-ibm">{lead.company} · {lead.date} {lead.time}</div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Icon name="Mail" size={15} className="text-navy-700" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">Email</div>
                <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{lead.email}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Icon name="Phone" size={15} className="text-navy-700" />
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-ibm">Телефон</div>
                <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{lead.phone}</div>
              </div>
            </div>
          </div>

          {/* Calculator params */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Параметры из калькулятора</div>
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "SKU", value: fmt(lead.sku), icon: "Package" },
                { label: "Заказов", value: `${fmt(lead.orders)}/мес`, icon: "ShoppingCart" },
                { label: "Ед. в заказе", value: lead.avgItems, icon: "Layers" },
                { label: "Дней хранения", value: lead.storageDays, icon: "Calendar" },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-ibm mb-0.5">
                    <Icon name={p.icon as "Package"} size={10} />{p.label}
                  </div>
                  <div className="text-sm font-golos font-bold text-navy-900">{p.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 bg-gold-50 border border-gold-200 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-ibm">Расчёт клиента по рынку</span>
              <span className="font-golos font-black text-lg text-navy-900">~{fmt(lead.estimatedTotal)} ₽/мес</span>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Маркетплейсы и схемы</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {lead.schemes.map((s) => (
                <span key={s} className="text-xs px-2 py-1 bg-navy-900 text-white rounded-lg font-semibold font-golos">{s}</span>
              ))}
              {lead.marketplaces.map((m) => (
                <span key={m} className="text-xs px-2 py-1 bg-navy-50 text-navy-700 rounded-lg font-ibm">{m}</span>
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Требования</div>
            <div className="flex flex-wrap gap-2">
              {lead.needs.map((n) => {
                const need = NEED_LABELS[n];
                if (!need) return null;
                return (
                  <span key={n} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-lg font-ibm">
                    <Icon name={need.icon as "Camera"} size={11} className={need.color} />
                    {need.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Сообщение от клиента</div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 font-ibm leading-relaxed">
                "{lead.message}"
              </div>
            </div>
          )}

          {/* Reply */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Ваш ответ / КП</div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Напишите коммерческое предложение или комментарий для клиента..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20 resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-navy-900 font-ibm">
                <Icon name="Paperclip" size={12} />Прикрепить файл
              </button>
              <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-navy-900 font-ibm">
                <Icon name="FileText" size={12} />Шаблон КП
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center gap-2 bg-gray-50">
          <select
            value={lead.status}
            onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadItem["status"])}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white font-ibm focus:outline-none cursor-pointer"
          >
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="answered">Отправлено КП</option>
            <option value="closed">Закрыта</option>
          </select>
          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-100 font-ibm text-sm h-9">
            <Icon name="Phone" size={13} className="mr-1.5" />Позвонить
          </Button>
          <Button className="ml-auto bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-9 px-5"
            onClick={() => onUpdateStatus(lead.id, "answered")}>
            <Icon name="Send" size={14} className="mr-1.5" />Отправить КП
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE TAB ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName] = useState("LogiMaster");
  const [city, setCity] = useState("Москва");
  const [inn, setInn] = useState("7712345678");
  const [area, setArea] = useState("15000");
  const [year, setYear] = useState("2016");
  const [description, setDescription] = useState("Комплексный фулфилмент для маркетплейсов. Собственный склад 15 000 м², автоматизированная система учёта, команда из 80 человек. Работаем с 2016 года, обработали более 2 млн заказов.");
  const [logo, setLogo] = useState("🏭");
  const [saved, setSaved] = useState(false);

  const [features, setFeatures] = useState<string[]>(["cameras", "returns", "same_day", "packaging", "dangerous"]);
  const [schemes, setSchemes] = useState<string[]>(["FBS", "FBO"]);
  const [marketplaces, setMarketplaces] = useState<string[]>(["Wildberries", "Ozon", "Яндекс Маркет"]);
  const [packaging, setPackaging] = useState<string[]>(["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка"]);

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Form */}
      <div className="lg:col-span-2 space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Icon name="Building2" size={16} className="text-navy-700" />
            Основная информация
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center text-3xl">{logo}</div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Логотип (эмодзи)</label>
              <input value={logo} onChange={(e) => setLogo(e.target.value)} maxLength={2}
                className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-lg font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Название</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">ИНН</label>
              <input value={inn} onChange={(e) => setInn(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Город</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Площадь (м²)</label>
              <input value={area} onChange={(e) => setArea(e.target.value)} type="number" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Год основания</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} type="number" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Описание компании</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4} className={`${inputCls} resize-none`} />
            <div className="text-xs text-gray-400 font-ibm mt-1">{description.length} / 500 символов</div>
          </div>
        </div>

        {/* Schemes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Icon name="Layers" size={16} className="text-navy-700" />
            Схемы работы
          </div>
          <div className="flex flex-wrap gap-2">
            {["FBS", "FBO", "DBS", "Экспресс"].map((s) => (
              <button key={s} onClick={() => toggle(schemes, s, setSchemes)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all font-golos ${schemes.includes(s) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplaces */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Icon name="Store" size={16} className="text-navy-700" />
            Маркетплейсы
          </div>
          <div className="flex flex-wrap gap-2">
            {["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет", "Ali", "Lamoda"].map((mp) => (
              <button key={mp} onClick={() => toggle(marketplaces, mp, setMarketplaces)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${marketplaces.includes(mp) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                {mp}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-navy-700" />
            Дополнительные услуги
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { key: "cameras", label: "Видеонаблюдение", icon: "Camera" },
              { key: "dangerous", label: "Опасные грузы", icon: "AlertTriangle" },
              { key: "returns", label: "Работа с возвратами", icon: "RefreshCw" },
              { key: "same_day", label: "Доставка день в день", icon: "Zap" },
              { key: "temp_control", label: "Температурный режим", icon: "Thermometer" },
              { key: "packaging", label: "Упаковка товаров", icon: "Package" },
              { key: "marking", label: "Маркировка", icon: "Tag" },
              { key: "photo", label: "Фотосъёмка", icon: "Image" },
            ].map((f) => (
              <label key={f.key}
                className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${features.includes(f.key) ? "border-navy-200 bg-navy-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                <div onClick={() => toggle(features, f.key, setFeatures)}
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${features.includes(f.key) ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300"}`}>
                  {features.includes(f.key) && <Icon name="Check" size={10} className="text-white" />}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-700 font-ibm" onClick={() => toggle(features, f.key, setFeatures)}>
                  <Icon name={f.icon as "Camera"} size={13} className="text-gray-400" />
                  {f.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Packaging */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Icon name="Box" size={16} className="text-navy-700" />
            Типы упаковки
          </div>
          <div className="flex flex-wrap gap-2">
            {["Полиэтилен", "Короб", "Пузырчатая плёнка", "Термоусадка", "Деревянная обрешётка", "Металлический контейнер"].map((pk) => (
              <button key={pk} onClick={() => toggle(packaging, pk, setPackaging)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${packaging.includes(pk) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                {pk}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 sticky bottom-0 bg-gray-50 py-3 -mx-1 px-1">
          <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-11 px-7" onClick={handleSave}>
            <Icon name="Save" size={15} className="mr-2" />Сохранить изменения
          </Button>
          {saved && (
            <div className="text-sm text-emerald-600 font-ibm flex items-center gap-1.5 animate-fade-in">
              <Icon name="CheckCircle" size={15} />Изменения сохранены
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-2">Предпросмотр карточки</div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 bg-navy-50 rounded-lg flex items-center justify-center text-2xl">{logo}</div>
                <div>
                  <div className="font-golos font-bold text-navy-900 text-sm">{name}</div>
                  <div className="text-xs text-gray-400 font-ibm flex items-center gap-0.5 mt-0.5">
                    <Icon name="MapPin" size={10} />{city}
                  </div>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200 font-medium">Топ партнёр</span>
            </div>
            <p className="text-xs text-gray-500 font-ibm leading-relaxed mb-3 line-clamp-3">{description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {schemes.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 bg-navy-900 text-white rounded font-ibm font-medium">{s}</span>
              ))}
              {marketplaces.slice(0, 2).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 bg-navy-50 text-navy-700 rounded font-ibm">{t}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {features.slice(0, 4).map((f) => {
                const feat = {
                  cameras: { icon: "Camera", color: "text-blue-500" },
                  dangerous: { icon: "AlertTriangle", color: "text-red-500" },
                  returns: { icon: "RefreshCw", color: "text-emerald-500" },
                  same_day: { icon: "Zap", color: "text-amber-500" },
                  temp_control: { icon: "Thermometer", color: "text-cyan-500" },
                  packaging: { icon: "Package", color: "text-purple-500" },
                }[f];
                if (!feat) return null;
                return <Icon key={f} name={feat.icon as "Camera"} size={13} className={feat.color} />;
              })}
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} width={11} height={11} viewBox="0 0 16 16" fill="#d4a017">
                    <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-navy-900">4.9</span>
              <span className="text-xs text-gray-400">(124)</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400 font-ibm text-center">
            Так вашу компанию увидят селлеры в каталоге
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RATES TAB ───────────────────────────────────────────────────────────────

function RatesTab() {
  const [storage, setStorage] = useState("12");
  const [assembly, setAssembly] = useState("18");
  const [delivery, setDelivery] = useState("85");
  const [minVolume, setMinVolume] = useState("500");
  const [hasTrial, setHasTrial] = useState(true);
  const [trialDays, setTrialDays] = useState("14");
  const [saved, setSaved] = useState(false);

  const [additional, setAdditional] = useState([
    { id: 1, name: "Маркировка 'Честный знак'", price: "5", unit: "₽/шт", enabled: true },
    { id: 2, name: "Фотосъёмка товара", price: "200", unit: "₽/фото", enabled: true },
    { id: 3, name: "Комплектация наборов", price: "25", unit: "₽/набор", enabled: false },
    { id: 4, name: "Обработка возврата", price: "35", unit: "₽/шт", enabled: true },
  ]);

  const toggleAdditional = (id: number) => {
    setAdditional((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const updateAdditional = (id: number, key: "name" | "price" | "unit", value: string) => {
    setAdditional((prev) => prev.map((a) => a.id === id ? { ...a, [key]: value } : a));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  return (
    <div className="max-w-4xl space-y-5">
      {/* Base rates */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-1 flex items-center gap-2">
          <Icon name="DollarSign" size={16} className="text-navy-700" />
          Базовые тарифы
        </div>
        <p className="text-xs text-gray-500 font-ibm mb-4">
          Эти цены отображаются в каталоге с пометкой «от». Точную стоимость вы согласовываете индивидуально в ответе на заявку.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Хранение", value: storage, set: setStorage, suffix: "₽/ед/день", icon: "Warehouse" },
            { label: "Сборка заказа", value: assembly, set: setAssembly, suffix: "₽/заказ", icon: "Package" },
            { label: "Доставка", value: delivery, set: setDelivery, suffix: "₽/заказ", icon: "Truck" },
          ].map(({ label, value, set, suffix, icon }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-gray-600 font-golos flex items-center gap-1.5 mb-1.5">
                <Icon name={icon as "Package"} size={12} className="text-navy-700" />{label}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-ibm">от</span>
                <input value={value} onChange={(e) => set(e.target.value)} type="number"
                  className={`${inputCls} pl-9 pr-24`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-ibm whitespace-nowrap">{suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limits */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Gauge" size={16} className="text-navy-700" />
          Условия работы
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Минимальный объём (SKU)</label>
            <input value={minVolume} onChange={(e) => setMinVolume(e.target.value)} type="number"
              placeholder="Оставьте пустым, если минимума нет" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Длительность пробного периода (дни)</label>
            <input value={trialDays} onChange={(e) => setTrialDays(e.target.value)} type="number"
              disabled={!hasTrial} className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`} />
          </div>
        </div>
        <label className="flex items-start gap-3 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
          <div onClick={() => setHasTrial(!hasTrial)}
            className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${hasTrial ? "bg-emerald-600 border-emerald-600" : "bg-white border-gray-300"}`}>
            {hasTrial && <Icon name="Check" size={12} className="text-white" />}
          </div>
          <div onClick={() => setHasTrial(!hasTrial)}>
            <div className="font-golos font-bold text-emerald-800 text-sm">Предоставляем пробный период</div>
            <div className="text-xs text-emerald-600 font-ibm">Новые клиенты получат бонус — это увеличивает конверсию на 40%.</div>
          </div>
        </label>
      </div>

      {/* Additional services */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-golos font-bold text-navy-900 flex items-center gap-2">
              <Icon name="Plus" size={16} className="text-navy-700" />
              Дополнительные услуги
            </div>
            <p className="text-xs text-gray-500 font-ibm mt-0.5">Отдельно оплачиваемые сервисы</p>
          </div>
          <button className="text-xs text-navy-700 font-ibm hover:underline flex items-center gap-1">
            <Icon name="Plus" size={12} />Добавить услугу
          </button>
        </div>
        <div className="space-y-2">
          {additional.map((item) => (
            <div key={item.id}
              className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 p-3 rounded-xl border transition-all ${item.enabled ? "border-gray-100 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
              <button onClick={() => toggleAdditional(item.id)}
                className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${item.enabled ? "bg-emerald-500" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? "left-[18px]" : "left-0.5"}`} />
              </button>
              <input value={item.name} onChange={(e) => updateAdditional(item.id, "name", e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-sm font-ibm font-medium text-navy-900 focus:outline-none" />
              <div className="flex items-center gap-1">
                <input value={item.price} onChange={(e) => updateAdditional(item.id, "price", e.target.value)} type="number"
                  className="w-16 px-2 py-1 border border-gray-200 rounded text-sm font-ibm text-right focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
                <input value={item.unit} onChange={(e) => updateAdditional(item.id, "unit", e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-200 rounded text-xs font-ibm text-gray-500 focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              </div>
              <button className="text-gray-300 hover:text-red-500 transition-colors">
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 sticky bottom-0 bg-gray-50 py-3">
        <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-11 px-7" onClick={handleSave}>
          <Icon name="Save" size={15} className="mr-2" />Сохранить тарифы
        </Button>
        {saved && (
          <div className="text-sm text-emerald-600 font-ibm flex items-center gap-1.5">
            <Icon name="CheckCircle" size={15} />Тарифы обновлены в каталоге
          </div>
        )}
      </div>
    </div>
  );
}
