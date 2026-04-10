import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { OwnerProfile } from "./types";

interface AdminOwnerProfileProps {
  profile: OwnerProfile | null;
  loading: boolean;
  userId?: number;
  userEmail?: string;
  onSaved: (p: OwnerProfile) => void;
}

export default function AdminOwnerProfile({ profile, loading, userId, userEmail, onSaved }: AdminOwnerProfileProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<OwnerProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setForm(profile ? { ...profile } : { contact_name: "", contact_email: userEmail || "", contact_phone: "", contact_tg: "", inn: "" });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(null);
  };

  const set = (key: keyof OwnerProfile, val: string) => setForm((f) => f ? { ...f, [key]: val } : f);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await api.updateOwnerProfile({ ...form });
      onSaved(res.profile);
      setEditing(false);
      setForm(null);
      toast.success("Профиль сохранён");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-golos font-black text-navy-900 text-lg leading-tight">
                {profile?.contact_name || "Имя не указано"}
              </h2>
              <p className="text-sm text-gray-400 font-ibm">{userEmail}</p>
            </div>
          </div>
          {!editing && (
            <Button size="sm" variant="outline" onClick={startEdit}
              className="border-gray-200 text-gray-700 font-golos font-semibold text-xs h-9">
              <Icon name="Pencil" size={13} className="mr-1.5" />
              Редактировать
            </Button>
          )}
        </div>

        {/* Profile ID */}
        {userId && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <Icon name="Fingerprint" size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-ibm">ID профиля:</span>
            <code className="text-xs font-mono text-navy-800 font-semibold">PRO-{String(userId).padStart(6, "0")}</code>
          </div>
        )}

        {editing && form ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">ФИО / Имя контактного лица *</label>
                <input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} className={inputCls} placeholder="Иван Иванов" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">ИНН организации</label>
                <input value={form.inn} onChange={(e) => set("inn", e.target.value)} className={inputCls} placeholder="7712345678" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Email</label>
                <input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} type="email" className={inputCls} placeholder="you@company.ru" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Телефон</label>
                <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} type="tel" className={inputCls} placeholder="+7 (999) 123-45-67" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Telegram</label>
                <input value={form.contact_tg} onChange={(e) => set("contact_tg", e.target.value)} className={inputCls} placeholder="@username" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-10 px-6">
                {saving ? <Icon name="Loader2" size={15} className="animate-spin mr-2" /> : <Icon name="Save" size={15} className="mr-2" />}
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button onClick={cancelEdit} variant="outline" disabled={saving}
                className="border-gray-200 text-gray-600 font-golos text-sm h-10 px-5">
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Email", value: profile?.contact_email, icon: "Mail" },
              { label: "Телефон", value: profile?.contact_phone, icon: "Phone" },
              { label: "Telegram", value: profile?.contact_tg, icon: "MessageCircle" },
              { label: "ИНН", value: profile?.inn, icon: "FileText" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon name={icon as "Mail"} size={14} className="text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-400 font-ibm">{label}</div>
                  <div className="text-sm font-semibold text-navy-900 font-ibm truncate">{value || <span className="text-gray-300 font-normal">не указано</span>}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info block */}
      <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 flex items-start gap-3">
        <Icon name="Info" size={16} className="text-navy-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-navy-600 font-ibm leading-relaxed">
          Данные профиля — это ваши персональные контакты как владельца. Они не отображаются в публичном каталоге. Контакты каждого фулфилмента настраиваются отдельно в разделе «Мои фулфилменты».
        </p>
      </div>
    </div>
  );
}
