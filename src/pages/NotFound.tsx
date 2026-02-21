import { Link } from "react-router-dom";
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';
import { Home, ArrowLeft, TrendingUp, Shield, Gamepad2 } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <SEOHead
        title="Page Not Found | The Grid Nexus"
        description="The page you're looking for doesn't exist. Explore our tech news, cybersecurity insights, and gaming coverage."
        keywords={['404', 'page not found', 'tech news', 'cybersecurity', 'gaming']}
        url={window.location.href}
        type="website"
        noindex={true}
      />
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* Internal Links Section - SEO Best Practice */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">Explore Our Content</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Discover the latest in technology, cybersecurity, and gaming:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/tech" 
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <TrendingUp className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Tech News</h3>
                <p className="text-sm text-muted-foreground">Latest technology trends and innovations</p>
              </Link>
              <Link 
                to="/security" 
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <Shield className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Cybersecurity</h3>
                <p className="text-sm text-muted-foreground">Security threats and protection strategies</p>
              </Link>
              <Link 
                to="/gaming" 
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <Gamepad2 className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Gaming</h3>
                <p className="text-sm text-muted-foreground">Gaming news, reviews, and guides</p>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/guides" className="text-primary hover:underline">Guides</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/topics" className="text-primary hover:underline">Topics</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/about" className="text-primary hover:underline">About</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
