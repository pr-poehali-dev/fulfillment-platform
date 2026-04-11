import Icon from "@/components/ui/icon";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-golos font-black text-navy-900 text-xl mb-4 pb-2 border-b border-gray-100">{title}</h2>
    <div className="space-y-3 text-gray-600 font-ibm text-sm leading-relaxed">{children}</div>
  </section>
);

export default function Terms() {
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
              <Icon name="FileText" size={13} className="text-gold-400" />
              <span className="text-gold-400 text-xs font-medium font-ibm tracking-wide">Юридические документы</span>
            </div>
            <h1 className="font-golos font-black text-3xl md:text-4xl text-white mb-3">Условия использования</h1>
            <p className="text-white/50 font-ibm text-sm">Редакция от 11 апреля 2026 г.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">

            <Section title="2.1. Общие положения">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Настоящие Условия использования (далее — «Условия») регулируют отношения между Оператором — <strong className="text-navy-900">Кругов Максим Геннадьевич (ИНН: 772379179900)</strong> — и Пользователями платформы FulfillHub (далее — «Платформа»).</li>
                <li>Используя Платформу, Пользователь подтверждает, что ознакомлен и согласен с Условиями. Применимое право — законодательство Российской Федерации.</li>
              </ol>
            </Section>

            <Section title="2.2. Предмет и функционал Платформы">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Платформа предоставляет сервисы: публичный каталог фулфилментов, отправку запросов коммерческих предложений (лидов), калькулятор стоимости, личный кабинет, CMS/CRM для операторов, модерацию профилей.</li>
                <li>Платформа выступает посредником и не является стороной договора оказания фулфилмент‑услуг между селлером и оператором, если иное не предусмотрено отдельным соглашением. Платформа не несёт обязанностей исполнителя услуг фулфилмента, кроме как тех, что явно предусмотрены договором между Платформой и конкретным оператором/селлером.</li>
              </ol>
            </Section>

            <Section title="2.3. Регистрация и аккаунт">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Регистрация выполняется через email + пароль или через Telegram‑авторизацию. При регистрации Пользователь предоставляет достоверные данные и отвечает за сохранность учётных данных.</li>
                <li>Пользователь несёт ответственность за все действия, совершённые через его аккаунт. В случае утраты пароля Пользователь должен немедленно сообщить Оператору и инициировать восстановление.</li>
              </ol>
            </Section>

            <Section title="2.4. Права и обязанности сторон">
              <p><strong className="text-navy-900">Пользователь обязуется:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>использовать Платформу в рамках закона и Условий;</li>
                <li>предоставлять достоверные данные;</li>
                <li>не публиковать запрещённую информацию.</li>
              </ul>
              <p className="mt-3"><strong className="text-navy-900">Оператор обязуется:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>предоставлять сервисы в соответствии с описанным функционалом;</li>
                <li>обеспечивать доступность сервиса;</li>
                <li>обрабатывать персональные данные в соответствии с Политикой конфиденциальности;</li>
                <li>проводить модерацию профилей в разумные сроки.</li>
              </ul>
            </Section>

            <Section title="2.5. Лид-механика и оплата">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Базовый доступ к Платформе и размещение профиля в каталоге осуществляется <strong className="text-navy-900">бесплатно</strong>.</li>
                <li>За каждый Лид (Запрос КП), поступивший Фулфилменту через Платформу, взимается плата согласно индивидуально установленному тарифу. Тариф устанавливается Оператором и доводится до сведения Фулфилмента через личный кабинет.</li>
                <li>Обязанность по оплате возникает с момента поступления Лида в кабинет Фулфилмента вне зависимости от результата переговоров с Селлером.</li>
                <li>Порядок и сроки оплаты определяются договором между Оператором и Фулфилментом.</li>
                <li>Для Селлеров использование Платформы бесплатно.</li>
              </ol>
            </Section>

            <Section title="2.6. Запросы коммерческих предложений">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Селлер вправе направить Запрос КП любому Фулфилменту из каталога, заполнив форму с контактными данными и описанием потребности.</li>
                <li>Отправляя Запрос КП, Селлер даёт согласие на передачу своих контактных данных Фулфилменту, которому адресован запрос.</li>
                <li>Оператор не является стороной переговоров между Селлером и Фулфилментом и не несёт ответственности за их результат.</li>
                <li>Оператор не гарантирует, что Фулфилмент ответит на Запрос КП или заключит договор с Селлером.</li>
              </ol>
            </Section>

            <Section title="2.7. Интеллектуальная собственность">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Все права на Платформу, включая программный код, дизайн, логотипы и тексты, принадлежат Оператору.</li>
                <li>Пользователь сохраняет права на загруженный им контент (описания, фотографии) и предоставляет Оператору неисключительную лицензию на его использование в целях функционирования Платформы.</li>
                <li>Запрещается копирование, воспроизведение или иное использование материалов Платформы без письменного согласия Оператора.</li>
              </ol>
            </Section>

            <Section title="2.8. Ограничение ответственности">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Платформа предоставляется «как есть» (as is). Оператор не гарантирует бесперебойную работу Сервиса.</li>
                <li>Оператор не несёт ответственности за:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>качество фулфилмент‑услуг, предоставляемых Партнёрами;</li>
                    <li>достоверность информации, размещённой Фулфилментами самостоятельно;</li>
                    <li>неисполнение или ненадлежащее исполнение договоров между Фулфилментом и Селлером;</li>
                    <li>убытки Пользователя, возникшие вследствие использования или невозможности использования Платформы.</li>
                  </ul>
                </li>
                <li>Совокупная ответственность Оператора перед Пользователем не может превышать суммы, уплаченной Пользователем за использование Платформы в течение последних 3 месяцев.</li>
              </ol>
            </Section>

            <Section title="2.9. Прекращение доступа">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Пользователь вправе удалить свой аккаунт, направив соответствующий запрос на <strong className="text-navy-900">hello@fulfillhub.ru</strong>.</li>
                <li>Оператор вправе заблокировать или удалить аккаунт в случае нарушения Условий, без предварительного уведомления, если нарушение является существенным.</li>
                <li>Удаление аккаунта не освобождает Пользователя от обязательств по оплате ранее полученных Лидов.</li>
              </ol>
            </Section>

            <Section title="2.10. Изменение Условий">
              <p>Оператор вправе в одностороннем порядке изменять настоящие Условия, размещая актуальную версию на сайте. Продолжение использования Платформы после опубликования изменений означает их принятие. При существенных изменениях Оператор уведомляет Пользователей по электронной почте.</p>
            </Section>

            <Section title="2.11. Контактные данные">
              <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                <p><strong className="text-navy-900">Оператор:</strong> Кругов Максим Геннадьевич (ИНН: 772379179900)</p>
                <p><strong className="text-navy-900">Email:</strong> hello@fulfillhub.ru</p>
                <p><strong className="text-navy-900">Сайт:</strong> fulfillhub.ru</p>
                <p><strong className="text-navy-900">Вопросы по данным:</strong> privacy@fulfillhub.ru</p>
              </div>
            </Section>

          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="/privacy" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-700 hover:border-navy-300 transition-colors font-golos">Политика конфиденциальности</a>
            <a href="/offer" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-navy-700 hover:border-navy-300 transition-colors font-golos">Публичная оферта</a>
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
