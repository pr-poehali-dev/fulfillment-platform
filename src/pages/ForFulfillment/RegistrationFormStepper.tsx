import Icon from "@/components/ui/icon";

export const STEPS = [
  { id: 1, title: "О компании",     icon: "Building2"  },
  { id: 2, title: "Склад и услуги", icon: "Warehouse"  },
  { id: 3, title: "Тарифы",         icon: "DollarSign" },
  { id: 4, title: "Контакты",       icon: "Phone"      },
];

interface RegistrationFormStepperProps {
  step: number;
}

export default function RegistrationFormStepper({ step }: RegistrationFormStepperProps) {
  return (
    <div className="flex items-center mb-6">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-golos font-bold text-sm transition-all shadow-sm ${
                step > s.id
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : step === s.id
                  ? "bg-navy-900 text-white shadow-navy-200"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s.id ? <Icon name="Check" size={15} /> : s.id}
            </div>
            <div
              className={`text-xs mt-1.5 text-center hidden md:block font-ibm max-w-[80px] leading-tight ${
                step === s.id ? "text-navy-900 font-semibold" : "text-gray-400"
              }`}
            >
              {s.title}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-4 md:mb-5 transition-all ${
                step > s.id ? "bg-emerald-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
