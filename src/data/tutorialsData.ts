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
  }
];


