import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Zap } from 'lucide-react';

export function CommunitySection() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Join Our Community
        </CardTitle>
        <CardDescription>
          Join discussions with experts and enthusiasts across tech, security, and gaming.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Expert Discussions</h4>
            <p className="text-sm text-muted-foreground">
              Connect with industry experts and get answers to your questions
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Real-Time Updates</h4>
            <p className="text-sm text-muted-foreground">
              Stay informed with instant notifications on breaking news
            </p>
          </div>
        </div>
        <Button className="w-full" size="lg">
          Join Community
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Free • No spam • Unsubscribe anytime
        </p>
      </CardContent>
    </Card>
  );
}



