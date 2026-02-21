import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthProvider as ClerkAuthProvider } from "@/components/auth/AuthProvider";
import { SafeConvexProvider } from "@/components/SafeConvexProvider";
import { EnhancedErrorBoundary } from "@/components/error/EnhancedErrorBoundary";
import { GA4PageTracker } from "./components/analytics/GA4PageTracker";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { CanonicalLink } from "./components/seo/CanonicalLink";

// Eager-loaded routes (no lazy loading – exact same content as full page refresh)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArticlePage from "./pages/Article";
import IndexSimple from "./pages/IndexSimple";
import EnhancedIndex from "./pages/EnhancedIndex";
import EnhancedIndexSimple from "./pages/EnhancedIndexSimple";
import Tech from "./pages/Tech";
import Security from "./pages/Security";
import Gaming from "./pages/Gaming";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import RoadmapV3 from "./pages/RoadmapV3";
import RoadmapFeature from "./pages/RoadmapFeature";
import BlogSeries from "./pages/BlogSeries";
import Explore from "./pages/Explore";
import Topics from "./pages/Topics";
import Tutorials from "./pages/Tutorials";
import News from "./pages/News";
import AIPulse from "./pages/AIPulse";
import BreachSim from "./pages/BreachSim";
import LiveThreatDashboard from "./pages/LiveThreatDashboard";
import SecurityScore from "./pages/SecurityScore";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import CommunityForums from "./pages/CommunityForums";
import SecurityScanner from "./pages/SecurityScanner";
import APIAccess from "./pages/APIAccess";
import MobileApp from "./pages/MobileApp";
import PodcastPlatform from "./pages/PodcastPlatform";
import AdvancedSearch from "./components/search/AdvancedSearch";
import LiveUpdatesFeed from "./components/live/LiveUpdatesFeed";
import SignInSignUp from "./components/auth/SignInSignUp";
import TestFeatures from "./pages/TestFeatures";
import NewsletterVerify from "./pages/NewsletterVerify";

const queryClient = new QueryClient();

function RouterClerkProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <ClerkAuthProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkAuthProvider>
  );
}

const App = () => (
  <EnhancedErrorBoundary>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouterClerkProvider>
        <SafeConvexProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <TooltipProvider>
                  <CanonicalLink />
                  <Toaster />
                  <Sonner />
                  <GA4PageTracker />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/simple" element={<IndexSimple />} />
                    <Route path="/enhanced" element={<EnhancedIndex />} />
                    <Route path="/enhanced-simple" element={<EnhancedIndexSimple />} />
                    <Route path="/tech" element={<Tech />} />
                    <Route path="/tech/:slug" element={<ArticlePage />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/security/:slug" element={<ArticlePage />} />
                    <Route path="/cybersecurity" element={<Navigate to="/security" replace />} />
                    <Route path="/cybersecurity/" element={<Navigate to="/security" replace />} />
                    <Route path="/gaming" element={<Gaming />} />
                    <Route path="/gaming/:slug" element={<ArticlePage />} />
                    <Route path="/article/:slug" element={<ArticlePage />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/topics" element={<Topics />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/guides/:slug" element={<GuideDetail />} />
                    <Route path="/tutorials" element={<Tutorials />} />
                    <Route path="/blog-series" element={<BlogSeries />} />
                    <Route path="/roadmap" element={<RoadmapV3 />} />
                    <Route path="/roadmap/:featureId" element={<RoadmapFeature />} />
                    <Route path="/breach-sim" element={<BreachSim />} />
                    <Route path="/security-score" element={<SecurityScore />} />
                    <Route path="/live-threat-dashboard" element={<LiveThreatDashboard />} />
                    <Route path="/subscription" element={<SubscriptionPlans />} />
                    <Route path="/subscription/management" element={<SubscriptionManagement />} />
                    <Route path="/billing" element={<SubscriptionManagement />} />
                    <Route path="/settings" element={<SubscriptionManagement />} />
                    <Route path="/forums" element={<CommunityForums />} />
                    <Route path="/tools/security-scanner" element={<SecurityScanner />} />
                    <Route path="/tools" element={<SecurityScanner />} />
                    <Route path="/api" element={<APIAccess />} />
                    <Route path="/mobile" element={<MobileApp />} />
                    <Route path="/podcasts" element={<PodcastPlatform />} />
                    <Route path="/search" element={<AdvancedSearch />} />
                    <Route path="/live-updates" element={<LiveUpdatesFeed />} />
                    <Route path="/ai-pulse" element={<AIPulse />} />
                    <Route path="/auth" element={<Navigate to="/signin" replace />} />
                    <Route path="/signin" element={<SignInSignUp />} />
                    <Route path="/signup" element={<SignInSignUp />} />
                    <Route path="/newsletter/verify" element={<NewsletterVerify />} />
                    <Route path="/test-features" element={<TestFeatures />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SafeConvexProvider>
      </RouterClerkProvider>
    </BrowserRouter>
  </EnhancedErrorBoundary>
);

export default App;
