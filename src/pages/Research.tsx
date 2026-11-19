import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

/**
 * Honest stand-in for the annual report. The previous page stated unsourced
 * percentages, dollar losses, and a methodology this site did not run.
 * This page only describes datasets the build actually publishes.
 */
export default function AnnualResearchReport() {
  return (
    <Layout>
      <SEOHead
        title="State of Gaming Security 2026 Report | The Grid Nexus"
        description="Security grades for games and platforms, plus a gamer-impact triage of actively exploited vulnerabilities. Document-based, not a certification."
        url="https://thegridnexus.com/research/state-of-gaming-security-2026"
        canonical="https://thegridnexus.com/research/state-of-gaming-security-2026"
        type="article"
        keywords={['gaming security report', 'game security grades', 'CISA KEV', 'account recovery']}
      />
      <article className="container mx-auto px-4 py-10 max-w-3xl">
        <p className="text-sm text-primary mb-2">Research</p>
        <h1 className="font-display text-3xl font-bold mb-4">State of Gaming Security 2026</h1>
        <p className="text-lg text-muted-foreground mb-6">
          This page reports only what The Grid Nexus publishes: document-based security grades,
          platform security hubs, recovery guides, and a gamer-impact reading of the CISA Known
          Exploited Vulnerabilities catalog. It is not a survey, not a certification, and not a
          live scan of any account.
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          <li>11 game grades and 3 account-platform grades, with the method on the methodology page.</li>
          <li>7 platform hubs listing official domains, two-factor options, and recovery paths.</li>
          <li>56 recovery playbooks. They route you to the platform. They do not recover the account.</li>
          <li>
            A downloadable triage of gamer-relevant entries from the public CISA KEV catalog, at{' '}
            <Link className="text-primary underline" to="/research/state-of-gaming-security-2026/data.csv">
              data.csv
            </Link>
            .
          </li>
        </ul>
        <p className="mb-4">
          A grade does not mean an account was scanned or a download was certified. Corrections are
          published when a grade or guide is wrong.
        </p>
        <p className="flex flex-wrap gap-4">
          <Link className="text-primary underline" to="/games">Game grades</Link>
          <Link className="text-primary underline" to="/platforms">Platform hubs</Link>
          <Link className="text-primary underline" to="/data">Open data</Link>
          <Link className="text-primary underline" to="/methodology">Methodology</Link>
          <Link className="text-primary underline" to="/corrections">Corrections</Link>
        </p>
      </article>
    </Layout>
  );
}
