/**
 * Nexus Security Score for Gaming (nexus-001)
 * S_nexus = ((E × 40) + (M × 30) + (P × 30)) / 100
 * E = Encryption (0 or 100), M = MFA status (0 or 100), P = Privacy policy transparency (0–100).
 */

export type DataSharingPolicy = "minimal" | "standard" | "extensive" | "unknown";

/** P score (0–100) from policy: minimal=best, extensive=worst, unknown=50 */
export function privacyScoreFromPolicy(policy: DataSharingPolicy): number {
  switch (policy) {
    case "minimal":
      return 100;
    case "standard":
      return 70;
    case "extensive":
      return 30;
    case "unknown":
    default:
      return 50;
  }
}

/**
 * Compute NexusSecurityScore (0–100) from E (encryption), M (MFA), P (privacy).
 * Formula: S_nexus = (E×40 + M×30 + P×30) / 100
 * E and M are booleans → 0 or 100. P can be 0–100 (use privacyScoreFromPolicy for enum).
 */
export function calculateNexusSecurityScore(
  dataEncryption: boolean,
  accountMFA: boolean,
  dataSharingPolicy: DataSharingPolicy
): number {
  const E = dataEncryption ? 100 : 0;
  const M = accountMFA ? 100 : 0;
  const P = privacyScoreFromPolicy(dataSharingPolicy);
  return Math.round((E * 40 + M * 30 + P * 30) / 100);
}

/** Security risk for radar (inverse of security): 100 - nexusScore, so high score = low risk. */
export function securityRiskFromNexusScore(nexusSecurityScore: number): number {
  return Math.max(0, Math.min(100, 100 - nexusSecurityScore));
}
