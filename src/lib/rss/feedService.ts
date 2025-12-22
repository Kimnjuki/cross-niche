// RSS Feed Aggregation Service
// This service handles fetching and parsing RSS/Atom feeds

export interface RSSFeed {
  id: string;
  url: string;
  title: string;
  description?: string;
  lastFetched?: string;
  userId?: string;
  tags?: string[];
}

export interface RSSItem {
  id: string;
  feedId: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  content?: string;
  imageUrl?: string;
}

// Simple RSS parser (for MVP - in production, use a proper RSS parser library)
export async function fetchRSSFeed(feedUrl: string): Promise<RSSItem[]> {
  try {
    // Use a CORS proxy for development (in production, use backend API)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
    
    const items: RSSItem[] = [];
    const entries = xmlDoc.querySelectorAll('item, entry');
    
    entries.forEach((entry, index) => {
      const title = entry.querySelector('title')?.textContent || 'Untitled';
      const link = entry.querySelector('link')?.textContent || 
                   entry.querySelector('link')?.getAttribute('href') || '';
      const description = entry.querySelector('description')?.textContent ||
                         entry.querySelector('summary')?.textContent ||
                         entry.querySelector('content')?.textContent || '';
      const pubDate = entry.querySelector('pubDate')?.textContent ||
                     entry.querySelector('published')?.textContent ||
                     entry.querySelector('updated')?.textContent || '';
      const author = entry.querySelector('author')?.textContent ||
                    entry.querySelector('creator')?.textContent || '';
      
      // Extract image
      const enclosure = entry.querySelector('enclosure');
      const mediaContent = entry.querySelector('media\\:content, content');
      const imageUrl = enclosure?.getAttribute('url') ||
                      mediaContent?.getAttribute('url') ||
                      entry.querySelector('image')?.getAttribute('url') || '';

      items.push({
        id: `${feedUrl}-${index}`,
        feedId: feedUrl,
        title,
        description,
        link,
        pubDate,
        author: author || undefined,
        content: description,
        imageUrl: imageUrl || undefined,
      });
    });

    return items;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw new Error(`Failed to fetch RSS feed: ${feedUrl}`);
  }
}

// Validate RSS feed URL
export function validateFeedURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}



