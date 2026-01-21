import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    advertising: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      // Show banner if no consent has been given
      setShowBanner(true);
    } else if (savedPreferences) {
      // Load saved preferences
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (e) {
        console.error('Failed to parse cookie preferences', e);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      advertising: false,
      functional: false,
    };
    savePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    
    // Dispatch custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Cookie Settings
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
        <Card className="max-w-4xl mx-auto border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">We Value Your Privacy</CardTitle>
                <CardDescription>
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Learn more
                  </Link>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAcceptAll} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Accept All
              </Button>
              <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Reject All
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="necessary" className="font-semibold cursor-pointer">
                    Necessary Cookies
                  </Label>
                  <span className="text-xs text-muted-foreground">(Always Active)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly. They cannot be disabled.
                </p>
              </div>
              <Switch
                id="necessary"
                checked={preferences.necessary}
                disabled
                className="mt-1"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="analytics" className="font-semibold cursor-pointer block mb-2">
                  Analytics Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) => updatePreference('analytics', checked)}
                className="mt-1"
              />
            </div>

            {/* Advertising Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="advertising" className="font-semibold cursor-pointer block mb-2">
                  Advertising Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  These cookies are used to deliver personalized advertisements and track ad performance. Used by services like Google AdSense.
                </p>
              </div>
              <Switch
                id="advertising"
                checked={preferences.advertising}
                onCheckedChange={(checked) => updatePreference('advertising', checked)}
                className="mt-1"
              />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border">
              <div className="flex-1">
                <Label htmlFor="functional" className="font-semibold cursor-pointer block mb-2">
                  Functional Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                </p>
              </div>
              <Switch
                id="functional"
                checked={preferences.functional}
                onCheckedChange={(checked) => updatePreference('functional', checked)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={handleSavePreferences} className="flex-1">
              Save Preferences
            </Button>
            <Button
              onClick={() => {
                setShowSettings(false);
                setShowBanner(true);
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            For more information, please read our{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}




