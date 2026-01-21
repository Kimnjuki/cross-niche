import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions', className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate Schema.org FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Visual FAQ Section */}
      <section className={cn('py-12 bg-muted/30', className)}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="font-display font-bold text-3xl">{title}</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform',
                      openIndex === index && 'transform rotate-180'
                    )}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


