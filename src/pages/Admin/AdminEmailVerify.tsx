import { useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface AdminEmailVerifyProps {
  email: string;
  verifyCode: string[];
  setVerifyCode: (v: string[]) => void;
  verifySubmitting: boolean;
  verifyError: string;
  resendCooldown: number;
  onVerify: () => void;
  onResend: () => void;
  onLogout: () => void;
}

export default function AdminEmailVerify({
  email,
  verifyCode,
  setVerifyCode,
  verifySubmitting,
  verifyError,
  resendCooldown,
  onVerify,
  onResend,
  onLogout,
}: AdminEmailVerifyProps) {
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...verifyCode];
    next[index] = value.slice(-1);
    setVerifyCode(next);
    if (value && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setVerifyCode(next);
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="min-h-screen bg-navy-950 font-golos">
      <nav className="border-b border-navy-800/50 bg-navy-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Icon name="Package" size={18} className="text-navy-950" />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
              Fulfill<span className="text-gold-400 group-hover:text-gold-300">Hub</span>
            </span>
          </Link>
          <button onClick={onLogout} className="text-sm text-navy-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="MailCheck" size={32} className="text-gold-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Подтвердите email</h1>
            <p className="text-navy-300 text-sm">Мы отправили код на <span className="text-white font-medium">{email}</span></p>
          </div>

          <div className="bg-navy-900 border border-navy-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30 space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-3 text-center">Введите 6-значный код</label>
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleCodePaste}>
                {verifyCode.map((digit, i) => (
                  <input key={i} ref={(el) => { codeRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-lg bg-navy-800 border border-navy-700 text-center text-xl font-ibm font-bold text-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {verifyError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{verifyError}</p>
              </div>
            )}

            <Button onClick={onVerify} disabled={verifySubmitting || verifyCode.join("").length !== 6}
              className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-base rounded-xl disabled:opacity-50">
              {verifySubmitting ? <Icon name="Loader2" size={20} className="animate-spin" /> : <><Icon name="CheckCircle" size={20} /> Подтвердить</>}
            </Button>

            <div className="text-center">
              <button onClick={onResend} disabled={resendCooldown > 0}
                className="text-sm text-navy-400 hover:text-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {resendCooldown > 0 ? `Отправить повторно (${resendCooldown}с)` : "Отправить повторно"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
