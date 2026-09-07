import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as chatsService from "../services/chats";

export const chatKeys = {
  all: ["chats"],
  lists: () => [...chatKeys.all, "list"],
  list: (params) => [...chatKeys.lists(), params],
  detail: (id) => [...chatKeys.all, "detail", id],
  messages: (id, params = {}) => [...chatKeys.all, "messages", id, params],
};

export function useChats(params = {}, options = {}) {
  return useQuery({
    queryKey: chatKeys.list(params),
    queryFn: () => chatsService.getChats(params),
    ...options,
  });
}

export function useChat(id, options = {}) {
  return useQuery({
    queryKey: chatKeys.detail(id),
    queryFn: () => chatsService.getChat(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useMessages(chatId, params = {}, options = {}) {
  return useQuery({
    queryKey: chatKeys.messages(chatId, params),
    queryFn: () => chatsService.getMessages(chatId, params),
    enabled: Boolean(chatId) && options.enabled !== false,
    ...options,
  });
}

export function useInfiniteMessages(chatId, params = {}, options = {}) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(chatId, {
      ...params,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      chatsService.getMessages(chatId, {
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
    enabled: Boolean(chatId) && options.enabled !== false,
    ...options,
  });
}

export function useChatActions() {
  const queryClient = useQueryClient();

  const invalidateChats = () => {
    queryClient.invalidateQueries({
      queryKey: chatKeys.all,
    });
  };

  const createChat = useMutation({
    mutationFn: chatsService.createChat,
    onSuccess: invalidateChats,
  });

  const deleteChat = useMutation({
    mutationFn: chatsService.deleteChat,
    onSuccess: invalidateChats,
  });

  const sendMessage = useMutation({
    mutationFn: ({ chatId, data }) => chatsService.sendMessage(chatId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });

      queryClient.invalidateQueries({
        queryKey: chatKeys.detail(variables.chatId),
      });

      queryClient.invalidateQueries({
        queryKey: chatKeys.lists(),
      });
    },
  });

  const editMessage = useMutation({
    mutationFn: ({ chatId, messageId, content }) =>
      chatsService.editMessage(chatId, messageId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: ({ chatId, messageId, forEveryone }) =>
      chatsService.deleteMessage(chatId, messageId, forEveryone),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });
    },
  });

  const reactToMessage = useMutation({
    mutationFn: ({ chatId, messageId, reaction }) =>
      chatsService.reactToMessage(chatId, messageId, reaction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });
    },
  });

  const markChatAsRead = useMutation({
    mutationFn: chatsService.markChatAsRead,
    onSuccess: invalidateChats,
  });

  const muteChat = useMutation({
    mutationFn: ({ id, muted }) => chatsService.muteChat(id, muted),
    onSuccess: invalidateChats,
  });

  const archiveChat = useMutation({
    mutationFn: ({ id, archived }) => chatsService.archiveChat(id, archived),
    onSuccess: invalidateChats,
  });

  return {
    createChat: createChat.mutateAsync,
    deleteChat: deleteChat.mutateAsync,
    sendMessage: sendMessage.mutateAsync,
    editMessage: editMessage.mutateAsync,
    deleteMessage: deleteMessage.mutateAsync,
    reactToMessage: reactToMessage.mutateAsync,
    markChatAsRead: markChatAsRead.mutateAsync,
    muteChat: muteChat.mutateAsync,
    archiveChat: archiveChat.mutateAsync,

    isCreating: createChat.isPending,
    isDeleting: deleteChat.isPending,
    isSending: sendMessage.isPending,
    isEditing: editMessage.isPending,
    isDeletingMessage: deleteMessage.isPending,
  };
}

export default {
  useChats,
  useChat,
  useMessages,
  useInfiniteMessages,
  useChatActions,
};
