import { lazy, Suspense, Component, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeConvexProvider } from "@/components/SafeConvexProvider";
import { EnhancedErrorBoundary } from "@/components/error/EnhancedErrorBoundary";
import { GA4PageTracker } from "./components/analytics/GA4PageTracker";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { CanonicalLink } from "./components/seo/CanonicalLink";
import { LoadingState } from "./components/LoadingState";

/**
 * Catches dynamic import (chunk) 404 errors that occur when the browser has
 * cached the old index.html but a new deploy replaced the asset filenames.
 * Triggers a single hard-reload to fetch fresh assets.
 */
class ChunkErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    const isChunk =
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.message?.includes('error loading dynamically imported module');
    return { hasError: isChunk };
  }

  componentDidCatch(error: Error) {
    const isChunk =
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.message?.includes('error loading dynamically imported module');
    if (isChunk) {
      const RELOAD_KEY = '__gnx_chunk_reload__';
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return <LoadingState />;
    }
    return this.props.children;
  }
}

// Lazy-loaded routes for better initial load and smaller bundles
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ArticlePage = lazy(() => import("./pages/Article"));
const IndexSimple = lazy(() => import("./pages/IndexSimple"));
const EnhancedIndex = lazy(() => import("./pages/EnhancedIndex"));
const EnhancedIndexSimple = lazy(() => import("./pages/EnhancedIndexSimple"));
const Tech = lazy(() => import("./pages/Tech"));
const Security = lazy(() => import("./pages/Security"));
const Gaming = lazy(() => import("./pages/Gaming"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));
const RoadmapV3 = lazy(() => import("./pages/RoadmapV3"));
const RoadmapFeature = lazy(() => import("./pages/RoadmapFeature"));
const BlogSeries = lazy(() => import("./pages/BlogSeries"));
const Explore = lazy(() => import("./pages/Explore"));
const Topics = lazy(() => import("./pages/Topics"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const News = lazy(() => import("./pages/News"));
const AIPulse = lazy(() => import("./pages/AIPulse"));
const BreachSim = lazy(() => import("./pages/BreachSim"));
const LiveThreatDashboard = lazy(() => import("./pages/LiveThreatDashboard"));
const SecurityScore = lazy(() => import("./pages/SecurityScore"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const CommunityForums = lazy(() => import("./pages/CommunityForums"));
const SecurityScanner = lazy(() => import("./pages/SecurityScanner"));
const APIAccess = lazy(() => import("./pages/APIAccess"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const PodcastPlatform = lazy(() => import("./pages/PodcastPlatform"));
const AdvancedSearch = lazy(() => import("./components/search/AdvancedSearch"));
const LiveUpdatesFeed = lazy(() => import("./components/live/LiveUpdatesFeed"));
const SignInSignUp = lazy(() => import("./components/auth/SignInSignUp"));
const TestFeatures = lazy(() => import("./pages/TestFeatures"));
const NewsletterVerify = lazy(() => import("./pages/NewsletterVerify"));

const queryClient = new QueryClient();

const App = () => (
  <EnhancedErrorBoundary>
    <BrowserRouter>
      <SafeConvexProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                <CanonicalLink />
                <Toaster />
                <Sonner />
                <GA4PageTracker />
                <ChunkErrorBoundary>
                <Suspense fallback={<LoadingState />}>
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
                </Suspense>
                </ChunkErrorBoundary>
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeConvexProvider>
    </BrowserRouter>
  </EnhancedErrorBoundary>
);

export default App;
