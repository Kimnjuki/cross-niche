/**
 * Generate minimal placeholder images for The Grid Nexus
 * Run with: node scripts/generate-placeholders.mjs
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Minimal 1x1 transparent PNG (68 bytes)
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Minimal 180x180 transparent PNG (placeholder for apple-touch-icon)
function create180x180PNG() {
  // Create a simple 180x180 PNG with the brand color
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const width = 180;
  const height = 180;
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);  // width
  ihdrData.writeUInt32BE(height, 4); // height
  ihdrData[8] = 8;   // bit depth
  ihdrData[9] = 6;   // color type (RGBA)
  ihdrData[10] = 0;  // compression
  ihdrData[11] = 0;  // filter
  ihdrData[12] = 0;  // interlace
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = createChunk('IHDR', ihdrData, ihdrCrc);
  
  // IDAT chunk (image data - simple gradient)
  const rawData = [];
  const r = 15, g = 23, b = 42; // #0f172a brand color
  
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter none
    for (let x = 0; x < width; x++) {
      // Add subtle gradient
      const factor = (x + y) / (width + height) * 0.3;
      rawData.push(
        Math.min(255, Math.floor(r * (1 + factor))),
        Math.min(255, Math.floor(g * (1 + factor))),
        Math.min(255, Math.floor(b * (1 + factor))),
        255
      );
    }
  }
  
  // Simple zlib compress
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatChunk = createChunk('IDAT', compressed, idatCrc);
  
  // IEND chunk
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = createChunk('IEND', Buffer.alloc(0), iendCrc);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data, crc) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  return crc ^ 0xFFFFFFFF;
}

async function main() {
  // Create logo.png (512x512)
  const logoPNG = await create180x180PNG();
  // Resize to 512x512 by repeating the pattern
  const scaledLogo = Buffer.alloc(512 * 512 * 4);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const srcIdx = ((y % 180) * 180 + (x % 180)) * 4;
      const dstIdx = (y * 512 + x) * 4;
      scaledLogo[dstIdx] = logoPNG[srcIdx + 16];     // R
      scaledLogo[dstIdx + 1] = logoPNG[srcIdx + 17]; // G
      scaledLogo[dstIdx + 2] = logoPNG[srcIdx + 18]; // B
      scaledLogo[dstIdx + 3] = logoPNG[srcIdx + 19]; // A
    }
  }
  
  // Re-encode scaled logo as PNG
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(512, 0);
  ihdrData.writeUInt32BE(512, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  
  const rawData = [];
  for (let y = 0; y < 512; y++) {
    rawData.push(0);
    for (let x = 0; x < 512; x++) {
      const srcIdx = ((y % 180) * 180 + (x % 180)) * 4;
      rawData.push(
        logoPNG[srcIdx + 16],
        logoPNG[srcIdx + 17],
        logoPNG[srcIdx + 18],
        logoPNG[srcIdx + 19]
      );
    }
  }
  
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  
  const iendCrc = crc32(Buffer.from('IEND'));
  
  const ihdrChunk = createChunk('IHDR', ihdrData, ihdrCrc);
  const idatChunk = createChunk('IDAT', compressed, idatCrc);
  const iendChunk = createChunk('IEND', Buffer.alloc(0), iendCrc);
  
  const logo512 = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.png'), logo512);
  console.log('✅ Generated logo.png (512x512)');
  
  // Create apple-touch-icon.png (180x180)
  const appleIcon = await create180x180PNG();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleIcon);
  console.log('✅ Generated apple-touch-icon.png (180x180)');
  
  // Create mstile-150x150.png
  const mstile = await create180x180PNG();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'mstile-150x150.png'), mstile);
  console.log('✅ Generated mstile-150x150.png');
}

main().catch(console.error);
