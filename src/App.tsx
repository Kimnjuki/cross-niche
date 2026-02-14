import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeConvexProvider } from "@/components/SafeConvexProvider";
import { EnhancedErrorBoundary } from "@/components/error/EnhancedErrorBoundary";
import { GA4PageTracker } from "./components/analytics/GA4PageTracker";
import { ThemeProvider } from "./components/theme/ThemeProvider";

// Critical path: eager load
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArticlePage from "./pages/Article";

// Lazy-loaded routes (code splitting)
const IndexSimple = lazy(() => import("./pages/IndexSimple"));
const EnhancedIndex = lazy(() => import("./pages/EnhancedIndex"));
const EnhancedIndexSimple = lazy(() => import("./pages/EnhancedIndexSimple"));
const Auth = lazy(() => import("./pages/Auth"));
const Tech = lazy(() => import("./pages/Tech"));
const Security = lazy(() => import("./pages/Security"));
const Gaming = lazy(() => import("./pages/Gaming"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const SecurityScore = lazy(() => import("./pages/SecurityScore"));
const SecurityScoreCalculator = lazy(() => import("./components/security/SecurityScoreCalculator").then(m => ({ default: m.SecurityScoreCalculator })));
const Disclosure = lazy(() => import("./pages/Disclosure"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const About = lazy(() => import("./pages/About"));
const Editorial = lazy(() => import("./pages/Editorial"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const BlogSeries = lazy(() => import("./pages/BlogSeries"));
const Explore = lazy(() => import("./pages/Explore"));
const Topics = lazy(() => import("./pages/Topics"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const Profile = lazy(() => import("./pages/Profile"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const AuthConfirm = lazy(() => import("./pages/AuthConfirm"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Author = lazy(() => import("./pages/Author"));
const Media = lazy(() => import("./pages/Media"));
const News = lazy(() => import("./pages/News"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const CommunityForums = lazy(() => import("./pages/CommunityForums"));
const SecurityScanner = lazy(() => import("./pages/SecurityScanner"));
const APIAccess = lazy(() => import("./pages/APIAccess"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const PodcastPlatform = lazy(() => import("./pages/PodcastPlatform"));
const AdvancedSearch = lazy(() => import("./components/search/AdvancedSearch"));
const LiveUpdatesFeed = lazy(() => import("./components/live/LiveUpdatesFeed"));
const AIPulseEngine = lazy(() => import("./components/ai/AIPulseEngine"));
const SignInSignUp = lazy(() => import("./components/auth/SignInSignUp"));
const TestFeatures = lazy(() => import("./pages/TestFeatures"));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <EnhancedErrorBoundary>
    <SafeConvexProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <GA4PageTracker />
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/simple" element={<IndexSimple />} />
                  <Route path="/enhanced" element={<EnhancedIndex />} />
                  <Route path="/enhanced-simple" element={<EnhancedIndexSimple />} />
                  <Route path="/tech" element={<Tech />} />
                  <Route path="/tech/:slug" element={<ArticlePage />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/security/:slug" element={<ArticlePage />} />
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
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/breach-sim" element={<SecurityScanner />} />
                  <Route path="/security-score" element={<SecurityScoreCalculator />} />
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
                  <Route path="/ai-pulse" element={<AIPulseEngine />} />
                  <Route path="/signin" element={<SignInSignUp />} />
                  <Route path="/signup" element={<SignInSignUp />} />
                  <Route path="/test-features" element={<TestFeatures />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeConvexProvider>
  </EnhancedErrorBoundary>
);

export default App;
