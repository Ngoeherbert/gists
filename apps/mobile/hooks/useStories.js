import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as storiesService from "../services/stories";

export const storyKeys = {
  all: ["stories"],
  list: (params) => [...storyKeys.all, "list", params],
  detail: (id) => [...storyKeys.all, "detail", id],
  viewers: (id, params) => [...storyKeys.all, "viewers", id, params],
};

export function useStories(params = {}, options = {}) {
  return useQuery({
    queryKey: storyKeys.list(params),
    queryFn: () => storiesService.getStories(params),
    ...options,
  });
}

export function useStory(id, options = {}) {
  return useQuery({
    queryKey: storyKeys.detail(id),
    queryFn: () => storiesService.getStory(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useStoryViewers(id, params = {}, options = {}) {
  return useQuery({
    queryKey: storyKeys.viewers(id, params),
    queryFn: () => storiesService.getStoryViewers(id, params),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useStoryActions() {
  const queryClient = useQueryClient();

  const invalidate = (id) => {
    queryClient.invalidateQueries({
      queryKey: storyKeys.all,
    });

    if (id) {
      queryClient.invalidateQueries({
        queryKey: storyKeys.detail(id),
      });
    }
  };

  const createStory = useMutation({
    mutationFn: storiesService.createStory,
    onSuccess: invalidate,
  });

  const updateStory = useMutation({
    mutationFn: ({ id, data }) => storiesService.updateStory(id, data),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const deleteStory = useMutation({
    mutationFn: storiesService.deleteStory,
    onSuccess: invalidate,
  });

  const markStoryViewed = useMutation({
    mutationFn: storiesService.markStoryViewed,
    onSuccess: invalidate,
  });

  const reactToStory = useMutation({
    mutationFn: ({ id, reaction }) => storiesService.reactToStory(id, reaction),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const replyToStory = useMutation({
    mutationFn: ({ id, content }) => storiesService.replyToStory(id, content),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const shareStory = useMutation({
    mutationFn: ({ id, data }) => storiesService.shareStory(id, data),
  });

  return {
    createStory: createStory.mutateAsync,
    updateStory: updateStory.mutateAsync,
    deleteStory: deleteStory.mutateAsync,
    markStoryViewed: markStoryViewed.mutateAsync,
    reactToStory: reactToStory.mutateAsync,
    replyToStory: replyToStory.mutateAsync,
    shareStory: shareStory.mutateAsync,

    isCreating: createStory.isPending,
    isUpdating: updateStory.isPending,
    isDeleting: deleteStory.isPending,
    isReacting: reactToStory.isPending,
    isReplying: replyToStory.isPending,
  };
}

export default {
  useStories,
  useStory,
  useStoryViewers,
  useStoryActions,
};
