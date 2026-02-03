
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
import RouteTransition from "./components/RouteTransition";
import NotificationPrompt from "./components/NotificationPrompt";
import InstallPrompt from "./components/InstallPrompt";
import Cart from "./components/Cart";
import { useAnalytics } from "./hooks/useAnalytics";
import PerformanceMonitor from "./components/PerformanceMonitor";

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
const Services = lazy(() => import("./pages/Services"));
const RentHelp = lazy(() => import("./pages/RentHelp"));
const SellHelp = lazy(() => import("./pages/SellHelp"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Programs = lazy(() => import("./pages/Programs"));
const OnlineServices = lazy(() => import("./pages/OnlineServices"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const ChatGPTPlaygroundPage = lazy(() => import("./components/extensions/chatgpt-polza/ChatGPTPlaygroundPage"));
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
          <RouteTransition />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/online-services" element={<OnlineServices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/property/:id" element={<PropertyView />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/reviews" element={<ReviewsAdmin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/services" element={<Services />} />
              <Route path="/rent-help" element={<RentHelp />} />
              <Route path="/sell-help" element={<SellHelp />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/chatgpt" element={<ChatGPTPlaygroundPage apiUrl="https://functions.poehali.dev/536eca85-b7ba-4712-8615-fc41995e6ee6" defaultModel="openai/gpt-4o-mini" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <InstallPrompt />
          <NotificationPrompt />
          <Cart />
          {import.meta.env.DEV && <PerformanceMonitor />}
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