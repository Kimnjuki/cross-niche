/**
 * Content Quality Checker for AdSense Compliance
 * Ensures pages meet minimum content requirements before showing ads
 */

import React, { useEffect, useState } from 'react';

interface ContentQualityCheckerProps {
  children: React.ReactNode;
  onContentQualityChange?: (hasQuality: boolean, wordCount: number) => void;
}

export function ContentQualityChecker({ 
  children, 
  onContentQualityChange 
}: ContentQualityCheckerProps) {
  const [wordCount, setWordCount] = useState(0);
  const [hasQualityContent, setHasQualityContent] = useState(false);

  useEffect(() => {
    const analyzeContent = () => {
      // Get all text content from the page
      const textContent = document.body?.innerText || '';
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
      const count = words.length;
      
      // Quality criteria based on AdSense policies
      const hasMinimumWords = count >= 300; // Minimum word count
      const hasSubstantialContent = count >= 500; // Better content threshold
      const hasUniqueContent = checkUniqueContent(textContent);
      const hasMeaningfulContent = checkMeaningfulContent(textContent);
      
      const isQualityContent = hasMinimumWords && hasUniqueContent && hasMeaningfulContent;
      
      setWordCount(count);
      setHasQualityContent(isQualityContent);
      
      // Notify parent component
      if (onContentQualityChange) {
        onContentQualityChange(isQualityContent, count);
      }
      
      // Log for debugging
      if (import.meta.env.DEV) {
        console.log('Content Quality Analysis:', {
          wordCount: count,
          hasMinimumWords,
          hasSubstantialContent,
          hasUniqueContent,
          hasMeaningfulContent,
          isQualityContent
        });
      }
    };

    // Analyze content when component mounts and when DOM changes
    analyzeContent();
    
    // Set up a mutation observer to detect content changes
    const observer = new MutationObserver(() => {
      analyzeContent();
    });
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    
    return () => observer.disconnect();
  }, [onContentQualityChange]);

  const checkUniqueContent = (text: string): boolean => {
    // Check for unique content patterns
    const uniquePatterns = [
      /\b(the|a|an)\s+(?:recent|latest|new)\s+/i, // Generic phrases
      /\b(click|learn|find|discover)\s+(?:more|here)\b/i, // Generic CTAs
      /\b(coming|under)\s+(?:soon|construction)\b/i, // Under construction indicators
    ];
    
    // If too many generic patterns, content might be low quality
    const genericMatches = uniquePatterns.reduce((count, pattern) => {
      return count + (text.match(pattern) || []).length;
    }, 0);
    
    // Allow some generic content but not too much
    return genericMatches < text.length / 100; // Less than 1% generic content
  };

  const checkMeaningfulContent = (text: string): boolean => {
    // Check for meaningful content indicators
    const meaningfulIndicators = [
      /\b\d{4}\b/, // Years (indicates timely content)
      /\b(?:CVE|vulnerability|security|threat|breach)\b/i, // Security terms
      /\b(?:technology|software|hardware|AI|machine learning)\b/i, // Tech terms
      /\b(?:game|gaming|esports|player|multiplayer)\b/i, // Gaming terms
      /\b(?:analysis|review|tutorial|guide|explanation)\b/i, // Content types
    ];
    
    const meaningfulMatches = meaningfulIndicators.some(pattern => 
      pattern.test(text)
    );
    
    // Check sentence structure (multiple sentences indicate substantial content)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const hasMultipleSentences = sentences.length >= 3;
    
    return meaningfulMatches && hasMultipleSentences;
  };

  // Development overlay for content quality debugging
  if (import.meta.env.DEV) {
    return (
      <>
        {children}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
          <div>Word Count: {wordCount}</div>
          <div>Quality Content: {hasQualityContent ? '✅' : '❌'}</div>
          <div>Min Required: 300 words</div>
          {wordCount < 300 && (
            <div className="text-yellow-400 mt-1">
              Add {300 - wordCount} more words for ads
            </div>
          )}
        </div>
      </>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to check content quality for ad placement
 */
export function useContentQuality() {
  const [hasQualityContent, setHasQualityContent] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleContentQualityChange = (hasQuality: boolean, count: number) => {
    setHasQualityContent(hasQuality);
    setWordCount(count);
  };

  return {
    hasQualityContent,
    wordCount,
    handleContentQualityChange,
    ContentQualityChecker: (props: Omit<ContentQualityCheckerProps, 'onContentQualityChange'>) => (
      <ContentQualityChecker {...props} onContentQualityChange={handleContentQualityChange} />
    )
  };
}

/**
 * Higher-order component that wraps pages with content quality checking
 */
export function withContentQualityCheck<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ContentQualityWrappedComponent(props: P) {
    const { ContentQualityChecker } = useContentQuality();
    
    return (
      <ContentQualityChecker>
        <Component {...props} />
      </ContentQualityChecker>
    );
  };
}
