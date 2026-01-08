import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Comment } from '@/types';
import { Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useLocalStorage<Comment[]>(`comments-${articleId}`, []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const comment: Comment = {
      id: crypto.randomUUID(),
      articleId,
      userId: user.id,
      userName: user.name,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-display font-semibold text-xl">
          Comments ({comments.length})
        </h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-muted-foreground mb-2">Sign in to join the discussion</p>
          <Button asChild variant="outline">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{comment.userName}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              </div>
              <p className="text-foreground mb-3">{comment.content}</p>
              <button
                onClick={() => handleLike(comment.id)}
                className={cn(
                  'flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors'
                )}
              >
                <Heart className="h-4 w-4" />
                {comment.likes}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
