import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Loader from '@/components/shared/Loader';

/* ── Public ── */
const Home          = lazy(() => import('@/pages/public/Home'));
const About         = lazy(() => import('@/pages/public/About'));
const Resources     = lazy(() => import('@/pages/public/Resources'));
const Contact       = lazy(() => import('@/pages/public/Contact'));
const HowItWorks    = lazy(() => import('@/pages/public/HowItWorks'));
const Marketplace   = lazy(() => import('@/pages/public/Marketplace'));
const ProjectDetail = lazy(() => import('@/pages/public/ProjectDetail'));
const HelpCenter    = lazy(() => import('@/pages/public/HelpCenter'));
const HelpArticle   = lazy(() => import('@/pages/public/HelpArticle'));
const Stories       = lazy(() => import('@/pages/public/Stories'));
const StarterPool   = lazy(() => import('@/pages/public/StarterPool'));

/* ── Auth ── */
const Login          = lazy(() => import('@/pages/auth/Login'));
const Register       = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword  = lazy(() => import('@/pages/auth/ResetPassword'));
const VerifyEmail    = lazy(() => import('@/pages/auth/VerifyEmail'));

/* ── Onboarding ── */
const KycStep1Personal = lazy(() => import('@/pages/onboarding/KycStep1Personal'));
const KycStep2Identity = lazy(() => import('@/pages/onboarding/KycStep2Identity'));
const KycStep3Address  = lazy(() => import('@/pages/onboarding/KycStep3Address'));
const KycStep4Bank     = lazy(() => import('@/pages/onboarding/KycStep4Bank'));
const KycStep5Review   = lazy(() => import('@/pages/onboarding/KycStep5Review'));

/* ── Investor ── */
const InvestorDashboard = lazy(() => import('@/pages/investor/Dashboard'));
const Investments       = lazy(() => import('@/pages/investor/Investments'));
const InvestmentDetail  = lazy(() => import('@/pages/investor/InvestmentDetail'));
const Portfolio         = lazy(() => import('@/pages/investor/Portfolio'));
const Wallet            = lazy(() => import('@/pages/investor/Wallet'));
const Documents         = lazy(() => import('@/pages/investor/Documents'));
const Profile           = lazy(() => import('@/pages/investor/Profile'));
const YearInReview      = lazy(() => import('@/pages/investor/YearInReview'));
const Referral          = lazy(() => import('@/pages/investor/Referral'));
const PaymentCallback   = lazy(() => import('@/pages/investor/PaymentCallback'));

/* ── Admin ── */
const AdminDashboard      = lazy(() => import('@/pages/admin/Dashboard'));
const AdminInvestors      = lazy(() => import('@/pages/admin/Investors'));
const AdminInvestorDetail = lazy(() => import('@/pages/admin/InvestorDetail'));
const AdminKycList        = lazy(() => import('@/pages/admin/KycList'));
const AdminKycDetail      = lazy(() => import('@/pages/admin/KycDetail'));
const AdminProjects       = lazy(() => import('@/pages/admin/Projects'));
const AdminProjectNew     = lazy(() => import('@/pages/admin/ProjectNew'));
const AdminProjectEdit    = lazy(() => import('@/pages/admin/ProjectEdit'));
const AdminInvestments    = lazy(() => import('@/pages/admin/Investments'));
const AdminTransactions   = lazy(() => import('@/pages/admin/Transactions'));
const AdminReports        = lazy(() => import('@/pages/admin/Reports'));

/* ── Misc ── */
const NotFound = lazy(() => import('@/pages/NotFound'));

function Loading() {
  return (
    <div style={{ padding: 80, textAlign: 'center' }}>
      <Loader />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:slug" element={<ProjectDetail />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help/:slug" element={<HelpArticle />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/starter" element={<StarterPool />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/kyc" element={<KycStep1Personal />} />
          <Route path="/kyc/identity" element={<KycStep2Identity />} />
          <Route path="/kyc/address" element={<KycStep3Address />} />
          <Route path="/kyc/bank" element={<KycStep4Bank />} />
          <Route path="/kyc/review" element={<KycStep5Review />} />
          <Route path="/dashboard" element={<InvestorDashboard />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/investments/:id" element={<InvestmentDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/year-in-review" element={<YearInReview />} />
          <Route path="/referral" element={<Referral />} />
        </Route>

        <Route path="/payment/callback" element={<ProtectedRoute><PaymentCallback /></ProtectedRoute>} />

        <Route element={<ProtectedRoute><RoleRoute role="ADMIN"><DashboardLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/investors" element={<AdminInvestors />} />
          <Route path="/admin/investors/:id" element={<AdminInvestorDetail />} />
          <Route path="/admin/kyc" element={<AdminKycList />} />
          <Route path="/admin/kyc/:id" element={<AdminKycDetail />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/projects/new" element={<AdminProjectNew />} />
          <Route path="/admin/projects/:id/edit" element={<AdminProjectEdit />} />
          <Route path="/admin/investments" element={<AdminInvestments />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
