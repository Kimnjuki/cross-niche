/**
 * Heading Structure Audit Utility
 * Validates proper H1-H6 hierarchy for SEO
 */

export interface HeadingAuditResult {
  isValid: boolean;
  h1Count: number;
  h1Text: string[];
  headingHierarchy: Array<{
    level: number;
    text: string;
    issues: string[];
  }>;
  issues: string[];
  recommendations: string[];
}

/**
 * Audit heading structure on current page
 */
export function auditHeadingStructure(): HeadingAuditResult {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingHierarchy: HeadingAuditResult['headingHierarchy'] = [];
  const issues: string[] = [];
  const recommendations: string[] = [];
  const h1Elements: string[] = [];

  let previousLevel = 0;
  let hasH1 = false;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent?.trim() || '';
    const headingIssues: string[] = [];

    // Check for H1
    if (level === 1) {
      hasH1 = true;
      h1Elements.push(text);
    }

    // Check hierarchy violations
    if (index === 0 && level !== 1) {
      headingIssues.push('First heading should be H1');
      issues.push('Page missing H1 as first heading');
    }

    if (level > previousLevel + 1 && previousLevel > 0) {
      headingIssues.push(`Skipped heading level (previous was H${previousLevel}, jumped to H${level})`);
      issues.push(`Heading hierarchy violation: H${previousLevel} → H${level}`);
    }

    // Check for empty headings
    if (!text) {
      headingIssues.push('Empty heading text');
      issues.push(`H${level} has no text content`);
    }

    // Check heading length (too short or too long)
    if (text.length < 3) {
      headingIssues.push('Heading too short (less than 3 characters)');
    }
    if (text.length > 100) {
      headingIssues.push('Heading too long (over 100 characters)');
      recommendations.push(`Consider shortening H${level}: "${text.substring(0, 50)}..."`);
    }

    headingHierarchy.push({
      level,
      text: text.substring(0, 100), // Truncate for display
      issues: headingIssues
    });

    previousLevel = level;
  });

  // Check for multiple H1s
  if (h1Elements.length > 1) {
    issues.push(`Multiple H1 tags found (${h1Elements.length}). Should have only one H1 per page.`);
    recommendations.push('Remove extra H1 tags, keep only the main page title');
  }

  // Check for missing H1
  if (!hasH1) {
    issues.push('No H1 tag found on page');
    recommendations.push('Add an H1 tag with the main page title');
  }

  // Check for proper hierarchy
  if (headingHierarchy.length > 0 && headingHierarchy[0].level !== 1) {
    recommendations.push('Start with H1 tag for main page title');
  }

  // Check for keyword usage in headings
  const h2Count = headingHierarchy.filter(h => h.level === 2).length;
  if (h2Count === 0 && headingHierarchy.length > 1) {
    recommendations.push('Consider adding H2 tags to break up content sections');
  }

  return {
    isValid: issues.length === 0 && hasH1 && h1Elements.length === 1,
    h1Count: h1Elements.length,
    h1Text: h1Elements,
    headingHierarchy,
    issues,
    recommendations
  };
}

/**
 * Get heading structure as text report
 */
export function getHeadingStructureReport(): string {
  const audit = auditHeadingStructure();
  let report = '=== Heading Structure Audit ===\n\n';

  report += `Status: ${audit.isValid ? '✅ Valid' : '❌ Issues Found'}\n`;
  report += `H1 Count: ${audit.h1Count}\n\n`;

  if (audit.h1Text.length > 0) {
    report += 'H1 Text:\n';
    audit.h1Text.forEach((text, i) => {
      report += `  ${i + 1}. ${text}\n`;
    });
    report += '\n';
  }

  report += 'Heading Hierarchy:\n';
  audit.headingHierarchy.forEach((heading, i) => {
    const indent = '  '.repeat(heading.level - 1);
    report += `${indent}H${heading.level}: ${heading.text}\n`;
    if (heading.issues.length > 0) {
      heading.issues.forEach(issue => {
        report += `${indent}  ⚠️  ${issue}\n`;
      });
    }
  });

  if (audit.issues.length > 0) {
    report += '\nIssues:\n';
    audit.issues.forEach(issue => {
      report += `  ❌ ${issue}\n`;
    });
  }

  if (audit.recommendations.length > 0) {
    report += '\nRecommendations:\n';
    audit.recommendations.forEach(rec => {
      report += `  💡 ${rec}\n`;
    });
  }

  return report;
}

/**
 * Validate heading structure and log results
 */
export function validateAndLogHeadingStructure(): HeadingAuditResult {
  const audit = auditHeadingStructure();
  
  if (audit.isValid) {
    console.log('✅ Heading structure is valid');
  } else {
    console.warn('⚠️ Heading structure issues found:');
    audit.issues.forEach(issue => console.warn(`  - ${issue}`));
  }

  if (audit.recommendations.length > 0) {
    console.info('💡 Recommendations:');
    audit.recommendations.forEach(rec => console.info(`  - ${rec}`));
  }

  console.log('\n' + getHeadingStructureReport());

  return audit;
}




