import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download, 
  Bell, 
  Shield, 
  Zap, 
  CheckCircle, 
  Star, 
  Monitor, 
  Settings, 
  Apple, 
  Android, 
  Wifi, 
  Battery,
  Globe,
  Lock
} from 'lucide-react';

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState('both');

  const features = [
    {
      icon: <Bell className="h-8 w-8" />,
      title: 'Push Notifications',
      description: 'Instant alerts for breaking news, security threats, and gaming updates',
      available: true
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: 'Offline Reading',
      description: 'Download articles for offline reading with sync across devices',
      available: true
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Enhanced Security',
      description: 'Biometric authentication and encrypted local storage',
      available: true
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: 'Live Dashboard',
      description: 'Real-time analytics and community engagement metrics',
      available: true
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Performance Mode',
      description: 'Optimized battery usage and faster loading',
      available: true
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multi-language',
      description: 'Support for 15+ languages with automatic translation',
      available: true
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Dark Mode',
      description: 'System-wide dark theme with blue light filtering',
      available: true
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: 'Background Sync',
      description: 'Seamless sync of preferences and reading progress',
      available: true
    },
    {
      icon: <Battery className="h-8 w-8" />,
      title: 'Battery Optimization',
      description: 'Smart battery management and usage analytics',
      available: true
    }
  ];

  const platforms = [
    {
      id: 'ios',
      name: 'iOS',
      icon: <Apple className="h-12 w-12" />,
      description: 'Native iOS app with Swift and SwiftUI',
      features: ['push', 'offline', 'security', 'dashboard', 'performance'],
      downloadUrl: 'https://apps.apple.com/app/thegridnexus',
      version: '2.4.1',
      size: '45.2 MB',
      rating: 4.8,
      reviews: 1234
    },
    {
      id: 'android',
      name: 'Android',
      icon: <Android className="h-12 w-12" />,
      description: 'Native Android app with Kotlin and Jetpack Compose',
      features: ['push', 'offline', 'security', 'dashboard', 'performance'],
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.thegridnexus',
      version: '2.4.1',
      size: '38.7 MB',
      rating: 4.7,
      reviews: 892
    }
  ];

  const screenshots = [
    {
      title: 'Home Feed',
      description: 'Personalized news feed with tech, security, and gaming content',
      platform: 'both'
    },
    {
      title: 'Article Reader',
      description: 'Clean reading experience with offline support and bookmarks',
      platform: 'both'
    },
    {
      title: 'Security Scanner',
      description: 'Mobile vulnerability scanning with real-time threat detection',
      platform: 'both'
    },
    {
      title: 'Community Forums',
      description: 'Full forum access with posting, voting, and messaging',
      platform: 'both'
    },
    {
      title: 'Live Notifications',
      description: 'Instant alerts for breaking news and security threats',
      platform: 'both'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Security Analyst',
      content: 'The mobile app keeps me updated on security threats while I\'m on the go. The instant notifications have saved me from potential attacks multiple times.',
      rating: 5,
      platform: 'iOS'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Tech Enthusiast',
      content: 'Offline reading is a game-changer for my commute. The sync across devices is seamless and the battery optimization is impressive.',
      rating: 5,
      platform: 'Android'
    },
    {
      name: 'Emily Watson',
      role: 'Gaming Journalist',
      content: 'The live dashboard and community features are exactly what I needed for covering gaming events. The performance mode helps me stay connected longer.',
      rating: 4,
      platform: 'Both'
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
                <Smartphone className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">The Grid Nexus</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link to="/mobile" className="text-primary border-b-2 border-primary px-1 pb-4">
                Mobile App
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary rounded-2xl flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge className="animate-pulse">NEW</Badge>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-4">The Grid Nexus Mobile</h1>
                <p className="text-xl text-muted-foreground">
                  Your tech intelligence, now in your pocket
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <Button size="lg" className="px-8">
                <Apple className="h-5 w-5 mr-2" />
                Download for iOS
              </Button>
              <Button size="lg" className="px-8">
                <Android className="h-5 w-5 mr-2" />
                Download for Android
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Available on App Store and Google Play • 4.8★ • 4.7★
              </p>
              <div className="flex justify-center gap-6">
                <Button variant="outline" size="sm">
                  <Monitor className="h-4 w-4 mr-2" />
                  View Screenshots
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Read Reviews
                </Button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* App Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Powerful Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                      {feature.available && (
                        <Badge variant="default" className="mt-2">Available</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Platform Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {platforms.map((platform) => (
                    <div 
                      key={platform.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPlatform === platform.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {platform.icon}
                          <div>
                            <div className="font-semibold text-lg">{platform.name}</div>
                            <div className="text-sm text-muted-foreground">{platform.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{platform.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {platform.reviews.toLocaleString()} reviews
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{platform.size}</span>
                          <div className="ml-2">Version {platform.version}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {platform.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {platform.downloadUrl}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Monitor className="h-4 w-4 mr-2" />
                          Compare Features
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Screenshots */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  App Screenshots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    {screenshots.map((screenshot, index) => (
                      <TabsTrigger key={index} value={screenshot.title.toLowerCase().replace(' ', '-')}>
                        {screenshot.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {screenshots.map((screenshot) => (
                    <TabsContent key={screenshot.title} value={screenshot.title.toLowerCase().replace(' ', '-')}>
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="font-semibold text-lg">{screenshot.title}</h3>
                          <p className="text-muted-foreground">{screenshot.description}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-muted to-muted/50 rounded-lg p-8">
                          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img 
                              src={`https://picsum.photos/seed/thegridnexus${index}/400/300.jpg`}
                              alt={screenshot.title}
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  User Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-6 border rounded-lg">
                      <div className="flex items-start gap-4 mb-4">
                        <img 
                          src={`https://picsum.photos/seed/user${index}/100/100.jpg`}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500" />
                        ))}
                        <div className="ml-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{testimonial.rating}</span>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {testimonial.platform}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card>
              <CardContent className="text-center p-8">
                <h3 className="text-2xl font-bold mb-4">Get The Grid Nexus Mobile</h3>
                <p className="text-muted-foreground mb-6">
                  Stay connected to the latest tech, security, and gaming intelligence wherever you are.
                  Download now and join thousands of professionals who trust The Grid Nexus.
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" className="px-8">
                    <Apple className="h-5 w-5 mr-2" />
                    Download for iOS
                  </Button>
                  <Button size="lg" className="px-8">
                    <Android className="h-5 w-5 mr-2" />
                    Download for Android
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
