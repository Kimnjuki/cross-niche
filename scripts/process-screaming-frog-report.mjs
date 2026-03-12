#!/usr/bin/env node
/**
 * Process Screaming Frog SEO Spider CSV Report
 * Analyzes internal_all.csv and generates fix recommendations
 * 
 * Usage: node scripts/process-screaming-frog-report.mjs [path/to/internal_all.csv]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Common Screaming Frog column names (may vary)
const COLUMN_MAPPING = {
  address: ['Address', 'URL', 'URI'],
  statusCode: ['Status Code', 'HTTP Status Code', 'Status'],
  title: ['Title 1', 'Title', 'Page Title'],
  titleLength: ['Title Length', 'Title 1 Length'],
  metaDescription: ['Meta Description 1', 'Meta Description', 'Description'],
  metaDescriptionLength: ['Meta Description 1 Length', 'Meta Description Length'],
  h1: ['H1-1', 'H1', 'H1-1'],
  h1Count: ['H1 Count', 'H1-1 Count'],
  wordCount: ['Word Count', 'Content'],
  images: ['Images', 'Image Count'],
  imagesMissingAlt: ['Images Missing Alt Text', 'Images Without Alt'],
  internalLinks: ['Internal Links', 'Inlinks'],
  externalLinks: ['External Links', 'Outlinks'],
  canonical: ['Canonical Link Element 1', 'Canonical'],
  robots: ['Meta Robots', 'Robots'],
  ogTitle: ['Open Graph Title', 'OG:Title'],
  ogDescription: ['Open Graph Description', 'OG:Description'],
  ogImage: ['Open Graph Image', 'OG:Image'],
  twitterCard: ['Twitter Card', 'Twitter:Card'],
  schema: ['Schema.org', 'Structured Data'],
  loadTime: ['Load Time', 'Response Time'],
  size: ['Size', 'Content Size'],
  depth: ['Depth', 'Crawl Depth']
};

function findColumn(columns, possibleNames) {
  for (const name of possibleNames) {
    const index = columns.findIndex(col => 
      col.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (index !== -1) return index;
  }
  return -1;
}

function analyzeReport(csvPath) {
  console.log(`\n📊 Analyzing Screaming Frog Report: ${csvPath}\n`);
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}\n`);
    console.log('📋 How to get your CSV file from Screaming Frog:');
    console.log('   1. Open Screaming Frog SEO Spider');
    console.log('   2. Go to: Mode → Spider');
    console.log('   3. Enter your website URL: https://thegridnexus.com');
    console.log('   4. Click "Start" to crawl');
    console.log('   5. After crawling, go to: Reports → Export → Internal: All');
    console.log('   6. Save as: internal_all.csv');
    console.log('   7. Place the file in the project root directory\n');
    console.log('💡 Or provide the path to your CSV file:');
    console.log(`   node scripts/process-screaming-frog-report.mjs "C:\\path\\to\\your\\internal_all.csv"\n`);
    console.log('📁 Common Screaming Frog export locations:');
    console.log('   • Desktop: %USERPROFILE%\\Desktop\\internal_all.csv');
    console.log('   • Downloads: %USERPROFILE%\\Downloads\\internal_all.csv');
    console.log('   • Documents: %USERPROFILE%\\Documents\\internal_all.csv\n');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });

  const columns = Object.keys(records[0] || {});
  console.log(`Found ${records.length} URLs\n`);
  console.log(`Columns: ${columns.join(', ')}\n`);

  // Find column indices
  const colIndices = {};
  for (const [key, possibleNames] of Object.entries(COLUMN_MAPPING)) {
    const index = findColumn(columns, possibleNames);
    if (index !== -1) {
      colIndices[key] = index;
      colIndices[key + 'Col'] = columns[index];
    }
  }

  // Analyze issues
  const issues = {
    missingTitle: [],
    duplicateTitle: [],
    titleTooLong: [],
    missingMetaDescription: [],
    duplicateMetaDescription: [],
    metaDescriptionTooLong: [],
    missingH1: [],
    multipleH1: [],
    missingAltText: [],
    missingCanonical: [],
    missingOGTags: [],
    missingTwitterCard: [],
    missingSchema: [],
    brokenLinks: [],
    redirectChains: [],
    slowPages: [],
    thinContent: []
  };

  const titleMap = new Map();
  const metaDescMap = new Map();

  records.forEach((record, index) => {
    const url = record[colIndices.addressCol] || record[columns[0]];
    const statusCode = parseInt(record[colIndices.statusCodeCol] || '200');
    
    // Status code issues
    if (statusCode === 404) {
      issues.brokenLinks.push({ url, statusCode });
    } else if (statusCode >= 300 && statusCode < 400) {
      issues.redirectChains.push({ url, statusCode });
    }

    // Title issues
    const title = record[colIndices.titleCol]?.trim();
    if (!title || title === '') {
      issues.missingTitle.push({ url, index });
    } else {
      const titleLength = parseInt(record[colIndices.titleLengthCol] || title.length);
      if (titleLength > 60) {
        issues.titleTooLong.push({ url, title, length: titleLength });
      }
      
      // Check duplicates
      if (titleMap.has(title)) {
        issues.duplicateTitle.push({ url, title, duplicateOf: titleMap.get(title) });
      } else {
        titleMap.set(title, url);
      }
    }

    // Meta description issues
    const metaDesc = record[colIndices.metaDescriptionCol]?.trim();
    if (!metaDesc || metaDesc === '') {
      issues.missingMetaDescription.push({ url, index });
    } else {
      const metaDescLength = parseInt(record[colIndices.metaDescriptionLengthCol] || metaDesc.length);
      if (metaDescLength > 160) {
        issues.metaDescriptionTooLong.push({ url, metaDesc, length: metaDescLength });
      }
      
      // Check duplicates
      if (metaDescMap.has(metaDesc)) {
        issues.duplicateMetaDescription.push({ url, metaDesc, duplicateOf: metaDescMap.get(metaDesc) });
      } else {
        metaDescMap.set(metaDesc, url);
      }
    }

    // H1 issues
    const h1 = record[colIndices.h1Col]?.trim();
    const h1Count = parseInt(record[colIndices.h1CountCol] || (h1 ? '1' : '0'));
    if (!h1 || h1 === '') {
      issues.missingH1.push({ url, index });
    } else if (h1Count > 1) {
      issues.multipleH1.push({ url, h1Count });
    }

    // Image alt text
    const imagesMissingAlt = parseInt(record[colIndices.imagesMissingAltCol] || '0');
    if (imagesMissingAlt > 0) {
      issues.missingAltText.push({ url, count: imagesMissingAlt });
    }

    // Canonical
    const canonical = record[colIndices.canonicalCol]?.trim();
    if (!canonical || canonical === '') {
      issues.missingCanonical.push({ url });
    }

    // OG Tags
    const ogTitle = record[colIndices.ogTitleCol]?.trim();
    const ogDesc = record[colIndices.ogDescriptionCol]?.trim();
    if (!ogTitle || !ogDesc) {
      issues.missingOGTags.push({ url, missing: { title: !ogTitle, description: !ogDesc } });
    }

    // Twitter Card
    const twitterCard = record[colIndices.twitterCardCol]?.trim();
    if (!twitterCard || twitterCard === '') {
      issues.missingTwitterCard.push({ url });
    }

    // Schema
    const schema = record[colIndices.schemaCol]?.trim();
    if (!schema || schema === '') {
      issues.missingSchema.push({ url });
    }

    // Performance
    const loadTime = parseFloat(record[colIndices.loadTimeCol] || '0');
    if (loadTime > 3000) { // > 3 seconds
      issues.slowPages.push({ url, loadTime });
    }

    // Content
    const wordCount = parseInt(record[colIndices.wordCountCol] || '0');
    if (wordCount < 300) {
      issues.thinContent.push({ url, wordCount });
    }
  });

  // Generate report
  console.log('='.repeat(80));
  console.log('SEO ISSUES SUMMARY');
  console.log('='.repeat(80));
  console.log();

  const criticalIssues = [
    { name: 'Missing Title Tags', items: issues.missingTitle, priority: 'CRITICAL' },
    { name: 'Duplicate Title Tags', items: issues.duplicateTitle, priority: 'HIGH' },
    { name: 'Title Tags Too Long (>60 chars)', items: issues.titleTooLong, priority: 'MEDIUM' },
    { name: 'Missing Meta Descriptions', items: issues.missingMetaDescription, priority: 'CRITICAL' },
    { name: 'Duplicate Meta Descriptions', items: issues.duplicateMetaDescription, priority: 'HIGH' },
    { name: 'Meta Descriptions Too Long (>160 chars)', items: issues.metaDescriptionTooLong, priority: 'MEDIUM' },
    { name: 'Missing H1 Tags', items: issues.missingH1, priority: 'CRITICAL' },
    { name: 'Multiple H1 Tags', items: issues.multipleH1, priority: 'HIGH' },
    { name: 'Images Missing Alt Text', items: issues.missingAltText, priority: 'HIGH' },
    { name: 'Missing Canonical Tags', items: issues.missingCanonical, priority: 'MEDIUM' },
    { name: 'Missing Open Graph Tags', items: issues.missingOGTags, priority: 'MEDIUM' },
    { name: 'Missing Twitter Card Tags', items: issues.missingTwitterCard, priority: 'LOW' },
    { name: 'Missing Schema.org Markup', items: issues.missingSchema, priority: 'MEDIUM' },
    { name: 'Broken Links (404)', items: issues.brokenLinks, priority: 'CRITICAL' },
    { name: 'Redirect Chains', items: issues.redirectChains, priority: 'HIGH' },
    { name: 'Slow Pages (>3s)', items: issues.slowPages, priority: 'MEDIUM' },
    { name: 'Thin Content (<300 words)', items: issues.thinContent, priority: 'MEDIUM' }
  ];

  let totalIssues = 0;
  criticalIssues.forEach(({ name, items, priority }) => {
    if (items.length > 0) {
      totalIssues += items.length;
      console.log(`\n${priority}: ${name} (${items.length} pages)`);
      console.log('-'.repeat(80));
      items.slice(0, 10).forEach(item => {
        if (item.url) console.log(`  • ${item.url}`);
        if (item.title) console.log(`    Title: "${item.title}" (${item.length} chars)`);
        if (item.metaDesc) console.log(`    Meta: "${item.metaDesc}" (${item.length} chars)`);
        if (item.count) console.log(`    Count: ${item.count}`);
        if (item.loadTime) console.log(`    Load Time: ${item.loadTime}ms`);
        if (item.wordCount) console.log(`    Word Count: ${item.wordCount}`);
      });
      if (items.length > 10) {
        console.log(`  ... and ${items.length - 10} more`);
      }
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL ISSUES FOUND: ${totalIssues}`);
  console.log('='.repeat(80));

  // Generate fix recommendations
  const recommendationsPath = path.join(projectRoot, 'SCREAMING_FROG_FIXES.md');
  let recommendations = `# Screaming Frog SEO Fixes - ${new Date().toISOString().split('T')[0]}\n\n`;
  recommendations += `**Total Issues:** ${totalIssues}\n\n`;
  recommendations += `## Priority Fixes\n\n`;

  criticalIssues.forEach(({ name, items, priority }) => {
    if (items.length > 0) {
      recommendations += `### ${priority}: ${name} (${items.length} pages)\n\n`;
      items.slice(0, 20).forEach(item => {
        recommendations += `- [ ] ${item.url}\n`;
        if (item.title) recommendations += `  - Title: "${item.title}" (${item.length} chars) → Fix: Truncate to 60 chars\n`;
        if (item.metaDesc) recommendations += `  - Meta: "${item.metaDesc}" (${item.length} chars) → Fix: Truncate to 160 chars\n`;
        if (item.count) recommendations += `  - Missing alt text: ${item.count} images\n`;
      });
      recommendations += '\n';
    }
  });

  fs.writeFileSync(recommendationsPath, recommendations);
  console.log(`\n✅ Fix recommendations saved to: ${recommendationsPath}\n`);

  return { issues, totalIssues };
}

// Main execution
const csvPath = process.argv[2] || path.join(projectRoot, 'internal_all.csv');
analyzeReport(csvPath);
