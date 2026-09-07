import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as postsService from "../services/posts";

export const postKeys = {
  all: ["posts"],
  feed: (params) => [...postKeys.all, "feed", params],
  lists: () => [...postKeys.all, "list"],
  list: (params) => [...postKeys.lists(), params],
  detail: (id) => [...postKeys.all, "detail", id],
  comments: (id, params) => [...postKeys.all, "comments", id, params],
};

export function useFeed(params = {}, options = {}) {
  return useQuery({
    queryKey: postKeys.feed(params),
    queryFn: () => postsService.getFeed(params),
    ...options,
  });
}

export function useInfiniteFeed(params = {}, options = {}) {
  return useInfiniteQuery({
    queryKey: [...postKeys.all, "infinite-feed", params],
    queryFn: ({ pageParam = 1 }) =>
      postsService.getFeed({
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

export function usePosts(params = {}, options = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsService.getPosts(params),
    ...options,
  });
}

export function usePost(id, options = {}) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsService.getPost(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function usePostComments(id, params = {}, options = {}) {
  return useQuery({
    queryKey: postKeys.comments(id, params),
    queryFn: () => postsService.getComments(id, params),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function usePostActions() {
  const queryClient = useQueryClient();

  const invalidatePost = (id) => {
    queryClient.invalidateQueries({
      queryKey: postKeys.all,
    });

    if (id) {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(id),
      });
    }
  };

  const createPost = useMutation({
    mutationFn: postsService.createPost,
    onSuccess: invalidatePost,
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => postsService.updatePost(id, data),
    onSuccess: (_, variables) => invalidatePost(variables.id),
  });

  const deletePost = useMutation({
    mutationFn: postsService.deletePost,
    onSuccess: invalidatePost,
  });

  const reactToPost = useMutation({
    mutationFn: ({ id, reaction }) => postsService.reactToPost(id, reaction),
    onSuccess: (_, variables) => invalidatePost(variables.id),
  });

  const removePostReaction = useMutation({
    mutationFn: postsService.removePostReaction,
    onSuccess: invalidatePost,
  });

  const savePost = useMutation({
    mutationFn: postsService.savePost,
    onSuccess: invalidatePost,
  });

  const unsavePost = useMutation({
    mutationFn: postsService.unsavePost,
    onSuccess: invalidatePost,
  });

  const repostPost = useMutation({
    mutationFn: ({ id, data }) => postsService.repostPost(id, data),
    onSuccess: (_, variables) => invalidatePost(variables.id),
  });

  const removeRepost = useMutation({
    mutationFn: postsService.removeRepost,
    onSuccess: invalidatePost,
  });

  const sharePost = useMutation({
    mutationFn: ({ id, data }) => postsService.sharePost(id, data),
  });

  const addComment = useMutation({
    mutationFn: ({ id, content, parentId }) =>
      postsService.addComment(id, content, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.comments(variables.id),
      });
      invalidatePost(variables.id);
    },
  });

  const updateComment = useMutation({
    mutationFn: ({ postId, commentId, content }) =>
      postsService.updateComment(postId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.comments(variables.postId),
      });
    },
  });

  const deleteComment = useMutation({
    mutationFn: ({ postId, commentId }) =>
      postsService.deleteComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.comments(variables.postId),
      });
    },
  });

  return {
    createPost: createPost.mutateAsync,
    updatePost: updatePost.mutateAsync,
    deletePost: deletePost.mutateAsync,
    reactToPost: reactToPost.mutateAsync,
    removePostReaction: removePostReaction.mutateAsync,
    savePost: savePost.mutateAsync,
    unsavePost: unsavePost.mutateAsync,
    repostPost: repostPost.mutateAsync,
    removeRepost: removeRepost.mutateAsync,
    sharePost: sharePost.mutateAsync,
    addComment: addComment.mutateAsync,
    updateComment: updateComment.mutateAsync,
    deleteComment: deleteComment.mutateAsync,

    isCreating: createPost.isPending,
    isUpdating: updatePost.isPending,
    isDeleting: deletePost.isPending,
    isReacting: reactToPost.isPending,
    isCommenting: addComment.isPending,
  };
}

export default {
  useFeed,
  useInfiniteFeed,
  usePosts,
  usePost,
  usePostComments,
  usePostActions,
};
