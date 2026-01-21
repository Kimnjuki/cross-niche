import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Tech from "./pages/Tech";
import Security from "./pages/Security";
import Gaming from "./pages/Gaming";
import Guides from "./pages/Guides";
import Article from "./pages/Article";
import Bookmarks from "./pages/Bookmarks";
import SecurityScore from "./pages/SecurityScore";
import Disclosure from "./pages/Disclosure";
import Roadmap from "./pages/Roadmap";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BlogSeries from "./pages/BlogSeries";
import Topics from "./pages/Topics";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import AuthConfirm from "./pages/AuthConfirm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/auth/reset-password" element={<Auth />} />
            <Route path="/tech" element={<Tech />} />
            <Route path="/security" element={<Security />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/security-score" element={<SecurityScore />} />
            <Route path="/disclosure" element={<Disclosure />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog-series" element={<BlogSeries />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
