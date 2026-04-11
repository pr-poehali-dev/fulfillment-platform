import Icon from "@/components/ui/icon";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-golos font-black text-navy-900 text-xl mb-4 pb-2 border-b border-gray-100">{title}</h2>
    <div className="space-y-3 text-gray-600 font-ibm text-sm leading-relaxed">{children}</div>
  </section>
);

export default function Offer() {
  return (
    <div className="min-h-screen bg-gray-50 font-golos">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded flex items-center justify-center">
              <Icon name="Package" size={14} className="text-navy-950" />
            </div>
            <span className="font-golos font-bold text-white text-base tracking-tight">FulfillHub</span>
          </a>
          <a href="/" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors font-ibm">
            <Icon name="ArrowLeft" size={14} />
            На главную
          </a>
        </div>
      </nav>

      <div className="pt-14">
        <div className="bg-navy-900 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gold-500/15 rounded-full border border-gold-500/25">
              <Icon name="ScrollText" size={13} className="text-gold-400" />
              <span className="text-gold-400 text-xs font-medium font-ibm tracking-wide">Юридические документы</span>
            </div>
            <h1 className="font-golos font-black text-3xl md:text-4xl text-white mb-3">Публичная оферта</h1>
            <p className="text-white/50 font-ibm text-sm">публичное предложение о предоставлении доступа к платформе FulfillHub</p>
            <p className="text-white/40 font-ibm text-xs mt-2">Редакция от 11 апреля 2026 г.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
            <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 font-ibm text-sm leading-relaxed">
              Настоящий документ является публичной офертой в соответствии со ст. 437 Гражданского кодекса Российской Федерации. Регистрация на Платформе означает полное и безоговорочное принятие условий настоящей Оферты (акцепт).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">

            <Section title="1. Общие положения">
              <p>1.1. Настоящая публичная оферта (далее — «Оферта») является официальным предложением индивидуального предпринимателя в статусе самозанятого налогоплательщика <strong className="text-navy-900">Кругов Максим Геннадьевич (ИНН: 772379179900)</strong>, контактный email: <strong className="text-navy-900">hello@fulfillhub.ru</strong>, действующего на домене fulfillhub.ru (далее — «Оператор»), направленным любому заинтересованному лицу (далее — «Пользователь») заключить договор на условиях, изложенных в этой Оферте.</p>
              <p>1.2. Платформа FulfillHub (далее — «Платформа») — онлайн‑сервис B2B для размещения профилей фулфилментов и получения заявок (лидов) от селлеров. Доступ к Платформе осуществляется по адресу: <strong className="text-navy-900">fulfillhub.ru</strong>.</p>
            </Section>

            <Section title="2. Термины">
              <p>2.1. «Аккаунт» — учётная запись Пользователя на Платформе.</p>
              <p>2.2. «Лид» — заявка (запрос коммерческого предложения) от селлера, доступная фулфилменту через Платформу.</p>
              <p>2.3. «Платные услуги» — услуги и продукты Платформы, оплачиваемые отдельно (например, покупка лидов, интеграция, boost‑услуги и т.п.).</p>
              <p>2.4. «Дополнительное соглашение / Отдельный договор» — любой письменный договор или соглашение между Оператором и Пользователем (или между Пользователем и третьей стороной через Платформу), устанавливающий финансовые обязательства, ответственность за оказание услуг и иные коммерческие условия.</p>
            </Section>

            <Section title="3. Предмет Оферты">
              <p>3.1. По данной Оферте Оператор предоставляет Пользователю право зарегистрировать Аккаунт и получить доступ к публичному функционалу Платформы в объёме, описанном на сайте.</p>
              <p>3.2. Настоящая Оферта не содержит и не заменяет условий каких‑либо коммерческих/финансовых договоров по оказанию фулфилмент‑услуг между фулфилментом и селлером или между Оператором и Пользователем. Все финансовые договорённости, а также условия ответственности сторон за предоставление и оплату услуг и иные коммерческие условия оговариваются в Дополнительных соглашениях (отдельных договорах), подписываемых Сторонами.</p>
              <p>3.3. Акцепт Оферты производится путём регистрации Аккаунта на Платформе.</p>
            </Section>

            <Section title="4. Доступ к Платформе и аккаунт">
              <p>4.1. Регистрация выполняется через email + пароль или через Telegram‑авторизацию. При регистрации Пользователь предоставляет достоверные данные и отвечает за сохранность учётных данных.</p>
              <p>4.2. Пользователь несёт ответственность за все действия, совершённые через его аккаунт.</p>
              <p>4.3. Оператор вправе приостановить или прекратить доступ к Платформе в случае нарушения настоящей Оферты или Условий использования.</p>
            </Section>

            <Section title="5. Платные услуги и расчёты">
              <p>5.1. Базовый доступ к Платформе и размещение профиля в каталоге осуществляется <strong className="text-navy-900">бесплатно</strong>.</p>
              <p>5.2. Платные услуги (в том числе покупка лидов) предоставляются на основании отдельных договоров или соглашений, заключаемых с Оператором. Стоимость, порядок и сроки оплаты устанавливаются в этих договорах.</p>
              <p>5.3. Оплата производится в российских рублях. Оператор вправе изменить тарифы, уведомив Пользователя не менее чем за 7 (семь) календарных дней.</p>
              <p>5.4. Обязанность оплаты Лида возникает с момента его поступления в личный кабинет Фулфилмента вне зависимости от факта ответа на запрос или заключения договора с Селлером.</p>
            </Section>

            <Section title="6. Права и обязанности сторон">
              <p><strong className="text-navy-900">Пользователь обязуется:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>использовать Платформу в рамках закона и настоящей Оферты;</li>
                <li>предоставлять достоверные данные о компании, услугах и тарифах;</li>
                <li>своевременно обновлять информацию при изменении условий работы;</li>
                <li>не публиковать запрещённую или вводящую в заблуждение информацию;</li>
                <li>не передавать учётные данные третьим лицам.</li>
              </ul>
              <p className="mt-3"><strong className="text-navy-900">Оператор обязуется:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>предоставлять доступ к функционалу Платформы в соответствии с настоящей Офертой;</li>
                <li>обеспечивать доступность сервиса;</li>
                <li>обрабатывать персональные данные в соответствии с Политикой конфиденциальности;</li>
                <li>проводить модерацию профилей в разумные сроки;</li>
                <li>предоставлять техническую поддержку по вопросам работы Платформы.</li>
              </ul>
            </Section>

            <Section title="7. Интеллектуальная собственность">
              <p>7.1. Все права на Платформу, включая программный код, дизайн, логотипы и тексты, принадлежат Оператору.</p>
              <p>7.2. Пользователь сохраняет права на загруженный им контент (описания, фотографии) и предоставляет Оператору неисключительную лицензию на его использование в целях функционирования Платформы.</p>
              <p>7.3. Запрещается копирование, воспроизведение или иное использование материалов Платформы без письменного согласия Оператора.</p>
            </Section>

            <Section title="8. Ограничение ответственности">
              <p>8.1. Платформа предоставляется «как есть» (as is). Оператор не гарантирует бесперебойную работу Сервиса.</p>
              <p>8.2. Оператор является информационным посредником и не несёт ответственности за:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>качество фулфилмент‑услуг, предоставляемых Фулфилментами;</li>
                <li>достоверность информации, размещённой Пользователями самостоятельно;</li>
                <li>неисполнение или ненадлежащее исполнение договоров между Фулфилментом и Селлером;</li>
                <li>убытки Пользователя, возникшие вследствие использования или невозможности использования Платформы;</li>
                <li>перебои в работе, вызванные форс‑мажором или действиями третьих лиц.</li>
              </ul>
              <p>8.3. Совокупная ответственность Оператора по настоящей Оферте не может превышать суммы, фактически уплаченной Пользователем за последние 3 (три) месяца.</p>
            </Section>

            <Section title="9. Конфиденциальность и персональные данные">
              <p>9.1. Стороны обязуются соблюдать конфиденциальность в отношении информации, полученной в рамках исполнения настоящей Оферты.</p>
              <p>9.2. Обработка персональных данных осуществляется в соответствии с Политикой конфиденциальности, размещённой по адресу <strong className="text-navy-900">fulfillhub.ru/privacy</strong>.</p>
              <p>9.3. Пользователь даёт согласие на обработку персональных данных в объёме, необходимом для исполнения настоящей Оферты.</p>
            </Section>

            <Section title="10. Срок действия и расторжение">
              <p>10.1. Оферта вступает в силу с момента акцепта и действует бессрочно.</p>
              <p>10.2. Каждая из Сторон вправе расторгнуть договор в одностороннем порядке, уведомив другую Сторону не менее чем за 30 (тридцать) календарных дней.</p>
              <p>10.3. Расторжение договора не освобождает Пользователя от обязанности оплатить поступившие Лиды и иные оказанные услуги.</p>
              <p>10.4. Оператор вправе немедленно прекратить оказание услуг в случае существенного нарушения Пользователем условий настоящей Оферты.</p>
            </Section>

            <Section title="11. Прочие условия">
              <p>11.1. К настоящей Оферте применяется законодательство Российской Федерации.</p>
              <p>11.2. Все споры разрешаются путём переговоров, а при недостижении согласия — в судебном порядке по месту нахождения Оператора.</p>
              <p>11.3. Оператор вправе в одностороннем порядке изменять условия настоящей Оферты, размещая актуальную версию на сайте. Продолжение использования Платформы после опубликования изменений означает их принятие.</p>
            </Section>

            <Section title="12. Реквизиты Оператора">
              <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                <p><strong className="text-navy-900">Оператор:</strong> Кругов Максим Геннадьевич</p>
                <p><strong className="text-navy-900">Статус:</strong> Самозанятый налогоплательщик</p>
                <p><strong className="text-navy-900">ИНН:</strong> 772379179900</p>
                <p><strong className="text-navy-900">Email:</strong> hello@fulfillhub.ru</p>
                <p><strong className="text-navy-900">Сайт:</strong> fulfillhub.ru</p>
              </div>
            </Section>

          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/privacy" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-700 hover:border-navy-300 transition-colors font-golos">Политика конфиденциальности</a>
            <a href="/terms" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-700 hover:border-navy-300 transition-colors font-golos">Условия использования</a>
          </div>
        </div>

        <footer className="bg-navy-900 text-white py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 font-ibm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
                <Icon name="Package" size={12} className="text-navy-950" />
              </div>
              <span className="text-white/50 font-golos font-bold">FulfillHub</span>
              <span>© 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-white/60 transition-colors">Политика конфиденциальности</a>
              <a href="/terms" className="hover:text-white/60 transition-colors">Условия использования</a>
              <a href="/offer" className="hover:text-white/60 transition-colors">Оферта</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
