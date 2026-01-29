/**
 * Tutorial type and mock data for the Tutorials page.
 */

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: 'tech' | 'security' | 'gaming';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  os: ('windows' | 'macos' | 'linux')[];
  tags: string[];
  readTime: number;
  steps: string[];
  imageUrl?: string;
  featured?: boolean;
  views?: number;
};

export const mockTutorials: Tutorial[] = [
  {
    id: 'fix-slow-windows-startup',
    title: 'Fix Slow Windows Startup',
    description: 'Step-by-step guide to reduce Windows boot time by disabling unnecessary startup programs and services.',
    slug: 'fix-slow-windows-startup',
    category: 'tech',
    difficulty: 'beginner',
    os: ['windows'],
    tags: ['windows', 'startup', 'performance', 'optimization'],
    readTime: 8,
    steps: [
      'Open Task Manager (Ctrl+Shift+Esc)',
      'Go to the Startup tab',
      'Disable programs you don\'t need at startup',
      'Restart and measure boot time',
    ],
    imageUrl: '/placeholder.svg',
    featured: true,
    views: 12500,
  },
  {
    id: 'remove-malware-windows',
    title: 'Remove Malware on Windows',
    description: 'How to safely detect and remove malware using Windows Defender and recommended tools.',
    slug: 'remove-malware-windows',
    category: 'security',
    difficulty: 'intermediate',
    os: ['windows'],
    tags: ['malware', 'security', 'windows', 'defender'],
    readTime: 12,
    steps: [
      'Run Windows Security full scan',
      'Boot into Safe Mode if needed',
      'Use Malwarebytes or similar for second opinion',
      'Reset browser and clear temp files',
    ],
    imageUrl: '/placeholder.svg',
    featured: true,
    views: 8200,
  },
  {
    id: 'optimize-gaming-fps',
    title: 'Optimize FPS for Gaming',
    description: 'Improve frame rates by adjusting in-game settings, GPU drivers, and Windows power options.',
    slug: 'optimize-gaming-fps',
    category: 'gaming',
    difficulty: 'beginner',
    os: ['windows'],
    tags: ['gaming', 'fps', 'performance', 'graphics'],
    readTime: 10,
    steps: [
      'Update GPU drivers to latest',
      'Set Windows power plan to High performance',
      'Lower in-game graphics (shadows, reflections)',
      'Disable background apps while gaming',
    ],
    imageUrl: '/placeholder.svg',
    featured: false,
    views: 15400,
  },
  {
    id: 'macos-disk-permissions',
    title: 'Fix macOS Disk Permissions',
    description: 'Repair disk permissions and ownership on macOS to resolve app and folder access issues.',
    slug: 'macos-disk-permissions',
    category: 'tech',
    difficulty: 'intermediate',
    os: ['macos'],
    tags: ['macos', 'permissions', 'disk', 'terminal'],
    readTime: 6,
    steps: [
      'Open Terminal',
      'Run First Aid in Disk Utility',
      'Use chown/chmod if needed for specific folders',
      'Restart and verify',
    ],
    imageUrl: '/placeholder.svg',
    featured: false,
    views: 4200,
  },
  {
    id: 'secure-wifi-router',
    title: 'Secure Your Home Wi-Fi Router',
    description: 'Change default credentials, enable WPA3, and lock down your router for better security.',
    slug: 'secure-wifi-router',
    category: 'security',
    difficulty: 'beginner',
    os: ['windows', 'macos', 'linux'],
    tags: ['wifi', 'router', 'security', 'network'],
    readTime: 15,
    steps: [
      'Log in to router admin (often 192.168.1.1)',
      'Change default admin password',
      'Enable WPA3 or WPA2 and strong passphrase',
      'Disable WPS and remote admin if not needed',
    ],
    imageUrl: '/placeholder.svg',
    featured: true,
    views: 6800,
  },
  {
    id: 'linux-dual-boot',
    title: 'Dual Boot Linux with Windows',
    description: 'Install Ubuntu or another distro alongside Windows without losing data.',
    slug: 'linux-dual-boot',
    category: 'tech',
    difficulty: 'advanced',
    os: ['windows', 'linux'],
    tags: ['linux', 'dual boot', 'ubuntu', 'windows'],
    readTime: 25,
    steps: [
      'Back up data and create Windows recovery drive',
      'Shrink Windows partition to free space',
      'Create bootable USB and install Linux',
      'Configure GRUB bootloader',
    ],
    imageUrl: '/placeholder.svg',
    featured: false,
    views: 3100,
  },
];
