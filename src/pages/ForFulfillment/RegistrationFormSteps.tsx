import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { STEPS } from "./RegistrationFormStepper";
import Step1CompanyInfo from "./Step1CompanyInfo";
import Step2Services from "./Step2Services";
import Step3Pricing from "./Step3Pricing";
import Step4Contacts from "./Step4Contacts";

export interface FormState {
  // Step 1
  companyName: string;   setCompanyName: (v: string) => void;
  inn: string;           setInn: (v: string) => void;
  city: string;          setCity: (v: string) => void;
  address: string;       setAddress: (v: string) => void;
  warehouseArea: string; setWarehouseArea: (v: string) => void;
  foundedYear: string;   setFoundedYear: (v: string) => void;
  teamSize: string;      setTeamSize: (v: string) => void;
  workingHours: string;  setWorkingHours: (v: string) => void;
  description: string;   setDescription: (v: string) => void;
  // Step 2
  schemes: string[];      toggleScheme: (v: string) => void;
  features: string[];     toggleFeature: (v: string) => void;
  packaging: string[];    togglePackaging: (v: string) => void;
  marketplaces: string[]; toggleMarketplace: (v: string) => void;
  // Step 3
  storagePrice: string;  setStoragePrice: (v: string) => void;
  assemblyPrice: string; setAssemblyPrice: (v: string) => void;
  deliveryPrice: string; setDeliveryPrice: (v: string) => void;
  minVolume: string;     setMinVolume: (v: string) => void;
  hasTrial: boolean;     setHasTrial: (v: boolean) => void;
  // Step 4
  contactName: string;  setContactName: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
  contactPhone: string; setContactPhone: (v: string) => void;
  contactTg: string;    setContactTg: (v: string) => void;
  agree: boolean;       setAgree: (v: boolean) => void;
}

interface RegistrationFormStepsProps {
  step: number;
  state: FormState;
  canNext: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function RegistrationFormSteps({ step, state, canNext, submitting, onBack, onNext, onSubmit }: RegistrationFormStepsProps) {
  const s = state;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
        <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
          <Icon name={STEPS[step - 1].icon as "Building2"} size={19} className="text-navy-700" />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-ibm">Шаг {step} из {STEPS.length}</div>
          <div className="font-golos font-bold text-navy-900 text-lg">{STEPS[step - 1].title}</div>
        </div>
        <div className="ml-auto text-xs text-gray-300 font-ibm">{Math.round(((step - 1) / STEPS.length) * 100)}% заполнено</div>
      </div>

      {step === 1 && (
        <Step1CompanyInfo
          companyName={s.companyName}     setCompanyName={s.setCompanyName}
          inn={s.inn}                     setInn={s.setInn}
          city={s.city}                   setCity={s.setCity}
          address={s.address}             setAddress={s.setAddress}
          foundedYear={s.foundedYear}     setFoundedYear={s.setFoundedYear}
          warehouseArea={s.warehouseArea} setWarehouseArea={s.setWarehouseArea}
          teamSize={s.teamSize}           setTeamSize={s.setTeamSize}
          workingHours={s.workingHours}   setWorkingHours={s.setWorkingHours}
          description={s.description}     setDescription={s.setDescription}
        />
      )}
      {step === 2 && (
        <Step2Services
          schemes={s.schemes}           toggleScheme={s.toggleScheme}
          features={s.features}         toggleFeature={s.toggleFeature}
          packaging={s.packaging}       togglePackaging={s.togglePackaging}
          marketplaces={s.marketplaces} toggleMarketplace={s.toggleMarketplace}
        />
      )}
      {step === 3 && (
        <Step3Pricing
          storagePrice={s.storagePrice}   setStoragePrice={s.setStoragePrice}
          assemblyPrice={s.assemblyPrice} setAssemblyPrice={s.setAssemblyPrice}
          deliveryPrice={s.deliveryPrice} setDeliveryPrice={s.setDeliveryPrice}
          minVolume={s.minVolume}         setMinVolume={s.setMinVolume}
          hasTrial={s.hasTrial}           setHasTrial={s.setHasTrial}
        />
      )}
      {step === 4 && (
        <Step4Contacts
          contactName={s.contactName}   setContactName={s.setContactName}
          contactEmail={s.contactEmail} setContactEmail={s.setContactEmail}
          contactPhone={s.contactPhone} setContactPhone={s.setContactPhone}
          contactTg={s.contactTg}       setContactTg={s.setContactTg}
          agree={s.agree}               setAgree={s.setAgree}
          companyName={s.companyName}
          city={s.city}
          schemes={s.schemes}
          marketplaces={s.marketplaces}
          storagePrice={s.storagePrice}
          hasTrial={s.hasTrial}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors ${step === 1 ? "invisible" : ""}`}
        >
          <Icon name="ChevronLeft" size={16} />Назад
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((st) => (
            <div
              key={st.id}
              className={`rounded-full transition-all ${
                step === st.id ? "w-6 h-2 bg-navy-900" : step > st.id ? "w-2 h-2 bg-emerald-400" : "w-2 h-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step < STEPS.length ? (
          <Button
            onClick={onNext}
            disabled={!canNext}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Далее <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canNext || submitting}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Icon name="Loader2" size={15} className="mr-1.5 animate-spin" />Отправка...</>
            ) : (
              <><Icon name="Send" size={15} className="mr-1.5" />Отправить заявку</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
