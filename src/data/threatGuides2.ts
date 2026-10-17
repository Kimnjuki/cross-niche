/**
 * Gaming-security threat guides — batch 2 (the remaining GN-015 editorial).
 * Same rules as threatGuides.ts: documented public research + official vendor
 * docs, cited inline with a Sources section, no fabricated surveys/telemetry.
 */
import type { ThreatGuide } from './threatGuides';

export const THREAT_GUIDES_2: ThreatGuide[] = [
  // ── 6. Doxxing & swatting ──────────────────────────────────────────────────
  {
    slug: 'doxxing-swatting-protection-streamers',
    title: 'Doxxing and Swatting: What Actually Protects You',
    metaTitle: 'Doxxing & Swatting Protection: FBI Guidance for Streamers & Gamers',
    seoDescription:
      'Swatting sends armed police to a fake emergency at your address. Here is how the attack works, the FBI\u2019s own protection steps, and what to do the moment it happens.',
    summary:
      'Swatting is a hoax emergency call meant to draw armed police to your home, and doxxing is how attackers find your address in the first place. This covers the FBI\u2019s protective steps, the 911 address flag, and what to do if it happens.',
    contentType: 'security',
    tags: ['swatting', 'doxxing', 'streamer', 'fbi', 'privacy', 'data-broker'],
    body: `Swatting is the one threat on this list that can get someone physically hurt. It is a hoax call to emergency services reporting an immediate threat to life at your address — a hostage situation, a shooting — made to draw a SWAT team to your door. The [FBI's public service announcement on swatting](https://ic3.gov/PSA/2025/PSA250429) is blunt about it: the intent is to cause chaos and "the potential for injury or violence."

For streamers and visible gamers, swatting is the endgame of doxxing. Doxxing is publishing your real name, address, or phone number so a stranger can target you. The two are linked because you cannot swat someone whose address you do not have.

## How attackers get your address

The FBI's PSA lists the vector plainly: "Review your online presence for sensitive personal information that could enable malicious actors to conduct a swatting attack," and "Exercise care when posting content (including photos and videos)." It is rarely a single leak. It is an accumulation — a street name visible in a photo background, a city in a stream title, a real name tied to a gamer tag through an old forum post, an address sitting on a people-search site. Attackers assemble the pieces.

## What the FBI says to do before it happens

The [FBI's protective steps](https://ic3.gov/PSA/2025/PSA250429) are concrete:

- Review your online presence and remove sensitive personal information.
- Use strong, unique passwords and multi-factor authentication everywhere, including smart-home devices — a compromised smart doorbell or camera can reveal your address or confirm you are home.
- Discuss swatting with your family and have a plan for what to do if police arrive.

One measure the FBI PSA does not mention but that [guides specifically about swatting recommend](https://delist.ai/guides/swatting-protection) is the **911 address flag**: you can call your local non-emergency line and ask that a note be placed on your address in the dispatch system, so responders know a swatting risk exists. Availability is local and opt-in — not every 911 center offers it, so ask. It is the one protection that reaches responders no matter who placed the call.

## If armed officers are at your door

Stay calm, keep your hands visible, and comply with the officers' instructions. Do not make sudden movements, and do not argue — the officers believe they are responding to a real emergency. Once things de-escalate, calmly explain that you believe this is a swatting incident. Everything you want to say in your defence can wait until after the situation is contained.

## After it happens

Report it to your local police, then file with the FBI's [Internet Crime Complaint Center](https://www.ic3.gov). Preserve everything — usernames, chat logs, screenshots, timestamps. The FBI treats swatting as a federal crime and coordinates across agencies, and your report is part of the paper trail that leads back to the caller.

The uncomfortable truth is that swatting is mostly a prevention problem. You reduce the risk by making your address hard to find, not by reacting faster once the call is already made.

## Sources

- [FBI IC3 — Threat Actors Use "Swatting" to Target Victims Nationwide (PSA)](https://ic3.gov/PSA/2025/PSA250429)
- [delist.ai — Swatting: how to protect yourself and what to do if it happens](https://delist.ai/guides/swatting-protection)`,
  },

  // ── 7. Minecraft mod malware ───────────────────────────────────────────────
  {
    slug: 'minecraft-mod-malware-fracturiser-bleedingpipe',
    title: 'Minecraft Mods and the Malware That Hid Inside Them',
    metaTitle: 'Minecraft Mod Malware: Fracturiser & BleedingPipe Explained',
    seoDescription:
      'Minecraft mods have been used to spread malware twice in recent years \u2014 Fracturiser through CurseForge and BleedingPipe through deserialization bugs. Here is what happened and how to stay safe.',
    summary:
      'Two major incidents showed that Minecraft mods are a real malware vector: Fracturiser hid in popular CurseForge mods, and BleedingPipe exploited a deserialization bug to run code on servers and players. Here is what both were and how to download mods safely.',
    contentType: 'security',
    tags: ['minecraft', 'mods', 'fracturiser', 'bleedingpipe', 'curseforge', 'malware'],
    body: `Minecraft modding is one of the biggest software ecosystems in gaming, and it has been used twice in recent years to spread serious malware. Both incidents are worth understanding, because they were not the usual "random download from a shady site" — one hit the most trusted mod platform in the space.

## Fracturiser: malware inside CurseForge itself

In June 2023, dozens of mods and plugins on CurseForge and the Bukkit plugin site were found to contain a multi-stage infostealer called **Fracturiser**. [Ars Technica reported](https://arstechnica.com/information-technology/2023/06/dozens-of-popular-minecraft-mods-found-infected-with-fracturiser-malware) that the platform advised users to immediately stop downloading or updating mods. The attack worked by compromising CurseForge and Bukkit developer accounts and injecting malicious code into existing projects — which then trickled into popular modpacks like "Better Minecraft," which had over 4.6 million downloads, according to [BleepingComputer](https://www.bleepingcomputer.com/news/security/new-fractureiser-malware-used-curseforge-minecraft-mods-to-infect-windows-linux).

What Fracturiser did, per [Bitdefender's analysis](https://www.bitdefender.com/en-au/blog/labs/infected-minecraft-mods-lead-to-multi-stage-multi-platform-infostealer-malware), is the standard infostealer playbook: it stole Minecraft and Discord authentication tokens, browser cookies and saved logins, and tried to inject itself into every other .jar file on the system. It was a genuine supply-chain attack — the infected files were hosted on the official platforms, not a torrent site.

## BleedingPipe: a bug that ran code on servers and players

A month later came a different kind of threat. **BleedingPipe** was a remote code execution vulnerability caused by unsafe deserialization in the \`ObjectInputStream\` Java class, used by many Minecraft mods to exchange network packets. [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/hackers-exploit-bleedingpipe-rce-to-target-minecraft-servers-players/) that attackers sent crafted packets to vulnerable modded servers to take them over, then used those servers to hit the players connecting to them — stealing Discord and Steam session cookies. The affected mods included EnderCore, LogisticsPipes, BDLib, and a dozen others, and the fix was simply updating to patched releases.

## What this means for how you download mods

The lesson is not "never use mods." It is that the mod's *platform* and the mod's *version* both matter:

- Download from official, reviewed sources — CurseForge, Modrinth, or the mod author's own repository — and even then, only install the latest patched release. The Fracturiser incident proves even trusted platforms get compromised, which is why keeping the platform's own security guidance current matters.
- Update mods when a vulnerability is announced. BleedingPipe was fixed by mod updates; anyone running the old versions stayed exposed.
- Treat modded servers the way you would any software: if a server is running vulnerable mods, it can be turned against the players on it.

The defence is the same one that applies everywhere else in gaming security: keep everything updated, and do not run a file you cannot trace back to a source you trust.

## Sources

- [Ars Technica — Dozens of popular Minecraft mods found infected with Fracturiser malware](https://arstechnica.com/information-technology/2023/06/dozens-of-popular-minecraft-mods-found-infected-with-fracturiser-malware)
- [BleepingComputer — New Fractureiser malware used CurseForge Minecraft mods to infect Windows, Linux](https://www.bleepingcomputer.com/news/security/new-fractureiser-malware-used-curseforge-minecraft-mods-to-infect-windows-linux)
- [BleepingComputer — Hackers exploit BleedingPipe RCE to target Minecraft servers, players](https://www.bleepingcomputer.com/news/security/hackers-exploit-bleedingpipe-rce-to-target-minecraft-servers-players/)
- [Bitdefender — Infected Minecraft Mods Lead to Multi-Stage, Multi-Platform Infostealer Malware](https://www.bitdefender.com/en-au/blog/labs/infected-minecraft-mods-lead-to-multi-stage-multi-platform-infostealer-malware)`,
  },

  // ── 8. Roblox child safety ─────────────────────────────────────────────────
  {
    slug: 'roblox-account-security-parental-controls',
    title: 'Roblox for Parents: Locking Down Your Child\u2019s Account',
    metaTitle: 'Roblox Parental Controls: Account Security & Child Safety Guide',
    seoDescription:
      'Roblox now runs on age-based accounts with parental controls you manage from a linked parent account. Here is how to link it, secure it, and set content, chat, screen time, and spending limits.',
    summary:
      'Roblox\u2019s parental controls live behind a linked parent account with verified age. This walks through linking it, securing the parent login, and setting content maturity, chat, screen time, and spending limits.',
    contentType: 'gaming',
    tags: ['roblox', 'parental-controls', 'child-safety', 'kids', 'robux', 'account-security'],
    body: `Roblox is where a huge share of young players spend their time, and the platform's safety model changed substantially in 2026 — the old four-digit parent PIN is gone, replaced by age-based accounts managed from a linked, age-verified parent account. If you are a parent reading older guides, most of them describe controls that no longer exist.

## The new account structure

Since June 2026, every player under 16 has an account matched to their age: **Roblox Kids** (ages 5\u20138) and **Roblox Select** (9\u201315), with full Roblox at 16 and up. [Roblox's parental controls page](https://about.roblox.com/parental-controls) is the source of truth. The Kids and Select catalogs only contain games that passed extra review from verified developers, and chat of any kind now requires an age check.

## Step one: link a parent account

Parental controls are managed from your own Roblox account, linked to your child's. You must be 18 or older and verify your age — typically with a government ID or credit card. From your child's account, go to Settings → Parental Controls → Add parent, enter your email, and follow the verification steps. [Roblox's FAQ](https://en.help.roblox.com/hc/en-us/articles/30428248050068-Parental-Controls-FAQ) notes you can manage everything through age 12, with certain controls like game management and Direct Chat extending to age 15.

## Step two: secure the parent account itself

This is the step most people skip, and it is the one that matters most. Your parent account controls the child's account, so if someone gets into it, they control everything. [Roblox's own guidance](https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview) and independent [parenting guides](https://gamers.wiki/en/games/roblox/lists/roblox-parental-controls-10-settings-to-review) agree: turn on two-step verification, use a unique password, and do not share the parent login. Anyone with that login can change the child's settings, manage linked accounts, and make changes to sensitive information.

## What you can actually control

From the linked parent dashboard you can, per [Roblox's documentation](https://about.roblox.com/parental-controls):

- Set the **content maturity level** (Minimal, Mild, Moderate, or Restricted) and block or allow specific games.
- Choose who your child can **chat** with — in-game chat, direct chat, and friends chat are separate settings, and the safest starting point for younger kids is the narrowest audience or "No one."
- Set a **daily screen time limit** and see a seven-day usage average.
- Set a **monthly spending limit** and get spending notifications.
- View, block, and report your child's **connections**.

## The scam every parent should warn about

Roblox's help pages are unambiguous about one thing: **any offer of free Robux is a scam**, meant to take over the account. A password should only ever be typed on the actual Roblox login page, and never shared with anyone in-game. This is the single most common way young players lose their accounts — not a technical exploit, but a "free Robux" or fake-support message that convinces them to hand over credentials.

## Sources

- [Roblox — Parental Controls](https://about.roblox.com/parental-controls)
- [Roblox — Parental Controls FAQ](https://en.help.roblox.com/hc/en-us/articles/30428248050068-Parental-Controls-FAQ)
- [Roblox — Parental Controls Overview](https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview)
- [gamers.wiki — Roblox Parental Controls: 10 Settings to Review](https://gamers.wiki/en/games/roblox/lists/roblox-parental-controls-10-settings-to-review)`,
  },

  // ── 9. Kernel anti-cheat privacy ───────────────────────────────────────────
  {
    slug: 'kernel-anti-cheat-privacy-vanguard-eac',
    title: 'Kernel Anti-Cheat: What It Can See and Why It Worries People',
    metaTitle: 'Kernel Anti-Cheat Privacy: Vanguard, EAC, BattlEye Explained',
    seoDescription:
      'Kernel-level anti-cheat like Vanguard and Easy Anti-Cheat runs with deep system access. Here is what research actually found about what they can see, and the trade-off you accept when you play.',
    summary:
      'Kernel-level anti-cheat drivers run with the deepest access Windows allows. Academic research found Vanguard and FACEIT behave in rootkit-like ways, while BattlEye and EAC do not. Here is the actual trade-off, in plain language.',
    contentType: 'security',
    tags: ['anti-cheat', 'kernel', 'vanguard', 'easy-anti-cheat', 'battleye', 'privacy'],
    body: `If you play Valorant, Fortnite, PUBG, or almost any competitive PC game, you are running a kernel-level anti-cheat driver. The question people keep asking is whether that driver is a security risk, and the honest answer is: it depends on which one, and the trade-off is real.

## Why they run at the kernel level

A cheat that runs at the kernel level can hide from anti-cheat software that only runs at the user level. As Riot's then-head of anti-cheat Paul Chamberlain put it in [an Ars Technica interview](https://arstechnica.com/gaming/2020/04/ring-0-of-fire-does-riot-games-new-anti-cheat-measure-go-too-far/): "Whoever's driver loads first gets to observe or influence everything that happens on your computer after that point." So anti-cheat vendors moved to the kernel to keep up — and that means their driver loads with Windows itself, before the game starts, with the deepest access the OS allows.

## What the research actually found

A peer-reviewed paper, ["If It Looks Like a Rootkit and Deceives Like a Rootkit,"](https://arxiv.org/html/2408.00500) evaluated the four major anti-cheat systems — BattlEye, Easy Anti-Cheat, FACEIT, and Vanguard — against formal rootkit criteria. Its conclusion: **Vanguard and FACEIT exhibit rootkit-like behavior**, while BattlEye and EAC show only minor similarities, insufficient to classify them that way. The specific concerns: Vanguard and FACEIT use evasion techniques, hide from processes and threads, and block virtualization (Vanguard requires disabling Hyper-V, which also disables WSL2). All four were found to collect and transmit system information — hardware IDs, loaded drivers, module lists — continuously, regardless of whether you are suspected of cheating.

A separate 2025 analysis reached the same conclusion, noting the core problem is transparency: anti-cheat software "lacks transparency regarding the operations it performs," and because it can access system files, memory, and user directories, a vulnerability in it "could grant privileged access to attackers."

## What that means for you

There is no evidence any major anti-cheat is harvesting your documents or watching you. The real, documented risks are narrower:

- **A vulnerability in the driver is a system-wide risk.** [Ars Technica quoted](https://arstechnica.com/gaming/2020/04/ring-0-of-fire-does-riot-games-new-anti-cheat-measure-go-too-far/) security researcher Saleem Rashid: a bug in a kernel driver can crash the entire OS, and an exploit "could let an attacker install their own malicious code at an extremely low level."
- **They phone home with system information** — hardware IDs, loaded drivers, module lists — and you cannot fully audit what is sent.
- **Vanguard runs at boot**, not just when you play, though Riot now lets you disable it and re-enable it when you want to play.

The trade-off is not "privacy vs. nothing." It is "an effective anti-cheat requires deep access, and you are trusting the vendor to use it responsibly." For most players that is an acceptable risk; for a machine you use for sensitive work, it is a reason to keep your gaming and non-gaming setups separate.

## Sources

- [arXiv — If It Looks Like a Rootkit and Deceives Like a Rootkit (kernel-level anti-cheat analysis)](https://arxiv.org/html/2408.00500)
- [Ars Technica — Ring 0 of fire: Does Riot Games\u2019 new anti-cheat measure go too far?](https://arstechnica.com/gaming/2020/04/ring-0-of-fire-does-riot-games-new-anti-cheat-measure-go-too-far/)
- [ISCC 2025 — How Risky Is It? A Closer Look at Game Anti-Cheat Software](https://www.inf.ufpr.br/vinicius/files/ISCC-2025.pdf)`,
  },

  // ── 10. Second-hand console risk ───────────────────────────────────────────
  {
    slug: 'used-console-banned-risk-nintendo',
    title: 'Buying a Used Console? Check for a Ban First',
    metaTitle: 'Used Console Banned Risk: What to Check Before You Buy',
    seoDescription:
      'A used Nintendo Switch 2 can be permanently banned from online services and a factory reset won\u2019t fix it. Here is the ban risk on second-hand consoles and how to check before you buy.',
    summary:
      'Used consoles now carry a risk older hardware never did: the device itself can be banned from online services, and a factory reset will not fix it. Here is what caused it, how to check, and how to protect yourself as a buyer.',
    contentType: 'gaming',
    tags: ['used-console', 'nintendo', 'switch-2', 'ban', 'second-hand', 'buyer-guide'],
    body: `A used console used to be a simple value buy. In 2025 that changed, because console manufacturers now ban the *device*, not just the account — and a factory reset will not undo it.

## What actually happened

Shortly after the Switch 2 launch, [Nintendo Life reported](https://www.nintendolife.com/news/2025/07/psa-you-might-want-to-be-careful-buying-pre-owned-switch-1-games-for-your-switch-2) that Nintendo was banning Switch 2 consoles it detected using copied games. The most troubling case involved a buyer who purchased legitimate second-hand Switch 1 cartridges on Facebook Marketplace, played them on a new Switch 2, and had their *console* banned — error code 0x1F727C — cutting off the eShop and all online services. The trigger: a game cartridge's unique key had been dumped and used on multiple consoles, and Nintendo's anti-piracy detection banned the key and every console that had played it.

[IGN covered the same incident](https://www.ign.com/articles/nintendo-switch-2-owner-says-their-console-was-banned-after-playing-legitimate-second-hand-games-another-user-had-copied), noting the buyer was innocent and had bought the games second-hand, unaware they had been copied by a previous owner. The ban was lifted after contacting Nintendo support, but the point stands: the risk landed on someone who did nothing wrong.

## The new rule for second-hand hardware

[Swappa's used Switch 2 buyer's guide](https://swappa.com/blog/used-nintendo-switch-2-buyers-guide) puts it plainly: the console itself can be permanently banned from Nintendo's online services, and a factory reset will not fix it. That is a meaningful shift from the account-ban model — when a console is banned, the next owner inherits the punishment.

## How to protect yourself as a buyer

There is no universal "ban check" API, but you can reduce the risk to near zero:

- **Buy from platforms with buyer protection** that let you test the device and return it if it is banned — not a cash sale from a stranger.
- **Ask the seller to demonstrate the console signing into online services** before you hand over money. If it cannot reach the eShop or online play, walk away.
- **Be wary of used *games*, not just consoles.** As the Switch 2 cases showed, a copied cartridge can get your console banned even if you bought the game legitimately second-hand. Test used games on a secondary device first if you have one.
- **Keep the purchase history and receipts.** In the Nintendo Life case, the buyer's Marketplace purchase history and chat logs were what convinced Nintendo to unban the console.

The honest summary is that Nintendo, Sony, and Microsoft all ban hardware for piracy and fraud, but Nintendo's console-level bans on copied-game detection are the most likely to catch an innocent second-hand buyer. The mitigation is diligence at the point of purchase, because after the ban lands, your only recourse is pleading with support.

## Sources

- [Nintendo Life — PSA: Be Careful Buying Pre-Owned Switch 1 Games For Your Switch 2](https://www.nintendolife.com/news/2025/07/psa-you-might-want-to-be-careful-buying-pre-owned-switch-1-games-for-your-switch-2)
- [IGN — Switch 2 Owner Banned After Playing Legitimate Second-Hand Games](https://www.ign.com/articles/nintendo-switch-2-owner-says-their-console-was-banned-after-playing-legitimate-second-hand-games-another-user-had-copied)
- [Swappa — Used Nintendo Switch 2 Buyer\u2019s Guide](https://swappa.com/blog/used-nintendo-switch-2-buyers-guide)`,
  },

  // ── 11. Pirated games & emulators ──────────────────────────────────────────
  {
    slug: 'pirated-games-emulators-malware-risk',
    title: 'Pirated Games and Emulators: The Malware You Download With Them',
    metaTitle: 'Pirated Games & Emulator Malware: The Real Risk, Explained',
    seoDescription:
      'Cracked games have infected 400,000+ devices with infostealers, and fake emulators are a known malware vector. Here is what the research found and how to download games and emulators safely.',
    summary:
      'Pirated games are one of the most reliable malware delivery channels there is \u2014 one campaign alone hit 400,000+ devices. Emulators themselves are usually safe; fake emulator sites are not. Here is what to watch for.',
    contentType: 'security',
    tags: ['piracy', 'emulator', 'cracked-games', 'malware', 'infostealer', 'roms'],
    body: `The appeal of a free game is obvious. The problem is that cracked games have become one of the most reliable malware delivery channels in existence, and the numbers keep getting worse.

## The scale of it

In 2026, [Cyderes researchers reported](https://pcmag.com/news/malware-hidden-in-pirated-games-infects-400000-devices) that a loader dubbed "RenEngine" — hidden inside cracked versions of Far Cry, Need for Speed, FIFA, and Assassin's Creed — had infected over 400,000 devices worldwide, with the malware's own telemetry logging 4,000 to 10,000 new victims per day. The cracked game appears fully functional while silently installing an infostealer called ARC that harvests browser passwords, cookies, cryptocurrency wallets, and autofill data, per [Malwarebytes](https://malwarebytes.com/blog/threat-intel/2026/06/pirated-pc-games-are-delivering-password-stealing-malware).

An earlier [Trellix investigation covered by Forbes](https://forbes.com/sites/zakdoffman/2025/08/19/microsoft-windows-warning-stop-playing-these-free-pc-games) found a "Dodi Repacks" download that ran a multi-stage HijackLoader infection — and, notably, it happened even with an adblocker installed, debunking the common piracy-forum claim that "as long as you have an adblocker you're safe."

It is not only pirated AAA games. [Kaspersky documented](https://www.kaspersky.com/blog/mario-forever-malware-too/48547/) a fan-made Super Mario game whose infected installer bundled a Monero miner and the Umbral stealer, which specifically hunts Discord, Telegram, Roblox, and Minecraft tokens.

## Emulators are different — the sites are the risk

The nuance worth stating: legitimate emulators are not malware. [An analysis of emulator safety](https://laptop251.com/emulators-and-pc-safety-separating-fact-from-fiction) is clear that the real danger comes from fake project pages, repackaged installers, and ROM/BIOS sites — not from PCSX2, Dolphin, PPSSPP, or RPCS3 themselves. The red flags are specific:

- The site asks you to disable your antivirus or SmartScreen.
- A "BIOS installer" or "ROM downloader" is required — game images should not arrive as executables.
- A ROM arrives as a \`.exe\`, \`.scr\`, \`.bat\`, or \`.cmd\` file — those are programs, not game images.
- The download is a lookalike domain or a cloned GitHub page.

## The rule that covers all of it

Download from the official source, and treat everything else as suspect. For emulators, that means the project's own site or verified repository, not a download portal. For games, that means the store you already trust — and accepting that a game that is not free is not free. The cost of a cracked game is not zero; it is paid in stolen passwords, drained accounts, and a compromised machine.

## Sources

- [PCMag — Malware Hidden in Pirated Games Infects 400,000 Devices](https://pcmag.com/news/malware-hidden-in-pirated-games-infects-400000-devices)
- [Malwarebytes — Pirated PC games are delivering password-stealing malware](https://malwarebytes.com/blog/threat-intel/2026/06/pirated-pc-games-are-delivering-password-stealing-malware)
- [Forbes — If You Download This Game On Your PC, You Will Be Hacked](https://forbes.com/sites/zakdoffman/2025/08/19/microsoft-windows-warning-stop-playing-these-free-pc-games)
- [Kaspersky — Malware in the free game Super Mario 3: Mario Forever](https://www.kaspersky.com/blog/mario-forever-malware-too/48547/)
- [laptop251 — Are Emulators Safe for Your PC?](https://laptop251.com/emulators-and-pc-safety-separating-fact-from-fiction)`,
  },

  // ── 12. Chargeback & in-app purchase fraud ─────────────────────────────────
  {
    slug: 'in-app-purchase-chargeback-fraud-gaming',
    title: 'In-App Purchase Fraud and the Chargeback That Backfires',
    metaTitle: 'In-App Purchase Fraud & Chargebacks: What Gamers Should Know',
    seoDescription:
      'The FTC fined Epic Games $245M over unauthorized in-app purchases, and disputing a gaming charge can get your account banned. Here is what the rules are and how to handle a bad charge.',
    summary:
      'In-app purchase fraud cuts both ways: platforms have been fined for dark-pattern billing, but disputing a charge can also get your account locked. Here is what the FTC found and how to handle an unwanted charge safely.',
    contentType: 'gaming',
    tags: ['in-app-purchase', 'chargeback', 'fraud', 'ftc', 'vbucks', 'refund'],
    body: `In-app purchase fraud is a two-sided problem that most guides only tell you half of. On one side, platforms have been fined hundreds of millions for making it too easy to charge people without consent. On the other side, if you dispute a gaming charge the wrong way, the platform may lock or ban your entire account.

## What the FTC found

The [FTC's $245 million settlement with Epic Games](https://www.ftc.gov/business-guidance/blog/2022/12/245-million-ftc-settlement-alleges-fortnite-owner-epic-games-used-digital-dark-patterns-charge) is the landmark case. The FTC alleged Fortnite saved a parent's credit card by default, let kids buy V-Bucks with a single button press and no cardholder consent, and placed the preview button next to the purchase button so a misaligned tap triggered a charge. The complaint documented over a million complaints about unwanted charges. Epic's own fraud consultant recommended requiring CVV confirmation to "prevent kids from using mom's credit card," advice that was not implemented until after millions of unauthorized transactions.

The same pattern goes back years: the FTC settled with [Apple for $32.5 million](https://www.ftc.gov/business-guidance/blog/2014/01/15-minutes-game-getting-core-ftcs-325-million-settlement-apple) and [Google for $19 million](https://www.ftc.gov/business-guidance/blog/2014/09/4-tips-businesses-can-take-ftcs-19-million-google-settlement) over kids racking up in-app charges during post-password "windows" parents did not know existed.

## The trap on the other side

Here is the part that catches people: disputing a gaming charge with your bank can get your account terminated. The [Consumer Financial Protection Bureau's spotlight on gaming](https://www.consumerfinance.gov/data-research/research-reports/issue-spotlight-video-games/) documents players who received refunds from their financial institution, then had their game accounts locked or terminated for the chargeback. Roblox's own terms, the CFPB notes, ask users to contact Roblox support before disputing any charge with a payment processor. Steam, for its part, states it does not return stolen items — the value of virtual goods is tied to scarcity.

## How to handle an unwanted charge without losing your account

- **Contact the platform's support first.** Refund requests handled through the platform's own process do not trigger a chargeback ban. This is what the platforms themselves tell you to do.
- **Use the chargeback only as a last resort** for genuinely fraudulent charges you cannot resolve through support — and understand it may cost you the account.
- **Lock down the billing path before it happens.** Remove saved cards from gaming accounts, require a password or biometric for purchases, and set spending limits where the platform offers them. For kids, use gift cards instead of a linked card so a mistake cannot run up an unbounded bill.
- **Dispute through the store where the purchase was made** (Apple, Google, console store) rather than the game publisher, where possible.

## Sources

- [FTC — $245 million settlement alleges Epic Games used dark patterns to charge players](https://www.ftc.gov/business-guidance/blog/2022/12/245-million-ftc-settlement-alleges-fortnite-owner-epic-games-used-digital-dark-patterns-charge)
- [CFPB — Banking in video games and virtual worlds](https://www.consumerfinance.gov/data-research/research-reports/issue-spotlight-video-games/)
- [FTC — 15 minutes of game: the $32.5 million Apple settlement](https://www.ftc.gov/business-guidance/blog/2014/01/15-minutes-game-getting-core-ftcs-325-million-settlement-apple)`,
  },

  // ── 13. Public Wi-Fi / LAN ──────────────────────────────────────────────────
  {
    slug: 'public-wifi-gaming-security-lan-events',
    title: 'Gaming on Public Wi-Fi: What\u2019s Actually Risky',
    metaTitle: 'Public Wi-Fi Gaming Security: LAN Events, Hotels & Internet Cafes',
    seoDescription:
      'Public Wi-Fi at LAN events, hotels, and internet cafes carries real risks \u2014 evil twin hotspots, packet sniffing, and session hijacking. Here is what actually threatens you and how to stay safe.',
    summary:
      'Public Wi-Fi exposes you to evil-twin hotspots, packet sniffing, and session hijacking \u2014 and HTTPS alone does not hide which sites you visit. Here is the realistic risk picture and the steps that close it.',
    contentType: 'security',
    tags: ['public-wifi', 'lan-events', 'hotspot', 'vpn', 'evil-twin', 'sniffing'],
    body: `Gaming at a LAN event, a hotel, or an internet cafe usually means connecting to Wi-Fi you do not control, surrounded by strangers. The [FTC's guidance on public Wi-Fi](https://consumer.ftc.gov/articles/are-public-wi-fi-networks-safe-what-you-need-know) is the right starting point: these networks are built for convenience, not security.

## The attacks that actually happen

The threats are concrete and well-documented, not theoretical:

- **Evil twin hotspots.** An attacker sets up a Wi-Fi network with the same name as the real one — "Hotel_Free_WiFi" — and your device auto-connects to whichever has the stronger signal. Everything you do then routes through their device, as [a breakdown of the attacks](https://cyberbasics.io/posts/public-wifi-safety-guide) explains.
- **Packet sniffing.** On an open network, freely available tools like Wireshark can capture unencrypted traffic and read the metadata of everything else — which domains you visit, when, and how often.
- **Session hijacking.** Your login session is a cookie; capture the cookie, and an attacker can impersonate you without your password.
- **Compromised or hostile captive portals.** The login page a Wi-Fi network shows you is itself a vector if it asks for credentials you were not expecting.

The uncomfortable detail most guides skip: HTTPS encrypts the *content* of your connection, but not the domain name (the SNI field stays in plaintext during the TLS handshake), and not your DNS queries. [A technical rundown](https://dev.to/ricco020/public-wifi-in-2026-whats-actually-risky-and-what-isnt-4an5) is blunt: with HTTPS alone, the network operator still knows every site you visit.

## What actually protects you

- **A VPN, activated before you connect.** It encrypts everything leaving your device — DNS, domain names, all traffic — so the network sees only an encrypted stream to the VPN server. Choose a reputable, audited provider, and enable the kill switch so a dropped VPN does not silently expose you.
- **Verify the network name with staff.** Do not assume the SSID your phone found is the real one. Ask.
- **Disable auto-connect** to open networks in your OS settings, so your device does not silently join an evil twin.
- **For anything sensitive — banking, password changes, a valuable gaming account — use your phone's mobile hotspot** instead of the venue's Wi-Fi. Your carrier's connection is not shared with a room full of strangers.
- **Log out completely** on any shared computer, and never let a browser or password manager save credentials on a machine you do not own.

Internet cafes deserve an extra warning: their machines are shared, often poorly maintained, and a common home for keyloggers and info-stealers. Do not log into your real accounts on a cafe PC. Bring your own device.

## Sources

- [FTC — Are Public Wi-Fi Networks Safe?](https://consumer.ftc.gov/articles/are-public-wi-fi-networks-safe-what-you-need-know)
- [cyberbasics.io — Public Wi-Fi Security: 4 Attacks Happening Right Now](https://cyberbasics.io/posts/public-wifi-safety-guide)
- [dev.to — Public WiFi in 2026: What\u2019s Actually Risky and What Isn\u2019t](https://dev.to/ricco020/public-wifi-in-2026-whats-actually-risky-and-what-isnt-4an5)`,
  },

  // ── 14. Account boosting ───────────────────────────────────────────────────
  {
    slug: 'account-boosting-trading-bans',
    title: 'Account Boosting and Trading: The Fastest Way to Get Banned',
    metaTitle: 'Account Boosting & Trading Bans: Riot, Valve Rules Explained',
    seoDescription:
      'Buying a boost, sharing your login, or selling an account violates the terms of every major platform and gets accounts banned. Here is what the rules say and why the "service" is a scam.',
    summary:
      'Account boosting, account sharing, and account selling all violate platform terms and carry bans \u2014 and the "booster" often steals the account outright. Here is what Riot and Valve actually prohibit and why it is not worth it.',
    contentType: 'gaming',
    tags: ['boosting', 'account-trading', 'bans', 'riot', 'valve', 'smurfing', 'rank'],
    body: `"Get boosted to Diamond, pay after you rank up." It is one of the oldest offers in competitive gaming, and it is a trap in two different ways at once: it gets the account banned, and it frequently gets the account stolen.

## What the rules actually say

Riot's rules are the clearest, because they spell out the terms directly. [Riot's Terms of Service](https://www.riotgames.com/en/terms-of-service) prohibit "playing on another person's account or otherwise engaging in activity intended to 'boost' an account's status or rank." The [Community Pact](https://www.riotgames.com/en/community-pact) lists the whole family of offenses: solo boosting, queue boosting, deranking, smurfing, win-trading, and match-fixing — and is explicit that "buying, selling, or transferring accounts violates our Terms of Service." Penalties range from temporary bans to permanent suspension and hardware (HWID) bans that block the device itself, not just the account.

[Valorant's support page](https://support-valorant.riotgames.com/hc/en-us/articles/360044270174-Be-on-Your-Best-Behavior) is even more direct: "boosting and bussing are bannable offenses," and you should never share your account or login credentials with anyone.

Valve's position on Steam is the same in practice: account sharing and selling violate the Steam Subscriber Agreement, and — as covered in [our Steam trade scam guide](/article/steam-api-trade-scam-cs2-skins) — stolen items are not returned.

## Why the "service" is a scam even when it works

The account that gets boosted is the account that gets handed to a stranger. To boost you, someone else has to log in as you — which means you have given away your password, and with it every account that shares that password or is linked to the same email. The CFPB's [spotlight on gaming](https://www.consumerfinance.gov/data-research/research-reports/issue-spotlight-video-games/) documents exactly this: people buy an account or a boost from a third party, confirm receipt, and then the account is recovered by the original owner or drained by the "booster," with no recourse because the transaction itself violates the platform's terms.

And the rank is not yours anyway. It is a rank you did not earn, on an account that can be permanently banned the moment the boost is detected — and Riot's detection is not subtle. The whole transaction trades a real account for a number that disappears.

## The honest alternative

The only rank worth having is the one you earn on an account only you can log into. The players selling boosts are not selling a service; they are selling access to your account. No legitimate rank boost exists, because every platform that runs a ladder prohibits it in writing.

## Sources

- [Riot Games — Terms of Service](https://www.riotgames.com/en/terms-of-service)
- [Riot Games — Community Pact](https://www.riotgames.com/en/community-pact)
- [Valorant Support — Be on Your Best Behavior](https://support-valorant.riotgames.com/hc/en-us/articles/360044270174-Be-on-Your-Best-Behavior)
- [CFPB — Banking in video games and virtual worlds](https://www.consumerfinance.gov/data-research/research-reports/issue-spotlight-video-games/)`,
  },

  // ── 15. DDoS & streamer IP protection ──────────────────────────────────────
  {
    slug: 'ddos-attack-streamer-ip-protection',
    title: 'DDoS and IP Leaks: What Streamers Actually Need to Do',
    metaTitle: 'DDoS & IP Protection for Streamers and Gamers: The Real Steps',
    seoDescription:
      'DDoS attacks knock streamers offline by flooding their IP. Your IP leaks through P2P games, Discord calls, and more. Here is what actually hides it and what does not.',
    summary:
      'A DDoS attack floods your connection using your real IP, and that IP leaks through P2P games, Discord direct calls, and stream metadata. Here is what genuinely protects you and the Cloudflare misconception to avoid.',
    contentType: 'security',
    tags: ['ddos', 'ip-address', 'streamer', 'vpn', 'cloudflare', 'network'],
    body: `If you stream or play competitive games, your real IP address is the one piece of information that turns a stranger into someone who can take you offline. A DDoS attack floods your connection with junk traffic using that IP, and the attack is cheap to launch — no technical skill required, tools available for free.

## How your IP leaks

[An analysis of how streamers leak their IP](https://dcspeedtest.com/blog/why-streamers-hide-ip-going-live-2026) lists the common vectors: peer-to-peer game sessions where other players can capture your IP from lobby packets, Discord direct voice calls (use server voice channels instead), accepting game invites that expose your IP in the handshake, and clicking links in chat that log your IP on the destination server. In 2025, average DDoS attacks on streamers were measured at 8\u201315 Gbps — more than enough to overwhelm any residential connection.

## The Cloudflare misconception

A lot of advice says "put Cloudflare in front of it and your IP is hidden." For a *website*, that is true. For a *game server*, it is mostly wrong. [A detailed breakdown of Cloudflare and game ports](https://nubitro.com/en/article/does-cloudflare-protect-game-servers-the-udp-reality) explains why: Cloudflare's proxy only handles HTTP/HTTPS traffic on ports 80 and 443. Game servers use UDP on ports like 25565 (Minecraft) or 27015 (Source games), and Cloudflare never sees that traffic — your real IP has to be published for players to connect, and it is findable with a simple DNS lookup.

## What actually works

- **A VPN, on before you go live.** This is the foundation for streamers: every connection leaves with the VPN's IP instead of your home IP. Enable the kill switch so a dropped VPN cuts your internet rather than exposing your real IP mid-stream.
- **Use server-based voice channels, not direct calls.** Discord direct calls can expose your IP; server voice channels route through Discord's infrastructure.
- **Do not click links from chat.** A link in your own chat is a request from a stranger to log your IP.
- **If you run a game server, use a DDoS-protected proxy or hosting provider** — TCPShield for Minecraft, or a host with network-level mitigation — so the attack hits their infrastructure, not your home connection. [This guide to Minecraft DDoS protection](https://rackdiff.com/en/blog/minecraft-ddos-schutz) walks through the setup.
- **Do not host a game server from your home connection** if you are a target.

## If you are already under attack

End the stream, disconnect, and stay offline until you have the VPN or a new IP. Contact your ISP — they can sometimes block the attack upstream and issue a new IP. For severe or repeated attacks, report to the [FBI's Internet Crime Complaint Center](https://www.ic3.gov). Most of the damage from a DDoS is a few minutes to half an hour of downtime; the goal of the precautions is to make it not worth the attacker's time in the first place.

## Sources

- [dcspeedtest — Why Every Pro Streamer Hides Their IP While Going Live](https://dcspeedtest.com/blog/why-streamers-hide-ip-going-live-2026)
- [nubitro — Does Cloudflare Protect Game Servers? The UDP Reality](https://nubitro.com/en/article/does-cloudflare-protect-game-servers-the-udp-reality)
- [rackdiff — Protect Minecraft Server from DDoS: TCPShield & Alternatives](https://rackdiff.com/en/blog/minecraft-ddos-schutz)`,
  },
];
