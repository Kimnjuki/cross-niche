import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { LoadingState } from "@/components/LoadingState";

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const content = useQuery(api.content.getContentBySlug, { slug: slug! });
  const incrementView = useMutation(api.content.incrementViewCount);
  
  useEffect(() => {
    if (content?._id) {
      incrementView({ contentId: content._id });
    }
  }, [content?._id]);
  
  if (content === undefined) {
    return <LoadingState />;
  }
  
  if (content === null) {
    return <div>Article not found</div>;
  }
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {content.featuredImageUrl && (
        <img
          src={content.featuredImageUrl}
          alt={content.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
        
        {content.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{content.subtitle}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {content.publishedAt && (
            <span>
              {new Date(content.publishedAt).toLocaleDateString()}
            </span>
          )}
          {content.estimatedReadingTimeMinutes && (
            <span>{content.estimatedReadingTimeMinutes} min read</span>
          )}
          {content.viewCount && (
            <span>{content.viewCount.toLocaleString()} views</span>
          )}
        </div>
        
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {(content.tags as any[]).map((tag: any) => (
              <span
                key={tag._id || tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag.name || tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
      
      {(content as any).media && (content as any).media.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {(content as any).media.map((media: any) => (
            <img
              key={media._id}
              src={media.url}
              alt={media.altText || ""}
              className="rounded-lg"
            />
          ))}
        </div>
      )}
    </article>
  );
}
