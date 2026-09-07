import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as profilesService from "../services/profiles";

export const profileKeys = {
  all: ["profiles"],
  me: () => [...profileKeys.all, "me"],
  detail: (username) => [...profileKeys.all, "detail", username],
  followers: (userId, params) => [
    ...profileKeys.all,
    "followers",
    userId,
    params,
  ],
  following: (userId, params) => [
    ...profileKeys.all,
    "following",
    userId,
    params,
  ],
  posts: (userId, params) => [...profileKeys.all, "posts", userId, params],
  reels: (userId, params) => [...profileKeys.all, "reels", userId, params],
  stats: (userId) => [...profileKeys.all, "stats", userId],
  search: (query, params) => [...profileKeys.all, "search", query, params],
};

export function useMyProfile(options = {}) {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: profilesService.getMyProfile,
    ...options,
  });
}

export function useProfile(username, options = {}) {
  return useQuery({
    queryKey: profileKeys.detail(username),
    queryFn: () => profilesService.getProfile(username),
    enabled: Boolean(username) && options.enabled !== false,
    ...options,
  });
}

export function useFollowers(userId, params = {}, options = {}) {
  return useQuery({
    queryKey: profileKeys.followers(userId, params),
    queryFn: () => profilesService.getFollowers(userId, params),
    enabled: Boolean(userId) && options.enabled !== false,
    ...options,
  });
}

export function useFollowing(userId, params = {}, options = {}) {
  return useQuery({
    queryKey: profileKeys.following(userId, params),
    queryFn: () => profilesService.getFollowing(userId, params),
    enabled: Boolean(userId) && options.enabled !== false,
    ...options,
  });
}

export function useUserPosts(userId, params = {}, options = {}) {
  return useQuery({
    queryKey: profileKeys.posts(userId, params),
    queryFn: () => profilesService.getUserPosts(userId, params),
    enabled: Boolean(userId) && options.enabled !== false,
    ...options,
  });
}

export function useUserReels(userId, params = {}, options = {}) {
  return useQuery({
    queryKey: profileKeys.reels(userId, params),
    queryFn: () => profilesService.getUserReels(userId, params),
    enabled: Boolean(userId) && options.enabled !== false,
    ...options,
  });
}

export function useUserStats(userId, options = {}) {
  return useQuery({
    queryKey: profileKeys.stats(userId),
    queryFn: () => profilesService.getUserStats(userId),
    enabled: Boolean(userId) && options.enabled !== false,
    ...options,
  });
}

export function useSearchUsers(query, params = {}, options = {}) {
  return useQuery({
    queryKey: profileKeys.search(query, params),
    queryFn: () => profilesService.searchUsers(query, params),
    enabled: Boolean(query) && options.enabled !== false,
    ...options,
  });
}

export function useProfileActions() {
  const queryClient = useQueryClient();

  const invalidateProfiles = () => {
    queryClient.invalidateQueries({
      queryKey: profileKeys.all,
    });
  };

  const updateProfile = useMutation({
    mutationFn: profilesService.updateProfile,
    onSuccess: invalidateProfiles,
  });

  const updateProfilePhoto = useMutation({
    mutationFn: profilesService.updateProfilePhoto,
    onSuccess: invalidateProfiles,
  });

  const followUser = useMutation({
    mutationFn: profilesService.followUser,
    onSuccess: invalidateProfiles,
  });

  const unfollowUser = useMutation({
    mutationFn: profilesService.unfollowUser,
    onSuccess: invalidateProfiles,
  });

  const blockUser = useMutation({
    mutationFn: profilesService.blockUser,
    onSuccess: invalidateProfiles,
  });

  const unblockUser = useMutation({
    mutationFn: profilesService.unblockUser,
    onSuccess: invalidateProfiles,
  });

  const reportUser = useMutation({
    mutationFn: ({ userId, reason }) =>
      profilesService.reportUser(userId, reason),
  });

  return {
    updateProfile: updateProfile.mutateAsync,
    updateProfilePhoto: updateProfilePhoto.mutateAsync,
    followUser: followUser.mutateAsync,
    unfollowUser: unfollowUser.mutateAsync,
    blockUser: blockUser.mutateAsync,
    unblockUser: unblockUser.mutateAsync,
    reportUser: reportUser.mutateAsync,

    isUpdating: updateProfile.isPending,
    isUploadingPhoto: updateProfilePhoto.isPending,
    isFollowing: followUser.isPending,
    isUnfollowing: unfollowUser.isPending,
  };
}

export default {
  useMyProfile,
  useProfile,
  useFollowers,
  useFollowing,
  useUserPosts,
  useUserReels,
  useUserStats,
  useSearchUsers,
  useProfileActions,
};
