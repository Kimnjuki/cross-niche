import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  FileText,
  Lightbulb,
  Code,
  Globe,
  BookOpen,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIToolsProps {
  articleContent: string;
  articleTitle: string;
  className?: string;
}

interface ToolResult {
  type: string;
  content: string;
  loading?: boolean;
  error?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export function AITools({ articleContent, articleTitle, className }: AIToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, ToolResult>>({});
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock AI processing functions (in real implementation, these would call actual AI APIs)
  const generateSummary = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const sentences = articleContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints = sentences.slice(0, 3).map(s => s.trim());

    return `**TL;DR:** ${articleTitle}\n\n**Key Points:**\n${keyPoints.map(point => `• ${point}`).join('\n')}\n\n**Estimated Reading Time Saved:** ${Math.max(1, Math.floor(sentences.length * 0.3))} minutes`;
  };

  const textToSpeech = async (): Promise<string> => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(articleContent.substring(0, 5000)); // Limit for demo
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      return 'Audio playback started. Click the speaker button to stop.';
    }
    return 'Text-to-speech is not supported in your browser.';
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const translateText = async (targetLang: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock translation - in real implementation, use translation API
    const mockTranslations: Record<string, string> = {
      es: `**Traducción al Español:**\n\n${articleTitle}\n\n[Contenido traducido al español aparecería aquí...]`,
      fr: `**Traduction Française:**\n\n${articleTitle}\n\n[Le contenu traduit en français apparaîtrait ici...]`,
      de: `**Deutsche Übersetzung:**\n\n${articleTitle}\n\n[Der übersetzte Inhalt würde hier auf Deutsch erscheinen...]`,
    };

    return mockTranslations[targetLang] || `**Translation to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name}:**\n\nTranslation service would provide content here...`;
  };

  const extractKeyPoints = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const sentences = articleContent.split(/[.!?]+/).filter(s => s.trim().length > 15);
    const keyPoints = sentences.slice(0, 5);

    return `**Key Takeaways:**\n\n${keyPoints.map((point, i) => `${i + 1}. ${point.trim()}`).join('\n\n')}`;
  };

  const generateGlossary = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1800));

    const techTerms = [
      'Algorithm', 'API', 'Blockchain', 'Cloud Computing', 'Cybersecurity',
      'Encryption', 'Machine Learning', 'Neural Network', 'Quantum Computing', 'Virtual Reality'
    ];

    const foundTerms = techTerms.filter(term =>
      articleContent.toLowerCase().includes(term.toLowerCase())
    );

    if (foundTerms.length === 0) {
      return '**Technical Glossary:**\n\nNo technical terms detected in this article.';
    }

    return `**Technical Glossary:**\n\n${foundTerms.map(term => `**${term}:** ${getTermDefinition(term)}`).join('\n\n')}`;
  };

  const getTermDefinition = (term: string): string => {
    const definitions: Record<string, string> = {
      'Algorithm': 'A set of rules or processes for solving a problem or accomplishing a task.',
      'API': 'Application Programming Interface - a set of rules for accessing a software application.',
      'Blockchain': 'A distributed ledger technology that maintains a continuously growing list of records.',
      'Cloud Computing': 'The delivery of computing services over the internet.',
      'Cybersecurity': 'The practice of protecting systems, networks, and data from digital attacks.',
      'Encryption': 'The process of converting information into a code to prevent unauthorized access.',
      'Machine Learning': 'A subset of AI that enables systems to learn and improve from experience.',
      'Neural Network': 'A computing system inspired by biological neural networks.',
      'Quantum Computing': 'Computing using quantum-mechanical phenomena.',
      'Virtual Reality': 'A simulated experience that can be similar to or completely different from the real world.',
    };
    return definitions[term] || 'Definition not available.';
  };

  const generateRelatedQuestions = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const questions = [
      'What are the main challenges discussed in this article?',
      'How does this technology impact everyday users?',
      'What are the potential future developments mentioned?',
      'What are the security implications of these advancements?',
      'How can readers apply this knowledge in their work?',
    ];

    return `**Related Questions You Might Have:**\n\n${questions.map(q => `• ${q}`).join('\n')}`;
  };

  const explainCode = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Check if article contains code-like content
    const hasCode = articleContent.includes('```') || articleContent.includes('function') || articleContent.includes('class');

    if (!hasCode) {
      return '**Code Explanation:**\n\nNo code snippets detected in this article.';
    }

    return `**Code Explanation:**\n\n**Function Purpose:** The code demonstrates [concept].\n\n**Key Components:**\n• **Input:** What the function receives\n• **Processing:** How the data is transformed\n• **Output:** What the function returns\n\n**Real-world Application:** This pattern is commonly used in [industry/field] for [purpose].`;
  };

  const runTool = async (toolName: string) => {
    setActiveTool(toolName);
    setResults(prev => ({
      ...prev,
      [toolName]: { type: toolName, content: '', loading: true }
    }));

    try {
      let result: string;

      switch (toolName) {
        case 'summary':
          result = await generateSummary();
          break;
        case 'speech':
          result = await textToSpeech();
          break;
        case 'translate':
          result = await translateText(targetLanguage);
          break;
        case 'keypoints':
          result = await extractKeyPoints();
          break;
        case 'glossary':
          result = await generateGlossary();
          break;
        case 'questions':
          result = await generateRelatedQuestions();
          break;
        case 'code':
          result = await explainCode();
          break;
        default:
          result = 'Tool not implemented yet.';
      }

      setResults(prev => ({
        ...prev,
        [toolName]: { type: toolName, content: result, loading: false }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [toolName]: {
          type: toolName,
          content: '',
          loading: false,
          error: 'Failed to process request. Please try again.'
        }
      }));
    } finally {
      setActiveTool(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast({
        title: 'Copied to clipboard',
        description: 'Content has been copied successfully.',
      });
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const tools = [
    {
      id: 'summary',
      name: 'AI Summary',
      description: 'Get a TL;DR version with key points',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'speech',
      name: 'Text-to-Speech',
      description: 'Listen to the article content',
      icon: isSpeaking ? VolumeX : Volume2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      id: 'translate',
      name: 'Translate',
      description: 'Translate to other languages',
      icon: Languages,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      id: 'keypoints',
      name: 'Key Points',
      description: 'Extract main takeaways',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      id: 'glossary',
      description: 'Technical terms explained',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      id: 'questions',
      name: 'Related Questions',
      description: 'Questions you might have',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      id: 'code',
      name: 'Code Explanation',
      description: 'Explain code in the article',
      icon: Code,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">AI Content Tools</h3>
        <Badge variant="secondary" className="text-xs">
          Powered by AI
        </Badge>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          const hasResult = results[tool.id];

          return (
            <Card
              key={tool.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                hasResult && 'ring-2 ring-primary/20',
                isActive && 'ring-2 ring-primary animate-pulse'
              )}
              onClick={() => tool.id === 'speech' && isSpeaking ? stopSpeech() : runTool(tool.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2', tool.bgColor)}>
                  <Icon className={cn('h-6 w-6', tool.color)} />
                </div>
                <h4 className="font-medium text-sm mb-1">{tool.name}</h4>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
                {isActive && (
                  <Progress value={33} className="mt-2 h-1" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Language Selector for Translation */}
      {results.translate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">Translation Language:</span>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => runTool('translate')}>
                Translate Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {Object.entries(results).map(([toolId, result]) => (
        <Card key={toolId}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {(() => {
                  const tool = tools.find(t => t.id === toolId);
                  const Icon = tool?.icon;
                  return Icon ? <Icon className="h-4 w-4" /> : null;
                })()}
                {tools.find(t => t.id === toolId)?.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result.content)}
                className="h-8 px-2"
              >
                {copiedText === result.content ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {result.loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              </div>
            ) : result.error ? (
              <p className="text-destructive text-sm">{result.error}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: result.content.replace(/\n/g, '<br>') }} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Usage Notice */}
      <div className="text-xs text-muted-foreground text-center">
        AI tools are processing content in real-time. Results may vary based on content complexity.
      </div>
    </div>
  );
}