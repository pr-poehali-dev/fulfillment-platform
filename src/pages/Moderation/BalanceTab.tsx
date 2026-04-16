import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface FulfillmentBalance {
  id: number;
  company_name: string;
  balance: number;
  total_leads: number;
  lead_price: number;
  status: string;
}

interface BalanceTransaction {
  id: number;
  fulfillment_id: number;
  company_name: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  admin_email: string;
  created_at: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function fmtMoney(n: number) {
  return `${Math.round(n || 0).toLocaleString("ru-RU")} ₽`;
}

// ─── ADJUST MODAL ────────────────────────────────────────────────────────────

function AdjustModal({
  fulfillmentId,
  companyName,
  type,
  onClose,
  onDone,
}: {
  fulfillmentId: number;
  companyName: string;
  type: "credit" | "debit";
  onClose: () => void;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const isCredit = type === "credit";

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Введите корректную сумму");
      return;
    }
    if (!description.trim()) {
      toast.error("Введите описание");
      return;
    }
    setSaving(true);
    try {
      await api.adminBalanceAdjust(fulfillmentId, parsedAmount, type, description);
      toast.success(isCredit ? "Баланс пополнен" : "Средства списаны");
      onDone();
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      toast.error(e.message || e.error || "Не удалось выполнить операцию");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCredit ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            <Icon
              name={isCredit ? "PlusCircle" : "MinusCircle"}
              size={18}
              className={isCredit ? "text-emerald-600" : "text-red-600"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-bold text-navy-950">
              {isCredit ? "Пополнить баланс" : "Списать с баланса"}
            </div>
            <div className="text-xs text-gray-400 font-ibm truncate">{companyName}</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-navy-900 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
              Сумма (₽)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
              Описание
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Причина операции..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div className="flex items-center gap-2 justify-end pt-1">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm px-4 py-2"
            >
              Отмена
            </button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`font-bold font-golos text-sm h-9 px-5 text-white ${
                isCredit
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-red-600 hover:bg-red-500"
              }`}
            >
              {saving ? (
                <Icon name="Loader2" size={14} className="animate-spin mr-1.5" />
              ) : (
                <Icon
                  name={isCredit ? "PlusCircle" : "MinusCircle"}
                  size={14}
                  className="mr-1.5"
                />
              )}
              {isCredit ? "Пополнить" : "Списать"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BALANCE TAB ─────────────────────────────────────────────────────────────

export default function BalanceTab() {
  const [fulfillments, setFulfillments] = useState<FulfillmentBalance[]>([]);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

  const [adjustModal, setAdjustModal] = useState<{
    fulfillmentId: number;
    companyName: string;
    type: "credit" | "debit";
  } | null>(null);

  const loadFulfillments = useCallback(async () => {
    try {
      const data = await api.adminList();
      const items: FulfillmentBalance[] = (data.fulfillments || data || []).map(
        (f: FulfillmentBalance) => ({
          id: f.id,
          company_name: f.company_name,
          balance: Number(f.balance || 0),
          total_leads: Number(f.total_leads || 0),
          lead_price: Number(f.lead_price || 0),
          status: f.status,
        })
      );
      setFulfillments(items);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить фулфилменты");
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const data = await api.adminBalanceHistory();
      setTransactions(data.transactions || []);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить историю");
    } finally {
      setTxLoading(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadFulfillments(), loadTransactions()]);
    setLoading(false);
  }, [loadFulfillments, loadTransactions]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAdjustDone = () => {
    loadFulfillments();
    loadTransactions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fulfillments balances */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Wallet" size={15} className="text-navy-700" />
            <span className="font-golos font-bold text-navy-950 text-sm">Управление балансами</span>
            <span className="text-xs text-gray-400 font-ibm ml-1">{fulfillments.length} компаний</span>
          </div>
          <button
            onClick={loadAll}
            className="text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            title="Обновить"
          >
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {fulfillments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Icon name="Building2" size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Нет фулфилментов</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Компания</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Баланс</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Лидов всего</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Цена лида</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fulfillments.map((ff) => (
                    <tr key={ff.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-golos font-bold text-navy-950">{ff.company_name || "—"}</div>
                        <div className="text-xs text-gray-400 font-ibm">ID: {ff.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-golos font-bold text-base ${
                            ff.balance > 0
                              ? "text-emerald-600"
                              : ff.balance < 0
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                        >
                          {fmtMoney(ff.balance)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-ibm text-navy-900 font-medium">
                        {ff.total_leads}
                      </td>
                      <td className="px-4 py-3 font-ibm text-navy-900 font-medium">
                        {fmtMoney(ff.lead_price)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setAdjustModal({
                                fulfillmentId: ff.id,
                                companyName: ff.company_name,
                                type: "credit",
                              })
                            }
                            className="text-xs px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-ibm font-semibold transition-colors flex items-center gap-1"
                          >
                            <Icon name="Plus" size={11} />
                            Пополнить
                          </button>
                          <button
                            onClick={() =>
                              setAdjustModal({
                                fulfillmentId: ff.id,
                                companyName: ff.company_name,
                                type: "debit",
                              })
                            }
                            className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-ibm font-semibold transition-colors flex items-center gap-1"
                          >
                            <Icon name="Minus" size={11} />
                            Списать
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-100">
              {fulfillments.map((ff) => (
                <div key={ff.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-golos font-bold text-navy-950">{ff.company_name || "—"}</div>
                      <div className="text-xs text-gray-400 font-ibm">Лидов: {ff.total_leads} · Цена: {fmtMoney(ff.lead_price)}</div>
                    </div>
                    <span
                      className={`font-golos font-bold text-base ${
                        ff.balance > 0
                          ? "text-emerald-600"
                          : ff.balance < 0
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {fmtMoney(ff.balance)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        setAdjustModal({
                          fulfillmentId: ff.id,
                          companyName: ff.company_name,
                          type: "credit",
                        })
                      }
                      className="text-xs px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-ibm font-semibold transition-colors"
                    >
                      Пополнить
                    </button>
                    <button
                      onClick={() =>
                        setAdjustModal({
                          fulfillmentId: ff.id,
                          companyName: ff.company_name,
                          type: "debit",
                        })
                      }
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-ibm font-semibold transition-colors"
                    >
                      Списать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="History" size={15} className="text-navy-700" />
            <span className="font-golos font-bold text-navy-950 text-sm">История транзакций</span>
            {!txLoading && (
              <span className="text-xs text-gray-400 font-ibm ml-1">{transactions.length} записей</span>
            )}
          </div>
          <button
            onClick={loadTransactions}
            className="text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            title="Обновить"
          >
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {txLoading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={24} className="text-navy-300 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Icon name="Receipt" size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">История пуста</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Компания</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Сумма</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Тип</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Описание</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Администратор</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => {
                    const isCredit = tx.type === "credit";
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-golos font-bold text-navy-950 text-sm">{tx.company_name || "—"}</div>
                          <div className="text-xs text-gray-400 font-ibm">FF ID: {tx.fulfillment_id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-golos font-bold ${
                              isCredit ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {isCredit ? "+" : "−"}{fmtMoney(tx.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              isCredit
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {isCredit ? "Пополнение" : "Списание"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-ibm max-w-[220px]">
                          <span className="truncate block" title={tx.description}>{tx.description || "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-ibm">{tx.admin_email || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-ibm whitespace-nowrap">
                          {formatDate(tx.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-100">
              {transactions.map((tx) => {
                const isCredit = tx.type === "credit";
                return (
                  <div key={tx.id} className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-golos font-bold text-navy-950 text-sm">{tx.company_name || "—"}</div>
                        <div className="text-xs text-gray-400 font-ibm">{tx.description || "—"}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`font-golos font-bold text-base ${
                            isCredit ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isCredit ? "+" : "−"}{fmtMoney(tx.amount)}
                        </span>
                        <div className="text-xs text-gray-400 font-ibm mt-0.5">
                          {formatDate(tx.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-ibm">{tx.admin_email || "—"}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Adjust modal */}
      {adjustModal && (
        <AdjustModal
          fulfillmentId={adjustModal.fulfillmentId}
          companyName={adjustModal.companyName}
          type={adjustModal.type}
          onClose={() => setAdjustModal(null)}
          onDone={handleAdjustDone}
        />
      )}
    </div>
  );
}
