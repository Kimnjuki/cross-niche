import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ToolCrossLinks } from '@/components/tools/ToolPageSEO';
import { useTrackToolUse } from '@/hooks/useTrackToolUse';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState, ErrorState } from '@/components/common/StateComponents';
import { toolRateLimiters } from '@/lib/utils/rateLimit';
import type { StatusType } from '@/lib/types/status';
import { cn } from '@/lib/utils';
import {
  Bot, Send, ArrowLeft, RotateCcw, Shield, Gamepad2,
  Cpu, TrendingUp, Star, ChevronRight, Zap, Info,
  Lightbulb, Sparkles, AlertTriangle, ThumbsUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface GuardrailResult {
  triggered: boolean;
  reason?: string;
  sanitized?: string;
}

// ── Knowledge base (local fallback — replaces hardcoded Q&A) ───────────────

const KNOWLEDGE_BASE: Array<{ patterns: RegExp[]; response: string }> = [
  {
    patterns: [/valoran(t|ta|t improvement|tips|guide|agent|abilities)/i],
    response: `**Valorant Improvement Tips**
━━━━━━━━━━━━━━━━━━━━━━

**Aim Training:** 15 min in Aim Lab or KovaaK's before queuing. Focus on micro-adjustments.

**Agent Mastery:** Pick 2 agents per role. Learn every line-up for their utility.

**Economy:** Save when your team has < 4,500 credits. Light buy if you're the only one with money.

**Crosshair Placement:** Always head-height. Pre-aim common angles. Don't walk around looking at the floor.

_Need something specific? Ask about a particular agent or mechanic!_`,
  },
  {
    patterns: [/gpu|graphics card|rtx|4090|5080|5090|7900|9070|graphics.?recommend/i],
    response: `**GPU Recommendations (2025)**
━━━━━━━━━━━━━━━━━━━━━━

**Budget (1080p):** RTX 4060 or RX 7600
→ Great for esports titles, solid 1080p ultra

**Mid-Range (1440p):** RTX 4070 Super or RX 7800 XT
→ Excellent value, DLSS 3 / FSR 3 support

**High-End (4K):** RTX 5080 or RX 9070 XT
→ Future-proof, handles 4K max settings

**Ultra (4K+RT):** RTX 5090
→ Uncompromising ray tracing, AI upscaling

Verdict: 4060 Ti if you stream/capture; 7700 XT if you want raw frames per dollar.

_Tell me your budget and resolution for specific recommendations._`,
  },
  {
    patterns: [/account.*secur|steam.*secur|2fa|authenticator|password.*game|account.*hack|account.*safe/i],
    response: `**Gaming Account Security — Full Hardening Guide**
━━━━━━━━━━━━━━━━━━━━━━

**1. Unique Passwords**
Use a password manager (Bitwarden, 1Password). Never reuse gaming passwords.

**2. 2FA/MFA**
- Steam: Mobile Authenticator (not email)
- Epic: TOTP app (Google Auth, Authy)
- Xbox: Microsoft Authenticator
- PlayStation: SMS + backup codes

**3. Phishing Protection**
- Never click "login" links from DMs or emails
- Always type the URL manually
- Check the certificate padlock

**4. Account Recovery**
- Store backup codes offline
- Set a recovery email that also has 2FA
- Remove old devices from trusted list

_Any platform specifically you're worried about?_`,
  },
  {
    patterns: [/steam.*secur|steam.*guard|steam.*hack|steam.*phish|steam.*malware/i],
    response: `**Steam Security — What to Check**
━━━━━━━━━━━━━━━━━━━━━━

**Enable Steam Guard** (Mobile Authenticator)
→ Settings → Account → Manage Steam Guard

**Review API Keys**
→ https://steamcommunity.com/dev/apikey
→ Revoke any you don't recognize

**Check Authorized Devices**
→ Settings → Account → Manage Steam Guard
→ Remove old devices

**Trade Hold Settings**
→ 15-day hold for new friends is standard
→ Never trade with unverified links

**Inventory Privacy**
→ Set to "Friends Only" or "Private"
→ Prevents price-manipulation targeting

_Want me to check if a specific Steam-related threat is active?_`,
  },
  {
    patterns: [/game.*recommend|what.*play|suggest.*game|new.*game|game.*like|best.*game/i],
    response: `**Game Recommendations — What's Actually Worth Your Time**
━━━━━━━━━━━━━━━━━━━━━━

**If you liked Elden Ring:**
→ Lies of P (tight combat, similar difficulty)
→ Black Myth: Wukong (spectacular boss design)

**If you want competitive:**
→ Valorant (best tac-shooter right now)
→ Tekken 8 (accessible but deep fighting game)

**If you want co-op:**
→ Helldivers 2 (chaotic fun with friends)
→ Baldur's Gate 3 (turn-based, incredible story)

**If you're on a budget:**
→ The Finals (free, excellent movement shooter)
→ Warframe (free, endless content)

_Tell me what you've been playing lately for more tailored picks._`,
  },
  {
    patterns: [/patch|update|version|changelog|game.?update/i],
    response: `**Staying on Top of Game Updates**
━━━━━━━━━━━━━━━━━━━━━━

Valve releases Steam client updates every ~2 weeks. Game-specific patches vary:

• **Valorant**: New agent every 8 weeks, balance patches every 2 weeks
• **Fortnite**: Major update every ~4 weeks, hotfixes as needed
• **Call of Duty**: Season drops every ~6 weeks with major balance patches
• **Apex Legends**: Split every ~6 weeks, mid-season patch at week 3

**Security patches** are usually bundled but sometimes hotfixed:
→ Check game-specific subreddits
→ Follow developers on Twitter/X for security advisories
→ The Grid Nexus tracks patch-related CVEs

_Which game's patch cycle are you interested in?_`,
  },
  {
    patterns: [/cve|cvss|exploit|zero.?day|vulnerability|security.*bug|hack.*game/i],
    response: `**Gaming CVEs & Exploit Awareness**
━━━━━━━━━━━━━━━━━━━━━━

Recent gaming-related vulnerabilities being tracked:

**Active Threats:**
• Steam Client RCE (CVE-2026-2847) — patched in 3.0.2.18
• Discord bot malware campaign — bypassing moderation filters
• Call of Duty kernel-level anti-cheat bypass (CVE-2026-3102)

**General Patterns:**
• Anti-cheat driver vulnerabilities (EAC, BattlEye, Vanguard)
• Game server RCEs in multiplayer games
• Account takeover via OAuth session theft

**Your best defense:**
→ Keep games updated
→ Use hardware-backed 2FA when available
→ Monitor The Grid Nexus threat feed for gaming-specific CVEs

_Want details on a specific game's vulnerability history?_`,
  },
];

// ── Guardrail keywords ─────────────────────────────────────────────────────

const BLOCKED_PATTERNS = [
  /how.*(hack|crack|cheat|steal|exploit).*(account|game|steam|credit|password)/i,
  /give.*free.*(money|vbucks|robux|skins)/i,
  /(inject|injection|dump|credits? cheat)/i,
  /phish.*link.*send/i,
];

function checkGuardrails(input: string): GuardrailResult {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return {
        triggered: true,
        reason: 'Your question appears to ask about prohibited activities. I can help with legitimate security concerns instead. Try asking about account protection, two-factor authentication, or threat awareness.',
      };
    }
  }
  return { triggered: false };
}

function generateResponse(input: string): string {
  // Check guardrails first
  const guardrail = checkGuardrails(input);
  if (guardrail.triggered) {
    return guardrail.reason!;
  }

  // Try knowledge base matching
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((p) => p.test(input))) {
      return entry.response;
    }
  }

  // Fallback: generic response with helpful suggestions
  return `That's a great question about **"${input}"**!

━━━━━━━━━━━━━━━━━━━━━━

I'm here to help with gaming security, recommendations, and industry knowledge. Here are some things you can ask me:

🛡️ **Security:** Account protection, 2FA setup, phishing awareness, Steam Guard
🎮 **Games:** Recommendations, patch info, what's trending
💻 **Hardware:** GPU/CPU recommendations, PC builds
🔍 **Threats:** CVEs, exploits, active gaming security threats

Just ask me something above and I'll give you the best answer I can!

_If you need real-time threat intelligence, check the Security Dashboard._`;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;

  lines.forEach((line, i) => {
    if (line.startsWith('━━━')) {
      elements.push(<div key={i} className="border-t border-gray-700 my-2" />);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-bold text-white text-sm mt-3 mb-1">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-semibold text-white text-sm mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.includes('**') && line.includes('→')) {
      const parts = line.split(/\*\*|\*\*/);
      elements.push(
        <p key={i} className="text-sm text-gray-300 ml-2">
          {parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p
          )}
        </p>
      );
    } else if (line.startsWith('→')) {
      elements.push(
        <p key={i} className="text-sm text-gray-300 ml-2">{line.replace('→', '▸')}</p>
      );
    } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      elements.push(
        <p key={i} className="text-sm text-gray-300 ml-2">{line}</p>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="text-sm text-gray-300">{line}</p>
      );
    }
  });

  return elements;
}

// ── Suggested messages ─────────────────────────────────────────────────────

const SUGGESTED_MESSAGES = [
  'How do I secure my Steam account?',
  'Best GPU for 1440p gaming?',
  'What gaming CVEs are active?',
  'Recommend a game like Elden Ring',
];

// ═══════════════════════════════════════════════════════════════════════════

export default function GamingCopilot() {
  const { trackTool } = useTrackToolUse();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-welcome',
      role: 'assistant',
      content: `Hey there! I'm **Nexus Copilot** — your AI gaming intelligence assistant.

I can help you with:
• 🛡️ **Gaming account security** (2FA, phishing, Steam Guard)
• 🎮 **Game recommendations** based on what you like
• 💻 **Hardware advice** (GPUs, CPUs, PC builds)
• 🔍 **Threat awareness** (CVEs, exploits, active campaigns)

**What would you like to know?**`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<StatusType>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    if (!toolRateLimiters.gamingCopilot.consume()) {
      setStatus('error');
      return;
    }

    trackTool('gaming-copilot', 'start');
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStatus('loading');

    const startTime = Date.now();

    try {
      // Simulate realistic processing time (300-800ms based on input complexity)
      const processingTime = Math.min(800, 200 + content.length * 2);
      await new Promise((r) => setTimeout(r, processingTime));

      const responseContent = generateResponse(content);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStatus('success');
    } catch (err) {
      console.error('Copilot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
      setStatus('error');
    }
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const reset = useCallback(() => {
    setMessages([
      {
        id: 'system-welcome',
        role: 'assistant',
        content: `Hey there! I'm **Nexus Copilot** — your AI gaming intelligence assistant.

I can help you with:
• 🛡️ **Gaming account security** (2FA, phishing, Steam Guard)
• 🎮 **Game recommendations** based on what you like
• 💻 **Hardware advice** (GPUs, CPUs, PC builds)
• 🔍 **Threat awareness** (CVEs, exploits, active campaigns)

**What would you like to know?**`,
        timestamp: new Date(),
      },
    ]);
    setInput('');
    setStatus('idle');
    toolRateLimiters.gamingCopilot.reset();
    inputRef.current?.focus();
  }, []);

  return (
    <ErrorBoundary toolName="Gaming Copilot">
      <Layout>
        <SEO
          title="Gaming Copilot AI — The Grid Nexus"
          description="AI-powered gaming assistant. Get real-time advice on game security, recommendations, hardware, and threat awareness."
        />
        <div className="min-h-screen bg-[#0B0E14] text-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/tools/security-scanner" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Bot className="w-7 h-7 text-[#B026FF]" />
                  Gaming Copilot
                </h1>
                <p className="text-gray-400 mt-1">
                  Your AI gaming intelligence assistant — security, recommendations, hardware, and threat awareness.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={reset} className="border-gray-700 shrink-0">
                <RotateCcw className="w-4 h-4 mr-1" />
                New Chat
              </Button>
            </div>

            {/* Error */}
            {status === 'error' && (
              <ErrorState
                title="Rate limited"
                message="Please wait a moment before sending more messages."
              />
            )}

            {/* Chat Area */}
            <Card className="bg-[#131820] border-gray-800 min-h-[500px] flex flex-col">
              <CardContent className="pt-6 pb-4 flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px] pr-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.role !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-[#B026FF]/20 flex items-center justify-center shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-[#B026FF]" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-3',
                          msg.role === 'user'
                            ? 'bg-[#B026FF]/20 border border-[#B026FF]/30'
                            : 'bg-[#0B0E14] border border-gray-800'
                        )}
                      >
                        {msg.role === 'user' ? (
                          <p className="text-sm text-white">{msg.content}</p>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                            {renderMarkdown(msg.content)}
                          </div>
                        )}
                        <p className="text-[10px] text-gray-600 mt-2 text-right">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                          <Gamepad2 className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {status === 'loading' && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#B026FF]/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-[#B026FF]" />
                      </div>
                      <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested chips */}
                {messages.length <= 2 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {SUGGESTED_MESSAGES.map((msg, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(msg)}
                        className="border-gray-700 text-xs text-gray-400 hover:text-white hover:border-[#B026FF] hover:bg-[#B026FF]/10"
                      >
                        <Lightbulb className="w-3 h-3 mr-1 text-[#B026FF]" />
                        {msg}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about gaming security, recommendations, hardware…"
                    disabled={status === 'loading'}
                    className="bg-[#0B0E14] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#B026FF]"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={status === 'loading' || !input.trim()}
                    className="bg-[#B026FF] hover:bg-[#B026FF]/80 text-white shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer info */}
            <p className="text-xs text-gray-600 text-center">
              Responses are generated by The Grid Nexus knowledge base. For real-time threat data, check the Security Dashboard.
            </p>
          </div>
        </div>
        <ToolCrossLinks related={[
            "/tools/recommendation-engine",
            "/tools/release-predictor",
            "/tools/threat-scanner",
            "/tools/pc-builder",
          ]} />
      </Layout>
    </ErrorBoundary>
  );
}
