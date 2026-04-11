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
            <p className="text-white/50 font-ibm text-sm">на оказание информационных услуг по продвижению фулфилмент-компаний</p>
            <p className="text-white/40 font-ibm text-xs mt-2">Редакция от 11 апреля 2026 г.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
            <Icon name="Info" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 font-ibm text-sm leading-relaxed">
              Настоящий документ является публичной офертой в соответствии со ст. 437 Гражданского кодекса Российской Федерации. Регистрация на Платформе в качестве Фулфилмента означает полное и безоговорочное принятие условий настоящей Оферты (акцепт).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">

            <Section title="1. Стороны договора">
              <p><strong className="text-navy-900">Исполнитель:</strong> ООО «ФулфилХаб» (далее — «Исполнитель»), владелец и оператор Платформы FulfillHub.</p>
              <p><strong className="text-navy-900">Заказчик:</strong> юридическое лицо или индивидуальный предприниматель, принявший условия настоящей Оферты путём регистрации на Платформе в качестве Фулфилмента (далее — «Заказчик» или «Фулфилмент»).</p>
            </Section>

            <Section title="2. Предмет договора">
              <p>2.1. Исполнитель обязуется оказывать Заказчику следующие информационные услуги по продвижению:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>размещение бизнес-профиля Заказчика в каталоге фулфилментов на Платформе;</li>
                <li>обеспечение доступности профиля для Пользователей (Селлеров) Платформы;</li>
                <li>передача Заказчику Запросов коммерческих предложений (Лидов) от Селлеров через личный кабинет и/или по электронной почте.</li>
              </ul>
              <p>2.2. Исполнитель не является стороной договора фулфилмент-услуг между Заказчиком и Селлером и не несёт ответственности за его заключение и исполнение.</p>
              <p>2.3. Договор считается заключённым с момента завершения регистрации на Платформе и одобрения профиля Заказчика модератором.</p>
            </Section>

            <Section title="3. Стоимость услуг и порядок расчётов">
              <p>3.1. Размещение профиля в каталоге осуществляется <strong className="text-navy-900">бесплатно</strong>.</p>
              <p>3.2. Услуги по передаче Лидов оказываются на возмездной основе. Стоимость одного Лида (цена лида) устанавливается Исполнителем индивидуально для каждого Заказчика и доводится до его сведения через личный кабинет.</p>
              <p>3.3. Оплата производится в российских рублях в порядке и в сроки, согласованные Сторонами. Исполнитель вправе направить Заказчику счёт на оплату.</p>
              <p>3.4. Обязанность оплаты Лида возникает с момента его поступления в личный кабинет Заказчика вне зависимости от:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>факта ответа Заказчика на запрос;</li>
                <li>факта заключения договора между Заказчиком и Селлером;</li>
                <li>результата переговоров Сторон.</li>
              </ul>
              <p>3.5. Исполнитель вправе изменить цену лида, уведомив Заказчика не менее чем за 7 (семь) календарных дней.</p>
            </Section>

            <Section title="4. Обязательства Исполнителя">
              <p>Исполнитель обязуется:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>обеспечить техническую работоспособность Платформы с целевым уровнем доступности не менее 95% в месяц;</li>
                <li>провести модерацию профиля в срок не более 24 часов с момента подачи заявки;</li>
                <li>уведомлять Заказчика о поступлении новых Лидов;</li>
                <li>обеспечивать конфиденциальность данных Заказчика в соответствии с Политикой конфиденциальности;</li>
                <li>предоставлять техническую поддержку по вопросам, связанным с работой Платформы.</li>
              </ul>
            </Section>

            <Section title="5. Обязательства Заказчика">
              <p>Заказчик обязуется:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>предоставлять достоверную информацию о компании, услугах и тарифах;</li>
                <li>своевременно обновлять информацию в профиле при изменении условий работы;</li>
                <li>соблюдать Условия использования Платформы;</li>
                <li>своевременно оплачивать поступившие Лиды согласно установленному тарифу;</li>
                <li>не использовать контактные данные Селлеров, полученные через Платформу, в целях, не связанных с оказанием фулфилмент-услуг;</li>
                <li>не передавать учётные данные третьим лицам.</li>
              </ul>
            </Section>

            <Section title="6. Ответственность сторон">
              <p>6.1. За нарушение сроков оплаты Заказчик уплачивает Исполнителю пеню в размере 0,1% от неоплаченной суммы за каждый день просрочки.</p>
              <p>6.2. Исполнитель несёт ответственность за качество оказываемых информационных услуг (размещение профиля, передача Лидов) в пределах, предусмотренных настоящей Офертой.</p>
              <p>6.3. Исполнитель не несёт ответственности за:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>качество и наличие фулфилмент-услуг, предоставляемых Заказчиком Селлерам;</li>
                <li>финансовый результат переговоров Заказчика с Селлерами;</li>
                <li>перебои в работе Платформы, вызванные форс-мажорными обстоятельствами или действиями третьих лиц (операторов связи, хостинг-провайдеров).</li>
              </ul>
              <p>6.4. Совокупная ответственность Исполнителя по настоящему договору не может превышать суммы, фактически уплаченной Заказчиком за последние 3 (три) месяца.</p>
            </Section>

            <Section title="7. Конфиденциальность">
              <p>7.1. Стороны обязуются соблюдать конфиденциальность в отношении информации, полученной в рамках исполнения настоящего договора.</p>
              <p>7.2. Обработка персональных данных осуществляется в соответствии с Политикой конфиденциальности, размещённой по адресу <strong className="text-navy-900">fulfillhub.ru/privacy</strong>.</p>
            </Section>

            <Section title="8. Срок действия и расторжение">
              <p>8.1. Договор вступает в силу с момента акцепта Оферты и действует бессрочно.</p>
              <p>8.2. Каждая из Сторон вправе расторгнуть договор в одностороннем порядке, уведомив другую Сторону не менее чем за 30 (тридцать) календарных дней.</p>
              <p>8.3. Расторжение договора не освобождает Заказчика от обязанности оплатить поступившие Лиды.</p>
              <p>8.4. Исполнитель вправе немедленно прекратить оказание услуг (заблокировать профиль) в случае существенного нарушения Заказчиком условий настоящей Оферты или Условий использования.</p>
            </Section>

            <Section title="9. Форс-мажор">
              <p>Стороны освобождаются от ответственности за частичное или полное неисполнение обязательств, если оно явилось следствием обстоятельств непреодолимой силы (стихийные бедствия, действия государственных органов, перебои в работе сетей связи и т.п.), возникших после заключения договора.</p>
            </Section>

            <Section title="10. Применимое право и порядок разрешения споров">
              <p>10.1. К настоящему договору применяется законодательство Российской Федерации.</p>
              <p>10.2. Все споры разрешаются путём переговоров. Претензионный порядок обязателен. Срок ответа на претензию — 30 (тридцать) календарных дней.</p>
              <p>10.3. При невозможности урегулирования спора в досудебном порядке он передаётся на рассмотрение в Арбитражный суд по месту нахождения Исполнителя.</p>
            </Section>

            <Section title="11. Реквизиты Исполнителя">
              <p>ООО «ФулфилХаб»</p>
              <p>Email: <strong className="text-navy-900">support@fulfillhub.ru</strong></p>
              <p>Telegram: <strong className="text-navy-900">@fulfillhub_support</strong></p>
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
