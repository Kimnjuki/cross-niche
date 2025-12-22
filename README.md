# The Grid Nexus - Cross-Niche Intelligence Platform

**Tech • Security • Gaming Intelligence**

A comprehensive platform providing breaking news, in-depth analysis, and expert guides across technology, cybersecurity, and gaming.

## 🚀 Features

### Core Features
- **Breaking News Banner** - Real-time critical security alerts
- **Nexus Risk Rating System** - Gamer-specific security scoring (1-5 scale)
- **AI-Powered Content** - Summarization, expansion, and analysis tools
- **RSS Feed Integration** - Aggregate content from multiple sources
- **Content Collections** - Organize and save articles
- **Search & Filtering** - Advanced search with difficulty level filters
- **Article Ratings** - Verge Score-style ratings (1-10 scale)
- **View & Comment Tracking** - Engagement metrics
- **Popular Stories Widget** - Trending content sidebar
- **Downloads Section** - Security tools and utilities catalog

### Security Features
- **Threat Alert Sidebar** - Real-time threat intelligence
- **Nexus Score Widget** - Global threat level indicator
- **Mitigation Guides** - Hardware-specific security guides
- **Expert Interviews** - Industry expert insights
- **Security Score Badges** - Visual risk indicators

### Content Management
- **AI Editor** - Rich text editor with AI assistance
- **Tutorials System** - Step-by-step guides with progress tracking
- **Difficulty Levels** - Beginner to Expert content classification
- **Role-Based Filtering** - Streamer, SysAdmin, Gamer views
- **SEO Optimization** - JSON-LD schema and meta tags

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn-ui + Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (Database, Auth, Storage)
- **AI Integration**: OpenAI API
- **RSS Parsing**: RSS Parser
- **Rich Text Editor**: Tiptap
- **SEO**: React Helmet Async

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cross-niche-intelligence.git
cd cross-niche-intelligence

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and OpenAI credentials

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_OPENAI_API_KEY=your_openai_key
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ai/            # AI-powered features
│   ├── articles/      # Article components
│   ├── layout/        # Layout components
│   ├── nexus/         # Nexus rating system
│   ├── threats/       # Threat alerts
│   └── ui/            # shadcn-ui components
├── contexts/          # React contexts
├── data/              # Mock data
├── hooks/              # Custom React hooks
├── integrations/       # External integrations
│   └── supabase/      # Supabase client
├── lib/                # Utility libraries
│   ├── ai/            # AI services
│   ├── nexus/         # Nexus rating logic
│   ├── rss/           # RSS feed services
│   └── seo/           # SEO utilities
├── pages/              # Page components
└── types/              # TypeScript types
```

## 🎯 Key Pages

- `/` - Homepage with featured content
- `/tech` - Technology news and analysis
- `/security` - Cybersecurity threats and guides
- `/gaming` - Gaming news and reviews
- `/guides` - Security and tech guides
- `/tutorials` - Step-by-step tutorials
- `/downloads` - Security tools downloads
- `/search` - Advanced content search
- `/editor` - AI-powered content editor
- `/collections` - User content collections
- `/rss-feeds` - RSS feed management

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder will contain the production-ready files.

### Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 📝 Development

```bash
# Development server (port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Security Features

- **Nexus Risk Rating**: Gamer-specific CVSS translation (1-5 scale)
- **Threat Intelligence**: Real-time security alerts
- **Mitigation Guides**: Hardware-specific protection steps
- **Expert Analysis**: Industry expert interviews
- **Security Scoring**: Visual risk indicators

## 📊 Competitive Advantages

- **Cross-Niche Intelligence**: Unique combination of Tech + Security + Gaming
- **Gamer-Focused Security**: Nexus Risk Rating system
- **AI-Powered Tools**: Content generation and analysis
- **Actionable Guides**: Direct threat-to-solution mapping
- **Real-Time Updates**: Breaking news and threat alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **kimathi njuki** - Initial work

## 🙏 Acknowledgments

- shadcn-ui for the component library
- Supabase for backend infrastructure
- OpenAI for AI capabilities
- Unsplash for free images

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for the gaming and security community**
