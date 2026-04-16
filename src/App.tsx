
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;