import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, ChevronDown, ChevronUp, ThumbsUp, Send, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLATFORMS = ['Steam', 'PlayStation', 'Xbox', 'PC', 'Mobile', 'Other'];
const THREAT_TYPES = ['phishing', 'account_takeover', 'malware', 'ddos', 'exploit', 'other'];
const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const;

const severityColor: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
};

export const CommunityThreatReporter = React.memo(function CommunityThreatReporter() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();

  const submit = useMutation(api.communityTools.submitThreatReport);
  const upvote = useMutation(api.communityTools.upvoteThreatReport);
  const reports = useQuery(
    api.communityTools.listThreatReports,
    isDisabled ? 'skip' : { limit: 10 }
  );

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    platform: 'PC',
    severity: 'medium' as typeof SEVERITIES[number],
    threatType: 'phishing',
    evidence: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: 'Title and description are required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await submit({
        userId: user?.id,
        displayName: user?.name || 'Anonymous',
        title: form.title.trim(),
        description: form.description.trim(),
        platform: form.platform,
        severity: form.severity,
        threatType: form.threatType,
        evidence: form.evidence.trim() || undefined,
      });
      toast({ title: 'Threat report submitted', description: 'Thanks for keeping the community safe.' });
      setForm({ title: '', description: '', platform: 'PC', severity: 'medium', threatType: 'phishing', evidence: '' });
      setFormOpen(false);
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(id: string) {
    if (isDisabled) return;
    await upvote({ reportId: id as Parameters<typeof upvote>[0]['reportId'] }).catch(() => {});
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-security" />
            Community Threat Reports
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-xs"
            onClick={() => setFormOpen((o) => !o)}
          >
            <AlertTriangle className="h-3 w-3" />
            Report a Threat
            {formOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Submission form */}
        {formOpen && (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Threat title *</label>
              <Input
                placeholder="e.g. Steam phishing campaign targeting CS2 players"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={120}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description *</label>
              <textarea
                className="w-full min-h-[80px] text-sm rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="Describe the threat, how it works, and how to spot it..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                maxLength={800}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
                <select
                  className="w-full h-9 text-sm rounded-md border border-input bg-background px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.platform}
                  onChange={(e) => set('platform', e.target.value)}
                >
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Severity</label>
                <select
                  className="w-full h-9 text-sm rounded-md border border-input bg-background px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.severity}
                  onChange={(e) => set('severity', e.target.value)}
                >
                  {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                <select
                  className="w-full h-9 text-sm rounded-md border border-input bg-background px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.threatType}
                  onChange={(e) => set('threatType', e.target.value)}
                >
                  {THREAT_TYPES.map((t) => <option key={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Evidence URL (optional)</label>
              <Input
                placeholder="https://..."
                value={form.evidence}
                onChange={(e) => set('evidence', e.target.value)}
                type="url"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1">
                <Send className="h-3 w-3" />
                {submitting ? 'Submitting…' : 'Submit Report'}
              </Button>
            </div>
          </form>
        )}

        {/* Report feed */}
        {isDisabled ? (
          <p className="text-xs text-muted-foreground text-center py-4">Community reports unavailable</p>
        ) : !reports ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No reports yet — be the first to flag a threat.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r._id} className="rounded-lg border p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug">{r.title}</p>
                  <Badge
                    variant="outline"
                    className={cn('text-xs shrink-0', severityColor[r.severity])}
                  >
                    {r.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">{r.platform}</Badge>
                  </span>
                  <span>{r.threatType.replace('_', ' ')}</span>
                  {r.status === 'verified' && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 text-green-500 border-green-500/30">
                      verified
                    </Badge>
                  )}
                  <span className="ml-auto">by {r.displayName ?? 'Anonymous'}</span>
                  <button
                    type="button"
                    onClick={() => handleUpvote(r._id)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    aria-label="Upvote"
                  >
                    <ThumbsUp className="h-3 w-3" /> {r.upvotes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
