import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface AdminSettingsTabProps {
  user: { email: string; role: string; email_verified: boolean };
  onLogout: () => void;
  onEmailLinked?: (newEmail: string) => void;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-ibm placeholder:text-gray-400 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all";

export default function AdminSettingsTab({ user, onLogout, onEmailLinked }: AdminSettingsTabProps) {
  const isTelegramAccount = user.email.endsWith("@telegram.local");

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const handleLinkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (!email.trim())       { setError("Введите email"); return; }
    if (password.length < 6) { setError("Пароль — минимум 6 символов"); return; }

    setSaving(true);
    try {
      await api.linkEmail(email.trim(), password);
      setSuccess(true);
      setEmail(""); setPassword("");
      onEmailLinked?.(email.trim());
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-5">

      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={16} className="text-navy-700" />
          Аккаунт
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs text-gray-400 font-ibm">Email</div>
              {isTelegramAccount ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#2AABEE">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.674l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.835.885h-.52z"/>
                  </svg>
                  <span className="text-sm font-semibold text-navy-900 font-ibm">Вход через Telegram</span>
                </div>
              ) : (
                <div className="text-sm font-semibold text-navy-900 font-ibm">{user.email}</div>
              )}
            </div>
            {!isTelegramAccount && (
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Icon name="CheckCircle" size={14} />
                <span className="text-xs font-medium">Подтверждён</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-400 font-ibm">Роль</div>
              <div className="text-sm font-semibold text-navy-900 font-ibm capitalize">{user.role || "fulfillment"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Link email — только для Telegram-аккаунтов */}
      {isTelegramAccount && (
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
          <div className="font-golos font-bold text-navy-900 mb-1 flex items-center gap-2">
            <Icon name="Mail" size={16} className="text-navy-700" />
            Привязать email и пароль
          </div>
          <p className="text-xs text-gray-400 font-ibm mb-4 leading-relaxed">
            После привязки сможешь входить как через Telegram, так и по email и паролю.
          </p>

          {success ? (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <Icon name="CheckCircle" size={16} className="text-emerald-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-emerald-700 font-golos">Email привязан!</div>
                <div className="text-xs text-emerald-600 font-ibm mt-0.5">Теперь можно входить по email и паролю.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLinkEmail} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">Email</label>
                <input
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email" placeholder="you@company.ru" className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">Пароль</label>
                <div className="relative">
                  <input
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    type={showPw ? "text" : "password"} placeholder="Минимум 6 символов"
                    className={`${inputCls} pr-10`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Icon name={showPw ? "EyeOff" : "Eye"} size={15} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-500 text-xs font-ibm">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={saving}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 disabled:opacity-40">
                {saving
                  ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Сохранение...</>
                  : "Привязать email"}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
        <div className="font-golos font-bold text-red-700 mb-3 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} className="text-red-500" />
          Опасная зона
        </div>
        <p className="text-xs text-gray-500 font-ibm mb-4">
          Выход из аккаунта. Для повторного входа потребуется ввести логин и пароль.
        </p>
        <Button onClick={onLogout} variant="destructive" className="font-golos font-bold text-sm h-10">
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
