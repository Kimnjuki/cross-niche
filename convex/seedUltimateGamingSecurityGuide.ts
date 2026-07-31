/**
 * seedUltimateGamingSecurityGuide.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds "The Ultimate Guide to Steam, Xbox, PlayStation, and Discord Security"
 * into thegridnexus.com Convex backend (gaming section).
 *
 * Insertion order (per seed payload spec):
 *   authors -> topics (skip if 'Gaming Security' exists) -> feeds (skip if
 *   'gaming' feed exists) -> tags (skip existing) -> content -> contentTags
 *   -> contentFeeds -> media -> editorialStandards
 *
 * Image flow:
 *   The runner script (scripts/seed-ultimate-gaming-security-guide.ts) uploads
 *   the 3 images to Convex storage, then calls this mutation with the three
 *   storageIds. This mutation resolves public CDN URLs via ctx.storage.getUrl()
 *   and substitutes the {{IMAGE_1_URL}} / {{IMAGE_2_URL}} / {{IMAGE_3_URL}}
 *   placeholders in content.body and media[].url.
 *
 * Run via:  npx convex run seedUltimateGamingSecurityGuide --args '{...}'
 *           (or via scripts/seed-ultimate-gaming-security-guide.ts)
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

const CONTENT_DATA = {
  title: "The Ultimate Guide to Steam, Xbox, PlayStation, and Discord Security",
  subtitle: "Protecting Your Gaming Identity and Wallet",
  slug: "ultimate-guide-steam-xbox-playstation-discord-security",
  summary:
    "A practical guide to protecting Steam, Xbox, PlayStation, and Discord accounts, covering 2FA, Steam Guard, password hygiene, platform-specific scams, console privacy settings, and Discord server hardening.",
  metaTitle:
    "The Ultimate Guide to Steam, Xbox, PlayStation, and Discord Security",
  seoDescription:
    "Ultimate guide to Steam, Xbox, PlayStation and Discord security: practical 2FA and safety measures to protect gaming accounts, payments, and communities.",
  focusKeyword: "gaming account security",
  contentType: "gaming_security_guide" as const,
  status: "draft",
  targetAudience: "gamer" as const,
  editorialLevel: "high" as const,
  securityDifficulty: "intermediate" as const,
  gamingPlatforms: ["steam", "xbox", "playstation", "discord"],
  isFeatured: false,
  isPremium: false,
  isBreaking: false,
  isEditorialSelection: true,
  isAutomated: false,
  isDeleted: false,
  geoOptimized: true,
  wordCount: 3634,
  estimatedReadingTimeMinutes: 18,
  viewCount: 0,
  publishedAt: 1785373596862,
  lastModifiedAt: 1785373596862,
};

const BODY_TEMPLATE = `<p>You already spend a great deal of time on Steam, Xbox, PlayStation, and Discord; these platforms save your purchase information, games, and discussions. It's possible that your daily routines and account security settings haven't kept up with the growing number of frauds, account theft, and attempts to harvest data from players. The fundamentals of protecting your accounts on all four platforms, avoiding threat actors' traps, and developing long-term resilience against new threats will all be covered in this guide.</p>

<h3>Key Takeaways</h3>
<ul>
<li>Protecting your accounts, identities, payments, and personal information from fraudulent behavior is known as gaming account security for Steam, Xbox, PlayStation, and Discord.</li>
<li>Using safe primary email addresses, creating strong, one-of-a-kind passwords, and turning on two-factor authentication wherever feasible are all important components of account security.</li>
<li>The most prevalent attack methods against all major gaming platforms include phishing schemes, credential stuffing, malware and Trojaned cheat programs, and phony help requests.</li>
<li>The risk of account theft and unauthorized access is significantly decreased by turning on platform-specific security features like Steam Guard, Xbox and PlayStation 2FA, and Discord privacy settings.</li>
<li>Modifying Discord and console privacy and communication settings lowers the likelihood of doxxing, harassment, and efforts to acquire data.</li>
<li>Using antivirus software, password managers, authenticator apps, and breach monitoring services can simplify and improve account security on several platforms.</li>
<li>Maintaining long-term account security requires a routine maintenance program that examines privacy settings, authorizations, and account security.</li>
</ul>

<p>One Akamai study reported approximately 12 billion credential-stuffing attacks targeting gaming accounts in 17 months. The initial version said "70%"; Akamai 2025.</p>

<figure><img src="{{IMAGE_1_URL}}" alt="Gaming account security across Steam, Xbox, PlayStation, and Discord" width="518" height="518" /></figure>

<h2>What Is Gaming Account Security for Steam, Xbox, PlayStation, and Discord?</h2>
<p>Gaming account security denotes the measures taken to protect your Steam, Xbox, PlayStation, and Discord accounts, as well as the broader ecosystem of connected accounts, from compromise and fraudulent activity. It includes the standard account security measures such as secure passwords, two-factor authentication (2FA), and recovery email but also extends to protecting your personal information, ensuring privacy, and reducing exposure to risk.</p>
<p>It often involves a holistic approach, as compromising one weak link (such as the primary email account) leads to the collapse of the entire security infrastructure, exposing not only the linked Steam, Xbox, PSN and Discord accounts but also other services such as Twitch, YouTube, and payment processors. Email security is an integral part of any gaming account security, which is why I've published an extensive Email Security Best Practices guide covering the necessary measures such as using a secure primary email and enabling 2FA. Effective account security for gaming platforms involves using strong, unique passwords for each account, enabling 2FA, using a secure primary email address, and actively monitoring account activity and authorizations. It also involves checking the security features of each account and keeping an eye on suspicious activity and authorization attempts. Enforcing long, unique passwords across multiple accounts and platforms coupled with 2FA and monitoring drastically reduces the risk of phishing, credential stuffing, and similar attacks successfully compromising your accounts.</p>

<h2>Why Is It Crucial to Secure Your Steam, Xbox, PlayStation, and Discord Accounts?</h2>
<p>Gaming accounts frequently hold important data and resources. Items from a hijacked Steam account with a large inventory could be stolen and sold on other markets in a matter of hours. Although the potential damage is greatly diminished if the account was secured with Steam Guard, Valve's 2FA solution, the thief might still be able to get around it rather easily. Particularly with the increasing number of services that use stored payment methods, inadequate account security on Steam, Xbox, and PlayStation exposes account holders to fraudulent purchases using the associated cards or wallets. Inadequate Discord account security could result in doxxing, harassment, and direct message fraud, especially if the threat actor is able to breach the account and access private conversations and servers.</p>
<p>Gaming account security extends beyond individual accounts, encompassing the data and assets associated with each account. For instance, compromised gaming accounts could lead to the theft of high-value items on third-party marketplaces. This is particularly relevant to Steam, where a skins inventory containing rare virtual items could be worth thousands of USD and vulnerable to being traded away without the owner's consent once the account is compromised. In some cases, phishing scams targeting Steam's account holders have resulted in loss of both the game wallet balance and inventory, with Valve denying any responsibility and citing the Steam Subscriber Agreement which states that players are responsible for any activity on their accounts. Similarly, an Xbox account owner could be victim of unauthorized Game Pass, gift card, and in-game purchase subscriptions, which could incur hundreds of USD in charges before the scam is uncovered. In cases where the account owner is unable to prove that the scam occurred without their knowledge, the account could be permanently disabled with no refunds issued.</p>
<p>If a threat actor acquires access to the victim's private servers and direct messages, sensitive or identifiable information may be taken and made public, which could result in serious harassment. Furthermore, phishing, phony bots, or illegal server access could damage Discord communities, putting their users at risk of fraud or data theft. The Meccha Chameleon Discord server was infiltrated in one known instance when one of the site's engineers allowed a malicious bot to join the server after falling for a phishing scheme. The bot proceeded to ban numerous legitimate members, seize control of the server, and utilize the official channels to post fake news and phishing links for several days before being removed by the developers. The compromised server notified its members that all invite links should be considered compromised, advising caution until the server had been secured. This incident serves as a stark reminder that not even established and seemingly secure gaming communities are immune to account compromise. The threat actor managed to hijack one of the servers used by the developers, potentially extracting sensitive information and exposing the server's members to phishing attempts and unauthorized access to their accounts.</p>
<p>The potential consequences of poor account security on gaming accounts range from loss of assets or access to frozen or canceled accounts, as well as reputational damage from unauthorized content posted on one's behalf. The accounts on Steam, Xbox, PlayStation, and Discord are often viewed by their owners as relatively lightweight compared to more serious matters such as banking and email accounts. Because of this, both account owners and threat actors who deliberately target these vulnerabilities tend to underestimate intrusions on these accounts.</p>

<h2>Which Security Risks Affect Gaming Platforms the Most Frequently?</h2>
<p>Phishing, credential stuffing, malware, phony help requests, and SIM switching are the most prevalent security risks that affect all major gaming platforms. While credential stuffing uses automated software to guess account credentials by attempting usernames and passwords collected from other breaches, phishing scams involve phony requests for sensitive information, such as account credentials or personal data, via phony websites or communications. Malware can take many different forms, such as Trojan horses that alter trustworthy software to steal private data or phony cheat applications that also steal login credentials.</p>
<p>Finally, by allowing threat actors to reroute the victim's phone number to a phone under their control, SIM swapping seriously jeopardizes the victim's ability to receive SMS messages and 2FA codes.</p>
<p>Phishing scams typically appear as questionable emails requesting the recipient to log into a website or service. These requests often come from fake websites that mimic the real ones, tricking the user into disclosing personal information. They may even appear to be fake help messages, like a Discord direct message that promises a reward for checking in at a particular link or offers help for an urgent account issue. On the other hand, credential stuffing is typically done with automated software that tries usernames and passwords in an attempt to guess account credentials obtained from other breaches or brute-force attacks. This kind of attack may target several accounts simultaneously, especially if the password is weak if the same login and password are used on various websites. Usually via phishing or hijacked third-party software, malicious links or attachments that alter genuine programs or fabricate security software that targets certain gaming accounts are used to spread malware. Threat actors that pose as legitimate support representatives and contact customers via email or other messaging services to solicit sensitive information or money are usually the source of fake support requests. In order to compromise the victim's capacity to receive SMS messages and 2FA codes, SIM switching usually entails calling the victim's mobile carrier and deceiving them into moving the victim's phone number to a SIM card under the threat actor's control.</p>

<h2>Examples of Platform-Specific Scams for Steam, Xbox, PlayStation, and Discord</h2>
<p>Users of Steam, Xbox, PlayStation, and Discord are frequently the target of scams that take advantage of special features of the platforms, like phishing links masquerading as official web addresses, phony trade offers, and phony support emails or direct messages. On Steam, threat actors often send fake trade offers and links to third-party marketplaces offering to sell items at a discount, with the links redirecting to phishing scams that request a victim's Steam credentials to log in to a fake website. On Xbox and PlayStation, users are often targeted with fake support emails that redirect them to phishing scams with fake login fields. On Discord, users are often targeted with fake Nitro scams, fake verification bots, and phishing links in DMs. Users of all these platforms are also targeted by credential stuffing attempts, which try to log them in using credentials from other breaches, and phishing messages that request personal information and payment details.</p>

<figure><img src="{{IMAGE_2_URL}}" alt="Platform-specific gaming scams: Steam, Xbox, PlayStation, and Discord" width="650" height="357" /></figure>

<h2>How to Make Strong, One-of-a-Kind Passwords for Every Gaming Account</h2>
<p>Strong, one-of-a-kind passwords are crucial for account security because they keep hackers out of your accounts. Unique passwords ensure that a breach on one account does not lead to a compromise on other accounts, while strong passwords resist attempts at being guessed or brute-forced. Effective strong and unique gaming account passwords are usually long (20+ characters), randomly generated, or a passphrase with random characters inserted, and are used for one account. Password managers are useful tools to generate strong, unique passwords that can be used across multiple accounts without having to memorize them. They can also be used to ensure that each account's password is long and randomly generated, increasing account security. A passphrase can be used for each account in situations where a password manager is not an option, especially if the account is accessed from a single device, like a home console that is only used by one person. A string of characters or words, like "Galaxy-Warden-Runs-Raids-2026!" is known as a passphrase. That can be used as a secure password without the need to replace letters or numbers with characters. For instance, one could use a passphrase like "My-Passphrase-Is-Secure!" in place of the popular password "123456789," where there are no special characters or spaces between each word.</p>

<h2>Securing Your Primary Email and Using 2FA Everywhere</h2>
<p>Since your primary email is frequently the default recovery method for all of your accounts, it is the cornerstone of your account security. Because of this, it is essential to protect it with security measures like 2FA and strong, one-of-a-kind passwords. Enabling 2FA, also referred to as two-step verification or 2SV, on all of your accounts and services—especially email, gaming accounts, and payment processors—is essential in addition to the fundamentals. By requiring an extra code, 2FA strengthens security beyond the typical username-password combination and greatly increases the difficulty of unauthorized access to the account. Enabling 2FA on your email, Steam, Xbox, PlayStation, and Discord accounts is advised; ideally, each service should use a different 2FA method. Microsoft Authenticator is a popular choice for Xbox accounts, while app-based 2FA options are available for most other services. This additional layer of security is vital, particularly for high-value accounts such as email and gaming accounts, as it significantly increases the security of these accounts. See the Enabling Two-Factor Authentication guide for additional details on this subject.</p>

<h2>How to Protect Your Steam Account with Steam Guard and Privacy Settings</h2>
<p>For optimal security, Steam Guard—the official 2FA solution for Steam accounts—should be turned on. In Steam's Settings > Account > Manage Steam Guard Account Security, you can activate Steam Guard. Depending on the options selected, Steam Guard will send a special code via the Steam mobile application or to the email address linked to the account once it has been enabled. Because Steam Guard requires a code to access the account on a new device, it offers an extra degree of security. For Steam Guard, it is advised to use the Steam mobile authenticator since it is more convenient than the email option, particularly for users who frequently log in to their Steam accounts from different computers.</p>
<p>To lessen the chance of falling victim to scams, it is advised to utilize Steam's privacy settings in addition to turning on Steam Guard. Users can control who can view their game library, profile information, and other details by accessing Steam's privacy settings in the Privacy & Safety section of the Steam client. To lessen the chance of being targeted by scammers looking to steal expensive in-game items, it is advised to set inventory visibility to Friends Only or Private. Additionally, Steam's third-party app and API access must be routinely examined, and any dubious or unapproved apps must be eliminated.</p>
<p>To make sure that no unauthorized devices have accessed the Steam account, it might also be necessary to verify which devices are permitted to do so. The Steam account password should be changed, and any unauthorized devices should be removed right away. In order to find any malware that might have been installed by unauthorized software, such as cheats or modified software that contains keyloggers or other malware that can steal Steam credentials, it is also a good idea to run an antivirus program on the computer used to access the Steam account. See the Endpoint Security and Anti-Malware guide for additional details on this subject.</p>

<h2>How to Set Up and Enable 2FA on Xbox and PlayStation Accounts</h2>
<p>Protecting the Microsoft or Sony account linked to the console is the main focus of account security on both Xbox and PlayStation. Two-step verification for Microsoft account security is available at account.microsoft.com, enabled there. Similar to this, users can enable two-step verification for their Sony accounts on the PSN account management website. An extra code will be needed to log in to the Xbox or PlayStation console or web interface once two-step verification is enabled on the Microsoft or Sony account, making unauthorized access much more challenging.</p>
<p>Additional account security features, like monitoring account access and activity, are available on both account management websites. To make sure that no unauthorized devices or accounts are accessing the account, it is advised to periodically check these settings. It is advised to update the account password and activate extra security features like 2FA if unauthorized access is suspected.</p>

<figure><img src="{{IMAGE_3_URL}}" alt="Enabling 2FA on Xbox and PlayStation accounts" width="650" height="366" /></figure>

<h2>Console Privacy, Communication Settings, and Linked Services</h2>
<p>You can use the privacy settings on your Xbox and PlayStation accounts to conceal personal information like names and online status, which lowers your chances of falling victim to scams or doxing attempts. Communication privacy settings, which can be altered to lower the possibility of unwanted interactions, are another aspect of console account security. For instance, you can limit who can send messages, friend requests, or party invitations using the Xbox Live communication privacy settings. PlayStation users can customize who can contact them and how with similar features. Twitch, YouTube, Spotify, and other services can be connected to the accounts on both consoles. To guarantee that no unwanted access is possible, each of these services has its own account security and privacy settings that need to be examined and modified. See the Securing Linked Accounts and Third-Party Apps guide for additional details on this subject.</p>

<h2>How to Protect Your Discord Server and Account from Abuse and Hacks</h2>
<p>Discord account security should be configured to reduce the risk of being targeted by scams or having your account compromised. One way to do this is by going to User Settings > My Account > Enable Two-Factor Authentication. Since a password is no longer enough to access the account, 2FA greatly lowers the risk of being the target of automated account takeover attempts. For Discord's 2FA, it is advised to use an authenticator app since it is more secure than SMS-based solutions.</p>
<p>To lower the likelihood of falling victim to scams, it is advised to set up Discord's privacy and safety settings in addition to turning on 2FA. These settings allow you to see the user's activity status, add them as a friend, and control who can send direct messages. To lower the risk of fraud and unwanted interactions, it is advised to modify these settings to only permit communications from friends or shared servers. Because they are potential attack vectors that could compromise the server and its members, Discord server operators should also be aware of the bots and roles on their servers. If a bot is compromised, it can cause more harm if it has more permissions. Because of this, it's critical to routinely examine bots and roles and eliminate any that aren't required. To minimize the risk of data breaches or unauthorized access, it's also critical to limit access to sensitive channels and information.</p>
<p>The advice that follows is based on my own running experiences with a relatively large Discord community (3,000 members) and responding to account compromise incidents and related security concerns.</p>

<h3>Personal account hardening</h3>
<p>You should handle your Discord account just like you would your email or bank account in order to keep it secure.</p>
<ul>
<li>Make use of a special password that you keep in a reliable password manager. Don't use this password for anything like Xbox, PlayStation, or Steam.</li>
<li>In Discord, enable two-factor authentication. An app such as Google Authenticator or Auth0 can assist with this. Store your codes in a secure location, such as a phone note or a folder on your computer.</li>
<li>Verify the security of your devices. Don't stay logged in on public computers and use pins to lock them. Update your operating system and browser.</li>
<li>Verify which apps can access your Discord account and delete any that you do not recognize. Even if you change your password, bad apps can still get in.</li>
</ul>

<p>Everyday privacy and direct message hygiene are important too.</p>
<ul>
<li>Limit who can send you messages, add you as a friend, or see your activity status. This will help stop messages and scam offers.</li>
<li>When using files and links from strangers, exercise caution. Unless you are certain they are secure, do not click on them.</li>
<li>To prevent viewing offensive content, you can disable images and embeds if you are on a server with content.</li>
<li>Never give out your Discord login information to anyone unless you are using the official Discord app or the Discord website.</li>
</ul>

<p>You must ensure the security of your Discord server if you own one.</p>

<ol>
<li>
<strong>Restrict the number of administrators.</strong> This power should only belong to the owner and one reliable individual.
<ul>
<li>Verify that every employee has the authorization required to carry out their duties.</li>
<li>Demand that two-factor authentication be enabled for every employee.</li>
</ul>
</li>
<li>
<strong>Make sure roles and channels are secure.</strong>
<ul>
<li>Limit what the @everyone role can do.</li>
<li>Do not let anyone mention staff roles unless you want them to.</li>
<li>Use channel overrides to control who can see and write in channels.</li>
</ul>
</li>
<li>
<strong>Control bots like they are services.</strong>
<ul>
<li>Do not give bots administrator power unless they need it.</li>
<li>Use bots that are updated regularly and get rid of any you do not need.</li>
<li>Consider using security bots to help keep your server safe.</li>
</ul>
</li>
<li>
<strong>Verify members and use content filters.</strong>
<ul>
<li>Make sure new members verify their email and have been in the server for a few minutes before they can do anything.</li>
<li>Use a channel for new members to verify themselves.</li>
<li>Turn on content filters to catch links and spam.</li>
</ul>
</li>
<li>
<strong>Observe your server. If something goes wrong, have a plan.</strong>
<ul>
<li>Every week, look for actions in the server log.</li>
<li>Maintain a document outlining the permissions and structure of your server.</li>
<li>Verify the functionality of your backups.</li>
</ul>
</li>
</ol>

<p>It is much more difficult for malicious people to attack you when you have a secure server and good privacy settings.</p>

<h2>Common Questions</h2>

<h3>Do all of my gaming platforms require two-factor authentication, or is it only necessary for my email?</h3>
<p>On all of them, you require it. Your email requires two-factor authentication because it functions similarly to a master key. Additionally, you ought to have it on every platform, including Discord, Xbox, and Steam.</p>

<h3>Is two-factor authentication the same as Steam Guard?</h3>
<p>It is, indeed. Valve refers to its two-factor authentication system as Steam Guard.</p>

<h3>If I believe my gaming account has been compromised, what should I do?</h3>
<p>Change your password, secure your email, log out of every session, and enable two-factor authentication. Next, see if anyone has been logging in from different locations by reviewing your login history.</p>

<h3>Are Xbox and PlayStation two-factor authentication free to use?</h3>
<p>Yes, they are. You do not need to pay for a subscription to use two-factor authentication on these platforms.</p>

<h3>About the Author and Reviewer</h3>
<p>Author: Kim, who has 8+ years of experience in SEO, gaming and cybersecurity and has helped over 40 websites get ranked on Google.</p>
<p>Reviewed by: Jackson, a Senior Security Analyst who specializes in gaming and marketplace fraud.</p>
`;

const TAGS = [
  { name: "Steam", slug: "steam" },
  { name: "Xbox", slug: "xbox" },
  { name: "PlayStation", slug: "playstation" },
  { name: "Discord", slug: "discord" },
  { name: "Two-Factor Authentication", slug: "2fa" },
  { name: "Account Security", slug: "account-security" },
  { name: "Phishing", slug: "phishing" },
] as const;

export const seedUltimateGamingSecurityGuide = mutation({
  args: {
    image1StorageId: v.id("_storage"),
    image2StorageId: v.id("_storage"),
    image3StorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const results: Record<string, any> = {};

    // ── Resolve public CDN URLs from Convex storage ─────────────────────────
    const [image1Url, image2Url, image3Url] = await Promise.all([
      ctx.storage.getUrl(args.image1StorageId),
      ctx.storage.getUrl(args.image2StorageId),
      ctx.storage.getUrl(args.image3StorageId),
    ]);

    if (!image1Url || !image2Url || !image3Url) {
      throw new Error("Failed to resolve one or more image storage URLs.");
    }
    results.imageUrls = { image1Url, image2Url, image3Url };

    // ── Step 0: Skip entire seed if content slug already exists ─────────────
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", CONTENT_DATA.slug))
      .unique();

    if (existing) {
      return {
        skipped: true,
        message: `Content with slug "${CONTENT_DATA.slug}" already exists. Skipping entire seed.`,
        contentId: existing._id,
      };
    }

    // ── Step 1: Insert authors (Kim + Jackson) ──────────────────────────────
    const authorKimId = await ctx.db.insert("authors", {
      name: "Kim",
      slug: "kim",
      role: "contributor",
      bio: "8+ years of experience in SEO, gaming, and cybersecurity; has helped over 40 websites get ranked on Google.",
      expertise: ["SEO", "gaming", "cybersecurity"],
      active: true,
      articleCount: 1,
      joinedAt: 1785373596862,
    });

    const authorJacksonId = await ctx.db.insert("authors", {
      name: "Jackson",
      slug: "jackson",
      role: "analyst",
      bio: "Senior Security Analyst specializing in gaming and marketplace fraud.",
      expertise: ["gaming security", "marketplace fraud", "threat analysis"],
      active: true,
      articleCount: 0,
      joinedAt: 1785373596862,
    });

    results.authorKimId = authorKimId;
    results.authorJacksonId = authorJacksonId;

    // ── Step 2: Upsert topic 'Gaming Security' (skip if exists) ─────────────
    let topicId: any;
    const existingTopic = await ctx.db
      .query("topics")
      .withIndex("by_slug", (q) => q.eq("slug", "gaming-security"))
      .unique();

    if (existingTopic) {
      topicId = existingTopic._id;
      results.topicExisted = true;
    } else {
      topicId = await ctx.db.insert("topics", {
        name: "Gaming Security",
        slug: "gaming-security",
        category: "cross",
        description:
          "Account security, privacy, and fraud-prevention guidance for gaming platforms and communities.",
        featured: true,
        trending: true,
        articleCount: 1,
        followerCount: 0,
        sortOrder: 1,
        lastActivityAt: 1785373596862,
      });
      results.topicExisted = false;
    }
    results.topicId = topicId;

    // ── Step 3: Upsert feed 'Gaming' (skip if exists) ───────────────────────
    let feedId: any;
    const existingFeed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", "gaming"))
      .unique();

    if (existingFeed) {
      feedId = existingFeed._id;
      results.feedExisted = true;
    } else {
      feedId = await ctx.db.insert("feeds", {
        name: "Gaming",
        slug: "gaming",
        description: "Gaming news, guides, and security content.",
        isActive: true,
        isEditorialCurated: true,
        displayOrder: 1,
      });
      results.feedExisted = false;
    }
    results.feedId = feedId;

    // ── Step 4: Upsert tags (skip existing by slug) ─────────────────────────
    const tagIds: Record<string, string> = {};
    for (const tag of TAGS) {
      const existingTag = await ctx.db
        .query("tags")
        .withIndex("by_slug", (q) => q.eq("slug", tag.slug))
        .unique();

      if (existingTag) {
        tagIds[tag.slug] = existingTag._id;
      } else {
        const newTagId = await ctx.db.insert("tags", {
          name: tag.name,
          slug: tag.slug,
        });
        tagIds[tag.slug] = newTagId;
      }
    }
    results.tagsProcessed = Object.keys(tagIds).length;

    // ── Step 5: Insert content (substitute image URL placeholders) ──────────
    const body = BODY_TEMPLATE
      .replaceAll("{{IMAGE_1_URL}}", image1Url)
      .replaceAll("{{IMAGE_2_URL}}", image2Url)
      .replaceAll("{{IMAGE_3_URL}}", image3Url);

    const contentId = await ctx.db.insert("content", {
      title: CONTENT_DATA.title,
      slug: CONTENT_DATA.slug,
      subtitle: CONTENT_DATA.subtitle,
      summary: CONTENT_DATA.summary,
      body,
      status: CONTENT_DATA.status,
      contentType: CONTENT_DATA.contentType,
      targetAudience: CONTENT_DATA.targetAudience,
      editorialLevel: CONTENT_DATA.editorialLevel,
      securityDifficulty: CONTENT_DATA.securityDifficulty,
      gamingPlatforms: [...CONTENT_DATA.gamingPlatforms],
      metaTitle: CONTENT_DATA.metaTitle,
      seoDescription: CONTENT_DATA.seoDescription,
      focusKeyword: CONTENT_DATA.focusKeyword,
      authorId: String(authorKimId),
      isFeatured: CONTENT_DATA.isFeatured,
      isPremium: CONTENT_DATA.isPremium,
      isBreaking: CONTENT_DATA.isBreaking,
      isEditorialSelection: CONTENT_DATA.isEditorialSelection,
      isAutomated: CONTENT_DATA.isAutomated,
      isDeleted: CONTENT_DATA.isDeleted,
      geoOptimized: CONTENT_DATA.geoOptimized,
      wordCount: CONTENT_DATA.wordCount,
      estimatedReadingTimeMinutes: CONTENT_DATA.estimatedReadingTimeMinutes,
      viewCount: CONTENT_DATA.viewCount,
      publishedAt: CONTENT_DATA.publishedAt,
      lastModifiedAt: CONTENT_DATA.lastModifiedAt,
      featuredImageUrl: image1Url,
    });

    results.contentId = contentId;

    // ── Step 6: Insert contentTags join rows ────────────────────────────────
    const tagSlugsForContent = [
      "steam",
      "xbox",
      "playstation",
      "discord",
      "2fa",
      "account-security",
      "phishing",
    ];
    let contentTagsCreated = 0;
    for (const slug of tagSlugsForContent) {
      const tagId = tagIds[slug];
      if (!tagId) continue;

      const existingLink = await ctx.db
        .query("contentTags")
        .withIndex("by_content_tag", (q) =>
          q.eq("contentId", contentId).eq("tagId", tagId as any)
        )
        .unique();

      if (!existingLink) {
        await ctx.db.insert("contentTags", {
          contentId,
          tagId: tagId as any,
        });
        contentTagsCreated++;
      }
    }
    results.contentTagsCreated = contentTagsCreated;

    // ── Step 7: Insert contentFeeds join row ────────────────────────────────
    const existingFeedLink = await ctx.db
      .query("contentFeeds")
      .withIndex("by_content_feed", (q) =>
        q.eq("contentId", contentId).eq("feedId", feedId)
      )
      .unique();

    if (!existingFeedLink) {
      await ctx.db.insert("contentFeeds", {
        contentId,
        feedId,
      });
      results.contentFeedCreated = true;
    } else {
      results.contentFeedCreated = false;
      results.contentFeedNote = "Link already exists";
    }

    // ── Step 8: Insert media rows ───────────────────────────────────────────
    await ctx.db.insert("media", {
      contentId,
      url: image1Url,
      altText:
        "Gaming account security across Steam, Xbox, PlayStation, and Discord",
      mediaType: "image",
      positionInArticle: 1,
    });
    await ctx.db.insert("media", {
      contentId,
      url: image2Url,
      altText: "Platform-specific gaming scams: Steam, Xbox, PlayStation, and Discord",
      mediaType: "image",
      positionInArticle: 2,
    });
    await ctx.db.insert("media", {
      contentId,
      url: image3Url,
      altText: "Enabling 2FA on Xbox and PlayStation accounts",
      mediaType: "image",
      positionInArticle: 3,
    });
    results.mediaInserted = 3;

    // ── Step 9: Insert editorialStandards row ───────────────────────────────
    await ctx.db.insert("editorialStandards", {
      contentId,
      editorialLevel: "high",
      needsHumanReview: false,
      reviewedBy: "Jackson",
      reviewedAt: 1785373596862,
    });
    results.editorialStandardsCreated = true;

    return {
      skipped: false,
      message: `Successfully seeded "${CONTENT_DATA.title}" into Convex (gaming section).`,
      contentId,
      authorKimId,
      authorJacksonId,
      topicId,
      feedId,
      tagIds,
      ...results,
    };
  },
});