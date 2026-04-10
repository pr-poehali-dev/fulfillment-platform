import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface RegistrationFormSuccessProps {
  companyName: string;
  city: string;
  schemes: string[];
  contactEmail: string;
  tempPassword: string;
}

export default function RegistrationFormSuccess({
  companyName,
  city,
  schemes,
  contactEmail,
  tempPassword,
}: RegistrationFormSuccessProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Icon name="CheckCircle" size={32} className="text-emerald-600" />
      </div>
      <h2 className="font-golos font-black text-2xl text-navy-900 mb-2">Заявка отправлена!</h2>
      <p className="text-gray-500 font-ibm text-sm leading-relaxed mb-6 max-w-md mx-auto">
        Мы получили заявку компании <strong className="text-navy-900">{companyName}</strong>.
        Наш менеджер проверит данные и свяжется с вами в течение 24 часов на{" "}
        <strong className="text-navy-900">{contactEmail}</strong>
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
        {[
          { icon: "Building2", label: "Компания", value: companyName },
          { icon: "MapPin",    label: "Город",    value: city          },
          { icon: "Layers",    label: "Схемы",    value: schemes.join(", ") },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <Icon name={item.icon as "Building2"} size={16} className="text-navy-700 mx-auto mb-1" />
            <div className="text-xs text-gray-400 font-ibm">{item.label}</div>
            <div className="text-xs font-semibold text-navy-900 font-golos truncate">{item.value}</div>
          </div>
        ))}
      </div>
      {tempPassword && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-md mx-auto text-left">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Key" size={14} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700 font-golos uppercase">Ваш временный пароль</span>
          </div>
          <p className="text-xs text-amber-600 font-ibm mb-2">Используйте эти данные для входа в личный кабинет. Сохраните пароль — его можно изменить позже.</p>
          <div className="bg-white rounded-lg p-2.5 border border-amber-200">
            <div className="text-xs text-gray-500 font-ibm">Email: <strong className="text-navy-900">{contactEmail}</strong></div>
            <div className="text-xs text-gray-500 font-ibm">Пароль: <strong className="text-navy-900 font-mono">{tempPassword}</strong></div>
          </div>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        <a href="/">
          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 font-ibm">
            Перейти в каталог
          </Button>
        </a>
        <a href="/admin">
          <Button className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos">
            <Icon name="LayoutDashboard" size={15} className="mr-1.5" />Перейти в кабинет
          </Button>
        </a>
      </div>
    </div>
  );
}
