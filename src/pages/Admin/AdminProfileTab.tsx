import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Profile } from "./types";
import {
  WORK_SCHEME_OPTIONS,
  FEATURE_OPTIONS,
  SPECIALIZATION_OPTIONS,
  MARKETPLACE_OPTIONS,
} from "./types";

interface AdminProfileTabProps {
  profile: Profile;
  setProfile: (p: Profile) => void;
  profileLoading: boolean;
  profileStatus: string;
  statusCfg: { label: string; bg: string; text: string; dot: string };
  moderationComment?: string;
  onReload: () => void;
}

export default function AdminProfileTab({
  profile,
  setProfile,
  profileLoading,
  profileStatus,
  statusCfg,
  moderationComment,
  onReload,
}: AdminProfileTabProps) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Profile, val: unknown) => setProfile({ ...profile, [key]: val });

  const toggleArr = (key: keyof Profile, val: string) => {
    const arr = (profile[key] as string[]) || [];
    set(key, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        company_name: profile.company_name,
        inn: profile.inn,
        city: profile.city,
        warehouse_area: profile.warehouse_area ? Number(profile.warehouse_area) : null,
        founded_year: profile.founded_year ? Number(profile.founded_year) : null,
        description: profile.description,
        detailed_description: profile.detailed_description,
        contact_name: profile.contact_name,
        contact_email: profile.contact_email,
        contact_phone: profile.contact_phone,
        contact_tg: profile.contact_tg,
        work_schemes: profile.work_schemes,
        features: profile.features,
        packaging_types: profile.packaging_types,
        marketplaces: profile.marketplaces,
        specializations: profile.specializations,
        storage_price: profile.storage_price ? Number(profile.storage_price) : null,
        assembly_price: profile.assembly_price ? Number(profile.assembly_price) : null,
        delivery_price: profile.delivery_price ? Number(profile.delivery_price) : null,
        min_volume: profile.min_volume ? Number(profile.min_volume) : null,
        has_trial: profile.has_trial,
        team_size: profile.team_size ? Number(profile.team_size) : null,
        working_hours: profile.working_hours,
        photos: profile.photos,
      });
      toast.success("Профиль сохранён");
      onReload();
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForModeration = async () => {
    setSaving(true);
    try {
      await api.submitForModeration();
      toast.success("Профиль отправлен на модерацию. Ответ в течение 24 часов.");
      onReload();
    } catch (err: unknown) {
      const e = err as { error?: string; message?: string };
      toast.error(e.error || e.message || "Не удалось отправить на модерацию");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (profile.photos.length >= 10) {
      toast.error("Максимум 10 фотографий");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Загружайте только изображения");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(",")[1];
      const result = await api.uploadPhoto(base64, file.type);
      const url = result.url || result.photo_url;
      if (url) {
        set("photos", [...profile.photos, url]);
        toast.success("Фото загружено");
      }
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    set("photos", profile.photos.filter((_, i) => i !== index));
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/20";

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icon name="Loader2" size={28} className="text-navy-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Status banner */}
      <div className={`rounded-xl border p-4 flex items-start gap-3 ${
        profileStatus === "approved" ? "bg-emerald-50 border-emerald-200" :
        profileStatus === "rejected" ? "bg-red-50 border-red-200" :
        profileStatus === "pending" ? "bg-amber-50 border-amber-200" :
        "bg-gray-50 border-gray-200"
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          profileStatus === "approved" ? "bg-emerald-100" :
          profileStatus === "rejected" ? "bg-red-100" :
          profileStatus === "pending" ? "bg-amber-100" :
          "bg-gray-100"
        }`}>
          <Icon
            name={profileStatus === "approved" ? "CheckCircle" : profileStatus === "rejected" ? "XCircle" : profileStatus === "pending" ? "Clock" : "FileEdit"}
            size={16}
            className={statusCfg.text}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-sm font-bold font-golos ${statusCfg.text}`}>{statusCfg.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text} font-medium`}>{profileStatus}</span>
          </div>
          <p className="text-xs text-gray-600 font-ibm">
            {profileStatus === "approved" && "Ваш профиль опубликован в каталоге и виден клиентам."}
            {profileStatus === "rejected" && "Ваш профиль был отклонён модератором. Внесите изменения и отправьте повторно."}
            {profileStatus === "pending" && "Ваш профиль отправлен на модерацию. Обычно это занимает до 24 часов."}
            {profileStatus === "draft" && "Заполните профиль и сохраните, чтобы отправить на модерацию."}
          </p>
          {profileStatus === "rejected" && moderationComment && (
            <div className="mt-2 bg-red-100 rounded-lg px-3 py-2">
              <p className="text-xs text-red-700 font-ibm"><span className="font-semibold">Комментарий модератора:</span> {moderationComment}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Building2" size={16} className="text-navy-700" />
          Основная информация
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Название компании *</label>
            <input value={profile.company_name} onChange={(e) => set("company_name", e.target.value)} className={inputCls} placeholder="ООО Логистик" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">ИНН</label>
            <input value={profile.inn} onChange={(e) => set("inn", e.target.value)} className={inputCls} placeholder="7712345678" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Город</label>
            <input value={profile.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="Москва" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Площадь склада (м2)</label>
            <input value={profile.warehouse_area} onChange={(e) => set("warehouse_area", e.target.value)} type="number" className={inputCls} placeholder="5000" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Год основания</label>
            <input value={profile.founded_year} onChange={(e) => set("founded_year", e.target.value)} type="number" className={inputCls} placeholder="2018" />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Краткое описание</label>
          <textarea value={profile.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Коротко о вашей компании (для карточки в каталоге)" />
          <div className="text-xs text-gray-400 font-ibm mt-1">{profile.description.length} / 500</div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Подробное описание</label>
          <textarea value={profile.detailed_description} onChange={(e) => set("detailed_description", e.target.value)} rows={5} className={`${inputCls} resize-none`} placeholder="Подробное описание для детальной страницы" />
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={16} className="text-navy-700" />
          Контактная информация
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Контактное лицо</label>
            <input value={profile.contact_name} onChange={(e) => set("contact_name", e.target.value)} className={inputCls} placeholder="Иван Иванов" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Email для клиентов</label>
            <input value={profile.contact_email} onChange={(e) => set("contact_email", e.target.value)} type="email" className={inputCls} placeholder="sales@company.ru" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Телефон</label>
            <input value={profile.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} type="tel" className={inputCls} placeholder="+7 (999) 123-45-67" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Telegram</label>
            <input value={profile.contact_tg} onChange={(e) => set("contact_tg", e.target.value)} className={inputCls} placeholder="@username" />
          </div>
        </div>
      </div>

      {/* Work params */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Layers" size={16} className="text-navy-700" />
          Схемы работы и возможности
        </div>

        {/* Schemes */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Схемы работы</label>
          <div className="flex flex-wrap gap-2">
            {WORK_SCHEME_OPTIONS.map((s) => (
              <button key={s} onClick={() => toggleArr("work_schemes", s)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all font-golos ${
                  profile.work_schemes.includes(s) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-700 border-gray-200 hover:border-navy-400"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Особенности и услуги</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {FEATURE_OPTIONS.map((f) => (
              <button key={f.key} onClick={() => toggleArr("features", f.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                  profile.features.includes(f.key) ? "bg-navy-50 border-navy-300 text-navy-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <Icon name={f.icon} size={14} className={profile.features.includes(f.key) ? "text-navy-700" : "text-gray-400"} />
                <span className="font-medium font-golos text-xs">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Специализация (типы товаров)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SPECIALIZATION_OPTIONS.map((s) => (
              <button key={s.key} onClick={() => toggleArr("specializations", s.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                  (profile.specializations || []).includes(s.key) ? "bg-gold-50 border-gold-300 text-navy-900" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <Icon name={s.icon} size={14} className={(profile.specializations || []).includes(s.key) ? "text-gold-600" : "text-gray-400"} />
                <span className="font-medium font-golos text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Packaging */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Виды упаковки (через запятую)</label>
          <input
            value={profile.packaging_types.join(", ")}
            onChange={(e) => set("packaging_types", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className={inputCls}
            placeholder="Короб, Полиэтилен, Пузырчатая плёнка"
          />
        </div>

        {/* Marketplaces */}
        <div>
          <label className="text-xs font-semibold text-gray-600 font-golos block mb-2">Маркетплейсы</label>
          <div className="flex flex-wrap gap-2">
            {MARKETPLACE_OPTIONS.map((mp) => (
              <button key={mp} onClick={() => toggleArr("marketplaces", mp)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  profile.marketplaces.includes(mp) ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"
                }`}>
                {mp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={16} className="text-navy-700" />
          Тарифы
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Хранение, руб/пал/день</label>
            <input value={profile.storage_price} onChange={(e) => set("storage_price", e.target.value)} type="number" className={inputCls} placeholder="25" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Сборка, руб/заказ</label>
            <input value={profile.assembly_price} onChange={(e) => set("assembly_price", e.target.value)} type="number" className={inputCls} placeholder="60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Доставка, руб/заказ</label>
            <input value={profile.delivery_price} onChange={(e) => set("delivery_price", e.target.value)} type="number" className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Мин. объём, заказов/мес</label>
            <input value={profile.min_volume} onChange={(e) => set("min_volume", e.target.value)} type="number" className={inputCls} placeholder="100" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => set("has_trial", !profile.has_trial)}
            className={`relative w-11 h-6 rounded-full transition-colors ${profile.has_trial ? "bg-navy-900" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.has_trial ? "translate-x-5" : ""}`} />
          </button>
          <span className="text-sm text-gray-700 font-golos">Есть пробный период / тестовая партия</span>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Users" size={16} className="text-navy-700" />
          Команда
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Размер команды (чел.)</label>
            <input value={profile.team_size} onChange={(e) => set("team_size", e.target.value)} type="number" className={inputCls} placeholder="50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 font-golos block mb-1">Часы работы</label>
            <input value={profile.working_hours} onChange={(e) => set("working_hours", e.target.value)} className={inputCls} placeholder="Пн-Пт 09:00-18:00" />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="Camera" size={16} className="text-navy-700" />
          Фотографии
          <span className="text-xs text-gray-400 font-ibm font-normal ml-1">{profile.photos.length} / 10</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {profile.photos.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}

          {profile.photos.length < 10 && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-navy-400 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-navy-600 transition-all"
            >
              {uploading ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <>
                  <Icon name="Plus" size={20} />
                  <span className="text-xs font-ibm">Загрузить</span>
                </>
              )}
            </button>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        {profile.photos.length === 0 && (
          <p className="text-xs text-gray-400 font-ibm">Загрузите фотографии склада, рабочего процесса, команды. Фотографии повышают доверие клиентов.</p>
        )}
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 bg-gray-50/90 backdrop-blur-sm py-4 -mx-4 md:-mx-6 px-4 md:px-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-3 max-w-4xl">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold font-golos text-sm h-11 px-8"
          >
            {saving ? (
              <Icon name="Loader2" size={16} className="animate-spin mr-2" />
            ) : (
              <Icon name="Save" size={16} className="mr-2" />
            )}
            {saving ? "Сохранение..." : "Сохранить профиль"}
          </Button>
          {(profileStatus === "draft" || profileStatus === "rejected") && (
            <Button
              onClick={handleSubmitForModeration}
              disabled={saving}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold font-golos text-sm h-11 px-8"
            >
              <Icon name="Send" size={16} className="mr-2" />
              Отправить на модерацию
            </Button>
          )}
          {profileStatus === "pending" && (
            <span className="text-xs text-amber-700 font-ibm flex items-center gap-1.5">
              <Icon name="Clock" size={13} />
              Профиль на модерации
            </span>
          )}
          {profileStatus === "approved" && (
            <span className="text-xs text-emerald-700 font-ibm flex items-center gap-1.5">
              <Icon name="CheckCircle" size={13} />
              Профиль опубликован
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
