import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "sonner";

import type { Profile, Quote, Tab } from "./Admin/types";
import { EMPTY_PROFILE, STATUS_CFG } from "./Admin/types";
import AdminEmailVerify from "./Admin/AdminEmailVerify";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminProfileTab from "./Admin/AdminProfileTab";
import AdminQuotesTab from "./Admin/AdminQuotesTab";
import AdminSettingsTab from "./Admin/AdminSettingsTab";

export default function Admin() {
  const navigate = useNavigate();
  const { user, fulfillment, loading, logout, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);

  // Email verification state
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // ─── AUTH GUARD ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // ─── LOAD PROFILE ─────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const data = await api.getProfile();
      if (data) {
        setProfile({
          ...EMPTY_PROFILE,
          ...data,
          work_schemes: data.work_schemes || [],
          features: data.features || [],
          packaging_types: data.packaging_types || [],
          marketplaces: data.marketplaces || [],
          specializations: data.specializations || [],
          photos: data.photos || [],
          has_trial: !!data.has_trial,
          warehouse_area: data.warehouse_area?.toString() || "",
          founded_year: data.founded_year?.toString() || "",
          storage_price: data.storage_price?.toString() || "",
          assembly_price: data.assembly_price?.toString() || "",
          delivery_price: data.delivery_price?.toString() || "",
          min_volume: data.min_volume?.toString() || "",
          team_size: data.team_size?.toString() || "",
        });
      }
    } catch {
      // Profile may not exist yet - that's ok, use empty
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.email_verified) {
      loadProfile();
    }
  }, [user, loadProfile]);

  // ─── LOAD QUOTES ──────────────────────────────────────────────────────────

  const loadQuotes = useCallback(async () => {
    try {
      setQuotesLoading(true);
      const data = await api.myQuotes();
      setQuotes(data.quotes || data || []);
    } catch {
      setQuotes([]);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "quotes" && user?.email_verified) {
      loadQuotes();
    }
  }, [tab, user, loadQuotes]);

  // ─── RESEND COOLDOWN ──────────────────────────────────────────────────────

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ─── VERIFICATION HANDLERS ────────────────────────────────────────────────

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

  // ─── LOADING / AUTH CHECK ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // ─── EMAIL VERIFICATION SCREEN ────────────────────────────────────────────

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

  // ─── MAIN DASHBOARD ───────────────────────────────────────────────────────

  const profileStatus = profile.status || fulfillment?.status || "draft";
  const statusCfg = STATUS_CFG[profileStatus] || STATUS_CFG.draft;

  return (
    <div className="min-h-screen bg-gray-50 font-golos flex">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tab={tab}
        setTab={setTab}
        companyName={profile.company_name}
        profileStatus={profileStatus}
        userEmail={user.email}
        onLogout={() => { logout(); navigate("/auth"); }}
      />

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-gray-500">
            <Icon name="Menu" size={20} />
          </button>
          <div>
            <div className="font-golos font-bold text-navy-900 text-sm">
              {tab === "profile" && "Профиль компании"}
              {tab === "quotes" && "Заявки на КП"}
              {tab === "settings" && "Настройки"}
            </div>
            <div className="text-xs text-gray-400 font-ibm">
              {tab === "profile" && "Как вас видят клиенты в каталоге"}
              {tab === "quotes" && "Входящие запросы от селлеров"}
              {tab === "settings" && "Управление аккаунтом"}
            </div>
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
            <AdminProfileTab
              profile={profile}
              setProfile={setProfile}
              profileLoading={profileLoading}
              profileStatus={profileStatus}
              statusCfg={statusCfg}
              moderationComment={profile.moderation_comment}
              onReload={loadProfile}
            />
          )}
          {tab === "quotes" && (
            <AdminQuotesTab quotes={quotes} quotesLoading={quotesLoading} onReload={loadQuotes} />
          )}
          {tab === "settings" && (
            <AdminSettingsTab user={user} onLogout={() => { logout(); navigate("/auth"); }} />
          )}
        </div>
      </main>
    </div>
  );
}
