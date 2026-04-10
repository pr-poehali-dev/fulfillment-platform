import Icon from "@/components/ui/icon";
import type { Fulfillment } from "./types";
import type { EditTab } from "./FulfillmentEditTabs";

export interface CheckItem {
  label: string;
  done: boolean;
  tab: EditTab;
  hint?: string;
}

export function useReadinessCheck(form: Fulfillment): { items: CheckItem[]; score: number; ready: boolean } {
  const items: CheckItem[] = [
    { label: "Название компании",        done: !!form.company_name?.trim(),                     tab: "info"     },
    { label: "Город",                    done: !!form.city?.trim(),                              tab: "info"     },
    { label: "Краткое описание",         done: form.description?.trim().length >= 30,            tab: "info",     hint: "Минимум 30 символов" },
    { label: "Схема работы (FBS/FBO/…)", done: form.work_schemes?.length > 0,                   tab: "services" },
    { label: "Маркетплейсы",             done: form.marketplaces?.length > 0,                   tab: "services" },
    { label: "Хотя бы одна особенность", done: form.features?.length > 0,                       tab: "services" },
    { label: "Стоимость хранения",       done: !!form.storage_price?.toString().trim(),          tab: "pricing"  },
    { label: "Стоимость сборки",         done: !!form.assembly_price?.toString().trim(),         tab: "pricing"  },
    { label: "Фотографии (хотя бы 1)",   done: form.photos?.length > 0,                         tab: "photos",   hint: "Фото склада или производства" },
  ];
  const score = items.filter((i) => i.done).length;
  return { items, score, ready: score === items.length };
}

interface FulfillmentReadinessChecklistProps {
  form: Fulfillment;
  readiness: ReturnType<typeof useReadinessCheck>;
  onGoToTab: (tab: EditTab) => void;
}

export default function FulfillmentReadinessChecklist({ form, readiness, onGoToTab }: FulfillmentReadinessChecklistProps) {
  if (form.status !== "draft" && form.status !== "rejected") return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-golos font-bold text-navy-900 text-sm flex items-center gap-2">
          <Icon name="ClipboardCheck" size={15} className="text-navy-600" />
          Готовность к публикации
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${readiness.ready ? "bg-emerald-500" : "bg-amber-400"}`}
              style={{ width: `${(readiness.score / readiness.items.length) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-bold font-golos ${readiness.ready ? "text-emerald-600" : "text-amber-600"}`}>
            {readiness.score}/{readiness.items.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {readiness.items.map((item) => (
          <button
            key={item.label}
            onClick={() => !item.done && onGoToTab(item.tab)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              item.done
                ? "bg-emerald-50 cursor-default"
                : "bg-amber-50 hover:bg-amber-100 cursor-pointer"
            }`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-500" : "bg-amber-200"}`}>
              {item.done
                ? <Icon name="Check" size={10} className="text-white" />
                : <Icon name="Minus" size={10} className="text-amber-600" />
              }
            </div>
            <div className="min-w-0">
              <span className={`text-xs font-medium font-golos ${item.done ? "text-emerald-700" : "text-amber-800"}`}>
                {item.label}
              </span>
              {!item.done && item.hint && (
                <span className="text-xs text-amber-600 font-ibm block leading-none mt-0.5">{item.hint}</span>
              )}
            </div>
            {!item.done && (
              <Icon name="ArrowRight" size={12} className="text-amber-500 ml-auto flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {readiness.ready && (
        <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <Icon name="CheckCircle" size={14} className="text-emerald-600 flex-shrink-0" />
          <p className="text-xs text-emerald-700 font-golos font-semibold">
            Всё заполнено — можно отправлять на модерацию!
          </p>
        </div>
      )}
    </div>
  );
}
