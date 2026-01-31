/**
 * Generate placeholder PNG icons (minimal 1x1 PNG, Chrome scales).
 * Run from chrome-extension: node generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'icons');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Minimal valid 1x1 PNG - Chrome will scale to 16/48/128
const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const buf = Buffer.from(minimalPngBase64, 'base64');

[16, 48, 128].forEach((s) => {
  const file = path.join(dir, `icon-${s}.png`);
  fs.writeFileSync(file, buf);
  console.log('Wrote', file);
});
