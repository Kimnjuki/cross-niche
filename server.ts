import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // SSR route handler
  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      // 1. Load index.html - the template is in the client folder
      let template = await vite.transformIndexHtml(
        url,
        await fs.promises.readFile(path.resolve(__dirname, 'index.html'), 'utf-8')
      );

      // 2. Create a basic HTML response with content
      const html = template
        .replace(`<!--app-html-->`, `
          <div id="root">
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <p>Loading GridNexus...</p>
            </div>
          </div>
        `)
        .replace(`<!--app-head-->`, `
          <meta name="description" content="GridNexus - Tech, Security & Gaming Intelligence">
          <meta name="robots" content="index, follow">
          <title>GridNexus - Tech, Security & Gaming Intelligence</title>
        `);

      // 3. Send the rendered HTML back
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      // If an error is caught, let Vite fix the stack trace
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log('SSR server running at http://localhost:3000');
  });
}

createServer().catch(console.error);
