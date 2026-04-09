import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import api, { setToken } from "@/lib/api";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Tab = "register" | "login";
type Step = "form" | "verify";

// ─── AUTH PAGE ──────────────────────────────────────────────────────────────

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  const [tab, setTab] = useState<Tab>(
    searchParams.get("tab") === "login" ? "login" : "register"
  );
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verification
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // State
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already logged in (but not if we're mid-registration on verify step)
  useEffect(() => {
    if (!loading && user && step !== "verify") {
      navigate("/admin", { replace: true });
    }
  }, [user, loading, navigate, step]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ─── HANDLERS ───────────────────────────────────────────────────────────────

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    if (!email.trim()) {
      setError("Введите email");
      return;
    }
    if (!phone.trim()) {
      setError("Введите номер телефона");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.register(email.trim(), password, phone.trim());
      setToken(data.token);
      setStep("verify");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Ошибка регистрации. Попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Заполните все поля");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.login(email.trim(), password);
      setToken(data.token);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный email или пароль");
    } finally {
      setSubmitting(false);
    }
  };

  const { refresh } = useAuth();

  const handleVerify = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) {
      setError("Введите 6-значный код");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await api.verifyEmail(code);
      await refresh();
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Неверный код подтверждения");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await api.resendCode();
      setResendCooldown(60);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setError(e.message || e.detail || "Не удалось отправить код повторно");
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...verifyCode];
    next[index] = value.slice(-1);
    setVerifyCode(next);

    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && verifyCode.join("").length === 6) {
      handleVerify();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...verifyCode];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setVerifyCode(next);
    const focusIdx = Math.min(pasted.length, 5);
    codeRefs.current[focusIdx]?.focus();
  };

  // Reset error when switching tabs
  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    setStep("form");
    setVerifyCode(["", "", "", "", "", ""]);
  };

  // ─── LOADING ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin">
          <Icon name="Loader2" size={32} className="text-gold-400" />
        </div>
      </div>
    );
  }

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-navy-950 font-golos">
      {/* Navbar */}
      <nav className="border-b border-navy-800/50 bg-navy-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Icon name="Package" size={18} className="text-navy-950" />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
              Fulfill<span className="text-gold-400 group-hover:text-gold-300">Hub</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {step === "verify" ? "Подтверждение email" : "Личный кабинет"}
            </h1>
            <p className="text-navy-300 text-sm">
              {step === "verify"
                ? `Мы отправили код на ${email}`
                : "Для фулфилмент-провайдеров"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-navy-900 border border-navy-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30">
            {step === "verify" ? (
              /* ─── VERIFICATION STEP ──────────────────────────── */
              <div className="space-y-6">
                {/* Code inputs */}
                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-3 text-center">
                    Введите 6-значный код
                  </label>
                  <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleCodePaste}>
                    {verifyCode.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { codeRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeInput(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 rounded-lg bg-navy-800 border border-navy-700 text-center text-xl font-ibm font-bold text-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                    <Icon name="AlertCircle" size={16} className="text-red-400 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Verify button */}
                <Button
                  onClick={handleVerify}
                  disabled={submitting || verifyCode.join("").length !== 6}
                  className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-base rounded-xl transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Icon name="Loader2" size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Icon name="CheckCircle" size={20} />
                      Подтвердить
                    </>
                  )}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="text-sm text-navy-400 hover:text-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0
                      ? `Отправить повторно (${resendCooldown}с)`
                      : "Отправить повторно"}
                  </button>
                </div>

                {/* Back */}
                <button
                  onClick={() => {
                    setStep("form");
                    setError("");
                  }}
                  className="w-full text-center text-sm text-navy-400 hover:text-navy-200 transition-colors"
                >
                  <Icon name="ArrowLeft" size={14} className="inline mr-1" />
                  Назад
                </button>
              </div>
            ) : (
              /* ─── FORM STEP ──────────────────────────────────── */
              <>
                {/* Tabs */}
                <div className="flex bg-navy-800 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => switchTab("register")}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      tab === "register"
                        ? "bg-gold-500 text-navy-950 shadow-md"
                        : "text-navy-300 hover:text-white"
                    }`}
                  >
                    Регистрация
                  </button>
                  <button
                    onClick={() => switchTab("login")}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      tab === "login"
                        ? "bg-gold-500 text-navy-950 shadow-md"
                        : "text-navy-300 hover:text-white"
                    }`}
                  >
                    Вход
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={tab === "register" ? handleRegister : handleLogin}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Icon
                        name="Mail"
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.ru"
                        required
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-navy-800 border border-navy-700 text-white placeholder:text-navy-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all text-sm font-ibm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-1.5">
                      Пароль
                      {tab === "register" && (
                        <span className="text-navy-500 font-normal ml-1">(мин. 6 символов)</span>
                      )}
                    </label>
                    <div className="relative">
                      <Icon
                        name="Lock"
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                        required
                        minLength={tab === "register" ? 6 : undefined}
                        className="w-full h-12 pl-11 pr-11 rounded-xl bg-navy-800 border border-navy-700 text-white placeholder:text-navy-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all text-sm font-ibm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300 transition-colors"
                      >
                        <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Phone (register only) */}
                  {tab === "register" && (
                    <div>
                      <label className="block text-sm font-medium text-navy-200 mb-1.5">
                        Телефон
                      </label>
                      <div className="relative">
                        <Icon
                          name="Phone"
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500"
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (999) 123-45-67"
                          required
                          className="w-full h-12 pl-11 pr-4 rounded-xl bg-navy-800 border border-navy-700 text-white placeholder:text-navy-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all text-sm font-ibm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-red-400 shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-base rounded-xl transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <Icon name="Loader2" size={20} className="animate-spin" />
                    ) : tab === "register" ? (
                      <>
                        <Icon name="UserPlus" size={20} />
                        Зарегистрироваться
                      </>
                    ) : (
                      <>
                        <Icon name="LogIn" size={20} />
                        Войти
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-navy-700" />
                  <span className="text-xs text-navy-500 uppercase tracking-wider">или</span>
                  <div className="flex-1 h-px bg-navy-700" />
                </div>

                {/* OAuth buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl bg-[#FC3F1D] hover:bg-[#e0381a] text-white font-medium text-sm transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.548H7.5l2.739-4.064C8.863 12.87 8.007 11.858 8.007 9.93c0-2.398 1.694-4.012 4.389-4.012h3.104v12.08h-2.178V7.666z"
                        fill="currentColor"
                      />
                    </svg>
                    Войти через Яндекс
                  </button>

                  <button
                    type="button"
                    className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-medium text-sm border border-gray-200 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Войти через Google
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-navy-500 mt-6">
            Регистрируясь, вы соглашаетесь с{" "}
            <span className="text-navy-400 hover:text-gold-400 cursor-pointer transition-colors">
              условиями использования
            </span>{" "}
            и{" "}
            <span className="text-navy-400 hover:text-gold-400 cursor-pointer transition-colors">
              политикой конфиденциальности
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}