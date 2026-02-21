import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeSnippetPreviewProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

/**
 * Code snippet preview component for technical deep-dives
 * Shows 3-line exploit preview in monospace block to attract pro developers
 */
export function CodeSnippetPreview({ 
  code, 
  language = 'bash', 
  title = 'Code Preview',
  className 
}: CodeSnippetPreviewProps) {
  const [copied, setCopied] = useState(false);

  // Limit to 3 lines for preview
  const previewLines = code.split('\n').slice(0, 3);
  const previewCode = previewLines.join('\n');
  const hasMore = code.split('\n').length > 3;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn('border-primary/20 bg-muted/30', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              {language}
            </Badge>
            {title && (
              <span className="text-sm font-semibold text-muted-foreground">
                {title}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <div className="relative">
          <pre className="bg-[#1e293b] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[#e2e8f0]">
            <code>{previewCode}</code>
            {hasMore && (
              <div className="mt-2 text-xs text-muted-foreground/70">
                ... {code.split('\n').length - 3} more lines
              </div>
            )}
          </pre>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              Preview
            </Badge>
          </div>
        </div>
        {hasMore && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            View full code snippet in article
          </div>
        )}
      </CardContent>
    </Card>
  );
}

