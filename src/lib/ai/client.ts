import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Initialize OpenAI client
export const openai = OPENAI_API_KEY 
  ? new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true })
  : null;

// AI service abstraction layer for easy provider switching
export class AIService {
  private client: OpenAI | null;

  constructor() {
    this.client = openai;
  }

  async summarize(text: string, maxLength: number = 150): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that creates concise, informative summaries. Summarize the following content in ${maxLength} words or less.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: Math.ceil(maxLength * 1.5),
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || text.substring(0, maxLength);
    } catch (error) {
      console.error('AI summarization error:', error);
      // Fallback to simple truncation
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
  }

  async expand(text: string, context?: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a writing assistant. Expand the given text with more detail, examples, and context while maintaining the original meaning and tone.'
          },
          {
            role: 'user',
            content: context 
              ? `Context: ${context}\n\nText to expand: ${text}`
              : `Expand this text: ${text}`
          }
        ],
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('AI expansion error:', error);
      return text;
    }
  }

  async simplify(text: string, targetLevel: 'simple' | 'intermediate' | 'advanced' = 'simple'): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const levelInstructions = {
        simple: 'Explain in simple terms that anyone can understand',
        intermediate: 'Explain at an intermediate level with some technical detail',
        advanced: 'Explain at an advanced level with full technical detail'
      };

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a writing assistant. ${levelInstructions[targetLevel]}.`
          },
          {
            role: 'user',
            content: `Simplify this text: ${text}`
          }
        ],
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('AI simplification error:', error);
      return text;
    }
  }

  async rewrite(text: string, tone: 'professional' | 'casual' | 'technical' | 'friendly' = 'professional'): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const toneInstructions = {
        professional: 'Rewrite in a professional, formal tone',
        casual: 'Rewrite in a casual, conversational tone',
        technical: 'Rewrite in a technical, precise tone',
        friendly: 'Rewrite in a friendly, approachable tone'
      };

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a writing assistant. ${toneInstructions[tone]}.`
          },
          {
            role: 'user',
            content: `Rewrite this text: ${text}`
          }
        ],
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('AI rewrite error:', error);
      return text;
    }
  }

  async generateTitle(content: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a content editor. Generate a compelling, SEO-friendly title for the given content.'
          },
          {
            role: 'user',
            content: `Generate a title for this content: ${content.substring(0, 500)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      });

      return response.choices[0]?.message?.content || 'Untitled';
    } catch (error) {
      console.error('AI title generation error:', error);
      return 'Untitled';
    }
  }

  async analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis tool. Analyze the sentiment of the text and respond with only one word: "positive", "neutral", or "negative".'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 10,
      });

      const sentiment = response.choices[0]?.message?.content?.toLowerCase().trim();
      if (sentiment === 'positive' || sentiment === 'negative') {
        return sentiment;
      }
      return 'neutral';
    } catch (error) {
      console.error('AI sentiment analysis error:', error);
      return 'neutral';
    }
  }

  async checkGrammar(text: string): Promise<{ corrected: string; issues: Array<{ text: string; suggestion: string }> }> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a grammar checker. Return the corrected text and identify any grammar, spelling, or style issues. Format your response as JSON: { "corrected": "...", "issues": [{"text": "...", "suggestion": "..."}] }'
          },
          {
            role: 'user',
            content: `Check grammar: ${text}`
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        corrected: result.corrected || text,
        issues: result.issues || []
      };
    } catch (error) {
      console.error('AI grammar check error:', error);
      return { corrected: text, issues: [] };
    }
  }
}

export const aiService = new AIService();



