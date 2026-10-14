/**
 * East Africa mobile gaming security guide (growth-audit Pillar G).
 *
 * Written from DOCUMENTED, public patterns — mobile-money social engineering,
 * SIM-swap account takeover, and APK sideloading risk — not fabricated local
 * experience. Deliberately general where local specifics (exact carrier flows,
 * regional hotlines) would need the owner's first-hand knowledge to state
 * accurately.
 */
export const EAST_AFRICA_GUIDE = {
  slug: 'east-africa-mobile-gaming-security-guide',
  title: 'Mobile Gaming Security in East Africa: M-Pesa, APK & SIM-Swap Risks',
  metaTitle: 'East Africa Mobile Gaming Security Guide',
  seoDescription:
    'Protect gaming accounts in East Africa from M-Pesa and mobile-money scams, SIM-swap takeover and unsafe APK downloads. Practical steps for budget Android and iOS.',
  summary:
    'How mobile-money scams, SIM-swap attacks and sideloaded APKs put East African gaming accounts at risk — and the concrete steps that stop them.',
  contentType: 'security',
  tags: ['mobile-gaming', 'east-africa', 'mpesa', 'sim-swap', 'apk', 'android'],
  body: `## Why East African Players Face a Different Threat Mix

Gaming account theft follows the money and the login method. In East Africa, two things change the risk profile compared with North America or Western Europe: **mobile money is the default payment rail**, and **many players run budget Android devices** where sideloaded APKs are common. Attackers have adapted to both.

This guide covers the three patterns that most often cost East African players their accounts or money: mobile-money scams, SIM-swap takeover, and unsafe APK downloads.

## 1. M-Pesa and Mobile-Money Scams

Mobile-money services such as M-Pesa are the primary way many players buy games, top up, and receive payouts — which makes them a prime social-engineering target.

The common patterns:

- **Fake top-up or "promo" messages.** A message that looks like it comes from a game, a tournament, or the operator, asking you to send money or share a code to "receive" a reward.
- **"Help me cash out" reversal scams.** A request to send money first, with a promise of a larger payout that never arrives.
- **Phishing for the mobile-money PIN** through fake app-update prompts or lookalike sign-in pages.

**What to do:** never share a mobile-money PIN, one-time code, or the "STK push" prompt you receive with anyone — no legitimate service asks for these. Confirm any "promo" directly inside the official game or operator app, not through the link or number that messaged you. Treat an unexpected "you've won" message as suspicious by default.

## 2. SIM-Swap Account Takeover

Many gaming accounts still allow **SMS as a recovery or two-factor method**. In a SIM-swap attack, an attacker convinces the mobile operator to move your number to a SIM they control — after which they receive every SMS code meant for you, including password resets and "forgot 2FA" codes.

Because SIM-swap targets the phone number rather than the password, a strong password does not stop it. The documented defence is to **stop using SMS as the second factor**:

- Move two-factor authentication to a **TOTP authenticator app** (Google Authenticator, Authy, or similar) or a **passkey**.
- Remove SMS from the recovery options wherever the platform allows.
- Store backup codes offline (printed or in a password manager), not as a screenshot on the phone itself.

See the [full mobile gaming security guide](/article/mobile-gaming-security-guide) for the step-by-step version of moving off SMS.

## 3. Unsafe APK Downloads on Budget Android

On lower-cost Android devices, players sometimes install games from APK sites because a title is not on the official store, is region-locked, or because the APK promises free currency. This bypasses the store review process.

Google has reported **more than 50 times more malware from internet-sideloaded sources than from Google Play** (a figure the open-source store F-Droid disputes), and researchers found malware in dozens of Google Play apps in 2026 — so even official stores are not perfect, but sideloading is dramatically riskier.

**What to do:**

- Prefer the official store (Google Play). Keep **Play Protect** scanning enabled.
- If you must sideload, verify the source, check the file hash against a published value, and scan the file before installing.
- Never grant a sideloaded game **SMS, accessibility, or notification-listening** permissions — these are the exact capabilities an info-stealer needs to capture one-time codes.

## The Ten-Minute East Africa Checklist

1. Enable a **TOTP authenticator** (not SMS) on every gaming account.
2. Move mobile-money and gaming passwords into a **password manager** with unique passwords.
3. Enable **Play Protect** and avoid APK sites.
4. Review app **permissions** and revoke SMS/accessibility access you did not explicitly grant.
5. Store **backup codes** offline, and write down your operator's SIM-swap support route.

## Sources and Caveats

- Google Play Protect and sideloading statistics: Google's published reports (the 50x figure) and F-Droid's rebuttal are linked in the [mobile guide](/article/mobile-gaming-security-guide).
- SIM-swap and TOTP guidance follows the same documented advice as our platform guides for [Steam, Xbox, PlayStation and Discord](/article/ultimate-guide-steam-xbox-playstation-discord-security).

This page is general guidance based on documented patterns. Regional specifics — exact operator procedures, hotlines and local pricing — should be confirmed directly with your mobile operator and updated as they change.`,
};
