import { useState } from "react";
import ForFulfillmentLayout from "./ForFulfillment/ForFulfillmentLayout";
import RegistrationForm from "./ForFulfillment/RegistrationForm";
import FormSidebar from "./ForFulfillment/FormSidebar";
import FormFaq from "./ForFulfillment/FormFaq";
import QuickContactSheet from "./ForFulfillment/QuickContactSheet";
import Icon from "@/components/ui/icon";

export default function ForFulfillment() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <ForFulfillmentLayout>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Кнопка «не хочу заполнять» */}
          <div className="bg-gradient-to-r from-gold-500/10 via-gold-400/15 to-gold-500/10 border border-gold-400/30 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <div className="font-golos font-black text-navy-900 text-base mb-1">
                Не хочешь заполнять форму?
              </div>
              <div className="text-sm text-gray-500 font-ibm">
                Оставь контакты — мы сами всё заполним и передадим доступ в кабинет
              </div>
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap text-sm"
            >
              <Icon name="Phone" size={15} />
              Свяжитесь со мной
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RegistrationForm />
            </div>
            <FormSidebar />
          </div>
          <FormFaq />
        </div>
      </section>

      <QuickContactSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </ForFulfillmentLayout>
  );
}