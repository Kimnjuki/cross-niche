import React from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PlaybookData {
  platform: { name: string; slug: string };
  scenario: string;
  scenarioSlug: string;
  officialLinks: Array<{ purpose: string; url: string }>;
  playbook: {
    disclaimer: string;
    steps: Array<{ key: string; title: string; body: string; urgency: "critical" | "important"; requiresCleanDevice?: boolean; selfReportedOnly?: boolean; officialLinkPurpose?: string }>;
    urgentSteps?: string[];
    revokeSessions?: boolean;
    backupCodes?: boolean;
    evidenceToPrepare?: string[];
    fakeRecoveryScamWarning?: string;
  };
}

export default function RecoveryPlaybookEnhanced({ playbookData }: { playbookData: PlaybookData }) {
  const { platform, scenario, officialLinks, playbook } = playbookData;
  const recoveryLink = officialLinks.find((l) => l.purpose === "recovery")?.url || "#";
  const securityLink = officialLinks.find((l) => l.purpose === "security")?.url || "#";
  const loginLink = officialLinks.find((l) => l.purpose === "login")?.url || "#";

  const criticalSteps = playbook.steps.filter((s) => s.urgency === "critical");
  const importantSteps = playbook.steps.filter((s) => s.urgency === "important");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEOHead
        title={`Recover Compromised ${platform.name} Account — ${scenario}`}
        description={`Official ${platform.name} account recovery guide for ${scenario}.`}
        url={window.location.href}
        keywords={[`${platform.name} account recovery`, `${platform.name} hacked account`, scenario.replace(/-/g, " "), "gaming account recovery"]}
        type="article"
        faqs={[
          {
            question: "Should I pay a third-party recovery service?",
            answer: "Never pay a third party. Use the official platform recovery process.",
          },
          {
            question: "How long does account recovery take?",
            answer: "Recovery time varies by platform. Most official processes take a few days to a week.",
          },
        ]}
      />
      <header className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-security/10 border border-security/20">
            <ShieldAlert className="h-6 w-6 text-security" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-security border-security">
                {platform.name}
              </Badge>
              <Badge variant="secondary">{scenario.replace(/-/g, " ")}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Recover Your Compromised {platform.name} Account
            </h1>
            <p className="text-muted-foreground">
              Official recovery playbook for {scenario.replace(/-/g, " ")}.
            </p>
          </div>
        </div>

        {/* URGENT 10-MINUTE CHECKLIST */}
        {(playbook.urgentSteps?.length ?? 0) > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-100 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Act in the Next 10 Minutes
                </h2>
                <p className="text-xs text-amber-800">
                  Every minute counts — complete these steps before the attacker locks you out further.
                </p>
              </div>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800">
              {playbook.urgentSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* NEVER PAY WARNING */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.739-3L13.732 4c-.77-2.333-2.694-2.333-3.464 0L4.262 11c-.764 1.333.198 3 1.739 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-yellow-900 uppercase tracking-wider mb-1">
                Never Pay a Third Party to Recover Your Account
              </h2>
              <p className="text-xs text-yellow-800 mb-3">
                Scammers target compromised-account victims with fake "recovery services." They take your money and disappear.
              </p>
            </div>
          </div>
          <div className="text-sm text-yellow-800 space-y-2">
            <p className="font-medium">
              The Grid Nexus does not recover accounts or request account credentials. Follow the official process only.
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Use official support channels only</li>
              <li>Never share passwords, 2FA codes, or Steam Guard codes</li>
              <li>Never wire money or send crypto to "recovery agents"</li>
              <li>Report scam recovery offers to the platform</li>
            </ul>
          </div>
        </div>

        {/* OFFICIAL LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link
            to={loginLink}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-security/50 hover:bg-security/5 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 010.948.684l1.458 2.432a1 1 0 00.948.684h1.62a1 1 0 010 2l-2.017 3.361a1 1 0 01-1.073.636H10.98a1 1 0 01-.863-.485l-1.458-2.432A1 1 0 007.82 5H5a2 2 0 01-2-2zm0 0L4 5v17a2 2 0 002 2h14a2 2 0 002-2V7m0 0l-2.017-3.361a1 1 0 00-1.073-.636H10.98a1 1 0 01-.863-.485l-1.458-2.432A1 1 0 007.82 5H5a2 2 0 01-2-2z" />
            </svg>
            Log In
          </Link>
          <Link
            to={recoveryLink}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-security/50 hover:bg-security/5 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Recovery
          </Link>
          <Link
            to={securityLink}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-security/50 hover:bg-security/5 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security
          </Link>
        </div>
      </header>

      {/* DISCLAIMER */}
      <div className="bg-card border border-border rounded-lg p-4 mb-8 text-sm text-muted-foreground">
        <p className="font-medium mb-1">⚠ Disclaimer:</p>
        <p>{playbook.disclaimer}</p>
      </div>

      {/* RECOVERY STEPS */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-6">Recovery Steps</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {criticalSteps.map((step) => (
            <div
              key={step.key}
              className="rounded-lg border border-red-200 bg-red-50/50 p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 mt-1 text-red-600">▸</div>
                <div>
                  <h3 className="text-sm font-bold mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.body}</p>
                </div>
              </div>
              {step.requiresCleanDevice && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold text-red-700 bg-red-100">
                  Requires clean device
                </span>
              )}
              {step.selfReportedOnly && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold text-blue-700 bg-blue-100 ml-2">
                  Self-reported only
                </span>
              )}
            </div>
          ))}
          {importantSteps.length > 0 && (
            <div className="col-span-full mt-8">
              <h3 className="text-sm font-bold mb-3 text-foreground">Additional Steps</h3>
              <ul className="space-y-3 text-sm">
                {importantSteps.map((step) => (
                  <li key={step.key} className="flex items-start gap-2 pl-4">
                    <span className="mt-1 shrink-0">✓</span>
                    <div>
                      <h4 className="text-sm font-bold">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ADDITIONAL SECURITY MODULES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {playbook.revokeSessions && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Revoke All Sessions
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Sign out of all other devices and sessions immediately after regaining access. This invalidates stolen session cookies.
            </p>
            <Link to={securityLink} className="text-xs text-security underline">
              Manage sessions →
            </Link>
          </div>
        )}
        {playbook.backupCodes && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Backup Codes
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Store new recovery codes somewhere safe and offline. Without them, account recovery can take days.
            </p>
            <Link to={securityLink} className="text-xs text-security underline">
              Set up 2FA →
            </Link>
          </div>
        )}
        {(playbook.evidenceToPrepare?.length ?? 0) > 0 && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Prepare Evidence
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 mb-4">
              {playbook.evidenceToPrepare.map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span>•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* FAKE RECOVERY SCAM WARNING */}
      {playbook.fakeRecoveryScamWarning && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-1">
                ⚠ Fake Recovery Scam Alert
              </h2>
              <p className="text-xs text-red-800">{playbook.fakeRecoveryScamWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl border border-security/20 bg-security/5 p-8 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-security/10">
            <ShieldAlert className="h-6 w-6 text-security" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-3">
          Protect All Your Gaming Accounts
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Run our free Gaming Security Checkup to audit your Steam, PlayStation, Xbox, Epic Games, Riot, and Battle.net accounts in 3 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
            <Link to="/tools/gaming-security-checkup">
              Run the Security Checkup
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to="/tools/scam-check">
              Check for Scams
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

