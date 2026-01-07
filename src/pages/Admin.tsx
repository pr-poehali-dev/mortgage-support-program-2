import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminCharts from '@/components/admin/AdminCharts';
import AdminEmailDialog from '@/components/admin/AdminEmailDialog';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminPropertiesSection from '@/components/admin/AdminPropertiesSection';
import AdminUserPropertiesSection from '@/components/admin/AdminUserPropertiesSection';
import CRMPanel from '@/components/admin/CRMPanel';
import IndexNowNotifier from '@/components/IndexNowNotifier';
import SitemapInfo from '@/components/SitemapInfo';
import AnalyticsInfo from '@/components/AnalyticsInfo';
import MetrikaGoalsSetup from '@/components/MetrikaGoalsSetup';
import MetrikaGoalsDashboard from '@/components/MetrikaGoalsDashboard';
import MetrikaTrendsChart from '@/components/MetrikaTrendsChart';
import AdminClock from '@/components/AdminClock';
import AdminCalendar from '@/components/AdminCalendar';
import PropertyFormDialog from '@/components/catalog/PropertyFormDialog';
import { useAdminLogic } from '@/hooks/useAdminLogic';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Admin() {
  const {
    isAuthenticated,
    password,
    setPassword,
    analytics,
    loading,
    error,
    period,
    setPeriod,
    emailModalOpen,
    setEmailModalOpen,
    reportEmail,
    setReportEmail,
    sendingEmail,
    properties,
    propertiesLoading,
    propertyDialogOpen,
    setPropertyDialogOpen,
    uploadingPhoto,
    formData,
    setFormData,
    handleLogin,
    handlePhotoSelect,
    handlePropertySubmit,
    exportToExcel,
    sendEmailReport
  } = useAdminLogic();

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const conversionRate = analytics.totals.total_views > 0 
    ? ((analytics.totals.total_applications / analytics.totals.total_views) * 100).toFixed(2)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto p-6 space-y-6">
        <AdminClock />
        
        <AdminHeader
          period={period}
          setPeriod={setPeriod}
          onExportExcel={exportToExcel}
          onOpenEmailModal={() => setEmailModalOpen(true)}
          onOpenPropertyDialog={() => setPropertyDialogOpen(true)}
        />

        <AdminStatsCards totals={analytics.totals} conversionRate={conversionRate} />

        <CRMPanel />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCalendar />
          <div className="space-y-6">
            <IndexNowNotifier />
            <SitemapInfo />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsInfo />
          <MetrikaGoalsSetup />
        </div>

        <MetrikaGoalsDashboard />

        <MetrikaTrendsChart />

        <AdminCharts analytics={analytics} />

        <AdminUserPropertiesSection />

        <AdminPropertiesSection
          properties={properties}
          propertiesLoading={propertiesLoading}
        />
      </div>

      <AdminEmailDialog
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        reportEmail={reportEmail}
        setReportEmail={setReportEmail}
        sendingEmail={sendingEmail}
        onSendEmail={sendEmailReport}
        period={period}
      />

      <PropertyFormDialog
        dialogOpen={propertyDialogOpen}
        setDialogOpen={setPropertyDialogOpen}
        editProperty={null}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handlePropertySubmit}
        handlePhotoSelect={handlePhotoSelect}
        uploadingPhoto={uploadingPhoto}
        photoPreview={formData.photos[0] || ''}
      />
    </div>
  );
}