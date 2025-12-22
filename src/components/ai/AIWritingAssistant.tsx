import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAI } from '@/hooks/useAI';
import { Loader2, Sparkles, Expand, Minimize2, RefreshCw, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIWritingAssistantProps {
  initialText?: string;
  onTextChange?: (text: string) => void;
}

export function AIWritingAssistant({ initialText = '', onTextChange }: AIWritingAssistantProps) {
  const [text, setText] = useState(initialText);
  const [result, setResult] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical' | 'friendly'>('professional');
  const [simplifyLevel, setSimplifyLevel] = useState<'simple' | 'intermediate' | 'advanced'>('simple');
  const { expand, simplify, rewrite, summarize, isLoading } = useAI();

  const handleExpand = async () => {
    if (!text.trim()) {
      toast({ title: 'Error', description: 'Please enter some text first', variant: 'destructive' });
      return;
    }
    try {
      const expanded = await expand(text);
      setResult(expanded);
      onTextChange?.(expanded);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSimplify = async () => {
    if (!text.trim()) {
      toast({ title: 'Error', description: 'Please enter some text first', variant: 'destructive' });
      return;
    }
    try {
      const simplified = await simplify(text, simplifyLevel);
      setResult(simplified);
      onTextChange?.(simplified);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast({ title: 'Error', description: 'Please enter some text first', variant: 'destructive' });
      return;
    }
    try {
      const rewritten = await rewrite(text, tone);
      setResult(rewritten);
      onTextChange?.(rewritten);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({ title: 'Error', description: 'Please enter some text first', variant: 'destructive' });
      return;
    }
    try {
      const summary = await summarize(text, 150);
      setResult(summary);
      onTextChange?.(summary);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUseResult = () => {
    if (result) {
      setText(result);
      setResult('');
      onTextChange?.(result);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Writing Assistant
        </CardTitle>
        <CardDescription>
          Enhance your writing with AI-powered tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Text</label>
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTextChange?.(e.target.value);
            }}
            placeholder="Enter or paste your text here..."
            className="min-h-[150px]"
          />
        </div>

        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="expand">Expand</TabsTrigger>
            <TabsTrigger value="simplify">Simplify</TabsTrigger>
            <TabsTrigger value="summarize">Summarize</TabsTrigger>
          </TabsList>

          <TabsContent value="transform" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRewrite} disabled={isLoading || !text.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rewrite Text
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="expand" className="space-y-4">
            <Button onClick={handleExpand} disabled={isLoading || !text.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Expanding...
                </>
              ) : (
                <>
                  <Expand className="mr-2 h-4 w-4" />
                  Expand Text
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="simplify" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Complexity Level</label>
              <Select value={simplifyLevel} onValueChange={(v: any) => setSimplifyLevel(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSimplify} disabled={isLoading || !text.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simplifying...
                </>
              ) : (
                <>
                  <Minimize2 className="mr-2 h-4 w-4" />
                  Simplify Text
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="summarize" className="space-y-4">
            <Button onClick={handleSummarize} disabled={isLoading || !text.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Summarize Text
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {result && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Result</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseResult}
              >
                Use This Text
              </Button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



