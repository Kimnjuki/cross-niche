import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Bell, Check, CheckCheck, Shield, Newspaper, Settings2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

const categoryMeta: Record<string, { label: string; icon: React.ElementType }> = {
  breaking: { label: 'Breaking', icon: Shield },
  feed: { label: 'Feed Updates', icon: Newspaper },
  system: { label: 'System', icon: Settings2 },
};

export default function Notifications() {
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'breaking' | 'feed' | 'system'>('all');

  const visible = notifications
    .slice()
    .reverse()
    .filter(n => filter === 'all' ? true : filter === 'unread' ? !n.read : n.category === filter);

  return (
    <Layout>
      <SEOHead
        title="Notifications | The Grid Nexus"
        description="Your latest alerts, breaking security news, and feed updates."
        url={typeof window !== 'undefined' ? `${window.location.origin}/notifications` : '/notifications'}
        noindex
      />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.` : 'You’re all caught up.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="breaking">Breaking</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            <div className="grid gap-4">
              {visible.length === 0 && (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <Bell className="h-10 w-10 mx-auto mb-3 opacity-60" />
                    No notifications in this view.
                  </CardContent>
                </Card>
              )}

              {visible.map((n) => {
                const meta = categoryMeta[n.category] ?? categoryMeta.system;
                const Icon = meta.icon;
                return (
                  <Card key={n.id} className={n.read ? 'opacity-70' : 'border-primary/30'}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="mt-0.5 rounded-full bg-muted p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{n.title}</span>
                          <span className="text-xs text-muted-foreground">{meta.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && (
                        <Button variant="ghost" size="icon" aria-label="Mark read" onClick={() => markRead(n.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
