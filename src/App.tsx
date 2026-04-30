
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ymGoal, ymTestAll, ALL_GOALS } from "@/lib/ym";
import Index from "./pages/Index";
import ForFulfillment from "./pages/ForFulfillment";
import Admin from "./pages/Admin";
import Seller from "./pages/Seller";
import AuthPage from "./pages/AuthPage";
import Moderation from "./pages/Moderation";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Offer from "./pages/Offer";
import Demo from "./pages/Demo";
import Sales from "./pages/Sales";
import FulfillmentWildberries from "./pages/FulfillmentWildberries";
import FulfillmentOzon from "./pages/FulfillmentOzon";
import FulfillmentMoskva from "./pages/FulfillmentMoskva";
import FulfillmentSpb from "./pages/FulfillmentSpb";
import ChtoTakoeFulfillment from "./pages/ChtoTakoeFulfillment";
import FboVsFbs from "./pages/FboVsFbs";
import KalkulyatorFulfillmenta from "./pages/KalkulyatorFulfillmenta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const YmDevPanel = () => {
  if (!import.meta.env.DEV) return null;
  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 6, background: "#1e1e1e", padding: 12, borderRadius: 10, fontSize: 12, color: "#fff", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>🎯 YM Dev</div>
      <button onClick={ymTestAll} style={{ background: "#e63737", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
        Все цели разом
      </button>
      {ALL_GOALS.map((goal) => (
        <button key={goal} onClick={() => ymGoal(goal, { test: true })} style={{ background: "#2d2d2d", color: "#ccc", border: "1px solid #444", borderRadius: 6, padding: "3px 8px", cursor: "pointer", textAlign: "left" }}>
          {goal}
        </button>
      ))}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <YmDevPanel />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/for-fulfillment" element={<ForFulfillment />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/fulfillment/wildberries" element={<FulfillmentWildberries />} />
            <Route path="/fulfillment/ozon" element={<FulfillmentOzon />} />
            <Route path="/fulfillment/moskva" element={<FulfillmentMoskva />} />
            <Route path="/fulfillment/sankt-peterburg" element={<FulfillmentSpb />} />
            <Route path="/chto-takoe-fulfillment" element={<ChtoTakoeFulfillment />} />
            <Route path="/fbo-vs-fbs" element={<FboVsFbs />} />
            <Route path="/kalkulator-fulfillmenta" element={<KalkulyatorFulfillmenta />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;