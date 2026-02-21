#!/usr/bin/env node
/**
 * On-Page SEO Audit Script
 * Checks all pages for SEO issues: titles, descriptions, H1 tags, alt text, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Running On-Page SEO Audit...\n');

const issues = {
  missingTitle: [],
  titleTooLong: [],
  duplicateTitle: [],
  missingDescription: [],
  descriptionTooLong: [],
  duplicateDescription: [],
  missingH1: [],
  multipleH1: [],
  missingAltText: [],
  missingCanonical: [],
  missingOGTags: [],
  missingSchema: []
};

const titleMap = new Map();
const descriptionMap = new Map();

// Scan React/TSX files for SEO issues
async function auditPages() {
  const pageFiles = await glob('src/pages/**/*.tsx', { cwd: projectRoot });
  
  console.log(`Found ${pageFiles.length} page files\n`);

  for (const file of pageFiles) {
    const filePath = path.join(projectRoot, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const pageName = path.basename(file, '.tsx');

    // Check for SEOHead component
    const hasSEOHead = content.includes('SEOHead');
    
    if (!hasSEOHead && !pageName.includes('Auth') && !pageName.includes('Admin')) {
      issues.missingTitle.push({ file, page: pageName });
      issues.missingDescription.push({ file, page: pageName });
    }

    // Extract title from SEOHead
    const titleMatch = content.match(/title=["']([^"']+)["']/);
    if (titleMatch) {
      const title = titleMatch[1];
      if (title.length > 60) {
        issues.titleTooLong.push({ file, page: pageName, title, length: title.length });
      }
      if (titleMap.has(title)) {
        issues.duplicateTitle.push({ file, page: pageName, title, duplicateOf: titleMap.get(title) });
      } else {
        titleMap.set(title, file);
      }
    }

    // Extract description
    const descMatch = content.match(/description=["']([^"']+)["']/);
    if (descMatch) {
      const description = descMatch[1];
      if (description.length > 160) {
        issues.descriptionTooLong.push({ file, page: pageName, description, length: description.length });
      }
      if (descriptionMap.has(description)) {
        issues.duplicateDescription.push({ file, page: pageName, description, duplicateOf: descriptionMap.get(description) });
      } else {
        descriptionMap.set(description, file);
      }
    }

    // Check for H1 tags
    const h1Matches = content.match(/<h1[^>]*>/g);
    const h1Count = h1Matches ? h1Matches.length : 0;
    if (h1Count === 0 && !pageName.includes('Auth') && !pageName.includes('Admin')) {
      issues.missingH1.push({ file, page: pageName });
    } else if (h1Count > 1) {
      issues.multipleH1.push({ file, page: pageName, count: h1Count });
    }

    // Check for images without alt
    const imgMatches = content.matchAll(/<img[^>]*>/g);
    for (const match of imgMatches) {
      if (!match[0].includes('alt=') || match[0].includes('alt=""')) {
        issues.missingAltText.push({ file, page: pageName, img: match[0].substring(0, 50) });
      }
    }

    // Check for LazyImage without alt prop
    const lazyImageMatches = content.matchAll(/<LazyImage[^>]*>/g);
    for (const match of lazyImageMatches) {
      if (!match[0].includes('alt=')) {
        issues.missingAltText.push({ file, page: pageName, img: 'LazyImage without alt' });
      }
    }
  }

  // Generate report
  console.log('='.repeat(80));
  console.log('ON-PAGE SEO AUDIT RESULTS');
  console.log('='.repeat(80));
  console.log();

  const criticalIssues = [
    { name: 'Missing Title Tags', items: issues.missingTitle, priority: 'CRITICAL' },
    { name: 'Title Tags Too Long (>60 chars)', items: issues.titleTooLong, priority: 'HIGH' },
    { name: 'Duplicate Title Tags', items: issues.duplicateTitle, priority: 'HIGH' },
    { name: 'Missing Meta Descriptions', items: issues.missingDescription, priority: 'CRITICAL' },
    { name: 'Meta Descriptions Too Long (>160 chars)', items: issues.descriptionTooLong, priority: 'HIGH' },
    { name: 'Duplicate Meta Descriptions', items: issues.duplicateDescription, priority: 'HIGH' },
    { name: 'Missing H1 Tags', items: issues.missingH1, priority: 'CRITICAL' },
    { name: 'Multiple H1 Tags', items: issues.multipleH1, priority: 'HIGH' },
    { name: 'Images Missing Alt Text', items: issues.missingAltText, priority: 'HIGH' }
  ];

  let totalIssues = 0;
  criticalIssues.forEach(({ name, items, priority }) => {
    if (items.length > 0) {
      totalIssues += items.length;
      console.log(`\n${priority}: ${name} (${items.length} pages)`);
      console.log('-'.repeat(80));
      items.slice(0, 10).forEach(item => {
        console.log(`  • ${item.page} (${item.file})`);
        if (item.title) console.log(`    Title: "${item.title}" (${item.length} chars)`);
        if (item.description) console.log(`    Description: "${item.description}" (${item.length} chars)`);
        if (item.count) console.log(`    H1 Count: ${item.count}`);
      });
      if (items.length > 10) {
        console.log(`  ... and ${items.length - 10} more`);
      }
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL ISSUES FOUND: ${totalIssues}`);
  console.log('='.repeat(80));

  // Save report
  const reportPath = path.join(projectRoot, 'SEO_AUDIT_REPORT.md');
  let report = `# On-Page SEO Audit Report - ${new Date().toISOString().split('T')[0]}\n\n`;
  report += `**Total Issues:** ${totalIssues}\n\n`;
  report += `## Issues Found\n\n`;

  criticalIssues.forEach(({ name, items, priority }) => {
    if (items.length > 0) {
      report += `### ${priority}: ${name} (${items.length} pages)\n\n`;
      items.forEach(item => {
        report += `- [ ] **${item.page}** (${item.file})\n`;
        if (item.title) report += `  - Title: "${item.title}" (${item.length} chars) → Fix: Truncate to 60 chars\n`;
        if (item.description) report += `  - Description: "${item.description}" (${item.length} chars) → Fix: Truncate to 160 chars\n`;
        if (item.count) report += `  - H1 Count: ${item.count} → Fix: Use only one H1 per page\n`;
      });
      report += '\n';
    }
  });

  fs.writeFileSync(reportPath, report);
  console.log(`\n✅ Audit report saved to: ${reportPath}\n`);
}

auditPages().catch(console.error);
