/**
 * Comprehensive How-To Guides for Tech, Security, and Gaming
 * Based on most searched questions and queries
 */

export interface HowToGuide {
  id: string;
  title: string;
  description: string;
  category: 'tech' | 'security' | 'gaming';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  searchQuery: string; // The actual search query this solves
  uniqueTrick?: string; // Unique approach or trick
  comparison?: {
    traditional: string;
    modern: string;
    advantage: string;
  };
  steps: Array<{
    title: string;
    description: string;
    tip?: string;
  }>;
  prerequisites: string[];
  tools: string[];
  tags: string[];
}

export const howToGuides: HowToGuide[] = [
  // TECH GUIDES
  {
    id: 'how-to-speed-up-windows-11',
    title: 'How to Speed Up Windows 11: 10 Proven Methods (2026)',
    description: 'Learn unique tricks to optimize Windows 11 performance beyond basic settings. Includes modern SSD optimization, memory management, and startup optimization techniques.',
    category: 'tech',
    difficulty: 'beginner',
    readTime: 8,
    searchQuery: 'how to speed up windows 11',
    uniqueTrick: 'Use Windows 11\'s built-in efficiency mode combined with modern SSD TRIM optimization for 40% faster boot times',
    comparison: {
      traditional: 'Disabling startup programs manually',
      modern: 'Using Windows 11 Efficiency Mode + SSD optimization',
      advantage: '40% faster boot, better battery life, automatic optimization'
    },
    steps: [
      {
        title: 'Enable Efficiency Mode',
        description: 'Open Task Manager (Ctrl+Shift+Esc), right-click background processes, select "Efficiency mode". This reduces CPU usage by 20-30% without affecting performance.',
        tip: 'Focus on apps you rarely use but keep running in background'
      },
      {
        title: 'Optimize SSD with TRIM',
        description: 'Open Command Prompt as Admin, run: fsutil behavior set DisableDeleteNotify 0. This enables TRIM for automatic SSD optimization.',
        tip: 'Modern SSDs benefit significantly from TRIM - it prevents slowdown over time'
      },
      {
        title: 'Disable Visual Effects',
        description: 'System Properties > Advanced > Performance Settings > Adjust for best performance. This frees up GPU resources.',
      },
      {
        title: 'Clean Temporary Files',
        description: 'Use Storage Sense (Settings > System > Storage) to automatically clean temp files. Set to run weekly.',
      },
      {
        title: 'Optimize Startup Programs',
        description: 'Task Manager > Startup tab. Disable non-essential apps. Keep only antivirus and essential system tools.',
      },
      {
        title: 'Update Drivers',
        description: 'Use Windows Update or manufacturer tools. Outdated drivers can cause 15-20% performance loss.',
      },
      {
        title: 'Enable Fast Startup',
        description: 'Power Options > Choose what power buttons do > Enable fast startup. Reduces boot time by 30-50%.',
      },
      {
        title: 'Disable Unnecessary Services',
        description: 'Services.msc > Disable Windows Search, Superfetch (if on SSD), and other non-essential services.',
      },
      {
        title: 'Use Storage Spaces Optimization',
        description: 'Defragment and Optimize Drives > Optimize. For SSDs, this runs TRIM. For HDDs, defragmentation.',
      },
      {
        title: 'Monitor Performance',
        description: 'Use Task Manager and Resource Monitor to identify bottlenecks. Address high CPU/memory usage apps.',
      },
    ],
    prerequisites: ['Windows 11 installed', 'Administrator access'],
    tools: ['Task Manager', 'Command Prompt', 'Storage Sense'],
    tags: ['windows 11', 'performance', 'optimization', 'speed', 'ssd'],
  },
  {
    id: 'how-to-fix-slow-internet',
    title: 'How to Fix Slow Internet: Advanced Troubleshooting Guide',
    description: 'Unique methods to diagnose and fix slow internet connections. Includes DNS optimization, router placement tricks, and bandwidth management.',
    category: 'tech',
    difficulty: 'intermediate',
    readTime: 12,
    searchQuery: 'how to fix slow internet connection',
    uniqueTrick: 'Use Cloudflare (1.1.1.1) or Google DNS (8.8.8.8) for 20-30% faster DNS resolution, plus optimize router channel selection',
    comparison: {
      traditional: 'Restarting router and checking speed tests',
      modern: 'DNS optimization + Channel selection + QoS configuration',
      advantage: '30-50% faster page loads, reduced latency, better streaming'
    },
    steps: [
      {
        title: 'Change DNS Servers',
        description: 'Network Settings > Change adapter options > Right-click connection > Properties > IPv4 > Use custom DNS: 1.1.1.1 (Cloudflare) or 8.8.8.8 (Google).',
        tip: 'Cloudflare DNS is fastest globally, Google DNS is most reliable'
      },
      {
        title: 'Optimize Router Channel',
        description: 'Access router admin (usually 192.168.1.1), go to Wireless settings, change channel to least congested (use WiFi analyzer app).',
        tip: 'Channels 1, 6, 11 are non-overlapping for 2.4GHz. Use 5GHz for less interference'
      },
      {
        title: 'Enable QoS (Quality of Service)',
        description: 'Router settings > QoS > Enable and prioritize gaming/work devices. This ensures critical traffic gets bandwidth priority.',
      },
      {
        title: 'Update Router Firmware',
        description: 'Router admin > Firmware update. Latest firmware often includes performance improvements and security fixes.',
      },
      {
        title: 'Optimize Router Placement',
        description: 'Place router centrally, elevated, away from walls and metal objects. Use 5GHz band for devices close to router.',
        tip: 'Router height matters - place at least 3 feet high for better coverage'
      },
      {
        title: 'Check for Interference',
        description: 'Move router away from microwaves, Bluetooth devices, and other WiFi networks. Use WiFi analyzer to find best channel.',
      },
      {
        title: 'Limit Bandwidth-Hungry Apps',
        description: 'Task Manager > App history. Identify apps using most bandwidth. Close or limit background data usage.',
      },
      {
        title: 'Use Ethernet for Critical Devices',
        description: 'Connect gaming consoles, work computers via Ethernet cable. Wired connections are faster and more stable.',
      },
      {
        title: 'Reset Network Stack',
        description: 'Command Prompt (Admin): netsh winsock reset && netsh int ip reset. Restart computer. Fixes corrupted network settings.',
      },
      {
        title: 'Contact ISP if Issues Persist',
        description: 'If all steps fail, contact ISP. May need line repair or plan upgrade. Document speed test results.',
      },
    ],
    prerequisites: ['Router access', 'Administrator access'],
    tools: ['WiFi Analyzer app', 'Command Prompt', 'Speed test website'],
    tags: ['internet', 'wifi', 'network', 'dns', 'router', 'troubleshooting'],
  },
  {
    id: 'how-to-build-gaming-pc-2026',
    title: 'How to Build a Gaming PC: Complete Step-by-Step Guide 2026',
    description: 'Modern PC building guide with latest components, cable management tricks, and performance optimization tips. Compare budget vs premium builds.',
    category: 'tech',
    difficulty: 'intermediate',
    readTime: 25,
    searchQuery: 'how to build a gaming pc step by step',
    uniqueTrick: 'Use modular PSU and proper cable routing for better airflow - can reduce temps by 5-10°C and improve performance',
    comparison: {
      traditional: 'Basic component assembly',
      modern: 'Optimized airflow + cable management + thermal paste application',
      advantage: 'Better temps, quieter operation, longer component lifespan'
    },
    steps: [
      {
        title: 'Choose Components',
        description: 'Select CPU, GPU, RAM, motherboard, storage, PSU, and case. Ensure compatibility (check PCPartPicker). Budget: $800-1200, Mid-range: $1200-2000, High-end: $2000+',
        tip: 'For 2026, focus on DDR5 RAM, PCIe 5.0 SSDs, and RTX 40-series or RX 7000-series GPUs'
      },
      {
        title: 'Prepare Workspace',
        description: 'Work on non-conductive surface (wood table), use anti-static wristband, have Phillips screwdriver and zip ties ready.',
      },
      {
        title: 'Install CPU',
        description: 'Lift CPU socket lever, align CPU (match triangle/arrow), gently place, close lever. Apply thermal paste (pea-sized dot in center).',
        tip: 'Don\'t spread thermal paste - CPU pressure will distribute it evenly'
      },
      {
        title: 'Install CPU Cooler',
        description: 'Mount cooler bracket, apply thermal paste if not pre-applied, secure cooler with screws (cross pattern), connect fan to CPU_FAN header.',
      },
      {
        title: 'Install RAM',
        description: 'Open RAM slots, align notch, press firmly until clicks. Use slots 2 and 4 for dual-channel (check motherboard manual).',
        tip: 'DDR5 requires more force - ensure both clips click into place'
      },
      {
        title: 'Install M.2 SSD',
        description: 'Remove M.2 heatsink if present, insert SSD at 30° angle, secure with screw. Enable in BIOS if not detected.',
      },
      {
        title: 'Install Motherboard',
        description: 'Place standoffs in case, align I/O shield, lower motherboard, secure with screws (don\'t overtighten).',
      },
      {
        title: 'Install PSU',
        description: 'Mount PSU (fan facing down if bottom vent), route cables behind motherboard tray, connect 24-pin and CPU power.',
      },
      {
        title: 'Install GPU',
        description: 'Remove PCIe slot covers, insert GPU, secure with screws, connect PCIe power cables from PSU.',
        tip: 'Support bracket recommended for heavy GPUs to prevent sag'
      },
      {
        title: 'Cable Management',
        description: 'Route cables behind motherboard tray, use zip ties, keep front clear for airflow. Connect front panel headers (check manual).',
        tip: 'Good cable management improves airflow and makes future upgrades easier'
      },
      {
        title: 'Connect Peripherals',
        description: 'Connect monitor, keyboard, mouse, and power. Double-check all connections before first boot.',
      },
      {
        title: 'First Boot & BIOS',
        description: 'Power on, enter BIOS (usually Delete/F2), enable XMP for RAM, set boot order, save and exit.',
      },
      {
        title: 'Install OS',
        description: 'Boot from USB installer, install Windows/Linux, install drivers (GPU, chipset, network), update Windows.',
      },
      {
        title: 'Optimize Performance',
        description: 'Enable Game Mode, update GPU drivers, configure fan curves, run benchmarks to verify performance.',
      },
    ],
    prerequisites: ['Basic tool knowledge', 'Patience', 'Anti-static precautions'],
    tools: ['Screwdriver', 'Anti-static wristband', 'Thermal paste', 'Zip ties'],
    tags: ['pc building', 'gaming', 'hardware', 'diy', 'components', 'tutorial'],
  },
  
  // SECURITY GUIDES
  {
    id: 'how-to-protect-from-ransomware',
    title: 'How to Protect Your Computer from Ransomware Attacks (2026)',
    description: 'Comprehensive ransomware protection guide with modern techniques including zero-trust backup strategies and behavioral analysis tools.',
    category: 'security',
    difficulty: 'intermediate',
    readTime: 15,
    searchQuery: 'how to protect against ransomware attacks',
    uniqueTrick: 'Use 3-2-1 backup rule (3 copies, 2 different media, 1 offsite) + enable Controlled Folder Access for 99% protection',
    comparison: {
      traditional: 'Antivirus + manual backups',
      modern: 'Controlled Folder Access + 3-2-1 backups + behavioral detection',
      advantage: '99% protection rate, automatic recovery, zero-trust approach'
    },
    steps: [
      {
        title: 'Enable Controlled Folder Access',
        description: 'Windows Security > Virus & threat protection > Ransomware protection > Enable Controlled Folder Access. This blocks unauthorized apps from modifying protected folders.',
        tip: 'Add your important folders (Documents, Pictures, etc.) to protected list'
      },
      {
        title: 'Implement 3-2-1 Backup Strategy',
        description: '3 copies of data, 2 different storage types (cloud + external drive), 1 offsite backup. Use automated backup software.',
        tip: 'Test backups regularly - untested backups are as good as no backups'
      },
      {
        title: 'Keep Software Updated',
        description: 'Enable automatic updates for OS, browsers, and all software. Most ransomware exploits known vulnerabilities.',
      },
      {
        title: 'Use Strong, Unique Passwords',
        description: 'Use password manager (Bitwarden, 1Password). Enable 2FA everywhere possible. Never reuse passwords.',
      },
      {
        title: 'Be Cautious with Email',
        description: 'Don\'t open suspicious attachments or links. Verify sender identity. Use email security tools.',
        tip: 'Ransomware often spreads via phishing emails - when in doubt, verify'
      },
      {
        title: 'Use Antivirus with Behavioral Detection',
        description: 'Install reputable antivirus (Windows Defender + Malwarebytes). Enable real-time protection and behavioral analysis.',
      },
      {
        title: 'Disable RDP if Not Needed',
        description: 'Remote Desktop Protocol is a common attack vector. Disable if not using: System Properties > Remote > Uncheck Remote Desktop.',
      },
      {
        title: 'Use Application Whitelisting',
        description: 'Only allow trusted applications to run. Use Windows AppLocker or third-party solutions for advanced control.',
      },
      {
        title: 'Network Segmentation',
        description: 'Separate critical systems from general network. Use VLANs and firewalls to limit lateral movement.',
        tip: 'If ransomware infects one system, segmentation prevents spread'
      },
      {
        title: 'Create Recovery Plan',
        description: 'Document recovery procedures, keep offline backup, test restore process. Know who to contact if attacked.',
      },
    ],
    prerequisites: ['Windows 10/11', 'Administrator access'],
    tools: ['Windows Security', 'Backup software', 'Password manager'],
    tags: ['ransomware', 'security', 'backup', 'protection', 'cybersecurity'],
  },
  {
    id: 'how-to-secure-wifi-network',
    title: 'How to Secure Your WiFi Network: Complete Security Guide',
    description: 'Advanced WiFi security techniques including WPA3 setup, MAC filtering, and network isolation for maximum protection.',
    category: 'security',
    difficulty: 'intermediate',
    readTime: 10,
    searchQuery: 'how to secure wifi network',
    uniqueTrick: 'Enable WPA3 + MAC filtering + Guest network isolation = enterprise-grade security for home networks',
    comparison: {
      traditional: 'WPA2 password protection',
      modern: 'WPA3 + MAC filtering + Guest isolation + Regular password rotation',
      advantage: '99.9% protection against unauthorized access, encrypted traffic'
    },
    steps: [
      {
        title: 'Enable WPA3 Encryption',
        description: 'Router admin > Wireless Security > Select WPA3 (or WPA2/WPA3 mixed mode). This is the latest, most secure encryption.',
        tip: 'Older devices may need WPA2/WPA3 mixed mode for compatibility'
      },
      {
        title: 'Change Default Admin Password',
        description: 'Router admin > Administration > Change admin password. Use strong, unique password stored in password manager.',
      },
      {
        title: 'Use Strong WiFi Password',
        description: 'Wireless Security > Change password to 20+ character random password. Include uppercase, lowercase, numbers, symbols.',
        tip: 'Use password generator - don\'t use personal information or dictionary words'
      },
      {
        title: 'Change SSID Name',
        description: 'Wireless Settings > Change SSID. Don\'t use personal information. Generic names are safer.',
      },
      {
        title: 'Enable MAC Address Filtering',
        description: 'Wireless MAC Filtering > Enable > Add allowed devices. Only whitelisted devices can connect.',
        tip: 'Find MAC addresses in device network settings or router connected devices list'
      },
      {
        title: 'Disable WPS',
        description: 'Wireless Settings > Disable WPS. WPS is vulnerable to brute force attacks.',
      },
      {
        title: 'Enable Guest Network',
        description: 'Guest Network > Enable > Separate SSID and password. Isolate from main network. Use for visitors.',
        tip: 'Guest network prevents visitors from accessing your main network devices'
      },
      {
        title: 'Update Router Firmware',
        description: 'Administration > Firmware Update > Check for updates. Latest firmware includes security patches.',
      },
      {
        title: 'Disable Remote Management',
        description: 'Administration > Remote Management > Disable. Prevents external access to router settings.',
      },
      {
        title: 'Enable Firewall',
        description: 'Firewall > Enable. Most routers have built-in firewall. Configure rules if needed.',
      },
      {
        title: 'Monitor Connected Devices',
        description: 'Regularly check connected devices list. Remove unknown devices immediately. Change password if suspicious activity.',
      },
    ],
    prerequisites: ['Router admin access'],
    tools: ['Router admin panel', 'Password manager'],
    tags: ['wifi', 'security', 'network', 'wpa3', 'router', 'cybersecurity'],
  },
  
  // GAMING GUIDES
  {
    id: 'how-to-increase-fps-gaming',
    title: 'How to Increase FPS in Games: Ultimate Performance Guide 2026',
    description: 'Advanced FPS optimization techniques including GPU overclocking, Windows optimizations, and game-specific settings for maximum performance.',
    category: 'gaming',
    difficulty: 'intermediate',
    readTime: 18,
    searchQuery: 'how to increase fps in games',
    uniqueTrick: 'Enable Hardware-Accelerated GPU Scheduling + Game Mode + disable fullscreen optimizations = 15-25% FPS boost',
    comparison: {
      traditional: 'Lowering graphics settings',
      modern: 'GPU scheduling + Game Mode + optimized Windows settings',
      advantage: '15-25% more FPS without sacrificing visual quality'
    },
    steps: [
      {
        title: 'Enable Hardware-Accelerated GPU Scheduling',
        description: 'Settings > System > Display > Graphics settings > Enable Hardware-accelerated GPU scheduling. Restart. Reduces input lag and improves FPS.',
        tip: 'This feature reduces CPU overhead, allowing GPU to work more efficiently'
      },
      {
        title: 'Enable Game Mode',
        description: 'Settings > Gaming > Game Mode > Enable. Windows prioritizes resources for games, disabling background processes.',
      },
      {
        title: 'Update GPU Drivers',
        description: 'Download latest drivers from NVIDIA/AMD website. Use DDU (Display Driver Uninstaller) for clean install if issues.',
        tip: 'New drivers often include game-specific optimizations and performance improvements'
      },
      {
        title: 'Optimize GPU Settings',
        description: 'NVIDIA Control Panel/AMD Software: Set Power Management to "Prefer Maximum Performance", disable V-Sync (use in-game), enable Low Latency Mode.',
      },
      {
        title: 'Disable Fullscreen Optimizations',
        description: 'Right-click game executable > Properties > Compatibility > Disable fullscreen optimizations. Reduces input lag.',
      },
      {
        title: 'Close Background Applications',
        description: 'Task Manager > End tasks for unnecessary apps (browsers, Discord overlay if not needed, etc.). Free up RAM and CPU.',
      },
      {
        title: 'Optimize In-Game Settings',
        description: 'Lower shadows, reflections, and anti-aliasing first. Keep textures high if VRAM allows. Use DLSS/FSR if available.',
        tip: 'Shadows and reflections are biggest FPS killers - lower these first'
      },
      {
        title: 'Set High Performance Power Plan',
        description: 'Power Options > High Performance. Prevents CPU/GPU throttling. Use "Ultimate Performance" if available.',
      },
      {
        title: 'Disable Windows Visual Effects',
        description: 'System Properties > Advanced > Performance > Adjust for best performance. Frees up GPU resources.',
      },
      {
        title: 'Overclock GPU (Advanced)',
        description: 'Use MSI Afterburner or GPU Tuning. Increase core clock +50-100MHz, memory +200-500MHz. Test stability.',
        tip: 'Start small, test each game. Too high can cause crashes or artifacts'
      },
      {
        title: 'Monitor Performance',
        description: 'Use MSI Afterburner overlay to monitor FPS, temps, usage. Identify bottlenecks and optimize accordingly.',
      },
    ],
    prerequisites: ['Gaming PC', 'Administrator access'],
    tools: ['MSI Afterburner', 'NVIDIA Control Panel/AMD Software', 'Game-specific settings'],
    tags: ['fps', 'gaming', 'performance', 'optimization', 'gpu', 'pc gaming'],
  },
  {
    id: 'how-to-reduce-game-lag',
    title: 'How to Reduce Game Lag: Complete Latency Reduction Guide',
    description: 'Comprehensive guide to reduce input lag, network latency, and frame time inconsistencies for smooth gaming experience.',
    category: 'gaming',
    difficulty: 'intermediate',
    readTime: 14,
    searchQuery: 'how to reduce lag in games',
    uniqueTrick: 'Enable Low Latency Mode + use wired connection + optimize network buffer = 50-70% latency reduction',
    comparison: {
      traditional: 'Closing apps and using WiFi',
      modern: 'Low Latency Mode + Ethernet + network optimization + frame rate capping',
      advantage: '50-70% lower latency, smoother gameplay, competitive advantage'
    },
    steps: [
      {
        title: 'Use Wired Ethernet Connection',
        description: 'Connect via Ethernet cable instead of WiFi. Wired connections have 10-50ms lower latency and more stable.',
        tip: 'Even powerline adapters are better than WiFi for gaming'
      },
      {
        title: 'Enable Low Latency Mode',
        description: 'NVIDIA Control Panel > Manage 3D Settings > Low Latency Mode > Ultra. Reduces input lag by 10-20ms.',
      },
      {
        title: 'Cap Frame Rate',
        description: 'Use in-game FPS cap or RTSS (RivaTuner) to cap FPS slightly below monitor refresh rate. Reduces frame time variance.',
        tip: 'Cap at 2-3 FPS below refresh rate (e.g., 142 FPS for 144Hz monitor)'
      },
      {
        title: 'Optimize Network Settings',
        description: 'Disable QoS in router if causing issues. Use gaming-optimized DNS (Cloudflare 1.1.1.1). Enable port forwarding for games.',
      },
      {
        title: 'Close Bandwidth-Hungry Apps',
        description: 'Close streaming, downloads, cloud sync. Use Task Manager to identify apps using bandwidth.',
      },
      {
        title: 'Disable Windows Game Bar',
        description: 'Settings > Gaming > Game Bar > Disable. Reduces background overhead and potential conflicts.',
      },
      {
        title: 'Use Exclusive Fullscreen',
        description: 'Use exclusive fullscreen mode instead of borderless windowed. Reduces input lag by 5-10ms.',
      },
      {
        title: 'Optimize Mouse Polling Rate',
        description: 'Set gaming mouse to 1000Hz polling rate. Lower rates (125Hz, 500Hz) increase input lag.',
      },
      {
        title: 'Disable V-Sync',
        description: 'Disable V-Sync in games (causes input lag). Use G-Sync/FreeSync if available, or cap FPS instead.',
      },
      {
        title: 'Update Network Drivers',
        description: 'Update Ethernet/WiFi drivers from manufacturer website. Outdated drivers can cause packet loss and latency spikes.',
      },
      {
        title: 'Choose Closest Game Server',
        description: 'In-game server browser, select server with lowest ping. Use server region closest to your location.',
      },
    ],
    prerequisites: ['Gaming setup', 'Network access'],
    tools: ['NVIDIA Control Panel', 'RTSS', 'Network monitoring tools'],
    tags: ['lag', 'latency', 'gaming', 'network', 'performance', 'input lag'],
  },
];

// Helper function to get guides by category
export function getGuidesByCategory(category: 'tech' | 'security' | 'gaming'): HowToGuide[] {
  return howToGuides.filter(guide => guide.category === category);
}

// Helper function to search guides
export function searchGuides(query: string): HowToGuide[] {
  const lowerQuery = query.toLowerCase();
  return howToGuides.filter(guide =>
    guide.title.toLowerCase().includes(lowerQuery) ||
    guide.description.toLowerCase().includes(lowerQuery) ||
    guide.searchQuery.toLowerCase().includes(lowerQuery) ||
    guide.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
