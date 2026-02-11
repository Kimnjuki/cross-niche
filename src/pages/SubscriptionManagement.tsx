import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  CreditCard, 
  Calendar, 
  Download, 
  Settings, 
  HelpCircle,
  Check,
  X,
  Crown,
  Star
} from 'lucide-react';

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  // Mock user data
  const userSubscription = {
    plan: 'pro',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2026-03-11',
    monthlyPrice: 9.99,
    yearlyPrice: 95.88,
    memberSince: '2025-12-01',
    usageStats: {
      articlesRead: 1247,
      searchesPerformed: 342,
      downloadsCount: 89,
      apiCalls: 15678
    }
  };

  const invoices = [
    {
      id: 'inv-001',
      date: '2026-02-01',
      amount: 9.99,
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'inv-002',
      date: '2026-02-01',
      amount: 95.88,
      status: 'paid',
      description: 'Pro Plan - Yearly (Save 20%)'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Crown className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">The Grid Nexus</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                to="/subscription" 
                className="text-primary border-b-2 border-primary px-1 pb-4"
              >
                Subscription
              </Link>
              <Link to="/billing" className="text-muted-foreground hover:text-foreground">
                Billing
              </Link>
              <Link to="/settings" className="text-muted-foreground hover:text-foreground">
                Settings
              </Link>
              <Button variant="outline" size="sm">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Subscription Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Crown className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-semibold">Pro Plan</div>
                        <div className="text-sm text-muted-foreground">Monthly Billing</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$9.99</div>
                      <div className="text-sm text-muted-foreground">/month</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge variant="default" className="ml-2">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Next Billing</div>
                    <div className="font-semibold">March 11, 2026</div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Member Since</div>
                      <div className="font-semibold">December 1, 2025</div>
                    </div>
                    <div className="text-sm text-muted-foreground">14 months</div>
                  </div>

                  {/* Usage Stats */}
                  <div className="p-4">
                    <h4 className="font-semibold mb-4">Usage This Month</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">1,247</div>
                        <div className="text-sm text-muted-foreground">Articles Read</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-tech">342</div>
                        <div className="text-sm text-muted-foreground">Searches Performed</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-gaming">89</div>
                        <div className="text-sm text-muted-foreground">Downloads</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-security">15,678</div>
                        <div className="text-sm text-muted-foreground">API Calls</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="payment">Payment Method</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Current Payment Method</h4>
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <div className="font-medium">••••• 4242</div>
                            <div className="text-sm text-muted-foreground">Visa ending in 4242</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Update Payment Method
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Billing Cycle</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="font-medium">Monthly Billing</div>
                            <div className="text-sm text-muted-foreground">Save 20% with yearly</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Switch to Yearly
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Auto-Renewal</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="font-medium">Enabled</div>
                            <div className="text-sm text-green-600">Saves you time and prevents interruptions</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage Auto-Renewal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="payment">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <CardHeader>
                            <CardTitle>Add Payment Method</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Card Number</label>
                              <input 
                                type="text" 
                                className="w-full p-2 border rounded-md"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name on Card</label>
                              <input 
                                type="text" 
                                className="w-full p-2 border rounded-md"
                                placeholder="John Doe"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Expiry Date</label>
                              <input 
                                type="text" 
                                className="w-full p-2 border rounded-md"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">CVV</label>
                              <input 
                                type="text" 
                                className="w-full p-2 border rounded-md"
                                placeholder="123"
                                maxLength={3}
                              />
                            </div>
                            <Button className="w-full">Add Payment Method</Button>
                          </CardContent>
                        </Card>

                        <Card className="p-4">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              PayPal
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground mb-4">
                              Connect your PayPal account for seamless billing
                            </p>
                            <Button className="w-full">
                              <Settings className="h-4 w-4 mr-2" />
                              Connect PayPal Account
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="invoices">
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <Card key={invoice.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium">Invoice #{invoice.id}</div>
                                <div className="text-sm text-muted-foreground">{invoice.date}</div>
                              </div>
                              <Badge 
                                variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                className="ml-2"
                              >
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="font-semibold">${invoice.amount}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{invoice.description}</div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button variant="outline" size="sm">
                              <HelpCircle className="h-4 w-4 mr-2" />
                              Get Help
                            </Button>
                          </div>
                        </CardContent>
                        </Card>
                      ))}
                      
                      <div className="mt-6 text-center">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download All Invoices
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
