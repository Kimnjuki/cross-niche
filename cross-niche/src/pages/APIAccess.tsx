import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Key, 
  BookOpen, 
  Users, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Shield, 
  Clock,
  TrendingUp,
  FileText,
  Terminal,
  Settings,
  ExternalLink,
  MessageSquare,
  Eye
} from 'lucide-react';

export default function APIAccess() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [endpoint, setEndpoint] = useState('articles');
  const [method, setMethod] = useState('GET');
  const [testResponse, setTestResponse] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const apiPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      requests: 1000,
      features: [
        'Access to articles API',
        'Basic search endpoints',
        'Community forum access',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      requests: 10000,
      features: [
        'Everything in Starter',
        'Advanced search & filtering',
        'Real-time data streaming',
        'Webhook support',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      requests: 100000,
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option'
      ]
    }
  ];

  const endpoints = [
    { path: '/api/v1/articles', method: 'GET', description: 'Get all articles with pagination' },
    { path: '/api/v1/articles/{id}', method: 'GET', description: 'Get specific article by ID' },
    { path: '/api/v1/articles/search', method: 'GET', description: 'Search articles with filters' },
    { path: '/api/v1/topics', method: 'GET', description: 'Get all topics and categories' },
    { path: '/api/v1/users', method: 'GET', description: 'Get user profiles and activity' },
    { path: '/api/v1/comments', method: 'GET', description: 'Get comments and discussions' },
    { path: '/api/v1/articles', method: 'POST', description: 'Create new article' },
    { path: '/api/v1/comments', method: 'POST', description: 'Add comment to article' },
    { path: '/api/v1/webhooks', method: 'POST', description: 'Configure webhooks for real-time updates' }
  ];

  const handleTestAPI = async () => {
    if (!apiKey.trim()) return;
    
    setIsTesting(true);
    setTestResponse(null);
    
    try {
      const response = await fetch(`https://thegridnexus.com/api/v1/${endpoint}?limit=5`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      setTestResponse({
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResponse({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const codeExamples = {
    javascript: `// JavaScript Example
const apiKey = 'your-api-key-here';

fetch('/api/v1/articles', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
    
    python: `# Python Example
import requests

apiKey = 'your-api-key-here'

headers = {
    'Authorization': f'Bearer {apiKey}',
    'Content-Type': 'application/json'
}

response = requests.get('/api/v1/articles', headers=headers)
data = response.json()
print(data)`,
    
    curl: `# cURL Example
curl -H "Authorization: Bearer your-api-key-here" \\
     -H "Content-Type: application/json" \\
     https://thegridnexus.com/api/v1/articles`
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Code className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">The Grid Nexus</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link to="/api" className="text-primary border-b-2 border-primary px-1 pb-4">
                API Access
              </Link>
              <Link to="/subscription" className="text-muted-foreground hover:text-foreground">
                Subscription
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* API Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2">Powerful RESTful API</h3>
                      <p className="text-muted-foreground">
                        Access The Grid Nexus content and data through our comprehensive API. 
                        Build applications, integrations, and custom solutions with ease.
                      </p>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold mb-3">Core Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            RESTful architecture
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            JSON responses
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Real-time data streaming
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Webhook support
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold mb-3">Data Available</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Articles & news content
                          </li>
                          <li className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            User profiles & activity
                          </li>
                          <li className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Comments & discussions
                          </li>
                          <li className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Topics & categories
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Plans */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Pricing Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiPlans.map((plan) => (
                      <div 
                        key={plan.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="font-semibold">{plan.name}</div>
                            {plan.price > 0 && (
                              <Badge variant="default">${plan.price}/month</Badge>
                            )}
                          </div>
                          {plan.price === 0 && (
                            <Badge variant="secondary">Free</Badge>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground mb-4">
                          {plan.requests.toLocaleString()} requests/month
                        </div>

                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {selectedPlan === plan.id && (
                          <Button className="w-full mt-4">
                            Get Started with {plan.name}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Explorer */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    API Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                      <TabsTrigger value="testing">Testing</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                      <div className="space-y-6">
                        {/* API Key Management */}
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-4">API Key Management</h4>
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <input
                                id="api-key"
                                name="api-key"
                                type="password"
                                placeholder="Enter your API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="flex-1 px-4 py-2 border rounded-md bg-background"
                              />
                              <Button 
                                onClick={() => setShowApiKey(!showApiKey)}
                                variant="outline"
                                size="sm"
                              >
                                {showApiKey ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <Button className="w-full">
                              Generate New Key
                            </Button>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Your API key provides access to The Grid Nexus data. 
                            Keep it secure and never share it publicly.
                          </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-4">Usage Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">1,234</div>
                              <div className="text-sm text-muted-foreground">Requests this month</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-tech">892</div>
                              <div className="text-sm text-muted-foreground">API calls today</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="endpoints" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold mb-4">Available Endpoints</h4>
                        <div className="space-y-3">
                          {endpoints.map((endpoint, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                      {endpoint.method}
                                    </div>
                                    <div className="text-sm text-muted-foreground ml-2">
                                      {endpoint.path}
                                    </div>
                                  </div>
                                  <Badge variant="secondary">{endpoint.method}</Badge>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEndpoint(endpoint.path);
                                    setMethod(endpoint.method);
                                  }}
                                >
                                  Test
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                {endpoint.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="testing" className="mt-6">
                      <div className="space-y-6">
                        <h4 className="font-semibold mb-4">API Testing</h4>
                        
                        {/* Test Configuration */}
                        <div className="p-4 border rounded-lg">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Endpoint</label>
                              <select
                                value={endpoint}
                                onChange={(e) => setEndpoint(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md bg-background"
                              >
                                {endpoints.map((ep) => (
                                  <option key={ep.path} value={ep.path}>
                                    {ep.path}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Method</label>
                              <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md bg-background"
                              >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                              </select>
                            </div>

                            <Button 
                              onClick={handleTestAPI}
                              disabled={isTesting || !apiKey.trim()}
                              className="w-full"
                            >
                              {isTesting ? (
                                <>
                                  <Terminal className="h-4 w-4 mr-2 animate-spin" />
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 mr-2" />
                                  Test API Call
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Test Results */}
                        {testResponse && (
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-4">Test Results</h4>
                            <div className={`p-4 rounded-lg ${
                              testResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                {testResponse.success ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                                <span className="font-semibold">
                                  {testResponse.success ? 'Success' : 'Error'}
                                </span>
                                <Badge variant={testResponse.success ? 'default' : 'destructive'}>
                                  {testResponse.status}
                                </Badge>
                              </div>

                              <div className="text-sm text-muted-foreground mb-2">
                                {new Date(testResponse.timestamp).toLocaleString()}
                              </div>

                              {testResponse.data && (
                                <div className="mt-4">
                                  <h5 className="font-semibold mb-2">Response Data:</h5>
                                  <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-64">
                                    {JSON.stringify(testResponse.data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {testResponse.error && (
                                <div className="mt-4">
                                  <h5 className="font-semibold mb-2 text-red-600">Error:</h5>
                                  <p className="text-sm text-red-600">{testResponse.error}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Documentation */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Documentation & Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                      <TabsTrigger value="testing">Testing</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                      <div className="space-y-6">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-4">Quick Start Guide</h4>
                          <div className="space-y-4 text-sm text-muted-foreground">
                            <p>1. Sign up for an API key above</p>
                            <p>2. Choose your pricing plan based on usage needs</p>
                            <p>3. Use your API key to authenticate requests</p>
                            <p>4. Start building with our comprehensive endpoints</p>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-4">Authentication</h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>All API requests must include your API key in the Authorization header:</p>
                            <div className="bg-muted p-4 rounded font-mono text-xs">
                              Authorization: Bearer your-api-key-here
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="endpoints" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold mb-4">Code Examples</h4>
                        <Tabs defaultValue="javascript">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="javascript">
                            <div className="bg-muted p-4 rounded-lg">
                              <pre className="text-xs overflow-auto max-h-96">
                                {codeExamples.javascript}
                              </pre>
                            </div>
                          </TabsContent>

                          <TabsContent value="python">
                            <div className="bg-muted p-4 rounded-lg">
                              <pre className="text-xs overflow-auto max-h-96">
                                {codeExamples.python}
                              </pre>
                            </div>
                          </TabsContent>

                          <TabsContent value="curl">
                            <div className="bg-muted p-4 rounded-lg">
                              <pre className="text-xs overflow-auto max-h-96">
                                {codeExamples.curl}
                              </pre>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </TabsContent>

                    <TabsContent value="testing" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold mb-4">Rate Limits</h4>
                        <div className="space-y-3">
                          {apiPlans.map((plan) => (
                            <div key={plan.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">{plan.name}</div>
                                <Badge variant="outline">{plan.requests.toLocaleString()}/month</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {plan.requests.toLocaleString()} requests
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Response Format</h4>
                          <div className="bg-muted p-4 rounded">
                            <pre className="text-xs">
{`{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1234
  }
}`}
                            </pre>
                          </div>
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
    </div>
  );
}
