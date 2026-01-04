
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminArticles from "./pages/AdminArticles";
import AdminProperties from "./pages/AdminProperties";
import PropertyView from "./pages/PropertyView";
import Register from "./pages/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";
import { useAnalytics } from "./hooks/useAnalytics";

const queryClient = new QueryClient();

function AppContent() {
  const analytics = useAnalytics();

  return (
    <AnalyticsProvider
      googleAnalyticsId={analytics.google_analytics_id || undefined}
      yandexMetrikaId={analytics.yandex_metrika_id || "105974763"}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/property/:id" element={<PropertyView />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AnalyticsProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;