/**
 * OnboardingFlow v2 — Personalized onboarding wizard (UX-004 spec)
 * 4-screen flow: Gamer type → Platforms → Priorities → Done
 * Triggers on first visit (localStorage check)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Shield, Gamepad2, Monitor, Smartphone, Cloud, Sparkles, Zap, HeartHandshake, Users, Layers, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StepScreen = 'welcome' | 'userType' | 'platforms' | 'priorities' | 'complete';

interface OnboardingState {
  userType: string | null;
  platforms: string[];
  priorities: string[];
  completed: boolean;
}

const userTypes = [
  { id: 'competitive', label: 'Competitive Gamer', icon: Zap, desc: 'Ranked play, tournaments, high-stakes gaming' },
  { id: 'casual', label: 'Casual Player', icon: Gamepad2, desc: 'Solo campaigns, co-op, weekend gaming' },
  { id: 'enthusiast', label: 'Tech Enthusiast', icon: Monitor, desc: 'Hardware builds, VR, latest gaming tech' },
  { id: 'developer', label: 'Game Developer', icon: Layers, desc: 'Indie dev, modding, game security' },
  { id: 'creator', label: 'Content Creator', icon: Users, desc: 'Streaming, YouTube, gaming content' },
];

const platforms = [
  { id: 'pc', label: 'PC / Steam', icon: Monitor },
  { id: 'playstation', label: 'PlayStation', icon: Gamepad2 },
  { id: 'xbox', label: 'Xbox', icon: Zap },
  { id: 'nintendo', label: 'Nintendo', icon: Sparkles },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'cloud', label: 'Cloud Gaming', icon: Cloud },
];

const priorityOptions = [
  { id: 'security', label: 'Security & Privacy', icon: Shield, desc: 'Account protection, 2FA, breach monitoring' },
  { id: 'performance', label: 'Performance', icon: Zap, desc: 'PC optimization, latency, hardware guides' },
  { id: 'value', label: 'Value for Money', icon: HeartHandshake, desc: 'Best deals, subscription value, free tools' },
  { id: 'community', label: 'Community', icon: Users, desc: 'Discord servers, forums, multiplayer' },
  { id: 'tools', label: 'Security Tools', icon: Layers, desc: 'Scanners, checkups, threat monitors' },
];

export function OnboardingFlow({ onDismiss }: { onDismiss?: () => void }) {
  const [screen, setScreen] = useState<StepScreen>('welcome');
  const [state, setState] = useState<OnboardingState>({
    userType: null,
    platforms: [],
    priorities: [],
    completed: false,
  });
  const navigate = useNavigate();

  const dismiss = useCallback(() => {
    localStorage.setItem('onboardingCompleted', 'true');
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  const handleComplete = useCallback(() => {
    localStorage.setItem('onboardingState', JSON.stringify(state));
    localStorage.setItem('onboardingCompleted', 'true');
    setState(s => ({ ...s, completed: true }));
    setTimeout(() => {
      navigate('/security');
    }, 1500);
  }, [state, navigate]);

  const totalSteps = 4;
  const stepIndex = screen === 'welcome' ? 0 : screen === 'userType' ? 1 : screen === 'platforms' ? 2 : screen === 'priorities' ? 3 : 4;
  const progress = screen === 'complete' ? 100 : ((stepIndex) / totalSteps) * 100;

  // Toggle platform selection
  const togglePlatform = (id: string) => {
    setState(s => ({
      ...s,
      platforms: s.platforms.includes(id)
        ? s.platforms.filter(p => p !== id)
        : [...s.platforms, id]
    }));
  };

  // Toggle priority selection
  const togglePriority = (id: string) => {
    setState(s => ({
      ...s,
      priorities: s.priorities.includes(id)
        ? s.priorities.filter(p => p !== id)
        : [...s.priorities, id]
    }));
  };

  if (state.completed) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0E1A]/95 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-accent-purple/20 flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-accent-purple" />
          </div>
          <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
          <p className="text-zinc-400">Your personalized security dashboard is ready. Redirecting...</p>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-accent-purple animate-pulse rounded-full transition-all duration-1000" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0E1A]/98 flex flex-col">
      {/* Header */}
      <div className="border-b border-border-subtle">
        <div className="container mx-auto px-4 max-w-3xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent-purple" />
            <span className="font-display font-bold text-white text-lg">The Grid Nexus</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">Step {Math.min(stepIndex + 1, 4)} of {totalSteps}</span>
            <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-accent-purple transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <button type="button" onClick={dismiss} className="text-zinc-500 hover:text-white p-1" aria-label="Skip onboarding">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {screen === 'welcome' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 rounded-2xl bg-accent-purple/20 flex items-center justify-center mx-auto">
                <Shield className="w-12 h-12 text-accent-purple" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome to<br />
                <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
                  The Grid Nexus
                </span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-md mx-auto">
                Your personalized gaming security intelligence hub. Let's tailor your experience in under 90 seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {[
                  { icon: Shield, text: 'Account security alerts' },
                  { icon: Zap, text: 'Threat monitoring tools' },
                  { icon: Users, text: 'Community intel' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-card border border-border-subtle text-xs text-zinc-300">
                    <Icon className="h-3 w-3 text-accent-cyan" />
                    {text}
                  </span>
                ))}
              </div>
              <Button
                onClick={() => setScreen('userType')}
                className="bg-accent-purple hover:bg-[#5A52E0] text-white px-8 py-3 text-base font-semibold"
              >
                Get Started
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-zinc-600">
                Or <button type="button" onClick={dismiss} className="underline hover:text-zinc-400">skip</button> — you can customize any time
              </p>
            </div>
          )}

          {screen === 'userType' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">What kind of gamer are you?</h2>
                <p className="text-zinc-400">Choose the type that fits best</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userTypes.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setState(s => ({ ...s, userType: id })); setScreen('platforms'); }}
                    className={`flex items-start gap-3 p-4 border text-left transition-all ${
                      state.userType === id
                        ? 'border-accent-purple bg-accent-purple/10'
                        : 'border-border-subtle bg-surface-card hover:border-accent-purple/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-accent-purple" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === 'platforms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Which platforms do you use?</h2>
                <p className="text-zinc-400">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {platforms.map(({ id, label, icon: Icon }) => {
                  const selected = state.platforms.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePlatform(id)}
                      className={`flex flex-col items-center gap-2 p-4 border transition-all ${
                        selected
                          ? 'border-accent-purple bg-accent-purple/10'
                          : 'border-border-subtle bg-surface-card hover:border-accent-purple/40'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${selected ? 'text-accent-purple' : 'text-zinc-400'}`} />
                      <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-zinc-400'}`}>{label}</span>
                      {selected && <Check className="h-4 w-4 text-accent-purple" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setScreen('userType')} className="border-border-default text-zinc-300">
                  Back
                </Button>
                <Button
                  onClick={() => setScreen('priorities')}
                  className="bg-accent-purple hover:bg-[#5A52E0] text-white"
                  disabled={state.platforms.length === 0}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {screen === 'priorities' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">What matters most to you?</h2>
                <p className="text-zinc-400">Pick your top priorities for gaming security</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {priorityOptions.map(({ id, label, icon: Icon, desc }) => {
                  const selected = state.priorities.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePriority(id)}
                      className={`flex items-center gap-4 p-4 border transition-all ${
                        selected
                          ? 'border-accent-purple bg-accent-purple/10'
                          : 'border-border-subtle bg-surface-card hover:border-accent-purple/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selected ? 'bg-accent-purple/20' : 'bg-zinc-800'
                      }`}>
                        <Icon className={`h-5 w-5 ${selected ? 'text-accent-purple' : 'text-zinc-400'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-white text-sm">{label}</p>
                        <p className="text-xs text-zinc-500">{desc}</p>
                      </div>
                      {selected && <Check className="h-5 w-5 text-accent-purple shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setScreen('platforms')} className="border-border-default text-zinc-300">
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-accent-purple hover:bg-[#5A52E0] text-white"
                  disabled={state.priorities.length === 0}
                >
                  Complete Setup
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
