import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Bot, Send, ArrowLeft, RotateCcw, Shield, Gamepad2,
  Cpu, TrendingUp, Star, ChevronRight, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ── Response generator ─────────────────────────────────────────────────────

const RESPONSES: Array<{ patterns: RegExp[]; response: string }> = [
  {
    patterns: [/valorant.*tips?|tips?.*valorant|improve.*aim|aim.*improve/i],
    response: `**Valorant Improvement Tips**

Here's what actually moves the needle for most players:

**Aim mechanics**
- Lower your sensitivity until flicking feels unnatural — precision > speed at your rank
- Use Aim Lab's Gridshot to warm up 10 min before queuing (measurable improvement in 2 weeks)
- Crosshair placement: hold head height always, not body or floor

**Game sense (bigger impact than aim)**
- After each death, watch the replay — was it positioning, timing, or aim? 90% is positioning
- Learn spike plant/defuse timings. Holding off a last-second defuse wins rounds without shooting
- Sound discipline: walk through key areas, listen for audio cues before peeking

**Security tip:** Valorant's Vanguard anti-cheat runs at kernel level. Keep your system updated — Vanguard vulnerabilities can expose your entire OS. Disable it when not gaming.`,
  },
  {
    patterns: [/best.*gpu|gpu.*recommend|graphic.*card|rtx.*vs|amd.*vs.*nvidia/i],
    response: `**GPU Recommendations (2025)**

Depends heavily on your resolution and budget:

**1080p Gaming (best value)**
- RTX 4060 Ti ($399) — excellent ray tracing, DLSS 3.5
- RX 7700 XT ($349) — better rasterization, no DLSS
- **Verdict:** 4060 Ti if you stream/capture; 7700 XT if you want raw frames

**1440p Sweet Spot**
- RTX 4070 Super ($599) — the king at this tier
- RX 7900 GRE ($449 on sale) — punches above price, runs hot

**4K Enthusiast**
- RTX 4080 Super ($999) or RTX 4090 ($1,599)
- Wait for RTX 5000 series (Blackwell) — rumored 40% uplift

**Security note:** After installing a new GPU, check for driver updates via NVIDIA App or AMD Software. Outdated drivers have had privilege escalation CVEs (e.g., CVE-2023-31007 on NVIDIA).`,
  },
  {
    patterns: [/security.*account|account.*hack|protect.*account|2fa|two.factor/i],
    response: `**Gaming Account Security — Full Hardening Guide**

Your gaming accounts are high-value targets. Here's the full checklist:

**Tier 1 — Do these TODAY**
- [ ] Enable 2FA on every platform (Steam, PSN, Xbox, Riot, Epic, Battle.net)
- [ ] Use unique passwords for every account (password manager: Bitwarden is free)
- [ ] Check HaveIBeenPwned.com for your email — change passwords if breached

**Tier 2 — This week**
- [ ] Steam: Enable Steam Guard Mobile Authenticator (not email — mobile is stronger)
- [ ] Review active sessions: revoke anything you don't recognize
- [ ] Disable trade confirmations from API (Steam API key theft is real)
- [ ] Set PSN/Xbox privacy to "Friends Only" for real-name and location

**Tier 3 — Ongoing**
- [ ] Monitor account activity monthly — Steam has a login history
- [ ] Never trade through third-party sites without checking their security certs
- [ ] Use a dedicated email for gaming that isn't tied to your main identity

**Try our tools:** [Gaming Security Checkup](/tools/gaming-security-checkup) for a full platform audit.`,
  },
  {
    patterns: [/steam.*scanner|steam.*security|check.*steam/i],
    response: `**Steam Security — What to Check**

Steam is the highest-value gaming platform and the most targeted. Run through this:

**Critical checks**
1. Steam Guard status — must be the **Mobile Authenticator**, not email
2. API key — go to steamcommunity.com/dev/apikey. If you see a key you didn't create, it's been stolen
3. Authorized devices — Settings → Security → Manage Steam Guard Devices
4. Active sessions — Settings → Security → Manage account access

**Steam scam vectors (2025)**
- **Trade hold bypass sites** — they steal your API key, not your password
- **Phishing via game invites** — fake SteamPowered.com URLs
- **Fake CS2 skin gambling sites** — most harvest your Steam session token

Use our [Steam Security Scanner](/tools/steam-scanner) to run an automated 10-point check right now.`,
  },
  {
    patterns: [/best.*game|recommend.*game|what.*game.*play|game.*recommendation/i],
    response: `**Game Recommendations — What's Actually Worth Your Time**

Here are my picks by category, all with strong security postures:

**Solo / Story**
- *Baldur's Gate 3* — GOTY 2023, 200+ hours, offline-capable
- *Elden Ring* — mastery-based, no forced online
- *Hollow Knight* — $15, zero live-service BS

**Competitive**
- *Valorant* — tight gunplay, though Vanguard anti-cheat is divisive
- *Deep Rock Galactic* — co-op PvE, exceptionally positive community, dev-owned servers

**Survival / Sandbox**
- *Valheim* — optional multiplayer, self-hostable servers
- *Satisfactory 1.0* — factory builder, huge recently

**Free-to-Play (no P2W)**
- *Path of Exile 2* — deep ARPG, cosmetics only
- *Warframe* — generous, 10 years of content

Want a personalized match? Try the [AI Recommendation Engine](/tools/recommendation-engine).`,
  },
  {
    patterns: [/patch.*note|update.*game|latest.*update|new.*season/i],
    response: `**Staying on Top of Game Updates**

The best ways to track patches and updates for your games:

**Automated tracking**
- Subscribe to game subreddits — r/Valorant, r/apexlegends, r/GlobalOffensive update threads auto-pin
- Follow official game Twitter/X accounts — fastest for emergency patches
- Use our [Game Patch Risk Tracker](/tools/patch-risk-tracker) for security-relevant updates

**Why security patches matter**
When Riot, Valve, or Blizzard push a "stability update," it often quietly patches exploits. CVE-2024-6387 (regreSSHion) affected multiple game server operators. A patch labeled "misc. fixes" can be a critical security fix.

**Tip:** Enable auto-updates for all games in your library. The window between a patch drop and when you manually update is when you're most exposed.`,
  },
  {
    patterns: [/cve|vulnerability|exploit|hack.*game|cheat.*detection/i],
    response: `**Gaming CVEs & Exploit Awareness**

Active gaming-related vulnerabilities you should know about:

**Current threat landscape (2025)**
- Steam client had a critical RCE via crafted invite links (patched in 3.0.2.18)
- Fortnite Epic launcher had a privilege escalation via DLL hijacking (patched Q1 2025)
- Valorant Vanguard driver had a BYOVD attack surface (Riot patched silently)

**Cheat detection and you**
Anti-cheat software (VAC, Easy Anti-Cheat, Vanguard, BattlEye) runs at elevated privileges. This means:
- A vulnerability in the anti-cheat = root access to your machine
- Kernel-mode AC (Vanguard) is the highest risk — it loads at boot
- Always update games before launching — this updates the anti-cheat driver too

**Resources**
- [Live CVE feed](/tools/patch-risk-tracker) for your specific games
- [Real-Time Threat Scanner](/tools/threat-scanner) to check your exposed services`,
  },
  {
    patterns: [/hello|hi|hey|help|what can you/i],
    response: `Hey there! I'm **Nexus Copilot** — your AI gaming intelligence assistant.

I can help you with:
- 🎮 **Game tips & strategy** — aim improvement, ranked climbing, build guides
- 🛡️ **Account security** — hardening your gaming accounts against hacks
- 💻 **Hardware advice** — GPU picks, PC builds, performance optimization
- 🔍 **Threat awareness** — gaming CVEs, active exploits, patch timelines
- 🎯 **Game recommendations** — matched to your playstyle and budget

**Try asking me:**
- "What's the best GPU for 1440p gaming under $600?"
- "How do I secure my Steam account?"
- "Give me tips to rank up in Valorant"
- "What games should I play if I like Elden Ring?"`,
  },
];

function generateResponse(input: string): string {
  const match = RESPONSES.find(r => r.patterns.some(p => p.test(input)));
  if (match) return match.response;
  return `That's a great question about **"${input}"**.

Here's what I can tell you from The Grid Nexus intelligence base:

The gaming space evolves fast, and this topic intersects with both performance and security considerations. I'd recommend:

1. **Check the latest patch notes** for any security-relevant updates
2. **Verify through official sources** — developer blogs and Steam announcements
3. **Use our specialized tools** for deeper analysis:
   - [Game Sentiment Analyzer](/tools/sentiment-analyzer) — community opinion at a glance
   - [Patch Risk Tracker](/tools/patch-risk-tracker) — live CVEs for your games
   - [AI PC Builder](/tools/pc-builder) — security-scored build configurations

Is there a more specific angle I can help with? Try asking about account security, GPU recommendations, or specific game tips.`;
}

function renderMarkdown(text: string): JSX.Element {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
          return <p key={i} className="font-semibold text-foreground mt-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- [ ]')) {
          return <div key={i} className="flex items-start gap-2 pl-2"><span className="text-muted-foreground mt-0.5">☐</span><span dangerouslySetInnerHTML={{ __html: line.slice(5).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#00F0FF] hover:underline">$1</a>') }} /></div>;
        }
        if (line.startsWith('- ')) {
          return <div key={i} className="flex items-start gap-2 pl-2"><span className="text-muted-foreground mt-1">•</span><span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#00F0FF] hover:underline">$1</a>') }} /></div>;
        }
        if (/^\d+\./.test(line)) {
          return <div key={i} className="flex items-start gap-2 pl-2"><span className="text-muted-foreground shrink-0">{line.match(/^\d+/)?.[0]}.</span><span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#00F0FF] hover:underline">$1</a>') }} /></div>;
        }
        if (line === '') return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#00F0FF] hover:underline">$1</a>') }} />;
      })}
    </div>
  );
}

const STARTERS = [
  'How do I secure my Steam account?',
  'Best GPU for 1440p under $600?',
  'Tips to improve in Valorant',
  'What games should I play next?',
  'What gaming CVEs are active now?',
];

// ── Component ──────────────────────────────────────────────────────────────

export default function GamingCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hey there! I'm **Nexus Copilot** — your AI gaming intelligence assistant.

I can help you with:
- 🎮 **Game tips & strategy** — aim improvement, ranked climbing, build guides
- 🛡️ **Account security** — hardening your gaming accounts against hacks
- 💻 **Hardware advice** — GPU picks, PC builds, performance optimization
- 🔍 **Threat awareness** — gaming CVEs, active exploits, patch timelines
- 🎯 **Game recommendations** — matched to your playstyle and budget

**Try asking me:**
- "What's the best GPU for 1440p gaming under $600?"
- "How do I secure my Steam account?"
- "Give me tips to rank up in Valorant"
- "What games should I play if I like Elden Ring?"`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const response = generateResponse(content);
    const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  }, [input, loading]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const reset = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: `Hey there! I'm **Nexus Copilot** — your AI gaming intelligence assistant.\n\nWhat can I help you with today?`,
      timestamp: new Date(),
    }]);
    setInput('');
  };

  return (
    <Layout>
      <SEO
        title="Gaming Copilot AI — The Grid Nexus"
        description="Your AI gaming assistant. Ask anything — tips, hardware advice, security help, game recommendations, and live threat awareness."
      />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#B026FF]/10 border border-[#B026FF]/30">
                <Bot className="h-7 w-7 text-[#B026FF]" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl">Gaming Copilot</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] inline-block animate-pulse" />
                  AI online · Powered by Nexus Intelligence
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="shrink-0">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> New Chat
            </Button>
          </div>
        </div>

        {/* Chat window */}
        <Card className="border-[#B026FF]/20 mb-4">
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.role === 'assistant' ? 'bg-[#B026FF]/20 border border-[#B026FF]/30' : 'bg-[#00F0FF]/20 border border-[#00F0FF]/30'
                  )}>
                    {msg.role === 'assistant'
                      ? <Bot className="h-4 w-4 text-[#B026FF]" />
                      : <Gamepad2 className="h-4 w-4 text-[#00F0FF]" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                    msg.role === 'assistant'
                      ? 'bg-muted/40 border border-border rounded-tl-sm'
                      : 'bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-tr-sm text-right'
                  )}>
                    {msg.role === 'assistant'
                      ? renderMarkdown(msg.content)
                      : <p>{msg.content}</p>
                    }
                    <div className="text-xs text-muted-foreground mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B026FF]/20 border border-[#B026FF]/30 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-[#B026FF]" />
                  </div>
                  <div className="bg-muted/40 border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full bg-[#B026FF] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </CardContent>
        </Card>

        {/* Starter prompts */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {STARTERS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-[#B026FF]/40 hover:text-[#B026FF] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about games, security, hardware…"
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="bg-[#B026FF] hover:bg-[#B026FF]/80 text-white shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Nexus Copilot uses curated gaming intelligence. Always verify security advice with official sources.
        </p>
      </div>
    </Layout>
  );
}
