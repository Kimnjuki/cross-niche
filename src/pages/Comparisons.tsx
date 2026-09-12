import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { ComparisonTable } from '@/components/seo/ComparisonTable';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Star,
  ArrowRight,
  Shield,
  Cpu,
  Gamepad2,
} from 'lucide-react';

export default function Comparisons() {
  return (
    <Layout>
      <SEOHead
        title="Best Tech, Security & Gaming Comparisons 2026 | The Grid Nexus"
        description="Expert comparisons of the best tech products, security tools, antivirus software, gaming hardware, and game reviews. Make informed decisions with our in-depth analysis."
        url="https://thegridnexus.com/comparisons"
        type="website"
        keywords={[
          'best antivirus gaming',
          'gaming pc comparison',
          'security tools comparison',
          'best gaming GPU 2026',
          'game reviews',
          'tech comparisons',
          'product reviews',
          'buying guides',
        ]}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 text-slate-900">
            Comparisons & Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert comparisons and buying guides to help you make informed decisions. We test, analyze, and compare so you don't have to.
          </p>
        </div>

        {/* Antivirus Comparison */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-security" />
            <h2 className="font-display font-bold text-2xl">Best Gaming Antivirus 2026</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            We tested 12 antivirus solutions with gaming mode features. Here are the results.
          </p>
          <ComparisonTable
            caption="Best gaming antivirus comparison"
            headers={['Product', 'Gaming Mode', 'FPS Impact', 'Price', 'Rating']}
            rows={[
              { Product: 'Bitdefender', 'Gaming Mode': 'Yes', 'FPS Impact': '<1%', Price: '$39.99/yr', Rating: '★★★★★' },
              { Product: 'Norton 360', 'Gaming Mode': 'Yes', 'FPS Impact': '<2%', Price: '$49.99/yr', Rating: '★★★★☆' },
              { Product: 'ESET NOD32', 'Gaming Mode': 'Yes', 'FPS Impact': '<1%', Price: '$39.99/yr', Rating: '★★★★☆' },
              { Product: 'Kaspersky', 'Gaming Mode': 'Yes', 'FPS Impact': '1-2%', Price: '$44.99/yr', Rating: '★★★★☆' },
              { Product: 'McAfee', 'Gaming Mode': 'Yes', 'FPS Impact': '2-3%', Price: '$39.99/yr', Rating: '★★★☆☆' },
            ]}
          />
          <Link to="/article/gaming-pc-antivirus-best-2026" className="text-primary hover:underline flex items-center gap-1 mt-4">
            Read the full review <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* GPU Comparison */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-6 w-6 text-tech" />
            <h2 className="font-display font-bold text-2xl">Best Gaming GPU 2026 (1440p)</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            RX 9070 XT vs RTX 5080 vs RX 9070 vs RTX 5070: Which 1440p GPU offers the best value in 2026?
          </p>
          <ComparisonTable
            caption="Best 1440p gaming GPU comparison"
            headers={['GPU', 'VRAM', 'Price', '1440p Avg FPS', 'Ray Tracing', 'DLSS/FSR']}
            rows={[
              { GPU: 'RX 9070 XT', VRAM: '16GB GDDR6', Price: '$449', '1440p Avg FPS': '142', 'Ray Tracing': 'Yes', 'DLSS/FSR': 'FSR 3' },
              { GPU: 'RTX 5080', VRAM: '16GB GDDR7', Price: '$599', '1440p Avg FPS': '158', 'Ray Tracing': 'Yes', 'DLSS/FSR': 'DLSS 4' },
              { GPU: 'RX 9070', VRAM: '16GB GDDR6', Price: '$349', '1440p Avg FPS': '118', 'Ray Tracing': 'Yes', 'DLSS/FSR': 'FSR 3' },
              { GPU: 'RTX 5070', VRAM: '12GB GDDR7', Price: '$449', '1440p Avg FPS': '125', 'Ray Tracing': 'Yes', 'DLSS/FSR': 'DLSS 4' },
            ]}
          />
          <Link to="/article/best-gaming-gpu-1440p-2026-rx-9070-xt-vs-rtx-5080" className="text-primary hover:underline flex items-center gap-1 mt-4">
            Read the full comparison <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* Gaming PC Comparison */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-6 w-6 text-gaming" />
            <h2 className="font-display font-bold text-2xl">Best Gaming PC Under $1000 (2026)</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            We built and tested 5 gaming PCs under $1000. Here's how they compare for 1080p and 1440p gaming.
          </p>
          <ComparisonTable
            caption="Best gaming PC under $1000 comparison"
            headers={['Build', 'CPU', 'GPU', 'RAM', 'Storage', 'Price', 'Score']}
            rows={[
              { Build: 'Budget King', CPU: 'Ryzen 5 7600', GPU: 'RX 9070', RAM: '16GB DDR5', Storage: '1TB NVMe', Price: '$899', Score: '8.5/10' },
              { Build: 'Intel Value', CPU: 'i5-14400F', GPU: 'RTX 5070', RAM: '16GB DDR5', Storage: '1TB NVMe', Price: '$949', Score: '8.2/10' },
              { Build: 'AMD Value', CPU: 'Ryzen 5 7500F', GPU: 'RX 9070 XT', RAM: '16GB DDR5', Storage: '1TB NVMe', Price: '$979', Score: '8.8/10' },
              { Build: 'NVIDIA Value', CPU: 'i5-13400F', GPU: 'RTX 4060 Ti', RAM: '16GB DDR5', Storage: '1TB NVMe', Price: '$849', Score: '7.5/10' },
            ]}
          />
          <Link to="/article/best-gaming-pc-under-1000-2026" className="text-primary hover:underline flex items-center gap-1 mt-4">
            Read the full guide <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* Game Reviews */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="font-display font-bold text-2xl">Latest Game Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Crimson Desert</CardTitle>
                <CardDescription>Pearl Abyss | PS5, Xbox, PC</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">8.5/10</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stunning open-world RPG with intense combat and beautiful graphics. Launch performance issues on PC.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">WWE 2K26</CardTitle>
                <CardDescription>Visual Concepts | PS5, Xbox, PC</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">7.8/10</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Improved gameplay and new sandbox mode. Storylines and community creations shine.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Helldivers 2: Warbond</CardTitle>
                <CardDescription>Arrowhead | PS5, PC</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">9.0/10</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Force of Law warbond adds compelling new weapons and armor. Live service model continues to impress.
                </p>
              </CardContent>
            </Card>
          </div>
          <Link to="/reviews" className="text-primary hover:underline flex items-center gap-1 mt-4">
            View all reviews <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* Buying Guides */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl mb-4">Buying Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/article/best-gaming-pc-under-1000-2026" className="group p-4 border border-border rounded-lg hover:border-tech/50 transition-all">
              <h3 className="font-semibold mb-1 group-hover:text-tech">Best Gaming PC Under $1000</h3>
              <p className="text-sm text-muted-foreground">5 pre-built and DIY options tested for 1080p and 1440p gaming.</p>
            </Link>
            <Link to="/article/best-gaming-gpu-1440p-2026-rx-9070-xt-vs-rtx-5080" className="group p-4 border border-border rounded-lg hover:border-tech/50 transition-all">
              <h3 className="font-semibold mb-1 group-hover:text-tech">Best 1440p GPU 2026</h3>
              <p className="text-sm text-muted-foreground">RX 9070 XT vs RTX 5080: Which GPU wins at 1440p?</p>
            </Link>
            <Link to="/article/gaming-pc-antivirus-best-2026" className="group p-4 border border-border rounded-lg hover:border-security/50 transition-all">
              <h3 className="font-semibold mb-1 group-hover:text-security">Best Gaming Antivirus</h3>
              <p className="text-sm text-muted-foreground">Antivirus solutions that won't impact your gaming performance.</p>
            </Link>
            <Link to="/article/steam-deck-2-specs-release-date-leaks" className="group p-4 border border-border rounded-lg hover:border-gaming/50 transition-all">
              <h3 className="font-semibold mb-1 group-hover:text-gaming">Steam Deck 2 vs OLED</h3>
              <p className="text-sm text-muted-foreground">Should you upgrade? Full comparison of specs, performance, and pricing.</p>
            </Link>
          </div>
        </section>

        {/* Listicle: Top X */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl mb-4">Top Lists & Roundups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/article/ps5-xbox-pc-games-2026-release-calendar" className="group p-4 border border-border rounded-lg hover:border-gaming/50 transition-all">
              <h3 className="font-semibold mb-1 group-hover:text-gaming">2026 Game Release Calendar</h3>
              <p className="text-sm text-muted-foreground">PS5, Xbox, and PC games releasing in 2026.</p>
            </Link>
            <Link to="/article/fortnite-valorant-updates-2026-security-patches" className="group p-4 border border-border rounded-lg hover:border-gaming/50 transition-all">
              <h3 className="font-semibold mb-1 group-hover:text-gaming">Fortnite & Valorant Security Updates</h3>
              <p className="text-sm text-muted-foreground">Latest anti-cheat and security patches for competitive shooters.</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border pt-12">
          <Card>
            <CardHeader>
              <CardTitle>Need a Custom Comparison?</CardTitle>
              <CardDescription>
                We regularly update our comparisons as new products launch. Subscribe to get notified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link to="/newsletter/verify" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Subscribe for Updates
                </Link>
                <Link to="/reviews" className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                  Browse All Reviews
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
