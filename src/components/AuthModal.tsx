import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import api, { setToken } from "@/lib/api";

type Tab  = "login" | "register";
type Step = "form" | "verify";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-navy-700 bg-navy-800 text-white text-sm font-ibm placeholder:text-navy-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all";

export default function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const navigate = useNavigate();
  const { user, loading, refresh } = useAuth();

  const [tab, setTab]   = useState<Tab>(defaultTab);
  const [step, setStep] = useState<Step>("form");

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [phone,       setPhone]       = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [verifyCode,  setVerifyCode]  = useState(["", "", "", "", "", ""]);
  const [error,       setError]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [resendCD,    setResendCD]    = useState(0);

  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // redirect after login
  useEffect(() => {
    if (!loading && user && open && step !== "verify") {
      onClose();
      const dest = user.role === "seller" ? "/seller" : "/admin";
      navigate(dest, { replace: true });
    }
  }, [user, loading, open, step, onClose, navigate]);

  // resend cooldown
  useEffect(() => {
    if (resendCD <= 0) return;
    const t = setTimeout(() => setResendCD((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCD]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const reset = () => {
    setEmail(""); setPassword(""); setPhone(""); setShowPw(false);
    setVerifyCode(["", "", "", "", "", ""]); setError(""); setStep("form");
  };

  const switchTab = (t: Tab) => { setTab(t); setError(""); setStep("form"); };

  const close = () => { reset(); onClose(); };

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Заполните все поля"); return; }
    setSubmitting(true);
    try {
      const data = await api.login(email.trim(), password);
      setToken(data.token);
      await refresh();
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный email или пароль");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim())   { setError("Введите email"); return; }
    if (password.length < 6) { setError("Пароль — минимум 6 символов"); return; }
    if (!phone.trim())   { setError("Введите номер телефона"); return; }
    setSubmitting(true);
    try {
      const data = await api.register(email.trim(), password, phone.trim());
      setToken(data.token);
      setStep("verify");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Ошибка регистрации");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) { setError("Введите 6-значный код"); return; }
    setError(""); setSubmitting(true);
    try {
      await api.verifyEmail(code);
      await refresh();
      close();
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный код");
    } finally {
      setSubmitting(false);
    }
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-navy-950 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-navy-800">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Package" size={15} className="text-navy-950" />
          </div>
          <div className="flex-1">
            <div className="font-golos font-black text-white text-sm leading-none">
              {step === "verify" ? "Подтверждение email" : "Личный кабинет"}
            </div>
            <div className="text-[11px] text-navy-400 font-ibm mt-0.5">
              {step === "verify" ? `Код отправлен на ${email}` : "FulfillHub"}
            </div>
          </div>
          <button onClick={close} className="w-7 h-7 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-navy-400 hover:text-white transition-colors">
            <Icon name="X" size={14} />
          </button>
        </div>

        <div className="p-5">
          {step === "verify" ? (
            /* ── VERIFY ── */
            <div className="space-y-4">
              <p className="text-xs text-navy-300 font-ibm text-center">Введите 6-значный код из письма</p>
              <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                {verifyCode.map((digit, i) => (
                  <input key={i}
                    ref={(el) => { codeRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-11 h-11 text-center text-lg font-bold border border-navy-700 rounded-lg bg-navy-800 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all"
                    placeholder="·"
                  />
                ))}
              </div>
              {error && <p className="text-red-400 text-xs text-center font-ibm">{error}</p>}
              <Button onClick={handleVerify} disabled={submitting || verifyCode.join("").length !== 6}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos disabled:opacity-40">
                {submitting ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Проверка...</> : "Подтвердить"}
              </Button>
              <p className="text-center text-xs text-navy-400 font-ibm">
                Не пришёл код?{" "}
                <button onClick={handleResend} disabled={resendCD > 0}
                  className="text-gold-400 hover:text-gold-300 disabled:text-navy-500 transition-colors">
                  {resendCD > 0 ? `Повторить через ${resendCD}с` : "Отправить ещё раз"}
                </button>
              </p>
            </div>
          ) : (
            /* ── FORM ── */
            <div className="space-y-4">
              {/* Tab switcher */}
              <div className="flex bg-navy-900 rounded-xl p-1">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button key={t} onClick={() => switchTab(t)}
                    className={`flex-1 py-1.5 text-xs font-bold font-golos rounded-lg transition-all ${
                      tab === t ? "bg-navy-700 text-white shadow-sm" : "text-navy-400 hover:text-navy-200"
                    }`}>
                    {t === "login" ? "Войти" : "Регистрация"}
                  </button>
                ))}
              </div>

              {/* Telegram button */}
              <button
                disabled
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#2AABEE]/30 bg-[#2AABEE]/10 text-[#2AABEE] text-sm font-bold font-golos opacity-60 cursor-not-allowed"
                title="Скоро будет доступно"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.674l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.835.885h-.52z"/>
                </svg>
                Войти через Telegram
                <span className="text-[10px] font-normal opacity-70 font-ibm">(скоро)</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-navy-800" />
                <span className="text-[11px] text-navy-500 font-ibm">или через email</span>
                <div className="flex-1 h-px bg-navy-800" />
              </div>

              {/* Form */}
              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-navy-300 font-golos block mb-1">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                      type="email" placeholder="you@company.ru" className={inputCls} autoFocus />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-navy-300 font-golos block mb-1">Пароль</label>
                    <div className="relative">
                      <input value={password} onChange={(e) => setPassword(e.target.value)}
                        type={showPw ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-10`} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200 transition-colors">
                        <Icon name={showPw ? "EyeOff" : "Eye"} size={15} />
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-400 text-xs font-ibm">{error}</p>}
                  <Button type="submit" disabled={submitting}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos mt-1 disabled:opacity-40">
                    {submitting ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Вход...</> : "Войти"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-navy-300 font-golos block mb-1">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                      type="email" placeholder="you@company.ru" className={inputCls} autoFocus />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-navy-300 font-golos block mb-1">Телефон</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)}
                      type="tel" placeholder="+7 (999) 000-00-00" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-navy-300 font-golos block mb-1">Пароль</label>
                    <div className="relative">
                      <input value={password} onChange={(e) => setPassword(e.target.value)}
                        type={showPw ? "text" : "password"} placeholder="Минимум 6 символов" className={`${inputCls} pr-10`} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200 transition-colors">
                        <Icon name={showPw ? "EyeOff" : "Eye"} size={15} />
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-400 text-xs font-ibm">{error}</p>}
                  <Button type="submit" disabled={submitting}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos mt-1 disabled:opacity-40">
                    {submitting ? <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Создание...</> : "Создать аккаунт"}
                  </Button>
                </form>
              )}

              <p className="text-[11px] text-navy-500 font-ibm text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <span className="text-navy-400 underline cursor-pointer">политикой конфиденциальности</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
