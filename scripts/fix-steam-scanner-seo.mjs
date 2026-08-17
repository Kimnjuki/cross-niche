import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/pages/tools/SteamScanner.tsx';
let content = readFileSync(filePath, 'utf8');

content = content.replace(
  /import \{ SEO \} from '@\/components\/SEO';\r?\n/,
  ''
);

content = content.replace(
  /<SEO\s*\n\s*title="Steam Security Scanner \| The Grid Nexus"\s*\n\s*description="Scan your Steam account for signs of compromise\. Check login locations, API key leaks, unauthorized trade offers, and friend request anomalies in under 2 minutes\."\s*\n\s*canonical="https:\/\/thegridnexus\.com\/tools\/steam-scanner"\s*\n\s*ogType="website"\s*\n\s*\/SEO>/,
  '<ToolPageSEO\n        title="Steam Security Scanner | The Grid Nexus"\n        description="Scan your Steam account for signs of compromise. Check login locations, API key leaks, unauthorized trade offers, and friend request anomalies in under 2 minutes."\n        slug="/tools/steam-scanner"\n        appCategory="SecurityApplication"\n      />'
);

writeFileSync(filePath, content);
console.log('Updated SteamScanner to use ToolPageSEO');
