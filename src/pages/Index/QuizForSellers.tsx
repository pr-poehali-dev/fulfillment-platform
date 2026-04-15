import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FEATURE_FILTERS, PACKAGING_FILTERS } from "./data";
import api from "@/lib/api";
import { ymGoal } from "@/lib/ym";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizAnswers {
  categories: string[];
  workFormats: string[];
  volume: string;
  extraServices: string[];
  packaging: string[];
  name: string;
  phone: string;
  email: string;
  comment: string;
}

const EMPTY_ANSWERS: QuizAnswers = {
  categories: [], workFormats: [], volume: "",
  extraServices: [], packaging: [],
  name: "", phone: "", email: "", comment: "",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Автозапчасти", "Бытовая химия", "Инструменты", "Канцтовары",
  "Косметика и парфюмерия", "Лекарства, товары для здоровья",
  "Мелкая бытовая техника", "Моторные масла", "Обувь и аксессуары",
  "Одежда и аксессуары", "Продукты (бакалея)", "Сувениры и подарки",
  "Техника для дома и портативная электроника", "Товары для дачи",
  "Товары для детей", "Товары для дома", "Товары для животных",
  "Товары для курения", "Товары народного потребления",
  "Товары для ремонта и строительства", "Товары для спорта и туризма",
  "Товары для хобби и рукоделия", "Украшения, часы", "Другое",
];

const WORK_FORMATS = [
  { key: "FBO", label: "FBO", desc: "Хранение и отгрузка со склада маркетплейса. Вы привозите товар на склад площадки, она сама обрабатывает заказы." },
  { key: "FBS", label: "FBS", desc: "Хранение на складе продавца или фулфилмента, отгрузка через маркетплейс. Вы управляете остатками, площадка — доставкой." },
  { key: "DBS", label: "DBS", desc: "Хранение и доставка полностью на стороне продавца. Маркетплейс выступает только витриной." },
  { key: "B2B", label: "B2B", desc: "Оптовые поставки юридическим лицам и предпринимателям." },
  { key: "B2C", label: "B2C", desc: "Розничные поставки конечным покупателям." },
  { key: "unsure", label: "Затрудняюсь ответить", desc: "Мы поможем разобраться и подберём оптимальный вариант." },
];

const VOLUMES = [
  "от 100 шт", "от 500 шт", "от 1 000 шт",
  "от 5 000 шт", "от 10 000 шт", "от 30 000 шт", "от 100 000 шт",
];

const PACKAGING_WITH_NONE = ["Упаковка не нужна", ...PACKAGING_FILTERS];

const TOTAL_STEPS = 6;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-ibm text-gray-400">
        <span>Шаг {step} из {TOTAL_STEPS}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MultiChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-ibm border transition-all text-left ${
        selected
          ? "bg-navy-900 text-white border-navy-900"
          : "bg-white text-gray-700 border-gray-200 hover:border-navy-400 hover:text-navy-700"
      }`}
    >
      {label}
    </button>
  );
}

function SingleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-ibm border transition-all text-left ${
        selected
          ? "bg-navy-900 text-white border-navy-900"
          : "bg-white text-gray-700 border-gray-200 hover:border-navy-400 hover:text-navy-700"
      }`}
    >
      {label}
    </button>
  );
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ answers, set }: { answers: QuizAnswers; set: (a: Partial<QuizAnswers>) => void }) {
  return (
    <div>
      <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Какая у вас категория товаров?</h3>
      <p className="text-xs text-gray-400 font-ibm mb-4">Можно выбрать несколько</p>
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
        {CATEGORIES.map(c => (
          <MultiChip key={c} label={c} selected={answers.categories.includes(c)} onClick={() => set({ categories: toggle(answers.categories, c) })} />
        ))}
      </div>
    </div>
  );
}

function Step2({ answers, set }: { answers: QuizAnswers; set: (a: Partial<QuizAnswers>) => void }) {
  return (
    <div>
      <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Формат работы</h3>
      <p className="text-xs text-gray-400 font-ibm mb-4">Можно выбрать несколько</p>
      <div className="space-y-2">
        {WORK_FORMATS.map(f => {
          const selected = answers.workFormats.includes(f.key);
          return (
            <button
              key={f.key}
              onClick={() => set({ workFormats: toggle(answers.workFormats, f.key) })}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selected ? "bg-navy-900 border-navy-900 text-white" : "bg-white border-gray-200 hover:border-navy-300 text-gray-800"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-golos font-bold text-sm">{f.label}</span>
                {selected && <Icon name="Check" size={14} className="text-gold-400" />}
              </div>
              <p className={`text-xs font-ibm leading-relaxed ${selected ? "text-white/70" : "text-gray-400"}`}>{f.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3({ answers, set }: { answers: QuizAnswers; set: (a: Partial<QuizAnswers>) => void }) {
  return (
    <div>
      <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Ежемесячный объём товара</h3>
      <p className="text-xs text-gray-400 font-ibm mb-4">Выберите один вариант</p>
      <div className="grid grid-cols-2 gap-2">
        {VOLUMES.map(v => (
          <SingleChip key={v} label={v} selected={answers.volume === v} onClick={() => set({ volume: v })} />
        ))}
      </div>
    </div>
  );
}

function Step4({ answers, set }: { answers: QuizAnswers; set: (a: Partial<QuizAnswers>) => void }) {
  return (
    <div>
      <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Дополнительные услуги</h3>
      <p className="text-xs text-gray-400 font-ibm mb-4">Выберите нужные вам услуги (можно несколько)</p>
      <div className="flex flex-wrap gap-2">
        {FEATURE_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => set({ extraServices: toggle(answers.extraServices, f.key) })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ibm border transition-all ${
              answers.extraServices.includes(f.key)
                ? "bg-navy-900 text-white border-navy-900"
                : "bg-white text-gray-700 border-gray-200 hover:border-navy-300"
            }`}
          >
            <Icon name={f.icon as "Camera"} size={11} />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5({ answers, set }: { answers: QuizAnswers; set: (a: Partial<QuizAnswers>) => void }) {
  const handleClick = (val: string) => {
    if (val === "Упаковка не нужна") {
      set({ packaging: answers.packaging.includes(val) ? [] : [val] });
    } else {
      const without = answers.packaging.filter(v => v !== "Упаковка не нужна");
      set({ packaging: toggle(without, val) });
    }
  };

  return (
    <div>
      <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Нужна ли вам упаковка?</h3>
      <p className="text-xs text-gray-400 font-ibm mb-4">Можно выбрать несколько видов</p>
      <div className="flex flex-wrap gap-2">
        {PACKAGING_WITH_NONE.map(p => (
          <MultiChip key={p} label={p} selected={answers.packaging.includes(p)} onClick={() => handleClick(p)} />
        ))}
      </div>
    </div>
  );
}

function Step6({ answers, set, submitting, error }: {
  answers: QuizAnswers;
  set: (a: Partial<QuizAnswers>) => void;
  submitting: boolean;
  error: string;
}) {
  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";
  return (
    <div>
      <h3 className="font-golos font-black text-navy-900 text-lg mb-1">Ваши контакты</h3>
      <p className="text-xs text-gray-400 font-ibm mb-4">Пришлём подборку подходящих фулфилментов</p>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Имя *</label>
          <input value={answers.name} onChange={e => set({ name: e.target.value })} placeholder="Иван Иванов" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Телефон *</label>
          <input value={answers.phone} onChange={e => set({ phone: e.target.value })} placeholder="+7 (999) 000-00-00" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Email *</label>
          <input value={answers.email} onChange={e => set({ email: e.target.value })} type="email" placeholder="you@company.ru" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 font-golos block mb-1">Комментарий</label>
          <textarea value={answers.comment} onChange={e => set({ comment: e.target.value })} rows={2}
            placeholder="Дополнительные пожелания..." className={`${inputCls} resize-none`} />
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <Icon name="AlertCircle" size={13} className="text-red-400 flex-shrink-0" />
            <p className="text-red-500 text-xs font-ibm">{error}</p>
          </div>
        )}
        <p className="text-[11px] text-gray-400 font-ibm leading-relaxed">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">политикой конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">обработкой персональных данных</a>
        </p>
      </div>
    </div>
  );
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="CheckCircle" size={30} className="text-emerald-600" />
      </div>
      <h3 className="font-golos font-black text-navy-900 text-xl mb-2">Заявка отправлена!</h3>
      <p className="text-sm text-gray-500 font-ibm leading-relaxed mb-6">
        Мы получили вашу анкету и подберём подходящих фулфилмент-партнёров.<br />
        Свяжемся с вами в течение 1 рабочего дня.
      </p>
      <Button onClick={onClose} className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos px-8 h-10">
        Отлично!
      </Button>
    </div>
  );
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

interface QuizForSellersProps {
  open: boolean;
  onClose: () => void;
}

export default function QuizForSellers({ open, onClose }: QuizForSellersProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) ymGoal("quiz_open");
  }, [open]);

  const set = (patch: Partial<QuizAnswers>) => setAnswers(prev => ({ ...prev, ...patch }));

  const canNext = () => {
    if (step === 1) return answers.categories.length > 0;
    if (step === 2) return answers.workFormats.length > 0;
    if (step === 3) return answers.volume !== "";
    if (step === 4) return true;
    if (step === 5) return answers.packaging.length > 0;
    if (step === 6) return answers.name.trim() !== "" && answers.phone.trim() !== "" && answers.email.trim() !== "";
    return true;
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      ymGoal(`quiz_step_${step + 1}`);
      setStep(s => s + 1);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const text = [
        `Категории: ${answers.categories.join(", ")}`,
        `Формат работы: ${answers.workFormats.join(", ")}`,
        `Объём: ${answers.volume}`,
        `Доп. услуги: ${answers.extraServices.length ? answers.extraServices.map(k => FEATURE_FILTERS.find(f => f.key === k)?.label || k).join(", ") : "не выбрано"}`,
        `Упаковка: ${answers.packaging.join(", ")}`,
        `Комментарий: ${answers.comment || "—"}`,
      ].join("\n");
      await api.sendSupportRequest(
        answers.name.trim(),
        answers.email.trim(),
        `📋 Квиз подбора фулфилмента\n\n${text}\n\nТелефон: ${answers.phone.trim()}`
      );
      ymGoal("quiz_submit");
      setDone(true);
    } catch {
      setError("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep(1); setAnswers(EMPTY_ANSWERS); setDone(false); setError(""); }, 300);
  };

  if (!open) return null;

  const stepLabels = ["Товары", "Формат", "Объём", "Услуги", "Упаковка", "Контакты"];

  const innerContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={14} className="text-navy-950" />
          </div>
          <span className="font-golos font-bold text-navy-900 text-sm">Подбор фулфилмента</span>
        </div>
        <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <Icon name="X" size={14} className="text-gray-500" />
        </button>
      </div>

      {done ? (
        <div className="flex-1 overflow-y-auto">
          <SuccessScreen onClose={handleClose} />
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="px-6 pt-4 pb-3 flex-shrink-0">
            <ProgressBar step={step} />
            <div className="flex items-center gap-1 mt-3">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex items-center gap-1 flex-1">
                  <div className={`h-1 w-full rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-gold-500" : "bg-gray-100"}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {stepLabels.map((label, i) => (
                <span key={i} className={`text-[10px] font-ibm transition-colors ${i + 1 === step ? "text-gold-600 font-semibold" : i + 1 < step ? "text-gray-400" : "text-gray-200"}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {step === 1 && <Step1 answers={answers} set={set} />}
            {step === 2 && <Step2 answers={answers} set={set} />}
            {step === 3 && <Step3 answers={answers} set={set} />}
            {step === 4 && <Step4 answers={answers} set={set} />}
            {step === 5 && <Step5 answers={answers} set={set} />}
            {step === 6 && <Step6 answers={answers} set={set} submitting={submitting} error={error} />}
          </div>

          {/* Footer nav */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 font-ibm disabled:opacity-0 transition-colors"
            >
              <Icon name="ArrowLeft" size={14} />
              Назад
            </button>
            <Button
              onClick={handleNext}
              disabled={!canNext() || submitting}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-10 px-6 disabled:opacity-40"
            >
              {submitting ? (
                <><Icon name="Loader2" size={14} className="mr-1.5 animate-spin" />Отправка...</>
              ) : step === TOTAL_STEPS ? (
                <><Icon name="Send" size={14} className="mr-1.5" />Отправить</>
              ) : (
                <>Далее <Icon name="ArrowRight" size={14} className="ml-1.5" /></>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop modal */}
      <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
          {innerContent}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="lg:hidden fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[93vh]">
          <div className="flex justify-center pt-2.5 pb-0 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          {innerContent}
        </div>
      </div>
    </>
  );
}