/**
 * Seed reviewed recovery playbooks + official links for the launch platforms
 * (blueprint: Steam, Discord, Epic, EA, Riot). Idempotent — safe to re-run.
 * Official URLs only, human-verified at seed time; no guessed support links.
 */
import { mutation } from "./_generated/server";

type Step = {
  key: string;
  title: string;
  body: string;
  urgency: "critical" | "important" | "optional";
  requiresCleanDevice?: boolean;
  officialLinkPurpose?: "recovery" | "security";
  selfReportedOnly: true;
};

type Playbook = {
  schemaVersion: 1;
  platformSlug: string;
  scenarioSlug: string;
  disclaimer: string;
  steps: Step[];
};

type Platform = {
  slug: string;
  name: string;
  links: { purpose: "recovery" | "security" | "login"; url: string }[];
  playbooks: Playbook[];
};

const DISCLAIMER =
  "The Grid Nexus does not recover accounts or request account credentials. Follow the official process.";

const STEAM: Platform = {
  slug: "steam",
  name: "Steam",
  links: [
    { purpose: "recovery", url: "https://help.steampowered.com/" },
    { purpose: "security", url: "https://store.steampowered.com/twofactor/manage" },
    { purpose: "login", url: "https://store.steampowered.com/login/" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "steam",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Use a different trusted device if possible", body: "If you suspect malware, avoid signing in from the possibly infected device until it has been cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "secure-email", title: "Secure the email connected to Steam", body: "Confirm you still control the email address, change its password if needed, and enable its own two-factor authentication.", urgency: "critical", selfReportedOnly: true },
        { key: "official-recovery", title: "Start Steam's official account-recovery process", body: "Use Steam Support directly rather than a search-result link or a third-party recovery service.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "revoke-sessions", title: "Review authorized devices and Steam Guard", body: "After regaining access, deauthorize unfamiliar devices and review Steam Guard settings.", urgency: "important", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "review-api-key", title: "Review Steam Web API key access", body: "If you did not intentionally create an API key, revoke it through Steam's official API key page.", urgency: "important", officialLinkPurpose: "security", selfReportedOnly: true },
      ],
    },
  ],
};

const DISCORD: Platform = {
  slug: "discord",
  name: "Discord",
  links: [
    { purpose: "recovery", url: "https://support.discord.com/hc/en-us/articles/216679607" },
    { purpose: "security", url: "https://support.discord.com/hc/en-us/articles/219576828-Setting-up-Two-Factor-Authentication" },
    { purpose: "login", url: "https://discord.com/login" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "discord",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Isolate a possibly infected device first", body: "Discord account theft often comes with a token stealer. Sign out on the infected device and do not reuse it until cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "change-password", title: "Change your password from a clean device", body: "Changing your Discord password logs out all other sessions, revoking a stolen token.", urgency: "critical", selfReportedOnly: true },
        { key: "enable-2fa", title: "Enable two-factor authentication", body: "Turn on 2FA so a stolen password or token alone cannot take the account back over.", urgency: "critical", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "official-report", title: "Report the compromised account to Discord", body: "Use Discord's official support flow to report the compromise and recover access if you are locked out.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "review-bots", title: "Review authorized apps and bots", body: "Check which third-party apps and bots have access and revoke anything you do not recognize.", urgency: "important", selfReportedOnly: true },
      ],
    },
  ],
};

const EPIC: Platform = {
  slug: "epic-games",
  name: "Epic Games",
  links: [
    { purpose: "recovery", url: "https://www.epicgames.com/help/en-US/c-Category_EpicAccount/c-AccountSecurity" },
    { purpose: "security", url: "https://www.epicgames.com/help/en-US/c-Category_EpicAccount/c-EpicAccountSecurity" },
    { purpose: "login", url: "https://www.epicgames.com/id/login" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "epic-games",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Use a clean device", body: "If malware is suspected, avoid signing in from the infected device until it is cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "secure-email", title: "Secure the email on the Epic account", body: "Confirm you still control the email address and enable its own two-factor authentication.", urgency: "critical", selfReportedOnly: true },
        { key: "official-recovery", title: "Submit Epic's official account-recovery request", body: "Use Epic's official recovery form; do not trust third-party 'recovery agents'.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "enable-2fa", title: "Enable two-factor authentication", body: "Turn on Epic's 2FA after regaining access so the account cannot be re-taken with a password alone.", urgency: "critical", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "review-linked", title: "Review linked external accounts", body: "Unlink any unfamiliar console or social accounts that could be used to sign in.", urgency: "important", selfReportedOnly: true },
      ],
    },
  ],
};

const EA: Platform = {
  slug: "ea",
  name: "EA",
  links: [
    { purpose: "recovery", url: "https://help.ea.com/en/help/account/i-think-someone-hacked-my-ea-account/" },
    { purpose: "security", url: "https://help.ea.com/en/help/account/ea-login-verification/" },
    { purpose: "login", url: "https://signin.ea.com/p/web2/login" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "ea",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Use a clean device", body: "If malware is suspected, avoid signing in from the infected device until it is cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "secure-email", title: "Secure the email on your EA account", body: "Confirm you still control the email address and enable its own two-factor authentication.", urgency: "critical", selfReportedOnly: true },
        { key: "official-recovery", title: "Use EA's official hacked-account process", body: "Follow EA Help's 'I think someone hacked my EA account' steps — never a third-party recovery service.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "enable-2fa", title: "Turn on EA Login Verification", body: "EA's two-factor login verification prevents a password alone from re-taking the account.", urgency: "critical", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "review-linked", title: "Review linked accounts", body: "Unlink any unfamiliar console or platform accounts that could be used to sign in.", urgency: "important", selfReportedOnly: true },
      ],
    },
  ],
};

const RIOT: Platform = {
  slug: "riot-games",
  name: "Riot Games",
  links: [
    { purpose: "recovery", url: "https://support.riotgames.com/hc/en-us/articles/201751944-Recovering-Your-Account" },
    { purpose: "security", url: "https://account.riotgames.com/" },
    { purpose: "login", url: "https://auth.riotgames.com/login" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "riot-games",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Use a clean device", body: "If malware is suspected, avoid signing in from the infected device until it is cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "secure-email", title: "Secure the email on your Riot account", body: "Confirm you still control the email address and enable its own two-factor authentication.", urgency: "critical", selfReportedOnly: true },
        { key: "official-recovery", title: "Start Riot's official account recovery", body: "Submit Riot's account-recovery request; do not trust third-party 'recovery agents'.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "enable-2fa", title: "Enable two-factor authentication", body: "Turn on 2FA on your Riot account so a stolen password alone cannot take it back over.", urgency: "critical", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "review-sessions", title: "Review active sign-in sessions", body: "Sign out of unfamiliar sessions after regaining access.", urgency: "important", selfReportedOnly: true },
      ],
    },
  ],
};

const PLAYSTATION: Platform = {
  slug: "playstation",
  name: "PlayStation",
  links: [
    { purpose: "recovery", url: "https://www.playstation.com/support/account/recover-account/" },
    { purpose: "security", url: "https://www.playstation.com/support/account/2sv/" },
    { purpose: "login", url: "https://www.playstation.com/sign-in/" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "playstation",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Use a clean device", body: "If malware is suspected, avoid signing in from the infected device until it is cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "secure-email", title: "Secure the email on your account", body: "Confirm you still control the email address and enable its own two-factor authentication.", urgency: "critical", selfReportedOnly: true },
        { key: "official-recovery", title: "Use PlayStation's official account-recovery process", body: "Follow PlayStation Support's recovery steps; do not trust third-party 'recovery agents'.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "enable-2fa", title: "Turn on 2-step verification", body: "Enable PlayStation 2SV so a stolen password alone cannot re-take the account.", urgency: "critical", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "revoke-devices", title: "Sign out of unfamiliar consoles and devices", body: "After regaining access, deactivate unfamiliar consoles and sign out of other sessions.", urgency: "important", selfReportedOnly: true },
      ],
    },
  ],
};

const XBOX: Platform = {
  slug: "xbox",
  name: "Xbox",
  links: [
    { purpose: "recovery", url: "https://account.live.com/acsr" },
    { purpose: "security", url: "https://account.microsoft.com/security" },
    { purpose: "login", url: "https://login.live.com/" },
  ],
  playbooks: [
    {
      schemaVersion: 1,
      platformSlug: "xbox",
      scenarioSlug: "account-stolen",
      disclaimer: DISCLAIMER,
      steps: [
        { key: "isolate-device", title: "Use a clean device", body: "If malware is suspected, avoid signing in from the infected device until it is cleaned.", urgency: "critical", requiresCleanDevice: true, selfReportedOnly: true },
        { key: "secure-email", title: "Secure the Microsoft account email", body: "Confirm you still control the email address and enable its own two-factor authentication.", urgency: "critical", selfReportedOnly: true },
        { key: "official-recovery", title: "Use Microsoft's official account-recovery form", body: "Submit Microsoft's account recovery form; do not trust third-party 'recovery agents'.", urgency: "critical", officialLinkPurpose: "recovery", selfReportedOnly: true },
        { key: "enable-2fa", title: "Turn on two-step verification or passwordless sign-in", body: "Enable Microsoft two-step verification (or go passwordless) so a stolen password alone cannot re-take the account.", urgency: "critical", officialLinkPurpose: "security", selfReportedOnly: true },
        { key: "review-devices", title: "Review devices and recent sign-ins", body: "Remove unfamiliar devices from your Microsoft account after regaining access.", urgency: "important", selfReportedOnly: true },
      ],
    },
  ],
};

const PLATFORMS: Platform[] = [STEAM, DISCORD, EPIC, EA, RIOT, PLAYSTATION, XBOX];

/**
 * Shared high-value scenarios applied to every platform. `account-stolen` is
 * hand-written per platform above; these four cover the other top player jobs:
 * unauthorized purchase, lost authenticator, suspicious session, and a
 * suspected stealer/malware infection (the malware-first branch).
 */
function standardScenarios(platform: { slug: string; name: string }): Playbook[] {
  const base = { schemaVersion: 1 as const, platformSlug: platform.slug, disclaimer: DISCLAIMER };
  const name = platform.name;
  return [
    {
      ...base,
      scenarioSlug: 'unauthorized-purchase',
      steps: [
        { key: 'review-purchases', title: 'Review recent purchases', body: `Check your ${name} purchase history for charges you did not make, and do not click links in unexpected receipt emails.`, urgency: 'critical', selfReportedOnly: true },
        { key: 'secure-account', title: 'Secure the account first', body: 'Change your password and enable two-factor authentication so a thief cannot keep spending.', urgency: 'critical', officialLinkPurpose: 'security', selfReportedOnly: true },
        { key: 'report-charge', title: 'Report the unauthorized charge', body: `Dispute the charge through ${name}'s official support — never a third-party refund service.`, urgency: 'critical', officialLinkPurpose: 'recovery', selfReportedOnly: true },
        { key: 'review-payment', title: 'Review saved payment methods', body: 'Remove or replace any card or payment method you do not recognize.', urgency: 'important', selfReportedOnly: true },
      ],
    },
    {
      ...base,
      scenarioSlug: 'lost-authenticator',
      steps: [
        { key: 'backup-codes', title: 'Use your saved backup codes', body: 'If you saved recovery codes when you set up two-factor authentication, use one now to sign in.', urgency: 'critical', selfReportedOnly: true },
        { key: 'official-recovery', title: 'Recover through official support', body: `If you have no backup codes, use ${name}'s official account-recovery process — never a paid third-party service.`, urgency: 'critical', officialLinkPurpose: 'recovery', selfReportedOnly: true },
        { key: 're-enable-2fa', title: 'Re-enable two-factor authentication', body: 'Once you are back in, set up two-factor authentication again so the account is protected.', urgency: 'critical', officialLinkPurpose: 'security', selfReportedOnly: true },
        { key: 'save-codes', title: 'Store new backup codes offline', body: 'Save the new recovery codes somewhere safe and offline.', urgency: 'important', selfReportedOnly: true },
      ],
    },
    {
      ...base,
      scenarioSlug: 'suspicious-session',
      steps: [
        { key: 'change-password', title: 'Change your password', body: 'Change your password from a device you trust, in case someone else is already signed in.', urgency: 'critical', selfReportedOnly: true },
        { key: 'revoke-sessions', title: 'Sign out of other sessions', body: `Revoke unfamiliar sessions and devices through ${name}'s account settings.`, urgency: 'critical', officialLinkPurpose: 'security', selfReportedOnly: true },
        { key: 'enable-2fa', title: 'Enable two-factor authentication', body: 'Turn on two-factor authentication so a stolen password alone cannot take the account back.', urgency: 'critical', officialLinkPurpose: 'security', selfReportedOnly: true },
        { key: 'review-activity', title: 'Review recent activity', body: 'Check for changed email, phone number, linked accounts, or messages you did not write.', urgency: 'important', selfReportedOnly: true },
      ],
    },
    {
      ...base,
      scenarioSlug: 'suspected-malware',
      steps: [
        { key: 'isolate-device', title: 'Stop using the possibly infected device', body: 'Sign out and stop using the device until it has been scanned and cleaned. Use a different trusted device for the next steps.', urgency: 'critical', requiresCleanDevice: true, selfReportedOnly: true },
        { key: 'scan-device', title: 'Scan the device', body: 'Run a reputable antivirus or anti-malware scan and remove anything it flags before signing in again.', urgency: 'critical', selfReportedOnly: true },
        { key: 'change-passwords', title: 'Change passwords from a clean device', body: 'After cleaning, change your password from a device you trust — not the infected one.', urgency: 'critical', selfReportedOnly: true },
        { key: 'official-recovery', title: 'Recover the account if it was taken', body: `If the account was already stolen, follow ${name}'s official account-recovery process.`, urgency: 'critical', officialLinkPurpose: 'recovery', selfReportedOnly: true },
      ],
    },
    {
      ...base,
      scenarioSlug: 'email-changed',
      steps: [
        { key: 'act-fast', title: 'Act immediately on the change notice', body: `If you received an "email changed" notice you did not make, act now — an attacker is taking over the account.`, urgency: 'critical', selfReportedOnly: true },
        { key: 'clean-device', title: 'Use a clean device', body: 'If malware is suspected, do not sign in from the possibly infected device until it is cleaned.', urgency: 'critical', requiresCleanDevice: true, selfReportedOnly: true },
        { key: 'official-recovery', title: 'Recover through official support', body: `Use ${name}'s official account-recovery process to prove you own the account — never a third-party service.`, urgency: 'critical', officialLinkPurpose: 'recovery', selfReportedOnly: true },
        { key: 'restore-email', title: 'Restore your email and enable 2FA', body: 'After regaining access, restore your email address and turn on two-factor authentication.', urgency: 'critical', officialLinkPurpose: 'security', selfReportedOnly: true },
      ],
    },
    {
      ...base,
      scenarioSlug: 'lost-linked-email',
      steps: [
        { key: 'recover-email', title: 'Recover the linked email account', body: 'First recover access to the email address through its own provider — most account controls rely on it.', urgency: 'critical', selfReportedOnly: true },
        { key: 'official-recovery', title: 'Recover through official support', body: `If you cannot recover the email, use ${name}'s official account-recovery process to prove ownership another way.`, urgency: 'critical', officialLinkPurpose: 'recovery', selfReportedOnly: true },
        { key: 'update-email', title: 'Update the linked email', body: 'Once back in, change the linked email to one you control.', urgency: 'important', selfReportedOnly: true },
        { key: 'enable-2fa', title: 'Enable two-factor authentication', body: 'Turn on two-factor authentication so the account is not tied to a single email.', urgency: 'critical', officialLinkPurpose: 'security', selfReportedOnly: true },
      ],
    },
    {
      ...base,
      scenarioSlug: 'scam-recovery-contact',
      steps: [
        { key: 'stop-contact', title: 'Stop communicating and do not pay', body: 'Stop responding to the "recovery service" and do not send more money — a scammer who has already defrauded you is unlikely to return the account even if paid.', urgency: 'critical', selfReportedOnly: true },
        { key: 'change-passwords', title: 'Change passwords from a clean device', body: 'Change your password and any passwords you reused, from a device you trust.', urgency: 'critical', selfReportedOnly: true },
        { key: 'report-scam', title: 'Report the scam', body: `Report the scammer to ${name} and to your payment provider if you paid.`, urgency: 'important', selfReportedOnly: true },
        { key: 'official-recovery', title: 'Recover through the official process', body: `Recover the account through ${name}'s official process — never a paid third party.`, urgency: 'critical', officialLinkPurpose: 'recovery', selfReportedOnly: true },
      ],
    },
  ];
}

export const seedRecoveryNavigator = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const seeded: string[] = [];

    for (const platform of PLATFORMS) {
      let platformId = (
        await ctx.db
          .query("securityEntities")
          .withIndex("by_slug", (q) => q.eq("slug", platform.slug))
          .first()
      )?._id;
      if (!platformId) {
        platformId = await ctx.db.insert("securityEntities", {
          kind: "platform",
          slug: platform.slug,
          name: platform.name,
          status: "active",
          createdAt: now,
          updatedAt: now,
        });
      }

      for (const l of platform.links) {
        const existing = await ctx.db
          .query("officialLinks")
          .withIndex("by_entity_purpose_locale", (q) =>
            q.eq("entityId", platformId).eq("purpose", l.purpose).eq("locale", "en")
          )
          .first();
        if (!existing) {
          await ctx.db.insert("officialLinks", {
            entityId: platformId,
            purpose: l.purpose,
            url: l.url,
            locale: "en",
            verifiedAt: now,
            state: "active",
          });
        }
      }

      for (const pb of [...platform.playbooks, ...standardScenarios(platform)]) {
        const existingPlaybook = await ctx.db
          .query("recoveryPlaybooks")
          .withIndex("by_entity_scenario_locale", (q) =>
            q.eq("entityId", platformId).eq("scenario", pb.scenarioSlug).eq("locale", "en")
          )
          .first();
        if (!existingPlaybook) {
          await ctx.db.insert("recoveryPlaybooks", {
            entityId: platformId,
            scenario: pb.scenarioSlug,
            version: "1",
            locale: "en",
            stepsJson: JSON.stringify(pb),
            status: "published",
            reviewedAt: now,
          });
        }
      }

      seeded.push(platform.slug);
    }

    return { ok: true, seeded };
  },
});
