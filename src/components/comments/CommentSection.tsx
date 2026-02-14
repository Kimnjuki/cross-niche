import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Comment, CommentSortType, CommentReactionType, UserCommentStats } from '@/types';
import {
  Heart,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Flag,
  Edit,
  Trash,
  Reply,
  ChevronUp,
  ChevronDown,
  Shield,
  Award,
  Verified
} from 'lucide-react';
import { cn, safeRandomUUID } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  articleId: string;
}

const REACTION_EMOJIS: Record<CommentReactionType, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  angry: '😠',
  sad: '😢',
  surprise: '😮'
};

export function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useLocalStorage<Comment[]>(`comments-${articleId}`, []);
  const [userStats, setUserStats] = useLocalStorage<Record<string, UserCommentStats>>(`user-comment-stats`, {});
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [sortBy, setSortBy] = useState<CommentSortType>('best');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);

  // Calculate user reputation and stats
  useEffect(() => {
    const stats: Record<string, UserCommentStats> = {};
    comments.forEach(comment => {
      if (!stats[comment.userId]) {
        stats[comment.userId] = {
          userId: comment.userId,
          totalComments: 0,
          likesReceived: 0,
          reputation: 0,
          isVerified: false,
          isExpert: false,
          badges: []
        };
      }
      stats[comment.userId].totalComments++;
      stats[comment.userId].likesReceived += comment.likes;
      stats[comment.userId].reputation = stats[comment.userId].likesReceived * 2 + stats[comment.userId].totalComments;

      // Assign badges based on reputation
      if (stats[comment.userId].reputation > 100) stats[comment.userId].badges.push('Top Contributor');
      if (stats[comment.userId].reputation > 50) stats[comment.userId].badges.push('Active Member');
      if (comment.isExpert) stats[comment.userId].isExpert = true;
      if (comment.isVerified) stats[comment.userId].isVerified = true;
    });
    setUserStats(stats);
  }, [comments, setUserStats]);

  const calculateCommentScore = (comment: Comment): number => {
    const ageInHours = (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60 * 60);
    const score = comment.likes - comment.dislikes;
    // Wilson score confidence interval for ranking
    const n = comment.likes + comment.dislikes;
    if (n === 0) return 0;
    const z = 1.96; // 95% confidence
    const phat = comment.likes / n;
    return (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n);
  };

  const sortComments = (commentsToSort: Comment[]): Comment[] => {
    const sorted = [...commentsToSort].map(comment => ({
      ...comment,
      score: calculateCommentScore(comment)
    }));

    switch (sortBy) {
      case 'best':
        return sorted.sort((a, b) => b.score - a.score);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'controversial':
        return sorted.sort((a, b) => Math.abs(b.likes - b.dislikes) - Math.abs(a.likes - a.dislikes));
      default:
        return sorted;
    }
  };

  const getThreadedComments = (): Comment[] => {
    const rootComments = comments.filter(c => !c.parentId);
    return sortComments(rootComments);
  };

  const getReplies = (parentId: string): Comment[] => {
    return sortComments(comments.filter(c => c.parentId === parentId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const comment: Comment = {
      id: safeRandomUUID(),
      articleId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      score: 0,
      isEdited: false,
      isDeleted: false,
      replies: [],
      reactions: [],
      isReported: false,
      reportCount: 0,
      isModerated: false,
      userReputation: userStats[user.id]?.reputation || 0,
      isVerified: userStats[user.id]?.isVerified || false,
      isExpert: userStats[user.id]?.isExpert || false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Comment = {
      id: safeRandomUUID(),
      articleId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      score: 0,
      isEdited: false,
      isDeleted: false,
      parentId,
      replies: [],
      reactions: [],
      isReported: false,
      reportCount: 0,
      isModerated: false,
      userReputation: userStats[user.id]?.reputation || 0,
      isVerified: userStats[user.id]?.isVerified || false,
      isExpert: userStats[user.id]?.isExpert || false,
    };

    // Update parent comment's replies array
    setComments(prevComments => prevComments.map(c =>
      c.id === parentId
        ? { ...c, replies: [...c.replies, reply.id] }
        : c
    ));

    setComments(prev => [reply, ...prev]);
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    setComments(comments.map(c =>
      c.id === commentId
        ? {
            ...c,
            likes: voteType === 'up' ? c.likes + 1 : c.likes,
            dislikes: voteType === 'down' ? c.dislikes + 1 : c.dislikes,
            score: calculateCommentScore(c)
          }
        : c
    ));
  };

  const handleReaction = (commentId: string, reactionType: CommentReactionType) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const existingReactionIndex = c.reactions.findIndex(r => r.userId === user?.id && r.type === reactionType);
        const newReactions = [...c.reactions];

        if (existingReactionIndex >= 0) {
          // Remove reaction if it exists
          newReactions.splice(existingReactionIndex, 1);
        } else {
          // Add new reaction
          newReactions.push({
            userId: user!.id,
            type: reactionType,
            createdAt: new Date().toISOString()
          });
        }

        return { ...c, reactions: newReactions };
      }
      return c;
    }));
    setShowReactions(null);
  };

  const handleReport = (commentId: string) => {
    setComments(comments.map(c =>
      c.id === commentId
        ? { ...c, isReported: true, reportCount: c.reportCount + 1 }
        : c
    ));
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    setComments(comments.map(c =>
      c.id === commentId
        ? {
            ...c,
            content: editContent.trim(),
            isEdited: true,
            updatedAt: new Date().toISOString()
          }
        : c
    ));
    setEditingComment(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const replies = getReplies(comment.id);
    const userStat = userStats[comment.userId];
    const canModerate = user?.id === 'admin' || user?.id === comment.userId; // Simple moderation check

    return (
      <div className={cn('relative', depth > 0 && 'ml-6 border-l-2 border-muted pl-4')}>
        <div className="bg-card border border-border rounded-lg p-4 mb-2">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback>{comment.userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.userName}</span>
                {comment.isVerified && <Verified className="h-4 w-4 text-primary" />}
                {comment.isExpert && <Award className="h-4 w-4 text-yellow-500" />}
                {userStat?.reputation > 50 && (
                  <Badge variant="secondary" className="text-xs">
                    {userStat.reputation} rep
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDate(comment.createdAt)}</span>
              {comment.isEdited && <span>(edited)</span>}
            </div>
          </div>

          {/* Comment Content */}
          {editingComment === comment.id ? (
            <div className="space-y-2 mb-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(comment.id)}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-foreground mb-3 whitespace-pre-wrap">{comment.content}</div>
          )}

          {/* Reactions Display */}
          {comment.reactions.length > 0 && (
            <div className="flex gap-1 mb-3">
              {Object.entries(
                comment.reactions.reduce((acc, reaction) => {
                  acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                  return acc;
                }, {} as Record<CommentReactionType, number>)
              ).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {REACTION_EMOJIS[type as CommentReactionType]} {count}
                </Badge>
              ))}
            </div>
          )}

          {/* Comment Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, 'up')}
                className="h-8 px-2"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {comment.likes - comment.dislikes}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, 'down')}
                className="h-8 px-2"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(comment.id)}
                className="h-8 px-2"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="h-8 px-2"
              >
                <Reply className="h-4 w-4" />
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-80">
                  <DialogHeader>
                    <DialogTitle>Comment Actions</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {canModerate && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingComment(comment.id)}
                          className="w-full justify-start"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Comment
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReport(comment.id)}
                          className="w-full justify-start text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Comment
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReport(comment.id)}
                      className="w-full justify-start"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Report Comment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Reactions Picker */}
          {showReactions === comment.id && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex gap-2">
                {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(comment.id, type as CommentReactionType)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => handleReply(comment.id)}>
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="space-y-2">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const totalComments = comments.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-display font-semibold text-xl">
            Community Discussion ({totalComments})
          </h3>
        </div>

        {totalComments > 1 && (
          <Select value={sortBy} onValueChange={(value: CommentSortType) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Best</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="controversial">Controversial</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Community Guidelines</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Be respectful, stay on topic, and contribute meaningfully to the discussion.
              Check out our <Link to="/community-guidelines" className="underline">full guidelines</Link>.
            </p>
          </div>
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">Join the Conversation</h3>
          <p className="text-muted-foreground mb-4">Sign in to share your thoughts and engage with the community.</p>
          <Button asChild>
            <Link to="/auth">Sign In to Comment</Link>
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {totalComments === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No comments yet</h3>
            <p className="text-muted-foreground">Be the first to start the discussion!</p>
          </div>
        ) : (
          getThreadedComments().map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
