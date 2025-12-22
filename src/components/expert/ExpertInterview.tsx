import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, User, ArrowRight } from 'lucide-react';

interface ExpertInterviewProps {
  expertName: string;
  expertTitle: string;
  quote: string;
  articleUrl?: string;
}

export function ExpertInterview({ expertName, expertTitle, quote, articleUrl }: ExpertInterviewProps) {
  return (
    <Card className="bg-gradient-to-br from-secondary/50 to-background">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{expertName}</CardTitle>
            <CardDescription>{expertTitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
          <p className="text-lg italic text-foreground pl-6">{quote}</p>
        </div>
        {articleUrl && (
          <Button variant="outline" className="w-full" asChild>
            <a href={articleUrl}>
              Read Full Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}



