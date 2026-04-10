import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Fulfillment } from "./types";
import { STATUS_CFG } from "./types";
import FulfillmentEditTabs, { type EditTab } from "./FulfillmentEditTabs";
import FulfillmentReadinessChecklist, { useReadinessCheck } from "./FulfillmentReadinessChecklist";

interface AdminFulfillmentEditProps {
  fulfillment: Fulfillment;
  onBack: () => void;
  onSaved: (f: Fulfillment) => void;
}

export default function AdminFulfillmentEdit({ fulfillment, onBack, onSaved }: AdminFulfillmentEditProps) {
  const [editTab, setEditTab] = useState<EditTab>("info");
  const [form, setForm] = useState<Fulfillment>({ ...fulfillment });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const formRef = useRef(form);
  const isDirtyRef = useRef(false);

  // Отслеживаем изменения формы
  useEffect(() => {
    formRef.current = form;
    isDirtyRef.current = true;
  }, [form]);

  const st = STATUS_CFG[form.status] || STATUS_CFG.draft;
  const readiness = useReadinessCheck(form);

  const buildPayload = (f: Fulfillment) => ({
    id: f.id,
    company_name: f.company_name,
    city: f.city,
    warehouse_area: f.warehouse_area ? Number(f.warehouse_area) : null,
    founded_year: f.founded_year ? Number(f.founded_year) : null,
    description: f.description,
    detailed_description: f.detailed_description,
    work_schemes: f.work_schemes,
    features: f.features,
    packaging_types: f.packaging_types,
    marketplaces: f.marketplaces,
    specializations: f.specializations,
    storage_price: f.storage_price ? Number(f.storage_price) : null,
    assembly_price: f.assembly_price ? Number(f.assembly_price) : null,
    delivery_price: f.delivery_price ? Number(f.delivery_price) : null,
    min_volume: f.min_volume ? Number(f.min_volume) : null,
    has_trial: f.has_trial,
    team_size: f.team_size ? Number(f.team_size) : null,
    working_hours: f.working_hours,
    photos: f.photos,
  });

  const autoSave = useCallback(async () => {
    if (!isDirtyRef.current) return;
    if (formRef.current.status !== "draft" && formRef.current.status !== "rejected") return;
    isDirtyRef.current = false;
    setAutoSaveStatus("saving");
    try {
      await api.updateFulfillment(buildPayload(formRef.current));
      setAutoSaveStatus("saved");
      setLastSavedAt(new Date());
      onSaved({ ...formRef.current });
    } catch {
      setAutoSaveStatus("error");
      isDirtyRef.current = true;
    }
  }, [onSaved]);

  // Таймер автосохранения каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(autoSave, 30_000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const set = (key: keyof Fulfillment, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArr = (key: keyof Fulfillment, val: string) => {
    const arr = (form[key] as string[]) || [];
    set(key, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSave = async () => {
    setSaving(true);
    isDirtyRef.current = false;
    try {
      await api.updateFulfillment(buildPayload(form));
      toast.success("Изменения сохранены");
      setAutoSaveStatus("saved");
      setLastSavedAt(new Date());
      onSaved({ ...form });
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось сохранить");
      isDirtyRef.current = true;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitFulfillment(form.id);
      toast.success("Отправлено на модерацию. Ответ в течение 24 часов.");
      onSaved({ ...form, status: "pending" });
      setForm((f) => ({ ...f, status: "pending" }));
    } catch (err: unknown) {
      const e = err as { error?: string; message?: string };
      toast.error(e.error || e.message || "Не удалось отправить на модерацию");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!confirm("Закрыть фулфилмент? Он будет скрыт из каталога.")) return;
    setClosing(true);
    try {
      await api.closeFulfillment(form.id);
      toast.success("Фулфилмент закрыт");
      onSaved({ ...form, status: "closed" });
      setForm((f) => ({ ...f, status: "closed" }));
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Не удалось закрыть");
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Topbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 font-golos transition-colors">
          <Icon name="ArrowLeft" size={16} />
          Назад к списку
        </button>
        <div className="flex-1" />
        {/* Индикатор автосохранения */}
        {(form.status === "draft" || form.status === "rejected") && autoSaveStatus !== "idle" && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-ibm ${
            autoSaveStatus === "saving" ? "text-gray-400" :
            autoSaveStatus === "saved"  ? "text-emerald-600" :
            "text-red-500"
          }`}>
            {autoSaveStatus === "saving" && <Icon name="Loader2" size={12} className="animate-spin" />}
            {autoSaveStatus === "saved"  && <Icon name="Check" size={12} />}
            {autoSaveStatus === "error"  && <Icon name="AlertCircle" size={12} />}
            {autoSaveStatus === "saving" && "Сохранение..."}
            {autoSaveStatus === "saved" && lastSavedAt && `Сохранено в ${lastSavedAt.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}`}
            {autoSaveStatus === "error"  && "Не сохранено"}
          </span>
        )}
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
        <code className="text-xs font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
          FL-{String(form.id).padStart(6, "0")}
        </code>
      </div>

      {/* Status banner */}
      {(form.status === "rejected" || form.status === "pending" || form.status === "approved") && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${st.bg} ${st.border}`}>
          <Icon
            name={form.status === "approved" ? "CheckCircle" : form.status === "rejected" ? "XCircle" : "Clock"}
            size={16} className={`${st.text} mt-0.5 flex-shrink-0`}
          />
          <div className="flex-1">
            <p className={`text-sm font-semibold font-golos ${st.text}`}>{st.label}</p>
            <p className="text-xs text-gray-600 font-ibm mt-0.5">
              {form.status === "approved" && "Ваш фулфилмент опубликован в каталоге и виден клиентам."}
              {form.status === "rejected" && "Фулфилмент отклонён модератором. Внесите правки и отправьте повторно."}
              {form.status === "pending"  && "Фулфилмент на проверке. Обычно до 24 часов."}
            </p>
            {form.status === "rejected" && form.moderation_comment && (
              <p className="text-xs text-red-700 font-ibm mt-1 font-semibold">Комментарий: {form.moderation_comment}</p>
            )}
          </div>
        </div>
      )}

      {/* Вкладки редактирования */}
      <FulfillmentEditTabs
        form={form}
        editTab={editTab}
        setEditTab={setEditTab}
        tabMissingCount={(tabId) => readiness.items.filter((i) => i.tab === tabId && !i.done).length}
        set={set}
        toggleArr={toggleArr}
      />

      {/* Чеклист готовности */}
      <FulfillmentReadinessChecklist
        form={form}
        readiness={readiness}
        onGoToTab={setEditTab}
      />

      {/* Action bar */}
      <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 md:-mx-6 px-4 md:px-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-3 max-w-4xl">
          <Button onClick={handleSave} disabled={saving}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-11 px-8">
            {saving ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="Save" size={16} className="mr-2" />}
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>

          {(form.status === "draft" || form.status === "rejected") && (
            <Button onClick={handleSubmit} disabled={submitting}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos text-sm h-11 px-8">
              {submitting ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : <Icon name="Send" size={16} className="mr-2" />}
              Отправить на модерацию
            </Button>
          )}

          {form.status === "pending" && (
            <span className="text-xs text-amber-700 font-ibm flex items-center gap-1.5">
              <Icon name="Clock" size={13} />На модерации
            </span>
          )}
          {(form.status === "approved" || form.status === "active") && (
            <span className="text-xs text-emerald-700 font-ibm flex items-center gap-1.5">
              <Icon name="CheckCircle" size={13} />Опубликован в каталоге
            </span>
          )}

          {form.status !== "closed" && (
            <button onClick={handleClose} disabled={closing}
              className="ml-auto text-xs text-gray-400 hover:text-red-500 font-ibm transition-colors flex items-center gap-1.5">
              <Icon name="Archive" size={13} />
              {closing ? "Закрываю..." : "Закрыть фулфилмент"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
