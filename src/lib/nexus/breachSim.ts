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
};

export function getBreachState(stateId: string): BreachState | undefined {
  return states[stateId];
}

export function getInitialState(): BreachState {
  return states[BREACH_START_STATE_ID];
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
