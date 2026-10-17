/**
 * Gaming-security threat guides — the "GN-015 editorial" batch.
 *
 * Each guide is written from DOCUMENTED, public security research and official
 * vendor documentation (cited inline with a Sources section), NOT from
 * fabricated surveys, telemetry, or first-person testing. Where a platform's
 * feature support is in flux, the guide says so and names the source.
 *
 * Seeded into Convex via convex/upsertThreatGuides.ts.
 */

export interface ThreatGuide {
  slug: string;
  title: string;
  metaTitle: string;
  seoDescription: string;
  summary: string;
  contentType: 'security' | 'gaming';
  tags: string[];
  body: string;
}

export const THREAT_GUIDES: ThreatGuide[] = [
  // ── 1. Discord token theft + QR-login scams ────────────────────────────────
  {
    slug: 'discord-token-theft-qr-login-scams',
    title: 'How Your Discord Account Actually Gets Stolen',
    metaTitle: 'Discord Token Theft & QR-Login Scams: How Accounts Get Stolen',
    seoDescription:
      'Discord token stealers and QR-login phishing are the two most common ways gaming accounts get taken over. Here is how each works, the exact warning signs, and how to stop them.',
    summary:
      'Discord accounts get stolen through malware that harvests your login token and through QR-login phishing that tricks you into approving an attacker\u2019s session. Here is how both work and what actually stops them.',
    contentType: 'security',
    tags: ['discord', 'token-stealer', 'phishing', 'qr-login', 'account-takeover', 'malware'],
    body: `If you spend any time in gaming servers, you have almost certainly received a message like this: "free Nitro," "beta test our new game," or a link to "claim your drop." Most of them are not gifts. They are the delivery mechanism for the two most common ways a Discord account gets stolen — token-stealing malware and QR-login phishing.

This guide walks through both, because the defence for each is different. One you can mostly solve with settings. The other you solve by refusing to click.

## The token: why a password is not what they steal

Your Discord "token" is the long credential string the app uses to prove you are already logged in. Steal the token and you do not need the password, the email, or the two-factor code — the token is the logged-in session. That is why Discord-focused malware does not bother asking for your password. It reads the token straight out of the app.

Security researchers have documented this for years. [BbyStealer](https://petermaguire.xyz/posts/bbystealer-analysis/), first seen around December 2021, injects itself into the Discord client and intercepts login requests so it can capture the token in its unencrypted form — a trick that defeats Discord's own token encryption because the token has to be plaintext at the moment it is sent. [Skuld Stealer](https://www.darkreading.com/vulnerabilities-threats/skuld-stealer-shows-open-source-dark-side), an open-source stealer written in Go that appeared in mid-2023, injects JavaScript that pulls emails, passwords, tokens, and even two-factor registration requests.

Neither of these asks for your password. They run, they read, they upload. The first sign is usually not your account acting weird — it is your friends receiving messages from "you" that you never sent.

## The lure: "game tester" and "beta" DMs

The malware has to get onto your machine somehow, and the most common bait is a direct message. [Malwarebytes documented a campaign](https://www.infosecurity-magazine.com/news/infostealer-campaign-discord/) where victims get an unsolicited message from someone posing as a developer asking if they want to beta test a game. If you say yes, you get a download link and a password for an archive — hosted on Dropbox, Catbox, or Discord's own CDN using a compromised account so it looks legitimate. Inside is not a game. It is Nova, Ageo, or Hexon stealer, packed into an NSIS or MSI installer.

The malware then harvests browser passwords, session cookies for Discord and Steam, and cryptocurrency wallet data. Discord's own [phishing guidance](https://support.discord.com/hc/en-us/articles/360037660611) makes the same point from the other side: treat unsolicited files and links as hostile by default.

The rule that stops this whole class of attack is simple and worth stating plainly: **never run an executable someone sent you in a DM, even from a friend.** A real friend's account can be the one that got compromised. Legitimate games, mods, and tools are distributed through official sites and established platforms — not through a Discord attachment.

## The QR trick: approving a login you did not start

The second method targets a convenience feature. Discord lets you log in on a new device by scanning a QR code with your already-logged-in phone — no password typing. It is genuinely handy, and it is also phishable.

[Discord's own QR-login FAQ](https://support.discord.com/hc/en-us/articles/360039213771-QR-Code-Login-FAQ) is explicit about the risk: "If someone you don't know is asking you to login using a QR code, they may be trying to phish your account." The attack, often called [QRLJacking or "EvilQR"](https://breakdev.org/evilqr-phishing/), works like this: the attacker opens Discord's login page, grabs the sign-in QR code, and serves it on a fake page — a fake "exclusive server invite," for example. You scan it with your phone, your phone shows the "approve this login?" screen, and if you tap approve, the attacker's browser is now logged in as you.

The tell is always the same: **you are being asked to approve a login you did not generate yourself.** Discord's guidance is to hit Cancel immediately. QR codes also expire after two minutes, so a "scan this now" link is a red flag by itself.

## What actually protects you

Turn on two-factor authentication. Discord supports [passkeys, security keys, and authenticator apps](https://support.discord.com/hc/en-us/articles/25966860846231-Security-Keys-Passkeys-and-Passwordless-Login-on-Discord) — up to 16 keys at once, and a security key or passkey is phishing-resistant in a way a six-digit code is not. Then download and store your backup codes somewhere offline.

Then audit what already has access. In Settings, revoke any authorised apps you do not recognise — a malicious OAuth app can hold onto your account even after you change your password. And if you did approve a login you did not mean to, Discord's own advice is to [change your password](https://support.discord.com/hc/en-us/articles/218410947), which logs out every device at once.

The pattern is consistent enough that recognising it is most of the defence: unexpected executables and "scan this QR to join" links are the attack, not the invitation.

## Sources

- [Discord — QR Code Login FAQ](https://support.discord.com/hc/en-us/articles/360039213771-QR-Code-Login-FAQ) (accessed Oct 2026)
- [Discord — Security Keys, Passkeys, and Passwordless Login](https://support.discord.com/hc/en-us/articles/25966860846231-Security-Keys-Passkeys-and-Passwordless-Login-on-Discord) (accessed Oct 2026)
- [Dark Reading — Skuld Stealer Shows Open Source's Dark Side](https://www.darkreading.com/vulnerabilities-threats/skuld-stealer-shows-open-source-dark-side) (Mar 2025)
- [Peter Maguire — BbyStealer Analysis](https://petermaguire.xyz/posts/bbystealer-analysis/)
- [Infosecurity Magazine — New Infostealer Campaign Uses Discord Videogame Lure](https://www.infosecurity-magazine.com/news/infostealer-campaign-discord/) (citing Malwarebytes)
- [BreakDev — Evil QR: Phishing With QR Codes](https://breakdev.org/evilqr-phishing/)`,
  },

  // ── 2. Infostealers via fake cheats / mods ─────────────────────────────────
  {
    slug: 'fake-game-cheats-infostealer-malware',
    title: 'The Fake Cheat That Drains Every Account You Own',
    metaTitle: 'Infostealer Malware in Fake Game Cheats: How It Works & How to Stay Safe',
    seoDescription:
      'Fake game cheats and mods are the most effective way infostealer malware like RedLine and Vidar gets onto gaming PCs. Here is how the campaigns work and how to avoid them.',
    summary:
      'Free cheats and mods are the most reliable way infostealer malware reaches gaming PCs. This explains the RedLine, Vidar, and PirateFi campaigns, what the malware takes, and how to spot a fake before you run it.',
    contentType: 'security',
    tags: ['infostealer', 'redline', 'vidar', 'malware', 'game-cheats', 'piratefi', 'download-safety'],
    body: `The most effective malware delivery channel in PC gaming is not a sketchy torrent site. It is the promise of a free cheat.

A cheat has to reach into a game's memory, inject into processes, and usually run as administrator — often while you disable or whitelist your antivirus because the cheat "triggers false positives." That is the exact environment a piece of malware wants, and the attackers know it. [ESET's analysis of RedLine Stealer](https://www.eset.com/us/about/newsroom/press-releases/days-after-takedown-eset-research-releases-analysis-of-redline-stealer-infostealer-empire-4/) notes that the malware "masqueraded as video game cheats in the first half of 2024" — one of the two most common disguises, alongside fake ChatGPT downloads.

## What these stealers take

RedLine, first spotted in 2020 and sold as malware-as-a-service so anyone can run a campaign, harvests saved browser credentials, cookies, autofill and credit-card details, cryptocurrency wallets, and "saved data from Steam, Discord, Telegram, and various desktop VPN applications," per [ESET](https://www.eset.com/us/about/newsroom/press-releases/days-after-takedown-eset-research-releases-analysis-of-redline-stealer-infostealer-empire-4/). Vidar Stealer does the same job with a different codebase. Both exfiltrate quietly, often within minutes, and the victim sees nothing.

The sessions are the worst part. A stolen session cookie or Steam token is a logged-in state — two-factor authentication does not stop an attacker who already holds the session.

## The campaigns are not subtle

- A [BleepingComputer report](https://www.bleepingcomputer.com/news/security/fake-cheat-lures-gamers-into-spreading-infostealer-malware) described a RedLine-linked campaign using fake "Cheat Lab" and "Cheater Pro" tools, distributed as ZIP files with an MSI installer that unpacks a Lua bytecode payload. The kicker: the fake cheat promised a free licence if you convinced your friends to install it too — turning victims into distributors.
- [ASEC researchers found](https://www.bleepingcomputer.com/news/security/fake-valorant-cheats-on-youtube-infect-you-with-redline-stealer) fake Valorant "auto-aim" cheats promoted through YouTube video descriptions, delivering RedLine from an archive containing a file literally named "Cheat installer.exe."
- In March 2026, [Acronis Threat Research Unit reported](https://www.infosecurity-magazine.com/news/vidar-stealer-exploits-github) hundreds of GitHub repositories offering "free game cheats" that actually deliver Vidar Stealer 2.0, alongside Reddit posts pushing a fake Counter-Strike 2 cheat.
- The problem is not confined to third-party sites. In February 2025, a free-to-play game called **PirateFi** was pulled from Steam after researchers at SECUINFRA identified it as distributing the Vidar infostealer; [TechRepublic reported](https://www.techrepublic.com/article/steam-piratefi-malware-vidar-infostealer) that as many as 1,500 people had downloaded it before removal.

The last one matters because it breaks the "only download from Steam" advice. Steam review caught it eventually, but not before real players were infected — and the advice that follows from it is not "don't use Steam," it is "treat any free game, cheat, or mod as suspect until you have verified where it came from."

## How to tell a fake before you run it

No cheat tool from an unknown source is trustworthy, and none of these are digitally signed by a real entity. The telltale signs:

- It arrived through a Discord DM, a YouTube video description, a Reddit comment, or a search ad — not the game's official site or a mod platform with a review process.
- It asks you to disable your antivirus or Windows security features "to avoid false positives." Legitimate software does not need you to disarm your defences.
- It is delivered as an obscure file type — an MSI with a \`.lua\` or bytecode payload, a self-extracting archive with an invalid signature — rather than a straightforward installer from a known publisher.

## What to do instead

The defence is boring and it works. Get mods from platforms with actual review and moderation — Nexus Mods or CurseForge — not from a link someone sent you. Keep your antivirus on and updated, and do not add exclusions for anything you cannot verify. If you already ran something you are not sure about, assume the worst: change your passwords from a clean device, revoke active sessions on Steam and Discord, and check your [Steam API key page](https://steamcommunity.com/dev/apikey) for anything you did not create.

One more thing worth saying plainly: if you installed a "cheat" and it worked, that is not evidence it was safe. Plenty of these loaders ship a functional cheat alongside the stealer, because a working tool is the best way to keep you from uninstalling it.

## Sources

- [ESET — Analysis of RedLine Stealer infostealer empire](https://www.eset.com/us/about/newsroom/press-releases/days-after-takedown-eset-research-releases-analysis-of-redline-stealer-infostealer-empire-4/)
- [BleepingComputer — Fake cheat lures gamers into spreading infostealer malware](https://www.bleepingcomputer.com/news/security/fake-cheat-lures-gamers-into-spreading-infostealer-malware) (Apr 2024)
- [BleepingComputer — Fake Valorant cheats on YouTube infect you with RedLine stealer](https://www.bleepingcomputer.com/news/security/fake-valorant-cheats-on-youtube-infect-you-with-redline-stealer) (Mar 2022)
- [Infosecurity Magazine — Vidar Stealer 2.0 Exploits Fake Game Cheats on GitHub, Reddit](https://www.infosecurity-magazine.com/news/vidar-stealer-exploits-github) (Mar 2026)
- [TechRepublic — Steam Malware Alert: PirateFi Game Spreads Vidar Infostealer](https://www.techrepublic.com/article/steam-piratefi-malware-vidar-infostealer) (Feb 2025)`,
  },

  // ── 3. Steam / CS2 API trade scams ─────────────────────────────────────────
  {
    slug: 'steam-api-trade-scam-cs2-skins',
    title: 'The Steam Trade That Looks Fine Until Your Skins Are Gone',
    metaTitle: 'Steam API Trade Scam: How CS2 Skins Get Stolen & How to Stop It',
    seoDescription:
      'The Steam API scam cancels your real trade and swaps in a fake one with the same name and avatar. Here is how it works, how to spot it, and how to lock your account down.',
    summary:
      'The Steam API scam is the most common way CS2 skins get stolen. A phished login creates an API key that watches your trades, cancels the real one, and substitutes a fake. Here is the full mechanism and the checklist that stops it.',
    contentType: 'security',
    tags: ['steam', 'cs2', 'skins', 'api-scam', 'trade-scam', 'phishing', 'steam-guard'],
    body: `Of all the ways to lose skins in Counter-Strike 2, one keeps taking people by surprise because it looks, at the moment of confirmation, exactly like the trade they meant to make. It is called the API scam, and it does not brute-force your password. It waits for you to trade, then swaps the destination at the last second.

## What actually happens

The mechanism is documented repeatedly and it is consistent across every account of it — [this community guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3125255595), [skin.land](https://skin.land/blog/what-is-a-steam-api-scam/), [CS.MONEY](https://cs.money/blog/games/most-dangerous-scam/), and [BitSkins](https://bitskins.com/blog/steam-web-api-key-scam/) all describe the same sequence:

1. You get phished into logging in on a fake Steam page — a "free skins" giveaway, a "tournament" you must join, a "skin checker," or a message from a fake admin.
2. The phished login gives the attacker your session. Their script creates a Steam Web API key on your account, which lets it monitor your trade offers.
3. The script does nothing until you try to trade. Then it cancels your real offer and instantly sends a new one from an account with the same name and avatar as the person you were trading with.
4. You confirm in Steam Guard without checking closely — one tap — and your skins go to the scammer.

The subtle part is that the fake offer often arrives through the API key, so it shows up in your confirmations looking legitimate. [CS.MONEY puts the difference plainly](https://cs.money/blog/games/most-dangerous-scam/): the scammer tracks only high-value trades, cancels the real one, and sends a nearly identical offer. If you accept, you get nothing and your items are gone.

## Why you will not get the items back

This is the part people do not want to hear, so it is worth saying directly: Steam's stated policy is that lost items are not returned. [The community guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3125255595) and [BitSkins](https://bitskins.com/blog/steam-web-api-key-scam/) both say the same thing — the skins are your responsibility once you confirm the trade. You can report the scammer's account and it may get banned, but the trade is not reversed. Steam's newer [trade protection window](https://skin.land/blog/what-is-a-steam-api-scam/) can help if the items are still eligible, but it has limits and comes with restrictions. Prevention is the whole game here.

## The checklist that stops it

Do these in order, and check the first one today:

- **Check your API key page right now.** Go to [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey). If a key exists that you did not create, revoke it immediately — that is the surest sign your account was already touched.
- **Enable Steam Guard Mobile Authenticator**, not email codes. It is the strongest option Steam offers, and it is what unlocks the trade-hold protection that slows this whole scam down. Note: Steam Guard is time-based codes and email codes — [Steam does not support passkeys or hardware security keys](https://help.steampowered.com/en/faqs/view/06B0-26E6-2CF8-254C), so the mobile authenticator is the ceiling, not the floor.
- **Never log in to Steam through a link someone sent you.** Log in at steamcommunity.com or the Steam client first. [Steam's own guidance](https://help.steampowered.com/en/faqs/view/6639-EB3C-EC79-FF60) is that once you are logged in, a third-party site should not be asking for your credentials again.
- **Check the trade before you confirm.** Look at the profile level, account age, and whether it is actually your friend. [CS.MONEY](https://cs.money/blog/games/most-dangerous-scam/) and [Blix](https://blix.gg/news/what-is-an-api-scam-and-how-do-i-prevent-it) both suggest the same trick: add a cheap item to the trade so you have something concrete to compare against the offer that appears in your confirmation.
- **Regenerate your trade URL** if you have posted it publicly or used it on a site you do not fully trust.

## If you think you have already been hit

Change your Steam password from a clean device, revoke the API key, deauthorise all other devices in Steam Guard settings, check your trade history, and regenerate your backup codes. Then secure the email account tied to Steam — it is the reset path, and an attacker who holds it can get back in regardless of what you just fixed.

## Sources

- [Steam Community — CS2: How to avoid being API scammed](https://steamcommunity.com/sharedfiles/filedetails/?id=3125255595)
- [skin.land — What is a Steam API Scam?](https://skin.land/blog/what-is-a-steam-api-scam/)
- [CS.MONEY — What's an API Scam?](https://cs.money/blog/games/most-dangerous-scam/)
- [BitSkins — Steam Web API Key Scam](https://bitskins.com/blog/steam-web-api-key-scam/)
- [Blix — What is an API Scam and how do I prevent it?](https://blix.gg/news/what-is-an-api-scam-and-how-do-i-prevent-it)
- [Steam Support — Steam Guard](https://help.steampowered.com/en/faqs/view/06B0-26E6-2CF8-254C)
- [Steam Support — Account Security Recommendations](https://help.steampowered.com/en/faqs/view/6639-EB3C-EC79-FF60)`,
  },

  // ── 4. SIM swap defense ────────────────────────────────────────────────────
  {
    slug: 'sim-swap-attack-defense-gaming-accounts',
    title: 'SIM Swapping: The Phone-Number Attack That Beats Your Password',
    metaTitle: 'SIM Swap Attack Defense: Protect Your Phone Number & Gaming Accounts',
    seoDescription:
      'A SIM swap moves your phone number to a scammer\u2019s SIM, and every SMS 2FA code goes to them. Here is how the attack works, the FCC rules that now protect you, and how to lock it down.',
    summary:
      'SIM swapping defeats any account that uses SMS for recovery or two-factor. Here is how the attack works, what the 2024 FCC rules require carriers to do, and the concrete steps that stop it from reaching your gaming accounts.',
    contentType: 'security',
    tags: ['sim-swap', 'sms-2fa', 'phone-number', 'carrier', 'fcc', 'account-takeover'],
    body: `Your phone number is a password you did not choose, and you cannot change it on a whim. A SIM swap is what happens when someone else convinces your carrier to hand it to them anyway.

The [FTC describes the mechanics](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself) directly: the scammer calls your carrier, claims your phone was lost or damaged, and asks them to activate a new SIM connected to your number on a phone the scammer owns. If the carrier believes the story, every call and text — including every two-factor code and password-reset link — now goes to the attacker's phone. Your own phone just goes quiet.

## Why this matters for gaming accounts

A SIM swap does not give the attacker your phone's files or your passwords. What it gives them is every account that uses SMS as a recovery method or second factor. For a lot of players, that is the reset path into Steam, PlayStation, Xbox, email, and anything linked to them. A strong password does not stop it, because the attack never touches the password.

## The rules changed in 2024

The good news is that this is no longer a free-for-all. The FCC adopted rules in late 2023 — [published in the Federal Register](https://www.federalregister.gov/documents/2023/12/08/2023-26338/protecting-consumers-from-sim-swap-and-port-out-fraud) — that took effect January 8, 2024, with carrier compliance due July 8, 2024. Under them, carriers must:

- authenticate you before any SIM change or port-out using methods that do **not** rely on readily available biographical data — your date of birth, address, last four digits, or recent payment history;
- send you an **immediate notification** before completing a swap or port;
- offer a **free port-out lock and SIM change lock** on every line, including prepaid.

The [FTC's consumer advice](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself) predates the rules but makes the same practical point: the lock and the PIN are your first line of defence, and SMS is the weakest second factor.

## What to actually do

The rules only help if you turn the protections on — most carriers do not enable the locks by default.

- **Turn on your carrier's port-out lock and SIM lock today.** This is free on every major US carrier. In most cases you can enable it in the carrier's app or website, or by calling and asking for it by name — and ask for a case number so there is a record.
- **Set a carrier account PIN that is not guessable.** Not your birthday, not the last four of anything public. Treat it like a password.
- **Move your important accounts off SMS 2FA.** Use an authenticator app or a security key instead. On gaming platforms specifically: Steam Guard Mobile Authenticator, Discord's authenticator-app or passkey option, and PlayStation's authenticator-app or passkey. The [FTC says it outright](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself): text-message verification may not stop a SIM swap, so use an authentication app or security key where you can.
- **Do not broadcast your inventory or your number.** The less biographical data and the less visible value you present, the harder the social-engineering call becomes.

## If your phone just went dead

If you lose service somewhere you normally have a signal — no calls, no texts, no data — treat it as a SIM swap until proven otherwise, not a dead cell tower. The [FTC's steps](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself) are: contact your carrier immediately from a different phone or in person and get the number back, then check your financial accounts for unauthorised activity, and change your passwords once you have regained control. Speed matters — most of the damage happens in the first hours, while you are still trying to figure out why your phone stopped working.

## Sources

- [FTC — SIM Swap Scams: How to Protect Yourself](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself)
- [Federal Register — Protecting Consumers from SIM-Swap and Port-Out Fraud (FCC 23-95)](https://www.federalregister.gov/documents/2023/12/08/2023-26338/protecting-consumers-from-sim-swap-and-port-out-fraud)
- [eCFR — 47 CFR 64.2010 (Safeguards on Customer Proprietary Network Information)](https://www.ecfr.gov/current/title-47/section-64.2010)`,
  },

  // ── 5. Passkeys for gamers: which platforms support them ───────────────────
  {
    slug: 'passkeys-for-gamers-platform-support',
    title: 'Passkeys for Gamers: Which Platforms Actually Support Them',
    metaTitle: 'Passkeys for Gamers: Steam, Discord, PlayStation, Xbox Support in 2026',
    seoDescription:
      'Passkeys stop phishing because they are bound to the real site. But support is uneven across gaming platforms. Here is exactly which platforms support passkeys and which still do not.',
    summary:
      'Passkeys are the most phishing-resistant login available, but gaming platform support is uneven. This is the accurate, current picture: Discord, PlayStation, and Xbox support them; Steam and Epic do not. Plus how to set one up where you can.',
    contentType: 'security',
    tags: ['passkeys', 'fido2', 'authentication', 'steam', 'discord', 'playstation', 'xbox', 'mfa'],
    body: `Passkeys are the one authentication change worth getting excited about, because they fix the single biggest problem in account security: they cannot be phished. A passkey is bound to the real website, so a fake login page cannot trick it — the same credential will simply refuse to authenticate against a lookalike domain. That one property defeats the fake-Steam-login, fake-Discord-invite, and giveaway-page attacks that keep costing players their accounts.

The catch is that gaming platforms have adopted them unevenly. Here is the accurate picture as of late 2026, because a lot of roundups get this wrong — several claim Steam supports hardware keys, and it does not.

## Which platforms support passkeys

**Discord — yes.** [Discord's official documentation](https://support.discord.com/hc/en-us/articles/25966860846231-Security-Keys-Passkeys-and-Passwordless-Login-on-Discord) covers both passkeys and security keys. Passkeys enable passwordless, one-step login on mobile and desktop, and you can register up to 16 keys. Security keys (like a YubiKey) work as a second factor after your password.

**PlayStation — yes.** PlayStation [supports passkey sign-in](https://brutaluniverse.com/passkeys-for-gamers-how-safer-sign-in-works) for PS5 and PS4 accounts, the website, and the PlayStation App. On PS5 the path is Settings → Users and Accounts → Account → Security → Sign in with Passkey.

**Xbox / Microsoft — yes.** An Xbox account is a Microsoft account, and Microsoft supports passkeys through its standard account security. If you have a Microsoft account, you can register a passkey and sign in without a password.

## Which platforms do not

**Steam — no.** This is the one that gets misreported most often. [Steam's own Steam Guard documentation](https://help.steampowered.com/en/faqs/view/06B0-26E6-2CF8-254C) lists exactly two options: an emailed code or a code from the Steam Mobile app. There is no passkey option and no FIDO2 hardware-key support. A [long-running Steam community thread](https://steamcommunity.com/discussions/forum/10/3878221099911763286/) has people asking for passkey support for years with no announcement from Valve. Steam Guard Mobile Authenticator is the strongest option Steam currently offers, and that is the ceiling, not a hardware key.

**Epic Games — no.** Epic supports two-factor via authenticator app, email, or SMS, but not passkeys or hardware security keys.

## What this means in practice

You cannot put a passkey on every gaming account today, and pretending otherwise just sends people looking for a setting that does not exist. The practical strategy is layered:

- Turn on passkeys **where they exist** — Discord, PlayStation, and your Microsoft/Xbox account. That covers a large share of real risk, because those are the accounts most often phished through fake invites and giveaway pages.
- On Steam and Epic, use the **strongest available** factor: Steam Guard Mobile Authenticator on Steam, and an authenticator-app code on Epic.
- Secure the **email account** behind all of them with a passkey or security key. The email is the reset path for every platform, so a passkey there is the highest-leverage single change you can make.

Passkeys are not magic, and they are not everywhere yet. But where they exist, they are strictly better than a password and a six-digit code — because there is nothing for a phishing page to steal.

## Sources

- [Discord — Security Keys, Passkeys, and Passwordless Login](https://support.discord.com/hc/en-us/articles/25966860846231-Security-Keys-Passkeys-and-Passwordless-Login-on-Discord) (accessed Oct 2026)
- [Steam Support — Steam Guard](https://help.steampowered.com/en/faqs/view/06B0-26E6-2CF8-254C) (accessed Oct 2026)
- [Steam Community — Passkey Support for Steam When?](https://steamcommunity.com/discussions/forum/10/3878221099911763286/)
- [BrutalUniverse — Passkeys For Gamers: How Safer Sign-In Works](https://brutaluniverse.com/passkeys-for-gamers-how-safer-sign-in-works)
- [GamingPassword — Multi-Factor Authentication for Gamers](https://gamingpassword.net/blog/multi-factor-authentication-gamers.html)`,
  },
];
