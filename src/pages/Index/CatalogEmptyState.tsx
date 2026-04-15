import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const MOCK_CARDS = [
  { name: "МегаФулфилмент", city: "Москва", schemes: ["FBS", "FBO"], mps: ["Wildberries", "Ozon"], storage: "от 8 ₽", assembly: "от 15 ₽" },
  { name: "СкладПро", city: "Санкт-Петербург", schemes: ["FBS", "DBS"], mps: ["Яндекс Маркет", "Wildberries"], storage: "от 10 ₽", assembly: "от 18 ₽" },
  { name: "LogiHub", city: "Екатеринбург", schemes: ["FBO"], mps: ["Ozon", "СберМегаМаркет"], storage: "от 7 ₽", assembly: "от 12 ₽" },
  { name: "FastStock", city: "Новосибирск", schemes: ["FBS", "FBO", "DBS"], mps: ["Wildberries", "Ali"], storage: "от 9 ₽", assembly: "от 20 ₽" },
];

function MockCard({ name, city, schemes, mps, storage, assembly }: typeof MOCK_CARDS[0]) {
  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden select-none">
      {/* Blur overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-white/40 flex flex-col items-center justify-center gap-2">
        <span className="bg-navy-900 text-white text-xs font-semibold font-golos px-3 py-1 rounded-full shadow">Скоро</span>
      </div>

      {/* Card content (blurred behind overlay) */}
      <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-4 space-y-3">
        <div>
          <div className="font-golos font-bold text-navy-900 text-base">{name}</div>
          <div className="text-xs text-gray-500 font-ibm flex items-center gap-1 mt-0.5">
            <Icon name="MapPin" size={11} className="text-gray-400" />{city}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {schemes.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 bg-navy-50 text-navy-700 border border-navy-100 rounded font-ibm font-medium">{s}</span>
          ))}
          {mps.map((mp) => (
            <span key={mp} className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 rounded font-ibm">{mp}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
          <div>
            <div className="text-[10px] text-gray-400 font-ibm">Хранение</div>
            <div className="text-sm font-semibold text-navy-900 font-golos">{storage}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-ibm">Сборка</div>
            <div className="text-sm font-semibold text-navy-900 font-golos">{assembly}</div>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-gray-100 rounded-lg" />
          <div className="flex-1 h-9 bg-navy-50 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function CatalogEmptyState() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Banner */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-32 h-32 bg-gold-500/10 rounded-full" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-ibm px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Каталог формируется
          </div>
          <h2 className="font-golos font-bold text-2xl md:text-3xl mb-2 leading-tight">
            Мы добавляем лучших<br />фулфилмент-партнёров
          </h2>
          <p className="text-white/70 font-ibm text-sm leading-relaxed mb-6">
            Уже ведём переговоры с проверенными операторами из Москвы, СПб, Екатеринбурга и других городов. Оставьте email — сообщим первым, когда каталог откроется.
          </p>

          {sent ? (
            <div className="flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-3 text-emerald-300 font-ibm text-sm">
              <Icon name="CheckCircle" size={18} className="flex-shrink-0" />
              Отлично! Пришлём уведомление на <span className="font-semibold text-white ml-1">{email}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-ibm text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos px-6 h-10 shrink-0 disabled:opacity-60"
              >
                {loading ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <>Уведомить меня <Icon name="ArrowRight" size={14} className="ml-1" /></>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Mock cards grid */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 font-ibm">
          Примерный вид каталога — партнёры скоро появятся здесь
        </p>
        <a href="/for-fulfillment" className="inline-flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700 font-semibold font-ibm">
          Разместить фулфилмент <Icon name="ArrowRight" size={12} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_CARDS.map((card) => (
          <MockCard key={card.name} {...card} />
        ))}
      </div>
    </div>
  );
}
