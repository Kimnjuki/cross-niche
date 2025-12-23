import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Search, 
  Shield, 
  Wrench, 
  FileText, 
  TrendingDown,
  CheckCircle2,
  ExternalLink,
  Star
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'utility' | 'diagnostic' | 'recovery';
  downloadUrl: string;
  version?: string;
  fileSize?: string;
  downloads?: number;
  rating?: number;
  isVerified?: boolean;
  isFree?: boolean;
  platform?: 'windows' | 'macos' | 'linux' | 'all';
  tags: string[];
}

const mockDownloads: DownloadItem[] = [
  // Security Tools (10+)
  {
    id: '1',
    name: 'Qualys BrowserCheck',
    description: 'Check your browser for security vulnerabilities and outdated plugins',
    category: 'security',
    downloadUrl: 'https://browsercheck.qualys.com/',
    version: '2.0.1',
    fileSize: '2.5 MB',
    downloads: 1250000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'all',
    tags: ['browser', 'security', 'scan'],
  },
  {
    id: 'sec-2',
    name: 'Malwarebytes Free',
    description: 'Powerful malware removal tool with real-time protection against viruses, ransomware, and spyware',
    category: 'security',
    downloadUrl: 'https://www.malwarebytes.com/mwb-download',
    version: '4.6.0',
    fileSize: '85 MB',
    downloads: 15000000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['antivirus', 'malware', 'protection'],
  },
  {
    id: 'sec-3',
    name: 'Bitdefender Antivirus Free',
    description: 'Lightweight antivirus with real-time protection and minimal system impact',
    category: 'security',
    downloadUrl: 'https://www.bitdefender.com/solutions/free.html',
    version: '1.0.0',
    fileSize: '180 MB',
    downloads: 8500000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['antivirus', 'protection', 'real-time'],
  },
  {
    id: 'sec-4',
    name: 'Avast Free Antivirus',
    description: 'Comprehensive antivirus protection with Wi-Fi security scanner and password manager',
    category: 'security',
    downloadUrl: 'https://www.avast.com/en-us/free-antivirus-download',
    version: '23.11.0',
    fileSize: '220 MB',
    downloads: 20000000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['antivirus', 'protection', 'wifi'],
  },
  {
    id: 'sec-5',
    name: 'Windows Defender Offline',
    description: 'Microsoft\'s offline malware removal tool that runs before Windows starts',
    category: 'security',
    downloadUrl: 'https://www.microsoft.com/en-us/wdsi/defender',
    version: '1.0.0',
    fileSize: '250 MB',
    downloads: 5200000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['microsoft', 'offline', 'malware'],
  },
  {
    id: 'sec-6',
    name: 'Sophos Home Free',
    description: 'Business-grade security for home users with real-time protection and web filtering',
    category: 'security',
    downloadUrl: 'https://home.sophos.com/',
    version: '3.5.0',
    fileSize: '95 MB',
    downloads: 3200000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['antivirus', 'web-filtering', 'protection'],
  },
  {
    id: 'sec-7',
    name: 'Kaspersky Security Scan',
    description: 'Free security scanner to detect and remove viruses, trojans, and other threats',
    category: 'security',
    downloadUrl: 'https://www.kaspersky.com/free-virus-scan',
    version: '2.0.0',
    fileSize: '45 MB',
    downloads: 6800000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['scanner', 'virus', 'threats'],
  },
  {
    id: 'sec-8',
    name: 'ESET Online Scanner',
    description: 'Free online scanner to detect and remove malware without installation',
    category: 'security',
    downloadUrl: 'https://www.eset.com/us/home/online-scanner/',
    version: '1.0.0',
    fileSize: '15 MB',
    downloads: 4100000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['online', 'scanner', 'malware'],
  },
  {
    id: 'sec-9',
    name: 'ClamWin Free Antivirus',
    description: 'Open-source antivirus for Windows with on-demand scanning capabilities',
    category: 'security',
    downloadUrl: 'https://clamwin.com/',
    version: '0.103.3',
    fileSize: '120 MB',
    downloads: 2800000,
    rating: 4.5,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['open-source', 'antivirus', 'scanning'],
  },
  {
    id: 'sec-10',
    name: 'Zemana AntiMalware',
    description: 'Lightweight second-opinion scanner to detect and remove advanced malware',
    category: 'security',
    downloadUrl: 'https://www.zemana.com/AntiMalware',
    version: '3.0.0',
    fileSize: '35 MB',
    downloads: 5600000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['second-opinion', 'malware', 'scanner'],
  },
  {
    id: 'sec-11',
    name: 'HitmanPro',
    description: 'Fast cloud-based malware scanner that detects and removes threats',
    category: 'security',
    downloadUrl: 'https://www.hitmanpro.com/',
    version: '3.8.0',
    fileSize: '12 MB',
    downloads: 7200000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['cloud', 'scanner', 'malware'],
  },
  
  // Utility Tools (10+)
  {
    id: '3',
    name: 'AdwCleaner',
    description: 'Remove adware, PUPs, toolbars, and unwanted programs',
    category: 'utility',
    downloadUrl: 'https://www.malwarebytes.com/adwcleaner',
    version: '8.4.2',
    fileSize: '8.7 MB',
    downloads: 2100000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['adware', 'cleanup', 'malware'],
  },
  {
    id: '5',
    name: 'ComboFix',
    description: 'Advanced malware removal tool for persistent infections',
    category: 'utility',
    downloadUrl: 'https://www.bleepingcomputer.com/download/combofix/',
    version: '15.0.1',
    fileSize: '5.3 MB',
    downloads: 1800000,
    rating: 4.5,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['malware', 'removal', 'advanced'],
  },
  {
    id: '6',
    name: 'Junkware Removal Tool',
    description: 'Remove junkware, adware, and potentially unwanted programs',
    category: 'utility',
    downloadUrl: 'https://www.malwarebytes.com/junkwareremovaltool',
    version: '2.8.0',
    fileSize: '3.1 MB',
    downloads: 1400000,
    rating: 4.4,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['junkware', 'cleanup', 'adware'],
  },
  {
    id: 'util-4',
    name: 'CCleaner Free',
    description: 'Clean temporary files, optimize registry, and improve system performance',
    category: 'utility',
    downloadUrl: 'https://www.ccleaner.com/ccleaner/download',
    version: '6.15.0',
    fileSize: '25 MB',
    downloads: 25000000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['cleanup', 'optimization', 'registry'],
  },
  {
    id: 'util-5',
    name: 'Wise Disk Cleaner',
    description: 'Free disk cleaner to remove junk files and free up disk space',
    category: 'utility',
    downloadUrl: 'https://www.wisecleaner.com/wise-disk-cleaner.html',
    version: '11.0.0',
    fileSize: '8.5 MB',
    downloads: 12000000,
    rating: 4.5,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['disk-cleaner', 'optimization', 'space'],
  },
  {
    id: 'util-6',
    name: 'BleachBit',
    description: 'Open-source disk space cleaner and privacy manager',
    category: 'utility',
    downloadUrl: 'https://www.bleachbit.org/download',
    version: '4.6.0',
    fileSize: '15 MB',
    downloads: 8500000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['cleanup', 'privacy', 'open-source'],
  },
  {
    id: 'util-7',
    name: 'Glary Utilities Free',
    description: 'Comprehensive system optimization suite with registry cleaner and startup manager',
    category: 'utility',
    downloadUrl: 'https://www.glarysoft.com/glary-utilities/',
    version: '6.0.0',
    fileSize: '45 MB',
    downloads: 15000000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['optimization', 'registry', 'startup'],
  },
  {
    id: 'util-8',
    name: 'IObit Uninstaller',
    description: 'Powerful uninstaller to completely remove programs and leftover files',
    category: 'utility',
    downloadUrl: 'https://www.iobit.com/en/advanceduninstaller.php',
    version: '13.0.0',
    fileSize: '30 MB',
    downloads: 18000000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['uninstaller', 'cleanup', 'removal'],
  },
  {
    id: 'util-9',
    name: 'Revo Uninstaller Free',
    description: 'Advanced uninstaller with deep scanning to remove all program traces',
    category: 'utility',
    downloadUrl: 'https://www.revouninstaller.com/products/revo-uninstaller-free/',
    version: '2.4.0',
    fileSize: '12 MB',
    downloads: 9500000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['uninstaller', 'deep-scan', 'cleanup'],
  },
  {
    id: 'util-10',
    name: 'Autoruns',
    description: 'Microsoft tool to see what programs are configured to run at system startup',
    category: 'utility',
    downloadUrl: 'https://docs.microsoft.com/en-us/sysinternals/downloads/autoruns',
    version: '14.0.0',
    fileSize: '1.2 MB',
    downloads: 7200000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['startup', 'microsoft', 'system'],
  },
  {
    id: 'util-11',
    name: 'Process Explorer',
    description: 'Advanced task manager to see what programs are running and using resources',
    category: 'utility',
    downloadUrl: 'https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer',
    version: '17.0.0',
    fileSize: '2.5 MB',
    downloads: 11000000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['process', 'task-manager', 'system'],
  },
  {
    id: 'util-12',
    name: 'Everything Search',
    description: 'Lightning-fast file search tool that indexes your entire drive instantly',
    category: 'utility',
    downloadUrl: 'https://www.voidtools.com/',
    version: '1.5.0',
    fileSize: '2.8 MB',
    downloads: 14000000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['search', 'file-finder', 'indexing'],
  },
  
  // Diagnostic Tools (10+)
  {
    id: '4',
    name: 'RKill',
    description: 'Terminate malicious processes before running malware removal tools',
    category: 'diagnostic',
    downloadUrl: 'https://www.bleepingcomputer.com/download/rkill/',
    version: '2.9.1',
    fileSize: '1.8 MB',
    downloads: 950000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['process', 'malware', 'diagnostic'],
  },
  {
    id: 'diag-2',
    name: 'GMER Rootkit Scanner',
    description: 'Detect and remove rootkits and hidden malware that other scanners miss',
    category: 'diagnostic',
    downloadUrl: 'https://www.gmer.net/',
    version: '2.2.0',
    fileSize: '3.5 MB',
    downloads: 3200000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['rootkit', 'scanner', 'hidden-malware'],
  },
  {
    id: 'diag-3',
    name: 'TDSSKiller',
    description: 'Kaspersky tool to detect and remove TDSS rootkit and bootkit infections',
    category: 'diagnostic',
    downloadUrl: 'https://support.kaspersky.com/tdsskiller',
    version: '3.1.0',
    fileSize: '2.1 MB',
    downloads: 2800000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['rootkit', 'tdss', 'kaspersky'],
  },
  {
    id: 'diag-4',
    name: 'Farbar Recovery Scan Tool',
    description: 'Diagnostic tool to generate detailed system reports for malware removal',
    category: 'diagnostic',
    downloadUrl: 'https://www.bleepingcomputer.com/download/farbar-recovery-scan-tool/',
    version: '1.0.0',
    fileSize: '1.5 MB',
    downloads: 4500000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['diagnostic', 'system-report', 'malware'],
  },
  {
    id: 'diag-5',
    name: 'HijackThis',
    description: 'System scanner to identify browser hijackers and unwanted browser modifications',
    category: 'diagnostic',
    downloadUrl: 'https://www.bleepingcomputer.com/download/hijackthis/',
    version: '2.0.5',
    fileSize: '1.2 MB',
    downloads: 3800000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['browser-hijack', 'scanner', 'diagnostic'],
  },
  {
    id: 'diag-6',
    name: 'Process Monitor',
    description: 'Microsoft tool to monitor file system, registry, and process activity in real-time',
    category: 'diagnostic',
    downloadUrl: 'https://docs.microsoft.com/en-us/sysinternals/downloads/procmon',
    version: '3.95.0',
    fileSize: '2.8 MB',
    downloads: 6200000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['monitoring', 'process', 'microsoft'],
  },
  {
    id: 'diag-7',
    name: 'TCPView',
    description: 'View all TCP and UDP endpoints with process names and connection states',
    category: 'diagnostic',
    downloadUrl: 'https://docs.microsoft.com/en-us/sysinternals/downloads/tcpview',
    version: '4.0.0',
    fileSize: '0.5 MB',
    downloads: 4100000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['network', 'tcp', 'connections'],
  },
  {
    id: 'diag-8',
    name: 'RootkitRevealer',
    description: 'Microsoft tool to detect rootkits by comparing registry and file system APIs',
    category: 'diagnostic',
    downloadUrl: 'https://docs.microsoft.com/en-us/sysinternals/downloads/rootkit-revealer',
    version: '1.7.1',
    fileSize: '0.3 MB',
    downloads: 2900000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['rootkit', 'detection', 'microsoft'],
  },
  {
    id: 'diag-9',
    name: 'VirusTotal Uploader',
    description: 'Upload suspicious files to VirusTotal for multi-engine malware scanning',
    category: 'diagnostic',
    downloadUrl: 'https://www.virustotal.com/gui/',
    version: '1.0.0',
    fileSize: '5 MB',
    downloads: 8500000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['virustotal', 'scanning', 'multi-engine'],
  },
  {
    id: 'diag-10',
    name: 'Windows Memory Diagnostic',
    description: 'Built-in Windows tool to test RAM for errors and hardware problems',
    category: 'diagnostic',
    downloadUrl: 'https://support.microsoft.com/en-us/windows/diagnose-memory-problems-on-your-windows-pc',
    version: '1.0.0',
    fileSize: 'Built-in',
    downloads: 12000000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['memory', 'ram', 'hardware'],
  },
  {
    id: 'diag-11',
    name: 'CrystalDiskInfo',
    description: 'Monitor hard drive health, temperature, and S.M.A.R.T. status',
    category: 'diagnostic',
    downloadUrl: 'https://crystalmark.info/en/software/crystaldiskinfo/',
    version: '9.1.0',
    fileSize: '8 MB',
    downloads: 15000000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['hardware', 'disk-health', 'smart'],
  },
  
  // Recovery Tools (10+)
  {
    id: '2',
    name: 'STOPDecrypter',
    description: 'Decrypt files encrypted by STOP/Djvu ransomware variants',
    category: 'recovery',
    downloadUrl: 'https://www.bleepingcomputer.com/download/stops-djvu-decrypter/',
    version: '1.0.0',
    fileSize: '1.2 MB',
    downloads: 850000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['ransomware', 'decrypt', 'recovery'],
  },
  {
    id: 'rec-2',
    name: 'Recuva',
    description: 'Recover deleted files from hard drives, memory cards, and USB drives',
    category: 'recovery',
    downloadUrl: 'https://www.ccleaner.com/recuva/download',
    version: '1.53.0',
    fileSize: '8 MB',
    downloads: 18000000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['data-recovery', 'deleted-files', 'recovery'],
  },
  {
    id: 'rec-3',
    name: 'PhotoRec',
    description: 'Powerful file recovery tool to recover lost files including photos and documents',
    category: 'recovery',
    downloadUrl: 'https://www.cgsecurity.org/wiki/PhotoRec',
    version: '7.2.0',
    fileSize: '15 MB',
    downloads: 12000000,
    rating: 4.8,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['data-recovery', 'photos', 'files'],
  },
  {
    id: 'rec-4',
    name: 'TestDisk',
    description: 'Recover lost partitions and make non-bootable disks bootable again',
    category: 'recovery',
    downloadUrl: 'https://www.cgsecurity.org/wiki/TestDisk',
    version: '7.2.0',
    fileSize: '15 MB',
    downloads: 8500000,
    rating: 4.9,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['partition', 'recovery', 'boot'],
  },
  {
    id: 'rec-5',
    name: 'Puran File Recovery',
    description: 'Free file recovery software to restore deleted or lost files',
    category: 'recovery',
    downloadUrl: 'https://www.puransoftware.com/File-Recovery.html',
    version: '1.0.0',
    fileSize: '2.5 MB',
    downloads: 6200000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['file-recovery', 'deleted-files', 'restore'],
  },
  {
    id: 'rec-6',
    name: 'DiskDigger',
    description: 'Recover deleted photos and files from memory cards and USB drives',
    category: 'recovery',
    downloadUrl: 'https://diskdigger.org/',
    version: '1.20.0',
    fileSize: '1.8 MB',
    downloads: 4800000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['photo-recovery', 'memory-card', 'usb'],
  },
  {
    id: 'rec-7',
    name: 'Windows File Recovery',
    description: 'Microsoft command-line tool to recover deleted files from Windows 10/11',
    category: 'recovery',
    downloadUrl: 'https://www.microsoft.com/en-us/p/windows-file-recovery/9n26s50ln705',
    version: '1.0.0',
    fileSize: 'Built-in',
    downloads: 15000000,
    rating: 4.5,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['microsoft', 'file-recovery', 'command-line'],
  },
  {
    id: 'rec-8',
    name: 'R-Studio',
    description: 'Advanced data recovery software for recovering files from formatted or damaged drives',
    category: 'recovery',
    downloadUrl: 'https://www.r-studio.com/',
    version: '9.2.0',
    fileSize: '85 MB',
    downloads: 7200000,
    rating: 4.8,
    isVerified: true,
    isFree: false,
    platform: 'windows',
    tags: ['advanced', 'data-recovery', 'formatted'],
  },
  {
    id: 'rec-9',
    name: 'EaseUS Data Recovery Wizard',
    description: 'Recover deleted, formatted, or lost data from various storage devices',
    category: 'recovery',
    downloadUrl: 'https://www.easeus.com/datarecoverywizard/free-data-recovery-software.htm',
    version: '16.0.0',
    fileSize: '45 MB',
    downloads: 25000000,
    rating: 4.7,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['data-recovery', 'formatted', 'lost-files'],
  },
  {
    id: 'rec-10',
    name: 'Pandora Recovery',
    description: 'Recover deleted files from NTFS and FAT file systems',
    category: 'recovery',
    downloadUrl: 'https://www.pandorarecovery.com/',
    version: '2.1.1',
    fileSize: '3.2 MB',
    downloads: 3800000,
    rating: 4.5,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['file-recovery', 'ntfs', 'fat'],
  },
  {
    id: 'rec-11',
    name: 'Glary Undelete',
    description: 'Free file recovery tool to restore accidentally deleted files',
    category: 'recovery',
    downloadUrl: 'https://www.glarysoft.com/glary-undelete/',
    version: '5.0.0',
    fileSize: '12 MB',
    downloads: 5600000,
    rating: 4.6,
    isVerified: true,
    isFree: true,
    platform: 'windows',
    tags: ['file-recovery', 'undelete', 'restore'],
  },
];

const categoryIcons = {
  security: Shield,
  utility: Wrench,
  diagnostic: FileText,
  recovery: TrendingDown,
};

const platformIcons = {
  windows: '🪟',
  macos: '🍎',
  linux: '🐧',
  all: '🌐',
};

export default function Downloads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDownloads = mockDownloads.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedDownloads = [...filteredDownloads].sort((a, b) => {
    return (b.downloads || 0) - (a.downloads || 0);
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Downloads</h1>
              <p className="text-muted-foreground">Security tools and utilities</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Download verified security tools, malware removal utilities, and diagnostic software. 
            All tools are free and verified safe.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search downloads... (e.g., 'malware removal', 'browser check')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="utility">Utility</TabsTrigger>
              <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="utility" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="diagnostic" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
            <TabsContent value="recovery" className="mt-4">
              {/* Content will be shown below */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDownloads.map((item) => {
            const CategoryIcon = categoryIcons[item.category];
            
            return (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>
                    {item.isVerified && (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {item.version && (
                        <span>v{item.version}</span>
                      )}
                      {item.fileSize && (
                        <>
                          <span>•</span>
                          <span>{item.fileSize}</span>
                        </>
                      )}
                      {item.platform && (
                        <>
                          <span>•</span>
                          <span>{platformIcons[item.platform]}</span>
                        </>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        {item.downloads && (
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{(item.downloads / 1000).toFixed(0)}K</span>
                          </div>
                        )}
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Download Button */}
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => {
                        if (item.downloadUrl && item.downloadUrl !== '#') {
                          window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download
                      {item.isFree && (
                        <Badge variant="secondary" className="ml-auto">
                          Free
                        </Badge>
                      )}
                      {item.downloadUrl && item.downloadUrl !== '#' && (
                        <ExternalLink className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedDownloads.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No downloads found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Important Notice:</p>
          <p>
            All tools are provided as-is. Always download from official sources and verify file hashes. 
            Use at your own risk. We are not responsible for any damage caused by these tools.
          </p>
        </div>
      </div>
    </Layout>
  );
}

