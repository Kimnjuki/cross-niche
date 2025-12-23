import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  Star,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import type { BuyingGuide } from '@/types/products';

// Mock buying guide data (in production, fetch from API)
const mockGuides: Record<string, BuyingGuide> = {
  'best-gaming-gpu-2024': {
    id: 'best-gaming-gpu-2024',
    title: 'Best Gaming GPUs 2024: Complete Buying Guide',
    description: 'Everything you need to know to choose the perfect graphics card for your gaming setup, from budget to enthusiast level.',
    category: 'Graphics Cards',
    niche: 'gaming',
    sections: [
      {
        title: 'Understanding GPU Specifications',
        content: `When shopping for a gaming GPU, understanding the key specifications is crucial:

**CUDA Cores / Stream Processors**: The number of processing units. More cores generally mean better performance, but architecture matters too.

**Memory (VRAM)**: Video RAM stores textures and game data. For 1080p gaming, 8GB is sufficient. For 1440p, aim for 12GB+. For 4K, 16GB+ is recommended.

**Memory Bus Width**: Wider buses allow faster data transfer. 256-bit is standard for mid-range, 384-bit+ for high-end.

**Clock Speeds**: Base and boost clocks determine how fast the GPU processes data. Higher is generally better, but real-world performance depends on the game.

**TDP (Thermal Design Power)**: Power consumption in watts. Higher TDP means more heat and requires a better PSU.

**Ray Tracing Cores**: Dedicated hardware for real-time ray tracing. NVIDIA's RT cores and AMD's RT accelerators handle this.

**Tensor Cores / AI Accelerators**: Used for DLSS, FSR, and other AI-enhanced features.`,
      },
      {
        title: 'Budget Range ($300-$500)',
        content: `For budget-conscious gamers, these GPUs offer excellent value:

**NVIDIA RTX 4060** ($299)
- 8GB GDDR6
- Excellent 1080p performance
- DLSS 3 support
- Low power consumption (115W)
- Best for: 1080p gaming, entry-level 1440p

**AMD RX 7600** ($269)
- 8GB GDDR6
- Strong 1080p performance
- FSR 2/3 support
- Great value proposition
- Best for: 1080p gaming, budget builds

**Recommendation**: The RTX 4060 offers better ray tracing and DLSS, while the RX 7600 provides better raw performance per dollar.`,
        products: ['rtx-4060', 'rx-7600'],
      },
      {
        title: 'Mid-Range ($500-$800)',
        content: `The sweet spot for most gamers, offering excellent 1440p performance:

**NVIDIA RTX 4070** ($599)
- 12GB GDDR6X
- Excellent 1440p performance
- DLSS 3 support
- Efficient power usage
- Best for: 1440p gaming, entry-level 4K with DLSS

**AMD RX 7700 XT** ($449)
- 12GB GDDR6
- Strong 1440p performance
- FSR support
- Great value
- Best for: 1440p gaming, high refresh rate

**Recommendation**: The RTX 4070 is the better choice for ray tracing and AI features, while the RX 7700 XT offers better value for pure rasterization performance.`,
        products: ['rtx-4070', 'rx-7700-xt'],
      },
      {
        title: 'High-End ($800-$1500)',
        content: `Premium GPUs for 4K gaming and content creation:

**NVIDIA RTX 4080** ($1,199)
- 16GB GDDR6X
- Excellent 4K performance
- DLSS 3 support
- Strong ray tracing
- Best for: 4K gaming, content creation, VR

**AMD RX 7900 XT** ($899)
- 20GB GDDR6
- Strong 4K performance
- FSR support
- More VRAM
- Best for: 4K gaming, high refresh rate 1440p

**Recommendation**: The RTX 4080 excels in ray tracing and AI features, while the RX 7900 XT offers more VRAM and better value.`,
        products: ['rtx-4080', 'rx-7900-xt'],
      },
      {
        title: 'Enthusiast ($1500+)',
        content: `The absolute best GPUs money can buy:

**NVIDIA RTX 5090** ($1,999)
- 32GB GDDR7
- Unmatched 4K/8K performance
- DLSS 3.5 support
- Industry-leading ray tracing
- Best for: 4K/8K gaming, professional content creation, AI workloads

**NVIDIA RTX 4090** ($1,599)
- 24GB GDDR6X
- Excellent 4K performance
- DLSS 3 support
- Still very powerful
- Best for: 4K gaming, content creation

**Recommendation**: The RTX 5090 is the ultimate choice if budget allows. The RTX 4090 remains excellent and offers better value.`,
        products: ['rtx-5090', 'rtx-4090'],
      },
      {
        title: 'What to Consider',
        content: `Beyond raw performance, consider:

**Power Supply**: High-end GPUs require 750W+ PSUs. Check your PSU's capacity and connectors.

**Case Size**: Modern GPUs are large. Ensure your case can accommodate the length and height.

**Cooling**: Good airflow is essential. Consider case fans and GPU cooling solutions.

**Monitor Resolution**: Match your GPU to your monitor. 1080p doesn't need a 4090.

**Future-Proofing**: Consider how long you want to keep the GPU. Higher-end models last longer.

**Ray Tracing**: If you care about ray tracing, NVIDIA has the advantage.

**VRAM**: More VRAM helps with high-resolution textures and future-proofing.`,
      },
    ],
    recommendedProducts: ['rtx-5090', 'rtx-4090', 'rx-7900-xtx'],
    budgetRanges: [
      {
        min: 300,
        max: 500,
        label: 'Budget',
        recommendedProducts: ['rtx-4060', 'rx-7600'],
      },
      {
        min: 500,
        max: 800,
        label: 'Mid-Range',
        recommendedProducts: ['rtx-4070', 'rx-7700-xt'],
      },
      {
        min: 800,
        max: 1500,
        label: 'High-End',
        recommendedProducts: ['rtx-4080', 'rx-7900-xt'],
      },
      {
        min: 1500,
        max: 3000,
        label: 'Enthusiast',
        recommendedProducts: ['rtx-5090', 'rtx-4090'],
      },
    ],
    publishedAt: '2024-12-18',
    updatedAt: '2024-12-20',
    readTime: 20,
  },
  'best-gaming-keyboard-2024': {
    id: 'best-gaming-keyboard-2024',
    title: 'Best Gaming Keyboards 2024: Mechanical vs Membrane',
    description: 'Complete guide to choosing the perfect gaming keyboard, from mechanical switches to RGB lighting.',
    category: 'Peripherals',
    niche: 'gaming',
    sections: [
      {
        title: 'Mechanical vs Membrane',
        content: `**Mechanical Keyboards**:
- Individual switches for each key
- Tactile feedback and audible click
- Longer lifespan (50-100 million keystrokes)
- More expensive
- Better for gaming and typing

**Membrane Keyboards**:
- Rubber dome switches
- Quieter operation
- Lower cost
- Shorter lifespan
- Adequate for casual gaming

**Recommendation**: For serious gaming, mechanical keyboards offer better responsiveness and durability.`,
      },
      {
        title: 'Switch Types Explained',
        content: `**Linear Switches** (Red, Black):
- Smooth keystroke with no tactile bump
- Quiet operation
- Best for: Gaming, fast typing
- Examples: Cherry MX Red, Gateron Red

**Tactile Switches** (Brown, Clear):
- Tactile bump when key activates
- No audible click
- Best for: Typing, general use
- Examples: Cherry MX Brown, Gateron Brown

**Clicky Switches** (Blue, Green):
- Tactile bump with audible click
- Satisfying feedback
- Best for: Typing (can be loud)
- Examples: Cherry MX Blue, Gateron Blue`,
      },
      {
        title: 'Key Features to Consider',
        content: `**RGB Lighting**: Customizable lighting for aesthetics and visibility in dark environments.

**Macro Keys**: Programmable keys for complex commands and shortcuts.

**Wireless Options**: Bluetooth or 2.4GHz wireless for cleaner setups.

**Build Quality**: Metal construction, PBT keycaps, and robust switches.

**Software**: Customization software for key mapping and lighting.

**N-Key Rollover**: Ability to press multiple keys simultaneously without conflicts.`,
      },
    ],
    recommendedProducts: [],
    budgetRanges: [
      {
        min: 50,
        max: 100,
        label: 'Budget',
        recommendedProducts: [],
      },
      {
        min: 100,
        max: 200,
        label: 'Mid-Range',
        recommendedProducts: [],
      },
      {
        min: 200,
        max: 500,
        label: 'Premium',
        recommendedProducts: [],
      },
    ],
    publishedAt: '2024-12-15',
    updatedAt: '2024-12-18',
    readTime: 15,
  },
  'best-security-software-2024': {
    id: 'best-security-software-2024',
    title: 'Best Security Software 2024: Antivirus & VPN Guide',
    description: 'Comprehensive guide to protecting your devices with the best security software and VPNs.',
    category: 'Software',
    niche: 'security',
    sections: [
      {
        title: 'Antivirus vs Internet Security',
        content: `**Antivirus Software**:
- Basic malware protection
- Real-time scanning
- Lower cost
- Essential for all users

**Internet Security Suites**:
- Antivirus + firewall + VPN + more
- Comprehensive protection
- Higher cost
- Best for: Users who want all-in-one solution

**Recommendation**: For most users, a good antivirus is sufficient. Internet Security suites are better for families or users who want comprehensive protection.`,
      },
      {
        title: 'VPN Essentials',
        content: `**Why You Need a VPN**:
- Encrypts internet traffic
- Hides your IP address
- Bypasses geo-restrictions
- Protects on public Wi-Fi

**What to Look For**:
- No-logs policy
- Strong encryption (AES-256)
- Kill switch
- Fast speeds
- Server locations

**Best VPNs**: NordVPN, ExpressVPN, Surfshark, ProtonVPN`,
      },
      {
        title: 'Free vs Paid Options',
        content: `**Free Antivirus**:
- Basic protection
- Limited features
- May include ads
- Good for: Budget users, basic protection

**Paid Antivirus**:
- Advanced protection
- No ads
- Additional features
- Better support
- Good for: Serious protection needs

**Recommendation**: Free antivirus is better than nothing, but paid options offer significantly better protection and features.`,
      },
    ],
    recommendedProducts: [],
    budgetRanges: [
      {
        min: 0,
        max: 50,
        label: 'Free',
        recommendedProducts: [],
      },
      {
        min: 50,
        max: 100,
        label: 'Budget',
        recommendedProducts: [],
      },
      {
        min: 100,
        max: 200,
        label: 'Premium',
        recommendedProducts: [],
      },
    ],
    publishedAt: '2024-12-10',
    updatedAt: '2024-12-15',
    readTime: 18,
  },
  'best-smartphone-2024': {
    id: 'best-smartphone-2024',
    title: 'Best Smartphones 2024: iPhone vs Android Buying Guide',
    description: 'Complete guide to choosing the best smartphone in 2024, comparing iPhone, Samsung, Google Pixel, and more. Find the perfect phone for your needs and budget.',
    category: 'Smartphones',
    niche: 'tech',
    sections: [
      {
        title: 'iPhone vs Android: Which is Right for You?',
        content: `**iPhone (iOS)**:
- Seamless ecosystem integration
- Regular software updates (5+ years)
- Premium build quality
- Strong privacy features
- Higher price point
- Best for: Users invested in Apple ecosystem, privacy-conscious users

**Android**:
- More customization options
- Wider price range
- More hardware variety
- Google services integration
- More flexible file management
- Best for: Users who want customization, budget-conscious buyers`,
      },
      {
        title: 'Budget Range ($200-$400)',
        content: `**Google Pixel 7a** ($349)
- Excellent camera for price
- Clean Android experience
- Regular updates
- Best for: Photography enthusiasts on a budget

**Samsung Galaxy A54** ($399)
- Great display
- Solid performance
- Good battery life
- Best for: Media consumption, everyday use

**iPhone SE (3rd Gen)** ($429)
- iOS experience at lower price
- Powerful A15 chip
- Compact design
- Best for: iOS users on a budget`,
        products: ['pixel-7a', 'galaxy-a54', 'iphone-se'],
      },
      {
        title: 'Mid-Range ($400-$800)',
        content: `**Google Pixel 8** ($699)
- Best-in-class camera
- AI features
- 7 years of updates
- Best for: Photography, AI features

**Samsung Galaxy S23** ($799)
- Excellent display
- Strong performance
- Versatile camera system
- Best for: All-around use, media

**iPhone 14** ($699)
- Reliable performance
- Great cameras
- iOS ecosystem
- Best for: iOS users, reliability`,
        products: ['pixel-8', 'galaxy-s23', 'iphone-14'],
      },
      {
        title: 'Flagship ($800-$1200)',
        content: `**iPhone 15 Pro** ($999)
- A17 Pro chip (most powerful)
- ProRAW photography
- Titanium build
- Action Button
- Best for: Power users, content creators

**Samsung Galaxy S24 Ultra** ($1,199)
- S Pen support
- 200MP camera
- Excellent display
- Best for: Note-taking, productivity

**Google Pixel 8 Pro** ($999)
- Best computational photography
- AI features
- 7 years of updates
- Best for: Photography, AI enthusiasts`,
        products: ['iphone-15-pro', 'galaxy-s24-ultra', 'pixel-8-pro'],
      },
      {
        title: 'Key Features to Consider',
        content: `**Camera**: Megapixels aren't everything. Look for:
- Computational photography features
- Low-light performance
- Video recording quality
- Zoom capabilities

**Battery Life**: Consider:
- Battery capacity (mAh)
- Fast charging support
- Wireless charging
- Power efficiency of chip

**Display**: Look for:
- Resolution (1080p vs 1440p)
- Refresh rate (60Hz vs 120Hz)
- Brightness (for outdoor use)
- Display technology (OLED vs LCD)

**Performance**: Consider:
- Chip performance
- RAM amount
- Storage options
- 5G support`,
      },
    ],
    recommendedProducts: ['iphone-15-pro', 'galaxy-s24-ultra', 'pixel-8-pro'],
    budgetRanges: [
      {
        min: 200,
        max: 400,
        label: 'Budget',
        recommendedProducts: ['pixel-7a', 'galaxy-a54'],
      },
      {
        min: 400,
        max: 800,
        label: 'Mid-Range',
        recommendedProducts: ['pixel-8', 'galaxy-s23', 'iphone-14'],
      },
      {
        min: 800,
        max: 1200,
        label: 'Flagship',
        recommendedProducts: ['iphone-15-pro', 'galaxy-s24-ultra'],
      },
    ],
    publishedAt: '2024-12-19',
    updatedAt: '2024-12-20',
    readTime: 25,
  },
  'best-laptop-students-2024': {
    id: 'best-laptop-students-2024',
    title: 'Best Laptops for Students 2024: Complete Buying Guide',
    description: 'Find the perfect student laptop for remote learning, note-taking, and productivity. Compare budget, mid-range, and premium options with detailed recommendations.',
    category: 'Laptops',
    niche: 'tech',
    sections: [
      {
        title: 'What Students Need in a Laptop',
        content: `**Essential Features**:
- Long battery life (8+ hours)
- Lightweight and portable
- Good keyboard for typing
- Reliable performance
- Webcam for video calls
- Affordable price

**Nice to Have**:
- Touchscreen
- 2-in-1 design (laptop/tablet)
- Stylus support
- Fast charging
- Multiple USB ports`,
      },
      {
        title: 'Budget Range ($300-$600)',
        content: `**Chromebooks** ($300-$500)
- Fast, simple OS
- Long battery life
- Great for web-based work
- Limited offline functionality
- Best for: Students who work primarily online

**HP Pavilion 15** ($499)
- Windows 11
- Decent performance
- Good battery life
- Best for: General student use

**Lenovo IdeaPad 3** ($449)
- Reliable build
- Good value
- Adequate performance
- Best for: Budget-conscious students`,
        products: ['chromebook', 'hp-pavilion-15', 'lenovo-ideapad-3'],
      },
      {
        title: 'Mid-Range ($600-$1000)',
        content: `**MacBook Air M2** ($999)
- Excellent battery life
- Powerful M2 chip
- Premium build
- Great for: Students in Apple ecosystem

**Dell XPS 13** ($899)
- Premium design
- Excellent display
- Good performance
- Great for: Design students, professionals

**Microsoft Surface Laptop 5** ($999)
- Touchscreen
- Great keyboard
- Premium build
- Great for: Note-taking, versatility`,
        products: ['macbook-air-m2', 'dell-xps-13', 'surface-laptop-5'],
      },
      {
        title: 'Premium ($1000-$2000)',
        content: `**MacBook Pro 14" M3** ($1,599)
- Powerful M3 chip
- Excellent display
- Long battery life
- Best for: Engineering, design students

**Dell XPS 15** ($1,499)
- Large display
- Powerful performance
- Great for: Content creation, gaming

**Microsoft Surface Laptop Studio** ($1,599)
- 2-in-1 design
- Stylus support
- Powerful performance
- Best for: Creative students`,
        products: ['macbook-pro-14', 'dell-xps-15', 'surface-laptop-studio'],
      },
      {
        title: 'Operating System Comparison',
        content: `**Windows**: Most versatile, best software compatibility, familiar interface

**macOS**: Best for Apple ecosystem, excellent battery life, premium experience

**Chrome OS**: Fast, simple, secure, limited offline functionality`,
      },
    ],
    recommendedProducts: ['macbook-air-m2', 'dell-xps-13', 'surface-laptop-5'],
    budgetRanges: [
      {
        min: 300,
        max: 600,
        label: 'Budget',
        recommendedProducts: ['chromebook', 'hp-pavilion-15'],
      },
      {
        min: 600,
        max: 1000,
        label: 'Mid-Range',
        recommendedProducts: ['macbook-air-m2', 'dell-xps-13'],
      },
      {
        min: 1000,
        max: 2000,
        label: 'Premium',
        recommendedProducts: ['macbook-pro-14', 'surface-laptop-studio'],
      },
    ],
    publishedAt: '2024-12-18',
    updatedAt: '2024-12-20',
    readTime: 22,
  },
  'best-wireless-earbuds-2024': {
    id: 'best-wireless-earbuds-2024',
    title: 'Best Wireless Earbuds 2024: AirPods vs Alternatives',
    description: 'Complete guide to choosing the best wireless earbuds. Compare AirPods, Samsung Galaxy Buds, Sony, and more. Find perfect earbuds for music, calls, and workouts.',
    category: 'Audio',
    niche: 'tech',
    sections: [
      {
        title: 'Key Features to Consider',
        content: `**Sound Quality**: 
- Driver size and type
- Codec support (AAC, aptX, LDAC)
- Active noise cancellation (ANC)
- Sound signature (bass, treble, balance)

**Battery Life**:
- Earbud battery (4-8 hours typical)
- Case battery (total 20-30 hours)
- Fast charging support
- Wireless charging case

**Fit and Comfort**:
- Ear tip sizes
- Wing tips for secure fit
- Weight and size
- IPX rating for sweat/water resistance`,
      },
      {
        title: 'Budget Range ($50-$100)',
        content: `**Anker Soundcore Liberty 4 NC** ($99)
- Active noise cancellation
- Good sound quality
- Long battery life
- Best for: Budget-conscious users

**JLab Go Air Pop** ($25)
- Extremely affordable
- Decent sound
- Good battery life
- Best for: First-time buyers

**Samsung Galaxy Buds FE** ($79)
- Good sound quality
- Comfortable fit
- Samsung ecosystem integration
- Best for: Samsung phone users`,
        products: ['anker-liberty-4', 'jlab-go-air', 'galaxy-buds-fe'],
      },
      {
        title: 'Mid-Range ($100-$200)',
        content: `**Apple AirPods (3rd Gen)** ($179)
- Spatial audio
- Good sound quality
- Seamless iOS integration
- Best for: iPhone users

**Sony WF-C700N** ($119)
- Active noise cancellation
- Excellent sound
- Good battery life
- Best for: Music lovers

**Samsung Galaxy Buds 2 Pro** ($199)
- Excellent ANC
- Great sound
- Comfortable fit
- Best for: Samsung users, ANC needs`,
        products: ['airpods-3', 'sony-wf-c700n', 'galaxy-buds-2-pro'],
      },
      {
        title: 'Premium ($200+)',
        content: `**Apple AirPods Pro 2** ($249)
- Best-in-class ANC
- Spatial audio
- Transparency mode
- Best for: iPhone users, premium experience

**Sony WF-1000XM5** ($299)
- Industry-leading ANC
- Excellent sound quality
- Long battery life
- Best for: Audiophiles, frequent travelers

**Bose QuietComfort Earbuds II** ($279)
- Excellent ANC
- Comfortable fit
- Great sound
- Best for: Noise cancellation priority`,
        products: ['airpods-pro-2', 'sony-wf-1000xm5', 'bose-qc-ii'],
      },
      {
        title: 'Specialized Use Cases',
        content: `**For Workouts**: Look for:
- IPX7/IPX8 water resistance
- Secure fit (wing tips)
- Sweat resistance
- Long battery life

**For Calls**: Look for:
- Multiple microphones
- Noise cancellation for calls
- Wind noise reduction
- Clear voice pickup

**For Gaming**: Look for:
- Low latency mode
- Good sound quality
- Comfortable for long sessions`,
      },
    ],
    recommendedProducts: ['airpods-pro-2', 'sony-wf-1000xm5', 'galaxy-buds-2-pro'],
    budgetRanges: [
      {
        min: 50,
        max: 100,
        label: 'Budget',
        recommendedProducts: ['anker-liberty-4', 'galaxy-buds-fe'],
      },
      {
        min: 100,
        max: 200,
        label: 'Mid-Range',
        recommendedProducts: ['airpods-3', 'sony-wf-c700n'],
      },
      {
        min: 200,
        max: 400,
        label: 'Premium',
        recommendedProducts: ['airpods-pro-2', 'sony-wf-1000xm5'],
      },
    ],
    publishedAt: '2024-12-17',
    updatedAt: '2024-12-19',
    readTime: 18,
  },
  'best-gaming-console-2024': {
    id: 'best-gaming-console-2024',
    title: 'Best Gaming Consoles 2024: PlayStation vs Xbox vs Nintendo Switch',
    description: 'Complete guide to choosing the best gaming console. Compare PlayStation 5, Xbox Series X/S, and Nintendo Switch. Find the perfect console for your gaming needs.',
    category: 'Gaming Consoles',
    niche: 'gaming',
    sections: [
      {
        title: 'Console Comparison Overview',
        content: `**PlayStation 5**:
- Exclusive games (Spider-Man, God of War, Horizon)
- DualSense controller with haptics
- Strong first-party studios
- Best for: Exclusive games, immersive experiences

**Xbox Series X/S**:
- Game Pass value
- Backward compatibility
- Cross-platform gaming
- Best for: Game Pass subscribers, value seekers

**Nintendo Switch**:
- Portable gaming
- Family-friendly games
- Unique game library
- Best for: Portable gaming, families, casual gamers`,
      },
      {
        title: 'PlayStation 5 Options',
        content: `**PS5 Disc Edition** ($499)
- 4K gaming
- Ray tracing support
- 825GB SSD
- Disc drive for physical games
- Best for: Collectors, 4K gaming

**PS5 Digital Edition** ($399)
- Same performance as disc version
- No disc drive
- Digital games only
- Best for: Digital-only gamers, budget-conscious

**Key Features**:
- DualSense adaptive triggers
- Haptic feedback
- 3D Audio
- Fast loading times`,
        products: ['ps5-disc', 'ps5-digital'],
      },
      {
        title: 'Xbox Series X/S Options',
        content: `**Xbox Series X** ($499)
- Most powerful console
- 4K gaming at 60fps
- 1TB SSD
- Disc drive
- Best for: Power users, 4K gaming

**Xbox Series S** ($299)
- 1440p gaming
- Digital-only
- 512GB SSD
- Compact design
- Best for: Budget gamers, 1080p/1440p displays

**Xbox Game Pass**:
- Access to 100+ games
- Day-one first-party releases
- Cloud gaming
- Best value in gaming`,
        products: ['xbox-series-x', 'xbox-series-s'],
      },
      {
        title: 'Nintendo Switch Options',
        content: `**Nintendo Switch OLED** ($349)
- 7-inch OLED display
- Better handheld experience
- 64GB storage
- Best for: Handheld gaming

**Nintendo Switch** ($299)
- Original model
- 6.2-inch LCD
- 32GB storage
- Best for: Budget option

**Nintendo Switch Lite** ($199)
- Handheld-only
- No TV output
- Compact design
- Best for: Portable-only gaming`,
        products: ['switch-oled', 'switch', 'switch-lite'],
      },
      {
        title: 'Which Console is Right for You?',
        content: `**Choose PlayStation 5 if**:
- You want exclusive games
- You prefer single-player experiences
- You want the best graphics
- You enjoy immersive experiences

**Choose Xbox Series X/S if**:
- You want Game Pass value
- You play multiplayer games
- You want backward compatibility
- You prefer digital games

**Choose Nintendo Switch if**:
- You want portable gaming
- You have a family
- You enjoy Nintendo exclusives
- You want casual gaming`,
      },
    ],
    recommendedProducts: ['ps5-disc', 'xbox-series-x', 'switch-oled'],
    budgetRanges: [
      {
        min: 200,
        max: 300,
        label: 'Budget',
        recommendedProducts: ['switch-lite', 'xbox-series-s'],
      },
      {
        min: 300,
        max: 400,
        label: 'Mid-Range',
        recommendedProducts: ['switch-oled', 'ps5-digital'],
      },
      {
        min: 400,
        max: 600,
        label: 'Premium',
        recommendedProducts: ['ps5-disc', 'xbox-series-x'],
      },
    ],
    publishedAt: '2024-12-16',
    updatedAt: '2024-12-19',
    readTime: 20,
  },
  'best-smartwatch-2024': {
    id: 'best-smartwatch-2024',
    title: 'Best Smartwatches 2024: Apple Watch vs Samsung vs Fitbit',
    description: 'Complete guide to choosing the best smartwatch. Compare Apple Watch, Samsung Galaxy Watch, Fitbit, and more. Find the perfect smartwatch for fitness, health, and productivity.',
    category: 'Wearables',
    niche: 'tech',
    sections: [
      {
        title: 'Smartwatch vs Fitness Tracker',
        content: `**Smartwatches**:
- Full smartphone integration
- Apps and notifications
- More expensive
- Shorter battery life
- Best for: Tech enthusiasts, productivity

**Fitness Trackers**:
- Focus on health metrics
- Longer battery life
- More affordable
- Limited smart features
- Best for: Fitness-focused users`,
      },
      {
        title: 'Budget Range ($100-$200)',
        content: `**Fitbit Charge 6** ($159)
- Excellent fitness tracking
- 7-day battery life
- Heart rate monitoring
- Best for: Fitness tracking

**Amazfit GTR 4** ($199)
- Long battery life (14 days)
- Good fitness features
- Affordable
- Best for: Budget-conscious users

**Samsung Galaxy Watch 4** ($199)
- Full smartwatch features
- Health tracking
- Good value
- Best for: Android users`,
        products: ['fitbit-charge-6', 'amazfit-gtr-4', 'galaxy-watch-4'],
      },
      {
        title: 'Mid-Range ($200-$400)',
        content: `**Apple Watch SE (2nd Gen)** ($249)
- Core Apple Watch features
- Fitness tracking
- iOS integration
- Best for: iPhone users on a budget

**Samsung Galaxy Watch 6** ($299)
- Excellent display
- Health tracking
- Good battery life
- Best for: Android users

**Garmin Venu 3** ($449)
- Advanced fitness metrics
- Long battery life
- GPS tracking
- Best for: Serious athletes`,
        products: ['apple-watch-se', 'galaxy-watch-6', 'garmin-venu-3'],
      },
      {
        title: 'Premium ($400+)',
        content: `**Apple Watch Series 9** ($399)
- Best smartwatch overall
- Advanced health features
- Seamless iOS integration
- Best for: iPhone users, premium experience

**Apple Watch Ultra 2** ($799)
- Rugged design
- Long battery life
- Advanced fitness features
- Best for: Athletes, outdoor enthusiasts

**Garmin Fenix 7** ($699)
- Professional-grade fitness
- 18+ day battery
- Advanced metrics
- Best for: Serious athletes, outdoor activities`,
        products: ['apple-watch-9', 'apple-watch-ultra-2', 'garmin-fenix-7'],
      },
      {
        title: 'Health Features to Consider',
        content: `**Essential Health Metrics**:
- Heart rate monitoring
- Sleep tracking
- Step counting
- Calorie tracking

**Advanced Features**:
- ECG (electrocardiogram)
- Blood oxygen monitoring
- Stress tracking
- Body composition analysis
- Menstrual cycle tracking

**Fitness Features**:
- GPS tracking
- Workout detection
- Recovery metrics
- Training plans`,
      },
    ],
    recommendedProducts: ['apple-watch-9', 'galaxy-watch-6', 'garmin-venu-3'],
    budgetRanges: [
      {
        min: 100,
        max: 200,
        label: 'Budget',
        recommendedProducts: ['fitbit-charge-6', 'galaxy-watch-4'],
      },
      {
        min: 200,
        max: 400,
        label: 'Mid-Range',
        recommendedProducts: ['apple-watch-se', 'galaxy-watch-6'],
      },
      {
        min: 400,
        max: 1000,
        label: 'Premium',
        recommendedProducts: ['apple-watch-9', 'apple-watch-ultra-2'],
      },
    ],
    publishedAt: '2024-12-15',
    updatedAt: '2024-12-18',
    readTime: 19,
  },
  'best-gaming-chair-2024': {
    id: 'best-gaming-chair-2024',
    title: 'Best Gaming Chairs 2024: Ergonomic Comfort for Long Sessions',
    description: 'Complete guide to choosing the best gaming chair. Compare ergonomic designs, comfort features, and price ranges. Find the perfect chair for marathon gaming sessions.',
    category: 'Gaming Accessories',
    niche: 'gaming',
    sections: [
      {
        title: 'Why You Need a Gaming Chair',
        content: `**Benefits**:
- Proper posture support
- Reduced back pain
- Comfortable for long sessions
- Adjustable features
- Better gaming performance

**Key Features**:
- Lumbar support
- Adjustable armrests
- Reclining backrest
- Headrest pillow
- High-quality materials`,
      },
      {
        title: 'Budget Range ($100-$200)',
        content: `**GTRACING Pro Series** ($149)
- Good build quality
- Adjustable features
- Comfortable padding
- Best for: Budget-conscious gamers

**Homall Gaming Chair** ($99)
- Affordable
- Basic features
- Decent comfort
- Best for: Entry-level gamers

**RESPAWN 110** ($179)
- Good value
- Comfortable
- Adjustable features
- Best for: Budget with quality`,
        products: ['gtracing-pro', 'homall-gaming', 'respawn-110'],
      },
      {
        title: 'Mid-Range ($200-$400)',
        content: `**Secretlab Titan Evo** ($429)
- Premium materials
- Excellent comfort
- Durable build
- Best for: Serious gamers

**Herman Miller x Logitech G** ($395)
- Ergonomic design
- Office-grade quality
- Excellent support
- Best for: Long sessions, professionals

**Noblechairs Hero** ($399)
- Premium build
- Great comfort
- Adjustable features
- Best for: Quality seekers`,
        products: ['secretlab-titan', 'herman-miller-logitech', 'noblechairs-hero'],
      },
      {
        title: 'Premium ($400+)',
        content: `**Herman Miller Embody Gaming** ($1,595)
- Best ergonomics
- Science-backed design
- 12-year warranty
- Best for: Professionals, long-term use

**Steelcase Gesture Gaming** ($1,299)
- Excellent adjustability
- Premium materials
- Great support
- Best for: Office and gaming

**Secretlab Titan XL** ($529)
- Large size option
- Premium materials
- Excellent build
- Best for: Larger users, premium experience`,
        products: ['herman-miller-embody', 'steelcase-gesture', 'secretlab-titan-xl'],
      },
      {
        title: 'Ergonomic Features to Look For',
        content: `**Lumbar Support**:
- Adjustable height
- Depth adjustment
- Memory foam padding

**Armrests**:
- 4D adjustment (height, width, depth, angle)
- Padded surface
- Lockable positions

**Backrest**:
- Reclining (90-180 degrees)
- Lockable positions
- Headrest pillow

**Base and Casters**:
- 5-star base
- Smooth-rolling casters
- Weight capacity`,
      },
    ],
    recommendedProducts: ['secretlab-titan', 'herman-miller-logitech', 'noblechairs-hero'],
    budgetRanges: [
      {
        min: 100,
        max: 200,
        label: 'Budget',
        recommendedProducts: ['gtracing-pro', 'respawn-110'],
      },
      {
        min: 200,
        max: 400,
        label: 'Mid-Range',
        recommendedProducts: ['secretlab-titan', 'noblechairs-hero'],
      },
      {
        min: 400,
        max: 2000,
        label: 'Premium',
        recommendedProducts: ['herman-miller-embody', 'steelcase-gesture'],
      },
    ],
    publishedAt: '2024-12-14',
    updatedAt: '2024-12-17',
    readTime: 16,
  },
  'best-vpn-2024': {
    id: 'best-vpn-2024',
    title: 'Best VPN 2024: Complete Security & Privacy Guide',
    description: 'Comprehensive guide to choosing the best VPN service. Compare NordVPN, ExpressVPN, Surfshark, and more. Protect your privacy and secure your internet connection.',
    category: 'Security Software',
    niche: 'security',
    sections: [
      {
        title: 'Why You Need a VPN',
        content: `**Privacy Protection**:
- Encrypts internet traffic
- Hides your IP address
- Prevents ISP tracking
- Protects on public Wi-Fi

**Security Benefits**:
- Secure data transmission
- Bypass geo-restrictions
- Avoid censorship
- Protect sensitive information

**Use Cases**:
- Public Wi-Fi security
- Streaming geo-blocked content
- Torrenting safely
- Remote work security`,
      },
      {
        title: 'Budget Range ($0-$5/month)',
        content: `**ProtonVPN Free** ($0)
- Unlimited data
- No logs policy
- Limited servers
- Best for: Basic privacy needs

**Surfshark** ($2.49/month)
- Unlimited devices
- Good speeds
- No logs
- Best for: Multiple devices, value

**Private Internet Access** ($2.19/month)
- Large server network
- Good privacy
- Affordable
- Best for: Budget-conscious users`,
        products: ['protonvpn-free', 'surfshark', 'pia'],
      },
      {
        title: 'Mid-Range ($5-$10/month)',
        content: `**NordVPN** ($3.99/month)
- Excellent speeds
- Strong security
- Large server network
- Best for: All-around use

**ExpressVPN** ($6.67/month)
- Fastest speeds
- Excellent reliability
- Great for streaming
- Best for: Speed priority

**CyberGhost** ($2.19/month)
- User-friendly
- Good speeds
- Streaming optimized
- Best for: Beginners`,
        products: ['nordvpn', 'expressvpn', 'cyberghost'],
      },
      {
        title: 'Premium ($10+/month)',
        content: `**ExpressVPN** ($12.95/month)
- Premium service
- Fastest speeds
- Best reliability
- Best for: Premium users

**NordVPN** ($11.95/month)
- Advanced features
- Meshnet
- Threat Protection
- Best for: Advanced users

**Features to Look For**:
- No-logs policy (verified)
- Kill switch
- DNS leak protection
- Split tunneling
- Multi-hop connections`,
        products: ['expressvpn-premium', 'nordvpn-premium'],
      },
      {
        title: 'Security Features Comparison',
        content: `**Encryption**:
- AES-256 encryption (industry standard)
- Perfect Forward Secrecy
- Secure protocols (WireGuard, OpenVPN, IKEv2)

**Privacy**:
- No-logs policy (independently audited)
- RAM-only servers
- Jurisdiction (prefer privacy-friendly countries)

**Additional Security**:
- Kill switch
- DNS leak protection
- Split tunneling
- Threat protection/malware blocking`,
      },
    ],
    recommendedProducts: ['nordvpn', 'expressvpn', 'surfshark'],
    budgetRanges: [
      {
        min: 0,
        max: 5,
        label: 'Budget',
        recommendedProducts: ['protonvpn-free', 'surfshark'],
      },
      {
        min: 5,
        max: 10,
        label: 'Mid-Range',
        recommendedProducts: ['nordvpn', 'expressvpn'],
      },
      {
        min: 10,
        max: 15,
        label: 'Premium',
        recommendedProducts: ['expressvpn-premium', 'nordvpn-premium'],
      },
    ],
    publishedAt: '2024-12-13',
    updatedAt: '2024-12-16',
    readTime: 17,
  },
  'best-gaming-monitor-2024': {
    id: 'best-gaming-monitor-2024',
    title: 'Best Gaming Monitors 2024: 4K, 1440p, and 1080p Guide',
    description: 'Complete guide to choosing the best gaming monitor. Compare refresh rates, resolutions, and panel types. Find the perfect monitor for competitive gaming and immersive experiences.',
    category: 'Monitors',
    niche: 'gaming',
    sections: [
      {
        title: 'Understanding Monitor Specifications',
        content: `**Resolution**:
- 1080p (Full HD): Budget option, good for 24-27"
- 1440p (QHD): Sweet spot, great for 27-32"
- 4K (UHD): Premium, best for 32"+ displays

**Refresh Rate**:
- 60Hz: Standard, adequate for casual gaming
- 144Hz: Smooth, great for competitive gaming
- 240Hz+: Ultra-smooth, for esports professionals

**Response Time**:
- 1ms: Best for competitive gaming
- 4-5ms: Good for most gaming
- 8ms+: Adequate for casual gaming`,
      },
      {
        title: 'Budget Range ($150-$300)',
        content: `**ASUS TUF Gaming VG249Q** ($199)
- 24" 1080p
- 144Hz refresh rate
- 1ms response time
- Best for: Competitive gaming on a budget

**Acer Nitro XF243Y** ($229)
- 24" 1080p
- 165Hz refresh rate
- Good color accuracy
- Best for: Fast-paced gaming

**MSI Optix G241** ($179)
- 24" 1080p
- 144Hz
- Good value
- Best for: Entry-level gaming`,
        products: ['asus-tuf-vg249q', 'acer-nitro-xf243y', 'msi-optix-g241'],
      },
      {
        title: 'Mid-Range ($300-$600)',
        content: `**LG 27GP850-B** ($399)
- 27" 1440p
- 180Hz refresh rate
- Nano IPS panel
- Best for: High-quality 1440p gaming

**ASUS ROG Swift PG279QM** ($599)
- 27" 1440p
- 240Hz refresh rate
- G-Sync compatible
- Best for: Competitive 1440p gaming

**Samsung Odyssey G7** ($499)
- 32" 1440p curved
- 240Hz
- VA panel
- Best for: Immersive curved gaming`,
        products: ['lg-27gp850', 'asus-rog-pg279qm', 'samsung-odyssey-g7'],
      },
      {
        title: 'Premium ($600+)',
        content: `**ASUS ROG Swift PG32UCDM** ($1,299)
- 32" 4K OLED
- 240Hz refresh rate
- Perfect blacks
- Best for: Ultimate gaming experience

**Alienware AW3423DW** ($999)
- 34" ultrawide QD-OLED
- 175Hz
- Excellent HDR
- Best for: Immersive gaming

**LG 45GR95QE** ($1,699)
- 45" ultrawide OLED
- 240Hz
- Massive screen
- Best for: Maximum immersion`,
        products: ['asus-rog-pg32ucdm', 'alienware-aw3423dw', 'lg-45gr95qe'],
      },
      {
        title: 'Panel Types Explained',
        content: `**IPS (In-Plane Switching)**:
- Best color accuracy
- Good viewing angles
- Slower response times
- Best for: Color-accurate gaming

**VA (Vertical Alignment)**:
- Best contrast ratios
- Good colors
- Better blacks than IPS
- Best for: Dark room gaming

**OLED**:
- Perfect blacks
- Best contrast
- Fast response times
- Best for: Premium experience

**TN (Twisted Nematic)**:
- Fastest response times
- Lower cost
- Poor viewing angles
- Best for: Competitive gaming only`,
      },
    ],
    recommendedProducts: ['lg-27gp850', 'asus-rog-pg279qm', 'alienware-aw3423dw'],
    budgetRanges: [
      {
        min: 150,
        max: 300,
        label: 'Budget',
        recommendedProducts: ['asus-tuf-vg249q', 'acer-nitro-xf243y'],
      },
      {
        min: 300,
        max: 600,
        label: 'Mid-Range',
        recommendedProducts: ['lg-27gp850', 'samsung-odyssey-g7'],
      },
      {
        min: 600,
        max: 2000,
        label: 'Premium',
        recommendedProducts: ['asus-rog-pg32ucdm', 'alienware-aw3423dw'],
      },
    ],
    publishedAt: '2024-12-12',
    updatedAt: '2024-12-15',
    readTime: 21,
  },
  'best-wifi-router-2024': {
    id: 'best-wifi-router-2024',
    title: 'Best Wi-Fi Routers 2024: Mesh vs Traditional Guide',
    description: 'Complete guide to choosing the best Wi-Fi router. Compare mesh systems, traditional routers, and gaming routers. Find the perfect solution for your home network.',
    category: 'Networking',
    niche: 'tech',
    sections: [
      {
        title: 'Router Types Explained',
        content: `**Traditional Routers**:
- Single device
- Good for small homes
- Lower cost
- Best for: Apartments, small houses

**Mesh Systems**:
- Multiple nodes
- Whole-home coverage
- Seamless roaming
- Best for: Large homes, multiple floors

**Gaming Routers**:
- Prioritized gaming traffic
- Low latency features
- Advanced QoS
- Best for: Gamers, low latency needs`,
      },
      {
        title: 'Budget Range ($50-$150)',
        content: `**TP-Link Archer AX21** ($79)
- Wi-Fi 6 support
- Good performance
- Affordable
- Best for: Small homes, budget users

**ASUS RT-AX55** ($99)
- Wi-Fi 6
- Good range
- Reliable
- Best for: Medium homes

**Netgear Nighthawk R6700AX** ($149)
- Wi-Fi 6
- Good performance
- Gaming features
- Best for: Budget gaming`,
        products: ['tp-link-ax21', 'asus-rt-ax55', 'netgear-r6700ax'],
      },
      {
        title: 'Mid-Range ($150-$400)',
        content: `**ASUS RT-AX86U** ($249)
- Excellent performance
- Gaming features
- Good range
- Best for: Gamers, performance

**Eero 6+ Mesh** ($199)
- Easy setup
- Whole-home coverage
- Reliable
- Best for: Large homes, ease of use

**Google Nest Wifi Pro** ($299)
- Wi-Fi 6E
- Easy management
- Good coverage
- Best for: Smart home integration`,
        products: ['asus-rt-ax86u', 'eero-6-plus', 'google-nest-wifi-pro'],
      },
      {
        title: 'Premium ($400+)',
        content: `**ASUS ROG Rapture GT-AX11000** ($599)
- Tri-band Wi-Fi 6
- Gaming optimization
- Excellent performance
- Best for: Serious gamers

**Netgear Orbi RBKE963** ($1,499)
- Wi-Fi 6E mesh
- Excellent coverage
- Fast speeds
- Best for: Large homes, premium

**ASUS ZenWiFi Pro XT12** ($699)
- Wi-Fi 6E mesh
- Excellent performance
- Great coverage
- Best for: Premium mesh system`,
        products: ['asus-rog-gt-ax11000', 'netgear-orbi-rbke963', 'asus-zenwifi-pro'],
      },
      {
        title: 'Wi-Fi Standards Explained',
        content: `**Wi-Fi 6 (802.11ax)**:
- Latest standard
- Better performance
- More efficient
- Best for: Most users

**Wi-Fi 6E**:
- Wi-Fi 6 + 6GHz band
- Less congestion
- Faster speeds
- Best for: High-performance needs

**Wi-Fi 5 (802.11ac)**:
- Older standard
- Still adequate
- Lower cost
- Best for: Budget options`,
      },
    ],
    recommendedProducts: ['asus-rt-ax86u', 'eero-6-plus', 'asus-rog-gt-ax11000'],
    budgetRanges: [
      {
        min: 50,
        max: 150,
        label: 'Budget',
        recommendedProducts: ['tp-link-ax21', 'asus-rt-ax55'],
      },
      {
        min: 150,
        max: 400,
        label: 'Mid-Range',
        recommendedProducts: ['asus-rt-ax86u', 'eero-6-plus'],
      },
      {
        min: 400,
        max: 2000,
        label: 'Premium',
        recommendedProducts: ['asus-rog-gt-ax11000', 'netgear-orbi-rbke963'],
      },
    ],
    publishedAt: '2024-12-11',
    updatedAt: '2024-12-14',
    readTime: 18,
  },
  'best-gaming-mouse-2024': {
    id: 'best-gaming-mouse-2024',
    title: 'Best Gaming Mice 2024: Wired vs Wireless Guide',
    description: 'Complete guide to choosing the best gaming mouse. Compare wired and wireless options, sensor types, and DPI settings. Find the perfect mouse for FPS, MOBA, and MMO gaming.',
    category: 'Gaming Accessories',
    niche: 'gaming',
    sections: [
      {
        title: 'Wired vs Wireless Gaming Mice',
        content: `**Wired Mice**:
- No latency concerns
- No battery needed
- Lower cost
- Cable management needed
- Best for: Competitive gaming, budget

**Wireless Mice**:
- Freedom of movement
- Modern tech (low latency)
- Battery management
- Higher cost
- Best for: Clean setup, casual gaming`,
      },
      {
        title: 'Budget Range ($20-$50)',
        content: `**Logitech G203 Lightsync** ($29)
- Excellent sensor
- Good build quality
- RGB lighting
- Best for: Entry-level gaming

**Razer DeathAdder Essential** ($39)
- Comfortable ergonomic design
- Good sensor
- Reliable
- Best for: Right-handed gamers

**SteelSeries Rival 3** ($29)
- Good sensor
- Lightweight
- Durable
- Best for: FPS gaming on budget`,
        products: ['logitech-g203', 'razer-deathadder-essential', 'steelseries-rival-3'],
      },
      {
        title: 'Mid-Range ($50-$100)',
        content: `**Logitech G Pro X Superlight** ($159)
- Ultra-lightweight (63g)
- Excellent sensor
- Wireless
- Best for: Competitive FPS

**Razer Viper V2 Pro** ($149)
- Lightweight (58g)
- Fast sensor
- Wireless
- Best for: Esports professionals

**SteelSeries Aerox 5** ($99)
- Lightweight
- Good sensor
- RGB lighting
- Best for: All-around gaming`,
        products: ['logitech-g-pro-superlight', 'razer-viper-v2-pro', 'steelseries-aerox-5'],
      },
      {
        title: 'Premium ($100+)',
        content: `**Finalmouse Starlight-12** ($189)
- Ultra-lightweight (47g)
- Premium materials
- Limited availability
- Best for: Weight-obsessed gamers

**Razer DeathAdder V3 Pro** ($149)
- Excellent sensor
- Ergonomic design
- Wireless
- Best for: Comfort and performance

**Logitech G502 X Plus** ($159)
- Many buttons
- Adjustable weight
- RGB lighting
- Best for: MMO gaming, customization`,
        products: ['finalmouse-starlight', 'razer-deathadder-v3-pro', 'logitech-g502-x-plus'],
      },
      {
        title: 'Mouse Specifications Explained',
        content: `**DPI (Dots Per Inch)**:
- Sensitivity setting
- Higher DPI = faster cursor
- Most gamers use 400-1600 DPI
- Adjustable DPI is essential

**Polling Rate**:
- How often mouse reports position
- 1000Hz (1ms) is standard
- Higher = more responsive
- Important for competitive gaming

**Sensor Type**:
- Optical: Most common, accurate
- Laser: Less accurate, works on more surfaces
- Best: High-end optical sensors

**Grip Types**:
- Palm: Full hand on mouse
- Claw: Fingertips and palm
- Fingertip: Only fingertips`,
      },
    ],
    recommendedProducts: ['logitech-g-pro-superlight', 'razer-viper-v2-pro', 'razer-deathadder-v3-pro'],
    budgetRanges: [
      {
        min: 20,
        max: 50,
        label: 'Budget',
        recommendedProducts: ['logitech-g203', 'razer-deathadder-essential'],
      },
      {
        min: 50,
        max: 100,
        label: 'Mid-Range',
        recommendedProducts: ['steelseries-aerox-5', 'logitech-g-pro-superlight'],
      },
      {
        min: 100,
        max: 200,
        label: 'Premium',
        recommendedProducts: ['finalmouse-starlight', 'razer-deathadder-v3-pro'],
      },
    ],
    publishedAt: '2024-12-10',
    updatedAt: '2024-12-13',
    readTime: 17,
  },
};

export default function BuyingGuideDetail() {
  const { id } = useParams<{ id: string }>();
  const guide = id ? mockGuides[id] : null;

  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-8">The buying guide you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/buying-guides">Browse All Guides</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={guide.title}
        description={guide.description}
        keywords={[guide.category, guide.niche]}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/buying-guides" className="hover:text-foreground">Buying Guides</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{guide.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          to="/buying-guides"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buying Guides
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={cn(
                  guide.niche === 'tech' && 'bg-tech/10 text-tech border-tech/20',
                  guide.niche === 'security' && 'bg-security/10 text-security border-security/20',
                  guide.niche === 'gaming' && 'bg-gaming/10 text-gaming border-gaming/20',
                )}>
                  {guide.category}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3" />
                  Expert Guide
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {guide.readTime} min read
                </div>
              </div>
              <h1 className="font-display font-bold text-4xl mb-4">{guide.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{guide.description}</p>
            </div>

            {/* Guide Sections */}
            <div className="space-y-8">
              {guide.sections.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {idx + 1}
                      </span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap">{section.content}</div>
                    </div>
                    
                    {/* Featured Products in Section */}
                    {section.products && section.products.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-semibold mb-3">Featured Products</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {section.products.map((productId) => (
                            <Button
                              key={productId}
                              variant="outline"
                              className="justify-start h-auto p-4"
                              asChild
                            >
                              <Link to={`/review/${productId}`}>
                                <div className="text-left">
                                  <div className="font-medium">View {productId}</div>
                                  <div className="text-xs text-muted-foreground">Product Review</div>
                                </div>
                                <ExternalLink className="h-4 w-4 ml-auto" />
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Budget Ranges Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.budgetRanges.map((range, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{range.label}</Badge>
                        <span className="text-sm font-medium">
                          ${range.min.toLocaleString()} - ${range.max.toLocaleString()}
                        </span>
                      </div>
                      {range.recommendedProducts.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {range.recommendedProducts.map((productId) => (
                            <Link
                              key={productId}
                              to={`/review/${productId}`}
                              className="text-sm text-primary hover:underline block"
                            >
                              → {productId}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Guide Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <Badge>{guide.category}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Read Time</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {guide.readTime} minutes
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Sections</div>
                  <div>{guide.sections.length} sections</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                  <div>{new Date(guide.updatedAt).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            {guide.recommendedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guide.recommendedProducts.map((productId) => (
                      <Button
                        key={productId}
                        variant="outline"
                        className="w-full justify-between"
                        asChild
                      >
                        <Link to={`/review/${productId}`}>
                          <span>{productId}</span>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Guides */}
            <Card>
              <CardHeader>
                <CardTitle>Related Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.values(mockGuides)
                    .filter(g => g.id !== guide.id && g.category === guide.category)
                    .slice(0, 3)
                    .map((relatedGuide) => (
                      <Link
                        key={relatedGuide.id}
                        to={`/buying-guide/${relatedGuide.id}`}
                        className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                      >
                        <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {relatedGuide.title}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{relatedGuide.readTime} min</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

