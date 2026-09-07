import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as roomsService from "../services/rooms";

export const roomKeys = {
  all: ["rooms"],
  list: (params) => [...roomKeys.all, "list", params],
  detail: (id) => [...roomKeys.all, "detail", id],
  members: (id, params) => [...roomKeys.all, "members", id, params],
  messages: (id, params) => [...roomKeys.all, "messages", id, params],
};

export function useRooms(params = {}, options = {}) {
  return useQuery({
    queryKey: roomKeys.list(params),
    queryFn: () => roomsService.getRooms(params),
    ...options,
  });
}

export function useRoom(id, options = {}) {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: () => roomsService.getRoom(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useRoomMembers(id, params = {}, options = {}) {
  return useQuery({
    queryKey: roomKeys.members(id, params),
    queryFn: () => roomsService.getRoomMembers(id, params),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useRoomMessages(id, params = {}, options = {}) {
  return useQuery({
    queryKey: roomKeys.messages(id, params),
    queryFn: () => roomsService.getRoomMessages(id, params),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });
}

export function useRoomActions() {
  const queryClient = useQueryClient();

  const invalidateRoom = (id) => {
    queryClient.invalidateQueries({
      queryKey: roomKeys.all,
    });

    if (id) {
      queryClient.invalidateQueries({
        queryKey: roomKeys.detail(id),
      });
    }
  };

  const createRoom = useMutation({
    mutationFn: roomsService.createRoom,
    onSuccess: invalidateRoom,
  });

  const updateRoom = useMutation({
    mutationFn: ({ id, data }) => roomsService.updateRoom(id, data),
    onSuccess: (_, variables) => invalidateRoom(variables.id),
  });

  const deleteRoom = useMutation({
    mutationFn: roomsService.deleteRoom,
    onSuccess: invalidateRoom,
  });

  const joinRoom = useMutation({
    mutationFn: roomsService.joinRoom,
    onSuccess: invalidateRoom,
  });

  const leaveRoom = useMutation({
    mutationFn: roomsService.leaveRoom,
    onSuccess: invalidateRoom,
  });

  const addRoomMember = useMutation({
    mutationFn: ({ roomId, userId }) =>
      roomsService.addRoomMember(roomId, userId),
    onSuccess: (_, variables) => invalidateRoom(variables.roomId),
  });

  const removeRoomMember = useMutation({
    mutationFn: ({ roomId, userId }) =>
      roomsService.removeRoomMember(roomId, userId),
    onSuccess: (_, variables) => invalidateRoom(variables.roomId),
  });

  const updateRoomMemberRole = useMutation({
    mutationFn: ({ roomId, userId, role }) =>
      roomsService.updateRoomMemberRole(roomId, userId, role),
    onSuccess: (_, variables) => invalidateRoom(variables.roomId),
  });

  const sendRoomMessage = useMutation({
    mutationFn: ({ roomId, data }) =>
      roomsService.sendRoomMessage(roomId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roomKeys.messages(variables.roomId),
      });
    },
  });

  const updateRoomSettings = useMutation({
    mutationFn: ({ roomId, data }) =>
      roomsService.updateRoomSettings(roomId, data),
    onSuccess: (_, variables) => invalidateRoom(variables.roomId),
  });

  const inviteToRoom = useMutation({
    mutationFn: ({ roomId, userIds }) =>
      roomsService.inviteToRoom(roomId, userIds),
    onSuccess: (_, variables) => invalidateRoom(variables.roomId),
  });

  return {
    createRoom: createRoom.mutateAsync,
    updateRoom: updateRoom.mutateAsync,
    deleteRoom: deleteRoom.mutateAsync,
    joinRoom: joinRoom.mutateAsync,
    leaveRoom: leaveRoom.mutateAsync,
    addRoomMember: addRoomMember.mutateAsync,
    removeRoomMember: removeRoomMember.mutateAsync,
    updateRoomMemberRole: updateRoomMemberRole.mutateAsync,
    sendRoomMessage: sendRoomMessage.mutateAsync,
    updateRoomSettings: updateRoomSettings.mutateAsync,
    inviteToRoom: inviteToRoom.mutateAsync,

    isCreating: createRoom.isPending,
    isUpdating: updateRoom.isPending,
    isDeleting: deleteRoom.isPending,
    isJoining: joinRoom.isPending,
    isLeaving: leaveRoom.isPending,
    isSending: sendRoomMessage.isPending,
  };
}

export default {
  useRooms,
  useRoom,
  useRoomMembers,
  useRoomMessages,
  useRoomActions,
};
