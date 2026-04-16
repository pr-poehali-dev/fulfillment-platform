import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AdminUser {
  id: number;
  email: string;
  role: string;
  email_verified: boolean;
  is_blocked: boolean;
  block_reason: string | null;
  blocked_at: string | null;
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

function RoleBadge({ role }: { role: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    seller: { label: "Продавец", cls: "bg-amber-50 text-amber-700" },
    fulfillment: { label: "Фулфилмент", cls: "bg-blue-50 text-blue-700" },
    admin: { label: "Администратор", cls: "bg-red-50 text-red-700" },
  };
  const c = cfg[role] ?? { label: role, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium font-ibm ${c.cls}`}>
      {c.label}
    </span>
  );
}

// ─── BLOCK MODAL ─────────────────────────────────────────────────────────────

function BlockModal({
  userId,
  email,
  onClose,
  onDone,
}: {
  userId: number;
  email: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleBlock = async () => {
    setSaving(true);
    try {
      await api.adminBlockUser(userId, "block", reason);
      toast.success(`Пользователь ${email} заблокирован`);
      onDone();
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      toast.error(e.message || e.error || "Не удалось заблокировать");
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
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Icon name="ShieldOff" size={18} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-bold text-navy-950">Заблокировать пользователя</div>
            <div className="text-xs text-gray-400 font-ibm truncate">{email}</div>
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
              Причина блокировки (необязательно)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Укажите причину..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm px-4 py-2"
            >
              Отмена
            </button>
            <Button
              onClick={handleBlock}
              disabled={saving}
              className="bg-red-600 hover:bg-red-500 text-white font-bold font-golos text-sm h-9 px-5"
            >
              {saving ? (
                <Icon name="Loader2" size={14} className="animate-spin mr-1.5" />
              ) : (
                <Icon name="ShieldOff" size={14} className="mr-1.5" />
              )}
              Заблокировать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UNBLOCK CONFIRM MODAL ───────────────────────────────────────────────────

function UnblockModal({
  userId,
  email,
  onClose,
  onDone,
}: {
  userId: number;
  email: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleUnblock = async () => {
    setSaving(true);
    try {
      await api.adminBlockUser(userId, "unblock");
      toast.success(`Пользователь ${email} разблокирован`);
      onDone();
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      toast.error(e.message || e.error || "Не удалось разблокировать");
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
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Icon name="ShieldCheck" size={18} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-bold text-navy-950">Разблокировать пользователя</div>
            <div className="text-xs text-gray-400 font-ibm truncate">{email}</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-navy-900 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 font-ibm">
            Вы уверены, что хотите разблокировать пользователя{" "}
            <span className="font-semibold text-navy-900">{email}</span>?
          </p>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm px-4 py-2"
            >
              Отмена
            </button>
            <Button
              onClick={handleUnblock}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-golos text-sm h-9 px-5"
            >
              {saving ? (
                <Icon name="Loader2" size={14} className="animate-spin mr-1.5" />
              ) : (
                <Icon name="ShieldCheck" size={14} className="mr-1.5" />
              )}
              Разблокировать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL MODAL ─────────────────────────────────────────────────────────────

function EmailModal({
  to,
  onClose,
}: {
  to: string;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Заполните тему и текст письма");
      return;
    }
    setSending(true);
    try {
      await api.adminSendEmail(to, subject, message);
      toast.success("Письмо отправлено");
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      toast.error(e.message || e.error || "Не удалось отправить письмо");
    } finally {
      setSending(false);
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
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Icon name="Send" size={17} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-bold text-navy-950">Написать письмо</div>
            <div className="text-xs text-gray-400 font-ibm truncate">{to}</div>
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
              Кому
            </label>
            <input
              value={to}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-ibm bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
              Тема
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Тема письма..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
              Сообщение
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Текст письма..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200 resize-none"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm px-4 py-2"
            >
              Отмена
            </button>
            <Button
              onClick={handleSend}
              disabled={sending}
              className="bg-navy-950 hover:bg-navy-800 text-white font-bold font-golos text-sm h-9 px-5"
            >
              {sending ? (
                <Icon name="Loader2" size={14} className="animate-spin mr-1.5" />
              ) : (
                <Icon name="Send" size={14} className="mr-1.5" />
              )}
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USERS TAB ───────────────────────────────────────────────────────────────

export default function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<"all" | "seller" | "fulfillment">("all");
  const [showBlocked, setShowBlocked] = useState(false);

  const [blockModal, setBlockModal] = useState<{ userId: number; email: string } | null>(null);
  const [unblockModal, setUnblockModal] = useState<{ userId: number; email: string } | null>(null);
  const [emailModal, setEmailModal] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.adminUsers();
      setUsers(data.users || []);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить пользователей");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (showBlocked && !u.is_blocked) return false;
    return true;
  });

  const stats = {
    total: users.length,
    sellers: users.filter((u) => u.role === "seller").length,
    fulfillments: users.filter((u) => u.role === "fulfillment").length,
    blocked: users.filter((u) => u.is_blocked).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Всего пользователей", value: stats.total, icon: "Users", iconBg: "bg-navy-50", iconColor: "text-navy-700" },
          { label: "Продавцы", value: stats.sellers, icon: "ShoppingBag", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "Фулфилменты", value: stats.fulfillments, icon: "Building2", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Заблокировано", value: stats.blocked, icon: "ShieldOff", iconBg: "bg-red-50", iconColor: "text-red-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${card.iconBg}`}>
              <Icon name={card.icon} size={15} className={card.iconColor} />
            </div>
            <div className="font-golos font-black text-2xl text-navy-950">{card.value}</div>
            <div className="text-xs text-gray-400 font-ibm">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(
              [
                { key: "all", label: "Все" },
                { key: "seller", label: "Продавцы" },
                { key: "fulfillment", label: "Фулфилменты" },
              ] as { key: "all" | "seller" | "fulfillment"; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setRoleFilter(f.key)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all font-golos ${
                  roleFilter === f.key
                    ? "bg-white text-navy-950 shadow-sm"
                    : "text-gray-500 hover:text-navy-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={showBlocked}
              onChange={(e) => setShowBlocked(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 accent-red-500"
            />
            <span className="text-xs text-gray-600 font-ibm">Только заблокированные</span>
          </label>

          <button
            onClick={load}
            className="ml-auto text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            title="Обновить"
          >
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Users" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Пользователей не найдено</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Email</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Роль</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Верификация</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Дата рег.</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Статус</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-ibm text-navy-900 text-sm font-medium">{u.email}</div>
                        <div className="text-xs text-gray-400 font-ibm">ID: {u.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-3">
                        {u.email_verified ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-ibm">
                            <Icon name="CheckCircle" size={14} className="text-emerald-500" />
                            Подтверждён
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-500 font-ibm">
                            <Icon name="XCircle" size={14} className="text-red-400" />
                            Не подтверждён
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 font-ibm whitespace-nowrap">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {u.is_blocked ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                              <Icon name="Lock" size={10} />
                              Заблокирован
                            </span>
                            {u.block_reason && (
                              <div className="text-[10px] text-gray-400 font-ibm mt-0.5 max-w-[140px] truncate" title={u.block_reason}>
                                {u.block_reason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700">
                            <Icon name="CheckCircle" size={10} />
                            Активен
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {u.is_blocked ? (
                            <button
                              onClick={() => setUnblockModal({ userId: u.id, email: u.email })}
                              className="text-xs px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-ibm font-semibold transition-colors whitespace-nowrap"
                            >
                              Разблокировать
                            </button>
                          ) : (
                            <button
                              onClick={() => setBlockModal({ userId: u.id, email: u.email })}
                              className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-ibm font-semibold transition-colors"
                            >
                              Заблокировать
                            </button>
                          )}
                          <button
                            onClick={() => setEmailModal(u.email)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Написать письмо"
                          >
                            <Icon name="Mail" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{u.email}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <RoleBadge role={u.role} />
                        {u.email_verified ? (
                          <Icon name="CheckCircle" size={13} className="text-emerald-500" />
                        ) : (
                          <Icon name="XCircle" size={13} className="text-red-400" />
                        )}
                      </div>
                    </div>
                    {u.is_blocked ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700 flex-shrink-0">
                        <Icon name="Lock" size={10} />
                        Заблокирован
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 flex-shrink-0">
                        <Icon name="CheckCircle" size={10} />
                        Активен
                      </span>
                    )}
                  </div>
                  {u.is_blocked && u.block_reason && (
                    <div className="text-xs text-gray-400 font-ibm bg-red-50 rounded p-2">{u.block_reason}</div>
                  )}
                  <div className="text-xs text-gray-400 font-ibm">{formatDate(u.created_at)}</div>
                  <div className="flex items-center gap-2 pt-1">
                    {u.is_blocked ? (
                      <button
                        onClick={() => setUnblockModal({ userId: u.id, email: u.email })}
                        className="text-xs px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-ibm font-semibold transition-colors"
                      >
                        Разблокировать
                      </button>
                    ) : (
                      <button
                        onClick={() => setBlockModal({ userId: u.id, email: u.email })}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-ibm font-semibold transition-colors"
                      >
                        Заблокировать
                      </button>
                    )}
                    <button
                      onClick={() => setEmailModal(u.email)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-ibm font-semibold transition-colors flex items-center gap-1"
                    >
                      <Icon name="Mail" size={12} />
                      Написать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 font-ibm">
            Показано {filtered.length} из {users.length}
          </div>
        )}
      </div>

      {/* Modals */}
      {blockModal && (
        <BlockModal
          userId={blockModal.userId}
          email={blockModal.email}
          onClose={() => setBlockModal(null)}
          onDone={load}
        />
      )}

      {unblockModal && (
        <UnblockModal
          userId={unblockModal.userId}
          email={unblockModal.email}
          onClose={() => setUnblockModal(null)}
          onDone={load}
        />
      )}

      {emailModal && (
        <EmailModal
          to={emailModal}
          onClose={() => setEmailModal(null)}
        />
      )}
    </div>
  );
}