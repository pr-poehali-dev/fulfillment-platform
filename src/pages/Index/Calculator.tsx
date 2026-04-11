import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PARTNERS, type Partner } from "./data";

// ─── CALCULATOR ──────────────────────────────────────────────────────────────

export function CalculatorSection() {
  const [sku, setSku] = useState(500);
  const [orders, setOrders] = useState(300);
  const [avgItems, setAvgItems] = useState(2);
  const [storageDays, setStorageDays] = useState(30);
  const [needReturns, setNeedReturns] = useState(false);
  const [needSameDay, setNeedSameDay] = useState(false);
  const [needDangerous, setNeedDangerous] = useState(false);
  const [needCameras, setNeedCameras] = useState(false);
  const [reqScheme, setReqScheme] = useState<string[]>([]);
  const [reqMarketplace, setReqMarketplace] = useState<string[]>([]);

  // Contact form state
  const [showForm, setShowForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPartners, setSelectedPartners] = useState<number[]>([]);

  const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");
  const fmtFrom = (n: number) => `от ${fmt(n)} ₽`;

  const toggleScheme = (s: string) =>
    setReqScheme((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleMp = (m: string) =>
    setReqMarketplace((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  const togglePartner = (id: number) =>
    setSelectedPartners((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // Filter matching partners
  const matchingPartners = PARTNERS.filter((p) => {
    if (needReturns && !p.features.includes("returns")) return false;
    if (needSameDay && !p.features.includes("same_day")) return false;
    if (needDangerous && !p.features.includes("dangerous")) return false;
    if (needCameras && !p.features.includes("cameras")) return false;
    if (reqScheme.length && !reqScheme.some((s) => p.workSchemes.includes(s))) return false;
    if (reqMarketplace.length && !reqMarketplace.some((m) => p.tags.includes(m))) return false;
    return true;
  }).sort((a, b) => a.storageRate - b.storageRate);

  // Compute price range from matching
  const calcTotal = (p: Partner) =>
    sku * p.storageRate * storageDays + orders * p.assemblyRate * avgItems + orders * p.deliveryRate;

  const minTotal = matchingPartners.length ? Math.min(...matchingPartners.map(calcTotal)) : 0;
  const avgTotal = matchingPartners.length
    ? matchingPartners.reduce((sum, p) => sum + calcTotal(p), 0) / matchingPartners.length
    : 0;

  const minStorage = matchingPartners.length ? Math.min(...matchingPartners.map((p) => sku * p.storageRate * storageDays)) : 0;
  const minAssembly = matchingPartners.length ? Math.min(...matchingPartners.map((p) => orders * p.assemblyRate * avgItems)) : 0;
  const minDelivery = matchingPartners.length ? Math.min(...matchingPartners.map((p) => orders * p.deliveryRate)) : 0;

  const allSelected = matchingPartners.length > 0 && selectedPartners.length === matchingPartners.length;
  const toggleAll = () =>
    setSelectedPartners(allSelected ? [] : matchingPartners.map((p) => p.id));

  const partnersToRequest = selectedPartners.length > 0
    ? matchingPartners.filter((p) => selectedPartners.includes(p.id))
    : matchingPartners;

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Калькулятор + КП</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Рассчитайте стоимость и получите КП</h2>
          <p className="text-gray-500 font-ibm text-sm mt-1">Укажите параметры — система подберёт подходящих партнёров и отправит им запрос на КП одним нажатием</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: params */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-3">Объёмы</div>
              {[
                { label: "SKU (позиций)", value: sku, setValue: setSku, min: 50, max: 5000, step: 50, suffix: "шт." },
                { label: "Заказов в месяц", value: orders, setValue: setOrders, min: 50, max: 10000, step: 50, suffix: "шт." },
                { label: "Единиц в заказе", value: avgItems, setValue: setAvgItems, min: 1, max: 10, step: 1, suffix: "ед." },
                { label: "Дней хранения", value: storageDays, setValue: setStorageDays, min: 1, max: 30, step: 1, suffix: "дн." },
              ].map(({ label, value, setValue, min, max, step, suffix }) => (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-700 font-golos font-semibold">{label}</span>
                    <span className="text-sm font-bold text-navy-900 font-golos tabular-nums">
                      {value.toLocaleString("ru-RU")} <span className="text-xs text-gray-400 font-normal">{suffix}</span>
                    </span>
                  </div>
                  <Slider value={[value]} onValueChange={(v) => setValue(v[0])} min={min} max={max} step={step} />
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-3">Требования к партнёру</div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 font-ibm mb-2">Схема работы</div>
                <div className="flex gap-2 flex-wrap">
                  {["FBS", "FBO", "DBS"].map((s) => (
                    <button key={s} onClick={() => toggleScheme(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all font-golos ${reqScheme.includes(s) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 font-ibm mb-2">Маркетплейс</div>
                <div className="flex gap-1.5 flex-wrap">
                  {["Wildberries", "Ozon", "Яндекс Маркет", "СберМегаМаркет"].map((m) => (
                    <button key={m} onClick={() => toggleMp(m)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${reqMarketplace.includes(m) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 font-ibm mb-2">Дополнительно</div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: "needReturns", val: needReturns, set: setNeedReturns, label: "Возвраты", icon: "RefreshCw" },
                  { key: "needSameDay", val: needSameDay, set: setNeedSameDay, label: "День в день", icon: "Zap" },
                  { key: "needDangerous", val: needDangerous, set: setNeedDangerous, label: "Опасные грузы", icon: "AlertTriangle" },
                  { key: "needCameras", val: needCameras, set: setNeedCameras, label: "Видеокамеры", icon: "Camera" },
                ].map(({ key, val, set, label, icon }) => (
                  <button key={key} onClick={() => set(!val)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all ${val ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}>
                    <Icon name={icon as "Camera"} size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: price breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-navy-gradient rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Calculator" size={15} className="text-gold-400" />
                <span className="font-golos font-bold text-sm">Ориентировочная стоимость</span>
                <span className="ml-auto text-xs text-white/40 font-ibm">по {matchingPartners.length} партнёрам</span>
              </div>

              {matchingPartners.length === 0 ? (
                <div className="text-center py-6 text-white/40 font-ibm text-sm">
                  <Icon name="SearchX" size={28} className="mx-auto mb-2 opacity-40" />
                  Нет партнёров с такими требованиями
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Хранение", min: minStorage, hint: `${sku} SKU × ${storageDays} дн.` },
                      { label: "Сборка", min: minAssembly, hint: `${orders} заказов × ${avgItems} ед.` },
                      { label: "Доставка", min: minDelivery, hint: `${orders} заказов` },
                    ].map(({ label, min, hint }) => (
                      <div key={label} className="bg-white/10 rounded-lg px-3 py-2.5">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-white/80 font-ibm">{label}</div>
                            <div className="text-xs text-white/35 font-ibm">{hint}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-golos font-bold text-sm">{fmtFrom(min)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/15 pt-3 mb-1">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-white/45 font-ibm">Итого / месяц</div>
                        <div className="text-xs text-white/30 font-ibm">среднее по рынку ~{fmtFrom(avgTotal)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-golos font-black text-gold-gradient leading-none">{fmtFrom(minTotal)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/25 font-ibm mt-2">* На основе минимальных тарифов подходящих партнёров</div>
                </>
              )}
            </div>

            {/* Matching partners list */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-navy-900 font-golos">
                  Подходящие партнёры
                  <span className="ml-1.5 text-xs bg-navy-900 text-white px-1.5 py-0.5 rounded font-ibm">{matchingPartners.length}</span>
                </span>
                {matchingPartners.length > 0 && (
                  <button onClick={toggleAll} className="text-xs text-navy-700 font-ibm hover:underline">
                    {allSelected ? "Снять все" : "Выбрать все"}
                  </button>
                )}
              </div>

              {matchingPartners.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-ibm text-sm">
                  <p>Измените требования</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {matchingPartners.map((p) => {
                    const total = calcTotal(p);
                    const isSelected = selectedPartners.includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? "bg-navy-50" : "hover:bg-gray-100/60"}`}>
                        <div onClick={() => togglePartner(p.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "bg-navy-900 border-navy-900" : "bg-white border-gray-300"}`}>
                          {isSelected && <Icon name="Check" size={10} className="text-white" />}
                        </div>
                        <span className="text-base">{p.logo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-golos font-bold text-navy-900 text-sm truncate">{p.name}</div>
                          <div className="text-xs text-gray-400 font-ibm flex items-center gap-1">
                            <Icon name="MapPin" size={9} />{p.location}
                            {p.workSchemes.map((s) => (
                              <span key={s} className="bg-navy-100 text-navy-700 px-1 rounded text-xs">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-gray-400 font-ibm">от</div>
                          <div className="font-golos font-bold text-navy-900 text-sm tabular-nums">{fmt(total)} ₽</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: request form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {!showForm && !formSent && (
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-3">Запрос на КП</div>
                  <p className="text-sm text-gray-600 font-ibm leading-relaxed mb-4">
                    Отправьте запрос выбранным партнёрам — они пришлют вам персональное коммерческое предложение
                  </p>
                  <div className="bg-navy-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-500 font-ibm mb-1">Будет отправлено</div>
                    <div className="font-golos font-bold text-navy-900 text-lg">{partnersToRequest.length}</div>
                    <div className="text-xs text-gray-500 font-ibm">
                      {partnersToRequest.length === 0 ? "партнёров не выбрано" :
                       partnersToRequest.length === 1 ? "партнёру" :
                       partnersToRequest.length < 5 ? "партнёрам" : "партнёрам"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {partnersToRequest.slice(0, 4).map((p) => (
                        <span key={p.id} className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 font-ibm">{p.logo} {p.name}</span>
                      ))}
                      {partnersToRequest.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 font-ibm">+{partnersToRequest.length - 4}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos h-10"
                    disabled={partnersToRequest.length === 0}
                    onClick={() => setShowForm(true)}
                  >
                    <Icon name="Send" size={14} className="mr-1.5" />Запросить КП
                  </Button>
                  {partnersToRequest.length === 0 && (
                    <p className="text-xs text-gray-400 font-ibm text-center mt-2">Выберите хотя бы одного партнёра</p>
                  )}
                </div>
              )}

              {showForm && !formSent && (
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <button onClick={() => setShowForm(false)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3 font-ibm">
                    <Icon name="ChevronLeft" size={13} />Назад
                  </button>
                  <div className="text-sm font-bold text-navy-900 font-golos mb-4">Ваши контакты</div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Имя <span className="text-red-400">*</span></label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Email <span className="text-red-400">*</span></label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.ru" type="email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Телефон <span className="text-red-400">*</span></label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-500 font-ibm">
                      Запрос уйдёт {partnersToRequest.length} партнёрам: {partnersToRequest.map(p => p.name).join(", ")}
                    </div>
                    <Button
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10"
                      disabled={!name.trim() || !email.trim() || !phone.trim()}
                      onClick={() => setFormSent(true)}
                    >
                      <Icon name="Send" size={14} className="mr-1.5" />Отправить
                    </Button>
                    <p className="text-[11px] text-gray-400 font-ibm text-center leading-relaxed">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">политикой конфиденциальности</a>
                      {" "}и{" "}
                      <a href="/offer" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">обработкой персональных данных</a>
                    </p>
                  </div>
                </div>
              )}

              {formSent && (
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="CheckCircle" size={24} className="text-emerald-600" />
                  </div>
                  <div className="font-golos font-bold text-navy-900 mb-1">Запросы отправлены!</div>
                  <p className="text-xs text-gray-500 font-ibm leading-relaxed mb-3">
                    {partnersToRequest.length} партнёров получат ваш запрос и свяжутся с вами в течение 24 часов на {email}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {partnersToRequest.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                        <span>{p.logo}</span>
                        <span className="text-xs font-ibm text-gray-700 flex-1">{p.name}</span>
                        <Icon name="Check" size={12} className="text-emerald-600" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setFormSent(false); setShowForm(false); setName(""); setEmail(""); setPhone(""); }}
                    className="mt-4 text-xs text-navy-700 font-ibm hover:underline">
                    Новый запрос
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACTS ────────────────────────────────────────────────────────────────

export function ContactsSection() {
  return (
    <section id="contacts" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-widest uppercase font-ibm">Контакты</span>
          </div>
          <h2 className="font-golos font-black text-3xl text-navy-900">Свяжитесь с нами</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {[
              { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail", label: "Email", value: "hello@fulfillhub.ru", sub: "Ответим в течение 2 ч." },
              { icon: "MessageSquare", label: "Telegram", value: "@fulfillhub", sub: "Быстрая связь" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3.5 card-hover">
                <div className="w-9 h-9 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={c.icon as "Phone"} size={16} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-ibm">{c.label}</div>
                  <div className="font-golos font-semibold text-navy-900 text-sm">{c.value}</div>
                  <div className="text-xs text-gray-400 font-ibm">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h3 className="font-golos font-bold text-lg text-navy-900 mb-4">Задайте вопрос</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input placeholder="Имя" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
              <input placeholder="Компания" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20" />
            </div>
            <input type="email" placeholder="Email" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 mb-3" />
            <textarea rows={3} placeholder="Сообщение..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20 resize-none mb-4" />
            <div className="flex items-center gap-4">
              <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos h-10 px-7">
                <Icon name="Send" size={14} className="mr-2" />Отправить
              </Button>
              <p className="text-[11px] text-gray-400 font-ibm leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">политикой конфиденциальности</a>
                {" "}и{" "}
                <a href="/offer" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">обработкой персональных данных</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}