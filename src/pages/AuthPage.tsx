import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuthGuard } from "@/lib/webapp/useAuthGuard";
import AuthModal from "@/components/AuthModal";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuthGuard("auth");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    meta.id = "noindex-auth";
    document.head.appendChild(meta);
    return () => { document.getElementById("noindex-auth")?.remove(); };
  }, []);

  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";

  const handleClose = () => navigate(-1);

  if (loading || user) return null;

  return (
    <AuthModal
      open={true}
      onClose={handleClose}
      defaultTab={defaultTab}
    />
  );
}