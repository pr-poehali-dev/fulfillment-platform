import { useState, useCallback, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Fulfillment } from "@/pages/Admin/types";
import { EMPTY_FULFILLMENT } from "@/pages/Admin/types";
import FulfillmentEditTabs, { type EditTab } from "@/pages/Admin/FulfillmentEditTabs";
import { useReadinessCheck } from "@/pages/Admin/FulfillmentReadinessChecklist";

interface ModerationEditModalProps {
  fulfillmentId: number;
  onClose: () => void;
  onSaved: () => void;
}

// Нормализация данных с бэкенда: числа -> строки (для FulfillmentEditTabs)
function normalize(raw: Record<string, unknown>): Fulfillment {
  return {
    ...EMPTY_FULFILLMENT,
    ...raw,
    id: Number(raw.id || 0),
    warehouse_area: raw.warehouse_area != null ? String(raw.warehouse_area) : "",
    founded_year: raw.founded_year != null ? String(raw.founded_year) : "",
    storage_price: raw.storage_price != null ? String(raw.storage_price) : "",
    assembly_price: raw.assembly_price != null ? String(raw.assembly_price) : "",
    delivery_price: raw.delivery_price != null ? String(raw.delivery_price) : "",
    min_volume: raw.min_volume != null ? String(raw.min_volume) : "",
    team_size: raw.team_size != null ? String(raw.team_size) : "",
    work_schemes: (raw.work_schemes as string[]) || [],
    features: (raw.features as string[]) || [],
    packaging_types: (raw.packaging_types as string[]) || [],
    marketplaces: (raw.marketplaces as string[]) || [],
    specializations: (raw.specializations as string[]) || [],
    photos: (raw.photos as string[]) || [],
    certificates: (raw.certificates as string[]) || [],
    services: (raw.services as unknown[]) || [],
    has_trial: !!raw.has_trial,
    created_at: String(raw.created_at || ""),
    updated_at: String(raw.updated_at || ""),
  } as Fulfillment;
}

export default function ModerationEditModal({ fulfillmentId, onClose, onSaved }: ModerationEditModalProps) {
  const [form, setForm] = useState<Fulfillment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTab, setEditTab] = useState<EditTab>("info");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [currentOwnerEmail, setCurrentOwnerEmail] = useState("");
  const [showModeratorPanel, setShowModeratorPanel] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.adminGetFulfillment(fulfillmentId);
      const raw = (data.fulfillment || data) as Record<string, unknown>;
      setForm(normalize(raw));
      const oe = (data.owner_email as string) || "";
      setCurrentOwnerEmail(oe);
      setOwnerEmail(oe);
    } catch (err: unknown) {
      const e = err as { error?: string; status?: number };
      console.error("ModerationEditModal load error:", err);
      toast.error(e.error || `Не удалось загрузить данные${e.status ? ` (${e.status})` : ""}`);
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

  const readiness = useReadinessCheck(form || (EMPTY_FULFILLMENT as Fulfillment));

  const tabMissingCount = (tab: EditTab): number => {
    return readiness.items.filter((i) => i.tab === tab && !i.done).length;
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
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
        website_url: form.website_url || "",
        og_image: form.og_image || "",
      };
      const trimmedOwner = ownerEmail.trim().toLowerCase();
      if (trimmedOwner && trimmedOwner !== currentOwnerEmail.toLowerCase()) {
        payload.owner_email = trimmedOwner;
      }
      await api.adminUpdateFulfillment(payload);
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

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Icon name="Loader2" size={28} className="animate-spin text-navy-400" />
            </div>
          ) : form ? (
            <>
              {/* Модераторская панель */}
              <div className="mb-5 bg-amber-50/60 border border-amber-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowModeratorPanel((v) => !v)}
                  className="w-full px-4 py-3 flex items-center gap-2 hover:bg-amber-100/60 transition-colors"
                >
                  <Icon name="Shield" size={14} className="text-amber-700" />
                  <span className="text-xs font-bold font-golos text-amber-900 uppercase tracking-wide">
                    Поля модератора
                  </span>
                  <span className="text-[11px] text-amber-700 font-ibm">видны только админам</span>
                  <Icon
                    name={showModeratorPanel ? "ChevronUp" : "ChevronDown"}
                    size={14}
                    className="ml-auto text-amber-700"
                  />
                </button>
                {showModeratorPanel && (
                  <div className="px-4 pb-4 pt-1 space-y-3">
                    {/* Сайт */}
                    <div>
                      <label className="text-xs font-semibold text-amber-900 font-ibm block mb-1.5">
                        Сайт фулфилмента
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={form.website_url || ""}
                          onChange={(e) => set("website_url", e.target.value)}
                          placeholder="https://example.com"
                          className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                        {form.website_url && (
                          <a
                            href={form.website_url.startsWith("http") ? form.website_url : `https://${form.website_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg text-xs font-medium font-golos flex items-center gap-1"
                          >
                            <Icon name="ExternalLink" size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-700 font-ibm mt-1">
                        OG-картинка с сайта подгрузится автоматически при сохранении и будет использована,
                        если не загружено ни одного фото.
                      </p>
                      {form.og_image && (
                        <div className="mt-2 flex items-center gap-2 bg-white border border-amber-200 rounded-lg p-2">
                          <img
                            src={form.og_image}
                            alt="OG preview"
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-amber-900 font-golos">OG-картинка</div>
                            <div className="text-[10px] text-amber-700 font-ibm truncate" title={form.og_image}>
                              {form.og_image}
                            </div>
                          </div>
                          <button
                            onClick={() => set("og_image", "")}
                            className="p-1 text-amber-500 hover:text-red-500 transition-colors"
                            title="Удалить OG"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Владелец */}
                    <div>
                      <label className="text-xs font-semibold text-amber-900 font-ibm block mb-1.5">
                        Email владельца
                      </label>
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="owner@example.com"
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <p className="text-[11px] text-amber-700 font-ibm mt-1">
                        Текущий: <span className="font-semibold">{currentOwnerEmail || "не задан"}</span>.
                        Чтобы передать карточку, введите email уже зарегистрированного пользователя.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <FulfillmentEditTabs
                form={form}
                editTab={editTab}
                setEditTab={setEditTab}
                tabMissingCount={tabMissingCount}
                set={set}
                toggleArr={toggleArr}
              />
            </>
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