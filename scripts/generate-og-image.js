/**
 * Generate OG Image (1200x630px) for The Grid Nexus
 * Run with: node scripts/generate-og-image.js
 * 
 * Requires: canvas package (npm install canvas)
 * Or use the HTML generator: scripts/generate-favicons.html
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is available
let createCanvas;
try {
  const { createCanvas: cc } = require('canvas');
  createCanvas = cc;
} catch (e) {
  console.log('⚠️  Canvas package not installed. Using HTML generator instead.');
  console.log('   Open scripts/generate-favicons.html in your browser to generate images.');
  process.exit(0);
}

function generateOGImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#0f172a'); // Dark blue
  gradient.addColorStop(0.5, '#1e293b'); // Medium blue
  gradient.addColorStop(1, '#334155'); // Light blue

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Draw grid pattern overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1200; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 630);
    ctx.stroke();
  }
  for (let i = 0; i < 630; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1200, i);
    ctx.stroke();
  }

  // Main logo/icon
  const iconSize = 200;
  const iconX = 100;
  const iconY = 215;
  
  // Draw icon background with gradient
  const iconGradient = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
  iconGradient.addColorStop(0, '#3b82f6');
  iconGradient.addColorStop(0.5, '#ef4444');
  iconGradient.addColorStop(1, '#22c55e');
  
  const iconRadius = iconSize * 0.125;
  ctx.fillStyle = iconGradient;
  ctx.beginPath();
  ctx.moveTo(iconX + iconRadius, iconY);
  ctx.lineTo(iconX + iconSize - iconRadius, iconY);
  ctx.quadraticCurveTo(iconX + iconSize, iconY, iconX + iconSize, iconY + iconRadius);
  ctx.lineTo(iconX + iconSize, iconY + iconSize - iconRadius);
  ctx.quadraticCurveTo(iconX + iconSize, iconY + iconSize, iconX + iconSize - iconRadius, iconY + iconSize);
  ctx.lineTo(iconX + iconRadius, iconY + iconSize);
  ctx.quadraticCurveTo(iconX, iconY + iconSize, iconX, iconY + iconSize - iconRadius);
  ctx.lineTo(iconX, iconY + iconRadius);
  ctx.quadraticCurveTo(iconX, iconY, iconX + iconRadius, iconY);
  ctx.closePath();
  ctx.fill();

  // Draw "G" in icon
  ctx.fillStyle = 'white';
  ctx.font = `bold ${iconSize * 0.55}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('G', iconX + iconSize / 2, iconY + iconSize / 2);

  // Title text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('The Grid Nexus', iconX + iconSize + 40, iconY + 60);

  // Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '36px Arial';
  ctx.fillText('Tech • Security • Gaming Intelligence', iconX + iconSize + 40, iconY + 120);

  // Tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '24px Arial';
  ctx.fillText('Breaking News & Expert Analysis', iconX + iconSize + 40, iconY + 170);

  // Save to file
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.jpg');
  fs.writeFileSync(outputPath, buffer);
  
  console.log('✅ OG Image generated successfully!');
  console.log(`   Saved to: ${outputPath}`);
  console.log(`   Size: 1200x630px`);
}

generateOGImage();



