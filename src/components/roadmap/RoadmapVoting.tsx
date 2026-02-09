/**
 * Roadmap Feature Voting Component
 * Allows users to upvote/downvote roadmap features
 */

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useConvexDisabled } from '@/components/SafeConvexProvider';

interface RoadmapVotingProps {
  featureId: string;
  className?: string;
}

export function RoadmapVoting({ featureId, className }: RoadmapVotingProps) {
  const { user } = useAuth();
  const isConvexDisabled = useConvexDisabled();
  const userId = user?.id || `session-${localStorage.getItem('sessionId') || 'anonymous'}`;
  
  const votes = !isConvexDisabled 
    ? useQuery(api.roadmapVotes.getFeatureVotes, { featureId })
    : null;
  const userVote = !isConvexDisabled
    ? useQuery(api.roadmapVotes.getUserVote, { featureId, userId })
    : null;
  const voteMutation = !isConvexDisabled
    ? useMutation(api.roadmapVotes.vote)
    : null;

  const [isVoting, setIsVoting] = useState(false);

  // Initialize session ID if needed
  useEffect(() => {
    if (!localStorage.getItem('sessionId')) {
      localStorage.setItem('sessionId', `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!voteMutation || isConvexDisabled) {
      return;
    }
    setIsVoting(true);
    try {
      await voteMutation({
        featureId,
        userId,
        voteType,
      });
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const upvoted = userVote === 'upvote';
  const downvoted = userVote === 'downvote';

  // Show disabled state if Convex is not available
  if (isConvexDisabled) {
    return (
      <div className={cn('flex items-center gap-2 opacity-50', className)}>
        <Button variant="outline" size="sm" disabled className="gap-1.5">
          <ThumbsUp className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Button>
        <Button variant="outline" size="sm" disabled className="gap-1.5">
          <ThumbsDown className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant={upvoted ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote('upvote')}
        disabled={isVoting || !voteMutation}
        className={cn(
          'gap-1.5',
          upvoted && 'bg-green-600 hover:bg-green-700'
        )}
      >
        <ThumbsUp className={cn('h-4 w-4', upvoted && 'fill-white')} />
        <span className="font-semibold">{votes?.upvotes || 0}</span>
      </Button>
      
      <Button
        variant={downvoted ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote('downvote')}
        disabled={isVoting || !voteMutation}
        className={cn(
          'gap-1.5',
          downvoted && 'bg-red-600 hover:bg-red-700'
        )}
      >
        <ThumbsDown className={cn('h-4 w-4', downvoted && 'fill-white')} />
        <span className="font-semibold">{votes?.downvotes || 0}</span>
      </Button>

      {votes && votes.netVotes !== 0 && (
        <span className={cn(
          'text-sm font-medium',
          votes.netVotes > 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {votes.netVotes > 0 ? '+' : ''}{votes.netVotes}
        </span>
      )}
    </div>
  );
}
