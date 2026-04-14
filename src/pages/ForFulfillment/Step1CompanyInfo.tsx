const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 placeholder:text-gray-400";

export interface Step1Props {
  companyName: string;   setCompanyName: (v: string) => void;
  inn: string;           setInn: (v: string) => void;
  city: string;          setCity: (v: string) => void;
  address: string;       setAddress: (v: string) => void;
  foundedYear: string;   setFoundedYear: (v: string) => void;
  warehouseArea: string; setWarehouseArea: (v: string) => void;
  teamSize: string;      setTeamSize: (v: string) => void;
  workingHours: string;  setWorkingHours: (v: string) => void;
  description: string;   setDescription: (v: string) => void;
}

export default function Step1CompanyInfo({ companyName, setCompanyName, inn, setInn, city, setCity, address, setAddress, foundedYear, setFoundedYear, warehouseArea, setWarehouseArea, teamSize, setTeamSize, workingHours, setWorkingHours, description, setDescription }: Step1Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
            Название компании <span className="text-red-400">*</span>
          </label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            placeholder='ООО "Мой Склад"' className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
            ИНН <span className="text-red-400">*</span>
          </label>
          <input value={inn} onChange={(e) => setInn(e.target.value)}
            placeholder="7712345678" maxLength={12} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
            Город склада <span className="text-red-400">*</span>
          </label>
          <input value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="Москва" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Год основания</label>
          <input value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)}
            placeholder="2018" maxLength={4} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">
          Адрес склада <span className="text-gray-400 font-normal">(отображается на карте)</span>
        </label>
        <input value={address} onChange={(e) => setAddress(e.target.value)}
          placeholder="Москва, ул. Складская, д. 12, стр. 3" className={inputCls} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Площадь склада (м²)</label>
          <input value={warehouseArea} onChange={(e) => setWarehouseArea(e.target.value)}
            placeholder="10 000" type="number" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Размер команды (чел.)</label>
          <input value={teamSize} onChange={(e) => setTeamSize(e.target.value)}
            placeholder="50" type="number" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">Часы работы</label>
          <input value={workingHours} onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="Пн-Пт 09:00-18:00" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 font-golos block mb-1.5">О компании</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          rows={4} placeholder="Расскажите о вашем сервисе, специализации и преимуществах..."
          className={`${inputCls} resize-none`} />
        <div className="text-xs text-gray-400 font-ibm mt-1">{description.length} / 500 символов</div>
      </div>
    </div>
  );
}
