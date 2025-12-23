import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Tech from "./pages/Tech";
import Security from "./pages/Security";
import Gaming from "./pages/Gaming";
import Guides from "./pages/Guides";
import Tutorials from "./pages/Tutorials";
import TutorialDetail from "./pages/TutorialDetail";
import Downloads from "./pages/Downloads";
import Article from "./pages/Article";
import Bookmarks from "./pages/Bookmarks";
import Collections from "./pages/Collections";
import RSSFeeds from "./pages/RSSFeeds";
import Search from "./pages/Search";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MitigationGuide from "./pages/MitigationGuide";
import AIEditor from "./pages/AIEditor";
import SecurityScore from "./pages/SecurityScore";
import Disclosure from "./pages/Disclosure";
import ProductReview from "./pages/ProductReview";
import ProductComparison from "./pages/ProductComparison";
import ProductReviews from "./pages/ProductReviews";
import BuyingGuides from "./pages/BuyingGuides";
import BuyingGuideDetail from "./pages/BuyingGuideDetail";
import Tools from "./pages/Tools";
import PSUCalculator from "./pages/tools/PSUCalculator";
import SecurityRiskCalculator from "./pages/tools/SecurityRiskCalculator";
import FPSEstimator from "./pages/tools/FPSEstimator";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tech" element={<Tech />} />
            <Route path="/security" element={<Security />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tutorial/:id" element={<TutorialDetail />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/rss-feeds" element={<RSSFeeds />} />
            <Route path="/search" element={<Search />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guides/:slug" element={<MitigationGuide />} />
            <Route path="/editor" element={<AIEditor />} />
            <Route path="/security-score" element={<SecurityScore />} />
            <Route path="/disclosure" element={<Disclosure />} />
            <Route path="/reviews" element={<ProductReviews />} />
            <Route path="/review/:id" element={<ProductReview />} />
            <Route path="/compare/:id" element={<ProductComparison />} />
            <Route path="/buying-guides" element={<BuyingGuides />} />
            <Route path="/buying-guide/:id" element={<BuyingGuideDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/psu-calculator" element={<PSUCalculator />} />
            <Route path="/tools/security-risk" element={<SecurityRiskCalculator />} />
            <Route path="/tools/fps-estimator" element={<FPSEstimator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
