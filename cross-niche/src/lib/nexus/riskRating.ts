/**
 * Nexus Risk Rating System
 * Translates CVSS scores into gamer-impact ratings (1-5)
 */

export interface NexusRiskRating {
  score: number; // 1-5
  label: string;
  color: string;
  description: string;
  gamerImpact: string;
  enterpriseImpact: string;
}

/**
 * Calculate Nexus Risk Rating from CVSS score and gamer impact factors
 */
export function calculateNexusRiskRating(
  cvssScore: number,
  affectsGamingHardware: boolean = false,
  affectsGamingSoftware: boolean = false,
  affectsStreaming: boolean = false,
  requiresHardwareReplacement: boolean = false
): NexusRiskRating {
  // Base rating from CVSS
  let baseScore = 1;
  if (cvssScore >= 9.0) baseScore = 5;
  else if (cvssScore >= 7.0) baseScore = 4;
  else if (cvssScore >= 4.0) baseScore = 3;
  else if (cvssScore >= 0.1) baseScore = 2;
  else baseScore = 1;

  // Adjust for gamer-specific impact
  let gamerMultiplier = 0;
  if (affectsGamingHardware) gamerMultiplier += 0.5;
  if (affectsGamingSoftware) gamerMultiplier += 0.5;
  if (affectsStreaming) gamerMultiplier += 0.3;
  if (requiresHardwareReplacement) gamerMultiplier += 1.0;

  // Calculate final score (max 5)
  const finalScore = Math.min(5, Math.ceil(baseScore + gamerMultiplier));

  return getNexusRatingDetails(finalScore);
}

/**
 * Alias for calculateNexusRiskRating for backward compatibility
 */
export function getNexusRiskRating(
  score: number,
  affectsGamingHardware: boolean = false,
  affectsGamingSoftware: boolean = false,
  affectsStreaming: boolean = false,
  requiresHardwareReplacement: boolean = false
): NexusRiskRating {
  // If score is already a Nexus score (1-5), return details directly
  if (score >= 1 && score <= 5 && score % 1 === 0) {
    return getNexusRatingDetails(Math.round(score));
  }
  // Otherwise treat as CVSS score
  return calculateNexusRiskRating(
    score,
    affectsGamingHardware,
    affectsGamingSoftware,
    affectsStreaming,
    requiresHardwareReplacement
  );
}

/**
 * Get detailed rating information
 */
export function getNexusRatingDetails(score: number): NexusRiskRating {
  const ratings: Record<number, NexusRiskRating> = {
    1: {
      score: 1,
      label: 'Minimal',
      color: 'green',
      description: 'Low impact, minimal risk to gamers',
      gamerImpact: 'No significant impact on gaming experience',
      enterpriseImpact: 'Low priority for enterprise environments',
    },
    2: {
      score: 2,
      label: 'Low',
      color: 'lime',
      description: 'Minor impact, some precautions recommended',
      gamerImpact: 'May affect specific games or configurations',
      enterpriseImpact: 'Standard security practices sufficient',
    },
    3: {
      score: 3,
      label: 'Moderate',
      color: 'yellow',
      description: 'Moderate impact, action recommended',
      gamerImpact: 'Could affect gaming performance or security',
      enterpriseImpact: 'Should be addressed in next update cycle',
    },
    4: {
      score: 4,
      label: 'High',
      color: 'orange',
      description: 'Significant impact, immediate action recommended',
      gamerImpact: 'Serious risk to gaming hardware/software or player data',
      enterpriseImpact: 'High priority, patch within 30 days',
    },
    5: {
      score: 5,
      label: 'Critical',
      color: 'red',
      description: 'Critical impact, immediate action required',
      gamerImpact: 'Severe risk requiring immediate hardware/software update or replacement',
      enterpriseImpact: 'Critical priority, emergency patch required',
    },
  };

  return ratings[score] || ratings[1];
}

/**
 * Get color class for Tailwind CSS
 */
export function getNexusColorClass(score: number): string {
  const colorMap: Record<number, string> = {
    1: 'bg-green-500',
    2: 'bg-lime-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  };
  return colorMap[score] || colorMap[1];
}

/**
 * Get border color class for badges
 */
export function getNexusBorderClass(score: number): string {
  const colorMap: Record<number, string> = {
    1: 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400',
    2: 'border-lime-500/20 bg-lime-500/10 text-lime-700 dark:text-lime-400',
    3: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    4: 'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400',
    5: 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400',
  };
  return colorMap[score] || colorMap[1];
}

