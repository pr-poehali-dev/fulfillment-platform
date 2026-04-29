import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface DashboardData {
  fulfillments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    new_this_week: number;
  };
  quotes: {
    total: number;
    new: number;
    new_this_week: number;
    total_revenue: number;
    paid_revenue: number;
    unpaid_revenue: number;
  };
  users: {
    total: number;
    new_this_week: number;
    blocked: number;
  };
  subscribers: {
    total: number;
  };
  charts: {
    quotes_by_day: { date: string; count: number }[];
    ff_by_day: { date: string; count: number }[];
  };
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────

function BarChart({
  data,
  color,
  label,
}: {
  data: { date: string; count: number }[];
  color: string;
  label: string;
}) {
  const maxVal = Math.max(...data.map((d) => d.count), 1);

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ru-RU", { day: "numeric", month: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="text-sm font-semibold text-navy-900 font-golos mb-4">{label}</div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-24 text-gray-300 text-sm font-ibm">
          Нет данных
        </div>
      ) : (
        <div className="flex items-end gap-0.5 h-24 overflow-hidden">
          {data.map((item, i) => {
            const heightPx = maxVal > 0 ? Math.round((item.count / maxVal) * 80) : 0;
            const showDate = i % 5 === 0;
            return (
              <div
                key={item.date}
                className="flex flex-col items-center flex-1 min-w-0"
                title={`${formatShortDate(item.date)}: ${item.count}`}
              >
                <div
                  className={`w-full rounded-t-sm ${color} transition-all`}
                  style={{ height: `${heightPx}px` }}
                />
                <div
                  className="text-[8px] text-gray-300 font-ibm mt-0.5 truncate w-full text-center"
                  style={{ opacity: showDate ? 1 : 0 }}
                >
                  {showDate ? formatShortDate(item.date) : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────

export default function DashboardTab({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ogRunning, setOgRunning] = useState(false);
  const [ogResult, setOgResult] = useState<{ updated: number; failed: number[]; total: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.adminDashboard();
      setData(res);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить дашборд");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={32} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  const ff = data?.fulfillments ?? { total: 0, pending: 0, approved: 0, rejected: 0, new_this_week: 0 };
  const qt = data?.quotes ?? { total: 0, new: 0, new_this_week: 0, total_revenue: 0, paid_revenue: 0, unpaid_revenue: 0 };
  const us = data?.users ?? { total: 0, new_this_week: 0, blocked: 0 };
  const charts = data?.charts ?? { quotes_by_day: [], ff_by_day: [] };

  const fmtMoney = (n: number) =>
    `${Math.round(n || 0).toLocaleString("ru-RU")} ₽`;

  const metricCards = [
    {
      label: "Фулфилментов",
      value: ff.total,
      sub: `${ff.pending} на модерации`,
      icon: "Building2",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      valueBg: "bg-white",
    },
    {
      label: "Запросов КП",
      value: qt.total,
      sub: `${qt.new_this_week} за неделю`,
      icon: "FileText",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      valueBg: "bg-white",
    },
    {
      label: "Доход",
      value: fmtMoney(qt.total_revenue),
      sub: `${fmtMoney(qt.unpaid_revenue)} к оплате`,
      icon: "TrendingUp",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueBg: "bg-white",
    },
    {
      label: "Пользователей",
      value: us.total,
      sub: `${us.blocked} заблокировано`,
      icon: "Users",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      valueBg: "bg-white",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}
            >
              <Icon name={card.icon} size={17} className={card.iconColor} />
            </div>
            <div className="font-golos font-black text-2xl text-navy-950 leading-tight">
              {card.value}
            </div>
            <div className="text-xs font-semibold text-navy-900 font-golos mt-0.5">
              {card.label}
            </div>
            <div className="text-xs text-gray-400 font-ibm mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChart
          data={charts.quotes_by_day}
          color="bg-blue-400"
          label="Активность запросов за 30 дней"
        />
        <BarChart
          data={charts.ff_by_day}
          color="bg-emerald-400"
          label="Новые фулфилменты за 30 дней"
        />
      </div>

      {/* Quick actions */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-3">
          Быстрые действия
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Moderation */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="Clock" size={17} className="text-amber-600" />
              </div>
              <div>
                <div className="font-golos font-bold text-navy-950 text-sm leading-tight">
                  Ожидают модерации
                </div>
                <div className="text-xs text-gray-400 font-ibm mt-0.5">
                  <span className="font-bold text-amber-600 text-base">
                    {ff.pending}
                  </span>{" "}
                  заявок
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("fulfillments")}
              className="w-full py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold font-golos transition-colors flex items-center justify-center gap-1.5"
            >
              Перейти
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>

          {/* Unpaid leads */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="Wallet" size={17} className="text-emerald-600" />
              </div>
              <div>
                <div className="font-golos font-bold text-navy-950 text-sm leading-tight">
                  К оплате
                </div>
                <div className="text-xs text-gray-400 font-ibm mt-0.5">
                  <span className="font-bold text-emerald-600 text-base">
                    {fmtMoney(qt.unpaid_revenue)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("balance")}
              className="w-full py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold font-golos transition-colors flex items-center justify-center gap-1.5"
            >
              Перейти
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>

          {/* New quotes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="MessageSquarePlus" size={17} className="text-blue-600" />
              </div>
              <div>
                <div className="font-golos font-bold text-navy-950 text-sm leading-tight">
                  Новые запросы
                </div>
                <div className="text-xs text-gray-400 font-ibm mt-0.5">
                  <span className="font-bold text-blue-600 text-base">
                    {qt.new}
                  </span>{" "}
                  новых
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("quotes")}
              className="w-full py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold font-golos transition-colors flex items-center justify-center gap-1.5"
            >
              Перейти
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* OG batch fetch */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-3">
          Служебные действия
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Image" size={17} className="text-indigo-600" />
            </div>
            <div>
              <div className="font-golos font-bold text-navy-950 text-sm">OG-изображения</div>
              <div className="text-xs text-gray-400 font-ibm mt-0.5">
                {ogResult
                  ? `Обновлено: ${ogResult.updated} из ${ogResult.total}. Не удалось: ${ogResult.failed.length}`
                  : "Спарсить og:image для всех карточек с сайтом но без картинки"}
              </div>
            </div>
          </div>
          <button
            disabled={ogRunning}
            onClick={async () => {
              setOgRunning(true);
              setOgResult(null);
              try {
                const res = await api.adminRefetchOg() as { updated: number; failed: number[]; total: number };
                setOgResult(res);
                if (res.updated > 0) toast.success(`OG обновлено: ${res.updated} из ${res.total}`);
                else toast.info(`Не удалось спарсить ни одного OG из ${res.total} сайтов`);
              } catch {
                toast.error("Ошибка при парсинге OG");
              } finally {
                setOgRunning(false);
              }
            }}
            className="shrink-0 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold font-golos transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ogRunning ? <Icon name="Loader2" size={13} className="animate-spin" /> : <Icon name="RefreshCw" size={13} />}
            {ogRunning ? "Парсинг..." : "Запустить"}
          </button>
        </div>
      </div>
    </div>
  );
}