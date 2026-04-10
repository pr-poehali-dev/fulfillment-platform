import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "sonner";

import type { OwnerProfile, Fulfillment, Quote, Tab } from "./Admin/types";
import AdminEmailVerify from "./Admin/AdminEmailVerify";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminOwnerProfile from "./Admin/AdminOwnerProfile";
import AdminFulfillmentList from "./Admin/AdminFulfillmentList";
import AdminFulfillmentEdit from "./Admin/AdminFulfillmentEdit";
import AdminQuotesTab from "./Admin/AdminQuotesTab";
import AdminSettingsTab from "./Admin/AdminSettingsTab";
import SupportSection from "@/components/SupportSection";

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, logout, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Owner profile
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(true);

  // Fulfillments
  const [fulfillments, setFulfillments] = useState<Fulfillment[]>([]);
  const [fulfillmentsLoading, setFulfillmentsLoading] = useState(true);
  const [editingFulfillment, setEditingFulfillment] = useState<Fulfillment | null>(null);

  // Quotes
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);

  // Email verification
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // ─── Auth guard ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  // ─── Load owner profile ───────────────────────────────────────────────────

  const loadOwnerProfile = useCallback(async () => {
    try {
      setOwnerLoading(true);
      const data = await api.getOwnerProfile();
      setOwnerProfile(data.profile);
    } catch {
      setOwnerProfile(null);
    } finally {
      setOwnerLoading(false);
    }
  }, []);

  // ─── Load fulfillments ────────────────────────────────────────────────────

  const loadFulfillments = useCallback(async () => {
    try {
      setFulfillmentsLoading(true);
      const data = await api.listMyFulfillments();
      const list: Fulfillment[] = (data.fulfillments || []).map((f: Fulfillment) => ({
        ...f,
        warehouse_area: f.warehouse_area?.toString() || "",
        founded_year: f.founded_year?.toString() || "",
        storage_price: f.storage_price?.toString() || "",
        assembly_price: f.assembly_price?.toString() || "",
        delivery_price: f.delivery_price?.toString() || "",
        min_volume: f.min_volume?.toString() || "",
        team_size: f.team_size?.toString() || "",
        work_schemes: f.work_schemes || [],
        features: f.features || [],
        packaging_types: f.packaging_types || [],
        marketplaces: f.marketplaces || [],
        specializations: f.specializations || [],
        photos: f.photos || [],
        certificates: f.certificates || [],
        services: f.services || [],
        has_trial: !!f.has_trial,
      }));
      setFulfillments(list);
    } catch {
      setFulfillments([]);
    } finally {
      setFulfillmentsLoading(false);
    }
  }, []);

  // ─── Load quotes ──────────────────────────────────────────────────────────

  const loadQuotes = useCallback(async () => {
    try {
      setQuotesLoading(true);
      const data = await api.myQuotes();
      setQuotes(data.quotes || []);
    } catch {
      setQuotes([]);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.email_verified) {
      loadOwnerProfile();
      loadFulfillments();
    }
  }, [user, loadOwnerProfile, loadFulfillments]);

  useEffect(() => {
    if (tab === "quotes" && user?.email_verified) loadQuotes();
  }, [tab, user, loadQuotes]);

  // ─── Resend cooldown ──────────────────────────────────────────────────────

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ─── Verify handlers ──────────────────────────────────────────────────────

  const handleVerifyEmail = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) { setVerifyError("Введите 6-значный код"); return; }
    setVerifyError("");
    setVerifySubmitting(true);
    try {
      await api.verifyEmail(code);
      await refresh();
      toast.success("Email подтверждён");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      setVerifyError(e.message || e.detail || "Неверный код");
    } finally {
      setVerifySubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      await api.resendCode();
      setResendCooldown(60);
      toast.success("Код отправлен повторно");
    } catch (err: unknown) {
      const e = err as { message?: string; detail?: string };
      toast.error(e.message || e.detail || "Не удалось отправить код");
    }
  };

  // ─── Loading / auth ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // ─── Email verification screen ────────────────────────────────────────────

  if (!user.email_verified) {
    return (
      <AdminEmailVerify
        email={user.email}
        verifyCode={verifyCode}
        setVerifyCode={setVerifyCode}
        verifySubmitting={verifySubmitting}
        verifyError={verifyError}
        resendCooldown={resendCooldown}
        onVerify={handleVerifyEmail}
        onResend={handleResendCode}
        onLogout={() => { logout(); navigate("/auth"); }}
      />
    );
  }

  // ─── Tab labels ───────────────────────────────────────────────────────────

  const TAB_LABELS: Record<Tab, { title: string; sub: string }> = {
    profile:      { title: "Мой профиль",            sub: "Ваши персональные данные" },
    fulfillments: { title: "Мои фулфилменты",        sub: editingFulfillment ? `Редактирование: ${editingFulfillment.company_name || "без названия"}` : "Управление складами и услугами" },
    quotes:       { title: "Заявки на КП",            sub: "Входящие запросы от селлеров" },
    settings:     { title: "Настройки",               sub: "Управление аккаунтом" },
    support:      { title: "Техническая поддержка",   sub: "Мы всегда готовы помочь" },
  };

  const handleFulfillmentSaved = (updated: Fulfillment) => {
    setFulfillments((prev) => prev.map((f) => f.id === updated.id ? updated : f));
    setEditingFulfillment(updated);
  };

  const { title, sub } = TAB_LABELS[tab];

  return (
    <div className="min-h-screen bg-gray-50 font-golos flex">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tab={tab}
        setTab={(t) => { setTab(t); setEditingFulfillment(null); }}
        ownerName={ownerProfile?.contact_name || ""}
        userEmail={user.email}
        userId={user.id}
        onLogout={() => { logout(); navigate("/auth"); }}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-gray-500">
            <Icon name="Menu" size={20} />
          </button>
          <div>
            <div className="font-golos font-bold text-navy-900 text-sm">{title}</div>
            <div className="text-xs text-gray-400 font-ibm">{sub}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-ibm hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-golos font-bold text-xs">
              {(user.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {tab === "profile" && (
            <AdminOwnerProfile
              profile={ownerProfile}
              loading={ownerLoading}
              userId={user.id}
              userEmail={user.email}
              onSaved={(p) => setOwnerProfile(p)}
            />
          )}

          {tab === "fulfillments" && !editingFulfillment && (
            <AdminFulfillmentList
              fulfillments={fulfillments}
              loading={fulfillmentsLoading}
              onReload={loadFulfillments}
              onEdit={(f) => {
                // Если нового фулфилмента ещё нет в списке — добавляем
                setFulfillments((prev) => prev.some((x) => x.id === f.id) ? prev : [...prev, f]);
                setEditingFulfillment(f);
              }}
            />
          )}

          {tab === "fulfillments" && editingFulfillment && (
            <AdminFulfillmentEdit
              fulfillment={editingFulfillment}
              onBack={() => { setEditingFulfillment(null); loadFulfillments(); }}
              onSaved={handleFulfillmentSaved}
            />
          )}

          {tab === "quotes" && (
            <AdminQuotesTab quotes={quotes} quotesLoading={quotesLoading} onReload={loadQuotes} />
          )}

          {tab === "settings" && (
            <AdminSettingsTab user={user} onLogout={() => { logout(); navigate("/auth"); }} />
          )}

          {tab === "support" && (
            <div className="max-w-2xl">
              <SupportSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}