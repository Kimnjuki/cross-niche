/**
 * Validates Convex env and URL in development to avoid silent failures.
 * Call from main.tsx in DEV only.
 */
export function validateConvexSetup(): boolean {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;

  const issues: Array<{
    severity: "critical" | "error" | "warning";
    message: string;
    fix: string;
  }> = [];

  if (!convexUrl) {
    issues.push({
      severity: "critical",
      message: "VITE_CONVEX_URL not set",
      fix: "Add VITE_CONVEX_URL to your .env file",
    });
  }

  if (convexUrl && typeof convexUrl === "string" && !convexUrl.startsWith("https://")) {
    issues.push({
      severity: "error",
      message: "Invalid Convex URL format",
      fix: "URL should start with https://",
    });
  }

  if (
    convexUrl &&
    typeof convexUrl === "string" &&
    !convexUrl.includes(".convex.cloud")
  ) {
    issues.push({
      severity: "warning",
      message: "URL does not look like a Convex URL",
      fix: "Check you copied the correct URL from Convex dashboard",
    });
  }

  if (issues.length > 0) {
    console.group("⚠️ Convex Setup Issues");
    issues.forEach((issue) => {
      const emoji =
        issue.severity === "critical"
          ? "🔴"
          : issue.severity === "error"
            ? "🟠"
            : "🟡";
      console.log(`${emoji} ${issue.message}`);
      console.log(`   Fix: ${issue.fix}`);
    });
    console.groupEnd();
    return false;
  }

  if (import.meta.env.DEV) {
    console.log("✅ Convex setup looks good");
  }
  return true;
}
