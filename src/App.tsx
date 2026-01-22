
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import Index from "./pages/Index";
import PropertyView from "./pages/PropertyView";
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";
import PageLoader from "./components/PageLoader";
import NotificationPrompt from "./components/NotificationPrompt";
import InstallPrompt from "./components/InstallPrompt";
import { useAnalytics } from "./hooks/useAnalytics";

// Lazy load admin pages
const Admin = lazy(() => import("./pages/Admin"));
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const AdminProperties = lazy(() => import("./pages/AdminProperties"));
const ReviewsAdmin = lazy(() => import("./pages/ReviewsAdmin"));
const AddProperty = lazy(() => import("./pages/AddProperty"));

// Lazy load other pages
const Register = lazy(() => import("./pages/Register"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AppContent() {
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <>
      {isLoading && <PageLoader />}
      <AnalyticsProvider
        googleAnalyticsId={analytics.google_analytics_id || undefined}
        yandexMetrikaId={analytics.yandex_metrika_id || "105974763"}
      >
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/property/:id" element={<PropertyView />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/reviews" element={<ReviewsAdmin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/add-property" element={<AddProperty />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <InstallPrompt />
          <NotificationPrompt />
        </BrowserRouter>
      </AnalyticsProvider>
    </>
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