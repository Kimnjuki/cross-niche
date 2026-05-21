import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSummarizeArticle, useExtractKeyPoints, useExplainConcept } from '@/hooks/useAI';
import { chatCompletion } from '@/lib/ai/client';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  FileText,
  Lightbulb,
  BookOpen,
  Copy,
  Check,
  Brain,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIToolsProps {
  articleContent: string;
  articleTitle: string;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
];

export function AITools({ articleContent, articleTitle, className }: AIToolsProps) {
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [explainResult, setExplainResult] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [explainQuery, setExplainQuery] = useState('');
  const { toast } = useToast();

  const {
    result: summaryResult,
    status: summaryStatus,
    execute: runSummary,
    reset: resetSummary,
  } = useSummarizeArticle(articleTitle, articleContent);

  const {
    result: keypointResult,
    status: keypointStatus,
    execute: runKeypoints,
    reset: resetKeypoints,
  } = useExtractKeyPoints(articleTitle, articleContent);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast({ title: 'Copied', description: 'Content copied to clipboard.' });
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  }, [toast]);

  const speakArticle = useCallback(() => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      textToSpeech(articleTitle + '. ' + articleContent.replace(/<[^>]*>/g, ' ').slice(0, 4000));
      setIsSpeaking(true);
    } else {
      toast({ title: 'Text-to-speech not supported in your browser.', variant: 'destructive' });
    }
  }, [articleContent, articleTitle, isSpeaking, toast]);

  const translateArticle = useCallback(async () => {
    setTranslating(true);
    try {
      const text = await chatCompletion([
        {
          role: 'system',
          content: `Translate the following article to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}. Preserve all HTML formatting. Only return the translated text, no explanations.`,
        },
        {
          role: 'user',
          content: `Title: ${articleTitle}\n\nContent:\n${articleContent.slice(0, 3000)}`,
        },
      ], { temperature: 0.2, maxTokens: 2048 });

      setTranslationResult(text);
    } catch {
      setTranslationResult(`Translation to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name} is temporarily unavailable. Please try again later.`);
    }
    setTranslating(false);
  }, [articleContent, articleTitle, targetLanguage]);

  const handleExplain = useCallback(async () => {
    if (!explainQuery.trim()) return;
    setExplaining(true);
    try {
      const text = await chatCompletion([
        {
          role: 'system',
          content: 'Explain the following gaming/cybersecurity term in simple language for a gamer audience. Keep it under 150 words. Use analogies. Be conversational.',
        },
        { role: 'user', content: explainQuery },
      ], { temperature: 0.5, maxTokens: 256 });

      setExplainResult(text);
    } catch {
      setExplainResult(`"${explainQuery}" — This term relates to gaming security. Check our coverage for more detail.`);
    }
    setExplaining(false);
  }, [explainQuery]);

  const hasAPIKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_NVIDIA_API_KEY;

  const tools = [
    {
      id: 'summary',
      name: 'AI Summary',
      description: 'TL;DR with key takeaways',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      execute: runSummary,
      loading: summaryStatus === 'loading',
      result: summaryResult,
      onClick: runSummary,
    },
    {
      id: 'keypoints',
      name: 'Key Points',
      description: 'Main actionable takeaways',
      icon: Lightbulb,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      execute: runKeypoints,
      loading: keypointStatus === 'loading',
      result: keypointResult,
    },
    {
      id: 'speech',
      name: isSpeaking ? 'Stop' : 'Listen',
      description: isSpeaking ? 'Stop playback' : 'Read article aloud',
      icon: isSpeaking ? VolumeX : Volume2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      execute: speakArticle,
      loading: isSpeaking,
    },
    {
      id: 'translate',
      name: 'Translate',
      description: `${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}`,
      icon: Languages,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      execute: translateArticle,
      loading: translating,
      result: translationResult,
    },
    {
      id: 'explain',
      name: 'Explain Term',
      description: hasAPIKey ? 'Define any concept' : 'Terms in this article',
      icon: Brain,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      execute: handleExplain,
      loading: explaining,
      result: explainResult,
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent-purple" />
        <h3 className="font-semibold text-lg text-white">AI Content Tools</h3>
        <Badge variant="outline" className="text-[10px] border-border-subtle text-zinc-500">
          {hasAPIKey ? 'NVIDIA NIM' : 'Offline Mode'}
        </Badge>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isLoading = tool.loading;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={tool.execute}
              disabled={isLoading}
              className={`flex flex-col items-center gap-1.5 p-3 border border-border-subtle bg-surface-card hover:bg-surface-card/80 hover:border-accent-purple/30 transition-all disabled:opacity-50 ${isLoading ? 'animate-pulse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg ${tool.bgColor} flex items-center justify-center`}>
                {isLoading && tool.id !== 'speech' ? (
                  <Loader2 className={`h-4 w-4 ${tool.color} animate-spin`} />
                ) : (
                  <Icon className={`h-4 w-4 ${tool.color}`} />
                )}
              </div>
              <span className="text-xs font-medium text-zinc-300">{tool.name}</span>
              <span className="text-[10px] text-zinc-500 text-center leading-tight">{tool.description}</span>
            </button>
          );
        })}
      </div>

      {/* Language selector for translation */}
      {translationResult !== null && (
        <div className="flex items-center gap-2 pt-2">
          <Languages className="h-3.5 w-3.5 text-zinc-500" />
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-xs">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" onClick={translateArticle} disabled={translating} className="h-8 text-xs">
            Re-translate
          </Button>
        </div>
      )}

      {/* Explain Term inline input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={explainQuery}
          onChange={e => setExplainQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleExplain(); }}
          placeholder="Ask about a term (e.g., 'what is 2FA')"
          className="flex-1 bg-nexus-void/80 border border-border-default text-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-accent-purple/50"
        />
        <Button
          onClick={handleExplain}
          disabled={!explainQuery.trim() || explaining}
          size="sm"
          className="bg-accent-purple/80 hover:bg-accent-purple text-white text-xs"
        >
          {explaining ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Ask'}
        </Button>
      </div>

      {/* Results */}
      {summaryResult && (
        <ResultCard
          title="AI Summary"
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          content={summaryResult}
          onCopy={() => copyToClipboard(summaryResult)}
          copied={copiedText === summaryResult}
        />
      )}

      {keypointResult && (
        <ResultCard
          title="Key Takeaways"
          icon={<Lightbulb className="h-4 w-4 text-yellow-500" />}
          content={keypointResult}
          onCopy={() => copyToClipboard(keypointResult)}
          copied={copiedText === keypointResult}
        />
      )}

      {translationResult && (
        <ResultCard
          title={`Translation (${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name})`}
          icon={<Languages className="h-4 w-4 text-purple-500" />}
          content={translationResult}
          onCopy={() => copyToClipboard(translationResult)}
          copied={copiedText === translationResult}
        />
      )}

      {explainResult && (
        <ResultCard
          title={`What is "${explainQuery}"?`}
          icon={<Brain className="h-4 w-4 text-indigo-500" />}
          content={explainResult}
          onCopy={() => copyToClipboard(explainResult)}
          copied={copiedText === explainResult}
        />
      )}

      {/* Notice */}
      <p className="text-[10px] text-zinc-600 text-center">
        {hasAPIKey
          ? 'Powered by NVIDIA NIM — processing in real-time via API'
          : 'AI tools use built-in content analysis. Set VITE_NVIDIA_API_KEY for enhanced AI features.'}
      </p>
    </div>
  );
}

/** Internal result card component */
function ResultCard({
  title,
  icon,
  content,
  onCopy,
  copied,
}: {
  title: string;
  icon: React.ReactNode;
  content: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="border border-border-subtle bg-surface-card">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="text-zinc-500 hover:text-white p-1 transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="px-4 py-3">
        <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}

/** Simple browser TTS wrapper */
function textToSpeech(text: string) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Browser TTS not available
  }
}
