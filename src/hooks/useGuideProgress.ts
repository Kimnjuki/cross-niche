/**
 * Hook for tracking guide progress.
 */

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useMemo } from 'react';

function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  // Use session storage for anonymous users
  let userId = sessionStorage.getItem('nexus_user_id');
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('nexus_user_id', userId);
  }
  return userId;
}

export function useGuideProgress(guideId: string) {
  const isDisabled = useConvexDisabled();
  const userId = useMemo(() => getUserId(), []);
  const progress = useQuery(
    api.guides.getProgress,
    isDisabled || !guideId ? 'skip' : { userId, guideId: guideId as any }
  );

  const updateProgress = useMutation(api.guides.updateProgress);

  const markStepComplete = async (stepIndex: number, totalSteps: number) => {
    if (isDisabled || !guideId) return;
    const currentCompleted = progress?.completedSteps || [];
    const newCompleted = currentCompleted.includes(stepIndex)
      ? currentCompleted
      : [...currentCompleted, stepIndex];
    await updateProgress({
      userId,
      guideId: guideId as any,
      completedSteps: newCompleted,
    });
  };

  const completedSteps = progress?.completedSteps || [];
  
  return {
    completedSteps,
    markStepComplete,
    isLoading: !isDisabled && progress === undefined,
  };
}

export function useGuideProgressWithSteps(guideId: string, totalSteps: number) {
  const { completedSteps, markStepComplete, isLoading } = useGuideProgress(guideId);
  const progressPercent = totalSteps > 0
    ? Math.round((completedSteps.length / totalSteps) * 100)
    : 0;
  const isCompleted = totalSteps > 0 ? completedSteps.length >= totalSteps : false;

  return {
    completedSteps,
    progressPercent,
    isCompleted,
    markStepComplete,
    isLoading: !isDisabled && progress === undefined,
  };
}
