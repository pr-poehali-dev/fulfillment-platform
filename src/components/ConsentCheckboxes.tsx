import type { ReactNode } from "react";

interface ConsentCheckboxesProps {
  consentPersonal: boolean;
  consentTerms: boolean;
  marketingConsent: boolean;
  onConsentPersonalChange: (v: boolean) => void;
  onConsentTermsChange: (v: boolean) => void;
  onMarketingConsentChange: (v: boolean) => void;
  className?: string;
}

function Checkbox({
  checked,
  onChange,
  required,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
  label: ReactNode;
}) {
  return (
    <label
      className={`flex items-start gap-2.5 cursor-pointer group`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked
            ? "bg-navy-900 border-navy-900"
            : required
            ? "bg-white border-red-300"
            : "bg-white border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-[11px] font-ibm leading-relaxed text-gray-500 select-none" onClick={(e) => e.stopPropagation()}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
    </label>
  );
}

export default function ConsentCheckboxes({
  consentPersonal,
  consentTerms,
  marketingConsent,
  onConsentPersonalChange,
  onConsentTermsChange,
  onMarketingConsentChange,
  className = "",
}: ConsentCheckboxesProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Checkbox
        checked={consentPersonal}
        onChange={onConsentPersonalChange}
        required
        label={
          <>
            Я даю согласие на{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 transition-colors">
              обработку персональных данных
            </a>
          </>
        }
      />
      <Checkbox
        checked={consentTerms}
        onChange={onConsentTermsChange}
        required
        label={
          <>
            Я принимаю{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 transition-colors">
              политику конфиденциальности
            </a>
            {", "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 transition-colors">
              условия использования
            </a>
            {" и "}
            <a href="/offer" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 transition-colors">
              оферту
            </a>
          </>
        }
      />
      <Checkbox
        checked={marketingConsent}
        onChange={onMarketingConsentChange}
        label="Я согласен получать рекламно-информационные материалы"
      />
    </div>
  );
}