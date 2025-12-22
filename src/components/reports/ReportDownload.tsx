import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Report {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  downloadUrl?: string;
}

interface ReportDownloadProps {
  report: Report;
}

export function ReportDownload({ report }: ReportDownloadProps) {
  const handleDownload = () => {
    // In production, this would download the actual PDF
    // For now, we'll simulate it
    const link = document.createElement('a');
    link.href = report.downloadUrl || '#';
    link.download = `${report.title.replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{report.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {format(new Date(report.publishedAt), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
        <Button onClick={handleDownload} className="w-full" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Full Report (PDF)
        </Button>
      </CardContent>
    </Card>
  );
}



