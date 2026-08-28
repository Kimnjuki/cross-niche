import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Bell, Check, CheckCheck, Shield, Newspaper, Settings2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type NotifPrefs = {
  breaking: boolean;
  feed: boolean;
  system: boolean;
  emailDigest: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
};

const defaultPrefs: NotifPrefs = {
  breaking: true,
  feed: true,
  system: false,
  emailDigest: false,
  frequency: 'daily',
};

export default function Settings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useLocalStorage<NotifPrefs>('notification-prefs', defaultPrefs);

  const update = (patch: Partial<NotifPrefs>) => setPrefs({ ...prefs, ...patch });

  return (
    <Layout>
      <SEOHead
        title="Settings | The Grid Nexus"
        description="Manage notification preferences and account settings."
        url={typeof window !== 'undefined' ? `${window.location.origin}/settings` : '/settings'}
        noindex
      />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="font-display font-bold text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Control alerts and notification delivery for your account.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Breaking security alerts</p>
                <p className="text-sm text-muted-foreground">High-impact threats and urgent updates.</p>
              </div>
              <Switch checked={prefs.breaking} onCheckedChange={(v) => update({ breaking: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Feed updates</p>
                <p className="text-sm text-muted-foreground">New curated stories and topic changes.</p>
              </div>
              <Switch checked={prefs.feed} onCheckedChange={(v) => update({ feed: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System messages</p>
                <p className="text-sm text-muted-foreground">Maintenance, security score updates, and platform changes.</p>
              </div>
              <Switch checked={prefs.system} onCheckedChange={(v) => update({ system: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email digest</p>
                <p className="text-sm text-muted-foreground">Receive a periodic email summary.</p>
              </div>
              <Switch checked={prefs.emailDigest} onCheckedChange={(v) => update({ emailDigest: v })} />
            </div>
            <div className="space-y-2">
              <Label>Digest frequency</Label>
              <Select value={prefs.frequency} onValueChange={(v: NotifPrefs['frequency']) => update({ frequency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Realtime</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
