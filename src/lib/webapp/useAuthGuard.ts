import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

type PageRole = "auth" | "admin" | "seller";

const KNOWN_ROLES = ["fulfillment", "seller", "admin"];

export function useAuthGuard(page: PageRole) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (page !== "auth") navigate("/auth", { replace: true });
      return;
    }

    const role = user.role;

    if (!KNOWN_ROLES.includes(role)) {
      navigate("/", { replace: true });
      return;
    }

    if (page === "auth") {
      navigate(role === "seller" ? "/seller" : "/admin", { replace: true });
      return;
    }

    if (page === "admin" && role === "seller") {
      navigate("/seller", { replace: true });
      return;
    }

    if (page === "seller" && role !== "seller") {
      navigate("/admin", { replace: true });
      return;
    }
  }, [user, loading, navigate, page]);

  return { user, loading };
}
