# Threat Model

## Overview

This threat model identifies potential security threats to The Grid Nexus platform and its users, along with corresponding mitigations. The model covers anonymous users, members, editors, moderators, and administrative roles.

## Threat Categories

### 1. Account Takeover
- **Description**: Unauthorized access to user accounts through credential stuffing, phishing, or session hijacking.
- **Mitigations**:
  - Rate limiting on authentication attempts
  - CSRF protection on all state-changing endpoints
  - Secure HttpOnly cookies with SameSite=Strict
  - Session rotation on password change
  - Device fingerprinting for anomaly detection

### 2. IDOR (Insecure Direct Object Reference)
- **Description**: Users accessing resources they shouldn't have permission to view or modify.
- **Mitigations**:
  - Deny-by-default server-side roles and object ownership
  - All API requests validated against user permissions
  - Object-level access checks on every endpoint

### 3. Cross-Site Scripting (XSS)
- **Description**: Malicious script injection into web pages viewed by other users.
- **Mitigations**:
  - Input sanitization with maintained parsers
  - Contextual output encoding (HTML, JavaScript, CSS, URL)
  - Content Security Policy (CSP) in report-only mode initially
  - XSS test fixtures in CI pipeline

### 4. Server-Side Request Forgery (SSRF)
- **Description**: Server-side fetching of arbitrary URLs controlled by an attacker.
- **Mitigations**:
  - Isolated fetcher sandbox with no cloud identity
  - No internal network route access
  - DNS rebinding protections
  - IPv4/IPv6 address validation (block loopback/private/link-local/reserved)
  - Redirect rejection by default

### 5. Upload Abuse
- **Description**: Malicious file uploads (SVG scripts, polyglots, executable content).
- **Mitigations**:
  - Delay uploads until privacy and abuse readiness
  - Signed short-lived uploads to private quarantine
  - MIME type validation
  - SVG scripts stripped, metadata removed
  - No public buckets or arbitrary active content

### 6. Supply Chain Attacks
- **Description**: Compromised dependencies or third-party scripts.
- **Mitigations**:
  - Pinned runtime and package-manager versions with lockfiles
  - SAST, dependency/license review, SBOM generation
  - Secret scanning in CI
  - Container/IaC security checks

## ASVS Mapping (Level 2 Alignment)

| ASVS Control | Description | Status |
|---|---|---|
| V1.1-A01 | Input validation | Implemented |
| V1.1-A02 | Output encoding | Implemented |
| V1.1-A03 | Authentication controls | Implemented |
| V1.1-A04 | Session management | Implemented |
| V1.1-A05 | Access control | Implemented |
| V1.1-A06 | Cryptographic storage | Implemented |
| V1.1-A07 | Error handling | Implemented |
| V1.1-A08 | Auditing | Planned |
| V1.1-A09 | Configuration management | Implemented |
| V1.1-A10 | Client-side security | Implemented |
| V1.1-A11 | Data protection | Implemented |
| V1.1-A12 | Communication security | Implemented |
| V1.1-A13 | Time and state | Implemented |
| V1.1-A14 | Code quality | Implemented |
| V1.1-A15 | System hardening | Implemented |
| V1.1-A16 | Client-side injection | Implemented |
| V1.1-A17 | Authentication credentials | Implemented |
| V1.1-A18 | Session fixation | Implemented |
| V1.1-A19 | Password management | Implemented |
| V1.1-A20 | Account enumeration | Implemented |

**Note**: L2 alignment is a target, not certification. See `docs/security/asvs-mapping.json` for detailed mapping.

## Trust Boundaries

1. **Anonymous browser vs application API**: Public tools run in anonymous mode without authentication. Administrative tools require authenticated sessions.
2. **Application vs CMS/admin**: Public content management vs privileged administration surface.
3. **Application vs reputation/AI providers**: Public assessment engine vs external AI/ reputation service calls.
4. **Isolated fetcher vs public internet**: URL fetching service operates in quarantine with no access to application secrets.
5. **Quarantine storage vs reviewer tooling**: Uploaded evidence stored in private quarantine with restricted moderator access.
6. **CI vs production infrastructure**: Continuous integration pipeline separated from production deployment.

## Data Flows

### Assessment Flow (Anonymous)
1. User visits `/tools/steam-scanner` in anonymous mode
2. Self-assessment questions presented, no account required
3. Answers stored in browser sessionStorage only
4. Results displayed as self-reported, not a scan
5. No data transmitted to external services unless user consents

### Upload Flow (If enabled)
1. User attempts to upload evidence
2. File validated for MIME type, size, and content
3. Metadata stripped, scripts removed
4. Uploaded to private quarantine with unpredictable ID
5. Access restricted to reviewed moderator roles
6. Automatic expiry after documented TTL

## Exception Register

Any time-bound exceptions to security controls must be:
- Documented with owner and expiry date
- Reviewed by security lead before deadline
- Not assumed as permanent configuration
- Logged in exception register with justification