# The Grid Nexus - Cross-Niche Intelligence Platform

**Live URL**: https://thegridnexus.com

A comprehensive intelligence platform covering technology, cybersecurity, and gaming with real-time content aggregation, user authentication, and bookmarking features.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Supabase account (free tier works)

### Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd cross-niche-intelligence-main
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure Supabase**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_public_key
   VITE_APP_URL=https://thegridnexus.com
   ```
   
   To get your Supabase credentials:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project or select an existing one
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key
   - Paste them into your `.env` file

4. **Start the development server**
   ```sh
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technologies

This project is built with:

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **Supabase** - Backend (authentication, database)
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

## 📦 Build for Production

```sh
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist` directory, ready for deployment.

## 🔧 Environment Variables

Required environment variables (create a `.env` file):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `VITE_APP_URL` - Your production URL (optional, for SEO)

**Note**: Environment variables must be prefixed with `VITE_` to be accessible in the browser.

## 🚢 Deployment

### Deploying to Production

1. **Build the application**
   ```sh
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider:
   - **Vercel**: Connect your GitHub repo and deploy
   - **Netlify**: Drag and drop the `dist` folder or connect via Git
   - **Cloudflare Pages**: Connect your repo and set build command to `npm run build`

3. **Set environment variables** in your hosting provider's dashboard:
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Add `VITE_APP_URL` (optional)

4. **Configure your domain** (if using https://thegridnexus.com):
   - Point your domain to your hosting provider
   - Update DNS records as required by your provider

### Important Notes

- The application will work without Supabase credentials, but authentication and database features will be disabled
- Make sure your Supabase project has the required database tables and RLS policies configured
- For production, ensure your Supabase project allows requests from your domain

## 📝 Features

- ✅ User authentication (sign up, login, logout)
- ✅ Bookmark articles for later reading
- ✅ Real-time content from Supabase
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Dark mode support (via next-themes)

## 🐛 Troubleshooting

**Supabase connection issues:**
- Verify your `.env` file has the correct credentials
- Check that your Supabase project is active
- Ensure RLS policies allow public read access to content tables

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

**Authentication not working:**
- Verify Supabase Auth is enabled in your project
- Check browser console for error messages
- Ensure email confirmation is disabled for development (in Supabase Auth settings)
