import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as callsService from "../services/calls";

export const callKeys = {
  all: ["calls"],
  lists: () => [...callKeys.all, "list"],
  history: (params) => [...callKeys.lists(), "history", params],
  detail: (id) => [...callKeys.all, "detail", id],
  token: (id) => [...callKeys.all, "token", id],
};

export function useCall(id, options = {}) {
  return useQuery({
    queryKey: callKeys.detail(id),
    queryFn: () => callsService.getCall(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useCallHistory(params = {}, options = {}) {
  return useQuery({
    queryKey: callKeys.history(params),
    queryFn: () => callsService.getCallHistory(params),
    ...options,
  });
}

export function useCallActions() {
  const queryClient = useQueryClient();

  const invalidate = (id) => {
    queryClient.invalidateQueries({
      queryKey: callKeys.all,
    });

    if (id) {
      queryClient.invalidateQueries({
        queryKey: callKeys.detail(id),
      });
    }
  };

  const startCall = useMutation({
    mutationFn: callsService.startCall,
    onSuccess: () => invalidate(),
  });

  const acceptCall = useMutation({
    mutationFn: callsService.acceptCall,
    onSuccess: (_, id) => invalidate(id),
  });

  const declineCall = useMutation({
    mutationFn: callsService.declineCall,
    onSuccess: (_, id) => invalidate(id),
  });

  const endCall = useMutation({
    mutationFn: callsService.endCall,
    onSuccess: (_, id) => invalidate(id),
  });

  const cancelCall = useMutation({
    mutationFn: callsService.cancelCall,
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    startCall: startCall.mutateAsync,
    acceptCall: acceptCall.mutateAsync,
    declineCall: declineCall.mutateAsync,
    endCall: endCall.mutateAsync,
    cancelCall: cancelCall.mutateAsync,

    isStarting: startCall.isPending,
    isAccepting: acceptCall.isPending,
    isDeclining: declineCall.isPending,
    isEnding: endCall.isPending,
    isCancelling: cancelCall.isPending,
  };
}

export function useCallToken(id, options = {}) {
  return useQuery({
    queryKey: callKeys.token(id),
    queryFn: () => callsService.getCallToken(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export default {
  useCall,
  useCallHistory,
  useCallActions,
  useCallToken,
};
