import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Review {
  id: number;
  fulfillment_id: number;
  fulfillment_name: string;
  author_name: string;
  author_company: string;
  rating: number;
  text: string;
  is_visible: boolean;
  created_at: string;
}

interface FulfillmentOption {
  id: number;
  company_name: string;
  status: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const interactive = !!onChange;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange && onChange(star)}
          className={`text-lg leading-none transition-colors ${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          } ${star <= value ? "text-gold-400" : "text-gray-200"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── REVIEW FORM ─────────────────────────────────────────────────────────────

interface ReviewFormData {
  fulfillment_id: number | "";
  author_name: string;
  author_company: string;
  rating: number;
  text: string;
  is_visible: boolean;
}

const EMPTY_FORM: ReviewFormData = {
  fulfillment_id: "",
  author_name: "",
  author_company: "",
  rating: 5,
  text: "",
  is_visible: true,
};

function ReviewForm({
  form,
  fulfillments,
  saving,
  onFormChange,
  onSave,
  onCancel,
  isEdit,
}: {
  form: ReviewFormData;
  fulfillments: FulfillmentOption[];
  saving: boolean;
  onFormChange: (f: ReviewFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const set = <K extends keyof ReviewFormData>(key: K, val: ReviewFormData[K]) =>
    onFormChange({ ...form, [key]: val });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center">
          <Icon name="Star" size={15} className="text-gold-400" />
        </div>
        <span className="font-golos font-bold text-navy-950 text-sm">
          {isEdit ? "Редактировать отзыв" : "Добавить отзыв"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fulfillment select */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
            Фулфилмент
          </label>
          <select
            value={form.fulfillment_id}
            onChange={(e) =>
              set("fulfillment_id", e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm bg-white focus:outline-none focus:ring-2 focus:ring-navy-200"
          >
            <option value="">— Выберите фулфилмент —</option>
            {fulfillments.map((ff) => (
              <option key={ff.id} value={ff.id}>
                {ff.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Author name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
            Имя автора
          </label>
          <input
            type="text"
            value={form.author_name}
            onChange={(e) => set("author_name", e.target.value)}
            placeholder="Иван Иванов"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
        </div>

        {/* Author company */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
            Компания автора
          </label>
          <input
            type="text"
            value={form.author_company}
            onChange={(e) => set("author_company", e.target.value)}
            placeholder="ООО Ромашка"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
            Рейтинг
          </label>
          <StarRating value={form.rating} onChange={(v) => set("rating", v)} />
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center gap-3 mt-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              onClick={() => set("is_visible", !form.is_visible)}
              className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${
                form.is_visible ? "bg-emerald-500" : "bg-gray-300"
              }`}
              style={{ height: "22px", minWidth: "40px" }}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.is_visible ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-xs text-gray-600 font-ibm">
              {form.is_visible ? "Виден на сайте" : "Скрыт"}
            </span>
          </label>
        </div>

        {/* Text */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide font-ibm mb-1.5">
            Текст отзыва
          </label>
          <textarea
            value={form.text}
            onChange={(e) => set("text", e.target.value)}
            rows={4}
            placeholder="Текст отзыва..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-navy-200 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-ibm px-4 py-2"
        >
          Отмена
        </button>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-navy-950 hover:bg-navy-800 text-white font-bold font-golos text-sm h-9 px-5"
        >
          {saving ? (
            <Icon name="Loader2" size={14} className="animate-spin mr-1.5" />
          ) : (
            <Icon name="Save" size={14} className="mr-1.5" />
          )}
          Сохранить
        </Button>
      </div>
    </div>
  );
}

// ─── REVIEWS TAB ─────────────────────────────────────────────────────────────

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fulfillments, setFulfillments] = useState<FulfillmentOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const data = await api.adminReviewsGet();
      setReviews(data.reviews || []);
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось загрузить отзывы");
    }
  }, []);

  const loadFulfillments = useCallback(async () => {
    try {
      const data = await api.adminList();
      const items: FulfillmentOption[] = (data.fulfillments || data || []).filter(
        (f: FulfillmentOption) => f.status === "approved"
      );
      setFulfillments(items);
    } catch {
      // non-critical
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadReviews(), loadFulfillments()]);
    setLoading(false);
  }, [loadReviews, loadFulfillments]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const openAddForm = () => {
    setEditReview(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (review: Review) => {
    setEditReview(review);
    setForm({
      fulfillment_id: review.fulfillment_id,
      author_name: review.author_name,
      author_company: review.author_company,
      rating: review.rating,
      text: review.text,
      is_visible: review.is_visible,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditReview(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.fulfillment_id) {
      toast.error("Выберите фулфилмент");
      return;
    }
    if (!form.author_name.trim()) {
      toast.error("Введите имя автора");
      return;
    }
    if (!form.text.trim()) {
      toast.error("Введите текст отзыва");
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        fulfillment_id: form.fulfillment_id,
        author_name: form.author_name,
        author_company: form.author_company,
        rating: form.rating,
        text: form.text,
        is_visible: form.is_visible,
      };
      if (editReview) {
        body.id = editReview.id;
      }
      await api.adminReviewsSave(body);
      toast.success(editReview ? "Отзыв обновлён" : "Отзыв добавлен");
      handleCancel();
      loadReviews();
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      toast.error(e.message || e.error || "Не удалось сохранить отзыв");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (review: Review) => {
    setTogglingId(review.id);
    try {
      await api.adminReviewsToggle(review.id, !review.is_visible);
      toast.success(review.is_visible ? "Отзыв скрыт" : "Отзыв показан");
      loadReviews();
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      toast.error(e.message || e.error || "Не удалось изменить видимость");
    } finally {
      setTogglingId(null);
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
    <div>
      {/* Form (add/edit) */}
      {showForm && (
        <ReviewForm
          form={form}
          fulfillments={fulfillments}
          saving={saving}
          onFormChange={setForm}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={!!editReview}
        />
      )}

      {/* Reviews table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Star" size={15} className="text-gold-400" />
            <span className="font-golos font-bold text-navy-950 text-sm">Отзывы</span>
            <span className="text-xs text-gray-400 font-ibm ml-1">{reviews.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadReviews}
              className="text-gray-400 hover:text-navy-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              title="Обновить"
            >
              <Icon name="RefreshCw" size={14} />
            </button>
            {!showForm && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-navy-950 text-white hover:bg-navy-800 transition-colors font-golos font-semibold"
              >
                <Icon name="Plus" size={13} />
                Добавить отзыв
              </button>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon name="Star" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-ibm">Отзывов пока нет</p>
            {!showForm && (
              <button
                onClick={openAddForm}
                className="mt-3 text-xs text-navy-600 hover:text-navy-950 font-ibm underline"
              >
                Добавить первый отзыв
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Фулфилмент</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Автор / Компания</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Рейтинг</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Текст</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Видимость</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Дата</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-500 font-ibm text-xs uppercase tracking-wide">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium text-navy-700 bg-navy-50 px-2 py-0.5 rounded font-ibm inline-block max-w-[140px] truncate" title={review.fulfillment_name}>
                          {review.fulfillment_name || `ID: ${review.fulfillment_id}`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-golos font-bold text-navy-950 text-sm">{review.author_name || "—"}</div>
                        <div className="text-xs text-gray-400 font-ibm">{review.author_company || "—"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StarRating value={review.rating} />
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-xs text-gray-600 font-ibm truncate" title={review.text}>
                          {review.text
                            ? review.text.length > 80
                              ? review.text.slice(0, 80) + "…"
                              : review.text
                            : "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleVisibility(review)}
                          disabled={togglingId === review.id}
                          className={`relative w-10 rounded-full transition-colors focus:outline-none ${
                            review.is_visible ? "bg-emerald-500" : "bg-gray-300"
                          } ${togglingId === review.id ? "opacity-60" : ""}`}
                          style={{ height: "22px", minWidth: "40px" }}
                          title={review.is_visible ? "Скрыть" : "Показать"}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              review.is_visible ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 font-ibm whitespace-nowrap">
                        {formatDate(review.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditForm(review)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy-700 hover:bg-gray-100 transition-colors"
                            title="Редактировать"
                          >
                            <Icon name="Pencil" size={13} />
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(review)}
                            disabled={togglingId === review.id}
                            className={`p-1.5 rounded-lg transition-colors ${
                              review.is_visible
                                ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={review.is_visible ? "Скрыть" : "Показать"}
                          >
                            {togglingId === review.id ? (
                              <Icon name="Loader2" size={13} className="animate-spin" />
                            ) : (
                              <Icon name={review.is_visible ? "EyeOff" : "Eye"} size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-navy-700 bg-navy-50 px-2 py-0.5 rounded font-ibm inline-block mb-1 max-w-full truncate">
                        {review.fulfillment_name || `ID: ${review.fulfillment_id}`}
                      </div>
                      <div className="font-golos font-bold text-navy-950 text-sm">{review.author_name || "—"}</div>
                      <div className="text-xs text-gray-400 font-ibm">{review.author_company || "—"}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StarRating value={review.rating} />
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          review.is_visible
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {review.is_visible ? "Виден" : "Скрыт"}
                      </span>
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-xs text-gray-600 font-ibm">
                      {review.text.length > 100 ? review.text.slice(0, 100) + "…" : review.text}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-ibm">{formatDate(review.created_at)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditForm(review)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-ibm transition-colors flex items-center gap-1"
                      >
                        <Icon name="Pencil" size={11} />
                        Ред.
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(review)}
                        disabled={togglingId === review.id}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-ibm transition-colors flex items-center gap-1 ${
                          review.is_visible
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {togglingId === review.id ? (
                          <Icon name="Loader2" size={11} className="animate-spin" />
                        ) : (
                          <Icon name={review.is_visible ? "EyeOff" : "Eye"} size={11} />
                        )}
                        {review.is_visible ? "Скрыть" : "Показать"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
