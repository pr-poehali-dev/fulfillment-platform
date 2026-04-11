import Icon from "@/components/ui/icon";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-golos font-black text-navy-900 text-xl mb-4 pb-2 border-b border-gray-100">{title}</h2>
    <div className="space-y-3 text-gray-600 font-ibm text-sm leading-relaxed">{children}</div>
  </section>
);

export default function Privacy() {
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
              <Icon name="ShieldCheck" size={13} className="text-gold-400" />
              <span className="text-gold-400 text-xs font-medium font-ibm tracking-wide">Юридические документы</span>
            </div>
            <h1 className="font-golos font-black text-3xl md:text-4xl text-white mb-3">Политика конфиденциальности</h1>
            <p className="text-white/50 font-ibm text-sm">Редакция от 11 апреля 2026 г.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">

            <Section title="1.1. Общие сведения">
              <p>Настоящий документ определяет порядок и основания обработки персональных данных Пользователей платформы FulfillHub (далее — «Платформа»). Подробнее: сбор, цели, права, сроки хранения, меры безопасности.</p>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>Полное наименование оператора персональных данных: <strong className="text-navy-900">Кругов Максим Геннадьевич, ИНН: 772379179900</strong>, зарегистрированный в качестве самозанятого (далее — «Оператор»). Контактный email: <strong className="text-navy-900">hello@fulfillhub.ru</strong>.</li>
                <li>Платформа: <strong className="text-navy-900">FulfillHub</strong>, сайт: fulfillhub.ru.</li>
                <li>Контакт для вопросов по персональным данным: <strong className="text-navy-900">privacy@fulfillhub.ru</strong>.</li>
              </ol>
              <p className="mt-2">Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
            </Section>

            <Section title="1.2. Термины">
              <ol className="list-decimal pl-5 space-y-2">
                <li>«Персональные данные» — любая информация, относящаяся к прямо или косвенно определяемому физическому лицу (включая ФИО, email, телефон, IP и др.).</li>
                <li>«Пользователь» — физическое лицо (представитель юридического лица или ИП), предоставляющее данные при использовании платформы.</li>
                <li>«Обработка» — любые действия с персональными данными (сбор, хранение, передача и пр.).</li>
              </ol>
            </Section>

            <Section title="1.3. Какие данные мы собираем">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-navy-900">О лице (представителе компании):</strong> ФИО, email, телефон, должность, Telegram username/ID (если привязан), IP‑адрес, даты и время входов.</li>
                <li><strong className="text-navy-900">О компании (для профиля фулфилмента):</strong> наименование организации, ИНН, город/адрес склада, площадь, год основания, состав команды, режим работы, описание услуг, тарифы, фотографии склада и логотип.</li>
                <li><strong className="text-navy-900">Данные заявок (RFQ):</strong> наименование компании‑заказчика, контактные данные, объём бизнеса (SKU, заказы/мес), сообщение.</li>
                <li><strong className="text-navy-900">Технические данные:</strong> логи доступа, User Agent, сведения о сессиях.</li>
                <li>Прочие данные, которые пользователь предоставляет добровольно (переписка в чате поддержки и т.д.).</li>
              </ul>
            </Section>

            <Section title="1.4. Цели обработки персональных данных">
              <ul className="list-disc pl-5 space-y-1">
                <li>Регистрация и идентификация Пользователя, поддержка аккаунта и доступ к функционалу.</li>
                <li>Обеспечение работы функционала (отправка лидов, уведомления, коммуникация между селлером и фулфилментом).</li>
                <li>Формирование и отображение бизнес-профилей фулфилментов в каталоге.</li>
                <li>Модерация профилей фулфилментов администрацией Платформы.</li>
                <li>Отправка транзакционных email-уведомлений (коды подтверждения, уведомления о заявках).</li>
                <li>Обработка обращений в службу поддержки.</li>
                <li>Соблюдение требований законодательства Российской Федерации.</li>
              </ul>
            </Section>

            <Section title="1.5. Правовые основания обработки">
              <p>Обработка персональных данных осуществляется на следующих основаниях:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Согласие субъекта персональных данных (ст. 6, ч. 1, п. 1 ФЗ № 152).</li>
                <li>Исполнение договора, стороной которого является субъект персональных данных (ст. 6, ч. 1, п. 5 ФЗ № 152).</li>
                <li>Законные интересы Оператора, не нарушающие права и свободы субъекта (ст. 6, ч. 1, п. 7 ФЗ № 152).</li>
              </ul>
            </Section>

            <Section title="1.6. Хранение, защита и сроки">
              <p>Персональные данные хранятся на серверах, расположенных на территории Российской Федерации, в соответствии с требованиями ст. 18.1 ФЗ № 152-ФЗ.</p>
              <p>Оператор принимает необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Пароли хранятся исключительно в хэшированном виде.</li>
                <li>Передача данных осуществляется по защищённому протоколу HTTPS.</li>
                <li>Доступ к данным ограничен уполномоченными лицами.</li>
                <li>Файлы и фотографии хранятся в защищённом S3-совместимом хранилище.</li>
              </ul>
              <p>Данные хранятся в течение срока действия аккаунта и 3 лет после его удаления, если иное не предусмотрено законодательством.</p>
            </Section>

            <Section title="1.7. Передача данных третьим лицам">
              <p>Оператор не продаёт и не передаёт персональные данные третьим лицам, за исключением следующих случаев:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-navy-900">Между участниками Платформы:</strong> контактные данные из запроса КП (лида) передаются фулфилменту, которому адресован запрос. Селлер даёт явное согласие на такую передачу.</li>
                <li><strong className="text-navy-900">Инфраструктурные партнёры:</strong> хостинг‑провайдер и поставщик облачных сервисов обрабатывают данные исключительно по поручению Оператора.</li>
                <li><strong className="text-navy-900">По требованию закона:</strong> при наличии законного требования уполномоченных государственных органов.</li>
              </ul>
            </Section>

            <Section title="1.8. Права субъекта персональных данных">
              <p>В соответствии с ФЗ № 152-ФЗ вы имеете право:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Получить информацию об обработке ваших персональных данных.</li>
                <li>Потребовать уточнения, блокирования или уничтожения персональных данных.</li>
                <li>Отозвать согласие на обработку персональных данных.</li>
                <li>Обжаловать действия Оператора в Роскомнадзоре или в суде.</li>
              </ul>
              <p>Для реализации прав направьте запрос по адресу: <strong className="text-navy-900">privacy@fulfillhub.ru</strong></p>
            </Section>

            <Section title="1.9. Cookies и локальное хранилище">
              <p>Платформа использует localStorage браузера для хранения токена авторизации. Cookies для целей авторизации не используются. Платформа не использует файлы cookie для отслеживания поведения пользователей в рекламных целях.</p>
              <p>На сайте может использоваться Яндекс.Метрика для статистики посещаемости. Сервис работает в соответствии с политикой конфиденциальности Яндекса.</p>
            </Section>

            <Section title="1.10. Изменения Политики">
              <p>Оператор вправе вносить изменения в настоящую Политику. При существенных изменениях пользователи уведомляются по электронной почте. Актуальная версия Политики всегда доступна по адресу <strong className="text-navy-900">fulfillhub.ru/privacy</strong>.</p>
            </Section>

            <Section title="1.11. Контактные данные оператора">
              <p>По вопросам обработки персональных данных обращайтесь:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Оператор: <strong className="text-navy-900">Кругов Максим Геннадьевич</strong> (ИНН: 772379179900)</li>
                <li>Email: <strong className="text-navy-900">privacy@fulfillhub.ru</strong></li>
                <li>Общий email: <strong className="text-navy-900">hello@fulfillhub.ru</strong></li>
              </ul>
            </Section>

          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/terms" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-700 hover:border-navy-300 transition-colors font-golos">Условия использования</a>
            <a href="/offer" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-700 hover:border-navy-300 transition-colors font-golos">Публичная оферта</a>
          </div>
        </div>

        <footer className="bg-navy-900 text-white py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/25 font-ibm">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
                  <Icon name="Package" size={12} className="text-navy-950" />
                </div>
                <span className="text-white/50 font-golos font-bold">FulfillHub</span>
              </div>
              <span>© 2026 FulfillHub. Все права защищены.</span>
              <span className="hidden md:inline text-white/15">·</span>
              <span>Самозанятый Кругов М. Г. ИНН: 772379179900</span>
              <span className="hidden md:inline text-white/15">·</span>
              <a href="mailto:hello@fulfillhub.ru" className="hover:text-white/50 transition-colors">hello@fulfillhub.ru</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-white/50 transition-colors">Политика конфиденциальности</a>
              <a href="/terms" className="hover:text-white/50 transition-colors">Условия использования</a>
              <a href="/offer" className="hover:text-white/50 transition-colors">Оферта</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}