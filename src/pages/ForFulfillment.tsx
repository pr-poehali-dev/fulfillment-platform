import { useState } from "react";
import ForFulfillmentLayout from "./ForFulfillment/ForFulfillmentLayout";
import RegistrationForm from "./ForFulfillment/RegistrationForm";
import FormSidebar from "./ForFulfillment/FormSidebar";
import FormFaq from "./ForFulfillment/FormFaq";
import QuickContactSheet from "./ForFulfillment/QuickContactSheet";

export default function ForFulfillment() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <ForFulfillmentLayout>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Кнопка «не хочу заполнять» */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-navy-700 font-ibm border border-gray-200 hover:border-navy-300 bg-white rounded-xl px-4 py-2.5 transition-all shadow-sm"
            >
              <span>Не хочу заполнять форму</span>
              <span className="text-gray-300">→</span>
              <span className="text-navy-600 font-semibold">Свяжитесь со мной</span>
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
