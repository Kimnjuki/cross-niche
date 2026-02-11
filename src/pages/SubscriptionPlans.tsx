import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Crown, Star, Zap, Shield, Users } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  badge?: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'monthly',
    features: [
      'Access to all articles',
      'Basic search functionality',
      'Community forum access',
      'Weekly newsletter'
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    period: 'monthly',
    features: [
      'Everything in Free',
      'Advanced search with filters',
      'Ad-free browsing experience',
      'Early access to breaking news',
      'Premium article series access',
      'Downloadable resources',
      'Email support'
    ],
    badge: 'Most Popular',
    popular: true,
    icon: <Star className="h-6 w-6" />
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    period: 'monthly',
    features: [
      'Everything in Pro',
      'Team collaboration tools',
      'API access for developers',
      'Custom integrations',
      'Priority support',
      'Advanced analytics dashboard',
      'White-label options'
    ],
    badge: 'Best Value',
    icon: <Crown className="h-6 w-6" />
  }
];

export function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  const getYearlyPrice = (monthlyPrice: number) => Math.round(monthlyPrice * 12 * 0.8);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                <Zap className="h-4 w-4 mr-2" />
                Unlock Premium Features
              </Badge>
              <h1 className="text-4xl font-bold mb-4">
                Get More from The Grid Nexus
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Access exclusive content, advanced tools, and support our independent tech journalism
              </p>
            </div>
            
            {/* Billing Period Toggle */}
            <div className="flex justify-center mb-8">
              <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-background/50 data-[state=active]:text-foreground">
                    Monthly Billing
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="data-[state=active]:bg-background/50 data-[state=active]:text-foreground">
                    Yearly Billing <span className="ml-2 text-green-600 font-semibold">(Save 20%)</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`relative overflow-hidden ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''} transition-all duration-200`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {plan.icon}
                        <div>
                          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                          {plan.badge && (
                            <Badge variant="secondary" className="ml-2">
                              {plan.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {plan.popular && (
                        <Badge variant="default" className="animate-pulse">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-center">
                      {/* Price */}
                      <div className="mb-6">
                        {plan.price === 0 ? (
                          <div className="text-3xl font-bold">Free</div>
                        ) : (
                          <div>
                            <div className="text-4xl font-bold">
                              ${billingPeriod === 'yearly' ? getYearlyPrice(plan.price) : plan.price}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {billingPeriod === 'yearly' ? 'per year' : 'per month'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <div className="space-y-3">
                        {plan.id === 'free' ? (
                          <Button variant="outline" className="w-full" asChild>
                            <Link to="/signup">
                              Current Plan - Continue Free
                            </Link>
                          </Button>
                        ) : (
                          <div>
                            <Button 
                              className={`w-full ${selectedPlan === plan.id ? 'bg-primary text-primary-foreground' : ''}`}
                              onClick={() => setSelectedPlan(plan.id)}
                            >
                              {selectedPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
                            </Button>
                            {selectedPlan !== plan.id && (
                              <Button variant="outline" className="w-full mt-2">
                                Start Free Trial
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Feature Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Feature</th>
                          <th className="text-center p-3 font-semibold">Free</th>
                          <th className="text-center p-3 font-semibold">Pro</th>
                          <th className="text-center p-3 font-semibold">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Article Access',
                          'Search & Filters',
                          'Ad-Free Experience',
                          'Early News Access',
                          'Premium Content',
                          'Downloadable Resources',
                          'Email Support',
                          'API Access',
                          'Team Tools',
                          'Priority Support'
                        ].map((feature) => (
                          <tr key={feature} className="border-b">
                            <td className="p-3 font-medium">{feature}</td>
                            <td className="p-3 text-center">
                              {subscriptionPlans[0].features.includes(feature) ? '✅' : '❌'}
                            </td>
                            <td className="p-3 text-center">
                              {subscriptionPlans[1].features.includes(feature) ? '✅' : '❌'}
                            </td>
                            <td className="p-3 text-center">
                              {subscriptionPlans[2].features.includes(feature) ? '✅' : '❌'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        q: 'What payment methods do you accept?',
                        a: 'We accept all major credit cards, PayPal, and cryptocurrency payments.'
                      },
                      {
                        q: 'Can I change plans anytime?',
                        a: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time with no penalties.'
                      },
                      {
                        q: 'Is there a free trial?',
                        a: 'Yes! Pro plans come with a 14-day free trial. No credit card required.'
                      },
                      {
                        q: 'Do you offer student discounts?',
                        a: 'We offer 50% off all plans for verified students and educators.'
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-semibold mb-2">{faq.q}</h4>
                        <p className="text-muted-foreground">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to upgrade your experience?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of tech professionals who trust The Grid Nexus for their daily intelligence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/signup">
                  Start Free Pro Trial
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
