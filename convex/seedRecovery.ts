/**
 * Seed a reviewed Steam "account stolen" recovery playbook + official links.
 * Idempotent — safe to re-run. Official URLs only, human-verified at seed time.
 */
import { mutation } from "./_generated/server";

const STEAM_ACCOUNT_STOLEN = {
  schemaVersion: 1,
  platformSlug: "steam",
  scenarioSlug: "account-stolen",
  disclaimer:
    "The Grid Nexus does not recover accounts or request account credentials. Follow the official Steam Support process.",
  steps: [
    {
      key: "isolate-device",
      title: "Use a different trusted device if possible",
      body: "If you suspect malware, avoid signing in from the possibly infected device until it has been cleaned.",
      urgency: "critical",
      requiresCleanDevice: true,
      selfReportedOnly: true,
    },
    {
      key: "secure-email",
      title: "Secure the email connected to Steam",
      body: "Confirm you still control the email address, change its password if needed, and enable its own two-factor authentication.",
      urgency: "critical",
      selfReportedOnly: true,
    },
    {
      key: "official-recovery",
      title: "Start Steam's official account-recovery process",
      body: "Use Steam Support directly rather than a search-result link or a third-party recovery service.",
      urgency: "critical",
      officialLinkPurpose: "recovery",
      selfReportedOnly: true,
    },
    {
      key: "revoke-sessions",
      title: "Review authorized devices and Steam Guard",
      body: "After regaining access, deauthorize unfamiliar devices and review Steam Guard settings.",
      urgency: "important",
      officialLinkPurpose: "security",
      selfReportedOnly: true,
    },
    {
      key: "review-api-key",
      title: "Review Steam Web API key access",
      body: "If you did not intentionally create an API key, revoke it through Steam's official API key page.",
      urgency: "important",
      officialLinkPurpose: "security",
      selfReportedOnly: true,
    },
  ],
};

export const seedSteamRecovery = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    let platformId = (
      await ctx.db
        .query("securityEntities")
        .withIndex("by_slug", (q) => q.eq("slug", "steam"))
        .first()
    )?._id;
    if (!platformId) {
      platformId = await ctx.db.insert("securityEntities", {
        kind: "platform",
        slug: "steam",
        name: "Steam",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
    }

    const links = [
      { purpose: "recovery", url: "https://help.steampowered.com/" },
      { purpose: "security", url: "https://store.steampowered.com/twofactor/manage" },
      { purpose: "login", url: "https://store.steampowered.com/login/" },
    ] as const;
    for (const l of links) {
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

    const existingPlaybook = await ctx.db
      .query("recoveryPlaybooks")
      .withIndex("by_entity_scenario_locale", (q) =>
        q.eq("entityId", platformId).eq("scenario", "account-stolen").eq("locale", "en")
      )
      .first();
    if (!existingPlaybook) {
      await ctx.db.insert("recoveryPlaybooks", {
        entityId: platformId,
        scenario: "account-stolen",
        version: "1",
        locale: "en",
        stepsJson: JSON.stringify(STEAM_ACCOUNT_STOLEN),
        status: "published",
        reviewedAt: now,
      });
    }

    return { ok: true };
  },
});
