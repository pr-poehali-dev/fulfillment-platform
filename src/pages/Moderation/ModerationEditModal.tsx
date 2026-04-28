import { useState, useCallback, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Fulfillment } from "@/pages/Admin/types";
import FulfillmentEditTabs, { type EditTab, EDIT_TABS } from "@/pages/Admin/FulfillmentEditTabs";
import { useReadinessCheck } from "@/pages/Admin/FulfillmentReadinessChecklist";

interface ModerationEditModalProps {
  fulfillmentId: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function ModerationEditModal({ fulfillmentId, onClose, onSaved }: ModerationEditModalProps) {
  const [form, setForm] = useState<Fulfillment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTab, setEditTab] = useState<EditTab>("info");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.adminGetFulfillment(fulfillmentId);
      setForm(data.fulfillment || data);
    } catch {
      toast.error("Не удалось загрузить данные");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [fulfillmentId, onClose]);

  useEffect(() => { load(); }, [load]);

  const set = (key: keyof Fulfillment, val: unknown) => {
    setForm((prev) => prev ? { ...prev, [key]: val } : prev);
  };

  const toggleArr = (key: keyof Fulfillment, val: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const arr = (prev[key] as string[]) || [];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  const readiness = useReadinessCheck(form || ({} as Fulfillment));

  const tabMissingCount = (tab: EditTab): number => {
    if (!readiness) return 0;
    const map: Record<EditTab, (keyof typeof readiness.fields)[]> = {
      info: ["company_name", "city", "description"],
      services: ["work_schemes", "marketplaces"],
      pricing: ["storage_price"],
      photos: [],
      preview: [],
    };
    return (map[tab] || []).filter((k) => !readiness.fields[k]).length;
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await api.adminUpdateFulfillment({
        id: form.id,
        company_name: form.company_name,
        inn: form.inn,
        city: form.city,
        address: form.address || "",
        warehouse_area: form.warehouse_area ? Number(form.warehouse_area) : null,
        founded_year: form.founded_year ? Number(form.founded_year) : null,
        description: form.description,
        detailed_description: form.detailed_description,
        work_schemes: form.work_schemes,
        features: form.features,
        packaging_types: form.packaging_types,
        marketplaces: form.marketplaces,
        specializations: form.specializations,
        storage_price: form.storage_price,
        assembly_price: form.assembly_price,
        delivery_price: form.delivery_price,
        min_volume: form.min_volume,
        has_trial: form.has_trial,
        team_size: form.team_size ? Number(form.team_size) : null,
        working_hours: form.working_hours,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        contact_tg: form.contact_tg,
        photos: form.photos,
        badge: form.badge,
        badge_color: form.badge_color,
      });
      toast.success("Карточка сохранена");
      onSaved();
      onClose();
    } catch (err: unknown) {
      const e = err as { error?: string };
      toast.error(e.error || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-navy-900 text-white rounded-xl flex items-center justify-center">
            <Icon name="Pencil" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-golos font-black text-navy-900">
              {loading ? "Загрузка..." : form?.company_name || "Без названия"}
            </div>
            <div className="text-xs text-gray-400 font-ibm">Редактирование карточки · ID {fulfillmentId}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Tabs nav */}
        {!loading && form && (
          <div className="flex gap-1 px-6 pt-3 pb-0 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
            {EDIT_TABS.map((tab) => {
              const missing = tabMissingCount(tab.id);
              const active = editTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setEditTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors relative
                    ${active ? "bg-navy-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <Icon name={tab.icon as Parameters<typeof Icon>[0]["name"]} size={13} />
                  {tab.label}
                  {missing > 0 && (
                    <span className="w-4 h-4 bg-amber-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {missing}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Icon name="Loader2" size={28} className="animate-spin text-navy-400" />
            </div>
          ) : form ? (
            <FulfillmentEditTabs
              form={form}
              editTab={editTab}
              setEditTab={setEditTab}
              tabMissingCount={tabMissingCount}
              set={set}
              toggleArr={toggleArr}
            />
          ) : null}
        </div>

        {/* Footer */}
        {!loading && form && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-navy-900 hover:bg-navy-800 text-white">
              {saving ? (
                <><Icon name="Loader2" size={14} className="animate-spin mr-2" />Сохраняю...</>
              ) : (
                <><Icon name="Save" size={14} className="mr-2" />Сохранить изменения</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}