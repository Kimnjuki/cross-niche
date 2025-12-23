import { Article, Guide, Tool } from '@/types';

export const mockArticles: Article[] = [
  // Tech Articles
  {
    id: 'tech-1',
    title: 'Apple Vision Pro 2: Revolutionary Spatial Computing Arrives',
    excerpt: 'The next generation of spatial computing brings unprecedented capabilities to developers and consumers alike.',
    content: 'Full article content here...',
    niche: 'tech',
    author: 'Sarah Chen',
    publishedAt: '2024-12-18',
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=675&fit=crop&q=80',
    tags: ['Apple', 'VR', 'AR', 'Hardware'],
    isFeatured: true,
    viewCount: 125000,
    commentCount: 42,
    rating: 8.5,
    isTrending: true,
  },
  {
    id: 'tech-2',
    title: 'NVIDIA RTX 5090 Benchmarks Leak: 2x Performance Jump',
    excerpt: 'Early benchmarks suggest the next-gen flagship delivers unprecedented ray tracing performance.',
    content: 'Full article content here...',
    niche: 'tech',
    author: 'Marcus Johnson',
    publishedAt: '2024-12-17',
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=675&fit=crop&q=80',
    tags: ['NVIDIA', 'GPU', 'Hardware', 'Gaming'],
  },
  {
    id: 'tech-3',
    title: 'Quantum Computing Milestone: Google Achieves Error Correction',
    excerpt: 'Google researchers demonstrate practical quantum error correction for the first time.',
    content: 'Full article content here...',
    niche: 'tech',
    author: 'Dr. Emily Watson',
    publishedAt: '2024-12-16',
    readTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=675&fit=crop&q=80',
    tags: ['Quantum', 'Google', 'Research'],
  },
  {
    id: 'tech-4',
    title: 'Tesla Optimus Gen 3: Humanoid Robots Enter Mass Production',
    excerpt: 'Tesla begins scaling production of its latest humanoid robot with improved dexterity.',
    content: 'Full article content here...',
    niche: 'tech',
    author: 'Alex Rivera',
    publishedAt: '2024-12-15',
    readTime: 7,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&fit=crop&q=80',
    tags: ['Tesla', 'Robotics', 'AI'],
  },

  // Security Articles
  {
    id: 'sec-1',
    title: 'Critical Zero-Day Vulnerability Affects Millions of Routers',
    excerpt: 'Security researchers discover critical flaw in popular router firmware affecting home and enterprise networks.',
    content: 'Full article content here...',
    niche: 'security',
    author: 'James Morrison',
    publishedAt: '2024-12-18',
    readTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop&q=80',
    tags: ['Vulnerability', 'Router', 'Network'],
    impactLevel: 'high',
    isFeatured: true,
    viewCount: 250000,
    commentCount: 89,
    rating: 9.2,
    isTrending: true,
    securityScore: 9.1,
  },
  {
    id: 'sec-2',
    title: 'Major Gaming Platform Breach Exposes 50 Million Accounts',
    excerpt: 'Popular gaming platform confirms data breach affecting user credentials and payment information.',
    content: 'Full article content here...',
    niche: 'security',
    author: 'Lisa Park',
    publishedAt: '2024-12-17',
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=675&fit=crop&q=80',
    tags: ['Breach', 'Gaming', 'Data'],
    impactLevel: 'high',
  },
  {
    id: 'sec-3',
    title: 'New Ransomware Strain Targets Healthcare Systems',
    excerpt: 'Cybersecurity agencies warn of sophisticated ransomware campaign targeting medical facilities.',
    content: 'Full article content here...',
    niche: 'security',
    author: 'Dr. Robert Kim',
    publishedAt: '2024-12-16',
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=675&fit=crop&q=80',
    tags: ['Ransomware', 'Healthcare', 'Threat'],
    impactLevel: 'high',
  },
  {
    id: 'sec-4',
    title: 'Password Manager Security Audit Reveals Best Practices',
    excerpt: 'Independent security audit compares top password managers and reveals surprising findings.',
    content: 'Full article content here...',
    niche: 'security',
    author: 'Amanda Chen',
    publishedAt: '2024-12-15',
    readTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=675&fit=crop&q=80',
    tags: ['Password', 'Security', 'Tools'],
    impactLevel: 'medium',
  },
  {
    id: 'expert-interview-1',
    title: 'Expert Interview: Former NSA Analyst on AI, Gaming, and Security Convergence',
    excerpt: 'The intersection of AI and gaming creates unprecedented security challenges. We\'re seeing state-level actors weaponizing game engines for reconnaissance...',
    content: `# Expert Interview: Former NSA Analyst on AI, Gaming, and Security Convergence

In an exclusive interview with The Grid Nexus, a former NSA cybersecurity analyst discusses the emerging threats at the intersection of artificial intelligence, gaming platforms, and national security.

## The New Threat Landscape

"The intersection of AI and gaming creates unprecedented security challenges," explains our expert, who spent over a decade analyzing cyber threats for the National Security Agency. "We're seeing state-level actors weaponizing game engines for reconnaissance, using gaming platforms as entry points into corporate networks, and leveraging AI to create sophisticated attack vectors."

## Gaming Platforms as Attack Surfaces

Modern gaming platforms have become attractive targets for nation-state actors. With millions of users and complex networking infrastructure, these platforms offer multiple attack vectors:

- **Social Engineering**: Gamers are often more trusting of in-game communications
- **Network Exploitation**: Gaming networks can provide pathways into corporate environments
- **Data Collection**: Gaming platforms collect extensive user data that can be valuable for intelligence operations

## AI-Powered Threats

Artificial intelligence is being used to create more sophisticated attacks:

- **Automated Exploit Generation**: AI systems can identify vulnerabilities faster than human researchers
- **Behavioral Mimicry**: AI can mimic legitimate user behavior to evade detection
- **Social Engineering at Scale**: AI-powered chatbots can conduct thousands of social engineering attempts simultaneously

## Recommendations for Gamers and Organizations

1. **Enable Multi-Factor Authentication**: Always use 2FA on gaming accounts
2. **Separate Gaming Networks**: Keep gaming devices on separate networks from corporate systems
3. **Regular Security Updates**: Keep gaming software and platforms updated
4. **Awareness Training**: Educate users about gaming-related security risks

## The Future of Gaming Security

As gaming platforms continue to evolve, security must be built-in from the ground up. The convergence of AI, gaming, and security will require new approaches to threat detection and mitigation.

*This interview has been edited for clarity and length. The expert's identity has been protected for security reasons.*`,
    niche: 'security',
    author: 'Former NSA Analyst',
    publishedAt: '2024-12-18',
    readTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80',
    tags: ['Expert Interview', 'NSA', 'AI', 'Gaming', 'Security', 'Threat Intelligence'],
    impactLevel: 'high',
  },

  // Gaming Articles
  {
    id: 'game-1',
    title: 'GTA VI: Everything We Know About the Most Anticipated Game',
    excerpt: 'Rockstar\'s next entry in the Grand Theft Auto series promises to redefine open-world gaming.',
    content: 'Full article content here...',
    niche: 'gaming',
    author: 'Chris Taylor',
    publishedAt: '2024-12-18',
    readTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=675&fit=crop&q=80',
    tags: ['GTA', 'Rockstar', 'Open World'],
    securityScore: 85,
    isFeatured: true,
  },
  {
    id: 'game-2',
    title: 'Elden Ring DLC Breaks Sales Records in First Week',
    excerpt: 'Shadow of the Erdtree becomes the fastest-selling DLC in gaming history.',
    content: 'Full article content here...',
    niche: 'gaming',
    author: 'Maya Rodriguez',
    publishedAt: '2024-12-17',
    readTime: 7,
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=675&fit=crop&q=80',
    tags: ['Elden Ring', 'FromSoftware', 'RPG'],
    securityScore: 92,
  },
  {
    id: 'game-3',
    title: 'Nintendo Switch 2 Specs Confirmed: 4K Gaming Arrives',
    excerpt: 'Official specs reveal Nintendo\'s next console will support 4K output and DLSS technology.',
    content: 'Full article content here...',
    niche: 'gaming',
    author: 'Kevin Nakamura',
    publishedAt: '2024-12-16',
    readTime: 9,
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=1200&h=675&fit=crop&q=80',
    tags: ['Nintendo', 'Console', 'Hardware'],
    securityScore: 78,
  },
  {
    id: 'game-4',
    title: 'Esports World Championship 2024: Record $40M Prize Pool',
    excerpt: 'The largest esports event ever features teams from 50 countries competing for glory.',
    content: 'Full article content here...',
    niche: 'gaming',
    author: 'Diana Wong',
    publishedAt: '2024-12-15',
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=675&fit=crop&q=80',
    tags: ['Esports', 'Tournament', 'Competition'],
  },

  // Breaking News Articles
  {
    id: 'uefi-flaw-2024',
    title: 'Critical UEFI flaw enables pre-boot attacks on motherboards from Gigabyte, MSI, ASUS, ASRock',
    excerpt: 'Security researchers have discovered a critical vulnerability in UEFI firmware affecting millions of motherboards from major manufacturers, allowing attackers to execute code before the operating system loads.',
    content: `# Critical UEFI Flaw Enables Pre-Boot Attacks on Major Motherboard Manufacturers

## Overview

Security researchers have uncovered a critical vulnerability in Unified Extensible Firmware Interface (UEFI) firmware that affects motherboards from Gigabyte, MSI, ASUS, and ASRock. This flaw allows attackers to execute malicious code before the operating system loads, making it extremely difficult to detect and remove.

## The Vulnerability

The vulnerability, tracked as **CVE-2024-XXXX**, exists in the UEFI firmware's boot process. Attackers can exploit this flaw to execute code during the pre-boot phase, bypass Secure Boot protections, install persistent malware that survives OS reinstallation, and access sensitive data stored in firmware.

## Affected Manufacturers

- **Gigabyte**: Multiple series including AORUS, AERO, and Gaming series
- **MSI**: MPG, MAG, MEG, and PRO series motherboards
- **ASUS**: ROG, TUF Gaming, Prime, and ProArt series
- **ASRock**: Phantom Gaming, Steel Legend, and Taichi series

## Impact Assessment

### Nexus Risk Rating: 5/5 (Critical)

This vulnerability poses an **extreme risk** to gamers and enterprise users. The CVSS Score is 9.1 (Critical) due to low attack complexity, no authentication required, complete system compromise, and persistent access even after OS reinstall.

## Mitigation Steps

1. **Check Your Motherboard Model**: Verify if your motherboard is affected
2. **Update UEFI Firmware**: Download and install the latest firmware from your manufacturer
3. **Enable Secure Boot**: Ensure Secure Boot is enabled in BIOS/UEFI settings
4. **Disable Unnecessary Boot Options**: Remove USB boot and network boot if not needed

## Manufacturer Responses

All affected manufacturers have released firmware updates. Users should check their manufacturer's official support website for updates specific to their motherboard model.`,
    niche: 'security',
    author: 'Security Research Team',
    publishedAt: new Date().toISOString(),
    readTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop&q=80',
    tags: ['UEFI', 'Firmware', 'Security', 'Hardware', 'Critical Vulnerability'],
    impactLevel: 'high',
    securityScore: 9.1,
    isFeatured: true,
    viewCount: 350000,
    commentCount: 156,
    rating: 9.5,
    isTrending: true,
  },
  {
    id: 'microsoft-365-oauth-phishing',
    title: 'Microsoft 365 accounts targeted in wave of OAuth phishing attacks',
    excerpt: 'A sophisticated OAuth phishing campaign is targeting Microsoft 365 users, using legitimate-looking consent screens to steal account credentials and gain unauthorized access to corporate data.',
    content: `# Microsoft 365 Accounts Targeted in Wave of OAuth Phishing Attacks

## Overview

Security researchers have identified a large-scale OAuth phishing campaign targeting Microsoft 365 users. This sophisticated attack uses legitimate-looking OAuth consent screens to trick users into granting malicious applications access to their accounts.

## Attack Methodology

The attackers use OAuth consent phishing:
1. Register malicious applications with Microsoft Azure AD
2. Send phishing emails appearing to be from Microsoft
3. Redirect users to legitimate Microsoft login pages
4. Users unknowingly grant permissions to malicious applications
5. Attackers gain access to emails, files, contacts, and Office 365 data

## Impact

Once permissions are granted, attackers can read and send emails, access OneDrive files, read calendar information, access contacts, and potentially access SharePoint and Teams data.

## Mitigation Steps

1. **Review Connected Apps**: Check and remove suspicious OAuth applications
2. **Enable MFA**: Multi-factor authentication adds an extra layer of protection
3. **Review Permissions**: Audit all applications with access to your account
4. **Monitor Activity**: Check recent sign-ins and account activity

## Recovery Steps

If you've already granted permissions:
1. Immediately revoke access to the malicious application
2. Change your Microsoft account password
3. Enable MFA if not already enabled
4. Review activity for unauthorized access
5. Notify IT if this is a corporate account`,
    niche: 'security',
    author: 'Cybersecurity Team',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=675&fit=crop&q=80',
    tags: ['Microsoft 365', 'OAuth', 'Phishing', 'Security', 'Enterprise'],
    impactLevel: 'high',
    securityScore: 8.3,
    viewCount: 280000,
    commentCount: 94,
    rating: 8.8,
    isTrending: true,
  },
  {
    id: 'forticloud-sso-exposure',
    title: 'Over 25,000 FortiCloud SSO devices exposed to remote attacks',
    excerpt: 'Security researchers have discovered that more than 25,000 FortiCloud SSO devices are exposed to the internet with default credentials, allowing attackers to gain administrative access.',
    content: `# Over 25,000 FortiCloud SSO Devices Exposed to Remote Attacks

## Overview

Security researchers have identified a critical security issue affecting FortiCloud Single Sign-On (SSO) devices. More than 25,000 devices are exposed to the internet with default or weak credentials, allowing attackers to gain administrative access and potentially compromise entire network infrastructures.

## The Exposure

- **25,000+ devices** exposed to the internet
- **Default credentials** still in use
- **Administrative access** available to attackers
- **Network-wide compromise** possible

## Impact Assessment

### Nexus Risk Rating: 5/5 (Critical)

This exposure poses extreme risk. Once an attacker gains access, they can achieve full network control, data exfiltration, lateral movement, and maintain persistent access.

## Immediate Mitigation Steps

1. **Change Default Credentials**: Immediately change all default admin passwords
2. **Disable Internet Exposure**: Remove FortiCloud SSO from public internet access
3. **Enable MFA**: Implement multi-factor authentication for all admin accounts
4. **Review Access Logs**: Check for any unauthorized access attempts
5. **Update Firmware**: Ensure all Fortinet devices are running the latest firmware

## Recovery Steps

If your device has been compromised:
1. Immediately isolate the device from the network
2. Change all credentials
3. Review configurations for unauthorized changes
4. Restore from backup if possible
5. Conduct forensic analysis`,
    niche: 'security',
    author: 'Network Security Team',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    readTime: 11,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop&q=80',
    tags: ['FortiCloud', 'SSO', 'Network Security', 'Firewall', 'Critical'],
    impactLevel: 'high',
    securityScore: 9.0,
    viewCount: 195000,
    commentCount: 67,
    rating: 9.2,
    isTrending: true,
  },
];

export const mockGuides: Guide[] = [
  // Tech Guides
  {
    id: 'guide-1',
    title: 'Complete Guide to Building a Gaming PC in 2024',
    description: 'Step-by-step instructions for building your ultimate gaming rig with component selection, assembly, and optimization tips.',
    niche: 'tech',
    difficulty: 'intermediate',
    platform: ['PC'],
    steps: ['Choose components', 'Prepare workspace', 'Install CPU', 'Mount cooler', 'Install RAM', 'Install GPU', 'Cable management', 'First boot and BIOS setup'],
    publishedAt: '2024-12-10',
    readTime: 25,
  },
  {
    id: 'guide-4',
    title: 'Setting Up a Home Network: Router Configuration Guide',
    description: 'Learn how to configure your router, secure your Wi-Fi, and optimize network performance for gaming and streaming.',
    niche: 'tech',
    difficulty: 'beginner',
    platform: ['PC', 'Mobile'],
    steps: ['Access router admin panel', 'Change default credentials', 'Configure Wi-Fi settings', 'Set up guest network', 'Enable firewall', 'Optimize for gaming'],
    publishedAt: '2024-12-12',
    readTime: 20,
  },
  {
    id: 'guide-5',
    title: 'Installing and Configuring Linux: Beginner\'s Guide',
    description: 'Complete walkthrough for installing Linux, choosing a distribution, and setting up your system for daily use.',
    niche: 'tech',
    difficulty: 'beginner',
    platform: ['PC'],
    steps: ['Choose Linux distribution', 'Create bootable USB', 'Partition disk', 'Install Linux', 'Install drivers', 'Configure desktop environment', 'Install essential software'],
    publishedAt: '2024-12-11',
    readTime: 35,
  },
  {
    id: 'guide-6',
    title: 'Overclocking Your CPU and GPU: Safe Performance Boost',
    description: 'Learn how to safely overclock your processor and graphics card for maximum performance without damaging hardware.',
    niche: 'tech',
    difficulty: 'advanced',
    platform: ['PC'],
    steps: ['Understand risks and benefits', 'Check hardware compatibility', 'Install monitoring software', 'Test baseline performance', 'Gradual overclocking', 'Stress testing', 'Temperature monitoring'],
    publishedAt: '2024-12-09',
    readTime: 40,
  },
  {
    id: 'guide-7',
    title: 'Data Backup Strategies: Never Lose Your Files',
    description: 'Comprehensive guide to backing up your data with multiple strategies including cloud, local, and hybrid solutions.',
    niche: 'tech',
    difficulty: 'beginner',
    platform: ['PC', 'Mac', 'Mobile'],
    steps: ['Assess your data', 'Choose backup method', 'Set up automated backups', 'Test restore process', 'Implement 3-2-1 rule', 'Encrypt sensitive backups'],
    publishedAt: '2024-12-08',
    readTime: 18,
  },
  {
    id: 'guide-8',
    title: 'SSD vs HDD: Choosing the Right Storage',
    description: 'Compare SSDs and HDDs to make the best storage choice for your needs, budget, and use case.',
    niche: 'tech',
    difficulty: 'beginner',
    platform: ['PC'],
    steps: ['Understand differences', 'Compare speed and capacity', 'Consider cost per GB', 'Choose for your use case', 'Installation guide'],
    publishedAt: '2024-12-07',
    readTime: 15,
  },
  {
    id: 'guide-9',
    title: 'Dual Boot Windows and Linux: Complete Setup Guide',
    description: 'Learn how to install both Windows and Linux on the same computer and choose between them at startup.',
    niche: 'tech',
    difficulty: 'intermediate',
    platform: ['PC'],
    steps: ['Backup your data', 'Partition your drive', 'Install Windows first', 'Install Linux', 'Configure boot loader', 'Test both systems'],
    publishedAt: '2024-12-06',
    readTime: 30,
  },
  {
    id: 'guide-10',
    title: 'Building a Home Server: NAS Setup Guide',
    description: 'Transform an old PC into a network-attached storage server for file sharing, media streaming, and backups.',
    niche: 'tech',
    difficulty: 'intermediate',
    platform: ['PC'],
    steps: ['Choose hardware', 'Select NAS OS', 'Install operating system', 'Configure network shares', 'Set up remote access', 'Enable media streaming'],
    publishedAt: '2024-12-05',
    readTime: 45,
  },
  
  // Security Guides
  {
    id: 'guide-2',
    title: 'Securing Your Gaming Accounts: Ultimate Protection Guide',
    description: 'Protect your gaming accounts from hackers with these essential security measures including 2FA, password management, and breach monitoring.',
    niche: 'security',
    difficulty: 'beginner',
    platform: ['PC', 'Console', 'Mobile'],
    steps: ['Enable 2FA', 'Use unique passwords', 'Check for breaches', 'Secure email', 'Monitor activity', 'Use password manager', 'Review app permissions'],
    publishedAt: '2024-12-08',
    readTime: 15,
  },
  {
    id: 'guide-11',
    title: 'Setting Up a VPN: Privacy and Security Guide',
    description: 'Complete guide to choosing, installing, and configuring a VPN for enhanced privacy and security online.',
    niche: 'security',
    difficulty: 'beginner',
    platform: ['PC', 'Mac', 'Mobile'],
    steps: ['Choose VPN provider', 'Sign up and download', 'Install VPN client', 'Configure settings', 'Test connection', 'Enable kill switch', 'Set up auto-connect'],
    publishedAt: '2024-12-13',
    readTime: 20,
  },
  {
    id: 'guide-12',
    title: 'Password Manager Setup: Secure Your Digital Life',
    description: 'Learn how to set up and use a password manager to generate, store, and manage strong passwords for all your accounts.',
    niche: 'security',
    difficulty: 'beginner',
    platform: ['PC', 'Mac', 'Mobile'],
    steps: ['Choose password manager', 'Create master password', 'Install browser extension', 'Import existing passwords', 'Generate new passwords', 'Enable 2FA', 'Set up emergency access'],
    publishedAt: '2024-12-12',
    readTime: 25,
  },
  {
    id: 'guide-13',
    title: 'Two-Factor Authentication: Complete Setup Guide',
    description: 'Enable 2FA on all your important accounts to add an extra layer of security beyond passwords.',
    niche: 'security',
    difficulty: 'beginner',
    platform: ['PC', 'Mac', 'Mobile'],
    steps: ['Choose 2FA method', 'Install authenticator app', 'Enable 2FA on accounts', 'Save backup codes', 'Test 2FA setup', 'Set up recovery options'],
    publishedAt: '2024-12-11',
    readTime: 18,
  },
  {
    id: 'guide-14',
    title: 'Browser Security: Hardening Chrome, Firefox, and Edge',
    description: 'Secure your web browser with privacy extensions, security settings, and best practices to protect against malware and tracking.',
    niche: 'security',
    difficulty: 'intermediate',
    platform: ['PC', 'Mac'],
    steps: ['Update browser', 'Configure privacy settings', 'Install security extensions', 'Disable unnecessary features', 'Clear cookies regularly', 'Use private browsing', 'Enable HTTPS-only mode'],
    publishedAt: '2024-12-10',
    readTime: 22,
  },
  {
    id: 'guide-15',
    title: 'Email Security: Protecting Against Phishing',
    description: 'Learn to identify and protect yourself from phishing attacks, email scams, and malicious attachments.',
    niche: 'security',
    difficulty: 'beginner',
    platform: ['PC', 'Mac', 'Mobile'],
    steps: ['Recognize phishing signs', 'Verify sender identity', 'Check URLs carefully', 'Avoid suspicious attachments', 'Enable email filtering', 'Report phishing attempts', 'Use email encryption'],
    publishedAt: '2024-12-09',
    readTime: 16,
  },
  {
    id: 'guide-16',
    title: 'Wi-Fi Security: Securing Your Home Network',
    description: 'Protect your home Wi-Fi network from unauthorized access and attacks with proper configuration and security measures.',
    niche: 'security',
    difficulty: 'intermediate',
    platform: ['PC', 'Mobile'],
    steps: ['Change default router password', 'Enable WPA3 encryption', 'Hide SSID', 'Set up guest network', 'Disable WPS', 'Enable firewall', 'Update router firmware', 'Monitor connected devices'],
    publishedAt: '2024-12-08',
    readTime: 20,
  },
  {
    id: 'guide-17',
    title: 'Malware Removal: Complete Cleanup Guide',
    description: 'Step-by-step guide to identifying, removing, and preventing malware infections on your computer.',
    niche: 'security',
    difficulty: 'intermediate',
    platform: ['PC', 'Mac'],
    steps: ['Identify malware symptoms', 'Boot into safe mode', 'Run antivirus scan', 'Use malware removal tools', 'Clean registry', 'Reset browser settings', 'Change all passwords', 'Prevent future infections'],
    publishedAt: '2024-12-07',
    readTime: 30,
  },
  
  // Gaming Guides
  {
    id: 'guide-3',
    title: 'Mastering Competitive FPS: Pro Player Techniques',
    description: 'Learn the techniques used by professional FPS players to improve your aim, movement, game sense, and overall performance.',
    niche: 'gaming',
    difficulty: 'advanced',
    platform: ['PC'],
    steps: ['Crosshair placement', 'Movement mechanics', 'Map awareness', 'Economy management', 'Team communication', 'Aim training', 'Review gameplay'],
    publishedAt: '2024-12-05',
    readTime: 30,
  },
  {
    id: 'guide-18',
    title: 'Optimizing Gaming Performance: FPS Boost Guide',
    description: 'Maximize your gaming performance with settings optimization, driver updates, and system tweaks for higher FPS.',
    niche: 'gaming',
    difficulty: 'intermediate',
    platform: ['PC'],
    steps: ['Update GPU drivers', 'Optimize in-game settings', 'Adjust Windows settings', 'Close background apps', 'Enable game mode', 'Overclock GPU', 'Monitor temperatures'],
    publishedAt: '2024-12-14',
    readTime: 25,
  },
  {
    id: 'guide-19',
    title: 'Streaming Setup: OBS Configuration Guide',
    description: 'Set up OBS Studio for professional-quality game streaming with optimal settings for Twitch, YouTube, and other platforms.',
    niche: 'gaming',
    difficulty: 'intermediate',
    platform: ['PC'],
    steps: ['Download OBS Studio', 'Configure video settings', 'Set up audio sources', 'Add scenes and sources', 'Configure stream settings', 'Set up overlays', 'Test stream quality'],
    publishedAt: '2024-12-13',
    readTime: 35,
  },
  {
    id: 'guide-20',
    title: 'Gaming Mouse and Keyboard Setup: Pro Configuration',
    description: 'Configure your gaming peripherals for optimal performance with DPI settings, key bindings, and macro setup.',
    niche: 'gaming',
    difficulty: 'beginner',
    platform: ['PC'],
    steps: ['Install peripheral software', 'Configure DPI settings', 'Set up key bindings', 'Create macros', 'Adjust RGB lighting', 'Calibrate mouse pad', 'Test in-game'],
    publishedAt: '2024-12-12',
    readTime: 20,
  },
  {
    id: 'guide-21',
    title: 'Building a Gaming Setup on a Budget',
    description: 'Create an impressive gaming setup without breaking the bank with smart component choices and DIY solutions.',
    niche: 'gaming',
    difficulty: 'beginner',
    platform: ['PC'],
    steps: ['Set budget', 'Prioritize components', 'Choose value parts', 'DIY desk setup', 'Cable management', 'Lighting on budget', 'Optimize space'],
    publishedAt: '2024-12-11',
    readTime: 22,
  },
  {
    id: 'guide-22',
    title: 'Gaming Monitor Setup: Calibration and Settings',
    description: 'Calibrate your gaming monitor for accurate colors, optimal refresh rates, and reduced input lag.',
    niche: 'gaming',
    difficulty: 'intermediate',
    platform: ['PC'],
    steps: ['Adjust refresh rate', 'Configure color settings', 'Enable G-Sync/FreeSync', 'Reduce input lag', 'Calibrate brightness', 'Set up multiple monitors', 'Test gaming performance'],
    publishedAt: '2024-12-10',
    readTime: 18,
  },
  {
    id: 'guide-23',
    title: 'Recording Gameplay: Best Practices and Tools',
    description: 'Learn how to record high-quality gameplay footage for content creation, analysis, and sharing.',
    niche: 'gaming',
    difficulty: 'beginner',
    platform: ['PC', 'Console'],
    steps: ['Choose recording software', 'Configure recording settings', 'Set up hotkeys', 'Optimize file size', 'Edit recordings', 'Export in right format', 'Share your content'],
    publishedAt: '2024-12-09',
    readTime: 20,
  },
  {
    id: 'guide-24',
    title: 'Gaming Network Optimization: Reduce Lag',
    description: 'Optimize your network settings to reduce latency, packet loss, and improve online gaming performance.',
    niche: 'gaming',
    difficulty: 'intermediate',
    platform: ['PC', 'Console'],
    steps: ['Test connection speed', 'Use wired connection', 'Configure QoS settings', 'Port forwarding', 'Optimize router settings', 'Use gaming VPN', 'Monitor network performance'],
    publishedAt: '2024-12-08',
    readTime: 25,
  },
];

export const mockTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'Bitwarden',
    description: 'Open-source password manager trusted by millions.',
    url: 'https://bitwarden.com',
    isAffiliate: true,
    niche: 'security',
  },
  {
    id: 'tool-2',
    name: 'MSI Afterburner',
    description: 'Free GPU overclocking and monitoring utility.',
    url: 'https://msi.com/afterburner',
    isAffiliate: false,
    niche: 'tech',
  },
  {
    id: 'tool-3',
    name: 'Discord',
    description: 'Voice, video, and text communication platform for gamers.',
    url: 'https://discord.com',
    isAffiliate: false,
    niche: 'gaming',
  },
];
