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

const PLATFORMS: Platform[] = [STEAM, DISCORD, EPIC];

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

      for (const pb of platform.playbooks) {
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
