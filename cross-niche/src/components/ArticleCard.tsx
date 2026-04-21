import { Calendar, Clock, Eye } from "lucide-react";

interface ArticleCardProps {
  content: any;
  featured?: boolean;
}

export function ArticleCard({ content, featured = false }: ArticleCardProps) {
  return (
    <article className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
      featured ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    }`}>
      {content.featuredImageUrl && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={content.featuredImageUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          {featured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">
              FEATURED
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          {content.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
            </div>
          )}
          {content.estimatedReadingTimeMinutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{content.estimatedReadingTimeMinutes} min read</span>
            </div>
          )}
          {content.viewCount && (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{content.viewCount.toLocaleString()} views</span>
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        {content.summary && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {content.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {content.tags.slice(0, 3).map((tag: any) => (
                <span
                  key={tag._id || tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag.name || tag}
                </span>
              ))}
              {content.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{content.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <a
            href={`/content/${content.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read more →
          </a>
        </div>
      </div>
    </article>
  );
}
