import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for individuals getting started',
    features: [
      'Basic content aggregation (5 sources)',
      'Limited AI editor features (10 AI requests/day)',
      'Public collections only',
      'Basic search',
      'Mobile web access',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 12,
    annualPrice: 120, // $10/month when annual
    description: 'For content creators and professionals',
    features: [
      'Unlimited content sources',
      'Full AI editor (500 AI requests/month)',
      'Private collections',
      'Advanced search with filters',
      'Browser extension',
      'Export capabilities',
      'Collaboration (3 team members)',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  team: {
    name: 'Team',
    monthlyPrice: 39,
    annualPrice: 390, // $32.50/month when annual
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Unlimited AI requests',
      'Team workspaces (unlimited members)',
      'Advanced collaboration features',
      'Custom workflows',
      'API access',
      'SSO integration',
      'Admin controls',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
};

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={cn(!isAnnual && 'font-semibold')}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={cn(isAnnual && 'font-semibold')}>
              Annual
              <Badge variant="secondary" className="ml-2">Save 17%</Badge>
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const displayPrice = price === 0 ? 'Free' : `$${isAnnual ? price / 12 : price}`;
            const period = price === 0 ? '' : isAnnual ? '/month billed annually' : '/month';

            return (
              <Card
                key={key}
                className={cn(
                  'relative',
                  plan.popular && 'border-primary shadow-lg scale-105'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{displayPrice}</span>
                    {period && (
                      <span className="text-muted-foreground ml-2">{period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className={cn(
                      'w-full mb-6',
                      plan.popular ? 'bg-primary' : 'bg-secondary'
                    )}
                    variant={plan.popular ? 'default' : 'secondary'}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom solution? <a href="/contact" className="text-primary hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}



