#!/usr/bin/env node
/**
 * Keyword Research Tool
 * Generates keyword suggestions and content calendar based on niche and topics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Keyword database for tech, security, gaming niches
const KEYWORD_DATABASE = {
  tech: {
    primary: [
      { keyword: 'artificial intelligence', volume: '350K', difficulty: 'high', intent: 'informational' },
      { keyword: 'machine learning', volume: '350K', difficulty: 'high', intent: 'informational' },
      { keyword: 'cloud computing', volume: '250K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'blockchain technology', volume: '140K', difficulty: 'high', intent: 'informational' },
      { keyword: 'quantum computing', volume: '70K', difficulty: 'high', intent: 'informational' },
      { keyword: 'iot devices', volume: '200K', difficulty: 'medium', intent: 'informational' },
      { keyword: '5g technology', volume: '180K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'edge computing', volume: '50K', difficulty: 'medium', intent: 'informational' },
    ],
    longTail: [
      { keyword: 'how does artificial intelligence work', volume: '12K', difficulty: 'low', intent: 'informational' },
      { keyword: 'best cloud computing services 2026', volume: '8K', difficulty: 'low', intent: 'commercial' },
      { keyword: 'blockchain explained for beginners', volume: '6K', difficulty: 'low', intent: 'informational' },
      { keyword: 'quantum computing vs classical computing', volume: '4K', difficulty: 'low', intent: 'informational' },
      { keyword: 'iot security best practices', volume: '5K', difficulty: 'low', intent: 'informational' },
    ],
    questions: [
      'What is artificial intelligence?',
      'How does machine learning work?',
      'What is cloud computing?',
      'How secure is blockchain?',
      'What are the benefits of 5G?',
    ]
  },
  security: {
    primary: [
      { keyword: 'cybersecurity', volume: '150K', difficulty: 'high', intent: 'informational' },
      { keyword: 'data privacy', volume: '110K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'network security', volume: '9.9K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'ransomware protection', volume: '8K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'phishing prevention', volume: '6K', difficulty: 'low', intent: 'informational' },
      { keyword: 'zero day exploit', volume: '5K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'endpoint security', volume: '4K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'identity theft protection', volume: '12K', difficulty: 'low', intent: 'commercial' },
    ],
    longTail: [
      { keyword: 'how to protect against ransomware', volume: '3K', difficulty: 'low', intent: 'informational' },
      { keyword: 'best antivirus software 2026', volume: '8K', difficulty: 'low', intent: 'commercial' },
      { keyword: 'cybersecurity tips for small business', volume: '2K', difficulty: 'low', intent: 'informational' },
      { keyword: 'how to detect phishing emails', volume: '4K', difficulty: 'low', intent: 'informational' },
      { keyword: 'data breach prevention strategies', volume: '2K', difficulty: 'low', intent: 'informational' },
    ],
    questions: [
      'What is cybersecurity?',
      'How to protect against cyber attacks?',
      'What is a zero day vulnerability?',
      'How to prevent data breaches?',
      'What is phishing and how to avoid it?',
    ]
  },
  gaming: {
    primary: [
      { keyword: 'gaming news', volume: '200K', difficulty: 'high', intent: 'informational' },
      { keyword: 'game reviews', volume: '150K', difficulty: 'medium', intent: 'commercial' },
      { keyword: 'esports', volume: '120K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'gaming hardware', volume: '80K', difficulty: 'medium', intent: 'commercial' },
      { keyword: 'gaming security', volume: '5K', difficulty: 'low', intent: 'informational' },
      { keyword: 'game streaming', volume: '60K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'vr gaming', volume: '40K', difficulty: 'medium', intent: 'informational' },
      { keyword: 'mobile gaming', volume: '90K', difficulty: 'medium', intent: 'informational' },
    ],
    longTail: [
      { keyword: 'best gaming laptops 2026', volume: '15K', difficulty: 'low', intent: 'commercial' },
      { keyword: 'how to stream games on twitch', volume: '8K', difficulty: 'low', intent: 'informational' },
      { keyword: 'gaming account security tips', volume: '3K', difficulty: 'low', intent: 'informational' },
      { keyword: 'best vr headsets for gaming', volume: '6K', difficulty: 'low', intent: 'commercial' },
      { keyword: 'esports tournaments 2026', volume: '4K', difficulty: 'low', intent: 'informational' },
    ],
    questions: [
      'What are the best games of 2026?',
      'How to improve gaming performance?',
      'What is esports?',
      'How to protect gaming accounts?',
      'What gaming hardware do I need?',
    ]
  }
};

function generateKeywordReport(niche = 'all') {
  console.log('🔍 Keyword Research Report\n');
  console.log('='.repeat(80));

  const niches = niche === 'all' ? ['tech', 'security', 'gaming'] : [niche];
  let totalKeywords = 0;

  niches.forEach(n => {
    const data = KEYWORD_DATABASE[n];
    if (!data) return;

    console.log(`\n## ${n.toUpperCase()} NICHE\n`);
    console.log('### Primary Keywords (High Volume)\n');
    data.primary.forEach(kw => {
      console.log(`- **${kw.keyword}**`);
      console.log(`  - Volume: ${kw.volume}/month`);
      console.log(`  - Difficulty: ${kw.difficulty}`);
      console.log(`  - Intent: ${kw.intent}`);
      totalKeywords++;
    });

    console.log('\n### Long-Tail Keywords (Low Competition)\n');
    data.longTail.forEach(kw => {
      console.log(`- **${kw.keyword}**`);
      console.log(`  - Volume: ${kw.volume}/month`);
      console.log(`  - Difficulty: ${kw.difficulty}`);
      console.log(`  - Intent: ${kw.intent}`);
      totalKeywords++;
    });

    console.log('\n### Question Keywords (Featured Snippets)\n');
    data.questions.forEach(q => {
      console.log(`- ${q}`);
      totalKeywords++;
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log(`Total Keywords: ${totalKeywords}`);
  console.log('='.repeat(80));
}

function generateContentCalendar(months = 3) {
  console.log('\n📅 Content Calendar Generator\n');
  console.log('='.repeat(80));

  const niches = ['tech', 'security', 'gaming'];
  const weeksPerMonth = 4;
  const postsPerWeek = 2;
  const totalPosts = months * weeksPerMonth * postsPerWeek;

  console.log(`\n**3-Month Content Calendar** (${totalPosts} posts)\n`);

  let postNumber = 1;
  for (let month = 1; month <= months; month++) {
    console.log(`\n### Month ${month}\n`);
    for (let week = 1; week <= weeksPerMonth; week++) {
      console.log(`**Week ${week}:**\n`);
      for (let post = 1; post <= postsPerWeek; post++) {
        const niche = niches[(postNumber - 1) % niches.length];
        const data = KEYWORD_DATABASE[niche];
        const keyword = data.longTail[Math.floor(Math.random() * data.longTail.length)];
        
        console.log(`${postNumber}. **[${niche.toUpperCase()}]** ${keyword.keyword}`);
        console.log(`   - Target: "${keyword.keyword}"`);
        console.log(`   - Type: ${keyword.intent === 'commercial' ? 'Review/Comparison' : 'How-To/Guide'}`);
        console.log(`   - Word Count: 800-1500 words`);
        console.log(`   - Publish: Week ${week}, Month ${month}\n`);
        postNumber++;
      }
    }
  }
}

// Generate reports
const outputPath = path.join(projectRoot, 'KEYWORD_RESEARCH_REPORT.md');
let report = `# Keyword Research Report - ${new Date().toISOString().split('T')[0]}\n\n`;

Object.keys(KEYWORD_DATABASE).forEach(niche => {
  const data = KEYWORD_DATABASE[niche];
  report += `## ${niche.toUpperCase()} Keywords\n\n`;
  
  report += `### Primary Keywords\n\n`;
  data.primary.forEach(kw => {
    report += `- **${kw.keyword}** (${kw.volume}/month, ${kw.difficulty} difficulty, ${kw.intent} intent)\n`;
  });
  
  report += `\n### Long-Tail Keywords\n\n`;
  data.longTail.forEach(kw => {
    report += `- **${kw.keyword}** (${kw.volume}/month, ${kw.difficulty} difficulty, ${kw.intent} intent)\n`;
  });
  
  report += `\n### Question Keywords\n\n`;
  data.questions.forEach(q => {
    report += `- ${q}\n`;
  });
  
  report += `\n---\n\n`;
});

fs.writeFileSync(outputPath, report);

console.log('✅ Keyword research report saved to: KEYWORD_RESEARCH_REPORT.md\n');

// Generate content calendar
generateKeywordReport('all');
generateContentCalendar(3);

const calendarPath = path.join(projectRoot, 'CONTENT_CALENDAR.md');
let calendar = `# 3-Month Content Calendar\n\n`;
calendar += `**Target:** 2-3 posts per week\n`;
calendar += `**Total Posts:** 24-36 posts\n\n`;

let postNum = 1;
for (let month = 1; month <= 3; month++) {
  calendar += `## Month ${month}\n\n`;
  for (let week = 1; week <= 4; week++) {
    calendar += `### Week ${week}\n\n`;
    for (let post = 1; post <= 2; post++) {
      const niche = ['tech', 'security', 'gaming'][(postNum - 1) % 3];
      const data = KEYWORD_DATABASE[niche];
      const keyword = data.longTail[Math.floor(Math.random() * data.longTail.length)];
      
      calendar += `${postNum}. **${keyword.keyword}**\n`;
      calendar += `   - Niche: ${niche}\n`;
      calendar += `   - Type: ${keyword.intent === 'commercial' ? 'Review' : 'Guide'}\n`;
      calendar += `   - Word Count: 800-1500\n`;
      calendar += `   - Target Keywords: ${keyword.keyword}\n\n`;
      postNum++;
    }
  }
}

fs.writeFileSync(calendarPath, calendar);
console.log('✅ Content calendar saved to: CONTENT_CALENDAR.md\n');
