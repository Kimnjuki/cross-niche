/**
 * QuickAnswer – Structured "TL;DR" block optimized for featured snippets & AI Overviews.
 * 
 * Google AI Overviews pull from:
 *   - FAQPage structured data
 *   - Clear "what is X" / "how to X" first paragraphs
 *   - Bullet-point summaries
 * 
 * This component renders a visible TL;DR box + corresponding SpeakableSpecification
 * schema so voice assistants and AI overviews can reference it directly.
 */

import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAnswerProps {
  /** The question this article answers (e.g. "What is XSS?") */
  question: string;
  /** The short, scannable answer (1-3 sentences) */
  answer: string;
  /** Optional bullet points for the "key takeaways" format */
  keyPoints?: string[];
  className?: string;
}

export function QuickAnswer({ question, answer, keyPoints, className }: QuickAnswerProps) {
  return (
    <section
      className={cn(
        'quick-answer my-8 p-5 rounded-xl border border-nexus-cyan/20 bg-nexus-cyan/5',
        'shadow-sm shadow-nexus-cyan/5',
        className,
      )}
      aria-label="Quick answer"
      itemScope
      itemType="https://schema.org/Question"
    >
      {/* Hidden schema for AI overview consumption */}
      <meta itemProp="name" content={question} />
      <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="hidden" />

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-nexus-cyan mb-1 uppercase tracking-wider">
            {question}
          </p>
          <p className="text-gray-200 text-base leading-relaxed">{answer}</p>

          {keyPoints && keyPoints.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-nexus-cyan mt-1 flex-shrink-0">▸</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
