import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { ThreatIntelligenceDashboard } from '@/components/security/ThreatIntelligenceDashboard';
import { LiveThreatFeed } from '@/components/home/LiveThreatFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';

export default function LiveThreatDashboard() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const userId = user?.id || `session-${localStorage.getItem('sessionId') || 'anonymous'}`;

  const [cveInput, setCveInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('sessionId')) {
      localStorage.setItem(
        'sessionId',
        `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      );
    }
  }, []);

  const subs = useQuery(api.threatAlerts.listSubscriptions, isDisabled ? 'skip' : { userId });
  const notifications = useQuery(
    api.threatAlerts.listNotifications,
    isDisabled ? 'skip' : { userId, limit: 25 }
  );

  const subscribe = useMutation(api.threatAlerts.subscribe);
  const unsubscribe = useMutation(api.threatAlerts.unsubscribe);
  const markRead = useMutation(api.threatAlerts.markNotificationRead);

  const cveSubs = useMemo(
    () => (subs ?? []).filter((s: any) => s.type === 'cve').map((s: any) => s.value),
    [subs]
  );
  const tagSubs = useMemo(
    () => (subs ?? []).filter((s: any) => s.type === 'tag').map((s: any) => s.value),
    [subs]
  );

  const handleSubscribeCve = async () => {
    if (isDisabled) return;
    const value = cveInput.trim();
    if (!value) return;
    try {
      await subscribe({ userId, type: 'cve', value });
      setCveInput('');
      toast({ title: 'Subscribed', description: `Alerts enabled for ${value}` });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubscribeTag = async () => {
    if (isDisabled) return;
    const value = tagInput.trim();
    if (!value) return;
    try {
      await subscribe({ userId, type: 'tag', value });
      setTagInput('');
      toast({ title: 'Subscribed', description: `Alerts enabled for tag: ${value}` });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Live Threat Dashboard | The Grid Nexus"
        description="Monitor trending vulnerabilities, ransomware campaigns, and active threat intelligence signals."
        keywords={['live threats', 'threat intelligence', 'vulnerabilities', 'ransomware', 'cybersecurity dashboard']}
        url={typeof window !== 'undefined' ? window.location.href : '/live-threat-dashboard'}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl mb-3">Live Threat Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Fast situational awareness across critical threats, attack campaigns, and enterprise-impacting events.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ThreatIntelligenceDashboard />
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Threat Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isDisabled ? (
                    <div className="text-sm text-muted-foreground">
                      Alerts are unavailable because Convex is disabled.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Follow CVE</div>
                          <div className="flex gap-2">
                            <Input
                              value={cveInput}
                              onChange={(e) => setCveInput(e.target.value)}
                              placeholder="CVE-2024-XXXX"
                            />
                            <Button onClick={handleSubscribeCve}>Follow</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cveSubs.map((cve: string) => (
                              <Badge key={cve} variant="secondary" className="gap-2">
                                {cve}
                                <button
                                  type="button"
                                  className="text-xs underline"
                                  onClick={() => unsubscribe({ userId, type: 'cve', value: cve })}
                                >
                                  Unfollow
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Follow Tag</div>
                          <div className="flex gap-2">
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder="ransomware"
                            />
                            <Button onClick={handleSubscribeTag}>Follow</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tagSubs.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="gap-2">
                                {tag}
                                <button
                                  type="button"
                                  className="text-xs underline"
                                  onClick={() => unsubscribe({ userId, type: 'tag', value: tag })}
                                >
                                  Unfollow
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-medium">Notifications</div>
                        {(notifications ?? []).length === 0 ? (
                          <div className="text-sm text-muted-foreground">No alerts yet.</div>
                        ) : (
                          <div className="space-y-2">
                            {(notifications ?? []).map((n: any) => (
                              <div key={n._id} className="p-3 border rounded-lg">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="font-medium text-sm line-clamp-2">{n.threat?.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                      {n.threat?.description ?? ''}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="text-xs">{n.threat?.source}</Badge>
                                      <Badge variant="outline" className="text-xs">{n.threat?.severity}</Badge>
                                      {(n.threat?.cveIds ?? []).slice(0, 2).map((c: string) => (
                                        <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {n.readAt == null ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => markRead({ userId, notificationId: n._id })}
                                    >
                                      Mark read
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <LiveThreatFeed />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
