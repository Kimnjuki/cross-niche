import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  const [name, setName] = useState(user?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [breakingAlerts, setBreakingAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [newSearch, setNewSearch] = useState('');

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleUpdateProfile = () => {
    toast.success('Profile updated');
  };

  const handleAddSearch = () => {
    const trimmed = newSearch.trim();
    if (!trimmed) return;
    setSavedSearches((prev) => Array.from(new Set([...prev, trimmed])));
    setNewSearch('');
    toast.success('Saved search added');
  };

  const handleRemoveSearch = (term: string) => {
    setSavedSearches((prev) => prev.filter((s) => s !== term));
  };

  const handleClearBookmarks = () => {
    toast.success('Bookmark cache cleared');
  };

  const handleExportData = () => {
    toast.success('Export started');
  };

  return (
    <Layout>
      <SEOHead
        title="User Profile | The Grid Nexus"
        description="Manage your account settings and preferences"
        url={window.location.href}
        noindex
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">Profile</h1>
          <p className="text-xl text-muted-foreground">Manage your account, bookmarks, and preferences.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your basic profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile}>Update Profile</Button>
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Saved Bookmarks
                </CardTitle>
                <CardDescription>Review and manage your saved content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{user?.bookmarks?.length ?? 0} saved items</p>
                    <p className="text-sm text-muted-foreground">Manage your reading list</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportData}>Export</Button>
                    <Button variant="destructive" size="sm" onClick={handleClearBookmarks}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear cache
                    </Button>
                  </div>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">Bookmark management UI can be extended with saved article cards.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize alerts, feeds, and default experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">Receive product and platform emails.</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Breaking alerts</p>
                    <p className="text-sm text-muted-foreground">High-impact security and gaming alerts.</p>
                  </div>
                  <Switch checked={breakingAlerts} onCheckedChange={setBreakingAlerts} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly digest</p>
                    <p className="text-sm text-muted-foreground">Weekly roundup of top stories.</p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Saved searches</Label>
                  <div className="flex flex-wrap gap-2">
                    {savedSearches.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-2">
                        <span>{s}</span>
                        <button aria-label={`Remove ${s}`} onClick={() => handleRemoveSearch(s)} className="text-muted-foreground hover:text-foreground">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={newSearch} onChange={(e) => setNewSearch(e.target.value)} placeholder="Add a saved search" />
                    <Button type="button" onClick={handleAddSearch}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
