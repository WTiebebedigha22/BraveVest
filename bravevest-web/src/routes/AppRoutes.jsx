import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '@/components/shared/RouteLoader';

// ═══════════════════════════════════════════════════════════
// PUBLIC
// ═══════════════════════════════════════════════════════════
const Home = lazy(() => import('@/pages/public/Home'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Faq = lazy(() => import('@/pages/public/Faq'));
const Marketplace = lazy(() => import('@/pages/public/Marketplace'));
const ProjectDetail = lazy(() => import('@/pages/public/ProjectDetail'));
const Security = lazy(() => import('@/pages/public/Security'));
const RiskDisclosure = lazy(() => import('@/pages/public/RiskDisclosure'));
const Terms = lazy(() => import('@/pages/public/Terms'));
const Privacy = lazy(() => import('@/pages/public/Privacy'));
const HowItWorks = lazy(() => import('@/pages/public/HowItWorks'));
const Support = lazy(() => import('@/pages/public/Support'));

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));

// ═══════════════════════════════════════════════════════════
// INVESTOR
// ═══════════════════════════════════════════════════════════
const SubmitOpportunity = lazy(() => import('@/pages/investor/SubmitOpportunity'));
const MySubmissions = lazy(() => import('@/pages/investor/MySubmissions'));
const PendingProjects = lazy(() => import('@/pages/admin/PendingProjects'));
const Dashboard = lazy(() => import('@/pages/investor/Dashboard'));
const Investments = lazy(() => import('@/pages/investor/Investments'));
const InvestmentDetail = lazy(() => import('@/pages/investor/InvestmentDetail'));
const InvestmentLog = lazy(() => import('@/pages/investor/InvestmentLog'));
const Portfolio = lazy(() => import('@/pages/investor/Portfolio'));
const Wallet = lazy(() => import('@/pages/investor/Wallet'));
const Deposit = lazy(() => import('@/pages/investor/Deposit'));
const Withdraw = lazy(() => import('@/pages/investor/Withdraw'));
const Transfer = lazy(() => import('@/pages/investor/Transfer'));
const Statement = lazy(() => import('@/pages/investor/Statement'));
const Documents = lazy(() => import('@/pages/investor/Documents'));
const Referral = lazy(() => import('@/pages/investor/Referral'));
const Goals = lazy(() => import('@/pages/investor/Goals'));
const GoalDetail = lazy(() => import('@/pages/investor/GoalDetail'));
const Groups = lazy(() => import('@/pages/investor/Groups'));
const Gifting = lazy(() => import('@/pages/investor/Gifting'));
const Notifications = lazy(() => import('@/pages/investor/Notifications'));
const YearInReview = lazy(() => import('@/pages/investor/YearInReview'));
const PaymentCallback = lazy(() => import('@/pages/investor/PaymentCallback'));
const Profile = lazy(() => import('@/pages/investor/Profile'));
const Commitments = lazy(() => import('@/pages/investor/Commitments'));

// ═══════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminInvestors = lazy(() => import('@/pages/admin/Investors'));
const AdminInvestorDetail = lazy(() => import('@/pages/admin/InvestorDetail'));
const AdminKycList = lazy(() => import('@/pages/admin/KycList'));
const AdminKycDetail = lazy(() => import('@/pages/admin/KycDetail'));
const AdminProjects = lazy(() => import('@/pages/admin/Projects'));
const AdminProjectNew = lazy(() => import('@/pages/admin/ProjectNew'));
const AdminProjectEdit = lazy(() => import('@/pages/admin/ProjectEdit'));
const AdminInvestments = lazy(() => import('@/pages/admin/AdminInvestments'));
const AdminTransactions = lazy(() => import('@/pages/admin/Transactions'));
const AdminReports = lazy(() => import('@/pages/admin/Reports'));
const AdminInsights = lazy(() => import('@/pages/admin/Insights'));
const AdminInsightEditor = lazy(() => import('@/pages/admin/InsightEditor'));
const AdminFundingReview = lazy(() => import('@/pages/admin/AdminFundingReview'));
const AdminContact = lazy(() => import('@/pages/admin/ContactInbox'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════
export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:slug" element={<ProjectDetail />} />
        <Route path="/security" element={<Security />} />
        <Route path="/risk-disclosure" element={<RiskDisclosure />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/support" element={<Support />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        

        {/* INVESTOR */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/opportunities/new" element={<SubmitOpportunity />} />
        <Route path="/opportunities/mine" element={<MySubmissions />} />
        <Route path="/investments/:id" element={<InvestmentDetail />} />
        <Route path="/investments/:id/log" element={<InvestmentLog />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/wallet/transfer" element={<Transfer />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/goals/:id" element={<GoalDetail />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<Groups />} />
        <Route path="/gifting" element={<Gifting />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/year-in-review" element={<YearInReview />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/commitments" element={<Commitments />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/investors" element={<AdminInvestors />} />
        <Route path="/admin/investors/:id" element={<AdminInvestorDetail />} />
        <Route path="/admin/kyc" element={<AdminKycList />} />
        <Route path="/admin/kyc/:id" element={<AdminKycDetail />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/projects/pending" element={<PendingProjects />} />
        <Route path="/admin/projects/new" element={<AdminProjectNew />} />
        <Route path="/admin/projects/:id/edit" element={<AdminProjectEdit />} />
        <Route path="/admin/investments" element={<AdminInvestments />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/insights" element={<AdminInsights />} />
        <Route path="/admin/insights/new" element={<AdminInsightEditor />} />
        <Route path="/admin/insights/:id/edit" element={<AdminInsightEditor />} />
        <Route path="/admin/funding/review" element={<AdminFundingReview />} />
        <Route path="/admin/contact" element={<AdminContact />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}