/**
 * Nexus Copilot - In-Article AI Reading Assistant
 * 
 * A floating chat widget embedded on every article page.
 * Powered by Anthropic's API with article content injected as context.
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  Send,
  X,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  BookOpen,
  Lightbulb,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConvex, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface NexusCopilotWidgetProps {
  articleId: Id<'content'>;
  articleTitle: string;
  articleContent: string;
  skillLevel?: 'beginner' | 'intermediate' | 'expert';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedArticles?: Array<{
    _id: Id<'content'>;
    title: string;
    slug: string;
    url: string;
  }>;
  rating?: 'positive' | 'negative';
}

type SkillLevel = 'beginner' | 'intermediate' | 'expert';

export function NexusCopilotWidget({
  articleId,
  articleTitle,
  articleContent,
  skillLevel: initialSkillLevel = 'intermediate',
}: NexusCopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(initialSkillLevel);
  const [showSkillSelector, setShowSkillSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const convex = useConvex();

  // Show widget after 30 seconds or 40% scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage >= 40) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick action chips
  const quickActions = [
    { label: 'Explain simply', icon: BookOpen, query: 'Can you explain this article in simpler terms?' },
    { label: 'Key takeaways', icon: Lightbulb, query: 'What are the key takeaways from this article?' },
    { label: "What's next?", icon: Compass, query: 'Based on this article, what should I read next?' },
  ];

  // Handle sending a message
  const handleSend = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the Nexus AI action
      const result = await convex.action(api.nexusAI.askNexusCopilot, {
        articleId,
        articleTitle,
        articleContent,
        userQuestion: query,
        skillLevel,
        conversationHistory: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        relatedArticles: result.relatedArticles,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Copilot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rating a response
  const handleRate = async (messageId: string, rating: 'positive' | 'negative') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, rating } : m))
    );

    try {
      await convex.mutation(api.nexusAI.rateCopilotResponse, {
        sessionId: messages[0]?.id || 'session',
        rating,
      });
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  // Format the response with markdown-like formatting
  const formatResponse = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Links
        line = line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
        // List items
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return `<li class="ml-4 list-disc">${line.substring(2)}</li>`;
        }
        return `<p class="mb-2">${line}</p>`;
      })
      .join('');
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            'relative h-14 w-14 rounded-full shadow-lg transition-all',
            'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700',
            'animate-pulse-once'
          )}
        >
          <Sparkles className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </Button>
      ) : (
        /* Main Panel */
        <Card
          ref={panelRef}
          className={cn(
            'w-96 max-h-[600px] flex flex-col',
            'shadow-2xl border-0',
            'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'
          )}
        >
          {/* Header */}
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Nexus Copilot</CardTitle>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {skillLevel === 'beginner' ? '🌱 Beginner' : skillLevel === 'intermediate' ? '🌿 Intermediate' : '🌳 Expert'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 p-0"
                      onClick={() => setShowSkillSelector(!showSkillSelector)}
                    >
                      <ChevronDown className={cn('h-3 w-3 transition-transform', showSkillSelector && 'rotate-180')} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  AI
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Skill Level Selector */}
            {showSkillSelector && (
              <div className="flex gap-1 mt-2">
                {(['beginner', 'intermediate', 'expert'] as SkillLevel[]).map((level) => (
                  <Button
                    key={level}
                    variant={skillLevel === level ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setSkillLevel(level);
                      setShowSkillSelector(false);
                    }}
                  >
                    {level === 'beginner' ? '🌱 Simple' : level === 'intermediate' ? '🌿 Standard' : '🌳 Deep'}
                  </Button>
                ))}
              </div>
            )}
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Ask Nexus AI</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  I can help explain this article, answer questions, or suggest what to read next.
                </p>

                {/* Quick Actions */}
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => handleSend(action.query)}
                    >
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                        message.role === 'user'
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : 'bg-gradient-to-r from-cyan-500 to-purple-600'
                      )}
                    >
                      {message.role === 'user' ? (
                        <span className="text-xs font-medium">You</span>
                      ) : (
                        <Sparkles className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'flex-1',
                        message.role === 'user' ? 'text-right' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'inline-block p-3 rounded-lg text-sm',
                          message.role === 'user'
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : 'bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800'
                        )}
                      >
                        {message.role === 'assistant' ? (
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: formatResponse(message.content) }}
                          />
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>

                      {/* Related Articles */}
                      {message.relatedArticles && message.relatedArticles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">Related articles:</p>
                          {message.relatedArticles.map((article) => (
                            <a
                              key={article._id}
                              href={article.url}
                              className="block text-xs text-primary hover:underline truncate"
                            >
                              {article.title}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Rating */}
                      {message.role === 'assistant' && !message.rating && (
                        <div className="flex gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleRate(message.id, 'positive')}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleRate(message.id, 'negative')}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          {/* Input */}
          <div className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground mt-1 text-center">
              AI responses may vary. Always verify critical information.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}