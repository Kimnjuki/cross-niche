/**
 * Breach Simulation state machine (nexus-003).
 * Data Breach Simulation: Phishing Email → choices branch to security outcomes.
 */

export interface BreachChoice {
  id: string;
  label: string;
  nextStateId: string;
  xpDelta: number;
  breachDelta: number; // positive = worse, negative = better
  feedback: string;   // short message shown after choice
}

export interface BreachState {
  id: string;
  title: string;
  body: string;
  choices: BreachChoice[];
  isTerminal: boolean; // no more choices (success/fail end)
}

export const BREACH_START_STATE_IDS = [
  'phishing_received',
  'usb_found',
  'password_prompt',
  'social_engineering',
  'public_wifi',
  'suspicious_download',
] as const;
export const BREACH_START_STATE_ID = 'phishing_received';

const states: Record<string, BreachState> = {
  phishing_received: {
    id: 'phishing_received',
    title: 'Phishing Email Received',
    body: 'You received an email from "IT Support" asking you to verify your account by clicking a link. The message looks urgent and mentions a "security policy update".',
    isTerminal: false,
    choices: [
      {
        id: 'click_link',
        label: 'Click Link',
        nextStateId: 'malware_triggered',
        xpDelta: 0,
        breachDelta: 35,
        feedback: 'You clicked the link. Redirecting...',
      },
      {
        id: 'report_it',
        label: 'Report to IT',
        nextStateId: 'reported_safe',
        xpDelta: 50,
        breachDelta: -10,
        feedback: 'You reported the email to IT. Good call.',
      },
      {
        id: 'delete',
        label: 'Delete',
        nextStateId: 'deleted_safe',
        xpDelta: 25,
        breachDelta: -5,
        feedback: 'You deleted the email without opening the link.',
      },
    ],
  },
  malware_triggered: {
    id: 'malware_triggered',
    title: 'Suspicious Activity Detected',
    body: 'The link opened a page that requested your credentials. Your browser flagged the site as suspicious. Your workstation may have been exposed.',
    isTerminal: false,
    choices: [
      {
        id: 'disconnect',
        label: 'Disconnect & Report to IT',
        nextStateId: 'contained',
        xpDelta: 20,
        breachDelta: 10,
        feedback: 'You disconnected and reported. Damage may be limited.',
      },
      {
        id: 'ignore',
        label: 'Ignore and continue working',
        nextStateId: 'full_breach',
        xpDelta: 0,
        breachDelta: 50,
        feedback: 'You continued. The breach spread.',
      },
    ],
  },
  contained: {
    id: 'contained',
    title: 'Incident Contained',
    body: 'IT confirmed the link was malicious. Your quick report helped limit the impact. No data exfiltrated from your account.',
    isTerminal: true,
    choices: [],
  },
  full_breach: {
    id: 'full_breach',
    title: 'BREACH — Simulation Over',
    body: 'The simulated breach reached critical level. In a real scenario, credentials could have been stolen and used to access internal systems. Restart to try again.',
    isTerminal: true,
    choices: [],
  },
  reported_safe: {
    id: 'reported_safe',
    title: 'Success — Phishing Reported',
    body: 'IT confirmed it was a phishing attempt. You avoided the trap and helped protect the organization. +50 Nexus XP.',
    isTerminal: true,
    choices: [],
  },
  deleted_safe: {
    id: 'deleted_safe',
    title: 'Safe — Email Deleted',
    body: 'You removed the threat without engaging. No breach. +25 Nexus XP. Reporting to IT would have earned more XP.',
    isTerminal: true,
    choices: [],
  },
  // Additional scenario: USB drive found
  usb_found: {
    id: 'usb_found',
    title: 'Unknown USB Drive Found',
    body: 'A colleague left an unlabeled USB drive on your desk. It could contain work files—or malware. What do you do?',
    isTerminal: false,
    choices: [
      {
        id: 'plug_usb',
        label: 'Plug in to check contents',
        nextStateId: 'malware_triggered',
        xpDelta: 0,
        breachDelta: 40,
        feedback: 'The USB contained malware. Never plug in unknown devices.',
      },
      {
        id: 'hand_to_it',
        label: 'Hand to IT Security',
        nextStateId: 'reported_safe',
        xpDelta: 45,
        breachDelta: -15,
        feedback: 'IT confirmed it was a test. You passed the security awareness check.',
      },
      {
        id: 'discard_usb',
        label: 'Discard in secure bin',
        nextStateId: 'deleted_safe',
        xpDelta: 30,
        breachDelta: -5,
        feedback: 'Safe choice. When in doubt, don\'t plug it in.',
      },
    ],
  },
  // Additional scenario: weak password prompt
  password_prompt: {
    id: 'password_prompt',
    title: 'Password Reset Request',
    body: 'You received an email asking you to reset your password via a link. The sender looks like your IT department, but the domain is slightly off (it-support@comp4ny.com).',
    isTerminal: false,
    choices: [
      {
        id: 'click_reset',
        label: 'Click the reset link',
        nextStateId: 'malware_triggered',
        xpDelta: 0,
        breachDelta: 45,
        feedback: 'Phishing site captured your credentials. Always use the official portal.',
      },
      {
        id: 'verify_first',
        label: 'Call IT to verify',
        nextStateId: 'reported_safe',
        xpDelta: 55,
        breachDelta: -20,
        feedback: 'IT confirmed it was phishing. You avoided a credential compromise.',
      },
      {
        id: 'ignore_email',
        label: 'Ignore and use company portal',
        nextStateId: 'contained',
        xpDelta: 40,
        breachDelta: -10,
        feedback: 'You went directly to the real portal. Smart move.',
      },
    ],
  },
  // Additional scenario: Social engineering call
  social_engineering: {
    id: 'social_engineering',
    title: 'Suspicious Phone Call',
    body: 'Someone claiming to be from IT calls you, saying your account was compromised. They ask you to verify your password over the phone to "secure your account".',
    isTerminal: false,
    choices: [
      {
        id: 'give_password',
        label: 'Provide password to verify',
        nextStateId: 'full_breach',
        xpDelta: 0,
        breachDelta: 50,
        feedback: 'Never share passwords over the phone. IT never asks for passwords.',
      },
      {
        id: 'hang_up_call_it',
        label: 'Hang up and call IT directly',
        nextStateId: 'reported_safe',
        xpDelta: 60,
        breachDelta: -20,
        feedback: 'You verified with IT. This was a social engineering attempt.',
      },
      {
        id: 'ask_for_id',
        label: 'Ask for employee ID and verify',
        nextStateId: 'contained',
        xpDelta: 50,
        breachDelta: -10,
        feedback: 'Good verification practice. The caller hung up when asked for ID.',
      },
    ],
  },
  // Additional scenario: Public WiFi
  public_wifi: {
    id: 'public_wifi',
    title: 'Public WiFi Network',
    body: 'You\'re at a coffee shop and see a WiFi network called "Free_Public_WiFi". You need to check work email urgently.',
    isTerminal: false,
    choices: [
      {
        id: 'connect_public',
        label: 'Connect to public WiFi',
        nextStateId: 'malware_triggered',
        xpDelta: 0,
        breachDelta: 30,
        feedback: 'Public WiFi can be monitored. Use VPN or mobile hotspot.',
      },
      {
        id: 'use_vpn',
        label: 'Use company VPN first',
        nextStateId: 'contained',
        xpDelta: 45,
        breachDelta: -10,
        feedback: 'VPN encrypts your connection. Safe choice.',
      },
      {
        id: 'use_hotspot',
        label: 'Use mobile hotspot',
        nextStateId: 'reported_safe',
        xpDelta: 40,
        breachDelta: -15,
        feedback: 'Mobile hotspot is more secure than public WiFi.',
      },
    ],
  },
  // Additional scenario: Suspicious download
  suspicious_download: {
    id: 'suspicious_download',
    title: 'Unexpected Download Prompt',
    body: 'A popup appears while browsing, claiming you need to install a "security update" to continue. The download file is named "update.exe" from an unknown source.',
    isTerminal: false,
    choices: [
      {
        id: 'download_file',
        label: 'Download and install',
        nextStateId: 'malware_triggered',
        xpDelta: 0,
        breachDelta: 40,
        feedback: 'Never install software from untrusted sources. This was malware.',
      },
      {
        id: 'close_popup',
        label: 'Close popup and continue',
        nextStateId: 'contained',
        xpDelta: 35,
        breachDelta: -5,
        feedback: 'Good instinct. Legitimate updates come through official channels.',
      },
      {
        id: 'check_with_it',
        label: 'Check with IT first',
        nextStateId: 'reported_safe',
        xpDelta: 50,
        breachDelta: -15,
        feedback: 'IT confirmed it was a phishing popup. You avoided malware.',
      },
    ],
  },
};

export function getBreachState(stateId: string): BreachState | undefined {
  return states[stateId];
}

export function getInitialState(scenarioId?: string): BreachState {
  const id = scenarioId && states[scenarioId] ? scenarioId : BREACH_START_STATE_ID;
  return states[id];
}

export function getScenarioIds(): string[] {
  return [...BREACH_START_STATE_IDS];
}

export function getChoice(stateId: string, choiceId: string): BreachChoice | undefined {
  const state = states[stateId];
  return state?.choices.find((c) => c.id === choiceId);
}

export function applyChoice(stateId: string, choiceId: string): { nextState: BreachState; xpDelta: number; breachDelta: number } | null {
  const choice = getChoice(stateId, choiceId);
  if (!choice) return null;
  const nextState = states[choice.nextStateId];
  if (!nextState) return null;
  return {
    nextState,
    xpDelta: choice.xpDelta,
    breachDelta: choice.breachDelta,
  };
}
