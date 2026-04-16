import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import api from "@/lib/api";
import { toast } from "sonner";

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  created_at: string | null;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return d; }
}

export default function AdminSubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getSubscribers();
      setSubscribers(data.subscribers || []);
    } catch {
      toast.error("Не удалось загрузить список подписчиков");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const copyAll = () => {
    const text = filtered.map((s) => s.email).join("\n");
    navigator.clipboard.writeText(text);
    toast.success(`Скопировано ${filtered.length} email-адресов`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="w-8 h-8 bg-navy-50 text-navy-700 rounded-lg flex items-center justify-center mb-2">
            <Icon name="Mail" size={15} />
          </div>
          <div className="font-golos font-black text-2xl text-navy-900">{subscribers.length}</div>
          <div className="text-xs text-gray-400 font-ibm">Всего подписчиков</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-2">
            <Icon name="TrendingUp" size={15} />
          </div>
          <div className="font-golos font-black text-2xl text-navy-900">
            {subscribers.filter((s) => {
              if (!s.created_at) return false;
              const d = new Date(s.created_at);
              const week = new Date();
              week.setDate(week.getDate() - 7);
              return d >= week;
            }).length}
          </div>
          <div className="text-xs text-gray-400 font-ibm">За последние 7 дней</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <div className="flex-1 relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по email..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20"
            />
          </div>
          <button
            onClick={copyAll}
            title="Скопировать все email"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-navy-900 text-white hover:bg-navy-800 transition-colors font-ibm font-medium"
          >
            <Icon name="Copy" size={13} />
            Скопировать все
          </button>
          <button onClick={load} className="text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100" title="Обновить">
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="MailX" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">
              {search ? "Ничего не найдено" : "Пока нет подписчиков"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 bg-navy-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-navy-600 font-golos">
                    {s.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-ibm text-navy-900 truncate">{s.email}</div>
                  <div className="text-xs text-gray-400 font-ibm">
                    {s.name && <span className="text-navy-500 font-medium mr-1.5">{s.name}</span>}
                    {formatDate(s.created_at)}
                  </div>
                </div>
                <div className="text-xs text-gray-300 font-ibm flex-shrink-0">#{i + 1}</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(s.email); toast.success("Email скопирован"); }}
                  className="text-gray-300 hover:text-navy-700 transition-colors p-1 rounded"
                  title="Скопировать"
                >
                  <Icon name="Copy" size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 font-ibm">
            Показано {filtered.length} из {subscribers.length}
          </div>
        )}
      </div>
    </div>
  );
}