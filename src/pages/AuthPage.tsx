import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";

  useEffect(() => {
    if (!loading && user) {
      const dest = user.role === "seller" ? "/seller" : "/admin";
      navigate(dest, { replace: true });
    }
  }, [user, loading, navigate]);

  const handleClose = () => navigate(-1);

  if (loading) return null;

  return (
    <AuthModal
      open={true}
      onClose={handleClose}
      defaultTab={defaultTab}
    />
  );
}
