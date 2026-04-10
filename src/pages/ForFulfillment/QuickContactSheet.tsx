import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 placeholder:text-gray-400 transition-all";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function QuickContactSheet({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", esc);
    };
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || submitting) return;
    setSubmitting(true);
    try {
      // Отправляем как телеграм/email уведомление через КП-форму
      await fetch("https://functions.poehali.dev/65cffefd-e88e-4f9c-a0be-769cb5345a17?action=send-quick-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim() }),
      });
    } catch { /* ignore */ }
    setSent(true);
    setSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setName(""); setContact(""); setSent(false); }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col justify-end" onClick={handleClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-t-2xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col md:max-w-lg md:mx-auto md:w-full md:rounded-2xl md:mb-8"
      >
        {/* Ручка */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="p-6 overflow-y-auto">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={28} className="text-emerald-600" />
              </div>
              <h3 className="font-golos font-black text-xl text-navy-900 mb-2">Заявка принята!</h3>
              <p className="text-sm text-gray-500 font-ibm leading-relaxed mb-6">
                Мы свяжемся с вами в течение 1 часа, поможем заполнить анкету и передадим логин и пароль от личного кабинета.
              </p>
              <Button onClick={handleClose} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos">
                Закрыть
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 pr-4">
                  <h3 className="font-golos font-black text-navy-900 text-xl leading-tight mb-2">
                    Мы заполним всё за вас
                  </h3>
                  <p className="text-sm text-gray-500 font-ibm leading-relaxed">
                    Оставьте контакты — наш менеджер свяжется с вами, соберёт информацию о вашем фулфилменте и разместит карточку. После этого передадим логин и пароль от личного кабинета.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 transition-colors"
                >
                  <Icon name="X" size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 mt-5">
                <div>
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
                    Ваше имя <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                    className={inputCls}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
                    Телефон или Telegram <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+7 (999) 000-00-00 или @username"
                    className={inputCls}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!name.trim() || !contact.trim() || submitting}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-12 rounded-xl mt-2 disabled:opacity-40"
                >
                  {submitting
                    ? <><Icon name="Loader2" size={15} className="mr-2 animate-spin" />Отправка...</>
                    : <><Icon name="Send" size={15} className="mr-2" />Жду звонка</>}
                </Button>

                <p className="text-[11px] text-gray-400 font-ibm text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
