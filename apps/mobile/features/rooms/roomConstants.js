// apps/mobile/features/rooms/memberHelpers.js

export function getMemberId(member) {
  return member?.id || member?.userId || null;
}

export function getMemberName(member) {
  return (
    member?.displayName || member?.name || member?.username || "Gists User"
  );
}

export function getMemberUsername(member) {
  return member?.username || "";
}

export function getMemberAvatar(member) {
  return member?.avatar || member?.avatarUrl || null;
}

export function getMemberRole(member) {
  return member?.role || "member";
}

export function isMemberOwner(member) {
  return getMemberRole(member) === "owner";
}

export function isMemberAdmin(member) {
  const role = getMemberRole(member);

  return role === "admin" || role === "owner";
}

export function isMemberRegular(member) {
  return getMemberRole(member) === "member";
}

export function isMemberMuted(member) {
  return Boolean(member?.isMuted || member?.muted);
}

export function isMemberBanned(member) {
  return Boolean(member?.isBanned || member?.banned);
}

export function isOnline(member) {
  return Boolean(member?.isOnline || member?.online);
}

export function getMemberJoinedAt(member) {
  return member?.joinedAt || member?.createdAt || null;
}

export function getMemberLastSeen(member) {
  return member?.lastSeenAt || member?.lastSeen || null;
}

export function canManageMember(actor, target) {
  if (!actor || !target) return false;

  const actorRole = getMemberRole(actor);
  const targetRole = getMemberRole(target);

  if (actorRole === "owner") {
    return targetRole !== "owner";
  }

  if (actorRole === "admin") {
    return targetRole === "member";
  }

  return false;
}

export function canPromoteMember(actor, target) {
  return canManageMember(actor, target) && getMemberRole(target) === "member";
}

export function canDemoteMember(actor, target) {
  return canManageMember(actor, target) && getMemberRole(target) === "admin";
}

export function sortMembers(members = [], key = "displayName") {
  return [...members].sort((a, b) =>
    String(a?.[key] || "").localeCompare(String(b?.[key] || "")),
  );
}

export function filterMembers(members = [], query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();

  if (!normalizedQuery) return members;

  return members.filter((member) => {
    const name = getMemberName(member).toLowerCase();
    const username = getMemberUsername(member).toLowerCase();

    return name.includes(normalizedQuery) || username.includes(normalizedQuery);
  });
}

export function countMembersByRole(members = []) {
  return members.reduce(
    (counts, member) => {
      const role = getMemberRole(member);

      if (role === "owner") counts.owner += 1;
      else if (role === "admin") counts.admin += 1;
      else counts.member += 1;

      return counts;
    },
    {
      owner: 0,
      admin: 0,
      member: 0,
    },
  );
}

export default {
  getMemberId,
  getMemberName,
  getMemberUsername,
  getMemberAvatar,
  getMemberRole,
  isMemberOwner,
  isMemberAdmin,
  isMemberRegular,
  isMemberMuted,
  isMemberBanned,
  isOnline,
  getMemberJoinedAt,
  getMemberLastSeen,
  canManageMember,
  canPromoteMember,
  canDemoteMember,
  sortMembers,
  filterMembers,
  countMembersByRole,
};
