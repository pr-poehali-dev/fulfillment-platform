import { useState } from "react";
import api, { setToken } from "@/lib/api";
import { toast } from "sonner";
import { ymGoal } from "@/lib/ym";

import RegistrationFormSuccess from "./RegistrationFormSuccess";
import RegistrationFormStepper from "./RegistrationFormStepper";
import RegistrationFormSteps, { type FormState } from "./RegistrationFormSteps";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [warehouseArea, setWarehouseArea] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [schemes, setSchemes] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [packaging, setPackaging] = useState<string[]>([]);
  const [marketplaces, setMarketplaces] = useState<string[]>([]);

  // Step 3
  const [storagePrice, setStoragePrice] = useState("");
  const [assemblyPrice, setAssemblyPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [minVolume, setMinVolume] = useState("");
  const [hasTrial, setHasTrial] = useState(false);

  // Step 4
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTg, setContactTg] = useState("");
  const [agree, setAgree] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const canNext = () => {
    if (step === 1) return !!(companyName.trim() && city.trim() && inn.trim());
    if (step === 2) return schemes.length > 0 && marketplaces.length > 0;
    if (step === 3) return !!(storagePrice.trim() && assemblyPrice.trim());
    if (step === 4) return !!(contactName.trim() && contactEmail.trim() && contactPhone.trim() && agree);
    return true;
  };

  const handleSubmit = async () => {
    if (!canNext() || submitting) return;
    setSubmitting(true);
    try {
      const data = await api.registerFromForm({
        companyName, inn, city, address,
        warehouseArea: parseInt(warehouseArea) || 0,
        foundedYear: parseInt(foundedYear) || 0,
        teamSize: parseInt(teamSize) || 0,
        workingHours, description,
        schemes, features, packaging, marketplaces,
        storagePrice, assemblyPrice, deliveryPrice, minVolume, hasTrial,
        contactName, contactEmail, contactPhone, contactTg,
        marketing_consent: marketingConsent,
      });
      setToken(data.token);
      setTempPassword(data.temp_password || "");
      ymGoal("fulfillment_registration_submit");
      setDone(true);
      toast.success("Заявка отправлена и аккаунт создан!");
    } catch (err: unknown) {
      const e = err as { error?: string; exists?: boolean };
      if (e.exists) {
        toast.error("Этот email уже зарегистрирован. Войдите через страницу входа.");
      } else {
        toast.error(e.error || "Ошибка при отправке");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <RegistrationFormSuccess
        companyName={companyName}
        city={city}
        schemes={schemes}
        contactEmail={contactEmail}
        tempPassword={tempPassword}
      />
    );
  }

  const formState: FormState = {
    companyName, setCompanyName,
    inn,         setInn,
    city,        setCity,
    address,     setAddress,
    warehouseArea, setWarehouseArea,
    foundedYear, setFoundedYear,
    teamSize,    setTeamSize,
    workingHours, setWorkingHours,
    description, setDescription,
    schemes,      toggleScheme:      (v) => toggle(schemes, v, setSchemes),
    features,     toggleFeature:     (v) => toggle(features, v, setFeatures),
    packaging,    togglePackaging:   (v) => toggle(packaging, v, setPackaging),
    marketplaces, toggleMarketplace: (v) => toggle(marketplaces, v, setMarketplaces),
    storagePrice,  setStoragePrice,
    assemblyPrice, setAssemblyPrice,
    deliveryPrice, setDeliveryPrice,
    minVolume,     setMinVolume,
    hasTrial,      setHasTrial,
    contactName,  setContactName,
    contactEmail, setContactEmail,
    contactPhone, setContactPhone,
    contactTg,    setContactTg,
    agree,        setAgree,
    marketingConsent, setMarketingConsent,
  };

  return (
    <>
      <RegistrationFormStepper step={step} />
      <RegistrationFormSteps
        step={step}
        state={formState}
        canNext={canNext()}
        submitting={submitting}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
        onNext={() => { if (canNext()) { ymGoal(`fulfillment_step_${step + 1}`); setStep((s) => s + 1); } }}
        onSubmit={handleSubmit}
      />
    </>
  );
}