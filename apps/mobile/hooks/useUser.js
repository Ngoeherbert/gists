import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getStoredUser } from "../services/auth";
import { useMyProfile } from "./useProfile";

export const userKeys = {
  all: ["user"],
  current: () => [...userKeys.all, "current"],
};

export function useUser(options = {}) {
  const queryClient = useQueryClient();

  const storedUserQuery = useQuery({
    queryKey: userKeys.current(),
    queryFn: getStoredUser,
    staleTime: Infinity,
    ...options,
  });

  const profileQuery = useMyProfile({
    enabled: options.fetchProfile !== false,
  });

  useEffect(() => {
    if (profileQuery.data) {
      queryClient.setQueryData(userKeys.current(), profileQuery.data);
    }
  }, [profileQuery.data, queryClient]);

  const user = profileQuery.data || storedUserQuery.data;

  return {
    user,

    isLoading: storedUserQuery.isLoading || profileQuery.isLoading,

    isFetching: profileQuery.isFetching,

    error: profileQuery.error || storedUserQuery.error,

    refetch: async () => {
      const result = await profileQuery.refetch();

      if (result.data) {
        queryClient.setQueryData(userKeys.current(), result.data);
      }

      return result;
    },
  };
}

export function useCurrentUser() {
  return useUser();
}

export function useIsAuthenticated() {
  const { user, isLoading } = useUser({
    fetchProfile: false,
  });

  return {
    isAuthenticated: Boolean(user),
    isLoading,
  };
}

export function useUserId() {
  const { user } = useUser({
    fetchProfile: false,
  });

  return user?.id || null;
}

export default useUser;
