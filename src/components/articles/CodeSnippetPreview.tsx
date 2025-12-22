import { Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeSnippetPreviewProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeSnippetPreview({ 
  code, 
  language = 'bash', 
  title = 'Exploit Preview',
  className 
}: CodeSnippetPreviewProps) {
  const [copied, setCopied] = useState(false);
  
  // Limit to 3 lines
  const lines = code.split('\n').slice(0, 3);
  const previewCode = lines.join('\n');
  const hasMore = code.split('\n').length > 3;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden bg-card', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
          {language && (
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded">
              {language}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="technical-data text-sm leading-relaxed text-foreground">
          {previewCode}
          {hasMore && (
            <span className="text-muted-foreground ml-2">
              {/* ... */}
            </span>
          )}
        </code>
      </pre>
      {hasMore && (
        <div className="px-4 py-2 bg-muted/30 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {code.split('\n').length - 3} more line{code.split('\n').length - 3 !== 1 ? 's' : ''} available
          </p>
        </div>
      )}
    </div>
  );
}


