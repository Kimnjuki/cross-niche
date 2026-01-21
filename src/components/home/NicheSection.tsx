import { Link } from 'react-router-dom';
import { Article, Niche } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Shield, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NicheSectionProps {
  niche: Niche;
  articles: Article[];
}

const nicheConfig = {
  tech: {
    title: 'Innovate',
    subtitle: 'Technology & Hardware',
    icon: Cpu,
    href: '/tech',
    gradient: 'gradient-tech',
    color: 'text-tech',
    buttonClass: 'bg-tech hover:bg-tech/90',
  },
  security: {
    title: 'Secured',
    subtitle: 'Cybersecurity & Privacy',
    icon: Shield,
    href: '/security',
    gradient: 'gradient-security',
    color: 'text-security',
    buttonClass: 'bg-security hover:bg-security/90',
  },
  gaming: {
    title: 'Play',
    subtitle: 'Gaming & Esports',
    icon: Gamepad2,
    href: '/gaming',
    gradient: 'gradient-gaming',
    color: 'text-gaming',
    buttonClass: 'bg-gaming hover:bg-gaming/90',
  },
};

export function NicheSection({ niche, articles }: NicheSectionProps) {
  const config = nicheConfig[niche];
  const Icon = config.icon;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', config.gradient)}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={cn('font-display font-bold text-2xl', config.color)}>
                {config.title} - {niche === 'tech' ? 'Technology News' : niche === 'security' ? 'Cybersecurity Updates' : 'Gaming News'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {config.subtitle}
                {niche === 'tech' && ' - Latest on artificial intelligence, machine learning, cloud computing, and tech innovations'}
                {niche === 'security' && ' - Breaking cybersecurity news, data privacy, network security, and threat intelligence'}
                {niche === 'gaming' && ' - Gaming news, reviews, virtual reality, and gaming hardware'}
              </p>
            </div>
          </div>
          <Button asChild variant="ghost" className={cn('gap-2', config.color)}>
            <Link to={config.href}>
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
