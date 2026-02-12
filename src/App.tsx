import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeConvexProvider } from "@/components/SafeConvexProvider";
import { EnhancedErrorBoundary } from "@/components/error/EnhancedErrorBoundary";
import Index from "./pages/Index";
import IndexSimple from "./pages/IndexSimple";
import EnhancedIndex from "./pages/EnhancedIndex";
import EnhancedIndexSimple from "./pages/EnhancedIndexSimple";
import Auth from "./pages/Auth";
import Tech from "./pages/Tech";
import Security from "./pages/Security";
import Gaming from "./pages/Gaming";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Article from "./pages/Article";
import Bookmarks from "./pages/Bookmarks";
import SecurityScore from "./pages/SecurityScore";
import Disclosure from "./pages/Disclosure";
import Roadmap from "./pages/Roadmap";
import About from "./pages/About";
import Editorial from "./pages/Editorial";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BlogSeries from "./pages/BlogSeries";
import Explore from "./pages/Explore";
import Topics from "./pages/Topics";
import Tutorials from "./pages/Tutorials";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import AuthConfirm from "./pages/AuthConfirm";
import Reviews from "./pages/Reviews";
import Author from "./pages/Author";
import Media from "./pages/Media";
import News from "./pages/News";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import CommunityForums from "./pages/CommunityForums";
import SecurityScanner from "./pages/SecurityScanner";
import APIAccess from "./pages/APIAccess";
import MobileApp from "./pages/MobileApp";
import PodcastPlatform from "./pages/PodcastPlatform.tsx";
import { GA4PageTracker } from "./components/analytics/GA4PageTracker";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import AdvancedSearch from "./components/search/AdvancedSearch";
import LiveUpdatesFeed from "./components/live/LiveUpdatesFeed";
import AIPulseEngine from "./components/ai/AIPulseEngine";
import SignInSignUp from "./components/auth/SignInSignUp";
import TestFeatures from "./pages/TestFeatures";

const queryClient = new QueryClient();

const App = () => (
  <EnhancedErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-gray-900 text-white p-8">
              <h1 className="text-4xl font-bold mb-4">GridNexus - Debug Mode</h1>
              <p>React is loading successfully!</p>
              <div className="mt-8 space-y-4">
                <a href="/test-features" className="text-blue-400 hover:text-blue-300 underline block">
                  Test Features →
                </a>
                <a href="/search" className="text-green-400 hover:text-green-300 underline block">
                  Advanced Search →
                </a>
                <a href="/ai-pulse" className="text-purple-400 hover:text-purple-300 underline block">
                  AI Pulse →
                </a>
              </div>
            </div>
          } />
          <Route path="/test-features" element={<TestFeatures />} />
          <Route path="/search" element={
            <div className="min-h-screen bg-gray-900 text-white p-8">
              <h1 className="text-4xl font-bold mb-4">Advanced Search</h1>
              <p>Search component loading test...</p>
            </div>
          } />
          <Route path="/ai-pulse" element={
            <div className="min-h-screen bg-gray-900 text-white p-8">
              <h1 className="text-4xl font-bold mb-4">AI Pulse</h1>
              <p>AI Pulse component loading test...</p>
            </div>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </EnhancedErrorBoundary>
);

export default App;
