import ForFulfillmentLayout from "./ForFulfillment/ForFulfillmentLayout";
import RegistrationForm from "./ForFulfillment/RegistrationForm";
import FormSidebar from "./ForFulfillment/FormSidebar";
import FormFaq from "./ForFulfillment/FormFaq";

export default function ForFulfillment() {
  return (
    <ForFulfillmentLayout>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RegistrationForm />
            </div>
            <FormSidebar />
          </div>
          <FormFaq />
        </div>
      </section>
    </ForFulfillmentLayout>
  );
}
