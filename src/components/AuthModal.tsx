import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import api, { setToken } from "@/lib/api";
import TelegramLoginButton from "@/components/TelegramLoginButton";

type Tab  = "login" | "register";
type Step = "form" | "verify" | "reset-email" | "reset-code" | "reset-done";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-ibm placeholder:text-gray-400 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all";

export default function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const navigate = useNavigate();
  const { user, loading, refresh } = useAuth();

  const [tab, setTab]   = useState<Tab>(defaultTab);
  const [step, setStep] = useState<Step>("form");

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [phone,      setPhone]      = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [showNewPw,  setShowNewPw]  = useState(false);
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendCD,   setResendCD]   = useState(0);
  const [emailExists, setEmailExists] = useState(false);

  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!loading && user && open && step !== "verify") {
      onClose();
      navigate(user.role === "seller" ? "/seller" : "/admin", { replace: true });
    }
  }, [user, loading, open, step, onClose, navigate]);

  useEffect(() => {
    if (resendCD <= 0) return;
    const t = setTimeout(() => setResendCD((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCD]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const reset = () => {
    setEmail(""); setPassword(""); setPhone(""); setShowPw(false);
    setNewPassword(""); setShowNewPw(false);
    setVerifyCode(["", "", "", "", "", ""]); setError(""); setStep("form"); setEmailExists(false);
  };
  const switchTab = (t: Tab) => { setTab(t); setError(""); setStep("form"); setEmailExists(false); };
  const close = () => { reset(); onClose(); };

  const handleTelegramAuth = async (tgUser: { id: number; first_name: string; last_name?: string; username?: string; auth_date: number; hash: string }) => {
    setError(""); setSubmitting(true);
    try {
      const data = await api.telegramAuth(tgUser as Record<string, string | number>);
      setToken(data.token); await refresh();
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Ошибка входа через Telegram");
    } finally { setSubmitting(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email.trim() || !password) { setError("Заполните все поля"); return; }
    setSubmitting(true);
    try {
      const data = await api.login(email.trim(), password);
      setToken(data.token); await refresh();
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный email или пароль");
    } finally { setSubmitting(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setEmailExists(false);
    if (!email.trim())       { setError("Введите email"); return; }
    if (password.length < 6) { setError("Пароль — минимум 6 символов"); return; }
    setSubmitting(true);
    try {
      const data = await api.register(email.trim(), password, phone.trim());
      setToken(data.token); setStep("verify");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string; status?: number };
      if (e.status === 409) { setEmailExists(true); return; }
      setError(e.message || e.detail || "Ошибка регистрации");
    } finally { setSubmitting(false); }
  };

  const handleVerify = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) { setError("Введите 6-значный код"); return; }
    setError(""); setSubmitting(true);
    try {
      await api.verifyEmail(code);
      await refresh();
      onClose();
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный код");
    } finally { setSubmitting(false); }
  };

  const handleForgotSend = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email.trim()) { setError("Введите email"); return; }
    setSubmitting(true);
    try {
      await api.forgotPassword(email.trim());
      setVerifyCode(["", "", "", "", "", ""]);
      setStep("reset-code");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Не удалось отправить код");
    } finally { setSubmitting(false); }
  };

  const handleResetConfirm = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) { setError("Введите 6-значный код"); return; }
    if (newPassword.length < 6) { setError("Пароль — минимум 6 символов"); return; }
    setError(""); setSubmitting(true);
    try {
      const data = await api.resetPassword(email.trim(), code, newPassword);
      setToken(data.token);
      await refresh();
      setStep("reset-done");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный или просроченный код");
    } finally { setSubmitting(false); }
  };

  const handleResend = async () => {
    if (resendCD > 0) return;
    try { await api.resendCode(); setResendCD(60); }
    catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Не удалось отправить код");
    }
  };

  const handleCodeInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...verifyCode]; next[i] = val.slice(-1); setVerifyCode(next);
    if (val && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKeyDown = useCallback((i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[i] && i > 0) codeRefs.current[i - 1]?.focus();
    if (e.key === "Enter" && verifyCode.join("").length === 6) handleVerify();
  }, [verifyCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("").map((_, i) => pasted[i] || "");
    setVerifyCode(next);
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="Package" size={16} className="text-gold-400" />
          </div>
          <div className="flex-1">
            <div className="font-golos font-black text-navy-950 text-sm leading-none">
              {step === "verify" ? "Подтверждение email" :
               step === "reset-email" ? "Восстановление пароля" :
               step === "reset-code" ? "Новый пароль" :
               step === "reset-done" ? "Пароль изменён" :
               "Личный кабинет"}
            </div>
            <div className="text-[11px] text-gray-400 font-ibm mt-0.5">
              {step === "verify" ? `Код отправлен на ${email}` :
               step === "reset-code" ? `Код отправлен на ${email}` :
               "FulfillHub"}
            </div>
          </div>
          <button
            onClick={close}
            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={14} />
          </button>
        </div>

        <div className="p-5">
          {step === "reset-done" ? (
            /* ── RESET DONE ── */
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Icon name="CheckCircle" size={28} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-600 font-ibm">Пароль успешно изменён. Вы вошли в аккаунт.</p>
              <Button onClick={() => { onClose(); navigate("/admin", { replace: true }); }}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10">
                Перейти в кабинет
              </Button>
            </div>
          ) : step === "reset-email" ? (
            /* ── RESET EMAIL ── */
            <form onSubmit={handleForgotSend} className="space-y-4">
              <p className="text-xs text-gray-500 font-ibm">Введите email — пришлём код для сброса пароля</p>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email" placeholder="you@company.ru" className={inputCls} autoFocus />
              </div>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-500 text-xs font-ibm">{error}</p>
                </div>
              )}
              <Button type="submit" disabled={submitting}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 disabled:opacity-40">
                {submitting ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Отправка...</> : "Отправить код"}
              </Button>
              <button type="button" onClick={() => { setStep("form"); setError(""); }}
                className="w-full text-xs text-gray-400 hover:text-gray-600 font-ibm transition-colors">
                ← Вернуться к входу
              </button>
            </form>
          ) : step === "reset-code" ? (
            /* ── RESET CODE + NEW PASSWORD ── */
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-ibm text-center">Введите код из письма и придумайте новый пароль</p>
              <div className="flex gap-2 justify-center" onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                if (!pasted) return;
                const next = Array(6).fill("").map((_, i) => pasted[i] || "");
                setVerifyCode(next);
                codeRefs.current[Math.min(pasted.length, 5)]?.focus();
              }}>
                {verifyCode.map((digit, i) => (
                  <input key={i}
                    ref={(el) => { codeRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={(e) => { if (!/^\d*$/.test(e.target.value)) return; const next = [...verifyCode]; next[i] = e.target.value.slice(-1); setVerifyCode(next); if (e.target.value && i < 5) codeRefs.current[i + 1]?.focus(); }}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !verifyCode[i] && i > 0) codeRefs.current[i - 1]?.focus(); }}
                    className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 text-navy-950 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all"
                    placeholder="·"
                  />
                ))}
              </div>
              <div className="relative">
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  type={showNewPw ? "text" : "password"} placeholder="Новый пароль (мин. 6 символов)"
                  className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Icon name={showNewPw ? "EyeOff" : "Eye"} size={15} />
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-500 text-xs font-ibm">{error}</p>
                </div>
              )}
              <Button onClick={handleResetConfirm}
                disabled={submitting || verifyCode.join("").length !== 6 || newPassword.length < 6}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 disabled:opacity-40">
                {submitting ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Сохранение...</> : "Сохранить пароль"}
              </Button>
            </div>
          ) : step === "verify" ? (
            /* ── VERIFY ── */
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-ibm text-center">
                Введите 6-значный код из письма
              </p>

              <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                {verifyCode.map((digit, i) => (
                  <input key={i}
                    ref={(el) => { codeRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 text-navy-950 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all"
                    placeholder="·"
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-500 text-xs font-ibm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleVerify}
                disabled={submitting || verifyCode.join("").length !== 6}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 disabled:opacity-40"
              >
                {submitting
                  ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Проверка...</>
                  : "Подтвердить"}
              </Button>

              <p className="text-center text-xs text-gray-400 font-ibm">
                Не пришёл код?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendCD > 0}
                  className="text-navy-600 hover:text-navy-800 font-semibold disabled:text-gray-300 transition-colors"
                >
                  {resendCD > 0 ? `Повторить через ${resendCD}с` : "Отправить ещё раз"}
                </button>
              </p>
            </div>
          ) : (
            /* ── FORM ── */
            <div className="space-y-4">
              {/* Tab switcher */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button key={t} onClick={() => switchTab(t)}
                    className={`flex-1 py-1.5 text-xs font-bold font-golos rounded-lg transition-all ${
                      tab === t
                        ? "bg-white text-navy-900 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}>
                    {t === "login" ? "Войти" : "Регистрация"}
                  </button>
                ))}
              </div>

              {/* Telegram */}
              {submitting ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-400 font-ibm">
                  <Icon name="Loader2" size={15} className="animate-spin" />
                  Входим через Telegram...
                </div>
              ) : (
                <TelegramLoginButton onAuth={handleTelegramAuth} botName="SkladMatch_bot" />
              )}

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-400 font-ibm">или через email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Login form */}
              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">
                      Email
                    </label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                      type="email" placeholder="you@company.ru" className={inputCls} autoFocus />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">
                      Пароль
                    </label>
                    <div className="relative">
                      <input value={password} onChange={(e) => setPassword(e.target.value)}
                        type={showPw ? "text" : "password"} placeholder="••••••••"
                        className={`${inputCls} pr-10`} />
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

                  <Button type="submit" disabled={submitting}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 mt-1 disabled:opacity-40">
                    {submitting
                      ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Вход...</>
                      : "Войти"}
                  </Button>
                  <button type="button"
                    onClick={() => { setStep("reset-email"); setError(""); }}
                    className="w-full text-center text-xs text-gray-400 hover:text-navy-600 font-ibm transition-colors">
                    Забыли пароль?
                  </button>
                </form>
              ) : (
                /* Register form */
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">
                      Email
                    </label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                      type="email" placeholder="you@company.ru" className={inputCls} autoFocus />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 font-golos block mb-1">
                      Пароль
                    </label>
                    <div className="relative">
                      <input value={password} onChange={(e) => setPassword(e.target.value)}
                        type={showPw ? "text" : "password"} placeholder="Минимум 6 символов"
                        className={`${inputCls} pr-10`} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Icon name={showPw ? "EyeOff" : "Eye"} size={15} />
                      </button>
                    </div>
                  </div>

                  {emailExists && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon name="AlertCircle" size={13} className="text-amber-500 flex-shrink-0" />
                        <p className="text-amber-700 text-xs font-ibm font-medium">Этот email уже зарегистрирован</p>
                      </div>
                      <button type="button"
                        onClick={() => { setStep("reset-email"); setError(""); setEmailExists(false); }}
                        className="text-xs text-navy-600 hover:text-navy-800 font-semibold font-ibm underline transition-colors ml-5">
                        Восстановить пароль →
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
                      <p className="text-red-500 text-xs font-ibm">{error}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={submitting}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos rounded-xl h-10 mt-1 disabled:opacity-40">
                    {submitting
                      ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Создание...</>
                      : "Создать аккаунт"}
                  </Button>
                </form>
              )}

              <p className="text-[11px] text-gray-400 font-ibm text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <span className="text-gray-500 underline cursor-pointer hover:text-navy-600 transition-colors">
                  политикой конфиденциальности
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}