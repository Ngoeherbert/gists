import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as reelsService from "../services/reels";

export const reelKeys = {
  all: ["reels"],
  list: (params) => [...reelKeys.all, "list", params],
  detail: (id) => [...reelKeys.all, "detail", id],
  comments: (id, params) => [...reelKeys.all, "comments", id, params],
};

export function useReels(params = {}, options = {}) {
  return useQuery({
    queryKey: reelKeys.list(params),
    queryFn: () => reelsService.getReels(params),
    ...options,
  });
}

export function useInfiniteReels(params = {}, options = {}) {
  return useInfiniteQuery({
    queryKey: [...reelKeys.all, "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      reelsService.getReels({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.nextPage) {
        return lastPage.nextPage;
      }

      if (lastPage?.hasNextPage) {
        return allPages.length + 1;
      }

      return undefined;
    },
    ...options,
  });
}

export function useReel(id, options = {}) {
  return useQuery({
    queryKey: reelKeys.detail(id),
    queryFn: () => reelsService.getReel(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useReelComments(id, params = {}, options = {}) {
  return useQuery({
    queryKey: reelKeys.comments(id, params),
    queryFn: () => reelsService.getReelComments(id, params),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useReelActions() {
  const queryClient = useQueryClient();

  const invalidate = (id) => {
    queryClient.invalidateQueries({
      queryKey: reelKeys.all,
    });

    if (id) {
      queryClient.invalidateQueries({
        queryKey: reelKeys.detail(id),
      });
    }
  };

  const createReel = useMutation({
    mutationFn: reelsService.createReel,
    onSuccess: invalidate,
  });

  const updateReel = useMutation({
    mutationFn: ({ id, data }) => reelsService.updateReel(id, data),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const deleteReel = useMutation({
    mutationFn: reelsService.deleteReel,
    onSuccess: invalidate,
  });

  const reactToReel = useMutation({
    mutationFn: ({ id, reaction }) => reelsService.reactToReel(id, reaction),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const removeReelReaction = useMutation({
    mutationFn: reelsService.removeReelReaction,
    onSuccess: invalidate,
  });

  const saveReel = useMutation({
    mutationFn: reelsService.saveReel,
    onSuccess: invalidate,
  });

  const unsaveReel = useMutation({
    mutationFn: reelsService.unsaveReel,
    onSuccess: invalidate,
  });

  const shareReel = useMutation({
    mutationFn: ({ id, data }) => reelsService.shareReel(id, data),
  });

  const repostReel = useMutation({
    mutationFn: ({ id, data }) => reelsService.repostReel(id, data),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const addReelComment = useMutation({
    mutationFn: ({ id, content, parentId }) =>
      reelsService.addReelComment(id, content, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reelKeys.comments(variables.id),
      });

      invalidate(variables.id);
    },
  });

  const deleteReelComment = useMutation({
    mutationFn: ({ reelId, commentId }) =>
      reelsService.deleteReelComment(reelId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reelKeys.comments(variables.reelId),
      });
    },
  });

  const recordReelView = useMutation({
    mutationFn: reelsService.recordReelView,
  });

  return {
    createReel: createReel.mutateAsync,
    updateReel: updateReel.mutateAsync,
    deleteReel: deleteReel.mutateAsync,
    reactToReel: reactToReel.mutateAsync,
    removeReelReaction: removeReelReaction.mutateAsync,
    saveReel: saveReel.mutateAsync,
    unsaveReel: unsaveReel.mutateAsync,
    shareReel: shareReel.mutateAsync,
    repostReel: repostReel.mutateAsync,
    addReelComment: addReelComment.mutateAsync,
    deleteReelComment: deleteReelComment.mutateAsync,
    recordReelView: recordReelView.mutateAsync,

    isCreating: createReel.isPending,
    isUpdating: updateReel.isPending,
    isDeleting: deleteReel.isPending,
    isReacting: reactToReel.isPending,
    isCommenting: addReelComment.isPending,
  };
}

export default {
  useReels,
  useInfiniteReels,
  useReel,
  useReelComments,
  useReelActions,
};
