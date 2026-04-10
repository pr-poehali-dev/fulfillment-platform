import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Fulfillment } from "./types";
import { STATUS_CFG } from "./types";

interface AdminFulfillmentListProps {
  fulfillments: Fulfillment[];
  loading: boolean;
  onReload: () => void;
  onEdit: (f: Fulfillment) => void;
}

export default function AdminFulfillmentList({ fulfillments, loading, onReload, onEdit }: AdminFulfillmentListProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    const name = newName.trim() || "Новый фулфилмент";
    setCreating(true);
    try {
      await api.createFulfillment({ company_name: name });
      toast.success("Фулфилмент создан");
      setNewName("");
      onReload();
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось создать");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Create new */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-3 flex items-center gap-2">
          <Icon name="Plus" size={16} className="text-navy-700" />
          Добавить фулфилмент
        </div>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Название фулфилмента..."
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20"
          />
          <Button onClick={handleCreate} disabled={creating}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-11 px-5 flex-shrink-0">
            {creating ? <Icon name="Loader2" size={15} className="animate-spin" /> : <><Icon name="Plus" size={15} className="mr-1.5" />Создать</>}
          </Button>
        </div>
      </div>

      {/* List */}
      {fulfillments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Warehouse" size={28} className="text-gray-400" />
          </div>
          <h3 className="font-golos font-bold text-navy-900 mb-1">Нет фулфилментов</h3>
          <p className="text-sm text-gray-400 font-ibm">Создайте первый фулфилмент, чтобы начать работу</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fulfillments.map((f) => {
            const st = STATUS_CFG[f.status] || STATUS_CFG.draft;
            return (
              <div key={f.id} className={`bg-white rounded-xl border shadow-sm p-5 ${st.border}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Warehouse" size={20} className="text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-golos font-black text-navy-900 text-base leading-tight truncate">
                        {f.company_name || "Без названия"}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <code className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                        FL-{String(f.id).padStart(6, "0")}
                      </code>
                      {f.city && (
                        <span className="text-xs text-gray-400 font-ibm flex items-center gap-1">
                          <Icon name="MapPin" size={10} />{f.city}
                        </span>
                      )}
                      {f.status === "rejected" && f.moderation_comment && (
                        <span className="text-xs text-red-600 font-ibm flex items-center gap-1">
                          <Icon name="AlertCircle" size={10} />
                          {f.moderation_comment}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-ibm line-clamp-1">{f.description || "Описание не добавлено"}</p>
                  </div>
                  <Button size="sm" onClick={() => onEdit(f)}
                    variant="outline"
                    className="border-gray-200 text-gray-700 font-golos font-semibold text-xs h-9 flex-shrink-0">
                    <Icon name="Pencil" size={13} className="mr-1.5" />
                    Редактировать
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
