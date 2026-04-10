import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthGuard } from "@/lib/webapp/useAuthGuard";
import AuthModal from "@/components/AuthModal";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuthGuard("auth");

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