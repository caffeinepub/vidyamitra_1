import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Resume, LearningPlan, Quiz, InterviewFeedback, LearningProgress, CareerGoal, WeekPlan } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerResumes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Resume[]>({
    queryKey: ['callerResumes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerResumes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, file }: { name: string; file: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.uploadResume(name, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerResumes'] });
    },
  });
}

export function useGetCallerLearningPlan() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LearningPlan | null>({
    queryKey: ['callerLearningPlan'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerLearningPlan();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateLearningPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: WeekPlan[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createLearningPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerLearningPlan'] });
    },
  });
}

export function useMarkTaskComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.markTaskComplete(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerLearningPlan'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}

export function useSaveQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quiz: Quiz) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveQuizResults(quiz);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizResults'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}

export function useGetQuizResults() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Quiz | null>({
    queryKey: ['quizResults'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.getQuizResults(principal);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useSaveInterviewFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: InterviewFeedback) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveInterviewFeedback(feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviewFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}

export function useGetInterviewFeedback() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<InterviewFeedback | null>({
    queryKey: ['interviewFeedback'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.getInterviewFeedback(principal);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetUserProgress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<LearningProgress | null>({
    queryKey: ['userProgress'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.getUserProgress(principal);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useSaveLearningProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: LearningProgress) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveLearningProgress(progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}

export function useSetCareerGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: CareerGoal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setCareerGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerGoal'] });
    },
  });
}

export function useGetCareerGoal() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CareerGoal | null>({
    queryKey: ['careerGoal'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.getCareerGoal(principal);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
