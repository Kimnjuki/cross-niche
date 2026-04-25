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
const HomepageCommandCenter = lazy(() => import("./pages/HomepageCommandCenter"));
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
const ToolsHub = lazy(() => import("./pages/ToolsHub"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const PodcastPlatform = lazy(() => import("./pages/PodcastPlatform"));
const AdvancedSearch = lazy(() => import("./components/search/AdvancedSearch"));
const LiveUpdatesFeed = lazy(() => import("./components/live/LiveUpdatesFeed"));
const SignInSignUp = lazy(() => import("./components/auth/SignInSignUp"));
const TestFeatures = lazy(() => import("./pages/TestFeatures"));
const NewsletterVerify = lazy(() => import("./pages/NewsletterVerify"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Editorial = lazy(() => import("./pages/Editorial"));
const Media = lazy(() => import("./pages/Media"));
const Disclosure = lazy(() => import("./pages/Disclosure"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Startups = lazy(() => import("./pages/Startups"));
const QualityGuidelines = lazy(() => import("./pages/QualityGuidelines"));
const ContentPolicy = lazy(() => import("./pages/ContentPolicy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NexusIntersection = lazy(() => import("./pages/NexusIntersectionEnhanced"));
const Author = lazy(() => import("./pages/Author"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Profile = lazy(() => import("./pages/Profile"));
// Nexus AI Features
const NexusGuard = lazy(() => import("./pages/tools/NexusGuard"));
const SecurityBriefingRoom = lazy(() => import("./pages/SecurityBriefingRoom"));
const VRCyberTraining = lazy(() => import("./pages/VRCyberTraining"));
const SteamScanner = lazy(() => import("./pages/tools/SteamScanner"));
const NexusPath = lazy(() => import("./pages/learn/NexusPath"));
const NexusPulse = lazy(() => import("./pages/pulse/NexusPulse"));
// Security Tools Suite
const IOCLookup = lazy(() => import("./pages/tools/IOCLookup"));
const GamingSecurityCheckup = lazy(() => import("./pages/tools/GamingSecurityCheckup"));
const BreachExplainer = lazy(() => import("./pages/tools/BreachExplainer"));
const AIToolFinder = lazy(() => import("./pages/tools/AIToolFinder"));
const PatchRiskTracker = lazy(() => import("./pages/tools/PatchRiskTracker"));
const ZeroTrustQuiz = lazy(() => import("./pages/tools/ZeroTrustQuiz"));
const ExploitRiskMeter = lazy(() => import("./pages/tools/ExploitRiskMeter"));

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
                    <Route path="/original-index" element={<HomepageCommandCenter />} />
                    <Route path="/simple" element={<IndexSimple />} />
                    <Route path="/enhanced" element={<EnhancedIndex />} />
                    <Route path="/enhanced-simple" element={<EnhancedIndexSimple />} />
                    <Route path="/tech" element={<Tech />} />
                    <Route path="/tech/:slug" element={<ArticlePage />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/security/:slug" element={<ArticlePage />} />
                    <Route path="/cybersecurity" element={<Navigate to="/security" replace />} />
                    <Route path="/gaming" element={<Gaming />} />
                    <Route path="/gaming/:slug" element={<ArticlePage />} />
                    <Route path="/article/:slug" element={<ArticlePage />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/topics" element={<Topics />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/guides/:slug" element={<GuideDetail />} />
                    <Route path="/tutorials" element={<Tutorials />} />
                    <Route path="/blog-series" element={<Navigate to="/blog" replace />} />
                    <Route path="/blog" element={<BlogSeries />} />
                    {/* Legacy URL aliases (Phase 1 SEO 404/4XX fixes) */}
                    <Route path="/articles" element={<Navigate to="/blog" replace />} />
                    <Route path="/live" element={<Navigate to="/live-updates" replace />} />
                    <Route path="/ai" element={<Navigate to="/ai-pulse" replace />} />
                    <Route path="/security-tools" element={<Navigate to="/tools/security-scanner" replace />} />
                    <Route path="/roadmap" element={<RoadmapV3 />} />
                    <Route path="/roadmap/:featureId" element={<RoadmapFeature />} />
                    <Route path="/breach-sim" element={<BreachSim />} />
                    <Route path="/security-score" element={<SecurityScore />} />
                    <Route path="/live-threat-dashboard" element={<LiveThreatDashboard />} />
                    <Route path="/subscription" element={<SubscriptionPlans />} />
                    <Route path="/subscription/management" element={<SubscriptionManagement />} />
                    {/* 301-equivalent client-side redirects for duplicate-render aliases */}
                    <Route path="/billing" element={<Navigate to="/subscription/management" replace />} />
                    <Route path="/settings" element={<Navigate to="/subscription/management" replace />} />
                    <Route path="/forums" element={<CommunityForums />} />
                    <Route path="/tools/security-scanner" element={<SecurityScanner />} />
                    <Route path="/tools" element={<ToolsHub />} />
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
                    {/* Company / legal pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/editorial" element={<Editorial />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/disclosure" element={<Disclosure />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/startups" element={<Startups />} />
                    <Route path="/quality-guidelines" element={<QualityGuidelines />} />
                    <Route path="/content-policy" element={<ContentPolicy />} />
                    {/* Utility pages */}
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/nexus-intersection" element={<NexusIntersection />} />
                    {/* User account pages */}
                    <Route path="/author/:authorSlug" element={<Author />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Nexus AI Features */}
                    <Route path="/tools/nexusguard" element={<NexusGuard />} />
<Route path="/tools/security-briefing" element={<SecurityBriefingRoom />} />
<Route path="/tools/vr-cyber-training" element={<VRCyberTraining />} />
                    <Route path="/tools/steam-scanner" element={<SteamScanner />} />
                    <Route path="/nexus/nexusguard" element={<Navigate to="/tools/nexusguard" replace />} />
                    <Route path="/learn/nexus-path" element={<NexusPath />} />
                    <Route path="/nexus/nexuspath" element={<Navigate to="/learn/nexus-path" replace />} />
                    <Route path="/pulse/nexus-pulse" element={<NexusPulse />} />
                    <Route path="/nexus/nexuspulse" element={<Navigate to="/pulse/nexus-pulse" replace />} />
                    {/* Security Tools Suite */}
                    <Route path="/tools/ioc-lookup" element={<IOCLookup />} />
                    <Route path="/tools/gaming-security-checkup" element={<GamingSecurityCheckup />} />
                    <Route path="/tools/breach-explainer" element={<BreachExplainer />} />
                    <Route path="/tools/ai-tool-finder" element={<AIToolFinder />} />
                    <Route path="/tools/patch-risk-tracker" element={<PatchRiskTracker />} />
                    <Route path="/tools/zero-trust-quiz" element={<ZeroTrustQuiz />} />
                    <Route path="/tools/exploit-risk-meter" element={<ExploitRiskMeter />} />
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
