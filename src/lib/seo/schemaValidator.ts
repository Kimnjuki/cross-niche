/**
 * Schema Markup Validator
 * Validates Schema.org JSON-LD markup
 */

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  schemaType: string;
}

/**
 * Validate Schema.org JSON-LD
 */
export async function validateSchema(schema: any): Promise<SchemaValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic structure validation
  if (!schema['@context']) {
    errors.push('Missing @context property');
  } else if (schema['@context'] !== 'https://schema.org') {
    warnings.push(`@context should be "https://schema.org", got "${schema['@context']}"`);
  }

  if (!schema['@type']) {
    errors.push('Missing @type property');
  }

  // Type-specific validation
  const schemaType = schema['@type'];
  
  switch (schemaType) {
    case 'Article':
      validateArticleSchema(schema, errors, warnings);
      break;
    case 'Organization':
      validateOrganizationSchema(schema, errors, warnings);
      break;
    case 'WebSite':
      validateWebSiteSchema(schema, errors, warnings);
      break;
    case 'BreadcrumbList':
      validateBreadcrumbSchema(schema, errors, warnings);
      break;
    case 'FAQPage':
      validateFAQSchema(schema, errors, warnings);
      break;
    case 'HowTo':
      validateHowToSchema(schema, errors, warnings);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    schemaType: schemaType || 'Unknown'
  };
}

function validateArticleSchema(schema: any, errors: string[], warnings: string[]) {
  const required = ['headline', 'datePublished', 'author', 'publisher'];
  required.forEach(field => {
    if (!schema[field]) {
      errors.push(`Article schema missing required field: ${field}`);
    }
  });

  if (schema.author && !schema.author['@type']) {
    warnings.push('Author should have @type property');
  }

  if (schema.publisher && !schema.publisher['@type']) {
    warnings.push('Publisher should have @type property');
  }

  if (schema.image && !Array.isArray(schema.image) && typeof schema.image === 'string') {
    warnings.push('Image should be an array of ImageObject or a single ImageObject');
  }
}

function validateOrganizationSchema(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) {
    errors.push('Organization schema missing required field: name');
  }
  if (!schema.url) {
    errors.push('Organization schema missing required field: url');
  }
}

function validateWebSiteSchema(schema: any, errors: string[], warnings: string[]) {
  if (!schema.url) {
    errors.push('WebSite schema missing required field: url');
  }
  if (schema.potentialAction && !schema.potentialAction['@type']) {
    warnings.push('potentialAction should have @type property');
  }
}

function validateBreadcrumbSchema(schema: any, errors: string[], warnings: string[]) {
  if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
    errors.push('BreadcrumbList schema missing itemListElement array');
  } else {
    schema.itemListElement.forEach((item: any, index: number) => {
      if (!item['@type']) {
        errors.push(`BreadcrumbList item ${index} missing @type`);
      }
      if (!item.name) {
        errors.push(`BreadcrumbList item ${index} missing name`);
      }
      if (!item.item) {
        errors.push(`BreadcrumbList item ${index} missing item URL`);
      }
      if (item.position !== index + 1) {
        warnings.push(`BreadcrumbList item ${index} position should be ${index + 1}, got ${item.position}`);
      }
    });
  }
}

function validateFAQSchema(schema: any, errors: string[], warnings: string[]) {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push('FAQPage schema missing mainEntity array');
  } else {
    schema.mainEntity.forEach((item: any, index: number) => {
      if (!item['@type'] || item['@type'] !== 'Question') {
        errors.push(`FAQPage item ${index} should have @type: Question`);
      }
      if (!item.name) {
        errors.push(`FAQPage item ${index} missing question name`);
      }
      if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
        errors.push(`FAQPage item ${index} missing acceptedAnswer.text`);
      }
    });
  }
}

function validateHowToSchema(schema: any, errors: string[], warnings: string[]) {
  if (!schema.name) {
    errors.push('HowTo schema missing required field: name');
  }
  if (!schema.step || !Array.isArray(schema.step)) {
    errors.push('HowTo schema missing step array');
  } else {
    schema.step.forEach((step: any, index: number) => {
      if (!step['@type'] || step['@type'] !== 'HowToStep') {
        errors.push(`HowTo step ${index} should have @type: HowToStep`);
      }
      if (!step.name) {
        errors.push(`HowTo step ${index} missing name`);
      }
      if (!step.text) {
        errors.push(`HowTo step ${index} missing text`);
      }
    });
  }
}

/**
 * Validate all schemas on current page
 */
export function validatePageSchemas(): SchemaValidationResult[] {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const results: SchemaValidationResult[] = [];

  scripts.forEach((script) => {
    try {
      const schema = JSON.parse(script.textContent || '{}');
      validateSchema(schema).then(result => {
        results.push(result);
        console.log('Schema Validation:', result);
      });
    } catch (error) {
      results.push({
        isValid: false,
        errors: [`Invalid JSON: ${error}`],
        warnings: [],
        schemaType: 'Unknown'
      });
    }
  });

  return results;
}

/**
 * Test schema with Google Rich Results Test API (requires API key)
 */
export async function testWithGoogleRichResults(schema: any, apiKey?: string): Promise<any> {
  if (!apiKey) {
    console.warn('Google Rich Results Test API key not provided. Use Google Rich Results Test tool manually: https://search.google.com/test/rich-results');
    return null;
  }

  const url = 'https://search.google.com/test/rich-results';
  // Note: This would require server-side implementation or using Google's API
  // For now, return instructions
  return {
    message: 'Use Google Rich Results Test tool: https://search.google.com/test/rich-results',
    instructions: [
      '1. Go to https://search.google.com/test/rich-results',
      '2. Enter your page URL or paste the JSON-LD code',
      '3. Click "Test URL" or "Test Code"',
      '4. Review validation results'
    ]
  };
}




