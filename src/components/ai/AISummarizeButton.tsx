import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAI } from '@/hooks/useAI';
import { Sparkles, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AISummarizeButtonProps {
  content: string;
  title?: string;
}

export function AISummarizeButton({ content, title }: AISummarizeButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { summarize, isLoading } = useAI();
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'No content to summarize',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await summarize(content, 200);
      setSummary(result);
      setIsExpanded(true);
      toast({
        title: 'Success',
        description: 'Article summarized successfully',
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  if (summary && isExpanded) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">AI Summary</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSummarize}
      disabled={isLoading || !content.trim()}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Summarize with AI
        </>
      )}
    </Button>
  );
}



