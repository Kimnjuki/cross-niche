import { useState } from 'react';
import { aiService } from '@/lib/ai/client';
import { useToast } from '@/components/ui/use-toast';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const summarize = async (text: string, maxLength?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.summarize(text, maxLength);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to summarize text';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const expand = async (text: string, context?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.expand(text, context);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to expand text';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const simplify = async (text: string, level: 'simple' | 'intermediate' | 'advanced' = 'simple') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.simplify(text, level);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to simplify text';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rewrite = async (text: string, tone: 'professional' | 'casual' | 'technical' | 'friendly' = 'professional') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.rewrite(text, tone);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rewrite text';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateTitle = async (content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateTitle(content);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate title';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeSentiment(text);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze sentiment';
      setError(errorMessage);
      return 'neutral' as const;
    } finally {
      setIsLoading(false);
    }
  };

  const checkGrammar = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.checkGrammar(text);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check grammar';
      setError(errorMessage);
      return { corrected: text, issues: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    summarize,
    expand,
    simplify,
    rewrite,
    generateTitle,
    analyzeSentiment,
    checkGrammar,
    isLoading,
    error,
  };
}



