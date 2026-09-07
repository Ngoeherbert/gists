// apps/mobile/features/rooms/gameHelpers.js

export function getGameId(game) {
  return game?.id || game?.gameId || null;
}

export function getGameName(game) {
  return game?.name || game?.title || "Game";
}

export function getGameIcon(game) {
  return game?.icon || game?.image || game?.thumbnail || null;
}

export function getGameStatus(game) {
  return game?.status || "waiting";
}

export function isGameWaiting(game) {
  return getGameStatus(game) === "waiting";
}

export function isGameActive(game) {
  return getGameStatus(game) === "active";
}

export function isGameCompleted(game) {
  return getGameStatus(game) === "completed";
}

export function isGameCancelled(game) {
  return getGameStatus(game) === "cancelled";
}

export function getGamePlayers(game) {
  return Array.isArray(game?.players) ? game.players : [];
}

export function getGamePlayerCount(game) {
  return Number(game?.playersCount ?? getGamePlayers(game).length ?? 0);
}

export function getGameMaxPlayers(game) {
  return Number(game?.maxPlayers || game?.maxPlayersCount || 0);
}

export function isGameFull(game) {
  const maxPlayers = getGameMaxPlayers(game);

  return maxPlayers > 0 && getGamePlayerCount(game) >= maxPlayers;
}

export function isPlayerInGame(game, userId) {
  if (!userId) return false;

  return getGamePlayers(game).some(
    (player) => (player?.id || player?.userId) === userId,
  );
}

export function getGameHost(game) {
  return game?.host || game?.creator || null;
}

export function getGameHostId(game) {
  const host = getGameHost(game);

  return host?.id || host?.userId || game?.hostId || game?.creatorId || null;
}

export function isGameHost(game, userId) {
  return Boolean(userId && getGameHostId(game) === userId);
}

export function canJoinGame(game, userId) {
  if (!game || !userId) return false;
  if (isGameCompleted(game) || isGameCancelled(game)) return false;
  if (isPlayerInGame(game, userId)) return false;
  if (isGameFull(game)) return false;

  return true;
}

export function canLeaveGame(game, userId) {
  return Boolean(
    game && userId && isPlayerInGame(game, userId) && !isGameCompleted(game),
  );
}

export function sortGames(games = [], key = "createdAt") {
  return [...games].sort((a, b) => {
    const first = new Date(a?.[key] || 0).getTime();
    const second = new Date(b?.[key] || 0).getTime();

    return second - first;
  });
}

export default {
  getGameId,
  getGameName,
  getGameIcon,
  getGameStatus,
  isGameWaiting,
  isGameActive,
  isGameCompleted,
  isGameCancelled,
  getGamePlayers,
  getGamePlayerCount,
  getGameMaxPlayers,
  isGameFull,
  isPlayerInGame,
  getGameHost,
  getGameHostId,
  isGameHost,
  canJoinGame,
  canLeaveGame,
  sortGames,
};
