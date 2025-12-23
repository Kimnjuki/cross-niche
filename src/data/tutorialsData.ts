// Extended Tutorial type
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'tech' | 'security' | 'gaming';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  os: ('windows' | 'macos' | 'linux' | 'all')[];
  readTime: number;
  steps: string[];
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  views?: number;
  completed?: boolean;
  featured?: boolean;
}

// Mock tutorials data
export const mockTutorials: Tutorial[] = [
  // Tech Tutorials
  {
    id: 'tut-tech-1',
    title: 'Fix Slow Windows Startup: Complete Optimization Guide',
    description: 'Speed up your Windows PC boot time with these proven optimization techniques.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows'],
    readTime: 12,
    steps: [
      'Disable unnecessary startup programs',
      'Update Windows and drivers',
      'Run disk cleanup and defragmentation',
      'Disable fast startup if causing issues',
      'Check for malware and bloatware',
      'Optimize Windows services'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    tags: ['Windows', 'Performance', 'Optimization'],
    views: 1250,
    featured: true
  },
  {
    id: 'tut-tech-2',
    title: 'macOS Ventura/Sonoma: Fix Wi-Fi Connection Issues',
    description: 'Resolve common Wi-Fi connectivity problems on macOS with step-by-step troubleshooting.',
    category: 'tech',
    difficulty: 'intermediate',
    os: ['macos'],
    readTime: 8,
    steps: [
      'Reset network settings',
      'Delete Wi-Fi preferences',
      'Reset DNS cache',
      'Check router compatibility',
      'Update macOS to latest version',
      'Reset SMC and NVRAM'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    tags: ['macOS', 'Wi-Fi', 'Networking'],
    views: 890
  },
  {
    id: 'tut-tech-3',
    title: 'Linux: Fix "Permission Denied" Errors',
    description: 'Master Linux file permissions and resolve common access issues.',
    category: 'tech',
    difficulty: 'intermediate',
    os: ['linux'],
    readTime: 10,
    steps: [
      'Understand chmod and chown commands',
      'Check current file permissions',
      'Fix ownership issues',
      'Set proper directory permissions',
      'Use sudo appropriately',
      'Configure user groups correctly'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    tags: ['Linux', 'Permissions', 'Terminal'],
    views: 2100
  },
  {
    id: 'tut-tech-4',
    title: 'Fix Blue Screen of Death (BSOD) on Windows',
    description: 'Diagnose and fix Windows blue screen errors with comprehensive troubleshooting steps.',
    category: 'tech',
    difficulty: 'advanced',
    os: ['windows'],
    readTime: 20,
    steps: [
      'Note the error code and message',
      'Boot into Safe Mode',
      'Check Windows Event Viewer',
      'Update or rollback drivers',
      'Run memory diagnostics',
      'Check disk for errors',
      'Restore system to previous point',
      'Update Windows and BIOS'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    tags: ['Windows', 'BSOD', 'Troubleshooting'],
    views: 3400,
    featured: true
  },
  {
    id: 'tut-tech-5',
    title: 'macOS: Fix "Application Not Responding" Issues',
    description: 'Resolve frozen applications and improve macOS stability.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['macos'],
    readTime: 6,
    steps: [
      'Force quit unresponsive apps',
      'Check Activity Monitor',
      'Clear application cache',
      'Restart affected applications',
      'Update macOS and apps',
      'Free up disk space'
    ],
    tags: ['macOS', 'Performance', 'Troubleshooting'],
    views: 1500
  },
  {
    id: 'tut-tech-6',
    title: 'Linux: Fix Package Manager Errors (apt/yum/dnf)',
    description: 'Resolve common package installation and update errors on Linux distributions.',
    category: 'tech',
    difficulty: 'intermediate',
    os: ['linux'],
    readTime: 15,
    steps: [
      'Update package lists',
      'Fix broken dependencies',
      'Clear package cache',
      'Resolve GPG key issues',
      'Fix repository errors',
      'Reinstall problematic packages'
    ],
    tags: ['Linux', 'Package Manager', 'Terminal'],
    views: 1800
  },
  
  // Security Tutorials
  {
    id: 'tut-sec-1',
    title: 'Windows: Remove Malware and Viruses Completely',
    description: 'Step-by-step guide to clean infected Windows systems and prevent reinfection.',
    category: 'security',
    difficulty: 'intermediate',
    os: ['windows'],
    readTime: 25,
    steps: [
      'Boot into Safe Mode',
      'Run Windows Defender full scan',
      'Use Malwarebytes for deep scan',
      'Remove suspicious browser extensions',
      'Check startup programs',
      'Reset browser settings',
      'Enable Windows Firewall',
      'Update all software'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    tags: ['Windows', 'Malware', 'Security'],
    views: 4200,
    featured: true
  },
  {
    id: 'tut-sec-2',
    title: 'macOS: Enable Full Disk Encryption (FileVault)',
    description: 'Protect your Mac data with FileVault encryption setup guide.',
    category: 'security',
    difficulty: 'beginner',
    os: ['macos'],
    readTime: 10,
    steps: [
      'Backup your data first',
      'Open System Settings',
      'Enable FileVault',
      'Choose recovery key option',
      'Wait for encryption to complete',
      'Store recovery key securely'
    ],
    tags: ['macOS', 'Encryption', 'Security'],
    views: 2100
  },
  {
    id: 'tut-sec-3',
    title: 'Linux: Secure SSH Access and Disable Root Login',
    description: 'Harden your Linux server security with SSH best practices.',
    category: 'security',
    difficulty: 'advanced',
    os: ['linux'],
    readTime: 18,
    steps: [
      'Generate SSH key pair',
      'Disable password authentication',
      'Disable root login',
      'Change default SSH port',
      'Configure fail2ban',
      'Set up firewall rules',
      'Enable two-factor authentication'
    ],
    tags: ['Linux', 'SSH', 'Server Security'],
    views: 3200
  },
  {
    id: 'tut-sec-4',
    title: 'Windows: Set Up Two-Factor Authentication Everywhere',
    description: 'Enable 2FA on all your accounts and Windows for maximum security.',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'all'],
    readTime: 15,
    steps: [
      'Choose authenticator app',
      'Enable 2FA on Microsoft account',
      'Set up 2FA on email',
      'Enable 2FA on social media',
      'Enable 2FA on banking apps',
      'Backup recovery codes',
      'Test 2FA setup'
    ],
    tags: ['Windows', '2FA', 'Security'],
    views: 5600
  },
  
  // Gaming Tutorials
  {
    id: 'tut-game-1',
    title: 'Fix Low FPS and Stuttering in Games (Windows)',
    description: 'Optimize your gaming PC for smooth performance and eliminate frame drops.',
    category: 'gaming',
    difficulty: 'intermediate',
    os: ['windows'],
    readTime: 20,
    steps: [
      'Update GPU drivers',
      'Disable Windows Game Mode',
      'Optimize in-game settings',
      'Close background applications',
      'Enable high-performance power plan',
      'Disable fullscreen optimizations',
      'Update DirectX and Visual C++',
      'Check for thermal throttling'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    tags: ['Windows', 'Gaming', 'Performance'],
    views: 8900,
    featured: true
  },
  {
    id: 'tut-game-2',
    title: 'macOS: Optimize Gaming Performance on M1/M2 Macs',
    description: 'Get the best gaming experience on Apple Silicon Macs.',
    category: 'gaming',
    difficulty: 'intermediate',
    os: ['macos'],
    readTime: 12,
    steps: [
      'Use Rosetta 2 for x86 games',
      'Enable Metal performance shaders',
      'Close unnecessary apps',
      'Adjust game graphics settings',
      'Use external cooling',
      'Check for game-specific optimizations',
      'Update macOS and games'
    ],
    tags: ['macOS', 'Gaming', 'Apple Silicon'],
    views: 3400
  },
  {
    id: 'tut-game-3',
    title: 'Linux: Set Up Steam and Proton for Gaming',
    description: 'Install and configure Steam with Proton for Windows game compatibility.',
    category: 'gaming',
    difficulty: 'advanced',
    os: ['linux'],
    readTime: 25,
    steps: [
      'Install Steam via package manager',
      'Enable Steam Play and Proton',
      'Install graphics drivers',
      'Configure Proton version',
      'Set up game-specific launch options',
      'Install required libraries',
      'Optimize performance settings'
    ],
    tags: ['Linux', 'Steam', 'Proton'],
    views: 4500
  },
  {
    id: 'tut-game-4',
    title: 'Fix Game Controller Not Working (All Platforms)',
    description: 'Troubleshoot and fix controller connection issues across Windows, macOS, and Linux.',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 10,
    steps: [
      'Check controller connection',
      'Update controller drivers',
      'Test controller in system settings',
      'Configure Steam controller settings',
      'Check game controller support',
      'Try different USB port/cable',
      'Reset controller if wireless'
    ],
    tags: ['Gaming', 'Controllers', 'Troubleshooting'],
    views: 6700
  },
  {
    id: 'tut-game-5',
    title: 'Windows: Fix Game Crashes and Freezes',
    description: 'Resolve game crashes, freezes, and compatibility issues on Windows.',
    category: 'gaming',
    difficulty: 'intermediate',
    os: ['windows'],
    readTime: 18,
    steps: [
      'Update graphics drivers',
      'Run game as administrator',
      'Disable fullscreen optimizations',
      'Check Windows Event Viewer',
      'Verify game files integrity',
      'Disable overlays (Discord, Steam)',
      'Check for Windows updates',
      'Lower graphics settings'
    ],
    tags: ['Windows', 'Gaming', 'Troubleshooting'],
    views: 7200
  },
  {
    id: 'tut-game-6',
    title: 'Optimize Network Settings for Online Gaming',
    description: 'Reduce lag and improve connection stability for competitive gaming.',
    category: 'gaming',
    difficulty: 'advanced',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 15,
    steps: [
      'Use wired connection when possible',
      'Configure QoS on router',
      'Port forward for specific games',
      'Disable Windows Update during gaming',
      'Optimize DNS settings',
      'Use gaming VPN if needed',
      'Check for packet loss',
      'Monitor network latency'
    ],
    tags: ['Gaming', 'Networking', 'Performance'],
    views: 5100
  },
  
  // Additional Tech Tutorials (to reach 10+)
  {
    id: 'tut-tech-7',
    title: 'Fix Printer Not Working: Complete Troubleshooting Guide',
    description: 'Resolve common printer issues including connectivity, driver problems, and print queue errors.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows', 'macos'],
    readTime: 12,
    steps: [
      'Check printer power and connections',
      'Restart printer and computer',
      'Clear print queue',
      'Reinstall printer drivers',
      'Check printer settings',
      'Test with different document',
      'Update printer firmware',
      'Check for paper jams'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    tags: ['Printer', 'Troubleshooting', 'Hardware'],
    views: 2800
  },
  {
    id: 'tut-tech-8',
    title: 'Fix Audio Not Working on Windows/Mac',
    description: 'Resolve sound issues including no audio, distorted sound, and device recognition problems.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows', 'macos'],
    readTime: 10,
    steps: [
      'Check volume settings',
      'Test with different audio device',
      'Update audio drivers',
      'Check audio device in settings',
      'Restart audio services',
      'Run audio troubleshooter',
      'Check for Windows/Mac updates',
      'Reinstall audio drivers'
    ],
    tags: ['Audio', 'Troubleshooting', 'Hardware'],
    views: 3200
  },
  {
    id: 'tut-tech-9',
    title: 'Recover Deleted Files: Data Recovery Guide',
    description: 'Learn how to recover accidentally deleted files from hard drives, SSDs, and external storage.',
    category: 'tech',
    difficulty: 'intermediate',
    os: ['windows', 'macos', 'linux'],
    readTime: 18,
    steps: [
      'Stop using the drive immediately',
      'Check Recycle Bin/Trash',
      'Use built-in file recovery tools',
      'Download data recovery software',
      'Scan for deleted files',
      'Preview recoverable files',
      'Recover to different drive',
      'Backup recovered files immediately'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    tags: ['Data Recovery', 'Files', 'Storage'],
    views: 4500,
    featured: true
  },
  {
    id: 'tut-tech-10',
    title: 'Extend Laptop Battery Life: Optimization Guide',
    description: 'Maximize your laptop battery lifespan and runtime with these proven optimization techniques.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux'],
    readTime: 12,
    steps: [
      'Adjust power settings',
      'Lower screen brightness',
      'Close unnecessary applications',
      'Disable background apps',
      'Use battery saver mode',
      'Calibrate battery',
      'Check battery health',
      'Optimize charging habits'
    ],
    tags: ['Battery', 'Laptop', 'Optimization'],
    views: 5600
  },
  {
    id: 'tut-tech-11',
    title: 'Set Up Dual Monitors: Complete Configuration Guide',
    description: 'Configure multiple monitors for extended desktop, productivity, and gaming setups.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux'],
    readTime: 15,
    steps: [
      'Connect second monitor',
      'Detect displays in settings',
      'Configure display arrangement',
      'Set primary display',
      'Adjust resolution and scaling',
      'Configure display mode',
      'Optimize for gaming/productivity',
      'Test multi-monitor setup'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    tags: ['Monitors', 'Setup', 'Productivity'],
    views: 3800
  },
  {
    id: 'tut-tech-12',
    title: 'Fix Internet Connection Issues: Network Troubleshooting',
    description: 'Diagnose and fix common internet connectivity problems on all operating systems.',
    category: 'tech',
    difficulty: 'intermediate',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 14,
    steps: [
      'Restart router and modem',
      'Check physical connections',
      'Run network diagnostics',
      'Reset network adapter',
      'Flush DNS cache',
      'Check firewall settings',
      'Update network drivers',
      'Contact ISP if needed'
    ],
    tags: ['Internet', 'Networking', 'Troubleshooting'],
    views: 4200
  },
  {
    id: 'tut-tech-13',
    title: 'Clean and Maintain Your PC: Hardware Maintenance',
    description: 'Keep your computer running smoothly with proper cleaning and maintenance procedures.',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 20,
    steps: [
      'Backup important data',
      'Clean dust from components',
      'Clean keyboard and mouse',
      'Clean monitor screen',
      'Organize cables',
      'Check for overheating',
      'Update all software',
      'Defragment hard drive (HDD only)'
    ],
    tags: ['Maintenance', 'Cleaning', 'PC Care'],
    views: 2900
  },
  
  // Additional Security Tutorials (to reach 10+)
  {
    id: 'tut-sec-5',
    title: 'Protect Against Phishing Attacks: Recognition Guide',
    description: 'Learn to identify and avoid phishing emails, websites, and scams that steal your credentials.',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 12,
    steps: [
      'Recognize phishing email signs',
      'Check sender email address',
      'Hover over links before clicking',
      'Look for HTTPS in URLs',
      'Verify website authenticity',
      'Never enter credentials on suspicious sites',
      'Report phishing attempts',
      'Enable email filtering'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    tags: ['Phishing', 'Email Security', 'Scams'],
    views: 6800,
    featured: true
  },
  {
    id: 'tut-sec-6',
    title: 'Create Strong Passwords: Password Security Guide',
    description: 'Learn how to create and manage strong, unique passwords for all your accounts.',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 10,
    steps: [
      'Use 12+ characters minimum',
      'Include uppercase and lowercase',
      'Add numbers and symbols',
      'Avoid personal information',
      'Use passphrase method',
      'Don\'t reuse passwords',
      'Use password manager',
      'Enable password generator'
    ],
    tags: ['Passwords', 'Security', 'Best Practices'],
    views: 7200
  },
  {
    id: 'tut-sec-7',
    title: 'Set Up VPN: Privacy and Security Guide',
    description: 'Configure a VPN to encrypt your internet connection and protect your online privacy.',
    category: 'security',
    difficulty: 'intermediate',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 15,
    steps: [
      'Choose reputable VPN provider',
      'Sign up and download client',
      'Install VPN software',
      'Configure VPN settings',
      'Enable kill switch',
      'Choose optimal server location',
      'Test VPN connection',
      'Enable auto-connect on startup'
    ],
    tags: ['VPN', 'Privacy', 'Encryption'],
    views: 5400
  },
  {
    id: 'tut-sec-8',
    title: 'Secure Your Social Media Accounts',
    description: 'Protect your personal information and accounts on Facebook, Twitter, Instagram, and more.',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 12,
    steps: [
      'Enable two-factor authentication',
      'Review privacy settings',
      'Limit public information',
      'Check app permissions',
      'Review login activity',
      'Use strong passwords',
      'Be cautious with third-party apps',
      'Regularly review friend lists'
    ],
    tags: ['Social Media', 'Privacy', 'Security'],
    views: 4900
  },
  {
    id: 'tut-sec-9',
    title: 'Safe Online Shopping: Fraud Prevention',
    description: 'Protect yourself from online shopping scams and ensure secure transactions.',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 10,
    steps: [
      'Verify website authenticity',
      'Look for HTTPS and padlock icon',
      'Check seller reviews and ratings',
      'Use secure payment methods',
      'Avoid public Wi-Fi for purchases',
      'Keep receipts and confirmations',
      'Monitor bank statements',
      'Report suspicious activity'
    ],
    tags: ['Online Shopping', 'Fraud', 'Security'],
    views: 3600
  },
  {
    id: 'tut-sec-10',
    title: 'Windows: Configure Firewall for Maximum Security',
    description: 'Set up and optimize Windows Firewall to block unauthorized access while allowing legitimate traffic.',
    category: 'security',
    difficulty: 'intermediate',
    os: ['windows'],
    readTime: 14,
    steps: [
      'Open Windows Firewall settings',
      'Enable firewall for all networks',
      'Configure inbound rules',
      'Configure outbound rules',
      'Allow specific applications',
      'Block suspicious programs',
      'Enable notifications',
      'Test firewall configuration'
    ],
    tags: ['Windows', 'Firewall', 'Security'],
    views: 3100
  },
  {
    id: 'tut-sec-11',
    title: 'Recognize and Report Online Scams',
    description: 'Identify common online scams and learn how to report them to protect yourself and others.',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 11,
    steps: [
      'Recognize common scam types',
      'Identify red flags',
      'Verify before responding',
      'Never share personal information',
      'Don\'t click suspicious links',
      'Report to authorities',
      'Report to platform',
      'Warn others about scams'
    ],
    tags: ['Scams', 'Fraud', 'Reporting'],
    views: 2800
  },
  {
    id: 'tut-sec-12',
    title: 'macOS: Enable Gatekeeper and System Integrity Protection',
    description: 'Strengthen macOS security with Gatekeeper and SIP to prevent unauthorized software execution.',
    category: 'security',
    difficulty: 'intermediate',
    os: ['macos'],
    readTime: 16,
    steps: [
      'Understand Gatekeeper function',
      'Configure Gatekeeper settings',
      'Enable System Integrity Protection',
      'Manage app security settings',
      'Allow apps from identified developers',
      'Review security preferences',
      'Test security settings',
      'Monitor security alerts'
    ],
    tags: ['macOS', 'Security', 'Gatekeeper'],
    views: 2400
  },
  
  // Additional Gaming Tutorials (to reach 10+)
  {
    id: 'tut-game-7',
    title: 'Fix Audio Issues in Games: Complete Guide',
    description: 'Resolve common audio problems including no sound, distorted audio, and microphone issues in games.',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 12,
    steps: [
      'Check in-game audio settings',
      'Verify system audio is working',
      'Update audio drivers',
      'Check audio device selection',
      'Disable audio enhancements',
      'Test with different games',
      'Check for audio conflicts',
      'Reinstall audio drivers if needed'
    ],
    tags: ['Gaming', 'Audio', 'Troubleshooting'],
    views: 3800
  },
  {
    id: 'tut-game-8',
    title: 'Update Graphics Drivers: Performance Boost Guide',
    description: 'Keep your GPU drivers updated for best gaming performance and compatibility with latest games.',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['windows'],
    readTime: 10,
    steps: [
      'Identify your graphics card',
      'Download latest drivers from manufacturer',
      'Uninstall old drivers (optional)',
      'Install new drivers',
      'Restart computer',
      'Verify driver installation',
      'Configure driver settings',
      'Test game performance'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587145911000-ad7141f1510e?w=800',
    tags: ['Gaming', 'Drivers', 'Performance'],
    views: 9200,
    featured: true
  },
  {
    id: 'tut-game-9',
    title: 'Set Up Game Streaming: OBS and Twitch Guide',
    description: 'Configure OBS Studio for professional-quality game streaming on Twitch, YouTube, and other platforms.',
    category: 'gaming',
    difficulty: 'intermediate',
    os: ['windows', 'macos'],
    readTime: 25,
    steps: [
      'Download and install OBS Studio',
      'Configure video settings',
      'Set up audio sources',
      'Add game capture source',
      'Configure stream settings',
      'Set up stream key',
      'Add overlays and alerts',
      'Test stream quality',
      'Go live and monitor performance'
    ],
    tags: ['Streaming', 'OBS', 'Twitch'],
    views: 6400
  },
  {
    id: 'tut-game-10',
    title: 'Fix Multiplayer Connection Issues',
    description: 'Resolve common multiplayer connectivity problems including NAT issues, port forwarding, and server connection errors.',
    category: 'gaming',
    difficulty: 'intermediate',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 18,
    steps: [
      'Check internet connection',
      'Test NAT type',
      'Configure port forwarding',
      'Enable UPnP on router',
      'Check firewall settings',
      'Verify game server status',
      'Test with different servers',
      'Contact ISP if needed'
    ],
    tags: ['Multiplayer', 'Networking', 'Troubleshooting'],
    views: 5700
  },
  {
    id: 'tut-game-11',
    title: 'Back Up Game Saves: Never Lose Progress',
    description: 'Learn how to backup and restore game saves across Steam, Epic, and other platforms.',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux'],
    readTime: 12,
    steps: [
      'Locate game save folders',
      'Enable cloud saves (Steam, Epic)',
      'Manually backup save files',
      'Use save file managers',
      'Backup to external drive',
      'Backup to cloud storage',
      'Test restore process',
      'Set up automatic backups'
    ],
    tags: ['Game Saves', 'Backup', 'Steam'],
    views: 4100
  },
  {
    id: 'tut-game-12',
    title: 'Set Up Parental Controls on Gaming Consoles',
    description: 'Configure parental controls on PlayStation, Xbox, and Nintendo Switch to manage children\'s gaming.',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['all'],
    readTime: 15,
    steps: [
      'Access parental control settings',
      'Set age restrictions',
      'Configure play time limits',
      'Restrict online features',
      'Block inappropriate content',
      'Set spending limits',
      'Monitor activity',
      'Test parental controls'
    ],
    tags: ['Parental Controls', 'Consoles', 'Safety'],
    views: 3300
  },
  {
    id: 'tut-game-13',
    title: 'Fix VR Setup Issues: Oculus, SteamVR Guide',
    description: 'Troubleshoot common virtual reality setup problems and optimize VR performance.',
    category: 'gaming',
    difficulty: 'advanced',
    os: ['windows'],
    readTime: 22,
    steps: [
      'Check system requirements',
      'Install VR software',
      'Set up tracking sensors',
      'Calibrate room scale',
      'Adjust IPD settings',
      'Optimize performance settings',
      'Fix tracking issues',
      'Resolve motion sickness'
    ],
    tags: ['VR', 'Oculus', 'SteamVR'],
    views: 2900
  },
  {
    id: 'tut-game-14',
    title: 'Install Mods Safely: Modding Guide',
    description: 'Learn how to safely install and manage game mods without breaking your games.',
    category: 'gaming',
    difficulty: 'intermediate',
    os: ['windows', 'macos', 'linux'],
    readTime: 16,
    steps: [
      'Backup game files',
      'Use mod managers when possible',
      'Download from trusted sources',
      'Check mod compatibility',
      'Read installation instructions',
      'Install mods in correct order',
      'Test game after modding',
      'Manage mod conflicts'
    ],
    tags: ['Mods', 'Modding', 'Gaming'],
    views: 4800
  },
  {
    id: 'tut-game-15',
    title: 'Recover Hacked Gaming Account: Recovery Guide',
    description: 'Steps to recover a compromised gaming account and prevent future hacks.',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux', 'all'],
    readTime: 14,
    steps: [
      'Identify account compromise',
      'Change password immediately',
      'Enable two-factor authentication',
      'Contact game support',
      'Provide account information',
      'Secure email account',
      'Review account activity',
      'Prevent future hacks'
    ],
    tags: ['Account Security', 'Recovery', 'Gaming'],
    views: 3600
  },
  {
    id: 'tut-game-16',
    title: 'Optimize Settings for Esports Gaming',
    description: 'Configure your system and games for competitive esports with optimal settings and performance tweaks.',
    category: 'gaming',
    difficulty: 'advanced',
    os: ['windows'],
    readTime: 20,
    steps: [
      'Disable Windows Game Mode',
      'Optimize mouse settings',
      'Configure keyboard settings',
      'Set up monitor for low input lag',
      'Optimize network settings',
      'Configure game settings',
      'Disable unnecessary overlays',
      'Test and fine-tune settings'
    ],
    tags: ['Esports', 'Competitive', 'Optimization'],
    views: 5200
  }
];


