import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "../services/auth";

export const authKeys = {
  all: ["auth"],
  currentUser: () => [...authKeys.all, "current-user"],
};

export function useAuth() {
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(authKeys.currentUser(), data.user);
      } else {
        queryClient.invalidateQueries({
          queryKey: authKeys.currentUser(),
        });
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(authKeys.currentUser(), data.user);
      } else {
        queryClient.invalidateQueries({
          queryKey: authKeys.currentUser(),
        });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user: currentUserQuery.data,
    isLoading: currentUserQuery.isLoading,
    isFetching: currentUserQuery.isFetching,
    isAuthenticated: Boolean(currentUserQuery.data),

    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    error: currentUserQuery.error,

    refetchUser: currentUserQuery.refetch,
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: authService.signup,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authService.getCurrentUser,
    retry: false,
    ...options,
  });
}

export default useAuth;
