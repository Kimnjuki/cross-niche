# Author Credential Card — Implementation Checklist

## Goal
Display a visible author credential card on all article pages, using the existing `authorProfiles` data, to strengthen E-E-A-T signals for readers and AI systems.

## Files to create/modify
- [ ] `src/components/seo/AuthorCredentialCard.tsx` — new component
- [ ] `src/pages/Article.tsx` — wire card into article page render

## Acceptance Criteria
- [ ] Card shows: author photo, name, job title, expertise badges, short bio, social links
- [ ] Falls back gracefully when author profile is unknown (shows "Editorial Team")
- [ ] Card is rendered below the article header/meta block
- [ ] Card data matches the Person schema already injected by SEOHead
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (no new errors)
- [ ] Dev server serves the card on article pages
- [ ] Verified on at least 3 article pages with different authors

## Non-Goals
- Not editing the JSON-LD schema (already correct)
- Not changing SEOHead or schemaMarkup
- Not adding author pages (already exist)
